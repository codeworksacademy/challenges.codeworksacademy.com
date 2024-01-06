<template>
  <div class="container-fluid">
    <div class="input-group mb-3">
      <input type="text" class="form-control" id="badgeImg" name="badgeImg" placeholder="Upload a Transparent Image" v-model="challenge.badgeImg">
      <label class="input-group-text btn-success btn" for="badgeImg">Upload Badge Image</label>
    </div>
    <span class="d-flex justify-content-center align-items-center text-success fw-semibold mb-2">Select Badge Fill Color</span>
    <div class="col-12 select-options-color-picker-box d-flex justify-content-center align-items-center mb-2">
      <select class="col-4 select-options-color-picker" v-model="colorFill">
        <option v-for="color in colorFill" :value="color" :style="{ backgroundColor: color }"> {{ color }} </option>
      </select>
    </div>
    <div class="col-4 d-flex justify-content-center align-items-center m-auto">
      <div class="badge badge-color position-relative" id="collaborator">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="100px" height="105px"
          viewBox="0 0 216 232">
          <path id="color-picker" :fill="colorFill"
            d="M207,0C171.827,0.001,43.875,0.004,9.003,0c-5.619-0.001-9,3.514-9,9c0,28.23-0.006,151.375,0,169c0.005,13.875,94.499,54,107.999,54S216,191.57,216,178V9C216,3.298,212.732,0,207,0z" />
        </svg>
        <div class="text-uppercase rounded-circle bg-light">
          <img :src="challenge.badgeImg" alt="" class="img-fluid position-absolute" style="height: 50px; top: 25%; left: 50%; transform: translateX(-50%)">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    const colorFill = ref([
      "#FF0000",
      "#FFA500",
      "#FFFF00",
      "#008000",
      "#0000FF",
      "#4B0082",
      "#EE82EE"
    ])    
    return {
      colorFill
    }
  }
}
</script>

<style scoped lang="scss">
.btn-success {
  border-top-right-radius: .3rem !important;
  border-bottom-right-radius: .3rem !important;
}
</style>