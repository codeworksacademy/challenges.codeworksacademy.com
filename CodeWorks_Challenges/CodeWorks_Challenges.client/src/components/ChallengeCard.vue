<template>
  <section v-if="challenge" :key="challenge?.id" class="container-fluid">
    <router-link :to="{ name: 'ChallengeDetails', params: { challengeId: challenge.id } }" class="" style="">
      <div class="card d-flex flex-row bg-dark align-items-center p-3 rounded-3" style="height: 100px; font-weight: 500;">
        <h5 class="col-2">
          {{ challenge.name }}
        </h5>
        <div class="col-2 img-box">
          <img :src="challenge.coverImg" :alt="`Cover Image for ${challenge.name}`" :title="`Cover Image for ${challenge.name}`" class="cover-img img-fluid">
        </div>
        <div class="col-3">
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
        </div>
        <div class="col-2">
          <p>PTS: {{ challenge.pointValue }} </p>
        </div>
        <div class="col-2">
          <p class="pe-2" v-html="difficulty.html"></p>
        </div>
        <div class="col-1 p-2" style="line-height: 0;">
          <p class="text-center text-secondary" style="font-size: .9rem;">Creator:</p>
          <img
            :src="challenge.creator.picture"
            :alt="`Picture of ${challenge.creator.name} (Challenge Creator / Host)`"
            class="img-fluid rounded-circle"
          >
        </div>
      </div>
    </router-link>
  </section>
</template>
  
<script>
import { computed } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { Challenge } from '../models/Challenge'
import { challengesService } from '../services/ChallengesService'
import { StrDifficultyNum } from '../utils/StrDifficultyNum'

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    }
  },
  setup(props) {

    const strDifficultyNum = computed(() => {
      return StrDifficultyNum(props.challenge.difficulty)
    })

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

      strDifficultyNum,
      difficulty: computed(() => {
        return strDifficultyNum.value
      }),

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
.img-box {
  display: flex;
  justify-content: center;
  align-items: center;
  .cover-img {
    height: 90px;
    width: 175px;
    object-fit: cover;
    object-position: center;
  }
}
</style>