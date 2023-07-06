<template>
  <v-container class="connect-account pt-10" style="max-width: 820px">
    <v-row justify="start" class="pa-2">
      <!-- <v-col cols="auto" class="">
        <div class="number">1</div>
      </v-col> -->
      <v-col cols="4" class="">
        <p class="bold-text-p f15 mb-4">Copy this seedphrase to the clipboard</p>
        <p class="small-text-p">
          Download a NEAR wallet, select the "import wallet" option and and paste this seedphrase in
          your wallet extension.
        </p>
      </v-col>

      <v-col cols="7" class="pl-10">
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
              <v-tooltip
                bottom
                content-class="wallet-tooltip"
                :value="show"
                :open-on-focus="false"
                :open-on-hover="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="btn-copy" text v-bind="attrs" v-on="on" @click="copyClipboard">
                    <img
                      :height="10"
                      :width="10"
                      src="@/assets/icons/icon-copy.svg"
                      style="filter: brightness(0)"
                      class="mr-1"
                    />
                    {{ "Copy" }}
                  </v-btn>
                </template>
                <div class="arrow-seed-tooltip"></div>
                <div class="seed-phrase-tooltip">
                  <p>
                    {{ "Copied to clipboard!" }}
                  </p>
                  <!-- <p v-else>
                    {{ "Copy to clipboard" }}
                  </p> -->
                </div>
              </v-tooltip>
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
      show: false,
      tooltipTimeOut: null,
    };
  },
  methods: {
    copyClipboard() {
      try {
        navigator.clipboard.writeText(this.seedphrase);
        this.show = true;
        this.$emit("copy-click");
        if (!this.tooltipTimeOut) {
          this.tooltipTimeOut = setTimeout(() => {
            this.show = false;
            this.tooltipTimeOut = null;
          }, 2000);
        }
      } catch (err) {
        console.error(err);
      }
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

<style lang="scss">
.wallet-tooltip {
  &.v-tooltip__content {
    width: 170px;
    height: 43px;
    background-color: transparent;
    opacity: 1 !important;
  }
  &.v-tooltip__content .seed-phrase-tooltip {
    background-color: #d9fbed;
    padding: 4px;
    margin: auto;
    width: fit-content;
    border-radius: 8px;
  }
  p {
    margin: 0 !important;
    font-family: Roobert;
    font-size: 10px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #01022e;
  }
  .arrow-seed-tooltip {
    background-color: #d9fbed;
    transform: rotate(45deg);
    width: 12px;
    height: 12px;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -7px;
    z-index: -1;
  }
  .arrow-seed-tooltip--bottom {
    background-color: #d9fbed;
    transform: rotate(45deg);
    width: 15px;
    height: 15px;
    position: absolute;
    bottom: -5px;
    left: 50%;
    margin-left: -7px;
    z-index: -1;
  }
}
</style>
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

    word-spacing: 20px;
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
