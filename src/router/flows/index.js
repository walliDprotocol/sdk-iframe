import messages from "@/locales/languages/verifier";

import celo from "./celo";
import royalties from "./royalties";

// general verifier flow
import GeneralVerificationFlow from "@/views/GeneralVerificationFlow";
import WelcomeViewVue from "@/views/Verifier/WelcomeView";
import ConnectWalletView from "@/views/Verifier/ConnectWalletView";
import ConnectAccountView from "@/views/Verifier/SelectView";
import VerifyAccountView from "@/views/Verifier/VerifyAccountView";
import SuccessView from "@/views/Verifier/SuccessView";

const baseFlow = {
  path: "/",
  name: "GeneralVerificationFlow",
  component: GeneralVerificationFlow,
  meta: {
    i18n: messages,
    totalSteps: 2,
  },
  children: [
    {
      path: "",
      name: "base-welcome",
      component: WelcomeViewVue,
      meta: {
        i18n: messages,
        title: "Welcome",
      },
    },
    {
      path: "connect-wallet",
      name: "base-connect",
      component: ConnectWalletView,
      meta: {
        i18n: messages,
        title: "Connect wallet",
        step: 1,
      },
    },
    {
      path: "select-account",
      name: "base-select",
      component: ConnectAccountView,
      meta: {
        i18n: messages,
        title: "Select data to verify",
        step: 1,
      },
    },
    {
      path: "verify-account",
      name: "base-verify",
      component: VerifyAccountView,
      meta: {
        i18n: messages,
        title: "Verify data",
        step: 2,
      },
    },
    {
      path: "success-view",
      name: "base-success",
      component: SuccessView,
      meta: {
        i18n: messages,
        title: "Success",
        step: 3,
      },
    },
  ],
};

export default [].concat.apply([], [baseFlow, royalties, celo]);
