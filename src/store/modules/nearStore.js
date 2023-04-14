import NearAPI from "@/plugins/near";
import { getJSONStorage } from "@/plugins/utils";

const state = { nearAccount: {}, walletSelector: null };
const getters = {
  walletSelector(state) {
    return state.walletSelector;
  },
  nearAccountId(state) {
    return state.nearAccount?.accountId;
  },
};
const actions = {
  async initNear({ commit, dispatch }) {
    let sessionNetwork = getJSONStorage("local", "selectedNetwork");
    const selectedNetwork =
      Object.entries(sessionNetwork).length > 0 ? sessionNetwork : { id: "testnet" };
    //setup near wallet
    await NearAPI.init(selectedNetwork.id);

    //setup wallet selector
    const selector = NearAPI.getWalletSelector();
    console.log("setSelector", selector);
    console.log("setSelector isSignedIn", selector.isSignedIn());
    commit("setSelector", selector);

    selector.store.observable.subscribe((state) => {
      console.log("State changed:", state);
      dispatch("getAccounts").then((account) => dispatch("setAccount", { account }));
    });

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

    const res = await NearAPI.viewMethod({
      contractId: NearAPI.NEAR_SOCIAL_CONTRACT_ADDRESS,
      method: "get",
      args: { keys: [`${accountId}/profile/name`] },
    });

    console.log("Method call result", res);

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
  async setAccount({ commit }, { account }) {
    if (!account) {
      return;
    }
    // await state.walletSelector.setActiveAccount(account?.accountId);

    commit("setNearAccount", account);

    return account;
  },
  async getAccountBalance() {
    return await NearAPI.wallet.account().getAccountBalance();
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
