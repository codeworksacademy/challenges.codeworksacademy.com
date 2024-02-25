<template>
  <div class="details-card d-flex justify-content-center align-items-center rounded text-capitalize pt-3"
    :style="{ backgroundColor: bgColor, color, borderColor: color }">

    <i class="mdi mdi-account-star-outline"></i>
    <div class="d-flex flex-column justify-content-center align-items-center text-uppercase pb-5 pt-3">
      <h3 class="text-capitalize">{{ challenge.reputationIds.length }} Reputation</h3>
    </div>
  </div>
</template>

<script>
import { Challenge } from '../../models/Challenge'
import GiveRepButton from './GiveRepButton.vue'

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    },
    bgColor: { type: String, required: true },
    color: { type: String, required: true },
    themeStyle: { type: Boolean, required: true, default: false }
  },

  components: { GiveRepButton }
}
</script>

<style lang="scss" scoped>
// .details-card {
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   color: #f0f0f0;
//   background: #1c2332;
//   text-align: center;
//   border-style: groove;
//   position: relative;
//   overflow: hidden;
// }
</style>