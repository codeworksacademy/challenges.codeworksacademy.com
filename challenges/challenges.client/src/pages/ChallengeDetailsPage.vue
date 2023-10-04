<template>
  <section v-if="challenge" :key="challenge?.id" class="container-fluid my-3 mt-5 pt-5">
    <div class="row">
      <EditChallengeForm :steps="challenge.steps" />
    </div>
    <section class="row flex-row bg-dark mt-5 mb-3" style="border: 2px solid #BB643877; border-radius: 10px;">

      <div class="col-md-1 col-2" style="border-right: 4px double #BB643877;">
        <router-link
            class="mdi mdi-chevron-left bg-dark"
            :to="{ name: 'Challenges' }"
            title="Back to Challenges Page"
          >
          </router-link>
      </div>
      <div class="col-md-3 col-2 d-flex ps-5 justify-content-center align-items-center">
        <h4 class=""> {{ challenge.name }} </h4>
      </div>
      <div class="col-4 p-0" style="background: linear-gradient(90deg, transparent 0%, #BB6438AA ((%)));">
        <img
          :src="challenge.coverImg"
          :alt="`Cover Image for '${challenge.name}'`"
          class="img-fluid"
          style="height: 100px; width: 100%; object-fit: cover; object-position: center; opacity: 0.5;"
        >
      </div>
      <div class="col-3 ps-5">
        <p class="pe-2" style="transform: translateY(150%);" v-html="difficulty.html"></p>
        <p class="position-absolute right-2">PTS: {{ challenge.pointValue }} </p>
      </div>
    </section>

    <section class="row">
      <div class="col-4">
      </div>
      <div class="col-4">
      </div>
      <div class="col-4">
      </div>
    </section>

    <section class="row bg-dark" style="height: 200px; border: 2px solid #BB643877; border-radius: 10px;">
      <div class="col-12 d-flex">
        <div class="col-2 img-box ms-5 px-5">
          <p class="text-center text-uppercase text-secondary">
            Creator:
          </p>
          <img
            :title="`Picture of challenge creator: ${challenge.creator.name}`"
            :src="challenge.creator.picture"
            :alt="`Picture of challenge creator: ${challenge.creator.name}`"
            class="img-fluid rounded-circle border border-secondary border-3 shadow-lg elevation-5"
          >
        </div>
        <div class="m-auto">
          <div class="col-5 d-flex w-100 flex-column text-secondary text-uppercase ps-5 pt-5" style="height: 200px; border-left: 3px solid #BB643877;">
              <p>Challenges Created: {{ creatorChallengeCount }} </p>
              <!-- TODO - Still need to add following to challenge creator card: 
                - link to the creator's profile page;
                - link to the creator's list of challenges;
                - link to the creator's list of completed challenges;
                - link to the creator's list of achievements;
                etc etc...
                -->
                <p>Completed Challenges:  </p>
            </div>
          </div>
          <div class="col-4 d-flex flex-column text-secondary text-uppercase ps-5 pt-5" style="border-left: 3px solid #BB643877;">
            <p>Achievements:  </p>
            <p>Total Points:  </p>
          </div>
          <div class="col-1 d-flex justify-content-center align-items-top" style="border-left: 3px solid #BB643877;">
            <p class="ps-2 pt-3 text-success darken-10">Rank:  </p>
          </div>
        </div>
    </section>

    <section class="row">
      <div class="col-7">
      </div>
      <div class="col-5">
      </div>
    </section>

  </section>
</template>
  
<script>
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"
import { challengesService } from "../services/ChallengesService.js"
import { Challenge } from '../models/Challenge.js'
import EditChallengeForm from '../components/EditChallengeForm.vue'
import { StrDifficultyNum } from "../utils/StrDifficultyNum.js"

export default {
  components: {
    EditChallengeForm
  },
  setup() {

    const strDifficultyNum = computed(() => {
      return StrDifficultyNum(AppState.activeChallenge.difficulty)
    })
    

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

    onMounted(() => {
      setActiveChallenge()
    })

    return {

      creatorChallengeCount: computed(() => {
        return AppState.challenges.filter(challenge => challenge.creatorId === AppState.account.id).length
      }),

      difficulty: computed(() => {
        return strDifficultyNum.value
      }),

      challenge: computed(() => AppState.activeChallenge),

      createdAt: computed(() => {
        return new Date( AppState.activeChallenge.createdAt )
        .toLocaleDateString('en-US', {
          year: 'numeric', 
          month: 'short', 
          day: 'numeric'
        })
      }),
      updatedAt: computed(() => {
        return new Date( AppState.activeChallenge.updatedAt )
        .toLocaleDateString('en-US', {
          year: 'numeric', 
          month: 'short', 
          day: 'numeric'
        })
      }),
    } 
  }
}
</script>

<style scoped lang="scss">

.mdi-chevron-left {
  height: 100%;
  width: 100%;
  font-size: 4rem;
  color: var(--secondary-magenta) !important;
  opacity: 0.8;
  transition: all .2s ease-in-out;
}

.mdi-chevron-left:hover {
  color: var(--secondary) !important;
  opacity: 0.5;
  transition: all .2s ease-in-out;
  filter: blur(1px);
}

.img-box {
  img {
  transform: translateX(12.5%);
  height: 125px;
  }
}

@media screen and (max-width: 900px) {

  .mdi-chevron-left {
    margin-left: -1rem !important;
    font-size: 3rem !important;
  }
}
</style>