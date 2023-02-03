import NearAPI, { keyStore } from "@/plugins/near";
import { Contract } from "near-api-js";

var Buffer = require("buffer/").Buffer;

const state = { nearAccount: {}, walletSelector: null };
const getters = {
  walletSelector(state) {
    return state.walletSelector;
  },
  nearAccountId(state) {
    return state.nearAccount.accountId;
  },
};
const actions = {
  async initNear({ commit, dispatch }) {
    await NearAPI.init();
    const selector = NearAPI.getWalletSelector();
    console.log("setSelector", selector);
    console.log("setSelector isSignedIn", selector.isSignedIn());
    commit("setSelector", selector);

    if (selector.isSignedIn()) {
      const account = await dispatch("getAccounts");
      console.log("account", account);
      dispatch("setAccount", { account });
    }
  },
  async connectNear() {
    await NearAPI.wallet.requestSignIn({
      successUrl: `${window.location.origin}/near?success=1`, // optional redirect URL on success
    });
  },

  async signOut({ state, commit }) {
    const wallet = await state.walletSelector.wallet();
    commit("setNearAccount");

    wallet.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    });
  },

  async getProfileName(_, { accountId }) {
    console.log("accountid", accountId);
    const contract = new Contract(
      NearAPI.wallet.account(), // the account object that is connecting
      "v1.social08.testnet",
      { viewMethods: ["get"] }
    );

    // const {
    //   [account.accountId]: { profile },
    // } =
    let res = await contract.get({
      keys: [`${accountId}/profile/name`],
    });

    if (Object.keys(res).length == 0) return { profile: {} };

    return res[accountId];
  },

  async getAccounts({ state, dispatch }) {
    const wallet = await state.walletSelector.wallet();
    const accounts = await wallet.getAccounts();
    const account = accounts[0];

    // TODO: fix when value is missing
    const { profile } = await dispatch("getProfileName", {
      accountId: account.accountId,
    });
    console.log("Get Social DB response: ", profile);

    console.log("wallet", wallet);
    console.log("account", account);
    return { ...account, ...profile };
  },
  async setAccount({ state, commit }, { account }) {
    if (!account) {
      return;
    }
    await state.walletSelector.setActiveAccount(account?.accountId);

    commit("setNearAccount", account);

    return account;
  },
  async getAccountBalance() {
    return await NearAPI.wallet.account().getAccountBalance();
  },
  async verifySignature() {
    console.log("Action verifySignature");

    const config = {
      keyStore,
      networkId: "testnet",
      nodeUrl: "https://rpc.testnet.near.org",
    };

    console.log(NearAPI.wallet.isSignedIn());
    const walletAccountObj = NearAPI.wallet.account();

    console.log("walletAccountObj", walletAccountObj);

    const walletAccountId = NearAPI.wallet.getAccountId();

    console.log("walletAccountId", walletAccountId);

    console.log(await walletAccountObj.getAccountDetails());

    // await this.wallet.requestSignIn(
    //   "example-contract.testnet", // contract requesting access
    //   "Verification iframe", // optional title
    //   `http://127.0.0.1:8080/`, // optional redirect URL on success
    //   "http://127.0.0.1:8080" // optional redirect URL on failure
    // );

    const keyPair = await keyStore.getKey(config.networkId, walletAccountId);

    console.log(keyStore, keyPair, walletAccountId);
    const msg = Buffer.from("hi");

    const { signature } = keyPair.sign(msg);

    const isValid = keyPair.verify(msg, signature);

    console.log("Signature Valid?:", isValid);

    return isValid;
  },
  async verifySignatureV2() {
    console.log(NearAPI.wallet.isSignedIn());

    // const signer = new nearAPI.Signer(myKeyStore);
    // const NONCE = Buffer.from(Array.from(Array(32).keys()));

    // const { accountId, publicKey, signature } = await this.wallet.signMessage({
    //   message: "hi",
    //   receiver: "myapp.com",
    //   nonce: NONCE,
    // });

    // console.log("signMessage", accountId, publicKey, signature);

    // console.log("Signer", signer);

    // const msg = Buffer.from("hi");

    // const { signature } = signer.signMessage(msg);

    // console.log("Signature Valid?:", signature);
  },
};
const mutations = {
  setSelector(state, value) {
    state.walletSelector = value;
  },
  setNearAccount(state, value) {
    state.nearAccount = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
