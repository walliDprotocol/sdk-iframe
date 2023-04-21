<template>
  <v-app-bar
    class="iframe-app-bar"
    :style="cssVars"
    app
    elevation="0"
    color="transparent"
    height="74"
  >
    <v-container>
      <v-row class="justify-space-between">
        <v-col cols="4" class="d-flex justify-start">
          <v-img
            v-if="$route.name == 'royalties-welcome'"
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="/logos/wallid.webp"
            transition="scale-transition"
            width="115"
          />
        </v-col>

        <v-col
          cols="4"
          v-if="$route.name != 'royalties-welcome'"
          class="d-flex flex-column justify-center text-center"
        >
          <h5>{{ appHeaderTitle }}</h5>
          <p class="stepper-display mb-0">Step {{ currentStep }}/3</p>
        </v-col>

        <v-col cols="4" class="d-flex align-center">
          <NetworkDropdown></NetworkDropdown>
          <p v-if="nearAccountId" class="account-id mb-0">
            <span>&bull;</span>{{ nearAccountId | truncate(16) }}
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import NetworkDropdown from "@/components/NetworkDropdown";

export default {
  name: "AppHeader",
  filters: {
    truncate(text = "", length = 4, clamp = "...") {
      const content = text ? text.toString() : "";
      return content.length > length
        ? content.slice(0, length - 4) + clamp + content.slice(content.length - 4, content.length)
        : content;
    },
  },
  watch: {
    $route(to) {
      let currentRoutes = this.recursiveChildrenSearch(this.$router.options.routes, "MintbaseFlow");
      this.currentStep = currentRoutes.findIndex(({ name }) => name === to.name);
    },
  },
  computed: {
    ...mapState(["selectedAccountId"]),
    ...mapGetters("near", ["nearAccountId"]),
    ...mapState("near", ["walletSelector", "nearAccount"]),

    appHeaderTitle() {
      const titlesList = [
        "Connect to social network",
        "Create wallet",
        "Connect social account to your wallet",
      ];
      return titlesList[this.currentStep - 1];
    },
    cssVars() {
      return {
        "--currentStep": this.currentStep,
      };
    },
  },
  methods: {
    recursiveChildrenSearch(routes, name) {
      for (let route of routes) {
        if (route.name === name) return route.children;
      }
    },
  },
  mounted() {
    let currentRoutes = this.recursiveChildrenSearch(this.$router.options.routes, "MintbaseFlow");
    this.currentStep = currentRoutes.findIndex(({ name }) => name === this.$route.name);
  },
  components: {
    NetworkDropdown,
  },
  data() {
    return {
      currentStep: 0,
    };
  },
};
</script>

<style lang="scss">
.iframe-app-bar .v-toolbar__content {
  &::after {
    content: "";
    background: #f4f4f4;
    height: 2px;
    width: 100vw;
    position: absolute;
    bottom: 0;
  }
  &::before {
    content: "";
    background: linear-gradient(90deg, #64ffde 0%, #73dde7 50%, #7acefd 100%);
    height: 2px;
    width: calc(var(--currentStep) * 25vw);
    position: absolute;
    bottom: 0;
    z-index: 1;
    left: 0;
  }

  justify-content: center;
  padding: 0;

  .container {
    padding: 4px 30px;
  }
}
</style>
