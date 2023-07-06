<template>
  <v-container fill-height class="pt-0 align-content-space-between">
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
          <div class="d-flex grow" style="min-height: 48px; position: relative">
            <v-img
              style="position: absolute; left: calc(50% - 46px)"
              contain
              max-width="48"
              max-height="48"
              :src="`/logos/${selectedAccount.IdName}.webp`"
            />
            <v-img
              style="position: absolute; left: calc(50%)"
              contain
              max-width="41"
              max-height="46"
              :src="require('@/assets/icons/icon-check.webp')"
            />
          </div>
        </v-col>
        <v-col cols="9" class="pt-5">
          <h1 class="title-h1 text-center">
            {{ $t(`successfulVerify.title`) }}
          </h1>
        </v-col>
        <v-col cols="12" sm="6">
          <p class="normal-text-p text-center">{{ $t(`successfulVerify.text1`) }}</p>
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
            :checkBalance="false"
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

import LoaderCircle from "@/components/LoaderCircle.vue";

export default {
  name: "ConnectAccountView",
  data() {
    return {
      step: 1,
      userData: {},
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
    ...mapGetters(["flow"]),
    redirectPath() {
      console.log("/?flow=" + this.flow);
      return "/?flow=" + this.flow;
    },
    isDisabled() {
      return !!this.errorMessage || !this.selectedAccount?.options?.some((value) => value.state);
    },
  },
  methods: {
    async connectAccount() {
      console.log("Call connectAccount", this.selectedAccountId);
      this.loadingConnectAccount = true;
      try {
        if (this.successTwitterAccVerification) {
          clearTimeout(this.timer);
          this.$router.push({ name: "celo-createWallet" });
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
        this.$router.push({ name: "celo-welcome" });
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
    console.log("/?flow=" + this.flow);

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
      // with this we always do the oauth request
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
      if (hasUserData) {
        // this.$router.push({ name: "celo-createWallet" });
        this.successTwitterAccVerification = true;
        this.$store.commit("stepSuccess", true);

        this.loading = false;
      }
      // this.timer = setTimeout(() => {
      // await this.getWalletAccess();
      // }, 8 * 1000);
    } catch (error) {
      console.log("base flow error: ", error);
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
