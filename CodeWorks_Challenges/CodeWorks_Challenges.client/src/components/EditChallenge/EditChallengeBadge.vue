<template>
  <div class="container-fluid">
    <div class="input-group mb-3">
      <input type="text" class="form-control" id="badgeTitle" name="badgeTitle" placeholder="Provide Title for Badge" v-model="challenge.badge.title">
      <label class="input-group-text btn-success btn" for="badgeTitle">Confirm</label>
    </div>
    <span class="d-flex justify-content-center align-items-center text-success fw-semibold mb-2">Select Title Background</span>
    <div class="col-12 select-options-color-picker-box d-flex justify-content-center align-items-center mb-2">
      <select class="col-4 select-options-color-picker" v-model="selectedBackground">
        <option :value="''" disabled>Select Color Fill</option>
        <option v-for="color in titleBackground" :value="color">{{ color }}</option>
      </select>
    </div>
    <div class="input-group mb-3">
      <input type="text" class="form-control" id="badgeImg" name="badgeImg" placeholder="Upload a Transparent Image" v-model="challenge.badge.image">
      <label class="input-group-text btn-success btn" for="badgeImg">Upload Badge Image</label>
    </div>
    <span class="d-flex justify-content-center align-items-center text-success fw-semibold mb-2">Select Badge Fill Color</span>
    <div class="col-12 select-options-color-picker-box d-flex justify-content-center align-items-center mb-2">
      <select class="col-4 select-options-color-picker" v-model="selectedFill">
        <option :value="''" disabled>Select Color Fill</option>
        <option v-for="color in colorFill" :value="color">{{ color }}</option>
      </select>
    </div>
    <ChallengeBadge :challenge="challenge" />
  </div>
</template>

<script>
import { AppState } from '../../AppState.js'
import { Challenge } from '../../models/Challenge.js'
import ChallengeBadge from '../ChallengePage/ChallengeBadge.vue'
import { ref } from 'vue'

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
    //Select the background color for the upper badge title
    const selectedBackground = ref('')
    const titleBackground = AppState.ChallengeState.badgeTitleBackground
    
    //Select the SVG color fill for the body of the badge
    const selectedFill = ref('')
    const colorFill = AppState.ChallengeState.badgeColorFill
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
.btn-success {
  border-top-right-radius: .3rem !important;
  border-bottom-right-radius: .3rem !important;
}
</style>