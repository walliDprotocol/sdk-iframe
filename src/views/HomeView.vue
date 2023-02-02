<template>
  <v-container fill-height class="pt-7 align-content-start">
    <v-container
      v-if="step == 1"
      fill-height
      class="pa-0 align-content-space-between"
    >
      <v-row>
        <v-col cols="12">
          <h1 class="title-h1">Select the IDs you'd like to verify</h1>
        </v-col>
        <v-col cols="12" class="pt-5">
          <IdCardWrapper :items="accountIds" />
        </v-col>
      </v-row>
      <v-row class="pb-2">
        <v-col class="d-flex justify-end">
          <FormButton
            :text="'Next'"
            :disabled="!selectedAccountId"
            @click="setSelectedAccount(), (step = 2)"
          >
          </FormButton>
        </v-col>
      </v-row>
    </v-container>

    <v-container
      v-if="step == 2"
      fill-height
      class="pa-0 align-content-space-between"
    >
      <v-row>
        <v-col cols="12">
          <h1 class="title-h1">
            Connect to your {{ selectedAccount.IdNameDesc }} account and select
            the attributes you want to verify
          </h1>
        </v-col>
        <v-col cols="12" class="pt-5">
          <ConnectAccount :selectedAccount="selectedAccount" />
        </v-col>
      </v-row>

      <v-row class="pb-2">
        <v-col class="d-flex justify-end">
          <FormButton
            class="mr-5"
            :text="'Back'"
            :type="'back'"
            @click="backStep"
          >
          </FormButton>
          <FormButton
            :text="'CONNECT'"
            :disabled="isDisabled"
            @click="connectAccount"
          >
          </FormButton>
        </v-col>
      </v-row>
      <!-- <FormButton :text="'Sign'" @click="verifySignature"> </FormButton> -->
    </v-container>
  </v-container>
</template>

<script>
import FormButton from "@/components/FormButton.vue";
import IdCardWrapper from "@/components/IdCardWrapper.vue";
import ConnectAccount from "@/components/ConnectAccount.vue";

import axios from "axios";

// import Vue from "vue";

import { mapState } from "vuex";

export default {
  name: "HomeView",
  data() {
    return { accountIds: [], step: 1, userData: {}, selectedAccount: {} };
  },
  computed: {
    ...mapState(["nearAccount", "selectedAccountId"]),
    isDisabled() {
      return !this.selectedAccount?.options?.some((value) => value.state);
    },
  },
  methods: {
    setSelectedAccount() {
      // this.$router.push("/success");

      this.selectedAccount = this.accountIds.find(
        (e) => e.IdName == this.selectedAccountId
      );
    },
    async connectAccount() {
      console.log("Call connectAccount");

      if (this.nearAccount) {
        const { state } = await this.$store.dispatch("connectAccount", {
          accountId: this.selectedAccount.IdName,
        });

        if (state == "success") {
          this.$router.push("/success");
        }
      } else {
        await this.$store.dispatch("near/connectNear");
      }
    },

    async verifySignature() {
      console.log("Call verifySignature");

      await this.$store.dispatch("near/verifySignature");
    },

    backStep() {
      this.step = 1;
      // uncomment this line to remove selected value on back
      // this.$store.commit("selectedAccountId");
    },
  },
  async mounted() {
    this.accountIds = (await axios.get("userData.json")).data.accountIds;

    // await this.$store.dispatch("near/initNear");

    // this.step = 2;

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
    ConnectAccount,
  },
};
</script>
