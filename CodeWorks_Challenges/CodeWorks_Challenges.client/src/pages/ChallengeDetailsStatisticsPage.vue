<template>
  <section class="mx-3">
    <div v-if="challenge" :key="challenge.id" class="p-3 bg-detail rounded-3">
      <div class="d-flex col-12">
        <div class="col-6 d-flex flex-column justify-content-start">
          <h3>Total Submitted: {{ totalSubmitted }} </h3>
          <h3>Total Completed: {{ challenge.completedCount }} </h3>
          <h3>Active Participants: {{ challenge.participantCount }} </h3>
          <h3 v-if="participantCompletionRate <= 0">Success Rate: {{ participantCompletionRate }} </h3>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .bg-detail{
    background-color: #1c2332
  }
</style>
  
<script>
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import Pop from '../utils/Pop'
import { logger } from '../utils/Logger'  
import { challengesService } from '../services/ChallengesService'
import { useRoute } from 'vue-router'
import { participantsService } from '../services/ParticipantsService'
import { StrDifficultyNum } from '../utils/StrDifficultyNum'
import { SUBMISSION_TYPES } from '../constants'
import ActiveChallengeDifficultyCard from '../components/ChallengeDetailsPage/ActiveChallengeDifficultyCard.vue'

export default {
  components: {
    ActiveChallengeDifficultyCard
  },
  setup() {
    let route = useRoute()

    const filterBy = ref('')
    const editable = ref({
      accountId: AppState.user.id,
      challengeId: AppState.ChallengeState.challenge?.id,
      submission: '',
      status: SUBMISSION_TYPES,
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

    const participant = computed(() => {
      return AppState.participants.find(p => p.accountId === AppState.user.id)
    })

    onMounted(() => {
      setActiveChallenge()
      getParticipantsByChallengeId()
    })

    return {
      filterBy,
      editable,
      participant,

      user: computed(() => AppState.user),
      challenge: computed(() => AppState.ChallengeState.challenge),
      myModerations: computed(() => AppState.moderators.filter(m => m.accountId === AppState.AccountState.account.id)),
      participants: computed(() => AppState.participants),
      isParticipant: computed(() => {
        return AppState.participants.find(p => p.accountId === AppState.user.id)
      }),
      participantFilter: computed(() => {
        if (!filterBy.value) {
          return AppState.participants
        } else {
          return AppState.participants.filter(p => p.status === filterBy.value)
        }
      }),
      difficulty: computed(() =>
        StrDifficultyNum(AppState.ChallengeState.challenge.difficulty)
      ),
      participantCompletionRate: computed(() => {
        const participants = AppState.participants
        const submissionTypes = participants.filter(p => p.status === SUBMISSION_TYPES ? p.status === SUBMISSION_TYPES : p.status !== SUBMISSION_TYPES['removed', 'left'])
        const completed = participants.filter(p => p.status === 'completed')
        const total = submissionTypes.length
        const percentage = (completed.length / total) * 100
        return percentage.toFixed(2) + '%'
      }),
      totalSubmitted: computed(() => {
        const participants = AppState.participants
        const submissions = participants.filter(p => p.status === 'submitted' || p.status === 'completed')
        const total = submissions.length
        return total
      })
    } 
  }
}
</script>