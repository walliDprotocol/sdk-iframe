<template>
  <v-select
    class="network-dropdown mx-3"
    v-model="selectedNetwork"
    :items="networksList"
    variant="solo"
    :item-text="'name'"
    :color="'none'"
    return-object
    attach
    hide-details
    append-icon="mdi-chevron-down"
    :ripple="false"
  >
    <template #prepend-inner>
      <v-img :src="`/logos/nearTokens.webp`" contain max-height="16" max-width="16" class="mr-3" />
    </template>
    <template #item="{ item }">
      <div class="d-flex align-center">
        <v-img
          :src="`/logos/nearTokens.webp`"
          contain
          max-height="16"
          max-width="16"
          class="mr-3"
        />
        <p>
          {{ item.name }}
        </p>
        <v-img
          v-if="item.id === selectedNetwork.id"
          :src="`/logos/check.webp`"
          contain
          max-height="6"
          max-width="8"
          class="ml-3"
        />
      </div>
    </template>
  </v-select>
</template>
<script>
import { getJSONStorage } from "@/plugins/utils";

export default {
  name: "FormButton",
  props: ["text", "type"],
  mounted() {
    let sessionNetwork = getJSONStorage("local", "selectedNetwork");
    this.selectedNetwork =
      Object.entries(sessionNetwork).length > 0 ? sessionNetwork : this.networksList[0];
  },
  computed: {
    selectedNetwork: {
      get() {
        return this.$store.getters.selectedNetwork;
      },
      set(value) {
        console.log(value);
        this.$store.dispatch("changeNetwork", value);
      },
    },
  },
  data() {
    return {
      networksList: [
        {
          name: "NEAR Testnet",
          id: "testnet",
        },
        {
          name: "NEAR Mainnet",
          id: "mainnet",
        },
      ],
    };
  },
  components: {},
};
</script>

<style lang="scss">
.network-dropdown.v-input {
  z-index: 101;
  max-width: 120px;
  .v-ripple__container {
    display: none !important;
  }
  .v-input__control {
    height: 20px;
    border-radius: 11px;
    border: solid 1px var(--light-grey);
    .v-input__append-inner,
    .v-input__prepend-inner {
      margin-top: 0;
    }
    .v-input__prepend-inner {
      padding-right: 0;
      margin-top: 1px;
    }

    .v-input__append-inner {
      .v-input__icon {
        height: 20px;
        .v-icon {
          font-size: 16px;
        }
      }
    }
    .v-select__selection {
      font-family: Karla;
      font-size: 11px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: var(--midnight);
      margin-bottom: 0;
      &.v-select__selection--comma {
        margin: 0;
        overflow: initial;
      }
    }
    input {
      max-height: 20px;
      padding: 0;
    }
    .v-input__slot {
      display: flex;
      align-items: center;
      margin-bottom: 0;
      &::before,
      &::after {
        content: none;
      }
    }
  }

  .v-menu__content {
    margin-top: 24px;
    z-index: 101;
    min-width: 140px !important;
    margin-left: -10px;
  }
  .v-list-item--active::before {
    background-color: transparent !important;
  }
  .v-select-list {
    padding: 0;
  }
  .v-list-item {
    min-height: 34px;
    padding-left: 12px;
    padding-right: 6px;
  }
  p {
    font-family: Karla;
    font-size: 11px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: var(--midnight);
    margin-bottom: 0;
  }
}
</style>
