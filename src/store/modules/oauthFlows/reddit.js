import axios from "axios";

const REDDIT_AUTH =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/reddit/requestURL";
const REDDIT_INFO = process.env.VUE_APP_BACKEND_URL + "/api/v1/reddit/authcode";

export default {
  async getRedditData(_, { code, redirectUrl }) {
    console.log("*** get reddit data", code);
    let userData = {};
    try {
      if (code == null || !code) return { userData: {} };

      let { data } = await axios.post(REDDIT_INFO, {
        code,
        redirectUrl,
      });
      console.log("response reddit login: ", data);

      userData = data?.userInfo;
      localStorage.setItem("reddit_user", JSON.stringify(userData));
    } catch (error) {
      console.log("error reddit login: ", error);
      throw error;
    }

    return userData;
  },
  async redditConnect() {
    console.log("***** Get reddit auth url *****  ");

    try {
      let { data } = await axios.get(REDDIT_AUTH, {
        params: {
          redirectUrl: window.location.origin,
        },
      });
      console.log("response reddit auth url : ", data);
      if (!data.redirectURL) {
        throw "redirectURL not in response";
      }
      return data?.redirectURL;
    } catch (error) {
      console.log("error reddit auth: ", error);
      throw error;
    }
  },
};
