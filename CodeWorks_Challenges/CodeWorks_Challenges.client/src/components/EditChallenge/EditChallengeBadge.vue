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
    return {
      imageUploadOption,

      handleUrlChange,
      handleFileUpload,
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