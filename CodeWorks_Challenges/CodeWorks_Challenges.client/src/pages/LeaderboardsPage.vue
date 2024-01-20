<template>
  <section class="container-fluid">
    <div class="leaderboard-backdrop">
      <div class="col-12">
        <h1 class="text-center mt-3 mb-5">Leaderboard</h1>
      </div>
      <div class="d-flex flex-wrap justify-content-center align-items-center">
        <h3 class="col-12 text-center text-white mt-3 mb-5">Highest Ranks</h3>
        <ol v-for="participant in sortedByRank" :key="participant.id" class="col-12 d-flex justify-content-center align-items-center mb-0">
          <ParticipantRankCard
            class="my-0 me-3"
            :id="`number-${participants.indexOf(participant) + 1}-player`"
            :participant="participant"
            :index="participants.indexOf(participant) + 1"
          />
        </ol>
      </div>

      <br /> <br /> <br />
<<<<<<< HEAD

      <div v-for="participant in challengeBadges" :key="participant?.id" class="col-12 d-flex flex-wrap justify-content-center align-items-center mb-0">
=======
      
      <h3 class="col-12 text-center text-white mt-3 mb-5">Most Badges</h3>
      <div v-for="participant in challengeBadges" :key="participant.id" class="col-12 d-flex flex-wrap justify-content-center align-items-center mb-0">
>>>>>>> 311fd7479b170693e9388cfee1cbcf5df7d56538
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

      <div class="d-flex col-12 justify-content-center align-items-center">
        <h3 class="col-12 text-center text-white mt-3 mb-5">Most Reputation</h3>
        <ol v-for="participant in sortedByReputation" :key="participant.id" class="col-12 d-flex justify-content-center align-items-center mb-0">
          <ParticipantReputationCard
            class="my-0 me-3"
            :id="`number-${participants.indexOf(participant) + 1}-player`"
            :participant="participant"
            :index="participants.indexOf(participant) + 1"
          />
        </ol>
      </div>

      <br /> <br /> <br />

      <div class="d-flex flex-wrap justify-content-center align-items-center">
        <h3 class="col-12 text-center text-white mt-3 mb-5">Most Challenges Created</h3>
        <ol v-for="participant in sortedByChallengesCreated" :key="participant.id" class="col-12 d-flex justify-content-center align-items-center mb-0">
          <CreatedChallengesCard
            class="my-0 me-3"
            :id="`number-${participants.indexOf(participant) + 1}-player`"
            :participant="participant"
            :index="participants.indexOf(participant) + 1"
          />
        </ol>
      </div>

      <!-- <br /> <br /> <br />

      <div class="d-flex flex-wrap justify-content-center align-items-center">
        <ol v-for="participant in sortedByChallengesCompleted" :key="participant.id" class="col-12 d-flex justify-content-center align-items-center mb-0">
          <ParticipantRankCard
            class="my-0 me-3"
            :id="`number-${participants.indexOf(participant) + 1}-player`"
            :participant="participant"
            :index="participants.indexOf(participant) + 1"
          />
        </ol>
      </div> -->

      <br /> <br /> <br />

      <div class="d-flex flex-wrap justify-content-center align-items-center">
        <ol v-for="participant in sortedByChallengePopularity" :key="participant.id" class="col-12 d-flex justify-content-center align-items-center mb-0">
          <ChallengePopularityCard
            class="my-0 me-3"
            :id="`number-${participants.indexOf(participant) + 1}-player`"
            :participant="participant"
            :index="participants.indexOf(participant) + 1"
          />
        </ol>
      </div>
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
import ParticipantRankCard from "../components/Leaderboards/ParticipantRankCard.vue"
import ParticipantReputationCard from "../components/Leaderboards/ParticipantReputationCard.vue"
import CreatedChallengesCard from "../components/Leaderboards/CreatedChallengesCard.vue"
import ChallengePopularityCard from "../components/Leaderboards/ChallengePopularityCard.vue"
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

    const participants = computed(() => {
      const participants = AppState.ChallengeState.participants
      return participants.reduce((acc, participant) => {
        const exists = acc.find(found => found.profile.id === participant.profile.id)
        if (!exists) {
          acc.push(participant)
        }
        return acc
      }, [])
      //If you want to only keep the reduction of ChallengeState.participants and not sort it by the highest to lowest rank, and to save that level of abstraction for it's specified component responsibility, then you can just return without the sort method, then you would pass the sort method through your component like so:
      // <ol v-for="participant in participants.sort((a, b) => b.profile.rank - a.profile.rank)" :key="participant.id" class="col-12 d-flex justify-content-center align-items-center mb-0">
        //To set a computed constant variable so you can pass it through
    })

    return {
      filterBy,
      challenges: computed(() => AppState.ChallengeState.participants),
      participants,
      sortedByRank: computed(() => {
        const participantsSortedByRank = participants.value.sort((a, b) => b.profile.rank - a.profile.rank)
        return participantsSortedByRank
      }),
      sortedByReputation: computed(() => {
        const participantsSortedByReputation = participants.value.sort((a, b) => (a.profile.reputation - a.profile.reputation))
        return participantsSortedByReputation
      }),
      sortedByChallengesCreated: computed(() => {
        const participantsSortedByChallengesCreated = participants.value.sort((a, b) => (b.challenge.creatorId === b.challenge.creatorId).length - (a.challenge.creatorId === a.challenge.creatorId).length)
        return participantsSortedByChallengesCreated
      }),
      sortedByChallengesCompleted: computed(() => {
        const participantsSortedByChallengesCompleted = participants.value.sort((a, b) => (b.completedAt.length - a.completedAt.length))
        return participantsSortedByChallengesCompleted
      }),
      sortedByChallengePopularity: computed(() => {
        const participantsSortedByChallengePopularity = participants.value.sort((a, b) => (b.challenge.participantCount - a.challenge.participantCount))
        return participantsSortedByChallengePopularity
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
    ParticipantRankCard,
    ParticipantReputationCard,
    CreatedChallengesCard,
    ChallengePopularityCard,
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