<template>
  <v-container class="connect-account">
    <v-row>
      <v-col cols="4" class="pa-5">
        <h4 style="font-weight: 600">{{ $t(`walletSelector.label`) }}</h4>
        <v-radio-group v-model="value" row class="mt-0 pt-0 wallet-radio">
          <v-radio
            v-for="{ name } in wallets"
            :key="name"
            :value="name"
            class="mr-12"
            color="#009fb1"
            :ripple="false"
          >
            <template v-slot:label>
              <div class="d-flex align-center wallet-radio-button" style="font-size: 14px">
                <div class="d-flex align-center justify-center mr-3 wallet-radio-icon">
                  <img :src="require(`./logos/${name}.webp`)" alt="" width="20px" height="20px" />
                </div>
                {{ name }}
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="8" class="pa-16">
        <h4 class="text-center" style="font-weight: 600">{{ $t(`walletSelector.text`) }}</h4>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: ["selectedWallet"],
  //   emits: ["update:selectedWallet"],
  data() {
    return {
      wallets: [
        {
          name: "metamask",
        },
      ],
    };
  },
  computed: {
    value: {
      get() {
        console.log("this.selectedWallet", this.selectedWallet);

        return this.selectedWallet;
      },
      set(value) {
        console.log("set Value", value);

        this.$emit("input", value);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.connect-account {
  .row {
    .col:first-child {
      border-right: solid 1px #eee;
    }
  }
}
</style>
