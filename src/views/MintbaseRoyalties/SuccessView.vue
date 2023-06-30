<template>
  <v-container fill-height class="d-flex" style="align-content: space-between">
    <v-row justify="center">
      <v-col cols="8" class="pt-10">
        <v-container style="max-width: 700px">
          <v-row justify="center" class="pa-10">
            <v-col cols="auto" class="pt-7 pr-0" style="z-index: 3">
              <div class="img-border mt-n1 mr-n1">
                <div>
                  <v-img contain max-width="48" max-height="48" :src="walletIconUrl" />
                </div>
              </div>
            </v-col>
            <v-col cols="auto" class="pt-7 mx-n4" style="z-index: 2">
              <v-img
                contain
                max-width="46"
                max-height="46"
                :src="`/logos/${selectedAccountId}.webp`"
              />
            </v-col>
            <v-col cols="auto" class="pt-7 pl-0" style="z-index: 1">
              <v-img
                height="46"
                max-width="46"
                contain
                :src="require('@/assets/icons/icon-check.webp')"
              ></v-img>
            </v-col>

            <v-col cols="12" class="pt-5">
              <h1 class="title-h1 text-center">You're all set!</h1>
            </v-col>

            <v-col cols="8" class="pt-5">
              <h3 class="sub-title-h3 text-center">
                You now have access to the wallet receiving your royalties.
              </h3>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-if="false" cols="12" class="d-flex justify-end pb-4">
        <FormButton class="mr-5" :text="'Done'" :type="'back'" @click="publishData"> </FormButton>
        <!-- 
          <FormButton :text="'VERIFY ANOTHER ID'" @click="$router.push('/select')"> </FormButton> 
        -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormButton from "@/components/FormButton.vue";

import { mapState } from "vuex";

export default {
  name: "ConnectView",
  data() {
    return {
      accountIds: [],
      step: 1,
      userData: {},
      selectedAccount: {},
      walletIconUrl: null,
    };
  },
  computed: {
    ...mapState(["selectedAccountId"]),
    getSelectedAccountIdName() {
      return this.accountIds.find((e) => e.IdName == this.selectedAccountId)?.IdNameDesc;
    },
  },
  methods: {
    async connectAccount() {
      console.log("Call connectAccount");

      await this.$store.dispatch("near/connectNear");
    },
    publishData() {
      setTimeout(() => {
        this.$store.dispatch("publishData");
      }, 3 * 1000);
    },
  },
  async mounted() {
    this.walletIconUrl = await this.$store.dispatch("near/getWalletIconUrl");

    this.$store.commit("royalty/verifySuccess", true);
    this.$store.commit("stepSuccess", true);

    await this.publishData();
  },
  components: {
    FormButton,
  },
};
</script>
<style lang="scss">
.img-border {
  > div {
    box-shadow: 0px 0px 1px 0px var(--light-blue-grey);
    padding: 8px;
    border-radius: 50%;
    background-color: white;
    max-height: 46px;
    max-width: 46px;
  }
  border-radius: 50%;
  background-color: white;

  border: solid 4px white;
}
</style>
