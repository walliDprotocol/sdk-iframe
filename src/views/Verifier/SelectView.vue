<template>
  <v-container fill-height class="pt-7 align-content-start">
    <v-container fill-height class="pa-0 align-content-space-between">
      <v-row>
        <v-col cols="12">
          <h1 class="title-h1 text-center">Select the IDs you'd like to verify</h1>
        </v-col>
        <v-col cols="12" class="pt-5">
          <IdCardWrapper :items="accountIds" @selectedDblClick="setSelectedAccount()" />
        </v-col>
      </v-row>
      <v-row class="pb-2">
        <v-col class="d-flex justify-end">
          <FormButton :text="'Next'" :disabled="isDisabled" @click="setSelectedAccount()">
          </FormButton>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import FormButton from "@/components/FormButton.vue";
import IdCardWrapper from "@/components/IdCardWrapper.vue";

import axios from "axios";

// import Vue from "vue";

import { mapGetters, mapState } from "vuex";

export default {
  name: "SelectView",
  data() {
    return {
      accountIds: [],
      userData: {},
      selectedAccount: {},
      loadingConnectAccount: false,
      errorMessage: null,
    };
  },
  computed: {
    ...mapState(["selectedAccountId"]),
    ...mapGetters("near", ["nearAccountId"]),
    isDisabled() {
      return !!this.errorMessage || !this.selectedAccountId;
    },
  },
  methods: {
    setSelectedAccount() {
      // this.$router.push("/success");
      this.errorMessage = null;
      this.selectedAccount = this.accountIds.find((e) => e.IdName == this.selectedAccountId);

      this.$router.push({ name: "base-verify" });
    },
  },
  async mounted() {
    this.isRoyaltyFlow = this.$route?.path.includes("royalties");
    ({ accountIds: this.accountIds, redirectPath: this.redirectPath } = (
      await axios.get(this.isRoyaltyFlow ? "/userDataRoyalties.json" : "/userData.json")
    ).data);

    this.accountIds.forEach((a) =>
      a.options.forEach((option) => {
        option.display = true;
      })
    );

    // let objIndex = this.accountIds.findIndex(
    //   (e) => e.IdName == this.selectedAccountId
    // );

    // Vue.set(this.accountIds, objIndex, {
    //   ...this.accountIds[objIndex],
    //   userData,
    // });

    // this.accountIds[objIndex].userData = userData;
    // await this.$forceUpdate();
  },
  components: {
    IdCardWrapper,
    FormButton,
  },
};
</script>
