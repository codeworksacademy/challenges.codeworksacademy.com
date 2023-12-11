<template>
  <section v-if="participant" :key="participant?.id" class="container-fluid">
    <div class="row justify-content-center align-items-center">
      <div class="col-12 d-flex flex-column justify-content-center align-items-center">
        <h1 class="text-center">Grade Challenge for {{ participant.profile.name }}</h1>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <p>Submission Source Code Link: </p>
        <a :href="participant.submission" target="_blank" placeholder="Source Code Link"
          class="text-decoration-none text-truncate mb-3 ms-2">
          {{ participant.submission }}
        </a>
      </div>
      <form @submit.prevent="gradeChallenge" class="row">
        <div v-if="participant?.challenge" class="col-12 d-flex justify-content-center align-items-center">
          <ol>
            <div class="d-flex justify-content-end align-items-center">
              <span class="text-uppercase fw-bold p-3">Completed Steps: {{ gradeCount }} / {{
                participant.requirements.length }}</span>
            </div>
            <li v-for="(requirement, index) in participant.requirements" :key="index">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" :id="`field-${requirement.description}`"
                  v-model="requirement.isComplete" :value="requirement.isComplete" @change="addGradePoint(index)">
                <label class="form-check-label" :for="`field-${requirement.description}`">{{ requirement.description
                }}</label>
              </div>
              <hr class="mb-4" style="color: white; opacity: .4;" />
            </li>
          </ol>
        </div>
        <div class="col-12 form-group px-5 mb-5">
          <label for="feedback" class="form-label">Feedback</label>
          <input v-model="editable.feedback" type="text" name="feedback" id="feedback" placeholder="Feedback"
            class="form-control bg-light">
        </div>
        <div class="col-12 text-center my-3">
          <h4>Set status for {{ participant.profile.name }}</h4>
        </div>
        <div class="d-flex justify-content-center align-items-center my-3">
          <div class="">
            <div class="col-12 d-flex justify-content-center align-items-center form-group px-5 mb-5">
              <label for="status" class="form-label">Status</label>
              <select v-model="editable.status" name="status" id="status" placeholder="Status"
                class="form-control bg-light p-2">
                <option :value="null">Select a status</option>
                <option :value="'completed'">Mark as Completed</option>
                <option :value="'returned_for_review'">Return for Review</option>
                <option :value="'removed'">Flag for Removal</option>
              </select>
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
import { participantsService } from '../services/ParticipantsService'
import { challengesService } from '../services/ChallengesService'
import { ChallengeParticipant } from '../models/ChallengeParticipant'
import { useRoute } from "vue-router"
import Pop from "../utils/Pop"
import { SUBMISSION_TYPES } from "../constants/index.js"
import { formatEnum } from "../utils/FormatEnum.js"
import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js"

export default {
  props: {
    participant: {
      type: ChallengeParticipant,
      required: true
    }
  },
  setup(props) {

    const route = useRoute()

    const editable = ref({
      participantId: props.participant.id,
      challenge: props.participant.challenge,
      profile: props.participant.profile,
      requirements: props.participant.requirements,
      status: Object.values(SUBMISSION_TYPES),
    })

    onMounted(() => {
      setActiveChallenge()
      getModeratorsByChallengeId()
      getParticipantsByChallengeId()
    })

    async function setActiveChallenge() {
      try {
        await challengesService.setActiveChallenge(route.params.challengeId)
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

    async function getModeratorsByChallengeId() {
      try {
        const challengeId = route.params.challengeId
        await challengeModeratorsService.getModeratorsByChallengeId(challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    watchEffect(() => {

      // FIXME This is backwards a component should be using getters to pull from the state. 
      // Never set AppState from the component use a service.
      // You should not be need to change the AppState in a watchEffect this could easily cause an infinite loop 
      // AppState.activeChallenge = editable.value.challenge
      // AppState.activeParticipant = editable.value
      // AppState.activeParticipant.requirements.description = { ...AppState.activeChallenge.requirements }
    })

    async function gradeChallenge() {
      try {
        // FIXME not needed the backend should verify moderators
        // const moderator = AppState.moderators.find(m => m.originId === AppState.account.id)
        // const moderatorId = moderator?.id


        // REVIEW 🟡 [JAKE] - Is this logic being handled properly? What about the case that a challenge only has 4 or 5 requirements? In this case I'm assuming you want to allow less than 3 missed checks to still be considered a completed challenge. If so - I'm assuming this should either be a util function or computed property as it would check the length of the completed requirements array and conditionally allow a certain amount of missedChecks depending on the number of requirements? - AJ 

        // Two potential options for solving this problem
        //  - Challenges must have a minimum x number of requirements.
        //  - Challenge creator can declare this number on the challenge. Ensure the number is <= length
        const missedChecks = editable.value.requirements.filter(r => !r.isComplete).length
        editable.value.status = missedChecks > 2
          ? SUBMISSION_TYPES.RETURNED_FOR_REVIEW
          : SUBMISSION_TYPES.COMPLETED

        // const newGrade = {
        //   ...editable.value,
        //   grade: editable.value.grade,
        //   feedback: editable.value.feedback,
        //   status: editable.value.status
        // }

        // should be sufficient to simply send the editable
        await challengeModeratorsService.gradeChallenge(editable.value)

        // FIXME this can probably be removed... no need to change the editable after grading. It should be the same in the correct data state
        // editable.value = {
        //   ...editable.value,
        //   requirements: editable.value.requirements.map(r => ({
        //     ...r, isComplete: r.isComplete ?? false, comment: r.comment || ''
        //   }))
        // }
      } catch (error) {
        logger.error(error)
      }
    }

    function addGradePoint(index) {
      editable.value.requirements.map(
        r => ({ ...r, description: editable.value.challenge.requirements.map(r => (r)), isComplete: false })
      )
      editable.value.requirements[index].isComplete = !editable.value.requirements[index].isComplete;
      editable.value.grade = editable.value.requirements.filter(r => r.isComplete).length;

      editable.value.requirements.forEach(r => {
        if (r.isComplete === true) {
          logger.log(
            `[NEW DATA] =>
          📝 COMPLETED REQUIREMENT: {
            💭 DESCRIPTION: ${r.description}
            📈 GRADE: ${editable.value.grade} / ${editable.value.requirements.length}
            }`
          );
        }
      });
      logger.log(`Requirement Completed? ${editable.value.requirements[index].isComplete ? '✅ Complete' : '❌ Incomplete'}`);
    }

    return {
      editable,
      gradeCount: computed(() => {
        return editable.value.requirements.filter(r => r.isComplete).length
      }),
      challenge: computed(() => AppState.activeChallenge),
      formatEnum,
      gradeChallenge,
      addGradePoint
    }
  }
}
</script>

<style scoped lang="scss">
ol {
  list-style: none;
  counter-reset: my-counter;
  width: 100%;
}

ol li {
  position: relative;
  margin-bottom: 10px;
  left: -10px;
}

ol li::before {
  content: 'Check ' counter(my-counter) ':';
  counter-increment: my-counter;
  position: absolute;
  left: -75px;
  top: -1.5px;
}
</style>