import Vue from "vue";
import VueRouter from "vue-router";
import RoyaltiesSelectView from "../views/MintbaseRoyalties/SelectView";
import SelectView from "../views/Verifier/SelectView";
import SuccessView from "../views/SuccessView.vue";
import NearPopup from "../views/nearPopup.vue";
import MintbaseFlowVue from "@/views/MintbaseRoyaltiesFlow.vue";
import GeneralVerificationFlow from "@/views/GeneralVerificationFlow.vue";
import SignatureView from "@/views/MintbaseRoyalties/SignatureView";
import WelcomeViewRoyaltiesVue from "@/views/MintbaseRoyalties/WelcomeView.vue";
import CreateWalletView from "@/views/Verifier/CreateWalletView.vue";
import WelcomeViewVue from "@/views/Verifier/WelcomeView.vue";
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
        path: "select",
        name: "base-select",
        component: SelectView,
        meta: {
          i18n: messages,
          title: "Verify social network",
          step: 1,
        },
      },
      {
        path: "create-wallet",
        name: "base-createWallet",
        component: CreateWalletView,
        meta: {
          i18n: messages,
          title: "Verify tokens ownership",
          step: 2,
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
    path: "/success",
    name: "success",
    component: SuccessView,
  },
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
