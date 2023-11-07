<template>
  <section v-if="user.isAuthenticated" class="container-fluid position-relative bg-secondary pt-5">
    <form @submit.prevent="createChallengeSubmission" id="createSubmissionForm">
      <div class="form-group">
        <div v-for="(link, i) in editable.supportLinks" :key="i">
          <div class="input-box">
            <input
              :id="'supportLinkName' + i"
              :name="'supportLinkName' + i"
              type="text"
              required
              v-model="link.name"
            >
            <label :for="'supportLinkName' + i">Challenge Link Name</label>
          </div>
          <div class="input-box">
            <input
              :id="'supportLinkURL' + i"
              :name="'supportLinkURL' + i"
              type="url"
              required
              v-model="link.url"
            >
            <label :for="'supportLinkURL' + i">Challenge Link URL</label>
          </div>
        </div> 
      </div>
      <button type="submit" class="btn btn-primary">Submit Application</button>

    </form>
  </section>
</template>

<script>
import { computed, onMounted, ref, watchEffect } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { Submission } from "../models/Submission.js"
import { submissionsService } from "../services/SubmissionsService.js"
import { useRouter, useRoute } from 'vue-router';
import { Modal } from 'bootstrap'

export default {
  props: {
    submission: {
      type: Submission || Object,
      required: true
    }
  },
  setup() {

    const route = useRoute()

    const editable = ref({
      challengeId: route.params.challengeId,
      participantId: AppState.user.id,
      supportLinks: [
        {
          name: '',
          url: ''
        }
      ],
      isSubmitted: false,
    })

    watchEffect(() => {
      editable.value.challenge = AppState.challenges.find(c => c.id === editable.value.challengeId)
    })

    async function createChallengeSubmission() {
      try {
        editable.value.isSubmitted = true
        const newSubmission = { ...editable.value }
        await submissionsService.createSubmission(newSubmission)
        Modal.getOrCreateInstance('#createSubmissionForm').hide()
        AppState.activeSubmission = newSubmission
        logger.log('New submission created:', newSubmission)
      } catch (error) {
        logger.error(error)
        Pop.toast(error.message, 'error')
      }
    }
    return {
      user: computed(() => AppState.user),
      editable,
      createChallengeSubmission
    } 
  }
}
</script>