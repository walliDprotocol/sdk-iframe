<template>
  <v-container fill-height class="d-flex" style="align-content: space-between">
    <v-row justify="center">
      <v-col cols="12" sm="12" class="pt-10">
        <v-container class="" style="max-width: 700px">
          <v-row justify="center" class="pa-10">
            <v-col cols="auto" class="pt-7 pr-0" style="z-index: 3">
              <div class="img-border mt-n1 mr-n1">
                <!-- <div> -->
                <v-img contain max-width="46" max-height="46" :src="walletIconUrl()" />
              </div>
              <!-- </div> -->
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
            <v-col cols="12" sm="12" class="pt-12 text-center">
              <h1 class="title-h1">Success!</h1>
            </v-col>
            <v-col cols="12" sm="9" class="">
              <p class="normal-text-p mb-0 ml-2 text-center">
                Your account was succesfully verified and there's a juicy NFT waiting for you to
                claim it.
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-end pb-4">
        <!-- <FormButton class="mr-5" :text="'Done'" :type="'back'" @click="publishData">
           </FormButton> -->
        <FormButton :text="'CLAIM IT'" @click="doClaimRequest"> </FormButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormButton from "@/components/FormButton.vue";

import { mapGetters, mapState } from "vuex";

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
    ...mapState(["selectedAccountId"]),
    ...mapGetters("web3wallet", ["selectedWallet"]),
  },
  methods: {
    walletIconUrl() {
      return require(`@/components/WalletSelector/logos/${this.selectedWallet || "celo"}.webp`);
    },
    async doClaimRequest() {
      console.log("Call doClaimRequest");

      // TODO: Claim?

      // Send event to close window
      await this.$store.dispatch("emitClose");
    },
    publishData() {
      setTimeout(() => {
        this.$store.dispatch("publishData");
      }, 3 * 1000);
    },
  },
  async mounted() {
    console.log(this.selectedAccountId);
  },
  components: {
    FormButton,
  },
};
</script>
