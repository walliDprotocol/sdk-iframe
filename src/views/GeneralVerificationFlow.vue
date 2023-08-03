<template>
  <div>
    <AppHeader />

    <LoaderCircle :loading="loading"></LoaderCircle>
    <router-view v-if="!loading" />
    <AppFooter />
  </div>
</template>
<script>
import LoaderCircle from "@/components/LoaderCircle.vue";
import AppFooter from "@/layout/AppFooter.vue";
import AppHeader from "@/layout/AppHeader.vue";
import { getJSONStorage, getStorageFields, splitIntoTwoLists } from "@/plugins/utils";
import { mapState } from "vuex";

import { OAUTH, WEB3 } from "@/constants";

export default {
  name: "GeneralVerificationFlow",
  data() {
    return {
      loading: true,
      getOauthDataQuery: {},
    };
  },
  computed: {
    ...mapState("near", ["walletSelector", "nearAccount"]),
    accountIds: {
      get() {
        return this.$store.state.accountIds;
      },
      set(val) {
        this.$store.commit("setAccountIds", val);
      },
    },
  },
  async mounted() {
    await this.$store.dispatch("near/initNear");
    let {
      state,
      code,
      flow,
      configId,
      account_id: accountId,
    } = await this.$store.dispatch("getURLSearchParams");

    // try to get this values from local storage
    configId ??= (await getStorageFields(["configId", "flow"])).configId;
    flow ??= (await getStorageFields(["configId", "flow"])).flow;

    console.log("flow mounted verifier", flow, state, code, accountId);

    // Temp Values
    this.$store.commit("setFlow", flow);

    this.getOauthDataQuery = {
      state,
      code,
    };
    console.log("getOauthDataQuery", this.getOauthDataQuery);

    // const { userData, nearAccountId } = await this.$store.dispatch("getURLSearchParams");
    const hasUserData = await this.$store.dispatch("getOauthData", this.getOauthDataQuery);

    let providers = [];
    let chainId = [];

    ({ providers, chainId } = (await this.$store.dispatch("getConfig", { configId })).data);

    let [accountIdsFilter, web3TokensList] = splitIntoTwoLists(providers, "type", [OAUTH, WEB3]);

    // filter out providers list

    console.log("accountIdsFilter", accountIdsFilter);
    console.log("web3TokensList", web3TokensList);
    web3TokensList.forEach((a) =>
      a.options.forEach((option) => {
        option.display = true;
      })
    );

    this.$store.commit("setWeb3Tokens", web3TokensList);
    this.$store.commit("setChainId", chainId);

    // hide other options
    accountIdsFilter.forEach((a) =>
      a.options.forEach((option) => {
        option.display = option.code == 1;
      })
    );

    this.accountIds = accountIdsFilter;

    if (hasUserData) {
      //check if the flow is for royalties flow
      // TODO: Check this logic

      console.log("Push route success");
      // Push success screen
      // // this.$router.push("/?success=" + this.selectedAccountId);
      localStorage.setItem("@wallid:oauth:state", 2);
      this.hasData = getJSONStorage("local", this.selectedAccountId + "_user");
      console.log("hasData", this.hasData);
      if (this.hasData) {
        this.$router.push({ name: "base-success" });
        this.loading = false;
      }
      return;
    }

    this.loading = false;
  },
  components: {
    AppFooter,
    AppHeader,
    LoaderCircle,
  },
};
</script>
