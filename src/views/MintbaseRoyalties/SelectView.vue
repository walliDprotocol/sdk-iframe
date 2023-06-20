<template>
  <v-container fill-height class="pt-0 align-content-start">
    <LoaderCircle :loading="loadingConnectAccount"></LoaderCircle>
    <v-container
      v-if="!loadingConnectAccount"
      fill-height
      class="pa-0 pt-7 align-content-space-between"
    >
      <v-row v-if="errorTwitterAccVerification" class="pt-8 d-flex justify-center">
        <ErrorState
          :error-type="errorType"
          :error-message="errorMessage"
          :selectedAccount="selectedAccount"
          :userData="userData"
        ></ErrorState>
      </v-row>
      <v-row v-else-if="successTwitterAccVerification" justify="center">
        <v-col cols="12" class="pt-16 d-flex justify-center">
          <v-img
            style="position: absolute; left: calc(50% - 66px)"
            contain
            max-width="48"
            max-height="48"
            :src="`/logos/${selectedAccount.IdName}.webp`"
          />
          <v-img
            contain
            max-width="41"
            max-height="46"
            :src="require('@/assets/icons/icon-check.webp')"
          />
        </v-col>
        <v-col cols="9" class="pt-5">
          <h1 class="title-h1 text-center">
            Success! Your account was verified and you have some royalties to claim!
          </h1>
        </v-col>
        <v-col cols="12">
          <p class="normal-text-p text-center">Proceed to get your wallet and access your funds.</p>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <h1 class="title-h1 text-center">Verify your social network account</h1>
        </v-col>
        <v-col cols="12" class="pt-5">
          <ConnectAccount
            :selectedAccount="selectedAccount"
            @errorMessage="errorMessage = $event"
            @allSelected="($event) => (allSelected = $event)"
          />
        </v-col>
      </v-row>
      <v-row class="pb-2">
        <v-col class="d-flex justify-end">
          <FormButton
            v-if="!successTwitterAccVerification"
            class="mr-4"
            :text="'Back'"
            :type="'back'"
            :disabled="loadingConnectAccount"
            @click="backStep"
          >
          </FormButton>
          <FormButton
            :text="successTwitterAccVerification ? 'Next' : 'Verify'"
            @click="connectAccount"
            :disabled="
              errorTwitterAccVerification ||
              errorType != null ||
              (!allSelected && !successTwitterAccVerification)
            "
            :loading="loadingConnectAccount"
          >
          </FormButton>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import FormButton from "@/components/FormButton";
import ConnectAccount from "@/components/ConnectAccount";
import ErrorState from "@/components/ErrorState";

import { mapGetters, mapState } from "vuex";

import { BigNumber } from "ethers";
import LoaderCircle from "@/components/LoaderCircle.vue";

export default {
  name: "SelectView",
  data() {
    return {
      step: 1,
      userData: {},
      redirectPath: "/royalties",
      selectedAccount: {},
      loadingConnectAccount: false,
      errorMessage: null,
      errorType: null,
      errorTwitterAccVerification: false,
      successTwitterAccVerification: false,
      errorsMessages: [
        (idName) => `It was not possible to verify ${idName} your account, please try again.`,
        "The account you connected to doesn't match the one identified in the NFT creator's post. Please confirm your account and try again.",
      ],
      allSelected: false,
    };
  },
  computed: {
    ...mapState(["selectedAccountId", "accountIds"]),
    ...mapState("royalty", ["nftData"]),
    ...mapGetters("near", ["nearAccountId"]),

    isDisabled() {
      return !!this.errorMessage || !this.selectedAccount?.options?.some((value) => value.state);
    },
  },
  methods: {
    async getSeedPhrase(accountId, uid) {
      const { seedphrase: seedPhrase } = await this.$store.dispatch("royalty/getSeedPhrase", {
        accountId,
        uid,
      });

      this.$store.commit("royalty/setSeedPhrase", seedPhrase);
      return seedPhrase;
    },

    async getBalance(accountId) {
      try {
        let { total: balance } = await this.$store.dispatch("near/getAccountBalanceUnconnected", {
          accountId,
        });

        const balanceBN = BigNumber.from(balance);
        const minimumBN = BigNumber.from("100000000000000000");

        console.log("getAccountBalanceUnconnected", balance, balanceBN.lt(minimumBN));
        if (balanceBN.lt(minimumBN)) {
          return false;
        }
        return true;
      } catch (error) {
        console.log("getBalance", error?.message || error);
        this.errorMessage = error?.message;
        return false;
      }
    },

    async getWalletAccess() {
      await this.$store.dispatch("near/initNear");

      const { accountId: implicitAccountId } = await this.$store.dispatch("royalty/createAccount", {
        uid: this.userData.id,
        handler: this.userData.name,
      });
      // const implicitAccountId = "7e4543212f88b6186b965f179b23fe3cea83b6ab3ab67ab3f70ed354e521666b";
      console.log("implicitAccountId", implicitAccountId);

      // get the seed phrase through pubnub
      const seedPhrase = await this.getSeedPhrase(implicitAccountId, this.userData.id);
      if (!seedPhrase) {
        this.errorType = "seedPhrase";
        this.errorTwitterAccVerification = true;
        return;
      }
      // now we check the account balance
      const hasBalance = await this.getBalance(implicitAccountId);
      if (!hasBalance) {
        this.errorType = "balance";
        this.errorTwitterAccVerification = true;
        return;
      }
      this.successTwitterAccVerification = true;

      this.$store.commit("stepSuccess", true);

      // this.$router.push({ name: "royalties-createWallet" });
    },

    async connectAccount() {
      console.log("Call connectAccount", this.selectedAccountId, this.nearAccountId);
      this.loadingConnectAccount = true;
      try {
        if (this.successTwitterAccVerification) {
          clearTimeout(this.timer);
          this.$router.push({ name: "royalties-createWallet" });
          this.loadingConnectAccount = false;
          return;
        }
        if (this.selectedAccountId) {
          const { state } = await this.$store.dispatch("connectAccount", {
            selectedAccount: this.selectedAccount,
            redirectPath: this.redirectPath,
          });
          if (state == "success") {
            console.log("connectAccount state", state);
          }
        }
      } catch (error) {
        console.log("connectAccount", error);
      }
    },

    backStep() {
      if (!this.errorTwitterAccVerification) {
        this.$router.push({ name: "royalties-welcome" });
      }
      this.errorType = null;
      this.errorTwitterAccVerification = false;
      this.successTwitterAccVerification = false;
      this.errorMessage = null;

      // uncomment this line to remove selected value on back
      // this.$store.commit("selectedAccountId");
    },
  },

  async created() {
    console.log(this.$route);
    this.errorMessage = null;
    this.selectedAccount = this.accountIds.find((e) => e.IdName == this.selectedAccountId);
  },
  async mounted() {
    this.loadingConnectAccount = true;
    try {
      let userData, hasUserData;
      ({ userData, hasUserData } = await this.$store.dispatch("getOauthDataStorage", {
        selectedAccount: "twitter",
      }));

      // if no oauth called no need to check more
      if (localStorage.getItem("@wallid:oauth:state") == 1) {
        return;
      }

      if (!hasUserData) {
        return (
          (this.errorTwitterAccVerification = true),
          (this.errorMessage = this.errorsMessages[0](this.selectedAccount.IdNameDesc))
        );
      }

      this.userData = userData;

      console.log(this.nftData);

      // this.timer = setTimeout(() => {
      await this.getWalletAccess();
      // }, 8 * 1000);
    } catch (error) {
      console.log("royalties flow error: ", error);
      this.errorType = "generalError";
      this.errorMessage = error?.message;
      this.errorTwitterAccVerification = true;
    } finally {
      this.loadingConnectAccount = false;
    }
    // }
  },
  components: {
    FormButton,
    ConnectAccount,
    ErrorState,
    LoaderCircle,
  },
};
</script>
