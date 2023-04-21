<template>
  <v-app class="verification-iframe">
    <v-main>
      <router-view class="router-view px-7" style="height: 100%" />
    </v-main>
    <!-- <div class="popup-info" v-if="hasData">
      <p class="normal-text-p">
        To proceed, please close this window and return to the verification
        page.
      </p>
    </div> -->
  </v-app>
</template>

<script>
import { mapState } from "vuex";
// import { getJSONStorage } from "./plugins/utils";

export default {
  name: "App",
  computed: {
    ...mapState(["selectedAccountId"]),
    ...mapState("near", ["walletSelector", "nearAccount"]),
    isSignedIn() {
      return this.walletSelector?.isSignedIn();
    },
    nearAccountId() {
      return this.nearAccount?.name || this.nearAccount?.accountId;
    },
  },
  data() {
    return {
      loading: true,
      hasData: false,
      getOauthDataQuery: {},
    };
  },
  watch: {
    // nearAccountId(value) {
    //   if (value) {
    //     this.$router.push("/home");
    //   }
    // },
  },
  methods: {
    async signOut() {
      // await this.$store.dispatch("near/signOut");
      // this.$router.push("/");
    },
  },
};
</script>

<style lang="scss">
.popup-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
  max-width: 260px;
  text-align: center;
}
#app {
  // background-image: url("../public/background/background-gradient.jpg");
  background-size: cover;
}

.router-view {
  transition: opacity 0.25s ease-in-out;
}
.router-view.loading {
  opacity: 0;
}

.account-id {
  display: inline-block;
  padding: 2px 8px 2px 18px;
  border-radius: 11px;
  background-color: var(--light-grey);
  font-size: 11px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: var(--midnight);
  position: relative;
  span {
    font-size: 30px;
    color: #00e284;
    position: absolute;
    top: -12px;
    left: 6px;
  }
}
</style>
