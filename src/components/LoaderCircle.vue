<template>
  <v-row
    v-if="loading"
    style="height: 400px; max-width: unset"
    align-content="center"
    justify="center"
    no-gutters
  >
    <v-col cols="12">
      <div class="half-circle-spinner">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["loading"],
};
</script>

<style>
.half-circle-spinner,
.half-circle-spinner * {
  box-sizing: border-box;
}

.half-circle-spinner {
  width: 45px;
  height: 45px;
  border-radius: 100%;
  position: relative;
  margin: auto;
}

.half-circle-spinner .circle {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: calc(30px / 10) solid transparent;
}

.half-circle-spinner .circle.circle-1 {
  border-top-color: #01a3b0;
  animation: half-circle-spinner-animation 2s infinite;
}

.half-circle-spinner .circle.circle-2 {
  border-bottom-color: #035b60;
  animation: half-circle-spinner-animation 2s infinite alternate;
}

@keyframes half-circle-spinner-animation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
