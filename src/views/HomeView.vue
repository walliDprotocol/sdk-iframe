<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="title-h1">Select the IDs you'd like to verify</h1>
      </v-col>
      <v-col cols="12">
        <IdCardWrapper :items="accountIds" />
      </v-col>

      <v-col> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import IdCardWrapper from "@/components/IdCardWrapper.vue";

import axios from "axios";

export default {
  name: "HomeView",
  data() {
    return { accountIds: [] };
  },
  mounted() {
    axios
      .get("userData.json")
      .then(({ data }) => (this.accountIds = data.accountIds));
  },
  components: {
    IdCardWrapper,
  },
};
</script>
