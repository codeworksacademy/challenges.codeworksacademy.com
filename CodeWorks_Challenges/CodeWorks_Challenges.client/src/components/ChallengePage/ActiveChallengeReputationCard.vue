<template>
  <div class="details-card text-capitalize">
    <i class="mdi mdi-account-star-outline"></i>
    <h3 class="circle-container"><span class="circle">+{{ challenge.reputationIds.length }}</span></h3>
    <h6 class="text-center pb-2">Total Reputation</h6>
  </div>
</template>

<script>
import { Challenge } from '../../models/Challenge'
export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.mdi-account-star-outline {
  position: relative;
  top: 10%;
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
    right: 25%;
    transform: translateY(-150%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    box-shadow: inset 0 0 0 2px #2a8f4c;
    border-radius: 50%;
    background-color: #38BB64;
    color: white;
    font-size: 1.3rem;
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