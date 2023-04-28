<template>
  <v-container fill-height class="pt-7 align-content-start">
    <v-container fill-height class="pa-0 align-content-space-between">
      <v-row v-if="errorTwitterAccVerification" class="pt-8 d-flex justify-center">
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
            :src="require('@/assets/icons/icon-error.webp')"
          />
        </v-col>
        <v-col cols="12" class="pt-5">
          <h1 class="title-h1 text-center">Verification failed</h1>
        </v-col>
        <v-col cols="12" sm="8">
          <p class="normal-text text-center">
            {{ errorMessage }}
          </p>
        </v-col>
      </v-row>
      <v-row v-else-if="successTwitterAccVerification">
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
        <v-col cols="12" class="pt-5">
          <h1 class="title-h1 text-center">Success! Your account was verified.</h1>
        </v-col>
        <v-col cols="12">
          <p class="normal-text text-center">
            You can now create a wallet and claim your royalties
          </p>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <h1 class="title-h1 text-center">Connect to your social network account</h1>
        </v-col>
        <v-col cols="12" class="pt-5">
          <ConnectAccount
            :selectedAccount="selectedAccount"
            @errorMessage="errorMessage = $event"
          />
        </v-col>
      </v-row>
      <v-row class="pb-2">
        <v-col class="d-flex justify-end">
          <FormButton class="mr-4" :text="'Back'" :type="'back'" @click="backStep"> </FormButton>
          <FormButton :text="'Connect'" @click="connectAccount"> </FormButton>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import FormButton from "@/components/FormButton";
import ConnectAccount from "@/components/ConnectAccount";

import { mapGetters, mapState } from "vuex";

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
      errorTwitterAccVerification: false,
      successTwitterAccVerification: false,
      errorsMessages: [
        (idName) => `It was not possible to verify ${idName} your account, please try again.`,
        "The account you connected to doesn't match the one identified in the NFT creator's post. Please confirm your account and try again.",
      ],
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
    async connectAccount() {
      console.log("Call connectAccount", this.selectedAccountId, this.nearAccountId);
      this.loadingConnectAccount = true;
      try {
        if (this.successTwitterAccVerification) {
          clearTimeout(this.timer);
          if (this.nearAccountId) {
            this.$router.push({ name: "royalties-signature" });
          } else {
            this.$router.push({ name: "royalties-createWallet" });
          }
          return;
        }
        if (this.selectedAccountId) {
          const { state } = await this.$store.dispatch("connectAccount", {
            selectedAccount: this.selectedAccount,
            redirectPath: this.redirectPath,
          });
          if (state == "success") {
            this.$router.push("/success");
          }
        }
      } catch (error) {
        console.log("connectAccount", error);
      } finally {
        this.loadingConnectAccount = false;
      }
    },

    backStep() {
      if (!this.errorTwitterAccVerification) {
        this.$router.push({ name: "royalties-welcome" });
      }
      this.errorTwitterAccVerification = false;

      // uncomment this line to remove selected value on back
      // this.$store.commit("selectedAccountId");
    },
  },

  async created() {
    console.log(this.$route);
    this.errorMessage = null;
    this.selectedAccount = this.accountIds.find((e) => e.IdName == this.selectedAccountId);
    // this.step = 2;

    // let objIndex = this.accountIds.findIndex(
    //   (e) => e.IdName == this.selectedAccountId
    // );

    // Vue.set(this.accountIds, objIndex, {
    //   ...this.accountIds[objIndex],
    //   userData,
    // });

    // this.accountIds[objIndex].userData = userData;
    // await this.$forceUpdate();
  },
  async mounted() {
    let userData, hasUserData;
    ({ userData, hasUserData } = await this.$store.dispatch("getOauthDataStorage", {
      selectedAccount: "twitter",
    }));

    // if no oauth called no need to check more
    if (localStorage.getItem("@wallid:oauth:state") != 1) {
      return;
    }

    if (!hasUserData) {
      return (
        (this.errorTwitterAccVerification = true),
        (this.errorMessage = this.errorsMessages[0](this.selectedAccount.IdNameDesc))
      );
    }
    console.log(userData);
    console.log(this.nftData);

    const currentOwners = this.nftData?.owners;
    let owner = currentOwners.find((co) => {
      console.log(co);
      return co?.social_handler?.username === userData.username; // "masterviana";
    });
    console.log(owner);

    if (!owner)
      return (
        (this.errorTwitterAccVerification = true), (this.errorMessage = this.errorsMessages[1])
      );
    if (owner) {
      this.successTwitterAccVerification = true;
      this.timer = setTimeout(() => {
        if (this.nearAccountId) {
          this.$router.push({ name: "royalties-signature" });
        } else {
          this.$router.push({ name: "royalties-createWallet" });
        }
      }, 8 * 1000);
    }
  },
  components: {
    FormButton,
    ConnectAccount,
  },
};
</script>
