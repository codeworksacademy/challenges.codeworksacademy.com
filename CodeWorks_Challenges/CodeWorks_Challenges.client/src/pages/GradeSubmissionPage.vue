<template>
  <section
    v-if="isModeratorStatus == 'approved' || challengeCreator"
    class="container-fluid"
  >
</section>
<h1>Challenge Grading</h1>
<SubmissionCard/>
</template>
  
<script>
import { computed, onMounted, ref } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"  
import SubmissionCard from '../components/SubmissionCard.vue'

export default {
  components: {
    SubmissionCard
  },
  setup() {

    function setActiveChallenge() {
      AppState.activeChallenge = AppState.challenges.find(c => c.id == AppState.activeChallenge.id)
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