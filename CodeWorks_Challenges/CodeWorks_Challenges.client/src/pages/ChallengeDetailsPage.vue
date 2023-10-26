<template>
  <section v-if="challenge" :key="challenge?.id" class="container-fluid text-light">
    <div v-if="user.id === challenge?.creatorId">
      <router-view />
    </div>
    <div class="row bg-img d-flex justify-content-center align-items-center"
    :style="`background-image: url(${challenge.coverImg}); opacity: .9;`">
    <div class="text-box">
      <div class="header flex-grow-1 d-flex justify-content-between">
          <h1>{{ challenge.name }}</h1>
          <h1>{{ challenge.id }}</h1>
        </div>
        <div class="body">
          <p>{{ challenge.description }}</p>
          <p>Points: {{ challenge.pointValue }}</p>
          <p>Difficulty: {{ difficulty }}</p>
          <p>Created by: {{ challenge.creator.name }}</p>
          <p v-if="challenge.supportLinks.length > 0">Support Links: {{ challenge.supportLinks }}</p>
          <div class="d-flex mb-3">Moderators:
            <div v-for="mod in moderators" :key="mod.id">
              <img @click="removeModeration(mod.id)" class="moderator selectable ms-2" :src="mod.profile.picture"
                :alt="mod.profile.name" :title="mod.profile.name">
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
    <div class="row" style="overflow-x: hidden;">
      <div class="col-12 d-flex justify-content-center align-items-center ms-5">
        <RewardCard />
        <Completionist />
        <EarlyBird />
        <Architect />
        <ChallengeSlayer />
        <Collaborator />
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <LesserBadges />
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <CustomBadge />
      </div>
    </div>

    <section v-if="isParticipant" class="row mb-5">
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
    <section class="row mb-5">
      <div class="col-8 d-flex justify-content-around">
        <button data-bs-toggle="modal" data-bs-target="#submitAnswerModal" class="btn btn-success" v-if="isParticipant">
          Submit For Review
        </button>
        <div v-if="!isOwned">
          <button v-if="isModeratorStatus == 'null'" class="btn btn-primary" @click="createModeration()">
            Request to become a moderator
          </button>
          <button v-if="isModeratorStatus == 'pending'" class="btn btn-primary">Request pending</button>
          <button v-if="isModeratorStatus == 'approved'" class="btn btn-primary">You are a Moderator</button>
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
    RewardCard,
    Completionist,
    EarlyBird,
    Architect,
    ChallengeSlayer,
    Collaborator,
    CustomBadge,
    LesserBadges,
    AnswerForm
},
  setup() {
    const loading = ref(false)
    const route = useRoute()
    const router = useRouter()

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
        await moderatorsService.getModeratorsByChallengeId(route.params.challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function getAnswersByChallengeId(){
      try {
        const moderatorStatus = computed(() => AppState.moderators.find(m => m.accountId == AppState.account.id))

        const account = computed(() => AppState.account)

        const activeChallenge = computed(() => AppState.activeChallenge)

        if(moderatorStatus != 'approved' && activeChallenge.creatorId != account.id){
          return
        } else{
          await answersService.getAnswersByChallengeId(route.params.challengeId)
        }
      } catch (error) {
        logger.error(error)
        Pop.error(error.message)
      }
    }

    onMounted(() => {
    })

    watchEffect(() => {
      getParticipantsByChallengeId()
      getModeratorsByChallengeId()
      getAnswersByChallengeId()
      setActiveChallenge()
    })

    return {
      loading,
      user: computed(() => AppState.user),
      challenge: computed(() => AppState.activeChallenge),
      editChallenge() {
        logger.log("Pushing to", AppState.activeChallenge.id)
        router.push({
          name: 'EditChallenge',
          params: {
            challengeId: AppState.activeChallenge.id
          }
        })
      },
      participants: computed(() => AppState.participants),
      rewards: computed(() => AppState.rewards),
      moderators: computed(() => AppState.moderators.filter(m => m.status == true)),

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

      isModeratorStatus: computed(() => {
        const isMod = AppState.moderators.find(m => m.accountId == AppState.account.id)
        if (isMod) {
          if (isMod.status == false) {
            return 'pending'
          } else return 'approved'
        } else return 'null'
      }),
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