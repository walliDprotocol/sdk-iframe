import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import CreateWalletView from "../views/CreateWalletView.vue";
import SuccessView from "../views/SuccessView.vue";
import NearPopup from "../views/nearPopup.vue";
import MintbaseFlowVue from "@/views/MintbaseRoyaltiesFlow.vue";
import SignatureView from "@/views/MintbaseRoyalties/SignatureView";

Vue.use(VueRouter);

const routes = [
  {
    path: "/connect",
    name: "connect",
    component: CreateWalletView,
  },

  {
    path: "/home",
    name: "home",
    component: HomeView,
  },
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
        name: "royalties-home",
        component: HomeView,
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
