import axios from "axios";

const GOOGLE_AUTH =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/google/requestURL";
const GOOGLE_INFO = process.env.VUE_APP_BACKEND_URL + "/api/v1/google/authcode";

export default {
  async getGoogleData() {
    console.log("*** get google data");
    let userData = {};

    const preAuthToken = JSON.parse(localStorage.getItem("preAuthToken"));

    try {
      let { data } = await axios.post(GOOGLE_INFO, {
        code: preAuthToken,
      });
      console.log("response google login: ", data);

      userData = data;
      localStorage.setItem("google_user", JSON.stringify(userData));
    } catch (error) {
      console.log("error google login: ", error);
      throw error;
    }

    return userData;
  },
  async googleConnect() {
    console.log("***** Get google auth url *****  ");

    try {
      let { data } = await axios.get(GOOGLE_AUTH, {
        params: {
          redirectUrl: window.location.origin,
        },
      });
      console.log("response google auth url : ", data);
      if (!data.redirectURL) {
        throw "redirectURL not in response";
      }
      window.location.replace(data?.redirectURL);
    } catch (error) {
      console.log("error google auth: ", error);
      throw error;
    }
  },
};
