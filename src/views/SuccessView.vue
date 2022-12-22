<template>
  <v-container fill-height class="d-flex" style="align-content: space-between">
    <v-row justify="center">
      <v-col cols="8" class="pt-10">
        <v-container class="connect-account" style="max-width: 700px">
          <v-row justify="center" class="pa-10">
            <v-col cols="8" class="pt-5">
              <v-img
                :src="require(`../assets/icons/success.webp`)"
                contain
                class="mx-auto"
                max-height="40"
                max-width="40"
              />
            </v-col>

            <v-col cols="8" class="pt-5">
              <h1 class="title-h1 text-center">
                Your {{ selectedAccountId }} account was successfully verified!
              </h1>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-end pb-4">
        <FormButton :text="'VERIFY ANOTHER ID'" @click="$router.push('/home')">
        </FormButton>
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
    };
  },
  computed: {
    ...mapState(["nearAccount", "selectedAccountId"]),
  },
  methods: {
    setSelectedAccount() {
      console.log(this.selectedAccountId);
      this.selectedAccount = this.accountIds.find(
        (e) => e.IdName == this.selectedAccountId
      );
    },
    async connectAccount() {
      console.log("Call connectAccount");

      await this.$store.dispatch("near/connectNear");
    },
  },
  mounted() {},
  components: {
    FormButton,
  },
};
</script>
