import Vue from "vue";
import VueRouter from "vue-router";
import NearPopup from "../views/nearPopup.vue";
// royalties flow
import MintbaseFlowVue from "@/views/MintbaseRoyaltiesFlow.vue";
import WelcomeViewRoyaltiesVue from "@/views/MintbaseRoyalties/WelcomeView.vue";
import RoyaltiesSelectView from "../views/MintbaseRoyalties/SelectView";
import CreateWalletView from "@/views/MintbaseRoyalties/CreateWalletView.vue";

import SignatureView from "@/views/MintbaseRoyalties/SignatureView"; // deprecated

// general verifier flow
import GeneralVerificationFlow from "@/views/GeneralVerificationFlow.vue";
import WelcomeViewVue from "@/views/Verifier/WelcomeView.vue";
import ConnectWalletView from "@/views/Verifier/ConnectWalletView.vue";
import ConnectAccountView from "../views/Verifier/ConnectAccountView";
import SuccessView from "../views/Verifier/SuccessView.vue";

// i18n messages
import messages from "@/locales/languages/verifier";
import i18n from "@/plugins/i18n";

Vue.use(VueRouter);

const routes = [
  {
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
        name: "welcome-createWallet",
        component: WelcomeViewVue,
        meta: {
          i18n: messages,
          title: "Welcome",
        },
      },
      {
        path: "connect-account",
        name: "base-select",
        component: ConnectAccountView,
        meta: {
          i18n: messages,
          title: "Verify social network",
          step: 1,
        },
      },
      {
        path: "connect-wallet",
        name: "base-createWallet",
        component: ConnectWalletView,
        meta: {
          i18n: messages,
          title: "Verify tokens ownership",
          step: 2,
        },
      },
      {
        path: "success-view",
        name: "base-success-view",
        component: SuccessView,

        meta: {
          i18n: messages,
          title: "Success",
          step: 3,
        },
      },

      // {
      //   path: "signature",
      //   name: "base-signature",
      //   component: SignatureView,
      // },
    ],
  },
  {
    path: "/connect",
    name: "connect",
    component: CreateWalletView,
  },

  // {
  //   path: "/home",
  //   name: "home",
  //   component: HomeView,
  // },

  {
    path: "/near",
    name: "NearPopup",
    component: NearPopup,
  },
  {
    path: "/royalties",
    name: "MintbaseFlow",
    component: MintbaseFlowVue,
    children: [
      {
        path: "",
        name: "royalties-welcome",
        component: WelcomeViewRoyaltiesVue,
      },
      {
        path: "select",
        name: "royalties-select",
        component: RoyaltiesSelectView,
      },

      {
        path: "createWallet",
        name: "royalties-createWallet",
        component: CreateWalletView,
      },
      // deprecated
      {
        path: "signature",
        name: "royalties-signature",
        component: SignatureView,
      },
    ],
  },

  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  // //   if (store.getters.step === 0) {
  // //     store.commit('decStep');
  // //     next({
  // //       path: '/',
  // //     });
  // //   } else if (to.path === '/') {
  // //     store.commit('step', 0);

  // //     next();
  // //   } else {
  // //     next();
  // //   }
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!to.meta.i18n) {
    Object.keys(to.meta.i18n).forEach((lang) => i18n.mergeLocaleMessage(lang, to.meta.i18n[lang]));
  }
  next();
});

export default router;
