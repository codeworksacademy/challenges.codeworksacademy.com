<template>
  <section v-if="challenge" :key="challenge?.id" class="">
    <router-link :to="{ name: 'ChallengeDetails', params: { challengeId: challenge.id } }" class="" style="z-index: 0; text-decoration: none;">
      <div class="card card-custom-image d-flex flex-row bg-dark align-items-center p-3 rounded-3 text-light"
        style="height: 85px; font-weight: 500;">
        <h6 class="col-3">
          {{ challenge.name }}
        </h6>

        <div class="col-2 m-auto">
          <div class="col-12 d-flex flex-column justify-content-center align-items-center">
            <img v-if="challenge.difficulty === 1" src="../assets/img/easy-difficulty-chart.svg" alt="Easy Difficulty Icon" class="img-fluid" style="width: 30px; height: 30px;">
            <img v-if="challenge.difficulty === 2" src="../assets/img/medium-difficulty-chart.svg" alt="Medium Difficulty Icon" class="img-fluid" style="width: 30px; height: 30px;">
            <img v-if="challenge.difficulty === 3" src="../assets/img/hard-difficulty-chart.svg" alt="Hard Difficulty Icon" class="img-fluid" style="width: 30px; height: 30px;">
          </div>
        </div>
        <div class="col-2">
          <i class="mdi mdi-star-half-full fs-5 ms-5"> <span class="ms-1" style="font-style:normal;"> 4.7</span></i>
        </div>
        <div class="col-2">
          <i class="mdi mdi-diamond-stone text-light">PTS: {{ challenge.difficulty }} </i>
        </div>
        <div class="col-2">
          <i class="mdi mdi-account text-light"> {{ challenge.completedCount }}</i>
        </div>
        <div class="col-1 d-flex flex-column justify-content-center align-items-center mx-auto ms-3">
          <i class="mdi mdi-chevron-right"></i>
        </div>
      </div>
    </router-link>
    <div v-if="user.id === challenge.creatorId" class="col-2">
      <div class="col-12">
        <i class="mdi mdi-trash-can-outline text-danger fs-1 position-absolute top-2 right-2"
          @click.stop="deleteChallenge(challenge.id)" title="Delete Challenge"></i>
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
import { StrDifficultyNum } from '../utils/StrDifficultyNum.js'

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    }
  },
  setup(props) {

    const route = useRoute()

    const userSolveCount = computed(() => {
      return AppState.participants.forEach(p => {
        if (p.status === 'completed') {
          return p.length
        }
      })
    })

    const difficulty = computed(() => StrDifficultyNum(props.challenge.difficulty))
    async function cancelChallenge() {
      try {
        if (await Pop.confirm('Are you sure you want to cancel this challenge?')) {
          const challengeId = props.challenge.id
          await challengesService.deprecateChallenge(challengeId)
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
      difficulty,
      userSolveCount,

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
  background-color: var(--bg-main) !important;
  text-shadow: 0 1px #000000;
  transition: all .3s ease-in-out;
  border-top:2px solid var(--border-main);
  border-bottom:2px solid var(--border-main);

  &:hover {
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
    }
  }
}

.mdi.mdi-trash-can-outline {

  user-select: none;
  cursor: pointer;

}</style>