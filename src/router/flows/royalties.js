// royalties flow
import MintbaseFlowVue from "@/views/MintbaseRoyaltiesFlow.vue";
import WelcomeViewRoyaltiesVue from "@/views/MintbaseRoyalties/WelcomeView.vue";
import RoyaltiesSelectView from "@/views/MintbaseRoyalties/SelectView";
import CreateWalletView from "@/views/MintbaseRoyalties/CreateWalletView.vue";
import RoyaltiesSuccessView from "@/views/MintbaseRoyalties/SuccessView.vue";

export default {
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
  ],
};
