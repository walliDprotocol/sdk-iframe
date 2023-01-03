<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-col cols="8" class="pt-10">
        <v-container class="connect-account" style="max-width: 700px">
          <v-row justify="center" class="px-10">
            <v-col cols="8" class="pt-5">
              <h1 class="title-h1 text-center">Connect wallet</h1>
            </v-col>

            <v-col cols="8" class="pt-5">
              <p class="normal-text-p text-center">
                To proceed and select the IDs you'd like to verify please
                connect to your wallet
              </p>
            </v-col>
            <v-col cols="7" class="pb-10" @click="connectAccount">
              <IdCard class="pb-3" :item="nearAccountItem" />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-end pb-0">
        <FormButton :text="'Connect Wallet'" @click="connectAccount">
        </FormButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormButton from "@/components/FormButton.vue";
import IdCard from "@/components/IdCard.vue";

import { mapState } from "vuex";

export default {
  name: "ConnectView",
  data() {
    return {
      step: 1,
      userData: {},
      selectedAccount: {},
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
  },
  methods: {
    async connectAccount() {
      console.log("Call connectAccount");

      const popup = window.open(
        "/near",
        "popup",
        "width=600,height=600,toolbar=no,menubar=no"
      );
      const checkPopup = setInterval(async () => {
        // if (popup.window.location.href.includes("success=1")) {
        //   popup.close();
        // }
        if (!popup || !popup.closed) return;
        clearInterval(checkPopup);
        const { nearAccountId } = await this.$store.dispatch(
          "getURLSearchParams"
        );

        console.log("popup close check near account", nearAccountId);
        if (nearAccountId) {
          this.$router.push("/home");
        }
      }, 1000);
      // await this.$store.dispatch("near/connectNear");
    },
  },
  async mounted() {
    // this will store a wallet access keys in browser's local  storage
  },
  components: {
    FormButton,
    IdCard,
  },
};
</script>
