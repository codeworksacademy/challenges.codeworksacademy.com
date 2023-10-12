<template>
  <section
    v-if="challenge"
    :key="challenge?.id"
    class="container-fluid text-light"
  >
    <div class="row bg-img d-flex justify-content-center align-items-center" :style="`background-image: url(${challenge.coverImg}); opacity: .9;`">
      <div class="text-box">
        <div class="header">
          <h1>{{ challenge.name }}</h1>
        </div>
        <div class="body">
          <p>{{ challenge.description }}</p>
          <p>PTS: {{ challenge.pointValue }}</p>
          <p>Difficulty: {{ challenge.difficulty.name }}</p>
          <p>Creator: {{ challenge.creator.name }}</p>
          <p>Support Links:</p>
          <p>Participants: {{ participants.length }}</p>
        </div>
        <div
          v-for="(link, i) in challenge.supportLinks"
          :key="i"
          class="footer"
        >
          <p class="col-8 ps-3" style="font-size: .65rem;">
            <a
              :href="link.url"
              :title="`Project Links: ${challenge.supportLinks}`"
              class="fw-bold hover-text-primary"
            >
              {{ link.name }}
            </a>
          </p>
        </div>
      </div>
    </div>
    <div>
      <button class="btn btn-primary" @click="joinChallenge()" v-if="!isParticipant">
        Join Challenge
      </button>
      
      <button class="btn btn-danger" @click="removeParticipant()" v-if="isParticipant">
        Leave Challenge
      </button>
    </div>
    <div v-if="user.id === challenge?.creatorId">
      <router-view />
    </div>
  </section>
</template>
  
<script>
import { computed, onMounted, watchEffect, ref } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { useRoute } from 'vue-router';
import { challengesService } from '../services/ChallengesService';
import { participantsService } from "../services/ParticipantsService.js";

export default {
  components: {

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

    async function joinChallenge() {
      try {
        const addConfirm = await Pop.confirm('Would you like to join this challenge?')

        if(!addConfirm){
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
    }

    onMounted(() => {
    })
    
    watchEffect(() => {
      getParticipantsByChallengeId()
      setActiveChallenge()
    })

    return {
      loading,

      user: computed(() => AppState.user),
      challenge: computed(() => AppState.activeChallenge),
      participants: computed(() => AppState.participants),

      joinChallenge,

      isParticipant: computed (() =>
        AppState.participants.find(p => p.accountId == AppState.account.id)
      ),

      async createParticipant() {
        try {
          loading.value = true
          let newParticipant = {
            challengeId: route.params.challengeId
          }
          await participantsService.createParticipant(newParticipant)
        } catch (error) {
          logger.error(error)
          Pop.toast(error, 'error')
        }
      },

      async removeParticipant() {
        try {
          const removeConfirm = await Pop.confirm('Are you sure you want to leave this challenge? Your points will not be refunded.')

          if(!removeConfirm){
            return
          }

          let participant = AppState.participants.find(p => p.accountId == AppState.account.id)

          await participantsService.deleteParticipant(participant.id)

          Pop.success('left challenge!')
        } catch (error) {
          logger.error(error)
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
      background-color: rgba(0,0,0,.75);
      padding: 3rem;
      .header {
        h1 {
          background: linear-gradient(rgba(0,0,0,.75), rgba(0,0,0, .5));
          padding: 1rem;
          font-size: 2rem;
          font-weight: bold;
          margin: 0 auto;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
      }
        .body {
          background: linear-gradient(rgba(0,0,0,.5), rgba(0,0,0));
          padding: 1rem;
        }

        .footer {
          background: linear-gradient(rgba(0,0,0), rgba(0,0,0, .75));
          padding: 1rem;
          border-bottom-left-radius: 1rem;
          border-bottom-right-radius: 1rem;
        }
    }
}
</style>