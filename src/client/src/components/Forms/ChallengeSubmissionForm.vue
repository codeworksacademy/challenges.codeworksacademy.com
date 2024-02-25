<template>
  <section class="container-fluid position-relative pt-5">
    <form class="row p-3 rounded border border-primary shadow" @submit.prevent="submitChallenge"
      id="challengeSubmissionForm">
      <div class="col-12" v-if="user.isAuthenticated">
        <div class="mb-3" v-if="!challenge?.autoGrade">
          <label for="submission" class="form-label">Submission</label>
          <input v-model="editable.submission" type="url" name="submission" id="submission" class="form-control"
            placeholder="Source Code Link">
        </div>
        <div class="mb-3" v-if="challenge?.autoGrade">
          <label for="answer" class="form-label">Submit Answer</label>
          <input v-model="editable.submission" type="text" name="answer" id="answer" class="form-control"
            placeholder="Answer">
        </div>
      </div>
      <div class="button-container col-12 d-flex justify-content-between">
        <button class="btn btn-outline-secondary mdi mdi-plus-circle fw-700" v-if="user.isAuthenticated">
          {{ (challenge?.autoGrade) ? 'Submit Answer' : 'Submit Application' }}</button>
      </div>
    </form>
  </section>
</template>

<script>
import Pop from '../../utils/Pop.js'
import { Modal } from 'bootstrap'
import { computed, ref } from 'vue'
import { useRouter, } from 'vue-router'
import { AppState } from '../../AppState.js'
import { participantsService } from '../../services/ParticipantsService.js'
import { challengesService } from "../../services/ChallengesService.js"
import { SUBMISSION_TYPES } from '../../constants'

export default {
  setup() {

    const router = useRouter();
    const challenge = computed(() => AppState.ChallengeState.challenge);

    const editable = ref({});

    const participant = computed(() => {
      return AppState.ChallengeState.participants.find(p => p.accountId === AppState.user.id);
    })

    async function submitChallenge() {
      try {
        const submission = {
          ...editable.value,
          id: participant.value.id,
          challengeId: challenge.value.id,
          status: SUBMISSION_TYPES.SUBMITTED
        }
        const result = await challengesService.submitChallenge(submission);
        Modal.getOrCreateInstance('#challengeSubmissionForm').hide();
        if (result == 'completed') {
          Pop.toast('Challenge completed!', 'success', 'top', 3000, true);
        } else if (result == 'returned for review') {
          Pop.toast('Answer was incorrect.', 'error', 'top', 3000, true);
        }
        editable.value.submission = '';
      }
      catch (error) { Pop.error(error); }
    }

    // async function removeSubmission() {
    //   try {
    //     const participantId = AppState.activeParticipant?.id
    //     const newSubmission = {
    //       ...participant.value,
    //       submission: editable.value.submission,
    //       status: SUBMISSION_TYPES.REMOVED
    //     }
    //     await participantsService.removeSubmission(newSubmission, participantId)
    //     participant.value = ''
    //     editable.value = ''
    //     Modal.getOrCreateInstance('#challengeSubmissionForm').hide();
    //     Pop.toast(`Removed Participation: ${newSubmission}`);
    //     router.push({
    //       name: 'Challenge.gradeSubmissionsPage',
    //       path: `/challenges/${newSubmission.challengeId}/grade`
    //     });
    //   } catch (error) {
    //     Pop.error('Unable to remove submission', error);
    //   }
    // }

    return {
      user: computed(() => AppState.user),
      challenge,
      participant,
      editable,
      submitChallenge,
      // removeSubmission,
    }
  }
}
</script>