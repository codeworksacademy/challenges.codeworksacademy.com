<template>
  <div v-if="challenge" class="container-fluid text-light px-lg-5">

    <section class="row" v-if="!isModerator">
      <div class="col-12" v-if="challenge?.status.toLowerCase() === 'published'">
        <div v-if="(!isParticipant || isParticipant?.status === 'left')">
          <ChallengeStatCard :challenge="challenge" color="#22ff33" bgColor="#22ff330f" icon="mdi-account-multiple-plus"
            @click="joinChallenge()" class="selectable mb-2" prop="Join Challenge" />
        </div>
        <div v-if="isParticipant?.status === 'started' || isParticipant?.status === 'returned for review'"
          :title="isParticipant?.feedback ? 'Feedback: ' + isParticipant?.feedback : 'Submit Challenge'">
          <ChallengeStatCard :challenge="challenge" data-bs-toggle="modal" data-bs-target="#challengeSubmissionForm"
            data-bs-dismiss="modal" class="selectable mb-2" bgColor="#1da3e60f" color="#1da3e6" icon="mdi-send"
            prop="Submit Challenge">
            <span v-if="isParticipant?.status === 'returned for review'" class="text-uppercase text-warning mt-2">
              Returned for Review
            </span>
          </ChallengeStatCard>
        </div>
        <div v-if="isParticipant?.status === 'submitted'">
          <ChallengeStatCard :challenge="challenge" title="Awaiting Review" class="mb-2" color="#887766"
            icon="mdi-message-draw" prop="Awaiting Review" />
        </div>
        <div v-if="isParticipant?.status === 'completed'">
          <ChallengeStatCard :challenge="challenge" title="Completed!" class="mb-2" color="gold" icon="mdi-party-popper"
            prop="Completed!" />
        </div>
      </div>
    </section>

    <section class="row">
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
    </section>

    <section class="row">
      <div class="col-lg-4 my-2">
        <ChallengeStatCard :challenge="challenge" color="#b78fff" bgColor="#1D213A" prop="reputation"
          :value="challenge.reputationIds.length" icon="mdi-account-star-outline" style="min-height: 25vh;">
          <GiveRepButton :challenge="challenge" />
        </ChallengeStatCard>
      </div>
      <div class="col-lg-8 my-2">
        <ChallengeCreatorCard :challenge="challenge" :profile="challenge.creator" color="#323e78" bgColor="#323e7829" />
      </div>
    </section>

    <section class="row">
      <div class="col-lg-12 my-2">
        <ChallengeBadgeCard :challenge="challenge" :badge="challenge.badge" />
      </div>
    </section>

    <section class="row" v-if="challenge.description">
      <div class="col-12">
        <div class="details-header p-3 bg-detail mt-3 rounded-3">
          <h3 class="text-uppercase">
            Challenge Description
          </h3>
          <Markdown :value="challenge.description" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Pop from '../utils/Pop.js'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { AppState } from '../AppState.js'
import { difficultyMap } from '../utils/DifficultyMap.js'
import { AuthService } from "../services/AuthService.js"
import { participantsService } from '../services/ParticipantsService.js'
import ChallengeCreatorCard from '../components/ChallengePage/ChallengeCreatorCard.vue'
import ChallengeBadgeCard from '../components/ChallengePage/ChallengeBadgeCard.vue'
import ChallengeStatCard from "../components/ChallengePage/ChallengeStatCard.vue"
import GiveRepButton from "../components/ChallengePage/GiveRepButton.vue"
import Markdown from "../components/EditChallenge/Markdown.vue"

export default {
  setup() {
    

    const route = useRoute();

    async function joinChallenge() {
      try {
        if (!AppState.AccountState.account.id) {
          AuthService.loginWithPopup();
          return
        }
        await participantsService.joinChallenge({
          challengeId: route.params.challengeId,
        });
        Pop.success("You have joined the challenge!");
      }
      catch (error) { Pop.error('[CHALLENGE OVERVIEW PAGE] joinChallenge:: ' + error); }
    }


    return {
      joinChallenge,
      challenge: computed(() => AppState.ChallengeState.challenge),
      isParticipant: computed(() => AppState.ChallengeState.participants.find(p => p.accountId === AppState.user.id)),
      isModerator: computed(() => {
        const mod = AppState.ChallengeState.moderators.find(m => m.accountId === AppState.user.id);
        if (mod == -1) { return false; }
        return mod;
      }),
      difficulty: computed(() => {
        const difficulty = AppState.ChallengeState.challenge?.difficulty
        return difficultyMap[difficulty] || difficultyMap.default
      }),
    }
  },
  components: { ChallengeCreatorCard, ChallengeBadgeCard, ChallengeStatCard, GiveRepButton, Markdown }
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