<template>
  <section v-if="participant" :key="participant?.id" class="container-fluid bg-dark text-light">
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
      <form @submit.prevent="gradeChallengeParticipant" class="row">
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
        <div class="col-12 text-center mt-3">
          <h4>Set status for {{ participant.profile.name }}</h4>
        </div>
        <div class="d-flex justify-content-center align-items-center my-3">
          <div class="">
            <div class="col-12 d-flex justify-content-center align-items-center input-group px-5 mb-5">
              <label class="input-group-text" for="challengeAutoGrade">Status</label>
              <select v-model="editable.status" name="status" id="status" placeholder="Status"
                class="form-select bg-light">
                <option value="null">Select a status</option>
                <option value="completed">Completed</option>
                <option value="returned_for_review">Returned for Review</option>
              </select>
              <button type="submit" class="btn btn-success">Submit</button>
            </div>
          </div>
        </div>
      </form>
    </div>

  </section>
</template>

<script>
import Pop from '../../utils/Pop'
import { useRoute } from 'vue-router'
import { AppState } from '../../AppState'
import { logger } from '../../utils/Logger'
import { SUBMISSION_TYPES } from '../../constants'
import { formatEnum } from '../../utils/FormatEnum'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { challengesService } from '../../services/ChallengesService'
import { participantsService } from '../../services/ParticipantsService'
import { ChallengeParticipant } from '../../models/ChallengeParticipant'
import { challengeModeratorsService } from '../../services/ChallengeModeratorsService'

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
      status: props.participant.status
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


    async function gradeChallengeParticipant() {
      try {
        // REVIEW 🟡 [JAKE] - Is this logic being handled properly? What about the case that a challenge only has 4 or 5 requirements? In this case I'm assuming you want to allow less than 3 missed checks to still be considered a completed challenge. If so - I'm assuming this should either be a util function or computed property as it would check the length of the completed requirements array and conditionally allow a certain amount of missedChecks depending on the number of requirements? - AJ 

        // Two potential options for solving this problem
        //  - Challenges must have a minimum x number of requirements.
        //  - Challenge creator can declare this number on the challenge. Ensure the number is <= length
        const newGrade = editable.value
        const missedChecks = newGrade.requirements.filter(r => !r.isComplete).length
        newGrade.status = missedChecks > 2
          ? SUBMISSION_TYPES.RETURNED_FOR_REVIEW
          : SUBMISSION_TYPES.COMPLETED
        await participantsService.gradeChallengeParticipant(newGrade)
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
      challenge: computed(() => AppState.ChallengeState.challenge),
      formatEnum,
      gradeChallengeParticipant,
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

</style>