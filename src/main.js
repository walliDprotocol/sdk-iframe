import Vue from "vue";
import App from "./App.vue";
import { router } from "./router";
import { store } from "./store";
import vuetify from "./plugins/vuetify";
import "@babel/polyfill";

import "./assets/css/vars.scss";
import "./assets/css/main.scss";

// https://www.pubnub.com/docs/sdks/vue

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
