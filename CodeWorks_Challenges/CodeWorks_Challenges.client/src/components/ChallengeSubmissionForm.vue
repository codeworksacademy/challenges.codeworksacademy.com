<template>
  <section v-if="user.isAuthenticated" class="container-fluid position-relative pt-5">
    <form
      class="row bg-light p-3 rounded shadow"
      @submit.prevent="submitChallengeForGrading" id="createSubmissionForm"
    >
      <div class="col-12">
        <div class="mb-3">
          <label for="submission" class="form-label">Submission</label>
          <input
            v-model="editableSubmission.submission"
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
    
    const editableSubmission = ref({
      accountId: AppState.account.id,
      challengeId: route.params.challengeId,
      submission: '',
      status: 'submitted'
    })

    const participantToUpdate = computed(() => {
      return AppState.participants.find(p => p.accountId === AppState.account.id)
    })


    watchEffect(() => {
    })
    

    async function submitChallengeForGrading() {
      try {
        if (await Pop.confirm(`This will submit your challenge to be graded. This cannot be undone! If you completed this challenge successfully, the appropriate rewards will be distributed to your account once the challenge has been graded. Are you sure you want to submit?`)) {
          const participantId = participantToUpdate.value.id
          const newParticipant = { 
            ...participantToUpdate.value,
            submission: editableSubmission.value.submission,
            status: editableSubmission.value.status
          }
          logger.log('Your Participation:', editableSubmission.value)
          await participantsService.submitChallengeForGrading(newParticipant, participantId)
          editableSubmission.value = ''
          Modal.getOrCreateInstance('#createSubmissionForm').hide();
          Pop.toast('Challenge Submitted!');
          router.push({
            name: 'Account',
            path: '/account'
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
          submission: editableSubmission.value.submission,
          status: editableSubmission.value.status
        }
        logger.log('Your Participant ID:', participantToUpdate)
        await participantsService.removeSubmission(newSubmission, participantId)
        participantToUpdate.value = ''
        Modal.getOrCreateInstance('#createSubmissionForm').hide();
        Pop.toast('Submission Removed');

        router.push({
          name: 'GradeSubmissionsPage',
          params: { challengeId: route.params.challengeId },
        });
      } catch (error) {
        logger.error(error);
        Pop.toast(error.message, 'error');
      }
    }



    return {
      user: computed(() => AppState.user),
      participantToUpdate,
      editableSubmission,
      submitChallengeForGrading,
      removeSubmission,
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
      accountId: AppState.user.id,
      submission: '',
      status: 'submitted'
    })

    watchEffect(() => {
      
    })

    async function submitChallengeForGrading() {
      try {
        const newParticipant = { 
          accountId: route.params.accountId,
          submission: editable.value.submission, 
          status: editable.value.status, 
        }
        logger.log('Your Participant ID:', newParticipant.accountId)
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