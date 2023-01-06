import twitter from "./oauthFlows/twitter";
import discord from "./oauthFlows/discord";
import facebook from "./oauthFlows/facebook";
import reddit from "./oauthFlows/reddit";
import linkedin from "./oauthFlows/linkedin";
import google from "./oauthFlows/google";
import github from "./oauthFlows/github";
import authConnect from "./oauthFlows/auth";

const state = {};
const getters = {};

const actions = {
  ...twitter,
  ...discord,
  ...facebook,
  ...reddit,
  ...linkedin,
  ...google,
  ...github,

  ...authConnect,
};
const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
