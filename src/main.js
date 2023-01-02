import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PubNubVue from "pubnub-vue";
import vuetify from "./plugins/vuetify";
import "@babel/polyfill";

import "./assets/css/vars.scss";
import "./assets/css/main.scss";

// https://www.pubnub.com/docs/sdks/vue
Vue.use(PubNubVue, {
  subscribeKey: "YOUR SUBSCRIBE KEY HERE",
  publishKey: "YOUR PUBLISH KEY HERE",
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
