import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import PubNub from "pubnub";

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
    sessionStorage.setItem("selectedAccountId", value);
    state.selectedAccountId = value;
  },
};

const actions = {
  async publishData() {
    console.log("publishData Action");

    var pubnub = new PubNub({
      userId: "verification-sdk-iframe",
      subscribeKey: "sub-c-b36746ec-a4bf-11ec-8a23-de1bbb7835db",
      publishKey: "pub-c-db6abb24-ed6e-41a2-b2f2-2322e2dcf786",
      logVerbosity: true,
      ssl: true,
      presenceTimeout: 130,
    });

    const accounts = [
      "discord",
      "facebook",
      "reddit",
      "github",
      "twitter",
      "linkedin",
      "google",
    ];

    let userData = {};

    accounts.forEach(
      (a) => (userData[a] = JSON.parse(localStorage.getItem(a + "_user")))
    );

    let message = {
      content: {
        type: "text",
        message: userData,
      },
      sender: "Thomas Anderson",
    };

    pubnub.publish(
      {
        channel: "verification-iframe" + sessionStorage.getItem("uuid"),
        message,
      },
      function (status, response) {
        console.log(status);
        console.log(response);
      }
    );
  },

  async getURLSearchParams({ commit, dispatch }) {
    let urlParams = new URLSearchParams(window.location.search);
    let userData = {},
      nearAccountId = "";

    console.log("url parameters : ", urlParams);
    // get near account id
    if (urlParams.has("account_id")) {
      localStorage.setItem("nearAccount", urlParams.get("account_id"));
    }

    if (urlParams.has("uuid")) {
      sessionStorage.setItem("uuid", urlParams.get("uuid"));
    }

    nearAccountId = localStorage.getItem("nearAccount");
    commit("nearAccount", nearAccountId);

    const selectedAccountId = sessionStorage.getItem("selectedAccountId");
    commit("selectedAccountId", selectedAccountId);

    console.log("Get url c0de ", urlParams.get("code"));

    console.log("provider ", selectedAccountId);

    try {
      let state = urlParams.get("state");
      let code = urlParams.get("code");
      switch (selectedAccountId) {
        case "twitter":
          userData = await dispatch("oauth/getTwitterUserData", {
            state,
            code,
          });
          break;
        case "reddit":
          userData = await dispatch("oauth/getRedditData", {
            code: decodeURIComponent(urlParams.get("code")),
            redirectUrl: window.location.origin,
          });
          break;
        case "github":
          userData = await dispatch("oauth/getGithubData", {
            code: decodeURIComponent(urlParams.get("code")),
            redirectUrl: window.location.origin,
          });
          break;
        case "facebook":
          userData = await dispatch("oauth/getFacebookData", {
            code: decodeURIComponent(urlParams.get("code")),
            redirectUrl: window.location.origin,
          });
          break;
        case "google":
          userData = await dispatch("oauth/getGoogleData", {
            code: decodeURIComponent(urlParams.get("code")),
            redirectUrl: window.location.origin,
          });
          break;
        case "linkedin":
          userData = await dispatch("oauth/getLinkedinData", {
            code: decodeURIComponent(urlParams.get("code")),
            redirectUrl: window.location.origin,
          });
          break;
        case "discord":
          userData = await dispatch("oauth/getDiscordData", {
            code: decodeURIComponent(urlParams.get("code")),
            redirectUrl: window.location.origin,
          });
          break;
        default:
          console.log("getURLSearchParams switch : ", selectedAccountId);
          break;
      }
    } catch (error) {
      console.log("Error getting data :", error);
    }
    return { userData, nearAccountId };
  },

  async connectAccount({ dispatch }, { accountId }) {
    console.log("connectAccount provider", accountId);
    let redirectUrl;
    switch (accountId) {
      case "twitter":
        redirectUrl = await dispatch("twitterConnect");
        break;
      case "discord":
        redirectUrl = await dispatch("oauth/discordConnect");
        break;
      case "reddit":
        redirectUrl = await dispatch("oauth/redditConnect");
        break;
      case "linkedin":
        redirectUrl = await dispatch("oauth/linkedinConnect");
        break;
      case "google":
        redirectUrl = await dispatch("oauth/googleConnect");
        break;
      case "github":
        redirectUrl = await dispatch("oauth/githubConnect");
        break;
      case "facebook":
        redirectUrl = await dispatch("oauth/facebookConnect");
        break;

      default:
        console.log("connect account switch : ", accountId);
        throw "Not Implemented";
    }
    return new Promise((resolve) => {
      // const CLIENT_URL = window.location.origin;
      const popup = window.open(redirectUrl, "popup", "popup=true");
      const checkPopup = setInterval(() => {
        if (popup.window.location.href.includes("success")) {
          popup.close();
        }
        if (!popup || !popup.closed) return;
        clearInterval(checkPopup);
        console.log("popup close check fo data");

        let userData = localStorage.getItem(accountId + "_user");
        console.log("userData", userData);
        if (userData) {
          resolve({ state: "success" });
        }
      }, 1000);
      // window.location.replace(redirectUrl);
    });
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
