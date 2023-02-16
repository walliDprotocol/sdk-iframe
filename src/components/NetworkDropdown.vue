<template>
  <div class="text-center">
    <v-select
      class="network-dropdown"
      v-model="selectedNetwork"
      :items="networksList"
      variant="solo"
      :item-text="'name'"
      return-object
    >
    </v-select>
  </div>
</template>
<script>
import { getJSONStorage } from "@/plugins/utils";

export default {
  name: "FormButton",
  props: ["text", "type"],
  mounted() {
    let sessionNetwork = getJSONStorage("local", "selectedNetwork");
    this.selectedNetwork =
      Object.entries(sessionNetwork).length > 0
        ? sessionNetwork
        : this.networksList[0];
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
          name: "NEAR Tesnet",
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

<style lang="scss" scoped>
.network-dropdown {
}
</style>
