<template>
  <div>
    <!-- <LoaderCircle :loading="loading"></LoaderCircle> -->
    <router-view />
  </div>
</template>
<script>
import { getJSONStorage } from "@/plugins/utils";
import { mapState } from "vuex";
// import LoaderCircle from "@/components/LoaderCircle.vue";

export default {
  name: "GeneralVerificationFlow",
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    ...mapState("near", ["walletSelector", "nearAccount"]),
  },
  async created() {
    const { state, code } = await this.$store.dispatch("getURLSearchParams");

    this.getOauthDataQuery = { state, code };
  },

  async mounted() {
    // this will store a wallet access keys in browser's local  storage
    await this.$store.dispatch("near/initNear");

    // console.log(await this.walletSelector.wallet());
    // console.log(this.walletSelector?.isSignedIn());
    if (this.$route.name == "NearPopup") {
      return;
    }

    // const { userData, nearAccountId } = await this.$store.dispatch("getURLSearchParams");
    const hasUserData = await this.$store.dispatch("getOauthData", this.getOauthDataQuery);

    if (hasUserData) {
      //check if the flow is for royalties flow
      if (this.isRoyaltyFlow) {
        // push to create wallet now
        this.$router.push("/connect");
      } else {
        console.log("Push route success");
        // Push success screen
        this.$router.push("/?success=" + this.selectedAccountId);
        localStorage.setItem("@wallid:oauth:state", 2);
        this.hasData = getJSONStorage("local", this.selectedAccountId + "_user");
        console.log("hasData", this.hasData);
        if (this.hasData) {
          this.$router.push("/success");
          this.loading = false;
        }
        return;
      }
    }
    console.log("Connect", this.walletSelector?.isSignedIn);
    if (this.walletSelector?.isSignedIn) {
      this.$router.push("/select");
    } else {
      this.$router.push("/");
    }
    this.loading = false;
  },
  components: {
    // LoaderCircle,
  },
};
</script>
