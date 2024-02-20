<template>
  <div class="container-fluid bg-detail p-3 rounded-3">
    <section class="row">
      <div class="col-12 pb-3">
        <h3 class="fs-2" style="color: #7A7A7A">Challenge Editor</h3>
      </div>

      <div class="col-12">
        <section class="text-light" v-if="challenge">
          <div>
            <EditChallengeDetails :challenge="challenge" />
            <hr>
            <EditChallengeDescription :challenge="challenge" />
            <hr>
            <EditChallengeRequirements :challenge="challenge" />
            <hr>
            <EditChallengeBadge :challenge="challenge" />
            <hr>
          </div>
          <div class="text-center my-3">
            <button class="btn btn-success" @click="updateChallenge"> Update Challenge</button>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>
  
<script>
import Pop from "../utils/Pop.js"
import { computed } from 'vue'
import { AppState } from '../AppState.js'
import { logger } from "../utils/Logger.js"
import { challengesService } from '../services/ChallengesService.js'
import EditChallengeDetails from '../components/EditChallenge/EditChallengeDetails.vue'
import EditChallengeRequirements from '../components/EditChallenge/EditChallengeRequirements.vue'
import EditChallengeDescription from '../components/EditChallenge/EditChallengeDescription.vue'
import EditChallengeBadge from '../components/EditChallenge/EditChallengeBadge.vue'

export default {
  components: {
    EditChallengeDetails,
    EditChallengeRequirements,
    EditChallengeDescription,
    EditChallengeBadge,
  },
  setup() {
    const challenge = computed(() => AppState.ChallengeState.challenge)


    async function updateChallenge() {
      try {
        const updatedChallenge = {
          ...AppState.ChallengeState.challenge,
        }
        updatedChallenge.badge = {
          ...AppState.ChallengeState.challenge.badge,
          primaryColor: AppState.ChallengeState.challenge.badge.primaryColor,
          secondaryColor: AppState.ChallengeState.challenge.badge.secondaryColor
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
  background-color: #1c2332;
  border: 1px solid #2d386b;
}
</style>