<template>
  <section class="container-fluid">
    <div class="row">
      <div class="col-12 d-flex justify-content-center align-items-center position-relative" style="bottom: -12em;">
        <ChallengeForm />
      </div>
      <div class="row">
        <ChallengeCard v-for="challenge in challenges" :key="challenge.id" :challenge="challenge" />
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