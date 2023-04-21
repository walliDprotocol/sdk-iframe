import Vue from "vue";
import VueRouter from "vue-router";
import RoyaltiesSelectView from "../views/MintbaseRoyalties/SelectView";
import SelectView from "../views/SelectView";
import CreateWalletView from "../views/CreateWalletView.vue";
import SuccessView from "../views/SuccessView.vue";
import NearPopup from "../views/nearPopup.vue";
import MintbaseFlowVue from "@/views/MintbaseRoyaltiesFlow.vue";
import GeneralVerificationFlow from "@/views/GeneralVerificationFlow.vue";
import SignatureView from "@/views/MintbaseRoyalties/SignatureView";
import WelcomeViewVue from "@/views/MintbaseRoyalties/WelcomeView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "GeneralVerificationFlow",
    component: GeneralVerificationFlow,
    children: [
      {
        path: "",
        name: "welcome-createWallet",
        component: WelcomeViewVue,
      },
      {
        path: "create-wallet",
        name: "base-createWallet",
        component: CreateWalletView,
      },
      {
        path: "select",
        name: "base-select",
        component: SelectView,
      },
      // {
      //   path: "signature",
      //   name: "base-signature",
      //   component: SignatureView,
      // },
      {
        path: "/success",
        name: "success",
        component: SuccessView,
      },
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
        component: WelcomeViewVue,
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

export default router;
