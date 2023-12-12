<template>
  <section v-if="user.isAuthenticated" class="container-fluid position-relative pt-5">
    <form
      class="row bg-light p-3 rounded shadow"
      @submit.prevent="updateChallengeParticipant" id="challengeSubmissionForm"
    >
      <div class="col-12">
        <div class="mb-3">
          <label for="submission" class="form-label">Submission</label>
          <input
            v-model="editable.submission"
            type="url"
            name="submission"
            id="submission"
            placeholder="Source Code Link"
            class="form-control bg-light"
          >
        </div>
      </div>

      <div class="button-container col-12 d-flex justify-content-between">
      <button class="btn text-dark btn-outline-secondary text-light mdi mdi-plus-circle fw-700"> Submit Application</button>
      </div>
    </form>
  </section>
</template>

<script>
import Pop from '../utils/Pop.js'
import { Modal } from 'bootstrap'
import { computed, ref } from 'vue'
import { AppState } from '../AppState'
import { useRouter, } from 'vue-router'
import { logger } from '../utils/Logger.js'
import { SUBMISSION_TYPES } from '../constants'
import { participantsService } from '../services/ParticipantsService.js'

export default {
  setup() {

    const router = useRouter()
    
    const editable = ref({
      accountId: AppState.user.id,
      challengeId: AppState.activeChallenge?.id,
      submission: '',
      status: SUBMISSION_TYPES,
    })

    const participant = computed(() => {
      return AppState.participants.find(p => p.accountId === AppState.user.id)
    })

    async function updateChallengeParticipant() {
      try {
        if (await Pop.confirm(`Are you sure you are ready to submit ${AppState.activeChallenge?.name} to be graded? This cannot be undone!`)) {
          const participantId = participant.value.id
          const newParticipant = { 
            ...editable.value,
            status: SUBMISSION_TYPES.SUBMITTED
          }
          logger.log(`New Participation: ${newParticipant}`)
          await participantsService.updateChallengeParticipant(participantId, newParticipant)
          editable.value = {}
          Modal.getOrCreateInstance('#challengeSubmissionForm').hide();
          Pop.success('Challenge Submitted!');
          router.push({
            name: 'ChallengeSubmissionsPage',
            path: `/challenges/${AppState.activeChallenge?.id}/submissions`
          })
        }
      } catch (error) {
        logger.error(error);
        Pop.toast(error.message, 'error');
      }
    }

    async function removeSubmission() {
      try {
        const participantId = AppState.activeParticipant?.id
        const newSubmission = {
          ...participant.value,
          submission: editable.value.submission,
          status: SUBMISSION_TYPES.REMOVED
        }
        await participantsService.removeSubmission(newSubmission, participantId)
        participant.value = ''
        editable.value = ''
        Modal.getOrCreateInstance('#challengeSubmissionForm').hide();
        Pop.toast(`Removed Participation: ${newSubmission}`);
        router.push({
          name: 'GradeSubmissionsPage',
          path: `/moderators/${participantId}/grade`
        });
      } catch (error) {
        logger.error(error);
        Pop.toast(error.message, 'error');
      }
    }



    return {
      user: computed(() => AppState.user),
      participant,
      editable,
      updateChallengeParticipant,
      removeSubmission,
    } 
  }
}
</script>