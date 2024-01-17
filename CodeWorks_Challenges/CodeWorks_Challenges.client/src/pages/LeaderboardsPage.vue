<template>
  <section class="container-fluid">
    <div class="text-white" style="height: 100vh; overflow-y: auto; background: radial-gradient(circle, var(--border-main) 0%, var(--bg-main) 35%, var(--border-dark) 100%);">
      <div class="d-flex flex-wrap justify-content-center">
        <div class="col-12">
          <h1 class="text-center">Leaderboard</h1>
        </div>

          <ol v-for="participant in participants" :key="participant.id" class="col-12 d-flex flex-row">
            <ParticipantScoreCard v-if="participants.indexOf(participant) === 0" :participant="participant" :index="participants.indexOf(participant) + 1" style="filter: brightness(2); margin: auto" />
            <ParticipantScoreCard v-else-if="participants.indexOf(participant) === 1" :participant="participant" :index="participants.indexOf(participant) + 1" style="filter: brightness(1.5);" />
            <ParticipantScoreCard v-else-if="participants.indexOf(participant) === 2" :participant="participant" :index="participants.indexOf(participant) + 1" style="filter: brightness(1.2);" />
            <ParticipantScoreCard v-else :participant="participant" :index="participants.indexOf(participant) + 1" />
          </ol>
      </div>
    </div>
  </section>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { participantsService } from "../services/ParticipantsService.js"
import ChallengeBadge from "../components/ChallengePage/ChallengeBadge.vue"
import ChallengeCard from "../components/ChallengesPage/ChallengeCard.vue"
import ParticipantScoreCard from "../components/Leaderboards/ParticipantScoreCard.vue"

export default {
  setup() {
    const filterBy = ref('')

    async function getLeaderboards() {
      try {
        await participantsService.getLeaderboards()
      } catch (error) {
        logger.error(error)
        logger.log('')
      }
    }

    onMounted(() => {
      getLeaderboards()
    })

    return {
      filterBy,
      participants: computed(() => {
        const participants = AppState.ChallengeState.participants
        return participants.reduce((acc, participant) => {
          const exists = acc.find(found => found.profile.id === participant.profile.id)
          if (!exists) {
            acc.push(participant)
          }
          return acc
        }, [])
      })
    }
  },
  components: {
    ChallengeBadge, ChallengeCard, ParticipantScoreCard
  }
}
</script>

<style scoped lang="scss">
@import url('../assets/scss/_root.scss');
h1 {
  text-shadow: 2px 2px 2px black;
}
span {
  text-shadow: 1px 1px 1px black;
}
</style>