<template>
  <section v-if="user.isAuthenticated" class="container-fluid position-relative pt-5">
    <form
      class="row bg-light p-3 rounded shadow"
      @submit.prevent="updateChallengeParticipant" id="createSubmissionForm"
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
    
    const editable = ref({
      accountId: AppState.account.id,
      challengeId: AppState.activeChallenge?.id,
      submission: '',
      status: 'submitted',
    })

    const participant = computed(() => {
      return AppState.participants.find(p => p.accountId === AppState.account.id)
    })


    watchEffect(() => {
      
    })
    

    async function updateChallengeParticipant() {
      try {
        if (await Pop.confirm(`Are you sure you are ready to submit ${AppState.activeChallenge?.name} to be graded? This cannot be undone!`)) {
          const participantId = participant.value.id
          const newParticipant = { 
            ...editable.value
          }
          logger.log('Your Participation:', editable.value)
          await participantsService.updateChallengeParticipant(participantId, newParticipant)
          editable.value = {}
          Modal.getOrCreateInstance('#createSubmissionForm').hide();
          Pop.success('Challenge Submitted!');
          router.push({
            name: 'Home',
            path: '/'
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
          status: editable.value.status
        }
        logger.log('Your Participant ID:', participant)
        await participantsService.removeSubmission(newSubmission, participantId)
        participant.value = ''
        editable.value = ''
        Modal.getOrCreateInstance('#createSubmissionForm').hide();
        Pop.toast('Submission Removed');

        router.push({
          name: 'GradeSubmissionPage',
          params: { challengeId: route.params.challengeId },
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




















<!-- <template>
  <section v-if="user.isAuthenticated">
    <div class="row">
      <div class="col-12">
        <form @submit.prevent="updateChallengeParticipant()">
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

    async function updateChallengeParticipant() {
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
      updateChallengeParticipant,
    } 
  }
}
</script> -->