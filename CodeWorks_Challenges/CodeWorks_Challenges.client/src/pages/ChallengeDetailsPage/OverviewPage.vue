<template>
  <section v-if="challenge" :key="challenge?.id" class="container-fluid text-light pb-5">
    <div class="col-12" :style="`background-image: url(${challenge.coverImg}); opacity: .9; background-repeat: no-repeat; background-size: cover; background-position:center; height:150px`">
    </div>

    <div class="d-flex justify-content-center align-items-center p-3" style="background: #161d2b">
      <!-- STUB - Space reserved for the offcanvas details links -->
      <div class="col-4 rounded-3" style="height:100vh;background: #0c0e13">
        <h4 class="px-3 pt-3" style="color: #7A7A7A">User Links</h4>
        <aside class="mt-5 pt-0 px-5">
            <h4
             @click="changeRoute(`/challenges/${challenge.id}/overview`)"
             class="mdi mdi-file-document-multiple selectable"> Overview</h4>
          <h4 class="mdi mdi-file-document-check selectable"> Requirements</h4>
          <h4 class="mdi mdi-finance selectable"> Statistics</h4>

          <hr>

          <div v-if="isParticipant">
            <h4
              id="challengeSubmissionButton"
              class="mdi mdi-send-check selectable"
              ref="submission"
              role="button"
              data-bs-target="#challengeSubmissionForm"
              data-bs-toggle="modal"
              aria-label="Go to Active Challenge Modal"
              title="Create a new challenge"
            > 
              Submit for Review
            </h4>
            <h4 @click="leaveChallenge()" class="mdi mdi-cancel selectable text-danger"> Leave Challenge</h4>
          </div>
          <div v-else>
            <h4 @click="joinChallenge()" class="mdi mdi-account-multiple-plus selectable text-success"> Join Challenge</h4>
          </div>
        </aside>
      </div>
      <!-- STUB - Space reserved for the challenge details -->
      <div class="col-8 px-5 pt-0" style="position:relative; top:-100px">
        <article>
          <div style="position: relative; left:-15px">
            <h3 class="text-uppercase" style="color: #7A7A7A">
              Challenge Description
            </h3>
            <p> {{ challenge.description }} </p>
            <hr>
          </div>
        </article>


        <section class="d-flex justify-content-center align-items-center px-3">
          <div class="col-4 card">
            <img src="../assets/img/chart-img.png" :alt="`Difficulty rating for ${challenge.name}`" :title="`The difficulty rating for '${challenge.name}''`" class="img-fluid mb-1 m-auto" style="height:110px;width:120px">
            <p class="text-uppercase" style="filter:brightness(.85);" v-html="difficulty.html"></p>
          </div>
          <div class="col-4 card">
            <i class="mdi mdi-office-building-cog-outline fs-1"></i>
            <h2 class="text-capitalize"> {{ challenge.category }} </h2>
            <h6 class="text-uppercase">Category</h6>
          </div>
          <div class="col-4 card text-uppercase">
            <i class="mdi mdi-account-star-outline fs-1"></i>
            <h2>4.5</h2>
            <p>Challenge Rating</p>
          </div>
        </section>

        <section class="d-flex justify-content-center align-items-center">
          <div class="col-4 card">
            <i class="mdi mdi-diamond fs-1"></i>
            <h2> {{ challenge.requirements.length }} </h2>
            <h6 class="text-uppercase">Points</h6>
          </div>
          <div class="col-8 card d-flex">
            <div class="col-12 d-flex align-items-center">
              <img :src="challenge.creator.picture" :alt="`Image for Challenge creator named '${challenge.creator.name}' is broken`" :title="`Image of the Challenge Creator; ${challenge.creator.name}`" class="img-fluid mx-3 rounded-circle" style="height: 75px;width:75px">
              <h2 class="text-capitalize"> {{ challenge.creator.name }} </h2>
            </div>
            <div class="col-12 d-flex justify-content-between align-items-center">
              <h6 class="text-uppercase ps-3 pt-4">Challenge Creator</h6>
              <button class="btn bg-dark btn-success text-success mt-3"><small>Give Reputation</small></button>
            </div>
          </div>
        </section>
      </div>
    </div>

  </section>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { CATEGORY_TYPES, SUBMISSION_TYPES } from "../../constants";
import { computed, onMounted } from 'vue'
import { AppState } from '../../AppState'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()

    const changeRoute = (route) => router.push(route);

    const isParticipant = computed(() => {
      const participant = AppState.participants.find(p => p.accountId == AppState.account.id)
      return participant
    })

    const gaveReputation = computed(() => {
      const challenge = AppState.activeChallenge
      if(challenge.reputationIds.find(r => r == AppState.account.id)){
        return true
      }
      return false
    })

    onMounted(() => {
      if (route.params.challengeId != challengeId) {
        challengeId = route.params.challengeId
        getParticipantsByChallengeId()
        getModeratorsByChallengeId()
        setActiveChallenge()
      }
    })

    async function setActiveChallenge() {
      try {
        const challengeId = route.params.challengeId
        await challengesService.setActiveChallenge(challengeId)
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
          status: 'submitted'
        }
        await participantsService.updateChallengeParticipant(participantId, newParticipant)
        Pop.success(`${AppState.account.name} submitted ${AppState.activeChallenge?.name} successfully. Click 'View Competitors' to verify your submission and see how you 'stack' up! 😉`)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    return {
      changeRoute,
      isParticipant,
      gaveReputation,
      updateChallengeParticipant,

      challenge: computed(() => AppState.activeChallenge),

      editChallenge() {
        logger.log("Pushing to", AppState.activeChallenge.id)
        router.push({
          path: `${AppState.activeChallenge.id}/edit`
        })
      },

      async joinChallenge() {
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
      },

      async leaveChallenge() {
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
      },
    }
  }
}
</script>