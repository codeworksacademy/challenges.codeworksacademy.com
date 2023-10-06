<template>
  <section class="container-fluid position-relative top-10">
    <div class="row">
      <div class="col-12 d-flex justify-content-end position-absolute top-0 right-2 p-1">
        <a
          ref="challenge"
          id="challengeFormButton"
          type="button"
          role="button"
          data-bs-target="#submitChallengeForm"
          data-bs-toggle="modal"
          aria-label="Go to Active Challenge Modal"
          class="mdi mdi-plus-circle border-none fs-1"
          title="Create a new challenge"
        >
        </a>
      </div>
      
      <div class="col-12 mb-5" style="color: var(--text-primary);">
        <h1 class="text-center">Active Challenges</h1>
      </div>
      <div class="row">
        <div 
          v-for="(c, index) in challenges"
          :key="index"
          class="col-12 px-3 mb-1 position-relative"
        >
          <ChallengeCard :challenge="c" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import ChallengeCard from '../components/ChallengeCard.vue'
import { challengesService } from "../services/ChallengesService.js"

export default {

  components: {
    ChallengeCard,
  },

  setup() {

    async function getAllChallenges() {
      try {
        await challengesService.getAllChallenges()
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    onMounted(() => {
      getAllChallenges()
    })

    return {
      challenges: computed(() => AppState.challenges),
    }

  }
}
</script>

<style scoped lang="scss">

</style>