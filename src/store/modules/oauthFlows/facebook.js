import axios from "axios";

const FACEBOOK_AUTH =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/facebook/requestURL";
const FACEBOOK_INFO =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/facebook/authcode";

export default {
  async getFacebookData(_, { code }) {
    let redirectUrl = window.location.origin;
    console.log("*** get facebook data : ", code);

    let userData = {};
    try {
      let { data } = await axios.post(FACEBOOK_INFO, {
        code,
        redirectUrl: redirectUrl,
      });
      console.log("response facebook login: ", data);

      userData = data;
      localStorage.setItem("facebook_user", JSON.stringify(userData));
    } catch (error) {
      console.log("error facebook login: ", error);
      throw error;
    }

    return userData;
  },
  async facebookConnect() {
    console.log("***** facebookConnect auth url *****  ");

    try {
      let { data } = await axios.get(FACEBOOK_AUTH, {
        params: {
          redirectUrl: window.location.origin,
        },
      });
      console.log("response facebook auth url : ", data);
      if (!data.redirectURL) {
        throw "redirectURL not in response";
      }
      window.location.replace(data?.redirectURL);
    } catch (error) {
      console.log("error facebook auth: ", error);
      throw error;
    }
  },
};
