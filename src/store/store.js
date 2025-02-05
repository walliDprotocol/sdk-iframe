import Vue from "vue";
import Vuex from "vuex";
import PubNub from "pubnub";
// import NearAPI from "@/plugins/near";

import * as modules from "./modules";
import { getJSONStorage } from "@/plugins/utils";
import near from "@/plugins/near";
import axios from "axios";

// import router from "@/router";

const CONFIG_URL = (configId) =>
  `${process.env.VUE_APP_BACKEND_URL}/api/v1/config/byId?configId=${configId}`;

const ACCOUNTS_LIST = [
  "discord",
  "facebook",
  "reddit",
  "github",
  "twitter",
  "linkedin",
  "google",
  "nearTokens",
  "usdcToken",
];

Vue.use(Vuex);

const state = {
  nearAccount: null,
  selectedAccountId: {},
  selectedNetwork: {},
  accountIds: [],
  web3TokensList: [],
  flow: null,
  chainId: null,
  stepSuccess: null,
  stepperTitle: "",
};
const mutations = {
  forceStepperTitle(state, value) {
    state.stepperTitle = value;
  },
  stepSuccess(state, value) {
    state.stepSuccess = value;
  },
  setChainId(state, value) {
    state.chainId = value;
  },
  setWeb3Tokens(state, value) {
    state.web3TokensList = value;
  },
  setFlow(state, value) {
    state.flow = value;
  },
  setAccountIds(state, value) {
    state.accountIds = value;
  },
  nearAccount(state, value) {
    state.nearAccount = value;
  },
  selectedAccountId(state, value) {
    sessionStorage.setItem("selectedAccountId", value);
    state.selectedAccountId = value;
  },
  setNetwork(state, value) {
    localStorage.setItem("selectedNetwork", JSON.stringify(value));
    state.selectedNetwork = value;
  },
};

const getters = {
  flow(state) {
    return state.flow;
  },
  selectedNetwork(state) {
    return state.selectedNetwork;
  },
  selectedAccountId(state) {
    return state.selectedAccountId;
  },
};
const actions = {
  async getConfig(_, { configId }) {
    // CONFIG_URL
    // return await axios.get("/userDataRoyalties.json");
    return await axios.get(CONFIG_URL(configId));
  },

  async changeNetwork({ state, commit, getters }, selectedNetwork) {
    const accountId = getters["near/nearAccountId"];

    console.log("nearAccount", accountId);
    console.log("state.selectedNetwork.id", state.selectedNetwork.id);
    console.log("selectedNetwork.id", selectedNetwork.id);
    if (selectedNetwork.id !== state.selectedNetwork.id && accountId) {
      console.log("**removing key**");
      localStorage.removeItem("near_app_wallet_auth_key");

      // await NearAPI.init(selectedNetwork.id);

      // router.push("/");
      window.location = "/";
    }
    commit("setNetwork", selectedNetwork);

    //TODO: change near network (reload)
  },

  async getAccountBalance(
    { getters },
    { IdName: selectedIdName, IdNameDesc, contractType, contractAddress }
  ) {
    console.log("getAccountBalance: ", { selectedIdName, contractType, contractAddress });
    try {
      if (contractType == "ERC20") {
        const accountId = getters["near/nearAccountId"];
        console.log(accountId);
        const res = await near.viewMethod({
          contractId: contractAddress,
          method: "ft_balance_of",
          args: { account_id: accountId },
        });

        console.log("res", res);

        return res;
      }

      if (selectedIdName == "nearTokens") {
        const accountId = getters["near/nearAccountId"];
        const res = await near.getNativeBalance({
          accountId,
        });
        return res;
      }
    } catch (error) {
      console.error(error);
      throw new Error(`It was not possible to verify ${IdNameDesc} possessions`);
    }
  },

  async setERC20TokensUserData({ dispatch, getters }, selectedAccount) {
    const accountId = getters["near/nearAccountId"];

    const balance = await dispatch("getAccountBalance", selectedAccount);

    const userData = {
      accountId,
      balance: balance,
    };
    localStorage.setItem(`${selectedAccount.IdName}_user`, JSON.stringify(userData));
  },
  emitClose() {
    var pubnub = new PubNub({
      userId: process.env.VUE_APP_PUBNUB_USER_ID,
      subscribeKey: process.env.VUE_APP_PUBNUB_SUBSCRIBE_KEY,
      publishKey: process.env.VUE_APP_PUBLISH_KEY,
      logVerbosity: true,
      ssl: true,
      presenceTimeout: 130,
    });
    const message = { event: "close-iframe" };
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
  // Send localStorage data trough pubnub to iframe opener
  async publishData(_, { data } = {}) {
    console.log("publishData Action");

    var pubnub = new PubNub({
      userId: process.env.VUE_APP_PUBNUB_USER_ID,
      subscribeKey: process.env.VUE_APP_PUBNUB_SUBSCRIBE_KEY,
      publishKey: process.env.VUE_APP_PUBLISH_KEY,
      logVerbosity: true,
      ssl: true,
      presenceTimeout: 130,
    });

    let userData = {};
    if (!data) {
      ACCOUNTS_LIST.forEach((a) => (userData[a] = getJSONStorage("local", a + "_user")));
    } else {
      userData = { ...data };
    }

    let message = {
      ...userData,
    };
    console.log("UserData to send to client:", message);

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

  getURLSearchParams() {
    return new Promise((resolve) => {
      let urlParams = new URLSearchParams(window.location.search);

      const allowedParamsObj = {};

      console.log("url parameters : ", urlParams);

      const allowedParameters = ["account_id", "uuid", "state", "code", "nft", "flow", "configId"];
      const localStorageParamsMap = { account_id: "nearAccount" };
      const sessionStorageParamsMap = {
        uuid: "uuid",
        nft: "nftPostId",
        flow: "flow",
        configId: "configId",
      };

      for (let param of urlParams.keys()) {
        if (allowedParameters.includes(param)) {
          allowedParamsObj[param] = urlParams.get(param);

          if (param in localStorageParamsMap) {
            localStorage.setItem(localStorageParamsMap[param], urlParams.get(param));
          }
          if (param in sessionStorageParamsMap) {
            sessionStorage.setItem(sessionStorageParamsMap[param], urlParams.get(param));
          }
        }
      }

      console.log("allowedParamsObj :", allowedParamsObj);

      resolve(allowedParamsObj);
    });
  },

  async getOauthData({ dispatch, commit }, { state, code, redirectPath }) {
    const userData = {};
    const selectedAccountId = sessionStorage.getItem("selectedAccountId");
    commit("selectedAccountId", selectedAccountId);
    console.log("selectedAccountId ", selectedAccountId);

    try {
      if (!ACCOUNTS_LIST.includes(selectedAccountId)) {
        throw "Error getOauthData : Not Implemented => " + selectedAccountId;
      }

      // Get the user Oauth url from API using oauth tokens
      Object.assign(
        userData,
        await dispatch("oauth/getOauthData", {
          state,
          code,
          account: selectedAccountId,
          redirectPath,
        })
      );
    } catch (error) {
      console.log("Error getting data :", error);
      // Fail silently
      // throw error;
    }

    console.log("APP", userData, selectedAccountId);
    const userDataQuery = {
      discord: "id",
      facebook: "id",
      reddit: "name",
      github: "login",
      twitter: "username",
      linkedin: "localizedFirstName",
      google: "id",
    };
    console.log("###test query### ", userDataQuery[selectedAccountId]);

    // return  userData;
    return (
      userDataQuery[selectedAccountId] in userData &&
      localStorage.getItem("@wallid:oauth:state") == 1
    );
  },

  async getOauthDataStorage({ commit }, { selectedAccount }) {
    const userData = {};
    const selectedAccountId = selectedAccount || sessionStorage.getItem("selectedAccountId");
    commit("selectedAccountId", selectedAccountId);
    console.log("selectedAccountId ", selectedAccountId, selectedAccount);

    try {
      if (!ACCOUNTS_LIST.includes(selectedAccountId)) {
        throw "Error getOauthDataStorage : Not Implemented => " + selectedAccountId;
      }

      // Get the user Oauth url from API using oauth tokens
      Object.assign(userData, await getJSONStorage("local", `${selectedAccountId}_user`));
    } catch (error) {
      console.log("Error getting data :", error);
      // Fail silently
      // throw error;
    }

    console.log("getOauthDataStorage data", userData, selectedAccountId);
    const userDataQuery = {
      discord: "id",
      facebook: "id",
      reddit: "name",
      github: "login",
      twitter: "username",
      linkedin: "localizedFirstName",
      google: "id",
    };
    console.log("###test query### ", userDataQuery[selectedAccountId]);

    // return  userData;
    return {
      userData,
      hasUserData: userDataQuery[selectedAccountId] in userData,
    };
  },

  async connectAccount({ dispatch }, { selectedAccount, redirectPath }) {
    const selectedId = selectedAccount.IdName;
    const contractType = selectedAccount.contractType;
    console.log("connectAccount provider", selectedId);
    let redirectUrl;

    if (!ACCOUNTS_LIST.includes(selectedId)) {
      console.log("Error connectAccount : Not Implemented => ", selectedId);
      throw "Not Implemented";
    }

    if ("ERC20" == contractType) {
      await dispatch("setERC20TokensUserData", {
        ...selectedAccount,
        selectedAccount: selectedId,
      });
      return { state: "success" };
    }

    if ("nearTokens" == selectedId) {
      await dispatch("setNearTokensUserData", selectedAccount);
      return { state: "success" };
    }

    // Get the redirect url from API
    redirectUrl = await dispatch("oauth/getRedirectURL", { selectedId, redirectPath });

    //Set localstorage state to know when to check data
    localStorage.setItem("@wallid:oauth:state", 1);

    // return new Promise((resolve) => {
    console.log("## redirectUrl : ", redirectUrl);
    window.location = redirectUrl;
    return { state: "connecting" };
    // const CLIENT_URL = window.location.origin;
    // const popup = window.open(
    //   redirectUrl,
    //   "popup",
    //   "width=600,height=600,toolbar=no,menubar=no"
    // );
    // console.log(popup);

    // const checkPopup = setInterval(() => {
    //   if (popup.window.location.href.includes("?success=" + selectedId)) {
    //     popup.close();
    //   }

    //   if (!popup || !popup.closed || popup.location.host.includes("twitter"))
    //     return;
    //   console.log("popup close check for data " + selectedId);

    //   let userData = localStorage.getItem(selectedId + "_user");
    //   if (
    //     userData !== null &&
    //     localStorage.getItem("@wallid:oauth:state") == 2
    //   ) {
    //     console.log("userData", userData);
    //     clearInterval(checkPopup);
    //     popup.close();
    //     resolve({ state: "success" });
    //   }
    // }, 1000);
    // });
  },
  async setNearTokensUserData({ dispatch, getters }, selectedAccount) {
    const balance = await dispatch("getAccountBalance", selectedAccount);

    const accountId = getters["near/nearAccountId"];

    const userData = {
      accountId: accountId,
      balance,
    };
    localStorage.setItem(`${selectedAccount.IdName}_user`, JSON.stringify(userData));
  },
};
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules,
});
