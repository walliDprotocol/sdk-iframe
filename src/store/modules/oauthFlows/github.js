import axios from "axios";

const GITHUB_AUTH =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/github/requestURL";
const GITHUB_INFO = process.env.VUE_APP_BACKEND_URL + "/api/v1/github/authcode";

export default {
  async getGithubData(_, { code }) {
    console.log("*** get github data code : ", code);
    let userData = {};
    try {
      let { data } = await axios.post(GITHUB_INFO, {
        code,
      });
      console.log("response github login: ", data);

      userData = data;
      localStorage.setItem("github_user", JSON.stringify(userData));
    } catch (error) {
      console.log("error github login: ", error);
      throw error;
    }

    return userData;
  },
  async githubConnect() {
    console.log("***** Get github auth url *****  ");

    try {
      let { data } = await axios.get(GITHUB_AUTH, {
        params: {
          redirectUrl: window.location.origin,
        },
      });
      console.log("response github auth url : ", data);
      if (!data.redirectURL) {
        throw "redirectURL not in response";
      }
      window.location.replace(data?.redirectURL);
    } catch (error) {
      console.log("error github auth: ", error);
      throw error;
    }
  },
};
