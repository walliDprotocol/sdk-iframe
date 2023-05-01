<template>
  <v-btn class="form-button" v-bind="$attrs" :class="type" @click="$emit('click')">
    <div>
      {{ text }}
    </div>
  </v-btn>
</template>
<script>
export default {
  name: "FormButton",
  props: ["text", "type"],
  mounted() {},

  components: {},
};
</script>

<style lang="scss">
.form-button.v-btn {
  font-family: Karla !important;
  border-radius: 20px;
  border: solid 1px transparent;
  // border-style: solid;
  // border-width: 1px;
  // border-image-source: linear-gradient(
  //   to bottom,
  //   #64ffde -16%,
  //   #73dde7 24%,
  //   #7acefd 66%,
  //   var(--midnight) 115%
  // );
  // border-image-slice: 1;
  height: 40px !important;
  padding: 0 !important;
  box-shadow: none;
  background-color: var(--midnight) !important;
  color: var(--white) !important;

  font-size: 15px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 1.25px;
  text-align: center;

  &.back {
    background-image: linear-gradient(white, white),
      linear-gradient(to bottom, #64ffde -16%, #73dde7 24%, #7acefd 66%, var(--midnight) 115%);
    background-origin: border-box;
    background-clip: content-box, border-box;
    color: var(--midnight) !important;
  }
  div {
    padding: 0 20px;
  }
}
</style>
