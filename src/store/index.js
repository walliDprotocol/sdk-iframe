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
    let userData = {},
      nearAccountId;

    console.log(urlParams);
    // get near account id
    if (urlParams.has("account_id")) {
      localStorage.setItem("nearAccount", urlParams.get("account_id"));
    }

    nearAccountId = localStorage.getItem("nearAccount");
    commit("nearAccount", nearAccountId);
    // get current selectedAccount

    const selectedAccountId = sessionStorage.getItem("selectedAccountId");
    console.log("select account id ", selectedAccountId);

    commit("selectedAccountId", selectedAccountId);

    console.log(selectedAccountId);
    switch (selectedAccountId) {
      case "twitter":
        userData = await dispatch("oauth/getTwitterUserData");
        break;
      case "reddit":
        userData = await dispatch("oauth/getRedditData");
        break;
      case "github":
        userData = await dispatch("oauth/getGithubData");
        break;
      case "facebook":
        userData = await dispatch("oauth/getFacebookData");
        break;
      case "google":
        userData = await dispatch("oauth/getGoogleData");
        break;

      default:
        break;
    }

    return { userData, nearAccountId };
  },

  async connectAccount({ dispatch }, { accountId }) {
    console.log("connectAccount", accountId);
    switch (accountId) {
      case "twitter":
        await dispatch("twitterConnect");
        break;
      case "discord":
        await dispatch("oauth/discordConnect");
        break;
      case "reddit":
        await dispatch("oauth/redditConnect");
        break;
      case "linkedin":
        await dispatch("oauth/linkedinConnect");
        break;
      case "google":
        await dispatch("oauth/googleConnect");
        break;
      case "github":
        await dispatch("oauth/githubConnect");
        break;
      case "facebook":
        await dispatch("oauth/facebookConnect");
        break;

      default:
        throw "Not Implemented";
    }
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
