<template>
  <div class="container-fluid bg-detail p-3 rounded-3">
    <section class="row">
      <div class="col-12">
        <h3 class="fs-2" style="color: #7A7A7A">Challenge Editor</h3>
      </div>

      <div class="col-12">
        <section class="text-light" v-if="challenge">
          <div>
            <hr>
            <h4>Challenge Settings</h4>
            <EditChallengeDetails :challenge="challenge" />
            <hr>
            <h4>Challenge Description</h4>
            <EditChallengeDescription :challenge="challenge" />
            <hr>
            <h4>Challenge Requirements <i class="text-primary mdi mdi-format-list-numbered"></i></h4>
            <EditChallengeRequirements :challenge="challenge" />
            <hr>
            <h4>Challenge Badge</h4>
            <EditChallengeBadge :challenge="challenge" />
            <hr>
          </div>
          <div class="text-center my-3" v-if="challenge.creatorId == accountId">
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
import { challengesService } from '../services/ChallengesService.js'
import EditChallengeDetails from '../components/EditChallenge/EditChallengeDetails.vue'
import EditChallengeDescription from '../components/EditChallenge/EditChallengeDescription.vue'
import EditChallengeRequirements from '../components/EditChallenge/EditChallengeRequirements.vue'
import EditChallengeBadge from '../components/EditChallenge/EditChallengeBadge.vue'

export default {
  components: {
    EditChallengeDetails,
    EditChallengeDescription,
    EditChallengeRequirements,
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
        Pop.success("Challenge Updated");
        // router.push({
        //   name: 'Challenge.Overview',
        //   params: {
        //     challengeId: AppState.ChallengeState.challenge?.id
        //   }
        // })
      }
      catch (err) { Pop.error('[CHALLENGE EDITOR] updateChallenge', err); }
    }

    return {
      challenge,
      updateChallenge,
      accountId: computed(() => AppState.AccountState.account.id)
    }
  }
}
</script>

<style scoped lang="scss">
h4 {
  margin-bottom: 1rem;
}

.bg-detail {
  background-color: #1c2332;
  border: 1px solid #2d386b;
}
</style>