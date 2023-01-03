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
import { mapState } from "vuex";

export default {
  name: "HelloWorld",
  components: { IdCard },
  computed: {
    ...mapState(["nearAccount", "selectedAccountId"]),
  },
  props: ["items"],
  watch: {
    selected() {
      this.$store.commit(
        "selectedAccountId",
        this.items[this.selected]?.IdName
      );
    },
  },
  mounted() {
    this.selected = this.items.findIndex(
      (i) => i.IdName == this.selectedAccountId
    );
  },
  data() {
    return {
      selected: -1,
    };
  },
};
</script>
