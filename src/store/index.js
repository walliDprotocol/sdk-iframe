import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import * as modules from "./modules";

const TWITTER_LOGIN =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/redirect/login/twitter";

const DISCORD_AUTH =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/authcode/discord";

console.log(TWITTER_LOGIN);

Vue.use(Vuex);

const state = { nearAccount: null, selectedAccountId: {} };
const mutations = {
  nearAccount(state, value) {
    state.nearAccount = value;
  },
  selectedAccountId(state, value) {
    state.selectedAccountId = value;
  },
};

const actions = {
  async getURLSearchParams({ commit, dispatch }) {
    let urlParams = new URLSearchParams(window.location.search);

    console.log(urlParams);
    // get near account id
    if (urlParams.has("account_id")) {
      localStorage.setItem("nearAccount", urlParams.get("account_id"));
    }

    commit("nearAccount", localStorage.getItem("nearAccount"));

    // get current selectedAccount

    const selectedAccountId = sessionStorage.getItem("selectedAccountId");

    commit("selectedAccountId", selectedAccountId);

    console.log(selectedAccountId);
    let userData = {};
    switch (selectedAccountId) {
      case "twitter":
        userData = await dispatch("oauth/getTwitterUserData");
        break;

      default:
        break;
    }

    return { userData };
  },

  async twitterConnect() {
    // const headers = {
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "GET,POST,DELETE",
    //   "Access-Control-Allow-Headers":
    //     "Origin, X-Requested With, Content-Type, Accept",
    // };
    let twitterPreAuthURL;

    try {
      let response = await axios.get(TWITTER_LOGIN);
      console.log("get from axios ", response.data);
      if (response?.data?.redirect) {
        twitterPreAuthURL = response.data;
        localStorage.setItem(
          "twitter_preAuth",
          JSON.stringify(twitterPreAuthURL)
        );
        console.log("twitterPreAuthURL: ", twitterPreAuthURL);
        // window.location = response.data.redirect;
        window.location.replace(twitterPreAuthURL.redirect);
        // win
        //  this.redirect_url = response.data.redirect;
        //  this.dialog=true;
      }
    } catch (error) {
      console.log("error twitter login: ", error);
      throw error;
    }
    return twitterPreAuthURL;
  },

  async discordConnect() {
    // const headers = {
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "GET,POST,DELETE",
    //   "Access-Control-Allow-Headers":
    //     "Origin, X-Requested With, Content-Type, Accept",
    // };
    let twitterPreAuthURL;

    try {
      let response = await axios.get(DISCORD_AUTH);
      console.log("get from axios ", response.data);
      if (response?.data?.redirect) {
        twitterPreAuthURL = response.data;
        localStorage.setItem(
          "twitter_preAuth",
          JSON.stringify(twitterPreAuthURL)
        );
        console.log("twitterPreAuthURL: ", twitterPreAuthURL);
        // window.location = response.data.redirect;
        window.location.replace(twitterPreAuthURL.redirect);
        // win
        //  this.redirect_url = response.data.redirect;
        //  this.dialog=true;
      }
    } catch (error) {
      console.log("error twitter login: ", error);
      throw error;
    }
    return twitterPreAuthURL;
  },
};
export default new Vuex.Store({
  state,
  getters: {},
  mutations,
  actions,
  modules,
});
