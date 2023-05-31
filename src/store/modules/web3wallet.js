import detectEthereumProvider from "@metamask/detect-provider";

const state = () => ({
  account: null,
});

const getters = {};

const mutations = {
  setAccount(state, value) {
    state.account = value;
  },
};

const actions = {
  async handleAccountsChanged({ state, commit }, accounts) {
    console.log("handleAccountsChanged", accounts);

    if (accounts.length === 0) {
      throw new Error("ERR_NO_PERMISSION");
    } else if (accounts[0] !== state.account) {
      commit("setAccount", accounts[0]);
      return accounts[0];
    } else {
      return accounts[0];
    }
  },

  async connect({ dispatch }, provider) {
    try {
      let accounts = await provider.request({ method: "eth_requestAccounts" });
      return await dispatch("handleAccountsChanged", accounts);
    } catch (error) {
      if (error.code === 4001) {
        console.log("Please connect to MetaMask.");
        throw new Error("ERR_NO_PERMISSION");
      } else {
        console.error(error);
      }
    }
  },
  async fetchAccount({ dispatch }, provider) {
    const accounts = await provider.request({ method: "eth_accounts" });

    return await dispatch("handleAccountsChanged", accounts);
  },
  async fetchChainId(_, provider) {
    const chainId = await provider.request({ method: "eth_chainId" });

    if (chainId) {
      //   commit('setChainId', chainId)
      return chainId;
    }

    return false;
  },

  async connectProvider({ dispatch }) {
    console.log("checkProvider");
    const provider = await detectEthereumProvider();
    if (!provider) {
      throw new Error("NO_WEB3");
    }
    if (provider !== window.ethereum) {
      throw new Error("checkError: Do you have multiple wallets installed?");
    }
    return await dispatch("connect", provider);
  },
  async checkProvider() {
    console.log("checkProvider");
    const provider = await detectEthereumProvider();
    if (!provider) {
      throw new Error("NO_WEB3_EXTENSION");
    }
    if (provider !== window.ethereum) {
      throw new Error("checkError: Do you have multiple wallets installed?");
    }
    return provider;
  },
  async checkConnection({ dispatch }, provider) {
    console.log("checkConnection", provider);
    try {
      const address = await dispatch("fetchAccount", provider);
      console.log("checkConnection", address);

      if (!address) {
        throw new Error("checkError: No wallet found");
      }

      // if (chainId !== '0x89') throw new Error('WRONG_NETWORK')

      return address;
    } catch (error) {
      console.log("checkConnection error", error);
      throw error;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
