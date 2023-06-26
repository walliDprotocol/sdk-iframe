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
            v-if="$route.name.includes('welcome')"
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
          v-if="!$route.name.includes('welcome')"
          class="d-flex flex-column justify-center text-center"
        >
          <h5 class="stepper-title mb-1">{{ appHeaderTitle }}</h5>
          <p class="stepper-display mb-0">Step {{ currentStep }}/{{ totalSteps }}</p>
        </v-col>

        <v-col cols="4" class="d-flex align-center justify-end">
          <NetworkDropdown v-if="walletSelector"></NetworkDropdown>
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
import { getJSONStorage } from "@/plugins/utils";

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
      this.setCurrentStep(to);

      this.$store.commit("stepSuccess", false);

      if (to.path.includes("/royalties")) {
        this.totalSteps = 2;
      }
    },
    stepSuccess(value) {
      if (value) {
        console.log("stepSuccess");
        this.successModifier = 0;
      }
    },
    flow(value) {
      if (value == "celo") {
        this.totalSteps = 2;
      }
    },
    nearAccountId(value) {
      const isLoggedOff = getJSONStorage("session", "isLoggedOff");
      console.log("isLoggedOff nearAccountId", isLoggedOff);

      if (value && !isLoggedOff.value) {
        this.totalSteps = 2;
      }
    },
  },
  computed: {
    ...mapState(["selectedAccountId", "stepSuccess"]),
    ...mapGetters("near", ["nearAccountId"]),
    ...mapState("near", ["walletSelector", "nearAccount"]),
    ...mapState("royalty", ["verifySuccess"]),
    ...mapGetters(["flow"]),

    appHeaderTitle() {
      if (this.flow == "celo" || this.$route?.meta?.title) {
        console.log("meta title", this.$route?.meta);
        return this.$route?.meta?.title;
      }

      const titlesList = [
        "Verify social network",
        "Import wallet account",
        "Connect social account to your wallet",
      ];
      return this.verifySuccess ? "Success!" : titlesList[this.currentStep - 1];
    },
    cssVars() {
      return {
        "--currentStep": this.currentStep,
        "--totalSteps": this.totalSteps,
        "--successModifier": this.successModifier,
      };
    },
  },
  methods: {
    recursiveChildrenSearch(routes, name) {
      for (let route of routes) {
        if (route.name === name) return route.children;
      }
    },
    setCurrentStep() {
      let currentRoutes = this.recursiveChildrenSearch(this.$router.options.routes, "MintbaseFlow");

      this.currentStep =
        this.$route?.meta?.step || currentRoutes.findIndex(({ name }) => name === this.$route.name);

      const isLoggedOff = getJSONStorage("session", "isLoggedOff");
      console.log("isLoggedOff nearAccountId", isLoggedOff);

      if (this.nearAccountId && !isLoggedOff.value) {
        this.totalSteps = 2;
        this.currentStep =
          this.currentStep > this.totalSteps ? this.totalSteps : this.currentStep - 1;
      } else {
        this.currentStep = this.currentStep > this.totalSteps ? this.totalSteps : this.currentStep;
      }

      this.successModifier = this.stepSuccess ? 0 : 1; //this.currentStep > this.totalSteps ? 0 : 1;
    },
  },
  mounted() {
    this.setCurrentStep();
  },
  components: {
    NetworkDropdown,
  },
  data() {
    return {
      currentStep: 0,
      successModifier: 1,
      totalSteps: 3,
    };
  },
};
</script>

<style lang="scss">
.iframe-app-bar .v-toolbar__content {
  background: white;
  .stepper-title {
    color: var(--midnight);
  }
  .stepper-display {
    color: var(--grey);
  }

  .stepper-title,
  .stepper-display {
    font-family: Roobert;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
  }
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
    width: calc((var(--currentStep) - var(--successModifier)) * calc(100vw / var(--totalSteps)));
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
