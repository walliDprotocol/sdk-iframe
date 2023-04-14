import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import ConnectView from "../views/ConnectWalletView.vue";
import SuccessView from "../views/SuccessView.vue";
import NearPopup from "../views/nearPopup.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "connect",
    component: ConnectView,
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
