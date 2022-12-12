<template>
  <v-container class="id-card-container">
    <v-row class="text-left id-card-row">
      <v-col cols="3" class="id-card-col pr-0">
        <v-img
          :src="`./logos/${item.IdName}.webp`"
          contain
          max-height="40"
          max-width="40"
        />
      </v-col>
      <v-col cols="9" class="id-card-col pl-0 d-flex flex-column align-start">
        <p class="bold-text-p text-uppercase mb-2">
          {{ item.IdNameDesc }}
        </p>
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
        web2: ({ IdNameDesc }) => `Connect your ${IdNameDesc} account`,
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
  cursor: pointer;

  height: auto;

  display: flex;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 24px;

  &:hover,
  &.selected {
    background-color: var(--white);
  }
  .id-card-row.row {
    .id-card-col.col {
      display: flex;
      align-items: center;
    }
  }
}
</style>
