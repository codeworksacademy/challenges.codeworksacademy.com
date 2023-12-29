<template>
  <section v-if="challenge" :key="challenge?.id" class="text-light pb-5">
    <div class="d-flex justify-content-center align-items-center  mt-5">
      <!-- STUB - Space reserved for the challenge details -->
      <div class="row px-5 pt-0 mt-5" >
        <article>
          <div style="">
            <h1>{{ challenge.name }}</h1>
            <h1 v-if="isParticipant?.status == 'completed'" class="text-success">Challenge Passed <span><i class="mdi mdi-check"></i></span></h1>
            <h1 v-if="isParticipant?.status == 'incomplete'" class="text-warning">Challenge Incomplete <span><i class="mdi mdi-alert-box"></i></span></h1>
            <h3 class="text-uppercase" style="color: #7A7A7A">
              Description
            </h3>
            <p> {{ challenge.description }} </p>
            <hr>
          </div>
        </article>


        <section class="d-flex justify-content-center align-items-center px-5">
          <div class="col-12 col-md-4 top-card">
            <img src="../../assets/img/chart-img.png" :alt="`Difficulty rating for ${challenge.name}`" :title="`The difficulty rating for '${challenge.name}'`" class="img-fluid my-1 m-auto" style="height:50px;width:70px">
            <h3 class="text-capitalize"> {{ difficulty }} </h3>
            <h6 class="text-uppercase">Difficulty</h6>
          </div>
          <div class="col-12 col-md-4 top-card">
            <i class="mdi mdi-office-building-cog-outline fs-1"></i>
            <h3 class="text-capitalize"> {{ challenge.category }} </h3>
            <h6 class="text-uppercase">Category</h6>
          </div>
          <div class="col-12 col-md-4 top-card text-uppercase">
            <i class="mdi mdi-account-star-outline fs-1"></i>
            <h3>4.5</h3>
            <h6>User Rating</h6>
          </div>
        </section>

        <section class="d-flex justify-content-center align-items-center px-4">
          <div class="col-12 col-md-4 bottom-left-card" style="width: 31%; margin-right: 2rem">
            <div v-if="isParticipant">
              <i class="mdi mdi-diamond fs-1"></i>
              <h3> {{ challenge.requirements.length }} </h3>
              <h6 class="text-uppercase">Points</h6>
            </div>
            <h6 class="text-uppercase">Points</h6>
          </div>
          <div class="col-8 card">
            <div class="col-12 d-flex align-items-center">
              <img :src="challenge.creator?.picture" :alt="`Image for Challenge creator named '${challenge.creator?.name}' is broken`" :title="`Image of the Challenge Creator; ${challenge.creator?.name}`" class="img-fluid mx-3 rounded-circle" style="height: 75px;width:75px">
              <h3 class="text-capitalize"> {{ challenge.creator?.name }} </h3>
            </div>
            <div class="col-12 d-flex justify-content-between align-items-center">
              <h6 class="text-uppercase pt-2">Challenge Creator</h6>
              <button class="btn bg-dark btn-success text-success mb-2"><small>Give Reputation</small></button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../../AppState'
import { challengesService } from '../../services/ChallengesService'
import { participantsService } from '../../services/ParticipantsService'
import { challengeModeratorsService } from '../../services/ChallengeModeratorsService'
import { SUBMISSION_TYPES } from '../../constants'
import Pop from "../../utils/Pop.js"
import { logger } from "../../utils/Logger.js"

export default {
  setup() {
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
      isParticipant,
      gaveReputation,
      challenge: computed(() => AppState.activeChallenge),
      moderators: AppState.moderators.filter(m => m.status == 'Active'),
      isModerator: computed(() => {
        if (AppState.moderators.find(m => m.accountId === AppState.account.id)) {
          return true
        }
      }),
      isPuzzle: computed(() => AppState.activeChallenge.category === CATEGORY_TYPES.PUZZLES),

      difficulty: computed(() => {
        const challenge = AppState.activeChallenge
        switch (challenge.difficulty) {
          case 1:
            return 'easy'
          case 2:
            return 'medium'
          case 3:
            return 'hard'
          case 4:
            return 'expert'
          case 5:
            return 'master'
          default:
            return 'not specified'
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.top-card {
  height: 25vh;
  margin: 1rem;
  padding:2rem;
  color: #f0f0f0;
  background:#1c2332;
  text-align: center;
}
.bottom-left-card {
  background:#1c2332;
  text-align: center;
}

.bottom-right-card {
  background:#1c2332;
  text-align: center;
}

@media screen and (max-width: 768px) {

}
</style>