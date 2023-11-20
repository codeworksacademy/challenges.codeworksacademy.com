<template>
  <section class="container-fluid">
    <div class="row justify-content-center align-items-center">
      <div class="col-12 text-center">
        <h1>Grade Challenge</h1>
      </div>
      <form @submit.prevent="submitGrade" id="gradeSubmissionForm" class="row">
        <div class="col-12 form-group px-5 mb-5">
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
        <div class="col-12 form-group px-5 mb-5">
          <label for="grade" class="form-label">Grade</label>
          <input
            v-model="editable.grade"
            type="number"
            name="grade"
            id="grade"
            placeholder="Grade"
            class="form-control bg-light"
          >
        </div>
        <div class="col-12 form-group px-5 mb-5">
          <label for="feedback" class="form-label">Feedback</label>
          <input
            v-model="editable.feedback"
            type="text"
            name="feedback"
            id="feedback"
            placeholder="Feedback"
            class="form-control bg-light"
          >
        </div>
        <div class="col-12 text-center my-3">
          <h4>Set status for this Participant</h4>
        </div>
        <div class="d-flex justify-content-around align-items-center">
          <div class="" v-for="s in editable.status" :key="s.value">
            <div class="col-6 col-md-12 d-flex flex-column radio-status-button mb-5">
              <input type="radio" :value="s.value" v-model="editable.status" name="status" id="status" class="text-center fs-5">
              <label class="" for="status">{{ s.text }}</label>
            </div>
          </div>
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-success">Submit</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import { computed, onMounted, ref, watchEffect } from 'vue'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { GRADE_FIELDS } from '../constants/index.js'
import { participantsService } from '../services/ParticipantsService'
import { useRoute } from "vue-router"
import Pop from "../utils/Pop"

export default {
  setup() {

    // const challenge: ComputedRef<{
    // id: any;
    // creatorId: any;
    // creator: any;
    // name: any;
    // category: any;
    // description: any;
    // requirements: any;
    // coverImg: any;
    // createdAt: string;
    // updatedAt: string;
    // supportLinks: any;
    // difficulty: number

    // <option value="incomplete">Incomplete</option>
    //         <option value="submitted">Submitted</option>
    //         <option value="returned_for_review">Returned for Review</option>
    //         <option value="completed">Completed</option>
    //         <option value="graded">Graded</option>
    //         <option value="removed">Removed</option>
    //         <option value="left">Left</option>

    const route = useRoute()

    const editable = ref({
      status: [
          {
            text: 'Incomplete',
            value: 'incomplete'
          },
          {
            text: 'Submitted',
            value: 'submitted'
          },
          {
            text: 'Returned for Review',
            value: 'returned_for_review'
          },
          {
            text: 'Completed',
            value: 'completed'
          },
          {
            text: 'Removed',
            value: 'removed'
          },
          {
            text: 'Left',
            value: 'left'
          }
        ],
    })

    // Initialize editable with the correct structure
    onMounted(() => {
      getParticipantsByChallengeId()
    })

    watchEffect(() => {
      
    })

    async function getParticipantsByChallengeId() {
      try {
        const challengeId = route.params.challengeId
        await participantsService.getParticipantsByChallengeId(challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    const challenge = computed(() => {
      return AppState.challenges.find(c => c.id === AppState.activeChallenge.id)
    })
    const participant = computed(() => {
      return AppState.participants.find(p => p.id === AppState.activeParticipant.id)
    })

    async function submitGrade() {
      try {
        const participantId = participant.value.id
        const newSubmission = {
          ...challenge.value,
          requirements: editable.value
        }
        await participantsService.updateChallengeParticipant(newSubmission, participantId)
      } catch (error) {
        logger.error(error)
      }
    }

    // const statusOptions = computed(() => {
    //   const statusOptions = []
    //   AppState.participants.forEach(p => {
    //     if (!statusOptions.find(s =>
    //      s.value === p.status)) {
    //       statusOptions.push({ name: 
    //                         p.status,
    //                        value: 
    //                         p.status })
    //     }
    //   })
    //   return statusOptions
    // })
    
    return {
      editable,
      challenge,
      participant,
      submitGrade,
    }
  }
}
</script>