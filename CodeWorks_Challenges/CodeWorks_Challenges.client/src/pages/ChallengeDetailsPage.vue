<!-- NOTE - Use this bound style tag to set a background image on the challenge details page or any other section that needs a background image
  :style="`background-image: url(${challenge.coverImg}); opacity: .9; background-repeat: no-repeat; background-size: cover;`"
-->
<template>
  <section
    v-if="challenge"
    :key="challenge?.id"
    class="container-fluid text-light pb-5"
  >
    <section class="row bg-dark text-uppercase fw-500 pt-4 pb-3 mb-5">
      <div class="col-1 fs-1 mt-3">
        <i class="mdi mdi-archive-lock-open-outline subtle-header"></i>
      </div>
      <div class="col-6 mt-3">
        <div class="col-12 d-flex flex-column">
          <span> {{ challenge.name }} </span>
          <div class="row mt-1">
            <div class="col-12 subtle-header">
              Easy
            </div>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="col-12 d-flex justify-content-center align-items-center">
          <img src="../assets/img/chart-img.png" alt="Temporary Static image of Challenge Difficulty" class="img-fluid" style="height: 75px; width: 120px;">
        </div>
        <div class="col-12 d-flex justify-content-center align-items-center">
          <p class="text-uppercase" style="filter:brightness(.85);" v-html="difficulty.html"></p>
        </div>
      </div>
      <div class="col-2 subtle-header">
        <div class="col-12 d-flex justify-content-center align-items-center mt-3 mb-1">
          <i class="mdi mdi-rhombus-split fs-3 text-primary"></i>
        </div>
        <div class="col-12 d-flex justify-content-center align-items-center mb-3">
          40 Points
        </div>
      </div>
    </section>

    <section class="row m-1">
        <div class="col-6">
          <h5>CHALLENGE DESCRIPTION</h5>
        </div>
        <div class="col-6">
          <div v-if="isOwned || isModeratorStatus" class="col-12 d-flex justify-content-end">
            <button @click="editChallenge()" class="btn btn-outline-info ms-1" style="width: 150px;">
              Edit Challenge
            </button>
          </div>
          <div v-else class="col-12 d-flex justify-content-end">
            <button @click="joinChallenge()" v-if="!isParticipant" class="btn btn-outline-primary" style="width: 150px; white-space: nowrap;">
              Join Challenge
            </button>
            <div v-else class="d-flex flex-column justify-content-end">
              <button @click="leaveChallenge()" class="btn btn-outline-danger" style="width: 150px;">
                Leave Challenge
              </button>
              <button v-if="isPuzzle" data-bs-toggle="modal" data-bs-target="#submitAnswerModal" class="btn btn-outline-success" style="width: 150px; white-space: nowrap;">
                Submit Puzzle
              </button>
            </div>
          </div>
          <div class="col-12 d-flex justify-content-end" style="white-space: nowrap;">
            <button v-if="isModeratorStatus || isOwned" @click="changeRoute(`${challenge.id}/grading`)" class="btn btn-outline-info no-wrap mt-1" style="width: 150px;">
              View Submissions
            </button>
            <button v-if="isModeratorStatus == null || !isOwned" @click="changeRoute(`${challenge.id}/submissions`)" class="btn btn-outline-info no-wrap mt-1" style="width: 150px;">
              View Competitors
            </button>
          </div>
        </div>
        <div class="col-12 pt-2 pb-4">
          <p> {{ challenge.description }} </p>
        </div>
    </section>

    <section class="row pt-3 text-uppercase fw-500">
      <div class="col-4">
        <div class="flash-card bg-dark m-1">
          <div class="col-12 d-flex justify-content-center align-items-center subtle-header my-1">
            <i class="mdi mdi-star-outline fs-2"></i>
          </div>
          <div class="col-12 d-flex justify-content-center align-items-center fs-1 my-1">
            <span>4.8</span>
          </div>
          <div class="col-12 d-flex justify-content-center align-items-center subheader my-1">
            <span>Challenge Rating</span>
          </div>
        </div>
      </div>
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
      <div class="col-4">
        <div class="flash-card bg-dark m-1">
          <div class="col-12 d-flex justify-content-center align-items-center subtle-header my-1">
            <i class="mdi mdi-shape fs-2"></i>
          </div>
          <div class="col-12 d-flex justify-content-center align-items-center text-capitalize my-1 fs-1">
            <span>Full Stack</span>
          </div>
          <div class="col-12 d-flex justify-content-center align-items-center subheader my-1">
            <span>Category</span>
          </div>
        </div>
      </div>
    </section>

    <section class="col-12 d-flex py-3 fw-500">
      <div class="col-4 ps-1 p-3 m-auto">
        <div class="time-card bg-dark d-flex flex-column justify-content-center align-items-center">
          <i class="mdi mdi-calendar-multiselect-outline fs-2"></i>
          <div class="col-12 d-flex justify-content-center align-items-center text-capitalize fs-2">
            <span>1252 Days</span>
          </div>
          <div class="col-12 d-flex justify-content-center align-items-center subheader text-uppercase m-1">
            <span>Released: {{ date }} </span>
          </div>
        </div>
      </div>
      <div class="col-8">
        <div class="creator-card ps-1 m-3 me-1 bg-dark text-uppercase m-1">
          <div class="d-flex align-items-center subtle-header">
            <img
              :src="challenge.creator.picture"
              :alt='`Image of ${challenge.creator.name}`'
              :title='`Name of Challenge Creator: "${challenge.creator.name}"`'
              class="img-fluid m-3 creator-card-img"
            />
              <div class="my-1 fw-600 fs-3">
                <span>{{ challenge.creator.name }}</span>
              </div>
            </div>
            <span class="ps-3 subheader">Challenge Creator</span>
          <div class="col-12 d-flex justify-content-between align-items-center mt-3 m-auto">
            <button class="btn bg-dark btn-success text-success ms-3"><small>Give Respect</small></button>
            <button v-if="isModeratorStatus == 'null'" class="btn btn-outline-primary me-3" @click="createModeration()">
              Request to become moderator
            </button>
            <button v-if="isModeratorStatus == 'pending'" class="btn btn-outline-primary">Request pending</button>
            <button v-if="isModeratorStatus == 'approved'" class="btn btn-outline-primary">You are a Moderator</button>
            <!-- Move this button and its functionality into the edit challenges -->
            <!-- <div v-else> 
              <ModSearchForm />
            </div> -->
          </div>
        </div>
      </div>
    </section>

    <section class="col-12 bg-img">
      <div v-if="isParticipant" class="d-flex justify-content-center align-items-end">
        <a
          ref="submission"
          id="challengeSubmissionButton"
          type="button"
          role="button"
          data-bs-target="#createSubmissionForm"
          data-bs-toggle="modal"
          aria-label="Go to Active Challenge Modal"
          class="mdi mdi-chevron-triple-right border-none fs-2 hover-orange shadow-none"
          title="Create a new challenge"
        >
          Submit Your Challenge For Grading?
        </a>
      </div>
      <!-- Participant data -->
      <section v-if="isParticipant" class="row text-light p-3 mb-3">
        <!-- v-if is here because participants can be created with out being assigned a status -->
        <div class="col-4" v-if="isParticipant.status">Status: <span class="">{{ isParticipant.status
        }}</span>
        </div>
        <div class="col-4" v-else>
          Participant is missing status
        </div>
        <div class="col-4">Progress: <span class="">-1/10 // 50% Etc</span> </div>
      </section>
    </section>

    <!-- Interactions with Challenge -->

    <section class="card bg-dark p-3 m-1 ms-0">
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h3 class="text-center text-uppercase">Challenge Requirements</h3>
      </div>
        <ol class="col-12 justify-content-center align-items-center">
          <li v-for="(requirement, index) in challenge.requirements" :key="index" class="py-2">
            <span>{{ requirement }}</span>
          </li>
        </ol>
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

  </section>
</template>

<script>
import Pop from "../utils/Pop.js"
import { AppState } from '../AppState'
import { logger } from "../utils/Logger.js"
import { DateTime } from '../utils/DateTime.js';
import { useRoute, useRouter } from 'vue-router';
import { CATEGORY_TYPES, SUBMISSION_TYPES } from "../constants/index.js";
import { StrDifficultyNum } from '../utils/StrDifficultyNum.js';
import { challengesService } from '../services/ChallengesService';
import { computed, onMounted, ref } from 'vue'
import { participantsService } from "../services/ParticipantsService.js";
import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js";

export default {
  components: {
  },
  setup() {
    const loading = ref(false)
    const route = useRoute()
    const router = useRouter()
    const answer = ref('')
    let challengeId = ''

    function changeRoute(route){
      router.push({
        path: `${route}`
      })
    }

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

    async function answerChallenge(){
      try{
        await challengesService.submitAnswer(AppState.activeChallenge.id, answer.value)
        logger.log("Answer ", answer.value)
      } catch(error){
        Pop.error(error.message)
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
      changeRoute,
      answerChallenge,
      updateChallengeParticipant,

      answer,
      loading,
      isParticipant,
      gaveReputation,

      user: computed(() => AppState.user),
      rewards: computed(() => AppState.rewards),
      participants: computed(() => AppState.participants),
      challenge: computed(() => AppState.activeChallenge),
      date: computed(() => DateTime(AppState.activeChallenge.createdAt)),
      moderators: computed(() => AppState.moderators.filter(m => m.status == 'Active')),
      difficulty: computed(() => StrDifficultyNum(AppState.activeChallenge.difficulty)),
      isOwned: computed(() => AppState.activeChallenge.creator.id === AppState.account.id),
      isPuzzle: computed(() => AppState.activeChallenge.category === CATEGORY_TYPES.PUZZLES),

      isModeratorStatus: computed(() => {
        const isMod = AppState.moderators.find(m => m.accountId == AppState.account.id || m.originId == AppState.account.id)
        if (isMod) {
          return isMod.status == 'approved'
        } else return false
      }),

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

      async createModeration() {
        try {
          const moderatorData = {
            challengeId: route.params.challengeId,
            accountId: AppState.user.id
          } 
          await challengeModeratorsService.createModeration(moderatorData)
          Pop.success('You have requested to become a moderator for this challenge, please be patient while the owner of this challenge reviews your request')
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },

      async removeModeration(moderationId) {
        try {
          const confirmRemove = await Pop.confirm('Delete Moderation?')
          if (!confirmRemove) {
            return
          }
          await challengeModeratorsService.removeModeration(moderationId)
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },

      async giveReputation(){
        try {
          await challengesService.giveReputation(route.params.challengeId)
        } catch (error) {
          Pop.error(error.message)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container-fluid {
  min-height: 100vh;
  min-width: 100%;
  background-color: #000000bf;
}
.flash-card {
  height: 25vh;
  object-fit: cover;
  object-position: center;
  border-radius: .5rem;
  padding: 1rem;
  margin: 1rem;
  box-shadow: 0 0 10px #00000080;
}
.time-card {
  height: 23vh;
  border-radius: .5rem;
}
.creator-card {
  height: 23vh;
  border-radius: .5rem;
  img {
    height: 50px;
    width: 50px;
    object-fit: cover;
    object-position: center;
    border-radius: .5rem;
  }
}
.bg-img {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  .text-box {
    background-color: rgba(0, 0, 0, .75);
    padding: 3rem;
    .header {
      background: linear-gradient(rgba(0, 0, 0, .75), rgba(0, 0, 0, .5));
      padding: 1rem;
      font-size: 2rem;
      font-weight: bold;
      margin: 0 auto;
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
    }
    .body {
      background: linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0));
      padding: 1rem;
    }
    .footer {
      background: linear-gradient(rgba(0, 0, 0), rgba(0, 0, 0, .75));
      padding: 1rem;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }
  }
}
.moderator {
  height: 32px;
  width: 32px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}
</style>