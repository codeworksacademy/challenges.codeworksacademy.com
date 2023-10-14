<template>
  <section v-if="challenge" :key="challenge?.id" class="container-fluid text-light">
    <div class="row bg-img d-flex justify-content-center align-items-center"
      :style="`background-image: url(${challenge.coverImg}); opacity: .9;`">
      <div class="text-box">
        <div class="header flex-grow-1 d-flex justify-content-between">
          <h1>{{ challenge.name }}</h1>
          <!--TODO Button will route to EditChallenge Page -->
          <button class="btn btn-outline-warning text-warning">
            Edit
          </button>
        </div>
        <div class="body">
          <p>{{ challenge.description }}</p>
          <p>Points: {{ challenge.pointValue }}</p>
          <p>Difficulty: {{ difficulty }}</p>
          <p>Created by: {{ challenge.creator.name }}</p>
          <p v-if="challenge.supportLinks.length > 0">Support Links: {{ challenge.supportLinks }}</p>
          <div class="d-flex mb-3">Moderators: <div v-for="mod in moderators" :key="mod.id">
              <img class="moderator" :src="mod.profile.picture" :alt="mod.profile.name" :title="mod.profile.name">
            </div>
          </div>
          <p>Participants: {{ participants.length }}</p>
        </div>
        <div v-for="(link, i) in challenge.supportLinks" :key="i" class="footer">
          <p class="col-8 ps-3" style="font-size: .65rem;">
            <a :href="link.url" :title="`Project Links: ${challenge.supportLinks}`" class="fw-bold hover-text-primary">
              {{ link.name }}
            </a>
          </p>
        </div>
      </div>
    </div>

    <div class="row m-auto">
      <div class="col-12 d-flex justify-content-center align-items-center text-dark">
        <h1>Rewards:</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-12 d-flex justify-content-center align-items-center">
        \
        <RewardCard />
        \
      </div>
    </div>

    <section v-if="isParticipant" class="row">
      <!-- v-if is here because participants can be created with out being assigned a status -->
      <div class="col-4 text-dark" v-if="isParticipant.status">Status: <span class="">{{ isParticipant.status
      }}</span>
      </div>
      <div class="col-4 text-dark" v-else>
        Participant is missing status
      </div>
      <div class="col-4 text-dark">Progress: <span class="">-1/10 // 50% Etc</span> </div>
      <div class="col-4 text-dark">Started: <span class="">{{ isParticipant.createdAt }}</span></div>
    </section>
    <section class="row">
      <div class="col-8 d-flex justify-content-around">
        <button class="btn btn-success">
          Submit For Review
        </button>
        <div v-if="!isOwned">
          <button v-if="!isModerator" class="btn btn-primary" @click="createModeration()">
            Request to become a moderator
          </button>
          <button v-else class="btn btn-primary">Request pending</button>
        </div>
        <div v-else>
          <ModSearchForm />
        </div>
      </div>
      <div class="col-4">
        <button class="btn btn-primary" @click="joinChallenge()" v-if="!isParticipant">
          Join Challenge
        </button>

        <button class="btn btn-danger" @click="leaveChallenge()" v-if="isParticipant">
          Leave Challenge
        </button>
      </div>
    </section>

    <div v-if="user.id === challenge?.creatorId">
      <router-view />
    </div>
    <router-view />
  </section>
</template>
  
<script>
import { computed, onMounted, watchEffect, ref, popScopeId } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { useRoute } from 'vue-router';
import { challengesService } from '../services/ChallengesService';
import { participantsService } from "../services/ParticipantsService.js";
import { moderatorsService } from "../services/ModeratorsService.js";
import RewardCard from '../components/Rewards/RewardCard.vue'
import ModSearchForm from '../components/ModSearchForm.vue'

export default {
  components: {
    RewardCard
  },
  setup() {

    const loading = ref(false)
    const route = useRoute()

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
        await challengesService.getParticipantsByChallengeId(route.params.challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }
    async function getModeratorsByChallengeId() {
      try {
        await challengesService.getModeratorsByChallengeId(route.params.challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    onMounted(() => {
    })

    watchEffect(() => {
      getParticipantsByChallengeId()
      getModeratorsByChallengeId()
      setActiveChallenge()
    })

    return {
      loading,

      user: computed(() => AppState.user),
      challenge: computed(() => AppState.activeChallenge),
      participants: computed(() => AppState.participants),
      rewards: computed(() => AppState.rewards),
      moderators: computed(() => AppState.moderators.find(m => m.status == true)),

      difficulty: computed(() => {
        const dif = AppState.activeChallenge.difficulty
        // Switch statement converting the challenges difficulty into words- Change the string at will
        switch (dif) {
          case 1:
            return 'Easy'
          case 2:
            return 'Medium'
          case 3:
            return 'Hard'
          case 4:
            return 'Unforgiving'
          case 5:
            return 'Milk Shoes'
          default:
            return 'N/A'
        }
      }),


      isParticipant: computed(() =>
        AppState.participants.find(p => p.accountId == AppState.account.id)
      ),

      isModerator: computed(() => AppState.moderators.find(m => m.accountId == AppState.account.id)),
      isOwned: computed(() => AppState.activeChallenge.creator.id === AppState.account.id),

      async joinChallenge() {
        try {
          const addConfirm = await Pop.confirm('Would you like to join this challenge? This will use your points.')

          if (!addConfirm) {
            return
          }

          const newParticipant = {
            challengeId: route.params.challengeId,
            accountId: AppState.user.id
          }

          await participantsService.createParticipant(newParticipant)

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
      }
    }
  }
}
</script>

<style scoped lang="scss">
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