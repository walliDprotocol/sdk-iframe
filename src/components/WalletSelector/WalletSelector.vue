<template>
  <v-container class="connect-account wallet-selector">
    <v-row justify="space-between">
      <v-col cols="4" class="pa-5 pr-1 pb-0">
        <h4 style="font-weight: 600">{{ $t(`walletSelector.label`) }}</h4>
        <v-radio-group v-model="value" row class="mt-3 wallet-radio">
          <v-radio
            v-for="{ id, name } in wallets"
            :key="id"
            :value="id"
            color="#009fb1"
            :ripple="false"
          >
            <template v-slot:label>
              <div class="d-flex align-center wallet-radio-button pa-2" style="font-size: 14px">
                <div class="d-flex align-center justify-center mr-3 wallet-radio-icon">
                  <img :src="require(`./logos/${id}.webp`)" alt="" width="38px" height="38px" />
                </div>
                {{ name }}
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="10" sm="7" class="">
        <v-container fill-height class="">
          <v-row class="border-none">
            <v-col cols="12" class="" style="height: 69px">
              <LoadingCircle
                class="border-none"
                style="height: unset"
                :loading="loading"
              ></LoadingCircle>
            </v-col>
            <v-col cols="12" class="">
              <h4 class="text-center" style="font-weight: 600">{{ $t(`walletSelector.text`) }}</h4>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import LoadingCircle from "@/components/LoaderCircle";

export default {
  props: ["selectedWallet", "loading"],
  //   emits: ["update:selectedWallet"],
  components: { LoadingCircle },
  data() {
    return {
      wallets: [
        {
          id: "metamask",
          name: "Metamask",
        },
        {
          id: "valora",
          name: "Valora",
        },
        {
          id: "libera",
          name: "Libera",
        },
        {
          id: "celo-wallet",
          name: "Celo Extension Wallet",
        },
        {
          id: "wallet-connect",
          name: "WalletConnect",
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
<style lang="scss">
.connect-account.wallet-selector {
  .row {
    .col:first-child {
      border-right: solid 1px #eee;
    }
  }
  .wallet-radio {
    max-height: 145px;
    overflow-y: auto;
    .v-input--selection-controls__input {
      display: none;
    }
    .v-radio {
      border-radius: 8px;
      width: 100%;
      margin-bottom: 2px;
    }
    .v-item--active {
      background-color: #f4f4f4;
    }
    .wallet-radio-button {
      font-family: Karla;
      font-size: 15px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.8;
      letter-spacing: normal;
      color: #01022e;
    }
  }
}
</style>
