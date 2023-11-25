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
        <div class="d-flex justify-content-center align-items-center my-3">
          <div class="">
            <!-- <div  v-for="(option, index) in editable.status" :key="index">
              <div class="d-flex flex-column radio-status-button">
                <input @change="testStatusChange()" type="radio" v-model="editable.status"
                :value="option" :name="`option-${index}`" :id="`option-${index}`" class="text-center fs-5">
                <label :for="`option-${index}`">
                  <small class="text-center text-capitalize fs-6">{{ formatEnum(option) }}</small>
                </label>
              </div>
            </div> -->
            <!-- FIXME - Fix the above statement -->
            <div class="" v-for="(option, index) in submissionTypes" :key="index">
              <div class="d-flex align-items-center radio-status-button">
                <input @change="testStatusChange()" type="radio" v-model="editable.status"
                :value="option.value" :name="`option-${index}`" :id="`option-${index}`" class="mt-1 me-3">
                <label :for="`option-${index}`">
                  <small class="text-capitalize fs-6">{{ formatEnum(option.text) }}</small>
                </label>
              </div>
            <!-- <div class="col-12 form-group px-5 mb-5">
              <label for="status" class="form-label">Status</label>
              <select
                @change="testStatusChange()"
                v-model="editable.status"
                type="text"
                name="status"
                id="status"
                placeholder="Status"
                class="form-control bg-light"
              >
              <option :value="null">Select a status</option>
              <option v-for="s in submissionTypes" :key="s.value" :value="s.value">{{ formatEnum(s.text) }}</option>
              </select>
            </div> -->
          </div>
        </div>
            <!-- <div class="col-12 form-group px-5 mb-5">
              <label for="status" class="form-label">Status</label>
              <select
                @change="testStatusChange()"
                v-model="editable.status"
                type="text"
                name="status"
                id="status"
                placeholder="Status"
                class="form-control bg-light"
              >
              <option :value="null">Select a status</option>
              <option v-for="s in submissionTypes" :key="s.value" :value="s.value">{{ formatEnum(s.text) }}</option>
              </select>
            </div> -->
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

    //NOTE - Participant of a Challenge Reference from backend for refactoring the editable object:
//     challengeId: {
//     type: ObjectId,
//     required: true,
//     ref: 'Challenge'
//   },
//   accountId: {
//     type: ObjectId,
//     required: true,
//     ref: 'Account'
//   },
//   submission: { type: String, maxLength: 700, default: '' },
//   status: { type: String, enum: SUBMISSION_TYPES, required: true, default: 'incomplete', lowercase: true },
  
//   claimedAt: { type: Date }

// },
//   { timestamps: true, toJSON: { virtuals: true } }
// )

// ChallengeParticipantSchema.virtual('profile', {
//   localField: 'accountId',
//   foreignField: '_id',
//   ref: 'Account',
//   justOne: true
// })

// ChallengeParticipantSchema.virtual('challenge', {
//   localField: 'challengeId',
//   foreignField: '_id',
//   ref: 'Challenge',
//   justOne: true
// })

// ChallengeParticipantSchema.virtual('requirements', {
//   localField: 'challengeId',
//   foreignField: '_id',
//   ref: 'Challenge',
//   justOne: false,
// })
    const editable = ref({
      id: props.participant.id,
      profile: props.participant.profile,
      challengeId: props.participant.challengeId,
      accountId: props.participant.accountId,
      submission: props.participant.submission,
      feedback: props.participant.feedback,
      status: SUBMISSION_TYPES,
      challenge: props.participant.challenge,
      requirements: props.participant.challenge.requirements,
    })

    // Initialize editable with the correct structure
    onMounted(() => {
      setActiveChallenge()
      getParticipantsByChallengeId()
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
    
    
    async function testStatusChange() {
      logger.log('Participant Status: ', editable.value.status)
    }

    watchEffect(() => {
    })

    async function submitGrade() {
      try {
        const participantId = props.participant.id
        const newSubmission = {
          ...editable.value
        }
        await participantsService.updateChallengeParticipant(newSubmission, participantId)
        editable.value = {}
      } catch (error) {
        logger.error(error)
      }
    }

    const submissionTypes = computed(() => {
      const types = []
      //NOTE - Change back to SUBMISSION_TYPES.map if selecting submission types throws an error again
      SUBMISSION_TYPES.forEach(s => {
        if (!types.find(t => t.value === s)) {
          types.push({ value: s, text: s })
        }
        let sanitize = ['started', 'submitted', 'left']
        if (sanitize.includes(s)) {
          types.splice(types.findIndex(t => t.value === s), 1)
        }
      })
      return types
    })

    return {
      editable,
      challenge: computed(() => AppState.activeChallenge),
      filterBy,
      submissionTypes,
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