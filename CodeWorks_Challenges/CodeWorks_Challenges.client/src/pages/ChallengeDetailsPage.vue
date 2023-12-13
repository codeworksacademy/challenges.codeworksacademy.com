<!-- NOTE - Use this bound style tag to set a background image on the challenge details page or any other section that needs a background image
  :style="`background-image: url(${challenge.coverImg}); opacity: .9; background-repeat: no-repeat; background-size: cover;`"
-->
<template>
  <section v-if="challenge" :key="challenge?.id" class="container-fluid text-light pb-5">
    <div class="col-12" :style="`background-image: url(${challenge.coverImg}); opacity: .9; background-repeat: no-repeat; background-size: cover; background-position:center; height:150px`">
    </div>

    <div class="d-flex justify-content-center align-items-center p-3" style="background: #161d2b">
      <!-- STUB - Space reserved for the offcanvas details links -->
      <div class="col-4 rounded-3" style="height:100vh;background: #0c0e13">
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
            <div v-if="isOwned" class="d-flex flex-column justify-content-center">
              <router-link :to="{ name: 'ChallengeEditor' }">
                <h4 class="mdi mdi-archive-edit text-warning selectable" style=""> Edit Challenge</h4>
              </router-link>
              <router-link :to="{ name: 'GradeSubmissionsPage' }">
                <h4 class="mdi mdi-eye-arrow-right text-info mt-1" style=""> View Submissions</h4>
              </router-link>
              <h4 @click="deprecateChallenge(challenge.id)" class="mdi mdi-cancel text-danger selectable" style="white-space: nowrap"> Deprecate Challenge</h4>
            </div>
            <div v-else-if="!isParticipant">
              <h4 @click="joinChallenge()" class="mdi mdi-account-multiple-plus selectable text-success"> Join Challenge</h4>
            </div>
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
              <h4 v-if="isParticipant.status === 'submitted'" class="mdi mdi-eye-arrow-right text-info"> Competitors</h4>
              <h4 @click="leaveChallenge()" class="mdi mdi-cancel selectable text-danger"> Leave Challenge</h4>
            </div>

        </aside>
      </div>
      <!-- STUB - Space reserved for the challenge details -->
      <div class="col-8 px-5 pt-0" style="position:relative; top:-100px">

        
        <article>
          <div style="position: relative; left:-15px">
            <router-view></router-view>
            
          </div>
        </article>

      </div>
    </div>

  </section>


<!-- <section class="row m-1">
          </div>
          <div class="col-12 d-flex justify-content-end" style="white-space: nowrap;">
            <button v-if="isModeratorStatus || isOwned" @click="changeRoute(`/moderators/${participant.id}/grade`)" class="btn btn-outline-info no-wrap mt-1" style="width: 175px;">
              View Submissions
            </button>
            <button v-if="isModeratorStatus == null || !isOwned" @click="changeRoute(`${challenge.id}/submissions`)" class="btn btn-outline-info no-wrap mt-1" style="width: 175px;">
              View Competitors
            </button>
          </div>
        </div>
    </section>

    <section class="row pt-3 text-uppercase fw-500">
      <div class="col-4">
        <div class="flash-card bg-dark m-1">
          <div class="col-12 d-flex justify-content-center align-items-center subtle-header my-1">
            <i class="mdi mdi-account fs-2"></i>
          </div>
          <div class="col-12 d-flex justify-content-center align-items-center my-1 fs-1">
            <span>4515</span>
          </div>
          <div class="col-12 d-flex justify-content-center align-items-center subheader my-1">
            <span>User Solves</span>
          </div>
        </div>
      </div>
    </section>

    <section class="row justify-content-center">
      <div v-for="(answer, index) in challenge.answers" :key="answer" class="col-md-8 bg-dark text-light p-3 mb-3">
        <i class="text-light">
          Answer {{ index + 1 }}:
        </i>
        <p>{{ answer.description }}</p>
        <p>{{ answer.answer }} Answer</p>
      </div>
      <div class="col-md-8">
        <div class="input-group input-group-sm mb-3">
          <span class="input-group-text">Answer</span>
          <input type="text" class="form-control" v-model="answer">
          <button class="btn btn-success" type="button" @click="answerChallenge()">Check</button>
        </div>
      </div>
    </section>

  </section> -->
</template>

<script>
import Pop from '../utils/Pop'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { computed, onMounted, ref } from 'vue'
import { SUBMISSION_TYPES } from '../constants';
import { useRoute, useRouter } from 'vue-router';
import { challengesService } from '../services/ChallengesService';
import { participantsService } from '../services/ParticipantsService';
import { challengeModeratorsService } from '../services/ChallengeModeratorsService';

export default {
  setup() {
    const loading = ref(false)
    const route = useRoute()
    const router = useRouter()
    const answer = ref('')
    let challengeId = ''

    async function setActiveChallenge() {
      try {
        const challengeId = route.params.challengeId
        await challengesService.setActiveChallenge(challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function getParticipantsByChallengeId() {
      try {
        await participantsService.getParticipantsByChallengeId(route.params.challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function getModeratorsByChallengeId() {
      try {
        await challengeModeratorsService.getModeratorsByChallengeId(route.params.challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function joinChallenge() {
      try {
        const newParticipant = {
          challengeId: route.params.challengeId,
          accountId: AppState.user.id,
          status: SUBMISSION_TYPES.STARTED,
          requirements: AppState.activeChallenge?.requirements,
          supportLinks: [
            { name: '', url: '' }
          ],
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

    async function answerChallenge(){
      try{
        await challengesService.submitAnswer(AppState.activeChallenge.id, answer.value)
        logger.log("Answer ", answer.value)
      } catch(error){
        Pop.error(error.message)
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

    onMounted(() => {
      if (route.params.challengeId != challengeId) {
        challengeId = route.params.challengeId
        getParticipantsByChallengeId()
        getModeratorsByChallengeId()
        setActiveChallenge()
      }
    })

    return {
      joinChallenge,
      leaveChallenge,
      updateChallengeParticipant,
      answerChallenge,
      deprecateChallenge,

      answer,
      loading,

      challenge: computed(() => AppState.activeChallenge),

      isOwned: computed(() => AppState.activeChallenge.creator.id === AppState.account.id),
      isMod: computed(() => {
        const isMod = AppState.moderators.find(m => m.accountId == AppState.account.id)
        if (isMod) {
          if (isMod.status == false) {
            return 'pending'
          } else return 'approved'
        } else return 'null'
      }),
      isParticipant: computed(() => {
        return AppState.participants.find(p => p.accountId === AppState.user.id)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.container-fluid {
  height: 100%;
  width: 100%;
  background-color: #000000bf;
}
</style>