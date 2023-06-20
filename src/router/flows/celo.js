import CeloVerificationFlow from "@/views/CeloVerificationFlow";

import WelcomeViewVue from "@/views/Celo/WelcomeView";
import ConnectWalletView from "@/views/Celo/ConnectWalletView";
import ConnectAccountView from "@/views/Celo/ConnectAccountView";
import SuccessView from "@/views/Celo/SuccessView";

import messages from "@/locales/languages/verifier";

export default {
  path: "/Celo",
  name: "CeloVerificationFlow",
  component: CeloVerificationFlow,
  meta: {
    i18n: messages,
    totalSteps: 2,
  },
  children: [
    {
      path: "",
      name: "celo-welcome",
      component: WelcomeViewVue,
      meta: {
        i18n: messages,
        title: "Welcome",
      },
    },
    {
      path: "connect-account",
      name: "celo-select",
      component: ConnectAccountView,
      meta: {
        i18n: messages,
        title: "Verify social network",
        step: 1,
      },
    },
    {
      path: "connect-wallet",
      name: "celo-createWallet",
      component: ConnectWalletView,
      meta: {
        i18n: messages,
        title: "Verify tokens ownership",
        step: 2,
      },
    },
    {
      path: "success-view",
      name: "celo-success-view",
      component: SuccessView,
      meta: {
        i18n: messages,
        title: "Success",
        step: 3,
      },
    },
  ],
};
