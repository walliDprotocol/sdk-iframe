import axios from "axios";

const DISCORD_AUTH =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/discord/requestURL";
const DISCORD_INFO =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/discord/authcode";

export default {
  async getDiscordData(_, { code }) {
    console.log("*** getDiscordData");
    let userData = {};
    try {
      let { data } = await axios.post(DISCORD_INFO, {
        code,
      });
      console.log("response getDiscordData login: ", data);

      userData = data;
      localStorage.setItem("discord_user", JSON.stringify(userData));
    } catch (error) {
      console.log("error twitter login: ", error);
      throw error;
    }

    return userData;
  },
  async discordConnect() {
    console.log("***** Get discord auth url *****  ");

    try {
      let { data } = await axios.get(DISCORD_AUTH, {
        params: {
          redirectUrl: window.location.origin,
        },
      });
      console.log("response discord auth url : ", data);
      if (!data.redirectURL) {
        throw "redirectURL not in response";
      }
      window.location.replace(data?.redirectURL);
    } catch (error) {
      console.log("error discord auth: ", error);
      throw error;
    }
  },
};
