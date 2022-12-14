<template>
  <v-container class="pa-0">
    <v-row class="text-center">
      <v-col
        cols="12"
        sm="4"
        v-for="(item, index) in items"
        :key="index"
        @click="selected = index"
      >
        <IdCard :item="item" :class="{ selected: index == selected }" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import IdCard from "./IdCard.vue";

export default {
  name: "HelloWorld",
  components: { IdCard },
  props: ["items"],
  watch: {
    selected() {
      this.$store.commit(
        "selectedAccountId",
        this.items[this.selected]?.IdName
      );
    },
  },
  data() {
    return {
      selected: -1,
    };
  },
};
</script>
