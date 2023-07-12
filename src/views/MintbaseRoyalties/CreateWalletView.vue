<template>
  <v-container
    fill-height
    class="align-content-space-between"
    :style="{ height: !successState ? '910px' : 'unset' }"
  >
    <component :is="'style'">
      :root { --topDistance: {{ !successState ? "390px" : "150px" }} }
    </component>

    <v-row justify="center" class="">
      <LoaderCircle :loading="loading"></LoaderCircle>
      <v-col v-if="!loading && !isSignedIn" cols="12" class="pt-4">
        <h1 class="title-h1 text-center">Import wallet account using seedphrase</h1>

        <SeedPhraseWrapper :seedphrase="seedphrase" @copy-click="modal.show()"> </SeedPhraseWrapper>
      </v-col>
      <v-col v-else-if="!loading && isSignedIn" cols="12" class="pt-4">
        <h1 class="title-h1 text-center">Connect to your wallet account</h1>
      </v-col>
      <v-col cols="12" class="pt-4">
        <div id="nws-modal-stub">
          <!-- <component v-if="!loading" :is="headerComponent"></component> -->
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-if="false" cols="12" class="d-flex justify-end pb-5">
        <FormButton :text="'Connect Wallet'" @click="connectAccount" :disabled="!selected">
        </FormButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormButton from "@/components/FormButton.vue";
import LoaderCircle from "@/components/LoaderCircle.vue";
import SeedPhraseWrapper from "@/components/SeedPhraseWrapper";

import { mapGetters, mapState } from "vuex";

import { setupModal } from "@near-wallet-selector/modal-ui";

import NearAPI from "@/plugins/near";

export default {
  name: "CreateWalletView",
  beforeDestroy() {
    this.modal.hide();
  },
  data() {
    return {
      loading: true,
      modal: null,
      selected: false,
      successState: false,
      nearAccountItem: {
        IdName: "nearTokens",
        IdNameDesc: "Near Wallet",
        IdDescription: "Connect to your NEAR wallet",
        type: "web3",
      },
      // headerComponent: {
      //   template: "#near-wallet-selector-modal", // refer to template element by selector
      // },
    };
  },
  computed: {
    ...mapState(["nearAccount"]),
    ...mapState("near", ["walletSelector", "nearAccount"]),
    ...mapState("royalty", ["seedphrase"]),
    ...mapGetters("near", ["nearAccountId"]),
    isSignedIn() {
      return this.walletSelector.isSignedIn();
    },
  },
  watch: {
    nearAccount(value, oldValue) {
      console.log(value);
      console.log(oldValue);
      console.log(this.$route);

      if (value?.accountId) {
        if (this.$route.path.includes("/royalties")) {
          this.$store.commit("forceStepperTitle", "");
          this.$router.push({ name: "royalties-success" });
        } else {
          this.$router.push({ name: "base-select" });
        }
      }
    },
    walletSelector(value) {
      this.modal = setupModal(value, {
        // contractId: process.env.VUE_APP_NEAR_SOCIAL_CONTRACT_TESTNET,
        contractId: NearAPI.NEAR_SOCIAL_CONTRACT_ADDRESS,
      });
      console.log(value);
      if (!value.isSignedIn()) {
        console.log(this.modal);

        // this.modal.show();

        this.loading = false;
      } else {
        // this.modal.hide();
        this.modal.show();
      }
    },
  },
  methods: {
    async connectAccount() {
      console.log("Call connectAccount");
      this.modal.show();

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
    if (this.walletSelector) {
      this.modal = setupModal(this.walletSelector, {
        // contractId: process.env.VUE_APP_NEAR_SOCIAL_CONTRACT_TESTNET,
        contractId: NearAPI.NEAR_SOCIAL_CONTRACT_ADDRESS,
      });

      if (!this.walletSelector.isSignedIn()) {
        console.log(this.modal);
        // await this.modal.show();
        await this.$nextTick();

        this.$forceUpdate();
      } else if (this.$route?.query?.account_id) {
        this.successState = true;
        this.$store.commit("forceStepperTitle", "");

        this.$store.commit("royalty/verifySuccess", true);
        this.$router.push({ name: "royalties-success" });
      } else {
        this.modal.show();
        this.$store.commit("forceStepperTitle", "Connect wallet");

        this.successState = true;
      }
      this.loading = false;
    }
  },
  components: {
    FormButton,
    LoaderCircle,
    SeedPhraseWrapper,
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
