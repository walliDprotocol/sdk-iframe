import Vue from "vue";
import Vuex from "vuex";
import PubNub from "pubnub";

import * as modules from "./modules";
import { getJSONStorage } from "@/plugins/utils";

const TWITTER_LOGIN =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/redirect/login/twitter";

const ACCOUNTS_LIST = [
  "discord",
  "facebook",
  "reddit",
  "github",
  "twitter",
  "linkedin",
  "google",
  "nearTokens",
];

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
  // Send localStorage data trough pubnub to iframe opener
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

    let userData = {};

    ACCOUNTS_LIST.forEach(
      (a) => (userData[a] = getJSONStorage("local", a + "_user"))
    );

    console.log("UserData to send to client:", userData);

    let message = {
      content: {
        type: "text",
        message: userData,
      },
      sender: "Thomas Anderson",
    };

    pubnub.publish(
      {
        channel: "verification-iframe-" + sessionStorage.getItem("uuid"),
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
    nearAccountId = localStorage.getItem("nearAccount");
    commit("nearAccount", nearAccountId);

    if (urlParams.has("uuid")) {
      sessionStorage.setItem("uuid", urlParams.get("uuid"));
    }

    const selectedAccountId = sessionStorage.getItem("selectedAccountId");
    commit("selectedAccountId", selectedAccountId);

    console.log("provider ", selectedAccountId);

    try {
      let state = urlParams.get("state");
      let code = urlParams.get("code");

      if (!ACCOUNTS_LIST.includes(selectedAccountId)) {
        throw (
          "Error getURLSearchParams : Not Implemented => " + selectedAccountId
        );
      }

      // Get the user Oauth url from API using oauth tokens
      userData = await dispatch("oauth/getOauthData", {
        state,
        code,
        account: selectedAccountId,
        redirectUrl: window.location.origin,
      });
    } catch (error) {
      console.log("Error getting data :", error);
      // Fail silently
      // throw error;
    }
    return { userData, nearAccountId };
  },

  async connectAccount({ dispatch }, { accountId }) {
    console.log("connectAccount provider", accountId);
    let redirectUrl;

    if (!ACCOUNTS_LIST.includes(accountId)) {
      console.log("Error connectAccount : Not Implemented => ", accountId);
      throw "Not Implemented";
    }

    if ("nearTokens" == accountId) {
      dispatch("setNearTokensUserData", { accountId });
      return { state: "success" };
    }

    // Get the redirect url from API
    redirectUrl = await dispatch("oauth/getRedirectURL", accountId);

    //Set localstorage state to know when to check data
    localStorage.setItem("@wallid:oauth:state", 1);

    return new Promise((resolve) => {
      console.log("## redirectUrl : ", redirectUrl);

      // const CLIENT_URL = window.location.origin;
      const popup = window.open(
        redirectUrl,
        "popup",
        "width=600,height=600,toolbar=no,menubar=no"
      );
      console.log(popup);

      const checkPopup = setInterval(() => {
        if (popup.window.location.href.includes("?success=" + accountId)) {
          popup.close();
        }

        if (!popup || !popup.closed || popup.location.host.includes("twitter"))
          return;
        console.log("popup close check for data " + accountId);

        let userData = localStorage.getItem(accountId + "_user");
        if (
          userData !== null &&
          localStorage.getItem("@wallid:oauth:state") == 2
        ) {
          console.log("userData", userData);
          clearInterval(checkPopup);
          popup.close();
          resolve({ state: "success" });
        }
      }, 1000);
    });
  },
  async setNearTokensUserData({ state, dispatch }, { accountId }) {
    const { available: nearBalance } = await dispatch("near/getAccountBalance");

    const userData = {
      accountId: state.nearAccount,
      balance: nearBalance,
    };
    localStorage.setItem(`${accountId}_user`, JSON.stringify(userData));
  },
};
export default new Vuex.Store({
  state,
  getters: {},
  mutations,
  actions,
  modules,
});
