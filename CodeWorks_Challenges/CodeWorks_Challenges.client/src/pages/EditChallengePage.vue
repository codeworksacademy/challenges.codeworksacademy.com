<template>
  <section class="container-fluid">
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

export default {
  components: {
    SubmitChallengeForm,
  },
  setup() {

    async function updateChallenge() {
      try {
        await challengesService.updateChallenge(AppState.activeChallenge)
        Pop.toast('Challenge Updated')
      } catch (error) {
        Pop.toast(error.message, 'error')
      }
    }

    onMounted(() => {
      updateChallenge()
    })
    return {
      challenge: computed(() => AppState.activeChallenge),
    } 
  }
}
</script>

<style scoped lang="scss">

</style>