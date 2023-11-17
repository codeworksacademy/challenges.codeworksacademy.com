<template>
  <section
    v-if="isModeratorStatus == 'approved' || challengeCreator"
    class="container-fluid"
  >
    <h1>Challenge Grading</h1>
    <h3>User Name</h3>
    <a href=""><p>Repo Link</p></a>
    <p>Submit Date</p>
    <form @submit.prevent="submitGrade" v-if="challenge">
      <section class="" v-for="(step, index) in challenge.steps" :key="index">
        <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" :id="step + index">
                  <label class="form-check-label" :for="step + index">
                    {{ step }}
              </label>
        </div>
      </section>
      <h3>Comments</h3>
      <textarea name="" id="" cols="30" rows="10" class="form-control mb-3"></textarea>
      <button class="btn btn-success mb-3">Update Grade</button>
  </form>
  </section>
</template>
  
<script>
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"  
import SubmissionCard from '../components/SubmissionCard.vue'
import { challengesService } from '../services/ChallengesService'
import { useRoute } from 'vue-router'
import { GRADE_FIELDS } from '../constants/index.js'
import { participantsService } from '../services/ParticipantsService'

export default {
  components: {
    SubmissionCard
  },
  setup() {
    let route = useRoute()

    async function setActiveChallenge() {
      try {
        await challengesService.setActiveChallenge(route.params.challengeId)
        logger.log(route.params.challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    function isModeratorStatus() {
      const isMod = AppState.moderators.find(m => m.accountId == AppState.account.id)
      if (isMod) {
        if (isMod.status == false) {
          return 'pending'
        } else return 'approved'
      } else return 'null'
    }

    const grade = ref(0)
    const feedback = ref("")
    const completed = ref(false)
    const challengeFieldsToGrade = ref([])

    // Initialize challengeFieldsToGrade with the correct structure
    onMounted(() => {
      challengeFieldsToGrade.value = GRADE_FIELDS.map(field => ({
        requirement: field.requirement,
        completed: false
      }))
    })

    const challenge = computed(() => {
      return AppState.challenges.find(c => c.id === AppState.activeChallenge.id)
    })
    const participant = computed(() => {
      return AppState.participants.find(p => p.id === AppState.activeParticipant.id)
    })

    async function submitGrade() {
      try {
        const newSubmission = {
          grade: grade.value,
          feedback: feedback.value,
          completed: completed.value,
          challengeId: challenge.value.id,
          participantId: participant.value.id,
          requirements: challengeFieldsToGrade.value
        }
        await participantsService.submitChallengeForGrading(newSubmission, participant.value.id)
      } catch (error) {
        logger.error(error)
      }
    }

    onMounted(() => {
      setActiveChallenge()
    })

    return {
      grade,
      feedback,
      completed,
      challengeFieldsToGrade,
      challenge,
      participant,
      submitGrade,

      user: computed(() => AppState.user),
      challenge: computed(() => AppState.activeChallenge),
      challengeCreator: computed(() => AppState.user.id === AppState.activeChallenge?.creatorId),
      isModeratorStatus,
      isParticipant: computed(() => AppState.activeChallenge.participants.find(p => p.accountId == AppState.account.id)),

    } 
  }
}
</script>

<style scoped lang="scss">

</style>