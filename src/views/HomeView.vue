<template>
  <v-container>
    <v-row v-if="step == 1">
      <v-col cols="12">
        <h1 class="title-h1">Select the IDs you'd like to verify</h1>
      </v-col>
      <v-col cols="12" class="pt-5">
        <IdCardWrapper
          @update:selected="selectedAccount = $event"
          :items="accountIds"
        />
      </v-col>

      <v-col class="d-flex justify-end">
        <FormButton
          :text="'Next'"
          :disabled="!selectedAccount.IdNameDesc"
          @click="step = 2"
        >
        </FormButton>
      </v-col>
    </v-row>

    <v-row v-if="step == 2">
      <v-col cols="12">
        <h1 class="title-h1">
          Connect to your {{ selectedAccount.IdNameDesc }} account and select
          the levels you want to verify
        </h1>
      </v-col>
      <v-col cols="12" class="pt-5">
        <ConnectAccount :selectedAccount="selectedAccount" />
      </v-col>

      <v-col class="d-flex justify-end">
        <FormButton
          class="mr-5"
          :text="'Back'"
          :type="'back'"
          @click="step = 1"
        >
        </FormButton>
        <FormButton
          :text="userData.username ? 'VERIFY' : 'CONNECT AND VERIFY'"
          @click="connectAccount"
        >
        </FormButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormButton from "@/components/FormButton.vue";
import IdCardWrapper from "@/components/IdCardWrapper.vue";
import ConnectAccount from "@/components/ConnectAccount.vue";

import * as nearAPI from "near-api-js";
import axios from "axios";

export default {
  name: "HomeView",
  data() {
    return { accountIds: [], step: 1, selectedAccount: {}, userData: {} };
  },
  methods: {
    async connectAccount() {
      console.log("Call connectAccount");
      await this.wallet.requestSignIn(
        "example-contract.testnet", // contract requesting access
        "Verification iframe", // optional title
        "http://127.0.0.1:8080", // optional redirect URL on success
        "http://127.0.0.1:8080" // optional redirect URL on failure
      );
      // await this.$store.dispatch("twitterConnect");
    },
  },
  async mounted() {
    // this will store a wallet access keys in browser's local  storage
    const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
    // configuration object
    const config = {
      networkId: "testnet",
      keyStore,
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    // connect to NEAR
    this.near = await nearAPI.connect(config);
    // create wallet connection
    this.wallet = new nearAPI.WalletConnection(this.near);

    console.log(this.wallet);

    this.accountIds = (await axios.get("userData.json")).data.accountIds;

    let urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);

    if (urlParams.has("account_id")) {
      this.$store.commit("nearAccount", urlParams.get("account_id"));
    }

    let preAuth = JSON.parse(localStorage.getItem("twitter_preAuth"));
    console.log("pre Auth tokens ", preAuth);
    let localUserData = JSON.parse(localStorage.getItem("twitter_user"));
    if (localUserData) {
      this.userData = localUserData;
    } else if (urlParams.has("state") && urlParams.has("code") && preAuth) {
      let state = urlParams.get("state");
      let code = urlParams.get("code");
      console.log("oauth_state: ", state);
      console.log("oauth_code: ", code);

      console.log("twitter_preAuth : ", preAuth);
      this.userData = await this.$store.dispatch("getTwitterUsername", {
        state,
        code,
        codeVerifier: preAuth.codeVerifier,
      });
    }

    if (this.userData.username) {
      // this.step = 2;
      this.selectedAccount = this.accountIds.find((e) => e.IdName == "twitter");
      let objIndex = this.accountIds.findIndex((e) => e.IdName == "twitter");
      this.accountIds[objIndex].userData = this.userData;
    }
  },
  components: {
    IdCardWrapper,
    FormButton,
    ConnectAccount,
  },
};
</script>
