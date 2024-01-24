<template>
  <div :class="`details-card d-flex justify-content-center align-items-center ${themeStyle ? 'theme-style' : ''} rounded text-capitalize pt-3`" :style="{backgroundColor: bgColor, borderColor: color, borderStyle: 'groove'}">
    <i class="mdi mdi-account-star-outline"></i>
    <h3 class="circle-container"><span class="circle">+{{ challenge.reputationIds.length }}</span></h3>
    <div class="d-flex flex-column justify-content-center align-items-center text-white text-capitalize pb-5 pt-3">
      <h3 class="text-capitalize">Reputation</h3>
      <h6>Creator <span class="text-lowercase">(total)</span>: {{ challenge.creator.reputation }}</h6>
      <h6>Challenge <span class="text-lowercase">(total)</span>: {{ challenge.reputationIds.length }}</h6>
    </div>
  </div>
</template>

<script>
import { Challenge } from '../../models/Challenge'
export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    },
    bgColor: {type: String, required: true},
    color: {type: String, required: true},
    themeStyle: {type: Boolean, required: true, default: false}
  }
}
</script>

<style scoped lang="scss">
.mdi-account-star-outline {
  position: relative;
  top: 20%;
  font-size: 3rem;
  transform: translateX(-10%);
}
.circle-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  .circle {
    position: absolute;
    top: 0;
    right: 36%;
    transform: translateY(-85%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    box-shadow: inset 0 0 0 2px #2a8f4c;
    border-radius: 50%;
    background-color: #38BB64;
    color: white;
    font-size: 1.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 1200px) {
      right: 15%;
    }
    @media screen and (max-width: 992px) {
      right: 5%;
    }
    @media screen and (max-width: 768px) {
      right: 40%;
    }
  }
}
</style>