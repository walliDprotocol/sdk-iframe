<template>
  <v-container class="connect-account pt-10" style="max-width: 840px">
    <v-row justify="start" class="pa-2">
      <v-col cols="auto" class="">
        <div class="number">1</div>
      </v-col>
      <v-col cols="4" class="">
        <p class="bold-text-p f15 mb-4">Copy this seedphrase to the clipboard</p>
        <p class="small-text-p">
          After completing this two steps at the moment of Import your wallet account, you will be
          prompted to enter the seed phrase generated here.
        </p>
      </v-col>

      <v-col cols="auto" class="pl-10">
        <v-container class="seed-phrase-wrapper" style="max-width: 446px">
          <v-row>
            <v-col style="position: relative">
              <div
                v-show="seedLocked"
                @click="seedLocked = false"
                class="blur-seed-box text-center"
              >
                <v-col cols="12" class="fill-height d-flex justify-center align-center">
                  <img
                    :height="42"
                    :width="42"
                    src="@/assets/icons/icon-unlock-eye.svg"
                    style="filter: brightness(0)"
                  />
                </v-col>
              </div>
              <v-col cols="12" :class="seedLocked ? 'blur-seed' : ''" class="seed-phrase">
                {{ seedphrase }}
              </v-col>
            </v-col>
          </v-row>
          <v-row justify="end">
            <v-col cols="auto" class="mt-1 pr-0">
              <v-btn class="btn-copy" text @click="copyClipboard">
                <img
                  :height="10"
                  :width="10"
                  src="@/assets/icons/icon-copy.svg"
                  style="filter: brightness(0)"
                  class="mr-1"
                />
                {{ "Copy" }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SeedPhraseWrapper",
  data() {
    return {
      seedLocked: true,
    };
  },
  methods: {
    copyClipboard() {
      navigator.clipboard.writeText(this.seedphrase);
    },
  },
  props: {
    seedphrase: {
      type: String,
      required: true,
    },
  },
  components: {},
};
</script>
<style scoped lang="scss">
.number {
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #fff;
  text-align: center;
  background-color: var(--midnight);
  font-family: Karla !important;

  border-radius: 50%;
  height: 20px;
  width: 20px;
  padding: 2px;
}
.seed-phrase-wrapper {
  .seed-phrase {
    padding: 16px 28px;
    text-align: center;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--midnight);
  }
  .btn-copy {
    min-width: unset !important;
    height: unset !important;
    padding: 4px 8px !important;
    border-radius: 12px;
    background-color: #eee;
    text-transform: none;

    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--midnight);
    * {
      font-family: Roobert !important;
    }
  }

  .row:nth-child(1) {
    border-radius: 16px;
    border: solid 1px #b3b2c0 !important;
  }
  .row:nth-child(2) {
    border: none !important;
  }
}
.blur-seed {
  filter: blur(2.5px);
  transition: all 0.3s linear;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.blur-seed-box {
  transition: all 0.3s linear;
  position: absolute;
  border-radius: 3px;
  margin-top: 4px;
  user-select: none;
  width: 100%;
  height: 100%;
  opacity: 0.62;
  background-color: var(--charcoal-grey);
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--white);
  align-items: center;
  text-align: center;
  cursor: pointer;
  z-index: 6;
  margin: -12px;
}
</style>
