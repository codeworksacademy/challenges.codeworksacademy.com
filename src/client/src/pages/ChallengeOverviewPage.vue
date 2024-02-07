<template>
  <section v-if="challenge" :key="challenge?.id" class="text-light container-fluid px-lg-5">

    <div class="row">
      <div class="col-12">
        <div v-if="!isParticipant">
          <ChallengeStatCard :challenge="challenge" color="#22ff33" bgColor="#22ff330f" value=""
            icon="mdi-account-multiple-plus" @click="joinChallenge()" class="selectable" prop="Join Challenge" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-4 my-2">
        <ChallengeStatCard :challenge="challenge" :color="difficulty.color" :bgColor="difficulty.bgColor"
          :value="difficulty.value" prop="difficulty" icon="mdi-diamond-stone" />
      </div>
      <div class="col-lg-4 my-2">
        <ChallengeStatCard :challenge="challenge" color="#ff9740" bgColor="#ff730038" prop="category"
          icon="mdi-office-building-cog-outline" />
      </div>
      <div class="col-lg-2 my-2">
        <ChallengeStatCard :challenge="challenge" color="#ff77e7" bgColor="#ff3cc938" prop="Users"
          :value="challenge.participantCount" icon="mdi-bottle-tonic-skull" />
      </div>
      <div class="col-lg-2 my-2">
        <ChallengeStatCard :challenge="challenge" color="#f7f4b3" bgColor="#161d2b" prop="Solves"
          :value="challenge.completedCount" icon="mdi-seal" />
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4 my-2">
        <ChallengeStatCard :challenge="challenge" color="#b78fff" bgColor="#1D213A" prop="reputation"
          :value="challenge.reputationIds.length" icon="mdi-account-star-outline" style="min-height: 25vh;">
          <GiveRepButton :challenge="challenge" />
        </ChallengeStatCard>
      </div>
      <div class="col-lg-8 my-2">
        <ChallengeCreatorCard :challenge="challenge" :profile="challenge.creator" color="#323e78" bgColor="#323e7829" />
      </div>
      <!-- <div class="col-lg-12 mt-1">
        <ChallengeBadgeCard :challenge="challenge" :badge="challenge.badge" class="mx-1" />
      </div> -->
    </div>
    <div class="row">
      <div class="col-12">
        <div class="details-header p-3 bg-detail mt-3 rounded-3">
          <h3 class="text-uppercase">
            Challenge Description
          </h3>
          <Markdown :value="challenge.description" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState'
import ChallengeCreatorCard from '../components/ChallengePage/ChallengeCreatorCard.vue'
import ChallengeBadgeCard from '../components/ChallengePage/ChallengeBadgeCard.vue'
import { difficultyMap } from '../utils/DifficultyMap.js'
import { useRoute } from 'vue-router'
import { participantsService } from '../services/ParticipantsService.js'
import Pop from '../utils/Pop.js'

export default {
  setup() {

    const route = useRoute();
    const isParticipant = computed(() => {
      return AppState.ChallengeState.participants.find(p => p.accountId === AppState.user.id);
    });
    async function joinChallenge() {
      try {
        await participantsService.joinChallenge({
          challengeId: route.params.challengeId,
        });
        Pop.success("You have joined the challenge!");
      }
      catch (error) {
        Pop.toast(error, "error");
      }
    }


    return {
      isParticipant,
      joinChallenge,
      challenge: computed(() => AppState.ChallengeState.challenge),
      difficulty: computed(() => {
        const difficulty = AppState.ChallengeState.challenge?.difficulty
        return difficultyMap[difficulty] || difficultyMap.default
      })
    }
  },
  components: { ChallengeCreatorCard, ChallengeBadgeCard }
}
</script>

<style scoped lang="scss">
.container-fluid {
  background-color: var(--bg-main);
}


.creator-details-card {
  height: 25vh;
  display: flex;
  justify-content: center;
  color: #f0f0f0;
  background: #1c2332;
  text-align: center;
}

.badge-card {
  height: 30vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem;
  padding: 2rem;
  color: #f0f0f0;
  border: 1px solid #323e78;
  border-radius: 5px;
  background: #323e7829;
  text-align: center;
}

.bg-detail {
  background-color: #1c2332;
  border: 1px solid #2d386b;
}

@media screen and (max-width: 768px) {
  .details-header {
    padding: 2rem;

    h3 {
      font-size: 1.75rem;
    }

    p {
      padding: .5rem 0 1rem 0;
      font-size: 1.25rem;
    }
  }

  .mobile-flex-column {
    flex-direction: column;
    padding-right: 1rem;
  }

  .mobile-media-query {
    flex-direction: column;
    padding-right: 1rem;

    .creator-details-card {
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin: 1rem;
      padding: 2rem;
      color: #f0f0f0;
      background: #1c2332;
      text-align: center;

      .col-4 {
        padding: 0;

        img {
          height: 75px;
          width: 75px;
          margin-bottom: 1rem;
        }
      }

      .col-8 {
        padding: 0;

        .button-container {
          padding-right: 0rem;
          padding-top: 2rem;

          button {
            padding: .5rem 1rem;
            font-size: 1rem;
          }
        }
      }
    }
  }
}
</style>