<template>
  <v-app class="verification-iframe">
    <v-app-bar
      class="iframe-app-bar"
      app
      elevation="0"
      color="transparent"
      height="74"
    >
      <v-container>
        <v-row>
          <v-col>
            <v-img
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              :src="require('./assets/logos/wallid.webp')"
              transition="scale-transition"
              width="115"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view class="px-7 pt-7" />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>

<style></style>
<style lang="scss">
#app {
  background: url("./assets/background/gradient@3x.webp");
  background-size: cover;
}
.iframe-app-bar .v-toolbar__content {
  border-bottom: solid 2px #f4f4f4;
  justify-content: center;

  padding: 0;

  .container {
    padding: 4px 30px;
  }
}
</style>
