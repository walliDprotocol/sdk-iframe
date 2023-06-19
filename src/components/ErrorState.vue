<template>
  <v-container class="error-state">
    <v-row v-if="errorType == 'balance'" justify="center">
      <v-col cols="12" class="pt-16 d-flex justify-center">
        <v-img
          style="position: absolute; left: calc(50% - 66px)"
          contain
          max-width="48"
          max-height="48"
          :src="`/logos/${selectedAccount.IdName}.webp`"
        />
        <v-img
          contain
          max-width="41"
          max-height="46"
          :src="require('@/assets/icons/icon-error.webp')"
        />
      </v-col>
      <v-col cols="8" sm="8" class="pt-5">
        <h1 class="title-h1 text-center">
          Ups, it seems like this account doesn't have any royalties to claim yet.
        </h1>
      </v-col>
      <v-col cols="12" sm="8">
        <p class="normal-text-p text-center">
          You'll be able to claim your wallet once it has some funds in it.
        </p>
      </v-col>
    </v-row>
    <v-row v-else-if="errorType == 'seedPhrase'" justify="center">
      <v-col cols="12" sm="7" class="pt-16 d-flex justify-center">
        <v-img
          style="position: absolute; left: calc(50% - 66px)"
          contain
          max-width="48"
          max-height="48"
          :src="`/logos/${selectedAccount.IdName}.webp`"
        />
        <v-img
          contain
          max-width="41"
          max-height="46"
          :src="require('@/assets/icons/icon-error.webp')"
        />
      </v-col>
      <v-col cols="8" sm="7" class="pt-5">
        <h1 class="title-h1 text-center">
          Ups, there was a problem getting your wallet seed phrase
        </h1>
      </v-col>
    </v-row>
    <v-row v-else-if="errorType == 'generalError'" justify="center">
      <v-col cols="12" class="pt-16 d-flex justify-center">
        <v-img
          style="position: absolute; left: calc(50% - 66px)"
          contain
          max-width="48"
          max-height="48"
          :src="`/logos/${selectedAccount.IdName}.webp`"
        />
        <v-img
          contain
          max-width="41"
          max-height="46"
          :src="require('@/assets/icons/icon-error.webp')"
        />
      </v-col>
      <v-col cols="12" class="pt-5">
        <h1 class="title-h1 text-center">Ups, there was a problem</h1>
      </v-col>
      <v-col cols="8" sm="8">
        <p class="normal-text-p text-center">
          {{ errorMessage }}
        </p>
      </v-col>
    </v-row>
    <v-row v-else justify="center">
      <v-col cols="12" class="pt-16 d-flex justify-center">
        <div class="d-flex grow" style="min-height: 48px; position: relative">
          <v-img
            style="position: absolute; left: calc(50% - 46px)"
            contain
            max-width="48"
            max-height="48"
            :src="`/logos/${selectedAccount.IdName}.webp`"
          />
          <v-img
            style="position: absolute; left: calc(50% - 2px)"
            contain
            max-width="48"
            max-height="48"
            :src="require('@/assets/icons/icon-error.webp')"
          />
        </div>
      </v-col>
      <v-col cols="12" class="pt-5">
        <h1 class="title-h1 text-center">Verification failed</h1>
      </v-col>
      <v-col cols="12" sm="8">
        <p class="normal-text-p text-center">
          {{ errorMessage }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ErrorState",
  props: {
    errorMessage: String,
    selectedAccount: Object,
    userData: Object,
    errorType: String,
  },

  async mounted() {},
  computed: {},
  methods: {},
  data() {
    return {};
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
