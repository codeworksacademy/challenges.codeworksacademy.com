<template>
  <section v-if="challenge" :key="challenge?.id" class="container-fluid">
    <SubmitChallengeForm :challenge="challenge" @submit="updateChallenge" />
    {{ challenge }}
  </section>
</template>
  
<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { challengesService } from "../services/ChallengesService.js"
import SubmitChallengeForm from '../components/SubmitChallengeForm.vue'
import { Modal } from "bootstrap"

export default {
  components: {
    SubmitChallengeForm,
  },
  setup() {

    async function setActiveChallenge() {
      try {
        await challengesService.setActiveChallenge(AppState.activeChallenge?.id)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function updateChallenge() {
      try {
        await challengesService.updateChallenge(AppState.activeChallenge)
        Pop.toast('Challenge Updated')
      } catch (error) {
        Pop.toast(error.message, 'error')
      }
    }

    onMounted(() => {
      setActiveChallenge()
    })
    return {
      updateChallenge,
      challenge: computed(() => AppState.activeChallenge),
    } 
  }
}
</script>

<style scoped lang="scss">

</style>