import axios from "axios";

const REDDIT_AUTH =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/reddit/requestURL";
const REDDIT_INFO = process.env.VUE_APP_BACKEND_URL + "/api/v1/reddit/authcode";

export default {
  async getRedditData(_, { code }) {
    console.log("*** get reddit data");
    let userData = {};
    try {
      let { data } = await axios.post(REDDIT_INFO, {
        code,
      });
      console.log("response reddit login: ", data);

      userData = data;
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
      window.location.replace(data?.redirectURL);
    } catch (error) {
      console.log("error reddit auth: ", error);
      throw error;
    }
  },
};
