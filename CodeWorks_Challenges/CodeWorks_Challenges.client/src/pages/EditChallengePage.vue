<template>
  <section class="bg-dark">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center text-light">Edit Challenge</h1>
      </div>
    </div>
  </section>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { challengesService } from "../services/ChallengesService.js"
import { Modal } from "bootstrap"
import { useRouter } from 'vue-router';

export default {
  components: {
    
  },
  setup() {

    const router = useRouter()

    const editable = ref({
      // name: '',
      // description: '',
      // coverImg: '',
      // difficulty: '',
      supportLinks: [
        {
          name: '',
          url: ''
        }
      ],
      // pointValue: ''
    })


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
        const newChallenge = editable.value
        editable.value = { ...editable.value, ...AppState.activeChallenge }
        await challengesService.updateChallenge(newChallenge)
        router.push(
          { name: 'ChallengeDetails',
            params: {
              challengeId: AppState.activeChallenge?.id
            }
          })
        Pop.toast('Challenge Updated')
      } catch (error) {
        Pop.toast(error.message, 'error')
      }

    }

    onMounted(() => {
      setActiveChallenge()
    })
    return {
      editable,

      updateChallenge,
      challenge: computed(() => AppState.activeChallenge),
    } 
  }
}
</script>

<style scoped lang="scss">

</style>