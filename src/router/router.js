import Vue from "vue";
import VueRouter from "vue-router";
import NearPopup from "../views/nearPopup.vue";
// royalties flow
import MintbaseFlowVue from "@/views/MintbaseRoyaltiesFlow.vue";
import WelcomeViewRoyaltiesVue from "@/views/MintbaseRoyalties/WelcomeView.vue";
import RoyaltiesSelectView from "../views/MintbaseRoyalties/SelectView";
import CreateWalletView from "@/views/MintbaseRoyalties/CreateWalletView.vue";
import RoyaltiesSuccessView from "../views/MintbaseRoyalties/SuccessView.vue";

import SignatureView from "@/views/MintbaseRoyalties/SignatureView"; // deprecated

// i18n messages
import i18n from "@/plugins/i18n";

// flows
import flowsRoutes from "./flows";
console.log("flowsRoutes", flowsRoutes);
Vue.use(VueRouter);

const routes = [
  ...flowsRoutes,
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
      {
        path: "success",
        name: "royalties-success",
        component: RoyaltiesSuccessView,
        meta: {
          title: "Success",
          step: 4,
        },
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

function hasQueryParams(route) {
  return !!Object.keys(route.query).length;
}

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

  if (!hasQueryParams(to) && hasQueryParams(from)) {
    const toWithQuery = Object.assign({}, to, { query: from.query });
    next(toWithQuery);
  } else {
    next();
  }
});

export default router;
