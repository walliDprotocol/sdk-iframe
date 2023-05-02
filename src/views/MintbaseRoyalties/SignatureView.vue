<template>
  <v-container fill-height class="align-content-space-between text-center">
    <v-row v-if="verifyResultSuccess" justify="center" class="pt-6">
      <v-col cols="auto" class="pt-7 pr-0" style="z-index: 3">
        <div class="img-border mt-n1 mr-n1">
          <div>
            <v-img contain max-width="48" max-height="48" :src="walletIconUrl" />
          </div>
        </div>
      </v-col>
      <v-col cols="auto" class="pt-7 mx-n4" style="z-index: 2">
        <v-img contain max-width="46" max-height="46" :src="`/logos/${selectedAccountId}.webp`" />
      </v-col>
      <v-col cols="auto" class="pt-7 pl-0" style="z-index: 1">
        <v-img
          height="46"
          max-width="46"
          contain
          :src="require('@/assets/icons/icon-check.webp')"
        ></v-img>
      </v-col>
      <v-col cols="12" sm="12" class="pt-12">
        <h1 class="title-h1">You're all set!</h1>
      </v-col>
      <v-col cols="12" sm="7" class="">
        <p class="normal-text-p mb-0 ml-2">
          Your wallet and social account were both successfully verified and royalties will be sent
          directly to your wallet.
        </p>
      </v-col>
    </v-row>
    <v-row v-else justify="center" class="pt-6">
      <v-col cols="12" sm="12" class="pt-12">
        <h1 class="title-h1">Connect social account to your wallet</h1>
      </v-col>
      <v-spacer />
      <v-col cols="auto" class="pt-7 pr-0">
        <v-img contain max-width="46" max-height="46" :src="`/logos/${selectedAccountId}.webp`" />
      </v-col>
      <v-col cols="auto" class="pt-7">
        <v-img height="46" max-width="30" :src="require('@/assets/icons/separator.png')"></v-img>
      </v-col>
      <v-col cols="auto" class="pt-7 pl-0">
        <div class="img-border">
          <div>
            <v-img contain max-width="48" max-height="48" :src="walletIconUrl" />
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="12" class="pt-7 d-flex justify-center align-center">
        <v-img
          max-width="20"
          height="20"
          contain
          :src="require('@/assets/icons/icon-1.webp')"
        ></v-img>
        <p class="normal-text-p mb-0 ml-2">Approve the signature request in your wallet</p>
      </v-col>
      <p v-if="errorSignature" class="error-txt normal-text-p">
        Wallet signature failed. Please try again.
      </p>
      <v-col cols="12" sm="9" class="pt-1 d-flex justify-center align-center">
        <v-img
          max-width="20"
          height="20"
          contain
          :src="require('@/assets/icons/icon-2.webp')"
        ></v-img>
        <p class="normal-text-p mb-0 ml-2">
          Approve the post on your social network that contains your wallet signature
        </p>
      </v-col>
      <p v-if="errorPost" class="error-txt normal-text-p">
        No post found in your public feed. Please try again.
      </p>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-end pb-5">
        <FormButton
          :text="verifyResultSuccess ? 'DONE' : 'CONNECT'"
          :loading="loading"
          @click="doSignPostFlow"
        >
        </FormButton>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import FormButton from "@/components/FormButton.vue";
import { log } from "console";
import { mapState } from "vuex";

export default {
  name: "SignatureView",
  data() {
    return {
      errorPost: false,
      errorSignature: false,
      walletIconUrl: null,
      loading: false,
      verifyResultSuccess: false,
    };
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
      if (this.verifyResultSuccess) {
        return;
      }

      this.loading = true;
      let verifyResult;
      let oauthDataSigned;
      try {
        oauthDataSigned = await this.signOauthData();
        //next open twitter post pop
        await this.openTwitterPost(oauthDataSigned);

        let userData;
        ({ userData } = await this.$store.dispatch("getOauthDataStorage", {
          selectedAccount: this.selectedAccountId,
        }));

        // get user last post
        let numTries = 10;

        while (numTries > 0) {
          numTries -= 1;

          const postData = await this.$store.dispatch("oauth/getUserProfileInfo", {
            account: userData.username,
          });

          log("postData", postData);

          const postDataParsed = this.parsePostData(postData);
          const nftId = sessionStorage.getItem("nftPostId");

          // values to test from user post
          const twitterHandlerPost = postDataParsed?.username;
          const nearAccountIdPost = postDataParsed?.nearAccountId;

          const signaturePost = postDataParsed?.signature;

          const oauthData = oauthDataSigned;
          const NFT_ID = nftId;

          // verify the post
          try {
            verifyResult = await this.$store.dispatch("royalty/verifySignatureOnPost", {
              oauthData,
              twitterHandler: twitterHandlerPost,
              nearAccountId: nearAccountIdPost,
              signature: signaturePost,
              NFT_ID,
            });
          } catch (error) {
            console.log(error);
            // continue;
          }
          if (verifyResult) {
            this.$store.commit("royalty/verifySuccess", true);
            break;
          }

          // wait 2 seconds between calls
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;

      if (verifyResult) {
        // send data to iframe app
        this.verifyResultSuccess = true;
        await this.$store.dispatch("publishData", { data: oauthDataSigned });
      }
    },
    parsePostData({ post }) {
      try {
        console.debug("post", post);

        const encryptedData = post.match(/(Wallet signature:.+)/g)[0]?.split(":");
        console.debug("encryptedData", encryptedData);

        const signatureBase64 =
          encryptedData[4].replace(/-/g, "+").replace(/_/g, "/") +
          "=".repeat((4 - (encryptedData[4].length % 4)) % 4);

        return {
          username: encryptedData[1],
          nearAccountId: encryptedData[2],
          nftId: encryptedData[3],
          signature: signatureBase64,
        };
      } catch (error) {
        console.log(error);
        return {};
      }
    },
    async signOauthData() {
      let signRes = await this.$store.dispatch("royalty/signData");

      log("signRes", signRes);
      return signRes;
    },
    openTwitterPost({ message, signature }) {
      const signatureSafeBase64 = signature
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      const generatedPost = `I'm verifying my NEAR wallet to start earning royalties from NFTs. Wallet signature:${message}:${signatureSafeBase64}:
      `;
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
  > div {
    box-shadow: 0px 0px 1px 0px var(--light-blue-grey);
    padding: 8px;
    border-radius: 50%;
    background-color: white;
    max-height: 46px;
    max-width: 46px;
  }
  border-radius: 50%;
  background-color: white;

  border: solid 4px white;
}
</style>
