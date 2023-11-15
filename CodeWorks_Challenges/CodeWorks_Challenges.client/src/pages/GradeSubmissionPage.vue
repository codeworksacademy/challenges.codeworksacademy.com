<template>
  <section
    v-if="isModeratorStatus == 'approved' || challengeCreator"
    class="container-fluid"
  >
    <h1>Challenge Grading</h1>
    <h3>User Name</h3>
    <a href=""><p>Repo Link</p></a>
    <p>Submit Date</p>
    <form @submit.prevent="" v-if="challenge">
      <section class="" v-for="(step, index) in challenge.steps">
        <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" :id="step">
                  <label class="form-check-label" :for="step">
                    {{ step }}
              </label>
        </div>
      </section>
      <button class="btn btn-success mb-3">Update Grade</button>
  </form>
  </section>
</template>
  
<script>
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"  
import SubmissionCard from '../components/SubmissionCard.vue'
import { challengesService } from '../services/ChallengesService'
import { useRoute } from 'vue-router'

export default {
  components: {
    SubmissionCard
  },
  setup() {
    let route = useRoute()

    async function setActiveChallenge() {
      try {
        await challengesService.setActiveChallenge(route.params.challengeId)
        logger.log(route.params.challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    function isModeratorStatus() {
      const isMod = AppState.moderators.find(m => m.accountId == AppState.account.id)
      if (isMod) {
        if (isMod.status == false) {
          return 'pending'
        } else return 'approved'
      } else return 'null'
    }
    onMounted(() => {
      setActiveChallenge()
    })
    return {
      user: computed(() => AppState.user),
      challenge: computed(() => AppState.activeChallenge),
      challengeCreator: computed(() => AppState.user.id === AppState.activeChallenge?.creatorId),
      isModeratorStatus,
      isParticipant: computed(() => AppState.activeChallenge.participants.find(p => p.accountId == AppState.account.id)),

    } 
  }
}
</script>

<style scoped lang="scss">

</style>