<template>
  <section v-if="user.isAuthenticated" class="container-fluid position-relative pt-5">
    <form
      v-if="editable"
      :key="editable?.id"
      class="row bg-light p-3 rounded shadow"
      @submit.prevent="createChallengeSubmission" id="createSubmissionForm"
    >
      <div class="row">
        <div class="col-12">
          <label for="submission" class="form-label">Submission</label>
          <textarea v-model="editable.submission" name="submission" id="submission" cols="30" rows="10" class="form-control"></textarea>
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
import { Participant } from "../models/Participant.js"
import { participantsService } from "../services/ParticipantsService.js"
import { useRouter, useRoute } from 'vue-router';
import { Modal } from 'bootstrap'

export default {
  props: {
    participant: {
      type: Participant || Object,
      required: true
    }
  },
  setup() {

    const route = useRoute()
    const router = useRouter()

    const editable = ref({
      participantId: route.params.participantId,
      submission: '',
      status: 'submitted'
    })

    watchEffect(() => {
      editable.value.participantId = AppState.participants.find(p => p.id === editable.value.participantId)
    })

    async function createChallengeSubmission() {
      try {
        logger.log('Participant ID:', editable.value.participantId);
        logger.log('New Participant:', editable.value);

        const participantId = editable.value.participantId
        const newParticipant = { 
          ...editable.value
        }
        await participantsService.submitChallengeForGrading(participantId, newParticipant)
        Modal.getOrCreateInstance('#createSubmissionForm').hide()
        Pop.toast('Submission Created')
        router.push({
          name: 'ChallengeSubmissionsPage',
          params: { challengeId: route.params.challengeId }
        })
      } catch (error) {
        logger.error(error)
        Pop.toast(error.message, 'error')
      }
    }
    return {
      user: computed(() => AppState.user),
      editable,
      createChallengeSubmission,
      challengeId: computed(() => AppState.challengeId)
    } 
  }
}
</script>




















<!-- <template>
  <section v-if="user.isAuthenticated">
    <div class="row">
      <div class="col-12">
        <form @submit.prevent="submitChallengeForGrading()">
          <div class="mb-3">
            <label for="submission" class="form-label">Submission</label>
            <input v-model="editable.submission" type="url" name="submission" id="submission" placeholder="Source Code Link" class="form-control bg-light">
          </div>
          <button class="btn btn-success" type="submit" title="Submit Challenge">
            Submit
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import { computed, onMounted, ref, watchEffect } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { Participant } from "../models/Participant.js"
import { participantsService } from '../services/ParticipantsService'
import { useRouter, useRoute } from 'vue-router';
import { Modal } from 'bootstrap'

export default {
  props: {
    participant: {
      type: Participant || Object,
      required: true
    }
  },
  setup() {

    const route = useRoute()
    const router = useRouter()

    const editable = ref({
      participantId: route.params.participantId,
      submission: '',
      status: 'submitted'
    })

    watchEffect(() => {
      
    })

    async function submitChallengeForGrading() {
      try {
        const newParticipant = { 
          participantId: route.params.participantId,
          submission: editable.value.submission, 
          status: editable.value.status, 
        }
        logger.log('Your Participant ID:', newParticipant.participantId)
        await participantsService.updateParticipant(newParticipant)
        editable.value = ''
        Modal.getOrCreateInstance('#createSubmissionForm').hide()
        Pop.success('Challenge Submitted!')
      } catch (error) {
        logger.error(error)
      }
    }
    return {
      user: computed(() => AppState.user),
      editable,
      submitChallengeForGrading,
    } 
  }
}
</script> -->