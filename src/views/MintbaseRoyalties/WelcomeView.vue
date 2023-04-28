<template>
  <div>
    <v-container fill-height class="align-content-space-between px-sm-16">
      <v-row justify="center" class="">
        <v-col cols="12" sm="8" class="pt-13">
          <h1 class="text-center">Welcome to WalliD</h1>
        </v-col>
        <v-col cols="12" sm="10" class="">
          <h3 class="text-center mb-13">
            To get started and receive your royalties, follow these simple steps to verify your
            social network account and create a NEAR wallet.
          </h3>
          <h3 class="text-center">After completing the process you'll have:</h3>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col
          v-for="bulletPoint in bulletPoints"
          :key="bulletPoint"
          cols="12"
          class="d-flex pb-1 justify-center"
        >
          <div class="d-flex bullet-point-wrapper">
            <v-img
              class="mr-3"
              contain
              max-width="24"
              max-height="24"
              :src="require('@/assets/icons/icon-check-filled.webp')"
            />
            <div>{{ bulletPoint }}</div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container fill-height class="align-content-space-between">
      <v-row class="mt-10">
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
      bulletPoints: [
        "Verified your social network account qualified to recieve royalties",
        "Your own NEAR wallet",
        "Royalty funds being automatically transferred to your wallet",
      ],
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
<style lang="scss">
.bullet-point-wrapper {
  padding: 10px;

  background: linear-gradient(
    90deg,
    rgba(100, 255, 222, 0.24) 4%,
    rgba(115, 221, 231, 0.33) 43%,
    rgba(122, 206, 253, 0.02) 86%
  );

  border-bottom-left-radius: 40px;
  border-top-left-radius: 40px;
}
</style>
