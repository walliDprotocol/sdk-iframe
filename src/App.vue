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
              :src="require('./assets/logos/wallid.webp')"
              transition="scale-transition"
              width="115"
            />
          </v-col>
          <v-spacer />
          <v-col v-if="nearAccount">
            <p class="bold-text-p">AccountId</p>
            {{ nearAccount }}
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view class="router-view px-7" />
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "App",

  computed: {
    ...mapState(["nearAccount", "selectedAccountId"]),
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

    console.log("Home", userData, this.selectedAccountId);

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

    if (userDataQuery[this.selectedAccountId] in userData) {
      console.log("Push route success", userData);

      // Push success screen
      this.$router.push("/success");
      return;
    }

    console.log("Connect", userData, nearAccountId);

    if (nearAccountId) {
      this.$router.push("/home");
    }
  },
};
</script>

<style lang="scss">
#app {
  background: url("./assets/background/background-gradient.jpg");
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
</style>
