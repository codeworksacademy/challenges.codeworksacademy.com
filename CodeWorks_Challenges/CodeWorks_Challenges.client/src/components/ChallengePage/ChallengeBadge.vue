<template>
  <div class="d-flex justify-content-center align-items-center m-auto">
    <div class="badge badge-color position-relative mt-3" id="collaborator">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="100px" height="105px" viewBox="0 0 216 232">
        <path id="color-picker" :fill="selectedFill"
          d="M207,0C171.827,0.001,43.875,0.004,9.003,0c-5.619-0.001-9,3.514-9,9c0,28.23-0.006,151.375,0,169c0.005,13.875,124.499,54,107.999,54S216,191,216,178V9C216,3.298,212.732,0,207,0z" />
      </svg>
      <div class="text-uppercase rounded-circle bg-light">
        <span :style="{ background: selectedBackground }" class="title"> {{ challenge.badge.title }} </span>
        <img :src="challenge.badge.image" alt="" class="img-fluid position-absolute" style="max-height: 50px; max-width: 75px; top: 33%; left: 50%; transform: translateX(-50%)">
      </div>
    </div>
  </div>
</template>

<script>
import { AppState } from '../../AppState.js'
import { TITLE_BGS, COLOR_FILLS } from "../../constants"
import { Challenge } from '../../models/Challenge.js'
import { ref } from 'vue'

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    }
  },
  setup() {
    //Select the background color for the upper badge title
    const selectedBackground = ref('')
    const titleBackground = Object.values(TITLE_BGS)
    
    //Select the SVG color fill for the body of the badge
    const selectedFill = ref('')
    const colorFill = Object.values(COLOR_FILLS)
    return {
      selectedFill,
      selectedBackground,
      colorFill,
      titleBackground
    }
  }
}
</script>

<style scoped lang="scss">
</style>