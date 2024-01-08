<template>
  <div class="container-fluid">
    <div class="input-group mb-3">
      <input type="text" class="form-control" id="badgeTitle" name="badgeTitle" placeholder="Provide Title for Badge" v-model="challenge.badge.title">
      <label class="input-group-text btn-success btn" for="badgeTitle">Confirm</label>
    </div>

    <!-- START - Choose whether your Challenge Badge Image is uploaded by file, or by an image URL -->
    <div class="input-group mb-3">
      <div v-if="imageUploadOption === 'url'" class="form-check form-switch">
        <input @change="handleUrlChange" id="radioDefault" type="checkbox" class="form-check-input">
        <label class="form-check-label text-grey darken-10" for="radioDefault">Upload Image URL</label>
      </div>
      <div v-else class="form-check form-switch">
        <input @change="handleUrlChange" id="radioChecked" type="checkbox" class="form-check-input" checked>
        <label class="form-check-label text-grey darken-10" for="radioChecked">Upload Image File</label>
      </div>
    </div>
    <div class="input-group mb-3">
      <input v-if="imageUploadOption === 'url'" type="text" class="form-control" id="badgeImg" name="badgeImg" placeholder="Upload a Transparent Image" v-model="challenge.badge.image">
      <input  v-if="imageUploadOption === 'file'" type="file" class="form-control" id="badgeImg" name="badgeImg" placeholder="Upload a Transparent Image" @change="handleFileUpload">
      <label class="input-group-text btn-success btn" for="badgeImg">Upload Badge Image</label>
    </div>
    <!-- END - [Image Upload Options] -->

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
    <!-- <ChallengeBadge :challenge="challenge" /> -->
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
  </div>
</template>

<script>
import { AppState } from '../../AppState.js'
import { Challenge } from '../../models/Challenge.js'
import ChallengeBadge from '../ChallengePage/ChallengeBadge.vue'
import { ref } from 'vue'
import { COLOR_FILLS, TITLE_BGS } from "../../constants"

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    }
  },
  components: {
    ChallengeBadge
  },
  setup() {
    const imageUploadOption = ref('url')
    
    function handleUrlChange() {
      if (imageUploadOption.value === 'url') {
        imageUploadOption.value = 'file'
      } else {
        imageUploadOption.value = 'url'
      }
    }

    function handleFileUpload(e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        AppState.ChallengeState.challenge.badge.image = reader.result
      }
    }
    //Select the background color for the upper badge title
    const selectedBackground = ref('')
    const titleBackground = TITLE_BGS
    
    //Select the SVG color fill for the body of the badge
    const selectedFill = ref('')
    const colorFill = COLOR_FILLS
    return {
      imageUploadOption,

      handleUrlChange,
      handleFileUpload,

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
.btn-success {
  border-top-right-radius: .3rem !important;
  border-bottom-right-radius: .3rem !important;
}
</style>