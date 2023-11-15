<template>
  <section v-if="user.isAuthenticated" class="container-fluid position-relative pt-5">
    <form
      class="row bg-light p-3 rounded shadow"
      @submit.prevent="submitChallengeForGrading" id="createSubmissionForm"
    >
      <div class="col-12">
        <div class="mb-3">
          <label for="submission" class="form-label">Submission</label>
          <input v-model="editableSubmission.submission" type="url" name="submission" id="submission" placeholder="Source Code Link" class="form-control bg-light">
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

    const editableSubmission = ref([])
    const editableIndex = ref(false)

    const editableParticipant = computed(() => {
      return AppState.participants.find(p => p.id === AppState.activeParticipant?.id)
    })

    watchEffect(() => {
      
    })

    async function submitChallengeForGrading() {
      try {
      
        const newSubmission = { 
          accountId: AppState.user.id,
          challengeId: route.params.challengeId,
          submission: editableSubmission.value.submission,
          status: 'submitted'
         }        
        logger.log('Your Participant ID:', editableParticipant)
        await participantsService.submitChallengeForGrading(newSubmission)
        editableParticipant.value = ''
        Modal.getOrCreateInstance('#createSubmissionForm').hide();
        Pop.toast('Submission Added');

        router.push({
          name: 'ChallengeSubmissionsPage',
          params: { challengeId: route.params.challengeId },
        });
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
        logger.log('Your Participant ID:', editableParticipant)
        await participantsService.removeSubmission(newSubmission, participantId)
        editableParticipant.value = ''
        Modal.getOrCreateInstance('#createSubmissionForm').hide();
        Pop.toast('Submission Removed');

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
      user: computed(() => AppState.user),
      editableParticipant,
      editableSubmission,
      editableIndex,
      submitChallengeForGrading,
      removeSubmission,

      editParticipant(index) {
        editableIndex.value = index
        editableParticipant.value = { ...AppState.activeParticipant[index] }
      }
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