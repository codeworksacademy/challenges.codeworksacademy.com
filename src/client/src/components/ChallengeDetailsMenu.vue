<template>
  <div class="p-2 user-links-card rounded-3 d-flex flex-column">

    <p class="text-white-50 ms-1 mb-2"> User Links </p>

    <div class="rounded-2 selectable my-0 my-md-1">
      <router-link :to="{ name: 'Challenge.overview' }" class="btn d-flex align-items-center p-1 ps-3 px-lg-2">
        <i class="text-primary mx-1 fst-normal mdi mdi-file-document-multiple"></i>
        <span class="text-white mx-2">Overview</span>
      </router-link>
    </div>
    <div class="rounded-2 selectable my-0 my-md-1" v-if="challenge.requirements.length > 0">
      <router-link :to="{ name: 'Challenge.requirements' }" class="btn d-flex align-items-center p-1 ps-3 px-lg-2">
        <i class="text-primary mx-1 fst-normal mdi mdi-file-document-check"></i>
        <span class="text-white mx-2">Requirements</span>
      </router-link>
    </div>
    <div class="rounded-2 selectable my-0 my-md-1">
      <router-link :to="{ name: 'Challenge.statistics' }" class="btn d-flex align-items-center p-1 ps-3 px-lg-2">
        <i class="text-primary mx-1 fst-normal mdi mdi-finance text-green"></i>
        <span class="text-white mx-2">Statistics</span>
      </router-link>
    </div>

    <div class="sub-nav mt-2 d-flex flex-column" v-if="isOwned || isModerator">

      <p class="text-white-50 ms-1 mb-2"> Moderator Links </p>

      <div class="rounded-2 selectable my-0 my-md-1">
        <router-link :to="{ name: 'Challenge.challengeSubmissionsPage' }"
          class="btn d-flex align-items-center p-1 ps-3 px-lg-2">
          <i class="text-primary mx-1 fst-normal mdi mdi-eye-arrow-right text-green"></i>
          <span class="text-white mx-2">Submissions</span>
        </router-link>
      </div>
      <div class="rounded-2 selectable my-0 my-md-1">
        <router-link :to="{ name: 'Challenge.gradeSubmissionsPage' }"
          class="btn d-flex align-items-center p-1 ps-3 px-lg-2">
          <i class="text-primary mx-1 fst-normal mdi mdi-progress-check text-green"></i>
          <span class="text-white mx-2 d-flex justify-content-between align-items-center w-100">
            Grade Users
            <span v-if="needsGrading.length > 0" class="ms-3 text-danger notify">{{ needsGrading.length }}</span>
          </span>
        </router-link>
      </div>
      <div class="rounded-2 selectable my-0 my-md-1">
        <router-link :to="{ name: 'Challenge.challengeModeratorsPage' }"
          class="btn d-flex align-items-center p-1 ps-3 px-lg-2">
          <i class="text-primary mx-1 fst-normal mdi mdi-archive-edit text-green"></i>
          <span class="text-white mx-2">Moderators</span>
        </router-link>
      </div>
      <div class="rounded-2 selectable my-0 my-md-1">
        <router-link :to="{ name: 'Challenge.challengeEditor' }" class="btn d-flex align-items-center p-1 ps-3 px-lg-2">
          <i class="text-primary mx-1 fst-normal mdi mdi-archive-edit text-green"></i>
          <span class="text-white mx-2">Edit Challenge</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Pop from '../utils/Pop.js'
import { computed } from 'vue'
import { AppState } from '../AppState.js'
import { participantsService } from '../services/ParticipantsService.js'
import { SUBMISSION_TYPES } from '../constants'
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
      catch (error) { Pop.error('[CHALLENGE DETAILS MENU] updateChallengeParticipant:: ' + error); }
    }

    return {
      updateChallengeParticipant,
      challenge: computed(() => AppState.ChallengeState.challenge),
      needsGrading: computed(() => AppState.ChallengeState.participants.filter(p => p.status.toLowerCase() == 'submitted')),

      isOwned: computed(() => {
        return AppState.ChallengeState.challenge?.creatorId === AppState.user.id;
      }),
      isModerator: computed(() => {
        return AppState.ChallengeState.moderators.find(m => m.accountId === AppState.user.id);
      }),
    };
  },
  components: { DevFlag }
}
</script>

<style scoped lang="scss">
.router-link-exact-active {
  border-left: 2px solid #00CCE6;
  border-right: 2px solid #00CCE6;
  border-radius: .5rem;
}

.bg-detail {
  background-color: #1c2332;
  border: 1px solid #2d386b;
}

section {
  i.text-yellow {
    color: #ffc107;
  }
}

.user-links-card {
  background-color: #0E141E;
  border: 1px solid #2d386b;
}

.border-overline {
  border: 1px solid #0E141E;
  border-top: 1px solid #797A7A;
}

.notify {
  background-color: black;
  border-radius: 1rem;
  padding: 0 .25rem;
  align-items: center;
  // display: flex;
  text-align: center;
  height: 1.5rem;
  width: 2rem;
}
</style>