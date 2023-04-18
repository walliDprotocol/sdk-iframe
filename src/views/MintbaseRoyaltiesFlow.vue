<template>
  <div>
    <LoaderCircle :loading="loading"></LoaderCircle>

    <router-view />
  </div>
</template>

<script>
// import Vue from "vue";
import LoaderCircle from "@/components/LoaderCircle.vue";

import { mapGetters, mapState } from "vuex";

export default {
  name: "MintbaseRoyaltiesFlow",
  data() {
    return {
      accountIds: [],
      step: 1,
      userData: {},
      loading: false,
      errorMessage: null,
      getOauthDataQuery: {},
    };
  },
  computed: {
    ...mapState(["selectedAccountId"]),
    ...mapGetters("near", ["nearAccountId"]),
    ...mapState("near", ["walletSelector", "nearAccount"]),
    isSignedIn() {
      return this.walletSelector?.isSignedIn();
    },
    isDisabled() {
      return !!this.errorMessage || !this.selectedAccount?.options?.some((value) => value.state);
    },
  },
  methods: {},

  async created() {
    await this.$store.dispatch("near/initNear");
    // },

    // async mounted() {
    const { configId, nft, state, code } = await this.$store.dispatch("getURLSearchParams");
    console.log("configId, nftPostId", configId, nft, state, code);

    if (nft) {
      let data = await this.$store.dispatch("royalty/getNFTData", { nft });
      console.log(data);
    }

    this.getOauthDataQuery = { state, code, redirectPath: "/royalties" };
    console.log("getOauthData with", this.getOauthDataQuery);

    // try go get oauth data
    let hasUserData = await this.$store.dispatch("getOauthData", this.getOauthDataQuery);
    // if no oauth get data from local storage

    console.log("selectedAccount", this.selectedAccount);

    ({ hasUserData } = await this.$store.dispatch("getOauthDataStorage", {
      selectedAccount: this.selectedAccountId,
    }));

    // let hasUserData = await this.$store.dispatch("royalty/getNFTDataStorage", {
    //   nft: "nftData.json",
    // });
    console.log("getOauthData", hasUserData);

    //if already has oath data we init the near wallet creation
    if (hasUserData && !this.isSignedIn) {
      //check if the flow is for royalties flow
      console.log("Push route create new wallet");

      this.$router.push({ name: "royalties-createWallet" });
    } else if (hasUserData && this.isSignedIn) {
      console.log("Push route signature request");

      this.$router.push({ name: "royalties-signature" });
    } else {
      console.log("Push route connect to social id");
      // Push success screen
      this.$router.push({ name: "royalties-home" });
      // this.$router.push({ name: "royalties-signature" });
      // this.$router.push({ name: "royalties-createWallet" });
    }
    this.loading = false;

    // let objIndex = this.accountIds.findIndex(
    //   (e) => e.IdName == this.selectedAccountId
    // );

    // Vue.set(this.accountIds, objIndex, {
    //   ...this.accountIds[objIndex],
    //   userData,
    // });

    // this.accountIds[objIndex].userData = userData;
    // await this.$forceUpdate();
  },
  components: {
    LoaderCircle,
  },
};
</script>
