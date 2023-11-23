<template>
  <section v-if="participant" :key="participant?.id" class="container-fluid">
    <div class="row justify-content-center align-items-center">
      <div class="col-12 d-flex flex-column justify-content-center align-items-center">
        <h1>Grade Challenge for {{ participant.profile.name }}</h1>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <p>Submission Source Code Link: </p>
        <a
          :href="participant.submission"
          target="_blank"
          placeholder="Source Code Link"
          class="text-decoration-none text-truncate mb-3 ms-2"
        >
          {{ participant.submission }}
        </a>
      </div>
      <form @submit.prevent="submitGrade" id="gradeSubmissionForm" class="row">
        <div v-if="participant?.challenge" class="col-12 d-flex justify-content-center align-items-center">
          <ol>
            <li v-for="(requirement, index) in challenge.requirements" :key="index">
              <div class="form-check ps-5">
                <input type="checkbox" class="form-check-input" v-model="requirement.completed" :id="`field-${requirement.step}`">
                <label class="form-check-label" :for="`field-${requirement.step}`">{{ requirement.step }}</label>
              </div>
              <div class="col-12 d-flex align-items-center form-group mt-1 m-auto no-wrap mt-3">
                <label class=" pe-3" for="comment">Comment:</label>
                <input type="text" name="comment" id="comment" class="form-control mt-1" placeholder="Leave insight for this step..." rows="1" v-model="requirement.comment" />
              </div>
              <hr class="mb-4" style="color: white; opacity: .4;" />
            </li>
          </ol>
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
          <h4>Set status for {{ participant.profile.name }}</h4>
        </div>
        <div class="my-4">
          <div class="col-12 d-flex justify-content-between align-items-center mb-3">
            <div  v-for="(option, index) in editable.status" :key="index">
              <div class="d-flex flex-column radio-status-button">
                <input @change="testStatusChange()" type="radio" v-model="editable.status"
                :value="option" :name="`option-${index}`" :id="`option-${index}`" class="text-center fs-5">
                <label :for="`option-${index}`">
                  <small v-if="!option.SUBMITTED" class="text-center text-capitalize fs-6">{{ formatEnum(option) }}</small>
                </label>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="col-12 d-flex flex-column justify-content-center align-items-center form-group px-5 mb-5">
          <label for="status" class="form-label">Status</label>
          <select
            v-model="editable.status"
            type="text"
            name="status"
            id="status"
            placeholder="Status"
            class="form-control bg-light"
          >
            <option class="text-capitalize" v-for="s in editable.status" :key="s.value" :value="s.value">{{ formatEnum(s) }}</option>
          </select>
        </div> -->
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
import { STATUS_TYPES, SUBMISSION_TYPES } from "../constants/index.js"
import { formatEnum } from "../utils/FormatEnum.js"
import { newChallengeParticipant } from "../utils/NewChallengeParticipant.js"

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
      challengeId: '',
      accountId: '',
      submission: '',
      feedback: '',
      // grade: 0,
      status: SUBMISSION_TYPES,
      challenge: {
        requirements: [],
      }
    })
    const challengeToGrade = ref({})

    // Initialize editable with the correct structure
    onMounted(() => {
      setActiveChallenge()
      getParticipantsByChallengeId()
      // sanitizeEnum(editable.value.status)
    })
    
    watchEffect(() => {
      
    })

    async function testStatusChange() {
      logger.log('editable status', editable.value.status)
    }
    
    // function sanitizeEnum(value) {
    //   value.filter(s => !["started", "submitted", "left"].includes(s))
    // }

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
    //   return )
    // })

    async function submitGrade() {
      try {
        const participantId = props.participant?.id
        const newSubmission = {
          challengeId: AppState.activeChallenge.id,
          accountId: AppState.account.id,
          submission: editable.value.submission,
          feedback: editable.value.feedback,
          // grade: editable.value.grade,
          status: editable.value.status,
          challenge: {
            requirements: editable.value.challenge.requirements,
          }
        }
        await participantsService.updateChallengeParticipant(newSubmission, participantId)
        editable.value = {}
      } catch (error) {
        logger.error(error)
      }
    }

    // const submissionTypes = computed(() => {
    //   const submissionTypes = ['']
    //   editable.value.status.forEach(p => {
    //     if (!submissionTypes.find(s =>
    //      s.value === p.status)) {
    //       submissionTypes.push({ value: p.status, text: p.status })
    //     }
    //   })
    //   return submissionTypes
    // })
    
    return {
      editable,
      challenge: computed(() => AppState.activeChallenge),
      // participant,
      filterBy,
      // submissionTypes,
      formatEnum,
      submitGrade,
      testStatusChange,
    }
  }
}
</script>

<style scoped lang="scss">
ol {
  list-style: none;
  counter-reset: my-counter;
}
ol li {
  position: relative;
  margin-bottom: 10px;
  left: 0px;
}
ol li::before {
  content: 'Check ' counter(my-counter) ':';
  counter-increment: my-counter;
  position: absolute;
  left: -50px;
  top: -1.5px;
}
</style>