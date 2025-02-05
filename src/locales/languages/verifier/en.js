export default {
  welcome: {
    common: {
      title: "Welcome to WalliD",
      bulletPointsTitle: "After completing the process you'll have:",
    },
    verifier: {
      subtitle:
        "To get started and increase your trust score, choose one of the data sources available to verify your data.",
      bulletPoints: [
        "Connected to different data sources and verified the requested data",
        "Your trust score based on social network history and on-chain credentials",
      ],
    },
  },
  verifyAccount: {
    title: "Connect to your Twitter account and select the levels you want to verify",
  },

  connectWallet: {
    title: "Connect to your wallet and verify",

    connectButton: "Connect and verify",
    tryAgain: "Try Again",
  },

  authentication: {
    title: "Authentication validation",
    text: "Please provide the code sent to your phone by AMA's CMD within the next 5 minutes and complete the signature.",
    textStored:
      "Please provide the code sent to your phone by AMA's CMD within the next 5 minutes and complete the signature with your CMD already stored in your MyWalliD wallet.",

    codeLabel: ["Authentication code:", "Enter the code"],
  },
  successfulVerify: {
    title: "Success! Your account was verified!",
    text1: "Proceed to connect to your CELO wallet and verify WalliDAO token ownership.",
  },
  errors: {
    noCMD: "Your mobile number doesn't have an active CMD associated",
    incorrectPIN: "Your PIN is not correct",
    numberRequired: "Your mobile number is required",
    pinRequired: "Your PIN is required",
    incorrectCode: "Your authentication code is not correct",
    codeRequired: "An authentication code is required",
    expired:
      "Your session has expired. Please go back to your email and start the signature process again.",
    failedsignature: ["It was not possible to sign this document. Please", "contact us."],
    notPDF:
      " is not PDF! It's not possible to provide a qualified signature on documents in this format. Please contact the sender.",
    alreadySigned:
      "All documents within this envelope have already been signed. Please refresh the page.",

    expiredOtp:
      "Authentication code expired. Please go back to the previous step and repeat the process.",
    noENSmetamask:
      "It seems like selected MetaMask address doesn’t have an ENS domain associated. Switch to another account or select another network.",
    noENSwallid:
      "It seems like selected MetaMask address doesn’t have an ENS domain associated. Switch to another account or select another network.",
  },
  general: {
    signing: "Signing document. Please wait.",
    loading: "Gathering ID Data from your wallet",
    confirm: "Authorize your data sharing",
  },
  button: {
    getStarted: "Get started",
    back: "Back",
    next: "Next",
    signIn: "Sign in with {wallet}",
    connect: "Connect to {wallet}",
    sign: "Sign document",
    store: "Store Metamask in WalliD",
    getIdAssetList: "Authorise WalliD",
    getPlugin: "Install WalliD",
    done: "Finish",
  },
};
