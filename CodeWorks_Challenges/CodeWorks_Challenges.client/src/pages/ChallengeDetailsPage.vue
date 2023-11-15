<!-- NOTE - Use this bound style tag to set a background image on the challenge details page or any other section that needs a background image
  :style="`background-image: url(${challenge.coverImg}); opacity: .9; background-repeat: no-repeat; background-size: cover;`"
-->

<template>
  <section
    v-if="challenge"
    :key="challenge?.id"
    class="container-fluid text-light pb-5"
  >
    <div v-if="user.id === challenge?.creatorId">
      <!-- <router-view /> -->
    </div>
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
          <section v-if="!isOwned" class="row text-light">
            <div class="col-7 d-flex justify-content-end">
              <button data-bs-toggle="modal" data-bs-target="#submitAnswerModal" class="btn btn-outline-success"
                v-if="isParticipant">
                Submit For Review
              </button>
            </div>
            <div class="col-5 d-flex justify-content-end pe-1">
              <button class="btn btn-outline-primary" @click="joinChallenge()" v-if="!isParticipant">
                Join Challenge
              </button>
        
              <button class="btn btn-outline-danger" @click="leaveChallenge()" v-if="isParticipant">
                Leave Challenge
              </button>
            </div>
          </section>
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
          <div class="col-12 d-flex justify-content-center align-items-center text-capitalize my-1 fs-2">
            <span>Full Stack</span>
          </div>
          <div class="col-12 d-flex justify-content-center align-items-center subheader my-1">
            <span>Category</span>
          </div>
        </div>
      </div>
    </section>

    <section class="row pt-3 fw-500">
      <div class="col-4">
        <div class="flash-card bg-dark m-1">
          <div class="col-12 d-flex justify-content-center align-items-center subtle-header my-1">
            <i class="mdi mdi-calendar-multiselect-outline fs-2"></i>
          </div>
          <div class="col-12 d-flex justify-content-center align-items-center text-capitalize fs-2">
            <span>1252 Days</span>
          </div>
          <div class="col-12 d-flex justify-content-center align-items-center subheader text-uppercase my-1">
            <span>Released: {{ date }} </span>
          </div>
        </div>
      </div>
      <div class="col-8">
        <div class="flash-card bg-dark text-uppercase m-1">
          <div class="d-flex align-items-center subtle-header">
            <img
              :src="challenge.creator.picture"
              :alt='`Image of ${challenge.creator.name}`'
              :title='`Name of Challenge Creator: "${challenge.creator.name}"`'
              class="img-fluid m-3"
            />
              <div class="my-1 fw-600 fs-3">
                <span>{{ challenge.creator.name }}</span>
              </div>
            </div>
          <div class="d-flex col-12 justify-content-between align-items-center m-3">
            <div class="col-5">
              <span class="subheader me-3 mt-5">Challenge Creator</span>
              <button class="btn bg-dark btn-success text-success" style="width: 150px; height: 35px; line-height: 0;"><small>Give Respect</small></button>
            </div>
            <div class="me-4">
                <button v-if="isModeratorStatus == 'null'" class="btn btn-outline-primary me-auto" style="width: 250px; height: 35px; line-height: 0;" @click="createModeration()">
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
      </div>
    </section>

    <section class="row bg-img d-flex justify-content-center align-items-center">
      <div v-if="isParticipant" class="col-6 d-flex justify-content-center align-items-end">
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
      
      <!-- Particiapnt data -->
      <section v-if="isParticipant" class="row text-light p-3 mb-1">
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

    <section>
      <div class="text-box">
        <div class="header flex-grow-1 d-flex justify-content-between">
          <h1 v-if="isOwned || isModeratorStatus == 'approved'" @click="editChallenge()" class="btn btn-outline-info">Edit
            Challenge</h1>

        </div>
      </div>
    </section>

    <section class="row justify-content-center">
      <div class="col-md-8 bg-dark text-light p-3 mb-3">
          
      </div>
      <div class="col-md-8 bg-dark text-light p-3 mb-3">
          <p>{{ challenge.pointValue }} Points</p>
      </div>
      <div class="col-md-8 bg-dark text-light p-3 mb-3">
          <p>{{ challenge.moderators }} Moderators</p>
          <p>{{ participants.length }} Participants</p>
      </div>
      <div class="col-md-8 bg-dark text-light p-3 mb-3">
        <p v-html="difficulty.html"></p>
      </div>  
      <!-- <div class="col-md-8 bg-dark text-light p-3 mb-3">
      </div> -->
      <div class="col-md-8  bg-dark text-light p-3 mb-3">
        <p>Created by {{ challenge.creator.name }} <img :src="challenge.creator.picture" alt="" class="img-fluid h-25"></p>
      </div>
      <div class="col-md-8 bg-dark text-light p-3 mb-3">
        <i>Description:</i>
        <p>
          {{ challenge.description }}
        </p>
      </div>
      <div v-if="challenge.supportLinks.length > 0" class="col-md-8 bg-dark text-light p-3 mb-3">
        <div v-for="(link, index) in challenge.supportLinks" :key="link">
          <i class="text-light">
            Support Link {{ index + 1 }}:
          </i>
          <p>
            <a :href="link.url" :title="`Project Links: ${challenge.supportLinks}`" class="fw-bold hover-text-primary">
              {{ link.name }}
            </a>
          </p>
        </div>
      </div>
      <div v-for="(step, index) in challenge.steps" :key="step" class="col-md-8 bg-dark text-light p-3 mb-3">
        <i class="text-light">
          Step {{ index + 1 }}:
        </i>
        <p>
          {{ step }}
        </p>
      </div>
      <div v-for="(answer, index) in challenge.answers" :key="answer" class="col-md-8 bg-dark text-light p-3 mb-3">
        <i class="text-light">
          Answer {{ index + 1 }}:
        </i>
        <p>{{ answer.description }}</p>
        <p>
          {{ answer.answer }} Answer
        </p>
      </div>
      <div class="col-md-8">
        <div class="input-group input-group-sm mb-3">
          <span class="input-group-text">Answer</span>
          <input type="text" class="form-control" v-model="answer">
          <button class="btn btn-success" type="button" @click="answerChallenge()">Check</button>
        </div>
      </div>
    </section>
    <!-- Description and Steps -->
    <!-- <section class="row">
      <div class="col-md-8 bg-dark text-light p-3 mb-3">
        <i>Description:</i>
        <p>
          {{ challenge.description }}
        </p>
      </div>
      <div v-if="challenge.supportLinks.length > 0" class="col-md-8 bg-dark text-light p-3 mb-3">
        <div v-for="(link, index) in challenge.supportLinks" :key="link">
          <i class="text-light">
            Support Link {{ index + 1 }}:
          </i>
          <p>
            <a :href="link.url" :title="`Project Links: ${challenge.supportLinks}`" class="fw-bold hover-text-primary">
              {{ link.name }}
            </a>
          </p>
        </div>
      </div>
      <div v-for="(step, index) in challenge.steps" :key="step" class="col-md-8 bg-dark text-light p-3 mb-3">
        <i class="text-light">
          Step {{ index + 1 }}:
        </i>
        <p>
          {{ step }}
        </p>
      </div>
    </section> -->

    <!-- This was commented out, I was rendering the edit Challenges two additional times. Left in for verification before delete -->
    <!-- <div v-if="user.id === challenge?.creatorId">
      <router-view />
    </div>
    <router-view /> -->
  </section>
</template>

<script>
import { computed, onMounted, watchEffect, ref, popScopeId } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { DateTime } from '../utils/DateTime.js';
import { StrDifficultyNum } from '../utils/StrDifficultyNum.js';
import { useRoute, useRouter } from 'vue-router';
import { challengesService } from '../services/ChallengesService';
import { participantsService } from "../services/ParticipantsService.js";
import { moderatorsService } from "../services/ModeratorsService.js";
import RewardCard from '../components/Rewards/RewardCard.vue'
import Completionist from '../components/Rewards/Badges/Completionist.vue'
import EarlyBird from '../components/Rewards/Badges/EarlyBird.vue'
import Architect from '../components/Rewards/Badges/Architect.vue'
import ChallengeSlayer from '../components/Rewards/Badges/ChallengeSlayer.vue'
import Collaborator from '../components/Rewards/Badges/Collaborator.vue'
import LesserBadges from '../components/Rewards/Badges/LesserBadges.vue'
import CustomBadge from '../components/Rewards/Badges/CustomBadge.vue'
import ModSearchForm from '../components/ModSearchForm.vue'
import AnswerForm from '../components/AnswerForm.vue';
import { answersService } from '../services/AnswersService';

export default {
  components: {
  },
  setup() {
    const loading = ref(false)
    const route = useRoute()
    const router = useRouter()
    const answer = ref('')
    let challengeId = ''


    const isParticipant = computed(() => {
      const participant = AppState.participants.find(p => p.accountId == AppState.account.id)
      return participant
    })

    const participantStatus = computed(() => {
      if (isParticipant.value) {
        return isParticipant.value.status
      } else return 'null'
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

    async function updateParticipant() {
      try {
        const confirmComplete = await Pop.confirm('Are you sure you want to complete this challenge?')

        if (!confirmComplete) {
          return
        }

        const participantId = isParticipant.value.id

        const newParticipant = {
          status: 'submitted'
        }

        await participantsService.updateParticipant(participantId, newParticipant)

        Pop.success(`Great job ${AppState.account.name}! Your challenge submission for ${AppState.activeChallenge?.name} has been received. Once your submission has been reviewed, you will be notified of any rewards you have earned! 🏆💹🎉`)
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
        await moderatorsService.getModeratorsByChallengeId(route.params.challengeId)
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

    // This is now handled in the backend... Need to look at separating the challenge management page from the challenge participation page
    // FIXME - JAKE - WIP (Intention is to prevent function from firing if a user is not a moderator or creator of challenge. Still fires on other pages.)
    async function getAnswersByChallengeId() {
      // try {
      //   const moderatorStatus = computed(() => AppState.moderators.find(m => m.accountId == AppState.account.id))

      //   const account = computed(() => AppState.account)

      //   const activeChallenge = computed(() => AppState.activeChallenge)

      //   if (moderatorStatus.value != 'approved' && activeChallenge.value.creatorId != account.value.id) {
      //     return
      //   } else {
      //     await answersService.getAnswersByChallengeId(route.params.challengeId)
      //   }
      // } catch (error) {
      //   logger.error(error)
      //   Pop.error(error.message)
      // }
      logger.log("Line 261 getAnswersByChallengeId has been commented out")
    }

    watchEffect(() => {
      if (route.params.challengeId != challengeId) {
        challengeId = route.params.challengeId
        getParticipantsByChallengeId()
        getModeratorsByChallengeId()
        getAnswersByChallengeId()
        setActiveChallenge()
        logger.log(getParticipantsByChallengeId())
      }
    })

    return {
      updateParticipant,
      answer,
      loading,
      isParticipant,
      participantStatus,
      answerChallenge,
      user: computed(() => AppState.user),
      challenge: computed(() => AppState.activeChallenge),
      date: computed(() => DateTime(AppState.activeChallenge.createdAt)),
      participants: computed(() => AppState.participants),
      rewards: computed(() => AppState.rewards),
      moderators: computed(() => AppState.moderators.filter(m => m.status == 'Active')),
      difficulty: computed(() =>
        StrDifficultyNum(AppState.activeChallenge.difficulty)
      ),
      isOwned: computed(() => AppState.activeChallenge.creator.id === AppState.account.id),
      // Duplicate key created during merge, Verifying redudancy before delete
      // isParticipant: computed(() =>
      //   AppState.participants.find(p => p.accountId == AppState.account.id)
      // ),

      isModeratorStatus: computed(() => {
        const isMod = AppState.moderators.find(m => m.accountId == AppState.account.id)
        if (isMod) {
          if (isMod.status == false) {
            return 'pending'
          } else return 'approved'
        } else return 'null'
      }),

      editChallenge() {
        logger.log("Pushing to", AppState.activeChallenge.id)
        router.push({
          path: `${AppState.activeChallenge.id}/edit`
        })
      },

      async joinChallenge() {
        try {
          // const addConfirm = await Pop.confirm('Would you like to join this challenge? This will use your points.')

          // if (!addConfirm) {
          //   return
          // }

          const newParticipant = {
            challengeId: route.params.challengeId,
            accountId: AppState.user.id,
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
          await moderatorsService.createModeration(moderatorData)
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
          await moderatorsService.removeModeration(moderationId)
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },
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
  height: 18vh;
  object-fit: cover;
  object-position: center;
  border-radius: .5rem;
  padding: 1rem;
  margin: 1rem;
  box-shadow: 0 0 10px #00000080;
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