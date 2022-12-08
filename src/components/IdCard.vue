<template>
  <v-container class="id-card-container">
    <v-row class="text-left id-card-row">
      <v-col cols="auto" class="id-card-col">
        <v-img
          :src="`./logos/${item.IdName}.webp`"
          contain
          max-height="40"
          max-width="40"
        />
      </v-col>
      <v-col cols="9" class="id-card-col">
        <p class="normal-text-p">
          {{ idDescription[item.type](item) }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HelloWorld",
  props: ["item"],
  data() {
    return {
      idDescription: {
        web2: ({ IdNameDesc }) =>
          `Connect your existing ${IdNameDesc} account to verify.`,
        web3: ({ IdDescription }) => `${IdDescription}`,
      },
    };
  },
};
</script>

<style scoped lang="scss">
.id-card-container.container {
  border: solid 1px #fff;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.31);

  height: 106px;

  display: flex;
  align-items: center;
  .id-card-row.row {
    .id-card-col.col {
      display: flex;
      align-items: center;
    }
  }
}
</style>
