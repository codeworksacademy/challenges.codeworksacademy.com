<template>
  <section v-if="user.isAuthenticated" class="container-fluid position-relative pt-5">
    <form
      class="row bg-light p-3 rounded shadow"
      @submit.prevent="submitChallengeForGrading" id="createSubmissionForm"
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
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"
import { participantsService } from "../services/ParticipantsService.js"
import { useRouter, useRoute } from 'vue-router';
import { Modal } from 'bootstrap'

export default {
  setup() {

    const route = useRoute()
    const router = useRouter()

    // const participantId = ref(route.params.participantId)
    const editable = ref({
      accountId: AppState.account.id,
      challengeId: route.params.challengeId,
      submission: '',
      status: 'submitted'
    })

    const participant = computed(() => {
      return AppState.participants.find(p => p.id === route.params.participantId)
    })
    
    watchEffect(() => {
      if (participant.value) {
        editable.value = { ...participant.value }
      }
    })

    async function submitChallengeForGrading() {
  try {
    const newSubmission = { 
      accountId: AppState.account.id,
      challengeId: route.params.challengeId,
      submission: editable.value.submission, 
      status: editable.value.status,
    }
    logger.log('Your Participant ID:', participant)
    await participantsService.submitChallengeForGrading(newSubmission)
    editable.value = ''
    Modal.getOrCreateInstance('#createSubmissionForm').hide();
    Pop.toast('Submission Created');

    router.push({
      name: 'ChallengeSubmissionsPage',
      params: { challengeId: route.params.challengeId },
    });
  } catch (error) {
    logger.error(error);
    Pop.toast(error.message, 'error');
  }
}



    return {
      // participant: computed(() => AppState.participants.find(p => p.id === AppState.activeParticipant?.id)),
      user: computed(() => AppState.user),
      editable,
      submitChallengeForGrading,
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
      participantId: AppState.user.id,
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