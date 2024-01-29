<template>
  <section class="container-fluid bg-detail rounded-3">
    <h4 class="ps-2 pt-3" style="color: #7A7A7A">User Links</h4>
    <aside id="challenge-menu" class="d-flex flex-column fs-4">
      <router-link :to="{ name: 'Challenge.overview' }" class="hover-green rounded-1 selectable text-white">
        <i class="mdi mdi-file-document-multiple text-green fst-normal p-3 ps-2"> Overview</i>
      </router-link>
      <router-link :to="{ name: 'Challenge.challengeSubmissionsPage' }"
        class="hover-orange rounded-1 selectable text-white">
        <i class="mdi mdi-eye-arrow-right text-orange fst-normal p-3 ps-2"> Submissions</i>
      </router-link>
      <router-link :to="{ name: 'Challenge.requirements' }" class="hover-purple rounded-1 selectable text-white">
        <i class="mdi mdi-file-document-check text-purple fst-normal p-3 ps-2"> Requirements</i>
      </router-link>
      <router-link :to="{ name: 'Challenge.statistics' }" class="hover-primary rounded-1 selectable text-white">
        <i class="mdi mdi-finance text-white fst-normal p-3 ps-2"> Statistics</i>
      </router-link>
      <hr>
      <div v-if="isOwned || isModerator" class="d-flex flex-column justify-content-center">
        <router-link :to="{ name: 'Challenge.gradeSubmissionsPage' }" class="hover-info rounded-1 selectable text-white">
          <i class="mdi mdi-progress-check text-info mt-1 fst-normal p-3 ps-2" style=""> Grade Users</i>
        </router-link>
        <router-link :to="{ name: 'Challenge.challengeEditor' }" class="hover-warning rounded-1 selectable text-white">
          <i class="mdi mdi-archive-edit text-yellow fst-normal p-3 ps-2" style=""> Edit Challenge</i>
        </router-link>
        <router-link :to="{ name: 'Challenge.challengeModeratorsPage' }"
          class="hover-danger rounded-1 selectable text-white">
          <i class="mdi mdi-archive-edit text-danger fst-normal p-3 ps-2" style="">Moderators</i>
        </router-link>

        <!-- <i @click="deprecateChallenge(challenge.id)" class="cancel-button mdi mdi-cancel text-danger selectable text-white" style="white-space: nowrap"> Deprecate Challenge</i> -->
      </div>
      <div v-else-if="!isParticipant">
        <permissions-flag permissions="join:challenge">
          <h4 @click="joinChallenge()" class="mdi mdi-account-multiple-plus selectable text-success"> Join Challenge</h4>
        </permissions-flag>
        <!-- <h4 @click="joinChallenge()" class="mdi mdi-account-multiple-plus selectable text-success"> Join Challenge</h4> -->
      </div>
      <div v-if="isParticipant" class="fw-semibold">
        <h4 v-if="isParticipant.status == 'completed'" class="text-success">Challenge Passed <span><i class="mdi mdi-check"></i></span></h4>
        <h4 v-if="isParticipant.status == 'incomplete'" class="text-warning">Challenge Incomplete <span><i class="mdi mdi-alert-box"></i></span></h4>
        <h4
          v-if="isParticipant.status == 'started' || isParticipant.status == 'incomplete'"
          id="challengeSubmissionButton"
          class="mdi mdi-send-check text-info selectable text-white" style="white-space: nowrap" ref="submission" role="button"
          data-bs-target="#challengeSubmissionForm" data-bs-toggle="modal" aria-label="Go to Active Challenge Modal"
          title="Create a new challenge">
          Submit for Review
        </h4>
          <h4 @click="leaveChallenge()" class="mdi mdi-cancel selectable text-danger"> Leave Challenge</h4>
      </div>
    </aside>
  </section>
</template>

<script>
import Pop from '../utils/Pop'
import { logger } from '../utils/Logger'
import { AppState } from '../AppState'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { SUBMISSION_TYPES } from '../constants'
import { challengesService } from '../services/ChallengesService'
import { participantsService } from '../services/ParticipantsService'
import  DevFlag  from './DevFlag.vue'
import  PermissionsFlag  from './PermissionsFlag.vue'

export default {
  setup() {
    const route = useRoute();
    const isParticipant = computed(() => {
      return AppState.ChallengeState.participants.find(p => p.accountId === AppState.user.id);
    });
    async function joinChallenge() {
      try {
        const newParticipant = {
          challengeId: route.params.challengeId,
          accountId: AppState.user.id,
          status: SUBMISSION_TYPES.STARTED,
          requirements: AppState.ChallengeState.challenge?.requirements,
        };
        await participantsService.joinChallenge(newParticipant);
        Pop.success("You have joined the challenge!");
      }
      catch (error) {
        logger.error(error);
        Pop.toast(error, "error");
      }
    }
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
        Pop.success(`${AppState.AccountState.account.name} submitted ${AppState.ChallengeState.challenge?.name} successfully. Click 'View Competitors' to verify your submission and see how you 'stack' up! 😉`);
      }
      catch (error) {
        logger.error(error);
        Pop.toast(error, "error");
      }
    }
    async function leaveChallenge() {
      try {
        const removeConfirm = await Pop.confirm("Are you sure you want to leave this challenge? Your points will not be refunded.");
        if (!removeConfirm) {
          return;
        }
        let participant = AppState.ChallengeState.participants.find(p => p.accountId == AppState.AccountState.account.id);
        participant.status = SUBMISSION_TYPES.LEFT;
        await participantsService.leaveChallenge(participant.id);
        Pop.success("You have left the challenge!");
      }
      catch (error) {
        logger.error(error);
        Pop.toast(error, "error");
      }
    }
    async function deprecateChallenge() {
      try {
        const confirmDeprecate = await Pop.confirm(`Are you sure you want to deprecate ${AppState.ChallengeState.challenge.name}?`);
        if (!confirmDeprecate) {
          return;
        }
        const challengeId = AppState.ChallengeState.challenge.id;
        await challengesService.deleteChallenge(challengeId);
        Pop.success("Challenge deprecated!");
        router.push({
          name: "Home"
        });
      }
      catch (error) {
        logger.error(error);
        Pop.toast(error, "error");
      }
    }
    return {
      isParticipant,
      joinChallenge,
      leaveChallenge,
      updateChallengeParticipant,
      deprecateChallenge,
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

.bg-detail{
    background-color: #1c2332;
    border: 1px solid #2d386b;
  }

section {
  height: 857px;
  white-space: nowrap;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  h4 {
    font-weight: semi-bold;
  }
  i.text-yellow {
    color: #ffc107;
  }
  &::-webkit-scrollbar {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  section {
    position: relative;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 92.5vw;
    height: 100%;
    padding-bottom: 20px;
    margin-bottom: 20px;
    aside#challenge-menu {
      white-space: normal !important;
    }
  }
}</style>