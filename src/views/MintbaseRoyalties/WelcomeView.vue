<template>
  <div>
    <v-container fill-height class="align-content-space-between px-sm-16">
      <v-row justify="center" class="pt-6 mb-12">
        <v-col cols="12" sm="8" class="pt-16">
          <h1 class="text-center">Welcome to WalliD verification</h1>
        </v-col>
        <v-col cols="12" sm="10" class="">
          <h3 class="text-center mb-5">
            After completing the verification process with WalliD you'll be able to receive your NFT
            royalties in a wallet account that you will create.
          </h3>
          <h3 class="text-center">In order to complete the process you'll need to:</h3>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="4" class="d-flex pb-5">
          <div class="mr-3">img</div>
          <div>Connect to your social network account</div>
        </v-col>
        <v-col cols="4" class="d-flex pb-5">
          <div class="mr-3">img</div>
          <div>Create a wallet account to receive your royalties</div>
        </v-col>
        <v-col cols="4" class="d-flex pb-5">
          <div class="mr-3">img</div>
          <div>Post on your social network</div>
        </v-col>
      </v-row>
    </v-container>
    <v-container fill-height class="align-content-space-between">
      <v-row>
        <v-col cols="12" class="d-flex justify-end pb-5">
          <FormButton :text="'Get started'" @click="startFlow"> </FormButton>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import FormButton from "@/components/FormButton.vue";

export default {
  name: "WelcomeView",

  data() {
    return {
      getOauthDataQuery: {},
    };
  },
  methods: {
    async startFlow() {
      //   // try go get oauth data
      //   let hasUserData = await this.$store.dispatch("getOauthData", this.getOauthDataQuery);
      //   // if no oauth get data from local storage

      //   console.log("selectedAccount", this.selectedAccount);

      //   ({ hasUserData } = await this.$store.dispatch("getOauthDataStorage", {
      //     selectedAccount: "twitter",
      //   }));

      //   // let hasUserData = await this.$store.dispatch("royalty/getNFTDataStorage", {
      //   //   nft: "nftData.json",
      //   // });
      //   console.log("getOauthData", hasUserData);

      //   //if already has oauth data we init the near wallet creation
      //   if (hasUserData && !this.isSignedIn) {
      //     //check if the flow is for royalties flow
      //     console.log("Push route create new wallet");

      //     this.$router.push({ name: "royalties-createWallet" });
      //   } else if (hasUserData && this.isSignedIn) {
      //     console.log("Push route signature request");

      //     this.$router.push({ name: "royalties-signature" });
      //   } else {
      //     console.log("Push route connect to social id");
      //     // Push success screen
      //     this.$router.push({ name: "royalties-home" });
      //     // this.$router.push({ name: "royalties-signature" });
      //     // this.$router.push({ name: "royalties-createWallet" });
      //   }

      //For now we will be doing everything from start
      this.$router.push({ name: "royalties-select" });

      this.loading = false;
    },
  },
  components: {
    FormButton,
  },
};
</script>
