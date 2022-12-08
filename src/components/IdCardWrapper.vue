<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12" sm="4" v-for="(item, index) in items" :key="index">
        <IdCard :item="item" />
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
};
</script>
