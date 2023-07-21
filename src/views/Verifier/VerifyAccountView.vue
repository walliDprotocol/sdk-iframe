<template>
  <v-container v-if="selectedAccount.type" fill-height class="pt-7 align-content-space-between">
    <v-row justify="center">
      <v-col cols="8">
        <h1 class="title-h1 text-center">
          {{
            selectedAccount.type == "WEB3"
              ? `Verify your ${selectedAccount.IdNameDesc} balance`
              : `Connect to your ${selectedAccount.IdNameDesc}
            account and select the levels you want to verify`
          }}
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
        <NearWalletSelector :topDistance="'368px'" :forcedHeight="'490px'" />
      </v-col>
    </v-row>
    <v-row v-if="!showWalletSelector" class="pb-2">
      <v-col class="d-flex justify-end">
        <FormButton class="mr-5" :text="'Back'" :type="'back'" @click="backStep"> </FormButton>
        <FormButton
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
    };
  },
  watch: {
    nearAccountId(val) {
      if (val) {
        this.checkBalance = true;
      }
    },
  },
  computed: {
    ...mapState(["selectedAccountId"]),
    ...mapGetters("near", ["nearAccountId", "walletSelector"]),
    isDisabled() {
      return !!this.errorMessage || !this.selectedAccount?.options?.some((value) => value.state);
    },
    showWalletSelector() {
      return this.selectedAccount?.IdName?.includes("near") && !this.walletSelector?.isSignedIn();
    },
    selectedAccount() {
      return this.accountIds.find((e) => e.IdName == this.selectedAccountId) || {};
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
        if (this.isRoyaltyFlow || this.nearAccountId) {
          const { state } = await this.$store.dispatch("connectAccount", {
            selectedAccount: this.selectedAccount,
            redirectPath: this.redirectPath,
          });
          if (state == "success") {
            this.$router.push({ name: "base-success" });
          }
        } else {
          this.$router.push({ name: "base-connect" });

          // await this.$store.dispatch("near/connectNear");
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

      if (!this.walletSelector.isSignedIn()) {
        console.log(this.modal);
        sessionStorage.setItem("isLoggedOff", JSON.stringify({ value: true }));
        await this.modal.show();
      } else {
        this.modal.hide();
        // this.successState = true;
        // this.$router.push({ name: "base-select" });

        // this.$store.commit("royalty/verifySuccess", true);
      }
      this.loading = false;
    }
  },
  async created() {
    // if (!this.selectedAccountId) {
    //   this.$router.push({ name: "base-select" });
    // }
    ({ accountIds: this.accountIds, redirectPath: this.redirectPath } = (
      await axios.get("/userData.json")
    ).data);

    this.accountIds.forEach((a) =>
      a.options.forEach((option) => {
        option.display = true;
      })
    );

    console.log("selectedAccount", this.selectedAccount);
    this.loading = false;
  },
  components: {
    FormButton,
    ConnectAccount,
    NearWalletSelector,
  },
};
</script>
