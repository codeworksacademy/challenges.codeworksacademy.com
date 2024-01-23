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
          <label for="submission" class="form-label">Submit Answer</label>
          <input
            v-model="editable.submission"
            name="submission"
            id="submission"
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
      status: SUBMISSION_TYPES.STARTED,
    })

    const participant = computed(() => {
      return AppState.ChallengeState.participants.find(p => p.accountId === AppState.user.id)
    })

    async function submitChallenge(){
      try {
        // If it's an answer submission, we need the status to be submitted along with the answer for auto-grading
        if (challenge.value.autoGrade) {
          editable.value.status = 'completed',
          editable.value.submission = editable.value.submission.toLowerCase()
          // Else, it's a code submission URL. So we set the status to submitted, and their submission to their codebase URL provided
        } else {
          challenge.value.submission = editable.value.submission
          editable.value.status = 'submitted'
        }
        await challengesService.submitChallenge(challenge.value.id, participant.value.id, editable.value.submission)
        Modal.getOrCreateInstance('#challengeSubmissionForm').hide()
        Pop.toast(`Submitted: ${editable.value.submission} for ${challenge.value.name}`)
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