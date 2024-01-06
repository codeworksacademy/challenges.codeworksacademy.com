<template>
  <div class="row mx-3">
    <div class="col-md-10 bg-detail rounded-3">
      <h3 class="my-3 mx-4" style="color: #7A7A7A">Edit Challenge Details</h3>
      <section class="container-fluid text-light" v-if="challenge">
        <div>
          <EditChallengeDetails :challenge="challenge" />
          <EditChallengeDescription :challenge="challenge" />
          <EditChallengeRequirements :challenge="challenge" />
        </div>
        <div class="text-center my-3">
          <button class="btn btn-success" @click="updateChallenge"> Update Challenge</button>
        </div>
      </section>
    </div>
  </div>
</template>
  
<script>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { challengesService } from '../services/ChallengesService'
import EditChallengeDetails from '../components/EditChallenge/EditChallengeDetails.vue'
import EditChallengeRequirements from '../components/EditChallenge/EditChallengeRequirements.vue'
import EditChallengeDescription from '../components/EditChallenge/EditChallengeDescription.vue'

export default {
  components: {
    EditChallengeDetails,
    EditChallengeRequirements,
    EditChallengeDescription
  },
  setup() {
    let router = useRouter()
    const challenge = computed(() => AppState.ChallengeState.challenge)


    async function updateChallenge() {
      try {
        const updatedChallenge = {
          ...AppState.ChallengeState.challenge
        }
        await challengesService.updateChallenge(updatedChallenge, updatedChallenge.id)
        Pop.success("Challenge Updated")
        // router.push({
        //   name: 'Challenge.Overview',
        //   params: {
        //     challengeId: AppState.ChallengeState.challenge?.id
        //   }
        // })
      } catch (e) {
        logger.log(e)
        Pop.error(e)
      }
    }


    return {
      challenge,
      updateChallenge
    }
  }
}
</script>
  
<style scoped lang="scss">
.bg-detail {
  background-color: #1c2332
}
</style>