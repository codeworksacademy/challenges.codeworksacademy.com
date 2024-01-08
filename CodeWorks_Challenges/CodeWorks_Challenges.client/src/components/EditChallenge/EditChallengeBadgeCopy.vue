<template>
  <div class="container-fluid">
    <h4>Badge Customization</h4>
    <div class="input-group mb-3">
      <label class="input-group-text" for="badgeTitle">Badge Title</label>
      <input type="text" class="form-control" id="badgeTitle" name="badgeTitle" placeholder="Provide Title for Badge" v-model="challenge.badge.title">
    </div>
    <!-- <span class="d-flex justify-content-center align-items-center text-success fw-semibold mb-2">Select Title Background</span> -->
    <!-- <div class="col-12 select-options-color-picker-box d-flex justify-content-center align-items-center mb-2">
      <select class="col-4 select-options-color-picker" v-model="selectedBackground">
        <option :value="''" disabled>Select Color Fill</option>
        <option v-for="color in titleBackground" :value="color">{{ color }}</option>
      </select>
    </div> -->
    <div class="input-group mb-3">
      <label class="input-group-text" for="badgeImg">Badge Image</label>
      <input type="text" class="form-control" id="badgeImg" name="badgeImg" placeholder="Upload a Transparent Image" v-model="challenge.badge.image">
    </div>
    <span class="d-flex justify-content-center align-items-center text-success fw-semibold mb-2">Select Badge Fill Color</span>
    <div class="select-options-color-picker-box d-flex flex-column justify-content-center align-items-center mb-2">
      <!-- <select class="col-4 select-options-color-picker" v-model="selectedFill">
        <option :value="''" disabled>Select Color Fill</option>
        <option v-for="color in colorFill" :value="color">{{ color }}</option>
      </select> -->
      <div class="d-flex align-items-middle bg-light text-dark p-2 rounded mb-3 gap-1">
        <label for="">Primary Color</label>
        <input type="color" name="primaryFillColor" id="primaryFillColor" v-model="editable.primaryColor">
      </div>
      <div class="d-flex align-items-middle bg-light text-dark p-2 rounded gap-1">
        <label for="">Secondary Color</label>
        <input type="color" name="secondaryFillColor" id="secondaryFillColor" v-model="editable.secondaryColor">
      </div>
      {{ editable }}
    </div>
    <ChallengeBadge :challenge="challenge" :color="editable"/>
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
    const editable = ref({
      primaryColor: '#b3b2b2',
      secondaryColor: '#242424', 
    });
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
      titleBackground,
      editable
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