<template>
  <span class="d-flex justify-content-center align-items-center text-success fw-semibold mb-2">Select Title Background</span>
  <div class="col-12 select-options-color-picker-box d-flex justify-content-center align-items-center mb-2">
    <select class="col-4 select-options-color-picker" v-model="selectedBackground">
      <option :value="''" disabled>Select Color Fill</option>
      <option v-for="color in titleBackground" :value="color" :style="{ background: color }">{{ color }}</option>
    </select>
  </div>
  <span class="d-flex justify-content-center align-items-center text-success fw-semibold mb-2">Select Badge Fill Color</span>
  <div class="col-12 select-options-color-picker-box d-flex justify-content-center align-items-center mb-2">
    <select class="col-4 select-options-color-picker" v-model="selectedFill">
      <option :value="''" disabled>Select Color Fill</option>
      <option v-for="color in colorFill" :value="color" :style="{ background: color }">{{ color }}</option>
    </select>
  </div>
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
.title {
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  font-size: 1em;
  text-align: center;
  position: absolute;
  color: #000;
  letter-spacing: .5px;
  text-shadow: 0 1px 1px #FFF, 0 -1px 1px #FFF, 1px 0 1px #FFF, -1px 0 1px #FFF;
  top: -5px;
  left: 7.75%;
  border-radius: 8px 8px 0 0;
  text-align: center;
  width: 97.75px;
  height: 30px;
  background: var(--bg-sub);
  padding: 12px 0;
}
</style>