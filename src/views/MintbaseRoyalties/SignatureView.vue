<template>
  <v-container fill-height class="align-content-space-between text-center">
    <v-row justify="center" class="pt-6">
      <v-col cols="12" sm="8" class="pt-12">
        <h1 class="title-h1">Connect social account to your wallet</h1>
      </v-col>
    </v-row>
    <v-row justify="center" class="">
      <v-col cols="auto" class="pt-7 pr-0"> .... </v-col>
      <v-col cols="auto" class="pt-7 px-0">
        <v-img height="46" contain :src="require('@/assets/icons/sperator.png')"></v-img>
      </v-col>
      <v-col cols="auto" class="pt-7 pl-0"> .... </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="9" class="pt-7 d-flex justify-center align-center">
        <v-img
          max-width="20"
          height="20"
          contain
          :src="require('@/assets/icons/icon-1.webp')"
        ></v-img>
        <p class="normal-text mb-0 ml-2">Approve the signature request in your wallet</p>
      </v-col>
      <p v-if="errorSignature" class="error-txt normal-text">
        Wallet signature failed. Please try again.
      </p>
      <v-col cols="12" sm="9" class="pt-1 d-flex justify-center align-center">
        <v-img
          max-width="20"
          height="20"
          contain
          :src="require('@/assets/icons/icon-2.webp')"
        ></v-img>
        <p class="normal-text mb-0 ml-2">
          Approve the post on your social network that contains your wallet signature
        </p>
      </v-col>
      <p v-if="errorPost" class="error-txt normal-text">
        No post found in your public feed. Please try again.
      </p>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-end pb-5">
        <FormButton :text="'CONNECT'" @click="doSignPostFlow"> </FormButton>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import FormButton from "@/components/FormButton.vue";
import { log } from "console";

export default {
  name: "SignatureView",
  data() {
    return { errorPost: false, errorSignature: false };
  },
  methods: {
    async doSignPostFlow() {
      let oauthDataSigned = await this.signOauthData();
      //next open twitter post pop
      await this.openTwitterPost(oauthDataSigned);

      // do post verify
      this.$store.dispatch("publishData", { signatureObject: oauthDataSigned });
    },

    async signOauthData() {
      let signRes = await this.$store.dispatch("royalty/signData");

      log("signRes", signRes);
      return signRes;
    },
    openTwitterPost({ accountId }) {
      const generatedPost = `${accountId}`;
      window.open(
        "https://twitter.com/intent/tweet?text=" + generatedPost,
        "",
        "_blank, width=500, height=500, resizable=yes, scrollbars=yes"
      );
    },
  },
  components: {
    FormButton,
  },
};
</script>
