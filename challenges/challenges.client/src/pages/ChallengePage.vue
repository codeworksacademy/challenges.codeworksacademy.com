<template>
  <section class="container-fluid">
    <div class="row">
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h1 class="text-light">
          Challenges Page
        </h1>
      </div>
      <div class="row">
        <ChallengeCard :challenge="c" v-for="c in challenges" :key="c.id" />
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
    ChallengeCard
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