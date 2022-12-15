<template>
  <v-container class="id-card-container fill-height">
    <v-row class="text-left id-card-row">
      <v-col cols="auto" class="id-card-col pr-0 pl-5">
        <v-img
          :src="`./logos/${item.IdName}.webp`"
          contain
          max-height="40"
          max-width="40"
        />
      </v-col>
      <v-col cols="9" class="id-card-col pl-3 d-flex flex-column align-start">
        <p
          class="bold-text-p text-uppercase"
          :class="{ 'mb-1': !userData.username }"
        >
          {{ item.IdNameDesc }}
          <v-icon v-if="userData.username" :color="'green'" right :size="16">
            mdi-checkbox-marked-circle
          </v-icon>
        </p>
        <p v-if="!userData.username" class="normal-text-p">
          {{ idDescription[item.type](item) }}
        </p>

        <p v-if="userData.username" class="mb-0">@{{ userData.username }}</p>
        <p v-if="userData.username" class="bold-text-p mb-0">
          {{ userData.name }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HelloWorld",
  props: ["item"],
  computed: {
    userData() {
      return this.item?.userData || {};
    },
  },
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
  height: 106px;
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
