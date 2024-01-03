<template>
  <section v-if="challenge" :key="challenge?.id" class="text-light pb-5">

    <!-- STUB - Space reserved for the challenge details -->
    <article>
      <div class="details-header ps-3">
        <h3 class="text-uppercase" style="color: #7A7A7A">
          Challenge Description
        </h3>
        <p> {{ challenge.description }} </p>
        <hr>
      </div>
    </article>

    <div class="col-12 mobile-media-query d-flex justify-content-center align-items-center">
      <div class="col-12 col-md-4 card-container">
        <!-- <div class="details-card">
          <img v-if="challenge.difficulty === 1" src="../assets/img/easy-difficulty-chart.svg" :title="`Difficulty Rating: ${challenge.difficulty}`" alt="Easy Difficulty Icon" class="img-fluid" style="width: 70px; height: 50px;">
          <img v-if="challenge.difficulty === 2" src="../assets/img/medium-difficulty-chart.svg" :title="`Difficulty Rating: ${challenge.difficulty}`" alt="Medium Difficulty Icon" class="img-fluid" style="width: 70px; height: 50px;">
          <img v-if="challenge.difficulty === 3" src="../assets/img/hard-difficulty-chart.svg" :title="`Difficulty Rating: ${challenge.difficulty}`" alt="Hard Difficulty Icon" class="img-fluid" style="width: 70px; height: 50px;">
          <h3 class="text-capitalize mt-3"> {{ difficulty.text }} </h3>
          <h6 class="text-uppercase">Difficulty</h6>
        </div> -->
        <ChallengeDifficultyCard :challenge="challenge" />
      </div>
      <div class="col-12 col-md-4">
        <div class="details-card">
          <i class="mdi mdi-office-building-cog-outline fs-1"></i>
          <h3 class="text-capitalize"> {{ challenge.category }} </h3>
          <h6 class="text-uppercase">Category</h6>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="details-card text-uppercase">
          <i class="mdi mdi-account-star-outline fs-1"></i>
          <h3>4.5</h3>
          <h6>User Rating</h6>
        </div>
      </div>
    </div>
    <div class="d-flex mobile-flex-column justify-content-center align-items-center">
      <div class="col-12 col-md-4">
        <div class="details-card">
          <div v-if="isOwned || isModerator">
            <i class="mdi mdi-bell fs-1"></i>
            <h3> {{ challenge.completedCount }} / {{ challenge.participantCount }} </h3>
            <h6 class="text-uppercase">Completed<br> Participants</h6>
          </div>
          <div v-else>
            <i class="mdi mdi-diamond fs-1"></i>
            <h3> {{ challenge.difficulty }} </h3>
            <h6 class="text-uppercase">Points</h6>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-8 card-container">
        <div class="creator-details-card p-2">
          <div class="col-4 d-flex flex-column justify-content-evenly align-items-center">
            <router-link :to="{ name: 'Profile Overview', params: { profileId: challenge.creator.id } }">
              <img :src="challenge.creator.picture" :alt="`Image for Challenge creator named '${challenge.creator.name}' is broken`" :title="`Image of the Challenge Creator; ${challenge.creator.name}`" class="img-fluid rounded-circle me-2" style="height: 75px;width:75px">
            </router-link>
            <h6 class="text-uppercase pe-2">Challenge Creator</h6>
          </div>
          <div class="col-8 d-flex flex-column justify-content-evenly">
            <h3 :style="isMobile ? 'padding-left: 4rem;' : 'padding-left: 1.5rem;'" class="col-12 creator-text d-flex justify-content-center text-capitalize"> {{ challenge.creator.name }} </h3>
            <div class="col-12 button-container d-flex justify-content-center offset-2 mt-2">
              <button @click="giveReputation" class="btn bg-dark btn-success text-success me-3"><small>Give Reputation</small></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../AppState'
import { challengesService } from '../services/ChallengesService'
import { challengeModeratorsService } from '../services/ChallengeModeratorsService'
import Pop from '../utils/Pop'
import { StrDifficultyNum } from '../utils/StrDifficultyNum'
import { useRoute } from 'vue-router'
import ChallengeDifficultyCard from '../components/

export default {
  setup() {
    const route = useRoute()
    const isMobile = computed(() => window.innerWidth < 768)

    const isParticipant = computed(() => {
      const participant = AppState.participants.find(p => p.accountId == AppState.account.id)
      return participant
    })

    const gaveReputation = computed(() => {
      const challenge = AppState.activeChallenge
      if(challenge.reputationIds.find(r => r == AppState.account.id)){
        return true
      }
      return false
    })

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

      async function giveReputation(){
        try {
          await challengesService.giveReputation(route.params.challengeId)
        } catch (error) {
          Pop.error(error.message)
        }
      }

    return {
      createModeration,
      removeModeration,
      giveReputation,
      
      isMobile,
      isParticipant,
      gaveReputation,



      challenge: computed(() => AppState.activeChallenge),
      moderators: AppState.moderators.filter(m => m.status == 'Active'),
      isOwned: computed(() => {
        if (AppState.activeChallenge.creator.id === AppState.account.id) {
          return true
        }
      }),
      isModerator: computed(() => {
        if (AppState.moderators.find(m => m.accountId === AppState.account.id)) {
          return true
        }
      }),
      isPuzzle: computed(() => AppState.activeChallenge.category === CATEGORY_TYPES.PUZZLES),

      difficulty: computed(() => {
        const challenge = StrDifficultyNum(AppState.activeChallenge.difficulty)
        return challenge
      }),
    }
  }
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