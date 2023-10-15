<template>
  <section class="container-fluid">
    <div v-if="challenge" :key="challenge?.id" class="container-fluid my-3 mt-5 pt-5">
      {{ challenge }}
    </div>
    <div v-if="!challenge">
      <h1>

      </h1>
  </div>
  </section>
</template>
  
<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { useRoute } from 'vue-router';
import { challengesService } from '../services/ChallengesService';

export default {
  components: {

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