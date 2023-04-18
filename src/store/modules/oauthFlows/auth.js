import { getJSONStorage } from "@/plugins/utils";
import axios from "axios";

const redirectURL = (account) => process.env.VUE_APP_BACKEND_URL + `/api/v1/${account}/requestURL`;
const oauthDataURL = (account) => process.env.VUE_APP_BACKEND_URL + `/api/v1/${account}/authcode`;

export default {
  async getOauthData(_, { code, state, redirectPath, account }) {
    console.log("***  getOauthDataURL data", arguments);
    const userData = {};
    try {
      if (code == null || !code) return { userData: {} };

      // For twitter we need this code
      let { codeVerifier } = getJSONStorage("local", "twitter_preAuth");

      console.log("codeVerifier ", codeVerifier);

      let { data } = await axios.post(oauthDataURL(account), {
        code,
        state,
        redirectUrl: window.location.origin + redirectPath,
        codeVerifier,
      });
      console.log("response getOauthDataURL login: ", data);

      Object.assign(userData, data?.userInfo);

      if (Object.keys(userData).length == 0) throw "No data to store";

      localStorage.setItem(`${account}_user`, JSON.stringify(userData));
    } catch (error) {
      console.log("error getOauthDataURL login: ", error);
      throw error;
    }

    return userData;
  },
  async getRedirectURL(_, { selectedId, redirectPath }) {
    console.log("***** getRedirectURL *****  ", redirectPath);

    try {
      let { data } = await axios.get(redirectURL(selectedId), {
        params: {
          redirectUrl: window.location.origin + redirectPath,
        },
      });
      console.log(`response getRedirectURL: ${selectedId} => `, data);
      if (!(data.redirectURL || data.redirect)) {
        throw "redirectURL not in response";
      }

      if (selectedId == "twitter") {
        localStorage.setItem("twitter_preAuth", JSON.stringify(data));
      }

      return data?.redirectURL || data?.redirect;
    } catch (error) {
      console.log("error getRedirectURL: ", error);
      throw error;
    }
  },
};
