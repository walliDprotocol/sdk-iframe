import * as nearAPI from "near-api-js";
import { providers } from "near-api-js";
// import { setupOptoWallet } from "@near-wallet-selector/opto-wallet";
// import { setupHereWallet } from "@near-wallet-selector/here-wallet";
// import { setupWelldoneWallet } from "@near-wallet-selector/welldone-wallet";
// import { setupLedger } from "@near-wallet-selector/ledger";
// import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
// import { setupNightlyConnect } from "@near-wallet-selector/nightly-connect";
// import { setupNearFi } from "@near-wallet-selector/nearfi";

import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
// import { setupMathWallet } from "@near-wallet-selector/math-wallet";
// import { setupNightly } from "@near-wallet-selector/nightly";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
// import { setupNarwallets } from "@near-wallet-selector/narwallets";
import { setupDefaultWallets } from "@near-wallet-selector/default-wallets";
// import { setupCoin98Wallet } from "@near-wallet-selector/coin98-wallet";
import { setupNeth } from "@near-wallet-selector/neth";
// import { setupXDEFI } from "@near-wallet-selector/xdefi";
import { ethers } from "ethers";
// import { getJSONStorage } from "./utils";

export const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

// const NEAR_NETWORK = process.env.VUE_APP_NEAR_NETWORK_TESTNET;
// const NEAR_NETWORK = process.env.VUE_APP_NEAR_NETWORK;

const NEAR_SOCIAL_CONTRACTS = {
  mainnet: process.env.VUE_APP_NEAR_SOCIAL_CONTRACT,
  testnet: process.env.VUE_APP_NEAR_SOCIAL_CONTRACT_TESTNET,
};

export class NEAR {
  near;
  wallet;
  config;
  selector;

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

  connect() {
    return nearAPI.connect(this.config);
  }
  getWalletSelector() {
    return this.selector;
  }
  getAccountBalance(accountId) {
    return nearAPI.account(accountId);
  }

  // Make a read-only call to retrieve information from the network
  async viewMethod({ contractId, method, args = {} }) {
    const { network } = this.selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    let res = await provider.query({
      request_type: "call_function",
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
      finality: "optimistic",
    });
    return JSON.parse(Buffer.from(res.result).toString());
  }

  // Get the account native token balance from the network
  async getNativeBalance({ accountId }) {
    const { network } = this.selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    let res = await provider.query({
      request_type: "view_account",
      account_id: accountId,
      finality: "final",
    });
    const ethValue = ethers.utils.formatUnits(res.amount, 24);

    return JSON.parse(Buffer.from(ethValue).toString());
  }

  async init(network) {
    // connect to NEAR
    // this.near = await nearAPI.connect(this.config);
    // create wallet connection
    // this.wallet = new nearAPI.WalletConnection(this.near);

    // Having the key enables to call non-payable methods without interrupting the user to sign
    // this.wallet = new nearAPI.Wallet({
    //   createAccessKeyFor: CONTRACT_ADDRESS,
    //   network: this.config,
    // });

    // let sessionNetwork = getJSONStorage("session", "selectedNetwork");
    // const selectedNetwork =
    //   Object.entries(sessionNetwork).length > 0
    //     ? sessionNetwork
    //     : this.networksList[0];
    // const NEAR_NETWORK = selectedNetwork.id;

    this.NEAR_SOCIAL_CONTRACT_ADDRESS = NEAR_SOCIAL_CONTRACTS[network];

    this.selector = await setupWalletSelector({
      network,
      // debug: true,
      modules: [
        ...(await setupDefaultWallets()),

        // this wallets were tested and are working
        setupNearWallet(), // default wallet
        setupNeth(), // NETH Account: Transform is undefined(fixed with stream alias), needs reload after signup to show connect, fixed with observable state
        setupMeteorWallet(), // tested, needs reload after signup to show connect, fixed with observable state
        setupSender(),
        // setupNightly(),
        // setupMathWallet(),
        // setupNarwallets(),
        // setupCoin98Wallet(),
        setupMyNearWallet(),
        // setupXDEFI(),

        //not tested yet

        // wallets bellow aren't working, remove?
        // setupWelldoneWallet(),
        // setupNearFi(),
        // setupOptoWallet(),

        // setupHereWallet(), // only available on iOS, (remove)
        // setupLedger(),
        // setupWalletConnect({
        //   projectId: "c4f79cc...",
        //   metadata: {
        //     name: "NEAR Wallet Selector",
        //     description: "Example dApp used by NEAR Wallet Selector",
        //     url: "https://github.com/near/wallet-selector",
        //     icons: ["https://avatars.githubusercontent.com/u/37784886"],
        //   },
        // }),
        // setupNightlyConnect({
        //   url: "wss://relay.nightly.app/app",
        //   appMetadata: {
        //     additionalInfo: "",
        //     application: "NEAR Wallet Selector",
        //     description: "Example dApp used by NEAR Wallet Selector",
        //     icon: "https://near.org/wp-content/uploads/2020/09/cropped-favicon-192x192.png",
        //   },
        // }),
      ],
    });
  }
}

export default new NEAR();
