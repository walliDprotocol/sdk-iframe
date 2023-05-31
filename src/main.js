import Vue from "vue";
import App from "./App.vue";
import { router } from "./router";
import { store } from "./store";
import i18n from "./plugins/i18n";
import vuetify from "./plugins/vuetify";
import "@babel/polyfill";

import "./assets/css/vars.scss";
import "./assets/css/main.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  i18n,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
