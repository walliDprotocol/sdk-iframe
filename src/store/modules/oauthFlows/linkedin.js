import axios from "axios";

const LINKEDIN_AUTH =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/linkedin/requestURL";
const LINKEDIN_INFO =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/linkedin/authcode";

export default {
  async getLinkedinData(_, { code }) {
    let redirectUrl = window.location.origin;
    console.log("*** get linkedin data");
    console.log("*** code ", code);
    console.log("*** redirect url  ", redirectUrl);
    // let savedData = localStorage.getItem("linkedin_user");

    // if (savedData && savedData != {}) {
    //   console.log("there is already data for that provider ");
    //   return JSON.parse(savedData);
    // }

    let userData = {};
    try {
      let { data } = await axios.post(LINKEDIN_INFO, {
        code,
        redirectUrl: window.location.origin,
      });
      console.log("response linkedin login: ", data);

      userData = data?.userInfo;
      localStorage.setItem("linkedin_user", JSON.stringify(userData));
    } catch (error) {
      console.log("error linkedin login: ", error);
      throw error;
    }

    return userData;
  },
  async linkedinConnect() {
    console.log("***** Get linkedin auth url *****  ", window.location.origin);

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
      return data?.redirectURL;
    } catch (error) {
      console.log("error linkedin auth: ", error);
      throw error;
    }
  },
};
