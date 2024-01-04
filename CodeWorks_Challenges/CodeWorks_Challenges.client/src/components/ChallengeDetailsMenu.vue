<template>
  <section class="container-fluid">
    <h4 class="px-3 pt-3" style="color: #7A7A7A">User Links</h4>
    <aside class="mt-5 pt-0 px-5">
      <router-link :to="{ name: 'Overview' }">
        <h4 class="mdi mdi-file-document-multiple text-light selectable"> Overview</h4>
      </router-link>
      <router-link :to="{ name: 'Requirements' }">
        <h4 class="mdi mdi-file-document-check text-light selectable"> Requirements</h4>
      </router-link>
      <router-link :to="{ name: 'Statistics' }">
        <h4 class="mdi mdi-finance text-light selectable"> Statistics</h4>
      </router-link>

      <hr>

      <div v-if="isOwned || isModerator" class="d-flex flex-column justify-content-center">
        <router-link :to="{ name: 'GradeSubmissionsPage' }">
          <h4 class="mdi mdi-progress-check text-info mt-1" style=""> Grade Users</h4>
        </router-link>
        <router-link :to="{ name: 'ChallengeEditor' }">
          <h4 class="mdi mdi-archive-edit text-warning selectable" style=""> Edit Challenge</h4>
        </router-link>
        <h4 @click="deprecateChallenge(challenge.id)" class="cancel-button mdi mdi-cancel text-danger selectable" style="white-space: nowrap"> Deprecate Challenge</h4>
      </div>
      <div v-else-if="!isParticipant">
        <h4 @click="joinChallenge()" class="mdi mdi-account-multiple-plus selectable text-success"> Join Challenge</h4>
      </div>
      <h4 v-if="isParticipant?.status == 'completed'" class="text-success">Challenge Passed <span><i class="mdi mdi-check"></i></span></h4>
      <h4 v-if="isParticipant?.status == 'incomplete'" class="text-warning">Challenge Incomplete <span><i class="mdi mdi-alert-box"></i></span></h4>
      <div v-else-if="isParticipant">
        <h4
          v-if="isParticipant.status === 'started'"
          id="challengeSubmissionButton"
          class="mdi mdi-send-check text-info selectable"
          style="white-space: nowrap"
          ref="submission"
          role="button"
          data-bs-target="#challengeSubmissionForm"
          data-bs-toggle="modal"
          aria-label="Go to Active Challenge Modal"
          title="Create a new challenge"
        > 
          Submit for Review
        </h4>
        <router-link v-if="isParticipant.status === 'submitted'" :to="{ name: 'ChallengeSubmissionsPage' }">
          <h4 v-if="isParticipant.status === 'submitted'" class="mdi mdi-eye-arrow-right selectable text-info"> Competitors</h4>
        </router-link>
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

export default {
  setup() {
    const route = useRoute()

    const isParticipant = computed(() => {
      return AppState.participants.find(p => p.accountId === AppState.user.id)
    })

    async function joinChallenge() {
      try {
        const newParticipant = {
          challengeId: route.params.challengeId,
          accountId: AppState.user.id,
          status: SUBMISSION_TYPES.STARTED,
          requirements: AppState.activeChallenge?.requirements,

        }
        await participantsService.joinChallenge(newParticipant)
        Pop.success('joined challenge!')
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function updateChallengeParticipant() {
      try {
        const confirmComplete = await Pop.confirm('Are you sure you want to complete this challenge?')
        if (!confirmComplete) {
          return
        }
        const participantId = isParticipant.value.id
        const newParticipant = {
          status: SUBMISSION_TYPES.SUBMITTED
        }
        await participantsService.updateChallengeParticipant(participantId, newParticipant)
        Pop.success(`${AppState.account.name} submitted ${AppState.activeChallenge?.name} successfully. Click 'View Competitors' to verify your submission and see how you 'stack' up! 😉`)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function leaveChallenge() {
      try {
        const removeConfirm = await Pop.confirm('Are you sure you want to leave this challenge? Your points will not be refunded.')
        if (!removeConfirm) {
          return
        }
        let participant = AppState.participants.find(p => p.accountId == AppState.account.id)
        participant.status = SUBMISSION_TYPES.LEFT
        await participantsService.leaveChallenge(participant.id)
        Pop.success('left challenge!')
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function deprecateChallenge() {
      try {
        const confirmDeprecate = await Pop.confirm(`Are you sure you want to deprecate ${AppState.activeChallenge.name}?`)
        if (!confirmDeprecate) {
          return
        }
        const challengeId = AppState.activeChallenge.id
        await challengesService.deleteChallenge(challengeId)
        Pop.success('Challenge deprecated!')
        router.push({
          name: 'Home'
        })
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    return {
      isParticipant,
      joinChallenge,
      leaveChallenge,
      updateChallengeParticipant,
      deprecateChallenge,
      challenge: computed(() => AppState.activeChallenge),
      isOwned: computed(() => {
        return AppState.activeChallenge?.creatorId === AppState.user.id
      }),
      isModerator: computed(() => {
        return AppState.moderators.find(m => m.accountId === AppState.user.id)
      }),
    }
  }
}
</script>

<style scoped lang="scss">

@media screen and (max-width: 768px) {
  .cancel-button {
    white-space: normal !important;
  }
}
</style>