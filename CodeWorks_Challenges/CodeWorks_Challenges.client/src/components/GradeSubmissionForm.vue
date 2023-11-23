<template>
  <section v-if="participant" :key="participant?.id" class="container-fluid">
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
        <div v-for="(requirement, index) in editable.challenge.requirements" :key="index">
          <div class="form-check ps-5">
            <input type="checkbox" class="form-check-input" v-model="requirement.completed" :id="`field-${requirement.step}`">
            <label class="form-check-label" :for="`field-${requirement.step}`">{{ requirement.step }}</label>
          </div>
          <div class="col-12 d-flex align-items-center form-group mt-1 m-auto no-wrap mt-3">
            <label class=" pe-3" for="comment">Comment:</label>
            <input type="text" name="comment" id="comment" class="form-control mt-1" placeholder="Leave insight for this step..." rows="1" v-model="requirement.comment" />
          </div>
          <hr class="mb-4" style="color: white; opacity: .4;" />
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
        <div class="my-4">
          <div class="col-12 d-flex justify-content-between align-items-center mb-3">
            <div  v-for="s in editable.status" :key="s.value">
              <div class="d-flex flex-column radio-status-button">
                <input type="radio" :value="s.value" name="status" id="status" class="text-center fs-5">
                <label for="status">
                  <span class="text-center fs-6">{{ formatEnum(s) }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 form-group px-5 mb-5">
          <label for="status" class="form-label">Status</label>
          <select
            v-model="editable.status"
            type="text"
            name="status"
            id="status"
            placeholder="Status"
            class="form-control bg-light"
          >
            <option value="incomplete">Incomplete</option>
            <option value="submitted">Submitted</option>
            <option value="returned_for_review">Returned for Review</option>
            <option value="completed">Completed</option>
            <option value="graded">Graded</option>
            <option value="removed">Removed</option>
            <option value="left">Left</option>
          </select>
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
import { participantsService } from '../services/ParticipantsService'
import { challengesService } from '../services/ChallengesService'
import { ChallengeParticipant } from '../models/ChallengeParticipant'
import { useRoute } from "vue-router"
import Pop from "../utils/Pop"
import { SUBMISSION_TYPES } from "../constants/index.js"
import { formatEnum } from "../utils/FormatEnum.js"

export default {
  props: {
    participant: {
      type: ChallengeParticipant,
      required: true
    }
  },
  setup(props) {

    const route = useRoute()
    const filterBy = ref('')

    const editable = ref({
      submission: '',
      feedback: '',
      grade: 0,
      status: SUBMISSION_TYPES,
      challenge: {
        requirements: []
      }
    })
    // const submissionTypes = computed(() => {
    //   return SUBMISSION_TYPES
    // }) 

    // Initialize editable with the correct structure
    onMounted(() => {
      setActiveChallenge()
      getParticipantsByChallengeId()
      // LIFEHACK - If a participant has submitted a challenge, remove the reactive status options that only apply to participants engaged in a challenge. This logic is reusable if on a page / component that needs any enum values filtered out.
      editable.value.status = editable.value.status.filter(
          s => !["started", "submitted", "left"].includes(s)
        )
    })

    watchEffect(() => {
    })

    async function setActiveChallenge() {
      try {
        await challengesService.setActiveChallenge(route.params.challengeId)
        logger.log(route.params.challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function getParticipantsByChallengeId() {
      try {
        const challengeId = route.params.challengeId
        await participantsService.getParticipantsByChallengeId(challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    // const participant = computed(() => {
    //   return AppState.participants.find(p => p.challengeId === AppState.activeParticipant?.id)
    // })

    async function submitGrade() {
      try {
        const participantId = editable.value.id
        const newSubmission = { ...editable.value }
        await participantsService.updateChallengeParticipant(newSubmission, participantId)
        editable.value = {}
      } catch (error) {
        logger.error(error)
      }
    }

    const submissionTypes = computed(() => {
      const submissionTypes = ['']
      editable.value.status.forEach(p => {
        if (!submissionTypes.find(s =>
         s.value === p.status)) {
          submissionTypes.push({ value: p.status, text: p.status })
        }
      })
      return submissionTypes
    })
    
    return {
      editable,
      challenge: computed(() => AppState.activeChallenge),
      // participant,
      filterBy,
      submissionTypes,
      formatEnum,
      submitGrade,
    }
  }
}
</script>../utils/FormatJSON.js