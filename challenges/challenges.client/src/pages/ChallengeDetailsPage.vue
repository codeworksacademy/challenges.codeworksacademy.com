<template>
  <section class="container-fluid">
    <div v-if="challenge" :key="challenge?.id" class="row">
      {{ challenge }}
    </div>
  </section>
</template>
  
<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { challengesService } from "../services/ChallengesService.js"
import { Challenge } from '../models/Challenge.js'
import { useRoute } from 'vue-router'

export default {
  // props: {
  //   challenge: {
  //     type: Challenge || Object,
  //     required: true
  //   }
  // },
  components: {

  },
  setup() {

    const route = useRoute()

    async function setActiveChallenge() {
      try {
        const challengeId = route.params.id
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