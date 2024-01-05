<template>
  <section v-if="challenge" :key="challenge?.id" class="text-light pb-5">

    <article>
      <div class="details-header ps-3 bg-detail mx-3">
        <h3 class="text-uppercase" style="color: #7A7A7A">
          Challenge Description
        </h3>
        <p> {{ challenge.description }} </p>
      </div>
    </article>

    <div class="col-12 mobile-media-query d-flex justify-content-center align-items-center">
      <div class="col-12 col-md-4 card-container">
        <ActiveChallengeDifficultyCard :challenge="challenge" />
      </div>
      <div class="col-12 col-md-4">
        <ActiveChallengeCategoryCard :challenge="challenge" />
      </div>
      <div class="col-12 col-md-4">
        <ActiveChallengeReputationCard :challenge="challenge" />
      </div>
    </div>
    <div class="d-flex mobile-flex-column justify-content-center align-items-center">
      <div class="col-12 col-md-4">
        <ActiveChallengeParticipantsCard :challenge="challenge" />
      </div>
      <div class="col-12 col-md-8 card-container">
        <ActiveChallengeCreatorCard :challenge="challenge" />
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import Pop from '../utils/Pop'
import { useRoute } from 'vue-router'
import { AppState } from '../AppState'
import { StrDifficultyNum } from '../utils/StrDifficultyNum'
import { challengeModeratorsService } from '../services/ChallengeModeratorsService'
import ActiveChallengeCreatorCard from '../components/ChallengeDetailsPage/ActiveChallengeCreatorCard.vue'
import ActiveChallengeCategoryCard from '../components/ChallengeDetailsPage/ActiveChallengeCategoryCard.vue'
import ActiveChallengeDifficultyCard from '../components/ChallengeDetailsPage/ActiveChallengeDifficultyCard.vue'
import ActiveChallengeReputationCard from '../components/ChallengeDetailsPage/ActiveChallengeReputationCard.vue'
import ActiveChallengeParticipantsCard from '../components/ChallengeDetailsPage/ActiveChallengeParticipantsCard.vue'

export default {
  setup() {
    const route = useRoute()
    const isMobile = computed(() => window.innerWidth < 768)

      async function createModeration() {
        try {
          const moderatorData = {
            challengeId: route.params.challengeId,
            accountId: AppState.user.id
          } 
          await challengeModeratorsService.createModeration(moderatorData)
          Pop.success('You have requested to become a moderator for this challenge, please be patient while the owner of this challenge reviews your request')
        } catch (error) {
          Pop.toast(error, 'error')
        }
      }

      async function removeModeration(moderationId) {
        try {
          const confirmRemove = await Pop.confirm('Delete Moderation?')
          if (!confirmRemove) {
            return
          }
          await challengeModeratorsService.removeModeration(moderationId)
        } catch (error) {
          Pop.toast(error, 'error')
        }
      }

    return {
      createModeration,
      removeModeration,
      
      isMobile,

      challenge: computed(() => AppState.ChallengeState.challenge),
      isPuzzle: computed(() => AppState.ChallengeState.challenge.category === CATEGORY_TYPES.PUZZLES),
      difficulty: computed(() => {
        const challenge = StrDifficultyNum(AppState.ChallengeState.challenge.difficulty)
        return challenge
      }),
    }
  },
  components: { ActiveChallengeDifficultyCard, ActiveChallengeCategoryCard, ActiveChallengeReputationCard, ActiveChallengeParticipantsCard, ActiveChallengeCreatorCard }
}
</script>

<style scoped lang="scss">
.container-fluid {
  background-color: var(--bg-main);
}
.details-card {
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem;
  padding:2rem;
  color: #f0f0f0;
  background:#1c2332;
  text-align: center;
}
.creator-details-card {
  height: 25vh;
  display: flex;
  justify-content: center;
  margin: 1rem;
  color: #f0f0f0;
  background:#1c2332;
  text-align: center;
}

.bg-detail{
    background-color: #1c2332
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
      padding:2rem;
      color: #f0f0f0;
      background:#1c2332;
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