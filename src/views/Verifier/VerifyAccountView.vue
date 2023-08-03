<template>
  <v-container v-if="selectedAccount.type" fill-height class="pt-7 align-content-space-between">
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="title-h1 text-center">
          {{ headerTitle }}
        </h1>
      </v-col>
      <v-col v-if="!loading" cols="12" class="pt-5">
        <ConnectAccount
          :selectedAccount="selectedAccount"
          @errorMessage="errorMessage = $event"
          :check-balance="checkBalance"
        />
      </v-col>
      <v-col v-if="showWalletSelector" cols="12" class="pt-5">
        <NearWalletSelector :topDistance="'350px'" :forcedHeight="'590px'" />
      </v-col>
    </v-row>
    <v-row class="pb-2 v-footer--fixed justify-space-between">
      <v-col cols="3" class="d-flex justify-center align-center"> </v-col>
      <v-col cols="3" class="d-flex justify-center align-center">
        <p class="footer-label mb-0">Powered by</p>

        <v-img
          alt="Vuetify Logo"
          class="shrink ml-2"
          contain
          src="/logos/wallid.webp"
          transition="scale-transition"
          width="60"
        />
      </v-col>
      <v-col cols="3" class="d-flex justify-end">
        <FormButton class="" :text="'Back'" :type="'back'" @click="backStep"> </FormButton>
        <FormButton
          v-if="!showWalletSelector || nearAccountId"
          class="ml-5"
          :text="nearAccountId ? 'VERIFY' : 'CONNECT'"
          :disabled="isDisabled"
          :loading="loadingConnectAccount"
          @click="connectAccount"
        >
        </FormButton>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import FormButton from "@/components/FormButton.vue";
import ConnectAccount from "@/components/ConnectAccount.vue";
import NearWalletSelector from "@/components/NearWalletSelector.vue";

import { mapGetters, mapState } from "vuex";
import axios from "axios";

import { setupModal } from "@near-wallet-selector/modal-ui";
import NearAPI from "@/plugins/near";
import { getJSONStorage } from "@/plugins/utils";

export default {
  name: "SelectView",
  data() {
    return {
      accountIds: [],
      step: 1,
      userData: {},
      loadingConnectAccount: false,
      errorMessage: null,
      loading: true,
      checkBalance: false,
      modal: null,
      isLoggedIn: false,
    };
  },
  watch: {
    nearAccountId(val, old) {
      if (val) {
        this.checkBalance = true;
      }

      if (val !== old) {
        this.isLoggedIn = true;
      }
    },
  },
  computed: {
    ...mapState(["selectedAccountId"]),
    ...mapGetters("near", ["nearAccountId", "walletSelector"]),
    isDisabled() {
      return !!this.errorMessage || !this.selectedAccount?.options?.some((value) => value.state);
    },
    requiresNearAccount() {
      return this.selectedAccount?.IdName?.includes("near");
    },
    showWalletSelector() {
      return (
        this.selectedAccount?.IdName?.includes("near") &&
        (!this.walletSelector?.isSignedIn() || !this.isLoggedIn)
      );
    },
    selectedAccount() {
      return this.accountIds.find((e) => e.IdName == this.selectedAccountId) || {};
    },
    headerTitle() {
      return this.selectedAccount.type == "WEB3"
        ? !this.isLoggedIn
          ? `Connect to  ${this.selectedAccount.IdNameDesc?.split(" ")?.[0]} wallet and verify ${
              this.selectedAccount.IdNameDesc
            } possessions`
          : `Verify your ${this.selectedAccount.IdNameDesc} balance`
        : `Connect to your ${this.selectedAccount.IdNameDesc}
            account and select the levels you want to verify`;
    },
  },
  methods: {
    backStep() {
      this.$router.go(-1);
      this.loadingConnectAccount = false;

      // uncomment this line to remove selected value on back
      // this.$store.commit("selectedAccountId");
    },
    async connectAccount() {
      console.log("Call connectAccount", this.nearAccountId);
      this.loadingConnectAccount = true;
      try {
        if (!this.requiresNearAccount || this.nearAccountId) {
          const { state } = await this.$store.dispatch("connectAccount", {
            selectedAccount: this.selectedAccount,
            redirectPath: this.redirectPath,
          });
          if (state == "success") {
            this.$router.push({ name: "base-success" });
          }
        }
      } catch (error) {
        console.log("connectAccount", error);
      } finally {
        this.loadingConnectAccount = false;
      }
    },
  },
  async mounted() {
    if (this.walletSelector) {
      this.modal = setupModal(this.walletSelector, {
        contractId: NearAPI.NEAR_SOCIAL_CONTRACT_ADDRESS,
      });
      const isLoggedIn = getJSONStorage("session", "isLoggedIn");

      this.isLoggedIn = isLoggedIn.value;

      console.log("isLoggedIn", this.isLoggedIn);

      this.loading = false;
    }
  },
  async created() {
    ({ accountIds: this.accountIds, redirectPath: this.redirectPath } = (
      await axios.get("/userData.json")
    ).data);

    this.accountIds.forEach((a) =>
      a.options.forEach((option) => {
        option.display = true;
      })
    );

    console.log("selectedAccount", this.selectedAccount);
  },
  components: {
    FormButton,
    ConnectAccount,
    NearWalletSelector,
  },
};
</script>
<style lang="scss">
.row.v-footer--fixed {
  background: white;
  left: 40px;
  right: 40px;
  bottom: 12px;
}
</style>
