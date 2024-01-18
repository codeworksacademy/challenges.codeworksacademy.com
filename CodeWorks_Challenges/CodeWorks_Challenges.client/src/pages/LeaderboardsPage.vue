<template>
  <section class="container-fluid">
    <div class="leaderboard-backdrop">
      <div class="col-12">
        <h1 class="text-center mt-3 mb-5">Leaderboard</h1>
      </div>
      <div class="d-flex flex-wrap justify-content-center align-items-center">
        <ol v-for="participant in participants" :key="participant.id" class="col-12 d-flex flex-row justify-content-center align-items-center mb-0">
          <ParticipantScoreCard
            class="my-0 me-3"
            :id="`number-${participants.indexOf(participant) + 1}-player`"
            :participant="participant"
            :index="participants.indexOf(participant) + 1"
          />
        </ol>
      </div>
      <div  v-for="participant in challengeBadges" :key="participant.id" class="col-12 d-flex justify-content-center align-items-center mb-0 px-5">
        <!-- {{ participant.challenge.badge }} -->
        <div class="col-10 d-flex flex-column justify-content-center align-items-center">
          <h4>{{ participant.profile.name  }}</h4>
          {{ participant.badges }}
          <h4>Badge count for {{ participant.profile.name }}: {{ participant.badges.length }}</h4>
          <div v-for="badge in participant.badges" :key="badge.id" class="col-12 d-flex justify-content-center align-items-center mb-0 px-5">
            <ChallengeBadge
              class="my-0 me-3"
              :badge="badge"
            />
          </div>
        </div>
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
      challenges: computed(() => AppState.ChallengeState.participants),
      participants: computed(() => {
        const participants = AppState.ChallengeState.participants.sort((a, b) => b.profile.rank - a.profile.rank)
        return participants.reduce((acc, participant) => {
          const exists = acc.find(found => found.profile.id === participant.profile.id)
          if (!exists) {
            acc.push(participant)
          }
          return acc
        }, [])
      }),
      challengeBadges: computed(() => {
        const participantsWithBadges = AppState.ChallengeState.participants.filter(p => p.challenge.badge !== undefined);
        const participantsMap = new Map();
        participantsWithBadges.forEach(participant => {
          if (!participantsMap.has(participant.accountId)) {
            participantsMap.set(participant.accountId, {
              accountId: participant.accountId,
              profile: participant.profile,
              badges: [],
            });
          }
          participantsMap.get(participant.accountId).badges.push(participant.challenge.badge);
        });
        const uniqueParticipantsWithBadges = Array.from(participantsMap.values());
        logger.log('sorted participants', uniqueParticipantsWithBadges.sort((a, b) => b - a))
        return uniqueParticipantsWithBadges.sort((a, b) => b.badges.length - a.badges.length);      
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

.leaderboard-backdrop {
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background: radial-gradient(circle, var(--border-main) 0%, var(--bg-main) 35%, var(--border-dark) 100%);
  color: var(--text-main);
  h1 {
    text-shadow: 2px 2px 2px black;
  }
  span {
    text-shadow: 1px 1px 1px black;
  }
}
</style>