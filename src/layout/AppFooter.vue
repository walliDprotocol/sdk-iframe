<template>
  <v-container class="app-footer pb-8">
    <v-row v-if="$route.name !== 'royalties-welcome'" class="justify-space-between">
      <v-col cols="12" class="d-flex justify-center">
        <p class="footer-label mb-0">Powered by</p>

        <v-img
          alt="Vuetify Logo"
          class="shrink ml-2"
          contain
          src="/logos/wallid.webp"
          transition="scale-transition"
          width="60"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "AppFooter",
};
</script>

<style lang="scss">
.app-footer {
  position: absolute;
  bottom: 0;
  right: calc(50% - 125px);
  max-width: 250px;
  .footer-label {
    font-family: Roobert;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #01022e;
  }
}
</style>
