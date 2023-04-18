<template>
  <v-app class="verification-iframe">
    <v-app-bar class="iframe-app-bar" app elevation="0" color="transparent" height="74">
      <v-container>
        <v-row>
          <v-col class="d-flex justify-start">
            <v-img
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              src="/logos/wallid.webp"
              transition="scale-transition"
              width="115"
            />
          </v-col>
          <v-spacer />
          <NetworkDropdown></NetworkDropdown>
          <v-col cols="auto" v-if="nearAccountId">
            <p class="account-id mb-0" @click="signOut"><span>&bull;</span>{{ nearAccountId }}</p>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view class="router-view px-7" />
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
import NetworkDropdown from "./components/NetworkDropdown.vue";
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

  components: { NetworkDropdown },
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
  background-image: url("../public/background/background-gradient.jpg");
  background-size: cover;
}
.iframe-app-bar .v-toolbar__content {
  border-bottom: solid 2px #f4f4f4;
  justify-content: center;

  padding: 0;

  .container {
    padding: 4px 30px;
  }
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
