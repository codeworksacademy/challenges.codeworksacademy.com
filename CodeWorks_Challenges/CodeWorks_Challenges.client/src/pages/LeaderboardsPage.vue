<template>
  <section class="container-fluid">
    <div class="leaderboard-backdrop">
      <div class="col-12">
        <h1 class="text-center mt-3 mb-5">Leaderboard</h1>
      </div>
      <div class="d-flex flex-wrap justify-content-center align-items-center">
        <ol v-for="participant in participants" :key="participant.id" class="col-12 d-flex justify-content-center align-items-center mb-0">
          <ParticipantScoreCard
            class="my-0 me-3"
            :id="`number-${participants.indexOf(participant) + 1}-player`"
            :participant="participant"
            :index="participants.indexOf(participant) + 1"
          />
        </ol>
      </div>

      <br /> <br /> <br />

      <div v-for="participant in challengeBadges" :key="participant?.id" class="col-12 d-flex flex-wrap justify-content-center align-items-center mb-0">
        <MostBadgesCard class="ms-2" :participant="participant" :index="challengeBadges.indexOf(participant) + 1" />
        <ModalWrapper id="badgeModal">
          <template #header>
            <h3 class="m-auto">{{ participant.profile.name }} has earned {{ participant.badges.length }} badges!</h3>
          </template>
          <template #body>
            <BadgeModalBody :participant="participant" :key="participant?.id" />
          </template>
        </ModalWrapper>
      </div>

      <br /> <br /> <br />

      <!-- TODO - 🏗️
        (1) Rid of new Vue warns for incorrectly passed props;
        (2) Fix reputation on leaderboards;
        (3) Abstract components to follow Single Principle of Responsibility;
        (4) Implement select option dropdowns that allows users to filter leaderboards by either highest rank, most challenges created, most challenges completed, most reputation, and most badges earned from completing challenges;
        (5) Deploy! 🍾
      -->
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
import MostBadgesCard from "../components/Leaderboards/MostBadgesCard.vue"
import ModalWrapper from "../components/ModalWrapper.vue"
import BadgeModalBody from "../components/Leaderboards/BadgeModalBody.vue"

export default {
  setup() {
    const filterBy = ref('')

    async function getLeaderboards() {
      try {
        await participantsService.getLeaderboards()
      } catch (error) {
        logger.error(error)
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
    ChallengeBadge,
    ChallengeCard,
    ParticipantScoreCard,
    MostBadgesCard,
    ModalWrapper,
    BadgeModalBody
  }
}
</script>

<style scoped lang="scss">
@import url('../assets/scss/_root.scss');
.leaderboard-backdrop {
  min-height: 100vh;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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