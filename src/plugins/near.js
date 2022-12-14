import * as nearAPI from "near-api-js";

export const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

export class NEAR {
  near;
  wallet;
  config;

  constructor() {
    // configuration object
    this.config = {
      networkId: "testnet",
      keyStore,
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
  }

  async init() {
    // connect to NEAR
    this.near = await nearAPI.connect(this.config);
    // create wallet connection
    this.wallet = new nearAPI.WalletConnection(this.near);
  }
}

export default new NEAR();
