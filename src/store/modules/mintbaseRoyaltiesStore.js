import { getJSONStorage } from "@/plugins/utils";
import axios from "axios";

import nacl from "tweetnacl";
import { decodeUTF8, decodeBase64 } from "tweetnacl-util";

import { sha256 } from "js-sha256";

const NFT_URL = (id) =>
  `${process.env.VUE_APP_BACKEND_URL}/api/v1/external/getNftInfo?nft_id=${id}`;

const state = {
  nftId: null,
  nftData: {},
  verifySuccess: false,
};

const getters = {};
const actions = {
  async verifySignatureOnPost(_, { oauthData, twitterHandler, nearAccountId, NFT_ID, signature }) {
    // const selectedAccountId = rootGetters["selectedAccountId"];
    // const nearAccountId = rootGetters["near/nearAccountId"];
    // const { nftId } = await getJSONStorage("session", `currentNFTID`);
    // const { username: socialAccountHandler } = await getJSONStorage(
    //   "local",
    //   `${selectedAccountId}_user`
    // );

    // order matters 🙂
    //build the signed data
    let data = {
      accountId: oauthData?.accountId,
      message: `${twitterHandler}:${nearAccountId}:${NFT_ID}`,
      blockId: oauthData?.blockId,
      publicKey: oauthData?.publicKey,
      keyType: oauthData?.keyType,
    };

    console.log("data to verify", data, signature);

    try {
      const encoded = JSON.stringify(data);
      const message = new Uint8Array(sha256.array(decodeUTF8(encoded)));
      let pubKey = decodeBase64(oauthData?.publicKey);
      let sig = decodeBase64(signature);
      // var sig = nacl.sign.detached(msg, keys.secretKey);
      let resultIframe = nacl.sign.detached.verify(message, sig, pubKey);

      console.log(resultIframe);
      return resultIframe;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async signData({ dispatch, rootGetters }) {
    try {
      // For twitter we need this code
      const selectedAccountId = rootGetters["selectedAccountId"];
      const nearAccountId = rootGetters["near/nearAccountId"];
      const nftId = sessionStorage.getItem("nftPostId");
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
  verifySuccess(state, value) {
    state.verifySuccess = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
