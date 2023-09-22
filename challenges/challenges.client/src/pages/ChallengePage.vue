<template>
  <section class="container-fluid">
    <div class="row">
      <div class="d-flex justify-content-center align-items-center position-relative" style="top: 15em;">
        <ChallengeForm />
      </div>
      <div class="row">
        <div 
          v-for="(c, index) in challenges"
          :key="index"
          class="col-xl-3 col-md-4 col-sm-6 col-12 d-flex justify-content-center align-items-center p-3 position-relative mb-3"
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
import ChallengeForm from '../components/ChallengeForm.vue'

export default {

  components: {
    ChallengeCard,
    ChallengeForm
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