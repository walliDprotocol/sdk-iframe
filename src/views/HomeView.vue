<template>
  <v-container fill-height class="pt-7 align-content-start">
    <v-container v-if="step == 1" fill-height class="pa-0 align-content-space-between">
      <v-row>
        <v-col cols="12">
          <h1 class="title-h1">Select the IDs you'd like to verify</h1>
        </v-col>
        <v-col cols="12" class="pt-5">
          <IdCardWrapper :items="accountIds" @selectedDblClick="setSelectedAccount(), (step = 2)" />
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

    <v-container v-if="step == 2" fill-height class="pa-0 align-content-space-between">
      <v-row>
        <v-col cols="12">
          <h1 class="title-h1">
            Connect to your {{ selectedAccount.IdNameDesc }} account and select the attributes you
            want to verify
          </h1>
        </v-col>
        <v-col cols="12" class="pt-5">
          <ConnectAccount
            :selectedAccount="selectedAccount"
            @errorMessage="errorMessage = $event"
          />
        </v-col>
      </v-row>

      <v-row class="pb-2">
        <v-col class="d-flex justify-end">
          <FormButton class="mr-5" :text="'Back'" :type="'back'" @click="backStep"> </FormButton>
          <FormButton
            :text="'CONNECT'"
            :disabled="isDisabled"
            :loading="loadingConnectAccount"
            @click="connectAccount"
          >
          </FormButton>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import FormButton from "@/components/FormButton.vue";
import IdCardWrapper from "@/components/IdCardWrapper.vue";
import ConnectAccount from "@/components/ConnectAccount.vue";

import axios from "axios";

// import Vue from "vue";

import { mapGetters, mapState } from "vuex";

export default {
  name: "HomeView",
  data() {
    return {
      accountIds: [],
      step: 1,
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
      return !!this.errorMessage || !this.selectedAccount?.options?.some((value) => value.state);
    },
  },
  methods: {
    setSelectedAccount() {
      // this.$router.push("/success");
      this.errorMessage = null;
      this.selectedAccount = this.accountIds.find((e) => e.IdName == this.selectedAccountId);
    },
    async connectAccount() {
      console.log("Call connectAccount", this.nearAccountId);
      this.loadingConnectAccount = true;
      try {
        if (this.isRoyaltyFlow || this.nearAccountId) {
          const { state } = await this.$store.dispatch("connectAccount", {
            selectedAccount: this.selectedAccount,
            redirectPath: this.redirectPath,
          });
          if (state == "success") {
            this.$router.push("/success");
          }
        } else {
          await this.$store.dispatch("near/connectNear");
        }
      } catch (error) {
        console.log("connectAccount", error);
      } finally {
        this.loadingConnectAccount = false;
      }
    },

    backStep() {
      this.step = 1;
      this.loadingConnectAccount = false;

      // uncomment this line to remove selected value on back
      // this.$store.commit("selectedAccountId");
    },
  },
  async mounted() {
    console.log(this.$route);

    this.isRoyaltyFlow = this.$route?.path.includes("royalties");
    ({ accountIds: this.accountIds, redirectPath: this.redirectPath } = (
      await axios.get(this.isRoyaltyFlow ? "/userDataRoyalties.json" : "/userData.json")
    ).data);

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
