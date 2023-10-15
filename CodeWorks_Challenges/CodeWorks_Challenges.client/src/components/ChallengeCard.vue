<template>
  <section v-if="challenge" :key="challenge?.id" class="container-fluid">
    <router-link :to="{ name: 'ChallengeDetails', params: { challengeId: challenge.id } }" class="" style="z-index: 0;">
      <div class="card card-custom-image d-flex flex-row bg-dark align-items-center p-3 rounded-3" style="height: 100px; font-weight: 500;" :style="`background-image: url(${challenge.coverImg}); opacity: .9;`">
        <h5 class="col-3">
          {{ challenge.name }}
        </h5>
        
        <div class="col-2 m-auto">
          <div class="col-12 d-flex flex-column text-center">
            <small class="text-light">PTS: {{ challenge.pointValue }} </small>
            <small class="" v-html="challenge.difficulty.html"></small>
          </div>
        </div>
        <div class="col-1 d-flex flex-column justify-content-center align-items-center mx-auto ms-3">
          <p class="text-center" style="font-size: .9rem; text-wrap: nowrap; line-height: 0;">Creator:</p>
          <router-link :to="{ name: 'Profile', params: { profileId: challenge.creatorId } }">
            <img
              :src="challenge.creator.picture"
              :alt="`Picture of ${challenge.creator.name} (Challenge Creator / Host)`"
              class="creator-img img-fluid rounded-circle"
            >
          </router-link>
        </div>
      </div>
    </router-link>
    <div v-if="user.id === challenge.creatorId" class="col-2">
      <div class="col-12">
        <i
          class="mdi mdi-trash-can-outline text-danger fs-1 position-absolute top-2 right-2"
          @click.stop="deleteChallenge(challenge.id)"
          title="Delete Challenge"
        ></i>
      </div>
    </div>
  </section>
</template>
  
<script>
import { computed } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { Challenge } from '../models/Challenge'
import { challengesService } from '../services/ChallengesService'
import { profilesService } from '../services/ProfilesService'
import { useRoute } from "vue-router"

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    }
  },
  setup(props) {

    const route = useRoute()

    async function cancelChallenge() {
      try {
        if (await Pop.confirm('Are you sure you want to cancel this challenge?')) {
          const challengeId = props.challenge.id 
          await challengesService.cancelChallenge(challengeId)
        }
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function deleteChallenge(challengeId) {
      try {
        if (await Pop.confirm(`Are you sure you want to delete ${props.challenge.name}?`)) {
          await challengesService.deleteChallenge(challengeId)
          logger.log('Challenge Deleted')
        }
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    async function getProfile() {
      try {
        const profileId = route.params.profileId
        await profilesService.getProfile(profileId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    return {
      user: computed(() => AppState.user),
      account: computed(() => AppState.account),
      challenges: computed(() => AppState.challenges),
      activeChallenge: computed(() => AppState.activeChallenge),

      cancelChallenge,
      deleteChallenge,
      getProfile,

      setActiveChallenge(challengeId) {
        try {
          logger.log(`Getting Challenge by Id: ${challengeId}`)
          challengesService.setActiveChallenge(challengeId)
        } catch (error) {
          Pop.error(error)
          logger.error(error)
        }
      },
    } 
  }
}
</script>

<style scoped lang="scss">
@import url('../assets/scss/_variables.scss');

.card-custom-image {
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid var(--primary-blue);
  box-shadow: var(--shadow);
  text-shadow: 0 1px #000000;
  transition: all .3s ease-in-out;
    &::before {
      background: linear-gradient(90deg, #00000080 0%, transparent 150%);
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: .45rem;
      z-index: -1;
    }
    &:hover {
      transform: scale(1.005);
      box-shadow: var(--shadow-magenta);
    }
    .creator-img {
      object-fit: cover;
      width: 40px;
      height: 40px;
      margin: 0;
      padding: 0;
      aspect-ratio: 1/1;
      border-radius: 50%;
      box-shadow: var(--shadow);
      transition: all .3s ease-in-out;
        &:hover {
          transform: scale(1.05);
          box-shadow: var(--shadow-magenta);
        }
    }
}

.mdi.mdi-trash-can-outline {
  
  user-select: none;
  cursor: pointer;
  &:hover {
    color: blue !important;
  }
}
</style>