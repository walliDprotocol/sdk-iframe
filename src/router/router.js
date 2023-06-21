import Vue from "vue";
import VueRouter from "vue-router";
import NearPopup from "../views/nearPopup.vue";

// i18n messages
import i18n from "@/plugins/i18n";

// flows
import flowsRoutes from "./flows";
console.log("flowsRoutes", flowsRoutes);
Vue.use(VueRouter);

const routes = [
  ...flowsRoutes,

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
