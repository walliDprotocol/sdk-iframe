<template>
  <v-container
    class="id-card-container fill-height"
    :class="item.status"
    @click="$emit('selected')"
    @dblclick="$emit('selectedDblClick')"
  >
    <v-row class="text-left id-card-row">
      <v-col cols="auto" class="id-card-col pr-2 pl-3">
        <img
          :src="item.imgType === 'url' ? item.imgUrl : `/logos/${item.IdName}.webp`"
          contain
          style="width: 100%; height: auto; max-width: 40px; max-height: 40px"
        />
      </v-col>
      <v-col cols="9" class="id-card-col pl-3 d-flex flex-column align-start">
        <div class="d-flex fluid" style="width: 100%">
          <p class="bold-text-p text-uppercase">
            {{ item.IdNameDesc }}
          </p>
          <div v-if="isVerified" class="verified-check">
            <img
              class="d-flex mr-1"
              :src="require(`../assets/icons/verified-check.svg`)"
              contain
              style="width: 100%; height: auto; max-width: 70px; max-height: 15px"
            />
            <p>VERIFIED</p>
          </div>
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
  name: "IdCard",
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
        OAUTH: ({ IdNameDesc }) => `Connect your ${IdNameDesc} account`,
        WEB3: ({ IdDescription }) => `${IdDescription}`,
      },
    };
  },
};
</script>

<style scoped lang="scss">
.verified-check {
  border-radius: 11px;
  background-color: #00e284;
  padding: 1px 5px;
  display: flex;
  align-items: center;
  margin-left: 8px;
  max-height: 15px;
  p {
    margin: 0;
    font-size: 11px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
  }
}
.id-card-container.container {
  border: solid 1px #fff;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.31);
  cursor: pointer;
  min-height: 106px;
  // max-height: 106px;
  display: flex;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  border: solid 1px #ebebeb;
  &.INACTIVE {
    opacity: 0.3;
    pointer-events: none;
  }
  &:hover,
  &.selected {
    background-color: var(--white);
    border: solid 1px #b3b2c0;
  }
  .id-card-row.row {
    .id-card-col.col {
      display: flex;
      align-items: center;
    }
  }
}
</style>
