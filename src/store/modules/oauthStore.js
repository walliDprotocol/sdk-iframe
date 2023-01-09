import authConnect from "./oauthFlows/auth";

const state = {};
const getters = {};

const actions = {
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
