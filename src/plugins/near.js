import * as nearAPI from "near-api-js";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupNarwallets } from "@near-wallet-selector/narwallets";
import { setupWelldoneWallet } from "@near-wallet-selector/welldone-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
import { setupNightlyConnect } from "@near-wallet-selector/nightly-connect";
import { setupDefaultWallets } from "@near-wallet-selector/default-wallets";
import { setupNearFi } from "@near-wallet-selector/nearfi";
import { setupCoin98Wallet } from "@near-wallet-selector/coin98-wallet";
import { setupOptoWallet } from "@near-wallet-selector/opto-wallet";
import { setupNeth } from "@near-wallet-selector/neth";
import { setupXDEFI } from "@near-wallet-selector/xdefi";

export const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

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

  getWalletSelector() {
    return this.selector;
  }

  async init() {
    // connect to NEAR
    this.near = await nearAPI.connect(this.config);
    // create wallet connection
    this.wallet = new nearAPI.WalletConnection(this.near);

    this.selector = await setupWalletSelector({
      network: "testnet",
      // debug: true,
      modules: [
        ...(await setupDefaultWallets()),
        setupNearWallet(),
        setupMyNearWallet(),
        setupSender(),
        setupHereWallet(),
        setupMathWallet(),
        setupNightly(),
        setupMeteorWallet(),
        setupNarwallets(),
        setupWelldoneWallet(),
        setupLedger(),
        setupNearFi(),
        setupCoin98Wallet(),
        setupOptoWallet(),
        setupNeth(),
        setupXDEFI(),
        setupWalletConnect({
          projectId: "c4f79cc...",
          metadata: {
            name: "NEAR Wallet Selector",
            description: "Example dApp used by NEAR Wallet Selector",
            url: "https://github.com/near/wallet-selector",
            icons: ["https://avatars.githubusercontent.com/u/37784886"],
          },
        }),
        setupNightlyConnect({
          url: "wss://relay.nightly.app/app",
          appMetadata: {
            additionalInfo: "",
            application: "NEAR Wallet Selector",
            description: "Example dApp used by NEAR Wallet Selector",
            icon: "https://near.org/wp-content/uploads/2020/09/cropped-favicon-192x192.png",
          },
        }),
      ],
    });
  }
}

export default new NEAR();
