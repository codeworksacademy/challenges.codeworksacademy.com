<template>
  <section v-if="challenge" :key="challenge?.id" class="container-fluid">
    <router-link :to="{ name: 'ChallengeDetails', params: { challengeId: challenge.id } }" class="" style="z-index: 0;">
      <div class="card card-custom-image d-flex flex-row bg-dark align-items-center p-3 rounded-3" style="height: 100px; font-weight: 500;" :style="`background-image: url(${challenge.coverImg}); opacity: .9;`">
        <h5 class="col-3">
          {{ challenge.name }}
        </h5>
        <!-- <div class="col-2 img-box">
          <img :src="challenge.coverImg" :alt="`Cover Image for ${challenge.name}`" :title="`Cover Image for ${challenge.name}`" class="cover-img img-fluid">
        </div> -->
        <!-- <div class="col-2">
          <div
            v-for="(link, i) in challenge.supportLinks"
            :key="i"
          >
            <p class="col-12 ps-3" style="font-size: .65rem;">
              Support Links:
              <a
                :href="link.url"
                :title="`Project Links: ${challenge.supportLinks}`"
                class="fw-bold hover-text-primary"
              >
                {{ link.name }}
              </a>
            </p>
          </div>
        </div> -->
        <div class="col-2 m-auto">
          <div class="col-12 text-center">
            <small class="text-light">PTS: {{ challenge.pointValue }} </small>
          </div>
          <div class="col-12" style="text-wrap: nowrap;">
            <small class="" v-html="challenge.difficulty.html"></small>
          </div>
        </div>
        <div class="col-1 p-2 ms-3 d-flex flex-column justify-content-center align-items-center m-auto" style="line-height: 0;">
          <router-link :to="{name: 'Profile', params:{profileId: challenge.creatorId}}">
            <p class="text-center text-secondary" style="font-size: .9rem; text-wrap: nowrap;">Creator:</p>
            <img
              :src="challenge.creator.picture"
              :alt="`Picture of ${challenge.creator.name} (Challenge Creator / Host)`"
              class="img-fluid rounded-circle"
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

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    }
  },
  setup(props) {

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

    return {
      user: computed(() => AppState.user),
      account: computed(() => AppState.account),
      challenges: computed(() => AppState.challenges),
      activeChallenge: computed(() => AppState.activeChallenge),

      

      cancelChallenge,
      deleteChallenge,

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
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid var(--primary-blue);
  border-radius: 1rem;
  box-shadow: var(--shadow);
  transition: all .3s ease-in-out;
  &:hover {
    transform: scale(1.005);
    box-shadow: var(--shadow-magenta);
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