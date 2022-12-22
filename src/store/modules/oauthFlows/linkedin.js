import axios from "axios";

const LINKEDIN_AUTH =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/linkedin/requestURL";
const LINKEDIN_INFO =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/linkedin/authcode";

export default {
  async getLinkedinData(_, { code, redirectUrl }) {
    console.log("*** get linkedin data");
    let userData = {};
    try {
      let { data } = await axios.post(LINKEDIN_INFO, {
        code,
        redirectUrl: redirectUrl,
      });
      console.log("response linkedin login: ", data);

      userData = data;
      localStorage.setItem("linkedin_user", JSON.stringify(userData));
    } catch (error) {
      console.log("error linkedin login: ", error);
      throw error;
    }

    return userData;
  },
  async linkedinConnect() {
    console.log("***** Get linkedin auth url *****  ");

    try {
      let { data } = await axios.get(LINKEDIN_AUTH, {
        params: {
          redirectUrl: window.location.origin,
        },
      });
      console.log("response linkedin auth url : ", data);
      if (!data.redirectURL) {
        throw "redirectURL not in response";
      }
      window.location.replace(data?.redirectURL);
    } catch (error) {
      console.log("error linkedin auth: ", error);
      throw error;
    }
  },
};
