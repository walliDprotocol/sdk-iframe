<template>
  <v-app class="verification-iframe">
    <v-main>
      <router-view v-if="!loading" class="router-view px-7" style="height: 100%" />
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
import { getStorageFields } from "./plugins/utils";
// import { getJSONStorage } from "./plugins/utils";

export default {
  name: "App",
  computed: {
    ...mapState(["selectedAccountId"]),
    ...mapState("near", ["walletSelector", "nearAccount"]),
    isSignedIn() {
      return this.walletSelector?.isSignedIn();
    },
  },
  async created() {
    let { state, code, flow } = await this.$store.dispatch("getURLSearchParams");
    // try to get this values from local storage
    flow ??= (await getStorageFields(["configId", "flow"])).flow;

    console.log("flow", flow, state, code);
    if (flow == "celo") {
      this.$router.push("Celo");
    }
    this.loading = false;
  },
  data() {
    return {
      loading: true,
      hasData: false,
      getOauthDataQuery: {},
    };
  },
  watch: {},
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
