<template>
  <section class="container-fluid">

    <div v-if="challenge" :key="challenge.id" class="p-3">
      <div class="d-flex col-12">
        <div class="col-6 d-flex flex-column justify-content-start">
          <span>Total Submitted: {{ totalSubmitted }} </span>
          <span>Total Completed: {{ challenge.completedCount }} </span>
          <span>Active Participants: {{ challenge.participantCount }} </span>
          <span>Success Rate: {{ participantCompletionRate }} </span>
        </div>
        <div class="col-6 d-flex flex-column justify-content-center align-items-end pt-0">
          <span v-html="difficulty.html"></span>
          <img src="../../assets/img/chart-img.png" :alt="`Difficulty rating for ${challenge.name}`" :title="`The difficulty rating for '${challenge.name}'`" class=" img-fluid my-2" style="height:50px;width:70px">
        </div>
      </div>
    </div>

  
  </section>
</template>
  
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

export default {

  setup() {
    let route = useRoute()

    const filterBy = ref('')
    const editable = ref({
      accountId: AppState.user.id,
      challengeId: AppState.activeChallenge?.id,
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
      challenge: computed(() => AppState.activeChallenge),
      myModerations: computed(() => AppState.moderators.filter(m => m.accountId === AppState.account.id)),
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
        StrDifficultyNum(AppState.activeChallenge.difficulty)
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