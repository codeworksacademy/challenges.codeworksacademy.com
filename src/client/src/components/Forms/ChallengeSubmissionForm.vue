<template>
  <section v-if="user.isAuthenticated && !challenge?.autoGrade" class="container-fluid position-relative pt-5">
    <form
      class="row bg-light p-3 rounded shadow"
      @submit.prevent="submitChallenge" id="challengeSubmissionForm"
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
  <section v-if="user.isAuthenticated && challenge?.autoGrade" class="container-fluid position-relative pt-5">
    <form
      class="row bg-light p-3 rounded shadow"
      @submit.prevent="submitChallenge" id="challengeSubmissionForm"
    >
      <div class="col-12">
        <div class="mb-3">
          <label for="answer" class="form-label">Submit Answer</label>
          <input
            v-model="editable.submission"
            name="answer"
            id="answer"
            placeholder="Answer"
            class="form-control bg-light"
          >
        </div>
      </div>
      <div class="button-container col-12 d-flex justify-content-between">
      <button class="btn text-dark btn-outline-secondary text-light mdi mdi-plus-circle fw-700"> Submit Answer</button>
      </div>
    </form>
  </section>
</template>

<script>
import Pop from '../../utils/Pop'
import { Modal } from 'bootstrap'
import { computed, ref } from 'vue'
import { AppState } from '../../AppState'
import { useRouter, } from 'vue-router'
import { logger } from '../../utils/Logger'
import { SUBMISSION_TYPES } from '../../constants'
import { participantsService } from '../../services/ParticipantsService'
import { challengesService } from "../../services/ChallengesService.js"

export default {
  setup() {

    const router = useRouter()
    const challenge = computed(() => AppState.ChallengeState.challenge)
    
    const editable = ref({
      accountId: AppState.user.id,
      challengeId: AppState.ChallengeState.challenge?.id,
      submission: '',
      status: SUBMISSION_TYPES.SUBMITTED,
      challenge: {
        answer: ''
      }
    })

    const participant = computed(() => {
      return AppState.ChallengeState.participants.find(p => p.accountId === AppState.user.id)
    })

    async function submitChallenge(){
      try {
        await challengesService.submitChallenge(challenge.value.id, participant.value.id, editable.value.submission)
        Modal.getOrCreateInstance('#challengeSubmissionForm').hide()
        editable.value.submission = ''
      } catch (error) {
        logger.log(error)
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
          name: 'Challenge.gradeSubmissionsPage',
          path: `/challenges/${newSubmission.challengeId}/grade`
        });
      } catch (error) {
        logger.error(error);
        Pop.toast(error.message, 'error');
      }
    }

    return {
      user: computed(() => AppState.user),
      challenge,
      participant,
      editable,
      submitChallenge,
      removeSubmission,
    } 
  }
}
</script>