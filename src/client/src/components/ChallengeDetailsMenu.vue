<template>
  <section class="bg-detail rounded-3">
    <aside id="challenge-menu">
      <div class="sub-nav d-flex flex-column">
        <p class="badge mb-0 pt-2 text-start">User Links</p>
        <router-link :to="{ name: 'Challenge.overview' }" class="selectable my-2">
          <i class="mdi mdi-file-document-multiple fst-normal p-3"> Overview</i>
        </router-link>
        <router-link :to="{ name: 'Challenge.requirements' }" class="selectable my-2">
          <i class="mdi mdi-file-document-check fst-normal p-3"> Requirements</i>
        </router-link>
        <router-link :to="{ name: 'Challenge.statistics' }" class="selectable my-2">
          <i class="mdi mdi-finance fst-normal p-3"> Statistics</i>
        </router-link>
      </div>

      <div class="sub-nav d-flex flex-column" v-if="isOwned || isModerator">
        <p class="badge mb-0 pt-2 text-start">Moderator Links</p>
        <router-link :to="{ name: 'Challenge.challengeSubmissionsPage' }" class="selectable my-2">
          <i class="mdi mdi-eye-arrow-right text-orange fst-normal p-3"> Submissions</i>
        </router-link>
        <router-link :to="{ name: 'Challenge.gradeSubmissionsPage' }" class="selectable my-2">
          <i class="mdi mdi-progress-check text-info mt-1 fst-normal p-3"> Grade Users</i>
        </router-link>
        <router-link :to="{ name: 'Challenge.challengeEditor' }" class="selectable my-2">
          <i class="mdi mdi-archive-edit text-yellow fst-normal p-3"> Edit Challenge</i>
        </router-link>
        <router-link :to="{ name: 'Challenge.challengeModeratorsPage' }" class="selectable my-2">
          <i class="mdi mdi-archive-edit text-danger fst-normal p-3">Moderators</i>
        </router-link>
      </div>

    </aside>
  </section>
</template>

<script>
import Pop from '../utils/Pop.js'
import { computed } from 'vue'
import { AppState } from '../AppState.js'
import { logger } from '../utils/Logger.js'
import { SUBMISSION_TYPES } from '../constants'
import { participantsService } from '../services/ParticipantsService.js'
import PermissionsFlag from './PermissionsFlag.vue'
import DevFlag from './DevFlag.vue'

export default {
  setup() {

    async function updateChallengeParticipant() {
      try {
        const confirmComplete = await Pop.confirm("Are you sure you want to complete this challenge?");
        if (!confirmComplete) {
          return;
        }
        const participantId = isParticipant.value.id;
        const newParticipant = {
          status: SUBMISSION_TYPES.SUBMITTED
        };
        await participantsService.updateChallengeParticipant(participantId, newParticipant);
        Pop.success(`${AppState.AccountState.account.nickname || account.name} submitted ${AppState.ChallengeState.challenge?.name} successfully. Click 'View Competitors' to verify your submission and see how you 'stack' up! 😉`);
      }
      catch (error) {
        logger.error(error);
        Pop.toast(error, "error");
      }
    }
    return {
      updateChallengeParticipant,
      challenge: computed(() => AppState.ChallengeState.challenge),
      isOwned: computed(() => {
        return AppState.ChallengeState.challenge?.creatorId === AppState.user.id;
      }),
      isModerator: computed(() => {
        return AppState.ChallengeState.moderators.find(m => m.accountId === AppState.user.id);
      }),
    };
  },
  components: { DevFlag, PermissionsFlag }
}
</script>

<style scoped lang="scss">
.bg-detail {
  background-color: #1c2332;
  border: 1px solid #2d386b;
}

section {
  i.text-yellow {
    color: #ffc107;
  }
}
</style>