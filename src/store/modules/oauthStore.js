import twitter from "./oauthFlows/twitter";
import discord from "./oauthFlows/discord";

const state = {};
const getters = {};

const actions = { ...twitter, ...discord };
const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
