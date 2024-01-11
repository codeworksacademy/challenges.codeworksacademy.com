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
        <ChallengeDifficultyCard :challenge="challenge" color="#20C997" bgColor="#20c99629" :themeStyle="true" />
      </div>
      <div class="col-12 col-md-4">
        <ChallengeCategoryCard :challenge="challenge" color="#FD7E14" bgColor="#fd7d142e" :themeStyle="true" />
      </div>
      <div class="col-12 col-md-4">
        <ChallengeReputationCard :challenge="challenge" color="#6F42C1" bgColor="#1D213A" :themeStyle="true" />
      </div>
    </div>
    <div class="d-flex mobile-flex-column justify-content-center align-items-center">
      <div class="col-12 col-md-4">
        <ChallengeParticipantsCard :challenge="challenge" color="#323e78" bgColor="#323e7829" :themeStyle="true" />
      </div>
      <div class="col-12 col-md-8 card-container">
        <ChallengeCreatorCard :challenge="challenge" color="#323e78" bgColor="#323e7829" :themeStyle="true" />
      </div>
    </div>
    <div v-if="isPublished && challenge.badge?.title" class="col-12 col-md-8 badge-card m-auto mt-3">
      <h3>New Badge to Earn!</h3>
      <ChallengeBadge :challenge="challenge" :color="editable" />
    </div>
    <div v-else-if="!challengeHasBadge" class="col-12 col-md-8 badge-card m-auto mt-3">
      <h3>No Badge is set for this Challenge</h3>
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
import ChallengeCreatorCard from '../components/ChallengePage/ChallengeCreatorCard.vue'
import ChallengeCategoryCard from '../components/ChallengePage/ChallengeCategoryCard.vue'
import ChallengeDifficultyCard from '../components/ChallengePage/ChallengeDifficultyCard.vue'
import ChallengeReputationCard from '../components/ChallengePage/ChallengeReputationCard.vue'
import ChallengeParticipantsCard from '../components/ChallengePage/ChallengeParticipantsCard.vue'
import ChallengeBadge from '../components/ChallengePage/ChallengeBadge.vue'

export default {
  setup() {
    const editable = {
      primaryColor: '#b3b2b2',
      secondaryColor: '#242424',
    }
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
      editable,
      createModeration,
      removeModeration,
      
      isMobile,

      challenge: computed(() => AppState.ChallengeState.challenge),
      challengeHasBadge: computed(() => AppState.challenges.filter(c => c.badge !== null)),
      isPuzzle: computed(() => AppState.ChallengeState.challenge.category === CATEGORY_TYPES.PUZZLES),
      difficulty: computed(() => {
        const challenge = StrDifficultyNum(AppState.ChallengeState.challenge.difficulty)
        return challenge
      }),
      isPublished: computed(() => AppState.ChallengeState.challenge.status === 'published')
    }
  },
  components: { ChallengeDifficultyCard, ChallengeCategoryCard, ChallengeReputationCard, ChallengeParticipantsCard, ChallengeCreatorCard, ChallengeBadge }
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
.badge-card {
  height: 30vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem;
  padding:2rem;
  color: #f0f0f0;
  border: 1px solid #323e78;
  border-radius: 5px;
  background: #323e7829;
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