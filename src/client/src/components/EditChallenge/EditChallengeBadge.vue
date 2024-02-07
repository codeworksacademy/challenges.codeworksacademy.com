<template>
  <div class="container-fluid">
    <div class="input-group mb-3">
      <input type="text" class="form-control" id="badgeTitle" name="badgeTitle" placeholder="Provide Title for Badge" v-model="editable.badge.title">
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
      <input v-if="imageUploadOption === 'url'" type="text" class="form-control" id="badgeImg" name="badgeImg" placeholder="Upload a Transparent Image" v-model="editable.badge.image">
      <input  v-if="imageUploadOption === 'file'" type="file" class="form-control" id="badgeImg" name="badgeImg" placeholder="Upload a Transparent Image" @change="handleFileUpload">
      <label class="input-group-text btn-success btn" for="badgeImg">Upload Badge Image</label>
    </div>
    <!-- END - [Image Upload Options] -->

  <div class="d-flex align-items-middle bg-light text-dark p-2 rounded mb-3 gap-1">
    <label for="">Primary Color</label>
    <input type="color" name="primaryColor" id="primaryColor" v-model="editable.badge.primaryColor">
  </div>
  <div class="d-flex align-items-middle bg-light text-dark p-2 rounded gap-1">
    <label for="">Secondary Color</label>
    <input type="color" name="secondaryColor" id="secondaryColor" v-model="editable.badge.secondaryColor">
  </div>
  <ChallengeBadge :challenge="editable" :badge="editable.badge" />
  </div>
</template>

<script>
import { AppState } from '../../AppState.js'
import { Challenge } from '../../models/Challenge.js'
import ChallengeBadge from '../ChallengePage/ChallengeBadge.vue'
import { ref, computed } from 'vue'
import { COLOR_FILLS, TITLE_BGS } from '../../constants'

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
  setup(props) {
    const editable = ref({
      ...props.challenge
    });
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
    const titleBackground = Object.values(TITLE_BGS)
    
    //Select the SVG color fill for the body of the badge
    const selectedFill = ref('')
    const colorFill = Object.values(COLOR_FILLS)
    //To set 
    return {
      challenge: computed(() => AppState.ChallengeState.challenge),
      editable,
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