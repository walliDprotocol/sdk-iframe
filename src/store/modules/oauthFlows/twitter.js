import axios from "axios";

const TWITTER_INFO =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/redirect/twitter";

export default {
  async getTwitterUserData({ dispatch }, { code, state }) {
    console.log("*** getTwitterUserData");
    let urlParams = new URLSearchParams(window.location.search);
    let userData = {};

    // get twitter oauth params
    const preAuth = JSON.parse(localStorage.getItem("twitter_preAuth"));
    console.log("pre Auth tokens ", preAuth, code, state);

    const localUserData = JSON.parse(localStorage.getItem("twitter_user"));
    if ("username" in localUserData) {
      userData = localUserData;
    } else if (state && code && preAuth) {
      let state = urlParams.get("state");
      let code = urlParams.get("code");
      console.log("oauth_state: ", state);
      console.log("oauth_code: ", code);

      console.log("twitter_preAuth : ", preAuth);
      userData = await dispatch("getTwitterUsername", {
        state,
        code,
        codeVerifier: preAuth.codeVerifier,
      });
    }

    return userData;
  },
  async getTwitterUsername(_, { state, code, codeVerifier }) {
    console.log("***** Get twitter username *****  ");

    let userData = {};
    try {
      let response = await axios.post(TWITTER_INFO, {
        state: state,
        code: code,
        codeVerifier: codeVerifier,
      });
      console.log("response from twitter login: ", response.data);

      userData = {
        username: response.data.username,
        name: response.data.name,
        id: response.data.id,
      };
      localStorage.setItem("twitter_user", JSON.stringify(userData));
    } catch (error) {
      console.log("error twitter login: ", error);
      throw error;
    }

    return userData;
  },
};
