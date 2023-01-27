<template>
  <v-container
    class="id-card-container fill-height"
    :class="item.status"
    @click="$emit('selected')"
  >
    <v-row class="text-left id-card-row">
      <v-col cols="auto" class="id-card-col pr-2 pl-3">
        <img
          :src="`./logos/${item.IdName}.webp`"
          contain
          style="width: 100%; height: auto; max-width: 40px; max-height: 40px"
        />
      </v-col>
      <v-col cols="9" class="id-card-col pl-3 d-flex flex-column align-start">
        <div class="d-flex fluid" style="width: 100%">
          <p class="bold-text-p text-uppercase">
            {{ item.IdNameDesc }}
          </p>
          <img
            v-if="isVerified"
            class="d-flex ml-2"
            :src="require(`../assets/icons/connected.webp`)"
            contain
            style="width: 100%; height: auto; max-width: 70px; max-height: 15px"
          />
        </div>
        <p class="normal-text-p">
          {{ idDescription[item.type](item) }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getJSONStorage } from "@/plugins/utils";

export default {
  name: "HelloWorld",
  props: ["item"],
  computed: {
    userData() {
      return this.item?.userData || {};
    },
  },
  mounted() {
    let data = getJSONStorage("local", this.item.IdName + "_user");
    this.isVerified = Object.entries(data).length > 0;
  },
  data() {
    return {
      isVerified: false,
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
  min-height: 106px;
  // max-height: 106px;
  display: flex;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 24px;

  &.INACTIVE {
    opacity: 0.3;
    pointer-events: none;
  }
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
