import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

const TWITTER_LOGIN =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/redirect/login/twitter";
const TWITTER_INFO =
  process.env.VUE_APP_BACKEND_URL + "/api/v1/redirect/twitter";

console.log(TWITTER_LOGIN);

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async twitterConnect() {
      // const headers = {
      //   "Access-Control-Allow-Origin": "*",
      //   "Access-Control-Allow-Methods": "GET,POST,DELETE",
      //   "Access-Control-Allow-Headers":
      //     "Origin, X-Requested With, Content-Type, Accept",
      // };
      let twitterPreAuthURL;

      try {
        let response = await axios.get(TWITTER_LOGIN);
        console.log("get from axios ", response.data);
        if (response?.data?.redirect) {
          twitterPreAuthURL = response.data;
          localStorage.setItem(
            "twitter_preAuth",
            JSON.stringify(twitterPreAuthURL)
          );
          console.log("twitterPreAuthURL: ", twitterPreAuthURL);
          // window.location = response.data.redirect;
          window.location.replace(twitterPreAuthURL.redirect);
          // win
          //  this.redirect_url = response.data.redirect;
          //  this.dialog=true;
        }
      } catch (error) {
        console.log("error twitter login: ", error);
        throw error;
      }
      return twitterPreAuthURL;
    },
    async getTwitterUsername(_, { state, code, codeVerifier }) {
      console.log("***** Get twitter username *****  ");

      let userData = {};
      try {
        let response = await axios.post(TWITTER_INFO, {
          state: state,
          code: code,
          codeVerifier: codeVerifier,
        });
        console.log("response from twitter login: ", response.data);

        userData = {
          username: response.data.username,
          name: response.data.name,
          id: response.data.id,
        };
        localStorage.setItem("twitter_user", JSON.stringify(userData));
      } catch (error) {
        console.log("error twitter login: ", error);
        throw error;
      }

      return userData;
    },
  },
  modules: {},
});
