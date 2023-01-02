import axios from "axios";

const FACEBOOK_AUTH =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/facebook/requestURL";
const FACEBOOK_INFO =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/facebook/authcode";

export default {
  async getFacebookData(_, { code, redirectUrl }) {
    console.log("*** get facebook data : ", code);
    console.log("*** get facebook reddirect_url : ", redirectUrl);

    // hard fix facebook / on the end of string
    if (redirectUrl && redirectUrl[redirectUrl.length] != "/") {
      redirectUrl += "/";
    }

    let userData = {};
    try {
      let { data } = await axios.post(FACEBOOK_INFO, {
        code,
        redirectUrl: redirectUrl,
      });

      console.log("response facebook login: ", data);

      userData = data?.userInfo;
      localStorage.setItem("facebook_user", JSON.stringify(userData));
    } catch (error) {
      console.log("error facebook login: ", error);
      throw error;
    }

    return userData;
  },
  async facebookConnect() {
    console.log("***** facebookConnect auth url *****  ");
    let redirectUrl = window.location.origin;
    try {
      if (redirectUrl && redirectUrl[redirectUrl.length - 1] != "/") {
        redirectUrl += "/";
      }
      let { data } = await axios.get(FACEBOOK_AUTH, {
        params: {
          redirectUrl,
        },
      });
      console.log("response facebook auth url : ", data);
      if (!data.redirectURL) {
        throw "redirectURL not in response";
      }
      return data?.redirectURL;
    } catch (error) {
      console.log("error facebook auth: ", error);
      throw error;
    }
  },
};
