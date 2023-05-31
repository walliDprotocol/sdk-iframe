<template>
  <div>
    <v-container class="connect-account pa-3">
      <v-row class="text-center">
        <v-col cols="12" class="d-flex pa-2">
          <v-col cols="auto" class="d-flex align-center">
            <v-img
              :src="
                selectedAccount.imgType === 'url'
                  ? selectedAccount.imgUrl
                  : `/logos/${selectedAccount.IdName}.webp`
              "
              contain
              max-height="40"
              max-width="40"
            />
          </v-col>
          <v-col cols="8" class="pl-0 d-flex flex-column align-start justify-center">
            <p class="bold-text-p mb-0" :style="'font-size:15px'">
              {{ selectedAccount.IdNameDesc }}
            </p>
            <p class="mb-0">
              {{ userData.username }}
            </p>
            <p class="bold-text-p mb-0">
              {{ userData.name }}
            </p>
          </v-col>
          <v-spacer />

          <v-col
            v-if="optionsFiltered.length > 1"
            cols="2"
            class="d-flex flex-column align-center justify-center"
          >
            <p
              class="bold-text-p text-uppercase mb-0"
              :style="{
                cursor: 'pointer',
                color: allSelected ? '#01022E' : '#00AFC5',
              }"
              @click="setAll"
            >
              {{ allSelected ? "Selected!" : "Select all" }}
            </p>
          </v-col>
        </v-col>
      </v-row>

      <v-row class="text-center" v-for="(item, index) in optionsFiltered" :key="index">
        <v-col cols="12" class="d-flex align-start">
          <v-col cols="auto" class="d-flex fill-height align-start">
            <p class="bold-text-p text-left mb-0">
              {{ item.field }}
            </p>
          </v-col>
          <v-col
            cols="5"
            class="pl-0 d-flex fill-height flex-column align-start justify-space-between"
          >
            <p
              class="normal-text-p text-left"
              v-for="(desc, index) in item.description"
              :key="index"
            >
              {{ desc }}
            </p>
          </v-col>
          <v-spacer />
          <v-col cols="2" class="d-flex fill-height flex-column align-end pr-sm-0">
            <v-switch
              class="mt-0 pt-0 form-switch"
              height="16"
              v-model="item.state"
              hide-details
              dense
              :ripple="false"
            ></v-switch>
          </v-col>
        </v-col>
      </v-row>
    </v-container>
    <v-row class="message-row" v-if="errorMessage">
      <v-col class="pa-5 py-6">
        <p :class="{ 'error-message': errorMessage }">
          {{ errorMessage }}
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    selectedAccount: Object,
    checkBalance: {
      type: Boolean,
      default: true,
    },
  },
  beforeDestroy() {
    this.selectedAccount?.options.map((e) => (e.state = false));
  },

  watch: {
    allSelected(val) {
      this.$emit("allSelected", val);
    },
  },
  async mounted() {
    try {
      if (
        (this.selectedAccount.contractType == "native" ||
          this.selectedAccount.contractType == "ERC20") &&
        this.checkBalance
      ) {
        const availableBalance = await this.$store.dispatch(
          "getAccountBalance",
          this.selectedAccount
        );
        if (availableBalance > this.selectedAccount?.options?.[0]?.value) {
          this.selectedAccount?.options.map((e) => (e.state = true));
        } else {
          throw new Error(
            `Your  ${this.selectedAccount?.IdNameDesc}  balance doesn't meet the requirements`
          );
        }
      }
    } catch (error) {
      this.$emit("errorMessage", error.message);
      this.errorMessage = error.message;
    }

    this.$emit("allSelected", this.allSelected);
  },
  computed: {
    optionsFiltered() {
      return this.selectedAccount?.options.filter((e) => !("display" in e) || e.display);
    },
    allSelected() {
      return this.selectedAccount?.options.every((e) => {
        return !e.display || (e.display && e.state);
      });
    },
    userData() {
      return this.selectedAccount?.userData || {};
    },
    defaultMessage() {
      return "After click in “verify” button please accept the signature request presented by NEAR wallet.";
    },
  },
  methods: {
    setAll() {
      if (this.allSelected) {
        this.selectedAccount?.options.map((e) => (e.state = false));
      } else {
        this.selectedAccount?.options.map((e) => (e.state = true));
      }
    },
  },
  data() {
    return {
      selected: -1,
      errorMessage: "",
    };
  },
};
</script>
<style lang="scss">
.error-message {
  font-family: Karla;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.51;
  letter-spacing: normal;
  color: #f02049;
}
</style>
