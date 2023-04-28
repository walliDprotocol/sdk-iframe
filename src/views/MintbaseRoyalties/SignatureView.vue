<template>
  <v-container fill-height class="align-content-space-between text-center">
    <v-row justify="center" class="pt-6">
      <v-col cols="12" sm="8" class="pt-12">
        <h1 class="title-h1">Connect social account to your wallet</h1>
      </v-col>
    </v-row>
    <v-row justify="center" class="">
      <v-col cols="auto" class="pt-7 pr-0">
        <v-img contain max-width="46" max-height="46" :src="`/logos/${selectedAccountId}.webp`" />
      </v-col>
      <v-col cols="auto" class="pt-7">
        <v-img height="46" max-width="30" :src="require('@/assets/icons/separator.png')"></v-img>
      </v-col>
      <v-col cols="auto" class="pt-7 pl-0">
        <div class="img-border">
          <v-img contain max-width="48" max-height="48" :src="walletIconUrl" />
        </div>
      </v-col>
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
import { getJSONStorage } from "@/plugins/utils";
import { log } from "console";
import { mapState } from "vuex";

export default {
  name: "SignatureView",
  data() {
    return { errorPost: false, errorSignature: false, walletIconUrl: null };
  },
  computed: {
    ...mapState(["selectedAccountId"]),
    ...mapState("near", ["nearAccountId"]),
  },
  async mounted() {
    this.walletIconUrl = await this.$store.dispatch("near/getWalletIconUrl");
  },
  methods: {
    async doSignPostFlow() {
      let oauthDataSigned = await this.signOauthData();
      //next open twitter post pop
      // await this.openTwitterPost(oauthDataSigned);

      let userData;
      ({ userData } = await this.$store.dispatch("getOauthDataStorage", {
        selectedAccount: this.selectedAccountId,
      }));

      // get user last post
      await this.$store.dispatch("oauth/getUserProfileInfo", {
        account: userData.username,
      });
      const nftId = await getJSONStorage("session", `nftPostId`);

      const oauthData = oauthDataSigned;
      const twitterHandler = userData.username;
      const accountId = this.nearAccountId;
      const NFT_ID = nftId;

      // verify the post
      await this.$store.dispatch("royalty/verifySignatureOnPost", {
        oauthData,
        twitterHandler,
        accountId,
        NFT_ID,
      });

      // send data to iframe app
      // await this.$store.dispatch("publishData", { signatureObject: oauthDataSigned });
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
<style lang="scss">
.img-border {
  border-radius: 50%;
  padding: 8px;
  max-height: 46px;
  max-width: 46px;
  box-shadow: 0px 0px 1px 0px var(--light-blue-grey);
}
</style>
