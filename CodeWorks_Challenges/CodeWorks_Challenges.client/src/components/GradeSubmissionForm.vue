<template>
  <section class="container-fluid">
    <div class="col-12 d-flex flex-column justify-content-center align-items-center">
      <h1>Grade Challenge</h1>
      <form @submit.prevent="submitGrade" id="gradeSubmissionForm">
        <div class="col-12 form-group px-5 mb-5">
          <label for="grade">Grade</label>
          <input type="number" name="grade" id="grade" class="form-control input-box" v-model="grade" />
        </div>
        <div v-for="field in challengeFieldsToGrade" :key="field.requirement" class="d-flex flex-column px-5 py-1">
          <div class="col-12 form-group mt-3">
            <!-- <label for="requirements">Requirement</label> -->
            <div class="form-check">
              <input type="checkbox" class="form-check-input" v-model="field.requirement.completed" :id="`field-${field.requirement.step}`">
              <label class="form-check-label" :for="`field-${field.requirement.step}`">{{ field.requirement.step }}</label>
            </div>
          </div>
          <div class="col-12 form-group mt-1">
            <label for="comment">Comment</label>
            <textarea type="text" name="comment" id="comment" class="form-control input-box mt-1" placeholder="Leave some insight..." rows="1" v-model="field.requirement.comment" />
          </div>
        </div>
        <div class="form-check" v-for="field in challengeFieldsToGrade" :key="field.requirement.comment">
        </div>
        <!-- <div class="form-group">
          <label for="feedback">Feedback</label>
          <textarea type="text" name="feedback" id="feedback" class="form-control" v-model="feedback" />
        </div>
        <div class="form-group">
          <div class="col-1">
            <label for="completed">Completed</label>
            <input type="checkbox" name="completed" id="completed" class="form-control w-25" v-model="completed" />
          </div>
        </div> -->
        <div class="col-12 d-flex justify-content-center align-items-center">
          <select 
            v-model="filterBy"
            name="status"
            id="status" 
            class="col-3 text-center fs-5"
          >
            <option 
              v-for="s in participant.status" 
              :value="s.value" 
              :key="s.value" 
              class=""
            >
              {{ s }}
            </option>
          </select>
        </div>
        <button type="submit" class="btn btn-success">Submit</button>
      </form>
    </div>
  </section>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { GRADE_FIELDS } from '../constants/index.js'
import { participantsService } from '../services/ParticipantsService'
import { useRoute } from "vue-router"
import Pop from "../utils/Pop"

export default {
  setup() {

    const route = useRoute()
    
    const grade = ref(0)
    const feedback = ref("")
    const completed = ref(false)
    const challengeFieldsToGrade = ref([])

    // Initialize challengeFieldsToGrade with the correct structure
    onMounted(() => {
      getParticipantsByChallengeId()
      const challenge = challenge.value
      challengeFieldsToGrade.value = challenge.map(field => ({
        requirements: field.challenge.requirements,
        completed: false
      }))
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
          requirements: challengeFieldsToGrade.value
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
      grade,
      feedback,
      completed,
      challengeFieldsToGrade,
      challenge,
      participant,
      submitGrade,
    }
  }
}
</script>