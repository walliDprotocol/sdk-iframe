<template>
  <v-app class="verification-iframe">
    <v-app-bar
      class="iframe-app-bar"
      app
      elevation="0"
      color="transparent"
      height="74"
    >
      <v-container>
        <v-row>
          <v-col class="d-flex justify-start">
            <v-img
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              :src="'./logos/wallid.webp'"
              transition="scale-transition"
              width="115"
            />
          </v-col>
          <v-spacer />
          <v-col v-if="nearAccount">
            <p class="account-id"><span>&bull;</span>{{ nearAccount }}</p>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view class="router-view px-7" :class="{ loading }" />
    </v-main>
    <div class="popup-info" v-if="hasData">
      <p class="normal-text-p">
        To proceed, please close this window and return to the verification
        page.
      </p>
    </div>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import { getJSONStorage } from "./plugins/utils";

export default {
  name: "App",

  computed: {
    ...mapState(["nearAccount", "selectedAccountId"]),
  },
  data() {
    return {
      loading: true,
      hasData: true,
    };
  },
  async mounted() {
    // this will store a wallet access keys in browser's local  storage
    await this.$store.dispatch("near/initNear");

    if (this.$route.name == "NearPopup") {
      return;
    }

    const { userData, nearAccountId } = await this.$store.dispatch(
      "getURLSearchParams"
    );

    console.log("APP", userData, this.selectedAccountId);

    const userDataQuery = {
      discord: "id",
      facebook: "id",
      reddit: "name",
      github: "login",
      twitter: "username",
      linkedin: "localizedFirstName",
      google: "id",
    };

    console.log("###test query### ", userDataQuery[this.selectedAccountId]);

    if (
      userDataQuery[this.selectedAccountId] in userData &&
      localStorage.getItem("@wallid:oauth:state") == 1
    ) {
      console.log("Push route success", userData);

      // Push success screen
      this.$router.push("/?success=" + this.selectedAccountId);
      localStorage.setItem("@wallid:oauth:state", 2);
      this.hasData = getJSONStorage("local", this.selectedAccountId + "_user");

      return;
    }

    console.log("Connect", userData, nearAccountId);

    if (nearAccountId) {
      this.$router.push("/home");
    }
    // this.loading = false;
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
  display: inline;
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
