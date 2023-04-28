<template>
  <v-container fill-height class="align-content-space-between">
    <v-row justify="center" class="pt-6">
      <v-col cols="6" class="pt-16">
        <LoaderCircle :loading="loading"></LoaderCircle>
        <v-container v-if="false" class="connect-account" style="max-width: 700px">
          <v-row justify="center" class="px-0">
            <v-col cols="8" class="pt-5 px-3">
              <h1 class="title-h1 text-center">Connect wallet</h1>
            </v-col>

            <v-col cols="9" class="pt-5 px-3">
              <p class="normal-text-p text-center">
                To proceed and select the IDs you'd like to verify please connect to your wallet
              </p>
            </v-col>
            <v-col cols="8" class="pb-10 px-1">
              <IdCard
                class="pb-3 connect-near"
                :item="nearAccountItem"
                :class="{ selected: selected }"
                @selected="modal.show()"
              />
            </v-col>
          </v-row>
        </v-container>
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
import IdCard from "@/components/IdCard.vue";
import LoaderCircle from "@/components/LoaderCircle.vue";

import { mapGetters, mapState } from "vuex";

import { setupModal } from "@near-wallet-selector/modal-ui";

import NearAPI from "@/plugins/near";

export default {
  name: "ConnectView",
  data() {
    return {
      loading: true,
      modal: null,
      selected: false,
      nearAccountItem: {
        IdName: "nearTokens",
        IdNameDesc: "Near Wallet",
        IdDescription: "Connect to your NEAR wallet",
        type: "web3",
      },
    };
  },
  computed: {
    ...mapState(["nearAccount"]),
    ...mapState("near", ["walletSelector", "nearAccount"]),
    ...mapGetters("near", ["nearAccountId"]),
  },
  watch: {
    nearAccount(value) {
      console.log(value);
      console.log(this.$route.path);

      if (value?.accountId) {
        if (this.$route.path.includes("/royalties")) {
          this.$router.push({ name: "royalties-signature" });
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
    await this.$store.dispatch("near/initNear");
  },
  components: {
    FormButton,
    IdCard,
    LoaderCircle,
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
