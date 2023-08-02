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
        <span class="loader"></span>
        <!-- <div class="circle circle-1"></div> -->
        <!-- <div class="circle circle-2"></div> -->
        <!-- <div class="background">
          <div class="circle"></div>
        </div> -->
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["loading"],
};
</script>

<style lang="scss">
// .half-circle-spinner,
// .half-circle-spinner * {
//   box-sizing: border-box;
// }

.half-circle-spinner {
  width: 45px;
  height: 45px;
  // border-radius: 100%;
  // position: relative;
  margin: auto;

  border-radius: 50%;
}

// .half-circle-spinner .circle {
//   content: "";
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   border-radius: 100%;
//   border: calc(30px / 10) solid;
// }

.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  border: 3px solid #7acefd;
  border-right: 3px solid transparent;
  border-top: 3px solid transparent;
  box-sizing: border-box;
  position: relative;
  animation: rotation 1.2s infinite;
}
.loader::after {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 0;
  margin: 3px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid #64ffde;
  border-top: 3px solid transparent;
  border-right: 3px solid transparent;

  animation: rotation 1s infinite reverse;
}
.loader::before {
  content: "";
  box-sizing: border-box;

  display: block;

  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #73dde7;
  border-bottom: 3px solid transparent;
  border-right: 3px solid transparent;
  animation: rotation 1.2s infinite reverse;
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.half-circle-spinner .background {
  $border: calc(30px / 10);

  position: relative;

  width: 100%;
  height: 100%;

  background: linear-gradient(
    90deg,
    transparent 8%,
    #64ffde 15%,
    #73dde7 25%,
    #7acefd 45%,
    #73dde7 75%,
    #64ffde 85%,
    transparent 92%
  );
  border-radius: 50%;

  animation: half-circle-spinner-animation 2s infinite;

  .circle {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: inherit; /* !importanté */

    display: flex;
    align-items: center;
    //width: 50vw;

    color: #fff;
    background: #fff;
    background-clip: padding-box; /* !importanté */
    border: solid $border transparent; /* !importanté */
    border-radius: 50%;
  }
  // z-index: 1;
}
.half-circle-spinner .circle.circle-1 {
  border-top-color: #7acefd;
  animation: half-circle-spinner-animation 2s infinite;
  z-index: 3;
}

.half-circle-spinner .circle.circle-2 {
  border-bottom-color: #73dde7;
  animation: half-circle-spinner-animation 2s infinite alternate;

  z-index: 3;
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
