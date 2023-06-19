<template>
  <v-container fill-height class="align-content-space-between">
    <v-row v-if="loading" class="pt-8 d-flex justify-center">
      <LoaderCircle :loading="loading"></LoaderCircle>
    </v-row>
    <v-row v-else-if="errorMessage" class="pt-8 d-flex justify-center">
      <ErrorState
        :error-type="errorType"
        :error-message="errorMessage"
        :selected-account="tokenData"
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
        <h1 class="title-h1 text-center mb-1">{{ $t(`connectWallet.title`) }} {{ tokenName }}</h1>
      </v-col>
      <v-col v-for="asset in web3TokensList" :key="asset.IdName" cols="12" class="pt-3">
        <ConnectAccount
          :selectedAccount="tokenData"
          @errorMessage="errorMessage = $event"
          @allSelected="($event) => (allSelected = $event)"
          :checkBalance="false"
        />
      </v-col>
      <v-col v-if="!loading && hasWeb3BrowserExtension" cols="12" class="pt-2">
        <WalletSelector
          class=""
          v-model="selectedWallet"
          :loading="loadingConnection"
        ></WalletSelector>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-end pb-5">
        <FormButton
          v-if="!errorMessage"
          class="mr-4"
          :text="'Back'"
          :type="'back'"
          @click="backStep"
        >
        </FormButton>
        <FormButton
          v-if="!errorMessage"
          :text="$t(`connectWallet.connectButton`)"
          @click="doVerifyTokenBalanceFlow"
          :disabled="!(allSelected && selectedWallet)"
        >
        </FormButton>
        <FormButton
          v-else
          :text="$t(`connectWallet.tryAgain`)"
          @click="backStep"
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
import { networks } from "@/constants/networks";

import { mapState } from "vuex";

// import { compareBalance } from "@/plugins/utils";

export default {
  name: "ConnectWalletView",
  beforeDestroy() {
    localStorage.setItem("@wallid:oauth:state", 1);
  },
  data() {
    return {
      allSelected: false,
      loading: false,
      loadingConnection: false,
      selected: false,
      successState: false,
      errorMessage: null,
      errorType: null,
      hasWeb3BrowserExtension: false,
    };
  },
  computed: {
    ...mapState(["web3TokensList", "chainId"]),

    tokenName() {
      return this.tokenData?.IdNameDesc;
    },
    tokenData() {
      return this.web3TokensList?.[0];
    },
    selectedWallet: {
      get() {
        return this.$store.getters["web3wallet/selectedWallet"];
      },
      set(value) {
        console.log(value);
        this.$store.commit("web3wallet/setSelectedWallet", value);
      },
    },
  },
  watch: {
    selectedWallet(value) {
      console.log("Value", value);
    },
  },
  methods: {
    async doVerifyTokenBalanceFlow() {
      console.log("Call doVerifyTokenBalanceFlow");
      this.loadingConnection = true;
      try {
        const walletAddress = await this.connectAccount();

        console.log("walletAddress", walletAddress, this.tokenData);

        for (let index = 0; index < this.tokenData?.options.length; index++) {
          const option = this.tokenData?.options[index];
          option.result = await this.verifyOptionData(option);
        }

        // let res = await this.verifyOptionData(this.tokenData?.options?.[0]);

        console.log("verifyOptionData", this.tokenData?.options);

        let selectedOptionsResults = this.tokenData?.options.every(
          (option) => option.state && option.result
        );

        console.log("selectedOptionsResults", selectedOptionsResults);

        if (selectedOptionsResults) {
          this.$router.push({ name: "base-success-view" });
        } else {
          this.errorMessage = "It seems like you don't have enough tokens.";
        }
        return walletAddress;
      } catch (error) {
        console.log("error", error);
        this.errorMessage = `It was not possible to verify ${this.tokenData.IdNameDesc} ownership.`;
      } finally {
        this.loadingConnection = false;
      }
    },

    async verifyOptionData({ type, value }) {
      console.log("verifyOptionData", type);

      switch (type) {
        case "balance": {
          let balance = await this.checkTokenBalance();
          // return compareBalance(balance, value, "bt");
          return balance >= value;
        }

        default:
          return "Nothing";
      }
    },

    async checkTokenBalance() {
      let tokenBalance = await this.$store.dispatch("web3wallet/tokenBalance", {
        walletAddress: this.walletAddress,
        contractAddress: this.tokenData?.contractAddress,
        contractType: this.tokenData?.contractType,
      });
      console.log("tokenBalance", tokenBalance);
      return tokenBalance;
    },
    async connectAccount() {
      console.log("Call connectAccount");

      // connect to wallet
      try {
        let walletAddress;
        if (this.requestWalletChange) {
          await this.$store.dispatch("web3wallet/requestAccounts");
        }
        walletAddress = await this.$store.dispatch("web3wallet/connectProvider");

        const networkParams = networks.find((n) => n.chainId === this.chainId);

        let res = await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [networkParams],
        });

        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: networkParams.chainId }],
        });
        this.walletAddress = walletAddress;
        console.log(res);
        return walletAddress;
      } catch (error) {
        console.log("error", error);
      }
    },
    backStep() {
      if (this.errorMessage) {
        this.errorMessage = null;
        this.requestWalletChange = true;
        return;
      }
      this.$router.go(-1);

      // uncomment this line to remove selected value on back
      // this.$store.commit("selectedAccountId");
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
