<template>
  <div class="">
    <div class="bg-menu rounded-3 mx-3">
      <h3 class="pt-2 px-4" style="color: #7A7A7A">Challenge Editor</h3>
      <section class="container-fluid text-light" v-if="challenge">
        <div>
          <EditChallengeDetails :challenge="challenge" />
          <EditChallengeDescription :challenge="challenge" />
          <EditChallengeRequirements :challenge="challenge" />
          <EditChallengeBadge :challenge="challenge" />
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
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { challengesService } from '../services/ChallengesService'
import EditChallengeDetails from '../components/EditChallenge/EditChallengeDetails.vue'
import EditChallengeRequirements from '../components/EditChallenge/EditChallengeRequirements.vue'
import EditChallengeDescription from '../components/EditChallenge/EditChallengeDescription.vue'
import EditChallengeBadge from '../components/EditChallenge/EditChallengeBadge.vue'
import MarkdownEditor from '../components/EditChallenge/MarkdownEditor.vue'

export default {
  components: {
    EditChallengeDetails,
    EditChallengeRequirements,
    EditChallengeDescription,
    EditChallengeBadge,
    MarkdownEditor
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
.bg-menu {
  background-color: #1c2332;
  border: 1px solid #2d386b;
}
</style>