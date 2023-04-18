<template>
  <v-container fill-height class="align-content-space-between">
    <v-row justify="center" class="pt-6">
      <v-col cols="6" class="pt-16">
        <div>Now do signature request</div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-end pb-5">
        <FormButton :text="'Sign post'" @click="sign"> </FormButton>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import FormButton from "@/components/FormButton.vue";
import { log } from "console";

export default {
  name: "SignatureView",
  methods: {
    async sign() {
      let signRes = await this.$store.dispatch("royalty/signData");
      this.$store.dispatch("publishData", { data: signRes });

      log("signRes", signRes);
    },
  },
  components: {
    FormButton,
  },
};
</script>
