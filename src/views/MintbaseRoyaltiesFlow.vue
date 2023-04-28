<template>
  <div>
    <AppHeader />
    <LoaderCircle :loading="loading"></LoaderCircle>

    <router-view v-if="!loading" />
    <AppFooter />
  </div>
</template>

<script>
// import Vue from "vue";
import LoaderCircle from "@/components/LoaderCircle";
import AppFooter from "@/layout/AppFooter.vue";
import AppHeader from "@/layout/AppHeader.vue";
import axios from "axios";

import { mapGetters, mapState } from "vuex";

export default {
  name: "MintbaseRoyaltiesFlow",
  data() {
    return {
      step: 1,
      userData: {},
      loading: true,
      errorMessage: null,
      getOauthDataQuery: {},
    };
  },
  computed: {
    ...mapState(["selectedAccountId"]),
    ...mapGetters("near", ["nearAccountId"]),
    ...mapState("near", ["walletSelector", "nearAccount"]),
    accountIds: {
      get() {
        return this.$store.state.accountIds;
      },
      set(val) {
        this.$store.commit("setAccountIds", val);
      },
    },
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

    let data = await this.$store.dispatch("royalty/getNFTData", { nft });
    console.log(data);

    ({ accountIds: this.accountIds, redirectPath: this.redirectPath } = (
      await axios.get("/userDataRoyalties.json")
    ).data);

    this.$store.commit("selectedAccountId", "twitter");

    this.getOauthDataQuery = { state, code, redirectPath: "/royalties" };
    console.log("getOauthData with", this.getOauthDataQuery);

    let hasUserData = await this.$store.dispatch("getOauthData", this.getOauthDataQuery);
    // if no oauth get data from local storage

    let userData;
    ({ hasUserData, userData } = await this.$store.dispatch("getOauthDataStorage", {
      selectedAccount: "twitter",
    }));

    await this.$store.dispatch("oauth/getUserProfileInfo", {
      account: userData.username,
    });
    // let hasUserData = await this.$store.dispatch("royalty/getNFTDataStorage", {
    //   nft: "nftData.json",
    // });
    console.log("getOauthData", hasUserData);

    //if already has oauth data we init the near wallet creation
    if (hasUserData) {
      //check if the flow is for royalties flow
      console.log("Push route create new wallet");

      this.$router.push({ name: "royalties-select" });
      // } else if (hasUserData && this.isSignedIn) {
      //   console.log("Push route signature request");

      //   this.$router.push({ name: "royalties-signature" });
    }
    this.loading = false;
  },
  components: {
    LoaderCircle,
    AppHeader,
    AppFooter,
  },
};
</script>
