<template>
  <v-container class="px-0 id-card-wrapper">
    <v-row class="text-center">
      <v-col cols="12" sm="4" v-for="(item, index) in items" :key="index">
        <IdCard
          :item="item"
          @selected="selected = index"
          @selectedDblClick="(selected = index), $emit('selectedDblClick')"
          :class="{ selected: index == selected }"
        />
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
<style lang="scss">
.id-card-wrapper {
  height: 390px;
  overflow: hidden;

  & > .row {
    max-height: 395px;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
