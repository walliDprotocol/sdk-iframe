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
  async getWalletIconUrl() {
    const wallet = await state.walletSelector.wallet();

    return wallet?.metadata.iconUrl;
  },
  async initNear({ commit, dispatch }) {
    let sessionNetwork = getJSONStorage("local", "selectedNetwork");
    const selectedNetwork =
      Object.entries(sessionNetwork).length > 0 ? sessionNetwork : { id: "testnet" };
    //setup near wallet
    await NearAPI.init(selectedNetwork.id);

    //setup wallet selector
    const selector = NearAPI.getWalletSelector();
    console.log("setWalletSelector", selector);
    console.log("setWalletSelector isSignedIn", selector.isSignedIn());
    commit("setWalletSelector", selector);

    selector.store.observable.subscribe((selectorState) => {
      console.log("selectorState changed:", selectorState);

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
    try {
      const wallet = await state.walletSelector?.wallet();
      if (!wallet) {
        return;
      }
      const accounts = await wallet.getAccounts();
      const account = accounts[0];

      if (state.nearAccount?.accountId && state.nearAccount?.accountId !== account) {
        sessionStorage.removeItem("isLoggedIn");
      }

      // TODO: fix when value is missing
      const { profile } = await dispatch("getProfileName", {
        accountId: account.accountId,
      });
      console.log("Get Social DB response: ", profile);

      console.log("wallet", wallet);
      console.log("account", account);
      return { ...account, ...profile };
    } catch (error) {
      console.log(error?.message);
      return {};
    }
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
  async getAccountBalanceUnconnected(_, { accountId }) {
    if (!accountId) return "No accountId given";
    let connection = await NearAPI.connect();
    return await (await connection.account(accountId)).getAccountBalance();
  },
  async signatureRequest(_, { message }) {
    const wallet = await state.walletSelector.wallet();
    const accounts = await wallet.getAccounts();

    const signatureObject = await wallet.verifyOwner({ message });
    console.log("accounts", accounts);
    console.log("publicKey", signatureObject.publicKey);
    console.log("wallet", signatureObject.signature);
    return signatureObject;
  },
};
const mutations = {
  setWalletSelector(state, value) {
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
