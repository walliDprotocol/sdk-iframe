<template>
  <v-container fill-height class="align-content-space-between" :style="{ height: forcedHeight }">
    <component :is="'style'"> :root { --topDistance: {{ topDistance }} } </component>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import { setupModal } from "@near-wallet-selector/modal-ui";

import NearAPI from "@/plugins/near";

export default {
  name: "NearWalletSelector",
  props: {
    topDistance: {
      default: "190px",
      type: String,
    },
    forcedHeight: {
      default: "unset",
      type: String,
    },
  },
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
    cssVars() {
      return {
        "--topDistance": 20,
      };
    },
  },
  watch: {
    nearAccount(value) {
      console.log(value);
      console.log(this.$route.path);

      //   if (value?.accountId) {
      //     if (this.$route.path.includes("/royalties")) {
      //       this.$router.push({ name: "royalties-signature" });
      //     } else {
      //       this.$router.push({ name: "base-select" });
      //     }
      //   }
    },
    walletSelector(value) {
      this.modal = setupModal(value, {
        // contractId: process.env.VUE_APP_NEAR_SOCIAL_CONTRACT_TESTNET,
        contractId: NearAPI.NEAR_SOCIAL_CONTRACT_ADDRESS,
      });
      console.log(value);
      if (!value.isSignedIn()) {
        console.log(this.modal);

        this.modal.show();

        this.loading = false;
      } else {
        this.modal.hide();
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
      await this.modal.show();

      // if (!this.walletSelector.isSignedIn()) {
      //   console.log(this.modal);
      //   await this.modal.show();
      //   await this.$nextTick();

      //   this.$forceUpdate();
      //   // var nodesToMove = document.querySelectorAll(".nws-modal-wrapper");
      //   // console.log(nodesToMove);

      //   // var destinationContainerNode = document.querySelector("#nws-modal-stub");
      //   // console.log(destinationContainerNode);
      //   // Array.from(nodesToMove).forEach(function (node) {
      //   //   destinationContainerNode.appendChild(node);
      //   // });
      // } else {
      //   this.modal.hide();
      //   // this.successState = true;
      //   // this.$router.push({ name: "base-select" });

      //   this.$store.commit("royalty/verifySuccess", true);
      // }
      this.loading = false;
    }
  },
  components: {},
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
.nws-modal-wrapper .nws-modal {
  top: var(--topDistance, 390px) !important;
}
</style>
