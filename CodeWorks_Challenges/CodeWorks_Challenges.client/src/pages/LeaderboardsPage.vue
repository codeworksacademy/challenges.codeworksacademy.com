<template>
  <section class="container-fluid">
    <div class="text-white" style="height: 100vh; overflow-y: auto; background: radial-gradient(circle, var(--border-main) 0%, var(--bg-main) 35%, var(--border-dark) 100%);">
      <div class="d-flex flex-wrap justify-content-center">
        <div class="col-12">
          <h1 class="text-center">Leaderboard</h1>
        </div>
        <div v-for="participant in leaderboard" :key="participant.name" class="col-12 d-flex flex-row justify-space-evenly card text-white my-2 px-3 py-1 border text-white" style="background: linear-gradient(90deg, var(--border-dark) 0%, var(--border-main) 35%, var(--bg-sub) 100%);">
          <div class="col-4">Name: {{ participant.profile.name }}</div>
          <div class="col-3">Badge Count: {{ participant.badges.length }}</div>
          <div class="col-3">Rank: {{ participant.profile.rank }}</div>
          <div class="col-2">Rep: {{ participant.profile.reputation }}</div>
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


    const leaderboard = computed(() => {
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
    });


    const challenges = computed(() => AppState.challenges);

    return {
      filterBy,
      challenges,
      leaderboard
    }
  },
  components: {
    ChallengeBadge, ChallengeCard
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