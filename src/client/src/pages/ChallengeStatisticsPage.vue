<template>
  <div class="container-fluid bg-detail p-3 rounded-3">
    <section class="row" v-if="challenge">
      <div class="col-12 pb-3">
        <h3 class="fs-2" style="color: #7A7A7A">Challenge Statistics</h3>
      </div>

      <div class="col-12 px-4">
        <div class="d-flex flex-column">
          <h3>Total Submitted: {{ totalSubmitted }} </h3>
          <h3>Total Completed: {{ challenge.completedCount }} </h3>
          <h3>Active Participants: {{ challenge.participantCount }} </h3>
          <h3 v-if="participantCompletionRate > 0">Success Rate: {{ participantCompletionRate }} </h3>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.bg-detail {
  background-color: #1c2332
}
</style>
  
<script>
import { computed, ref } from 'vue'
import { AppState } from '../AppState.js'
import { SUBMISSION_TYPES } from '../constants'
import { StrDifficultyNum } from '../utils/StrDifficultyNum.js'

export default {
  setup() {

    const filterBy = ref('')
    const editable = ref({
      accountId: AppState.user.id,
      challengeId: AppState.ChallengeState.challenge?.id,
      submission: '',
      status: SUBMISSION_TYPES,
    })

    const participant = computed(() => {
      return AppState.ChallengeState.participants.find(p => p.accountId === AppState.user.id)
    })

    return {
      filterBy,
      editable,
      participant,

      user: computed(() => AppState.user),
      challenge: computed(() => AppState.ChallengeState.challenge),
      myModerations: computed(() => AppState.ChallengeState.moderators.filter(m => m.accountId === AppState.AccountState.account.id)),
      participants: computed(() => AppState.ChallengeState.participants),
      isParticipant: computed(() => {
        return AppState.ChallengeState.participants.find(p => p.accountId === AppState.user.id)
      }),
      participantFilter: computed(() => {
        if (!filterBy.value) {
          return AppState.ChallengeState.participants
        } else {
          return AppState.ChallengeState.participants.filter(p => p.status === filterBy.value)
        }
      }),
      difficulty: computed(() =>
        StrDifficultyNum(AppState.ChallengeState.challenge.difficulty)
      ),
      participantCompletionRate: computed(() => {
        const participants = AppState.ChallengeState.participants
        const submissionTypes = participants.filter(p => p.status === SUBMISSION_TYPES ? p.status === SUBMISSION_TYPES : p.status !== SUBMISSION_TYPES['removed', 'left'])
        const completed = participants.filter(p => p.status === 'completed')
        const total = submissionTypes.length
        const percentage = (completed.length / total) * 100
        return percentage.toFixed(2) + '%'
      }),
      totalSubmitted: computed(() => {
        const participants = AppState.ChallengeState.participants
        const submissions = participants.filter(p => p.status === 'submitted' || p.status === 'completed')
        const total = submissions.length
        return total
      })
    }
  }
}
</script>

<style scoped lang="scss">
.bg-detail {
  background-color: #1c2332;
  border: 1px solid #2d386b;
}
</style>