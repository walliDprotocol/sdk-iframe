import { getJSONStorage } from "@/plugins/utils";
import axios from "axios";

const NFT_URL = (id) =>
  `${process.env.VUE_APP_BACKEND_URL}/api/v1/external/getNftInfo?nft_id=${id}`;

const state = { nftId: null, nftData: {} };
const getters = {
  walletSelector(state) {
    return state.walletSelector;
  },
  nearAccountId(state) {
    return state.nearAccount?.accountId;
  },
};
const actions = {
  async signData({ dispatch, rootGetters }) {
    try {
      // For twitter we need this code
      const selectedAccountId = rootGetters["selectedAccountId"];
      const nearAccountId = rootGetters["near/nearAccountId"];
      const { nftId } = await getJSONStorage("session", `currentNFTID`);
      const { username: socialAccountHandler } = await getJSONStorage(
        "local",
        `${selectedAccountId}_user`
      );
      console.log("nftId", nftId);
      console.log("nearAccountId", nearAccountId);
      console.log("selectedAccountId", selectedAccountId);
      console.log("socialAccountHandler", socialAccountHandler);

      let dataToSign = `${socialAccountHandler}:${nearAccountId}:${nftId}`;
      console.log("***  dataToSign data", dataToSign);

      const res = await dispatch("near/signatureRequest", { message: dataToSign }, { root: true });
      console.log("SignatureRequest res", res);

      return res;
    } catch (error) {
      console.log("error getNFTData login: ", error);
      throw error;
    }
  },
  async getNFTData({ commit }, { nft }) {
    console.log("***  getNFTData data", nft);
    const userData = {};
    try {
      // For twitter we need this code

      let { data } = await axios.get(NFT_URL(nft));
      console.log("response getNFTData login: ", data);

      Object.assign(userData, data);

      //get data form local storage
      if (Object.keys(userData).length == 0) {
        let nftPostIdStorage = getJSONStorage("session", `nftPostId`);
        let dataStorage = getJSONStorage("session", `${nftPostIdStorage}_nft`);
        Object.assign(userData, dataStorage);
      }

      sessionStorage.setItem(`${nft}_nft`, JSON.stringify(userData));
      sessionStorage.setItem(`currentNFTID`, JSON.stringify({ nftId: nft }));
      commit("setCurrentNftId", nft);
      commit("setNftData", userData);
    } catch (error) {
      console.log("error getNFTData login: ", error);
      throw error;
    }

    return userData;
  },
  async getNFTDataStorage(_, { nft }) {
    console.log("***  getNFTDataStorage data", nft);
    const userData = {};
    try {
      // For twitter we need this code

      let data = getJSONStorage("session", `${nft}_nft`);
      Object.assign(userData, data);

      if (Object.keys(userData).length == 0) throw "No data to store";

      sessionStorage.setItem(`${nft}_nft`, JSON.stringify(userData));
    } catch (error) {
      console.log("error getNFTDataStorage login: ", error);
      throw error;
    }

    return userData;
  },
};
const mutations = {
  setCurrentNftId(state, value) {
    state.currentNftId = value;
  },
  setNftData(state, value) {
    state.nftData = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
