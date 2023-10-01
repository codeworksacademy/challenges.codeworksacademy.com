<template>
  <section class="container-fluid my-3">
    <div class="d-flex justify-content-center align-items-center">
      <div v-if="challenge" :key="challenge?.id" class="row">
        <div class="col-12">
          <div class="card bg-dark text-light text-center p-3">
            <h1 class="text-center">Challenge Name: {{ challenge.name }}</h1>
            <img :src="challenge.coverImg" class="img-fluid mt-3 mb-5" alt="challenge picture" style="background-size: cover; background-position: center;">
            <div class="mb-3">
              <h4>Difficulty: {{ challenge.difficulty }}</h4>
              <h4>Point Value: {{ challenge.pointValue }}</h4>
            </div>
            <div class="card-body">
              <p>Description: {{ challenge.description }}</p>

              <ChallengeStepsForm :steps="challenge.steps" />

              <p>Created On: {{ Date(challenge.createdAt) }}</p>
              <p>Last Updated: {{ Date(challenge.updatedAt) }}</p>
            </div>
            <div class="py-5 text-secondary">
              <p>
                Created By: <small>{{ challenge.creator.name }}</small>
              </p>
              <p>
                Member since: <small>{{ Date(challenge.creator.createdAt) }}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
<script>
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { challengesService } from "../services/ChallengesService.js"
import { Challenge } from '../models/Challenge.js'
import ChallengeStepsForm from '../components/ChallengeStepsForm.vue'

export default {
  // props: {
  //   challenge: {
  //     type: Challenge || Object,
  //     required: true
  //   }
  // },
  components: {
    ChallengeStepsForm
  },
  setup() {

    const route = useRoute()

    async function setActiveChallenge() {
      try {
        const challengeId = route.params.challengeId
        await challengesService.setActiveChallenge(challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    onMounted(() => {
      setActiveChallenge()
    })

    return {

      challenge: computed(() => AppState.activeChallenge),

    } 
  }
}
</script>

<style scoped lang="scss">

</style>