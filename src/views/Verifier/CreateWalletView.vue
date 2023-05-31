<template>
  <v-container fill-height class="align-content-space-between">
    <v-row v-if="loading" class="pt-8 d-flex justify-center">
      <LoaderCircle :loading="loading"></LoaderCircle>
    </v-row>
    <v-row v-else-if="errorMessage" class="pt-8 d-flex justify-center">
      <ErrorState
        :error-type="errorType"
        :error-message="errorMessage"
        :selected-account="selectedAccount"
      ></ErrorState>
    </v-row>
    <v-row v-else-if="successState" justify="center" class="pa-10">
      <v-col cols="8" class="pt-5">
        <v-img
          :src="require(`@/assets/icons/success.webp`)"
          contain
          class="mx-auto"
          max-height="40"
          max-width="40"
        />
      </v-col>

      <v-col cols="8" class="pt-5">
        <h1 class="title-h1 text-center">You're all set!</h1>
      </v-col>

      <v-col cols="8" class="pt-5">
        <h1 class="title-h1 text-center">
          You now have access to the wallet receiving your royalties.
        </h1>
      </v-col>
    </v-row>
    <v-row v-else-if="!loading" justify="center" class="pt-6">
      <v-col v-if="!loading" cols="12" class="pt-4">
        <h1 class="title-h1 text-center">{{ $t(`connect.title`) }}</h1>
      </v-col>
      <v-col v-for="asset in web3TokensList" :key="asset.IdName" cols="12" class="pt-4">
        <ConnectAccount
          :selectedAccount="asset"
          @errorMessage="errorMessage = $event"
          @allSelected="($event) => (allSelected = $event)"
        />
      </v-col>

      <v-col v-if="!loading && hasWeb3BrowserExtension" cols="12" class="pt-4">
        <WalletSelector class="" v-model="selectedWallet"></WalletSelector>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-end pb-5">
        <FormButton
          :text="'Connect Wallet'"
          @click="connectAccount"
          :disabled="!(allSelected && selectedWallet)"
        >
        </FormButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ConnectAccount from "@/components/ConnectAccount.vue";
import ErrorState from "@/components/ErrorState.vue";
import FormButton from "@/components/FormButton.vue";
import LoaderCircle from "@/components/LoaderCircle.vue";
import WalletSelector from "@/components/WalletSelector";

import { mapState } from "vuex";

export default {
  name: "CreateWalletView",
  beforeDestroy() {},
  data() {
    return {
      allSelected: false,
      loading: false,
      selected: false,
      successState: false,
      errorMessage: null,
      errorType: null,
      hasWeb3BrowserExtension: false,
      selectedWallet: null,
      nearAccountItem: {
        IdName: "nearTokens",
        IdNameDesc: "Near Wallet",
        IdDescription: "Connect to your NEAR wallet",
        type: "web3",
      },
      selectedAccount: {
        IdName: "WalliDAO",
        IdNameDesc: "WalliDAO tokens",
        type: "web3",
        options: [
          {
            field: "WalliDAO tokens ownership",
            description: ["At least 1,000 tokens"],
            state: false,
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["nearAccount", "assetsToVerify", "web3TokensList"]),
  },
  watch: {
    selectedWallet(value) {
      console.log("Value", value);
    },
  },
  methods: {
    async connectAccount() {
      console.log("Call connectAccount");
      let walletAddress = await this.$store.dispatch("web3wallet/connectProvider");
      console.log("walletAddress", walletAddress);

      // const popup = window.open(
      //   "/near",
      //   "popup",
      //   "width=600,height=600,toolbar=no,menubar=no"
      // );
      // const checkPopup = setInterval(async () => {
      //   // if (popup.window.location.href.includes("success=1")) {
      //   //   popup.close();
      //   // }
      //   if (!popup || !popup.closed) return;
      //   clearInterval(checkPopup);
      //   const { nearAccountId } = await this.$store.dispatch(
      //     "getURLSearchParams"
      //   );

      //   console.log("popup close check near account", nearAccountId);
      //   if (nearAccountId) {
      //     this.$router.push("/home");
      //   }
      // }, 1000);
      // await this.$store.dispatch("near/connectNear");
    },
  },
  async mounted() {
    // this will store a wallet access keys in browser's local  storage
    // await this.$store.dispatch("near/initNear");
    try {
      let provider = await this.$store.dispatch("web3wallet/checkProvider");

      if (provider) {
        this.hasWeb3BrowserExtension = true;
      }

      let address = await this.$store.dispatch("web3wallet/checkConnection", provider);
      if (!address) {
        // this.$store.commit("errorMsg", "ERR_NO_PERMISSION");
        // this.errorMessage = "ERR_NO_PERMISSION";
        console.log(address);
      }
    } catch (error) {
      // if (this.errorMsg !== "noComp") this.selectedWallet = "wallid";
      console.log(error);
      // this.errorMessage = error?.message || error;
      // this.$store.commit("errorMsgStatus", error.message);
    }

    this.loading = false;
  },
  components: {
    FormButton,
    LoaderCircle,
    WalletSelector,
    ErrorState,
    ConnectAccount,
  },
};
</script>
<style lang="scss">
.connect-near {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  min-height: 85px !important;

  // border: none !important;
  // background-color: transparent !important;
}

// * {
//   outline: solid 1px rgba($color: red, $alpha: 0.2);
// }
</style>
