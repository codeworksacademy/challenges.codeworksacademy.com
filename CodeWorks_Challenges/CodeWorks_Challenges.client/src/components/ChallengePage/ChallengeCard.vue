<template>
  <section v-if="challenge" :key="challenge?.id" class="">
    <router-link :to="{ name: 'ChallengeDetails', params: { challengeId: challenge.id } }" class="" style="z-index: 0; text-decoration: none;">
      <div class="challenge-card d-flex flex-row align-items-center text-light"
        style="height: 50px; font-weight: 500; padding: 1.75rem 0 1.75rem 0">
        <span class="col-4 ps-4 ms-3">
          {{ challenge.name }}
        </span>
        <div class="col-2 me-5 pe-5">
          <div class="col-12 d-flex flex-column justify-content-center align-items-center">
            <img v-if="challenge.difficulty === 1" src="../../assets/img/easy-difficulty-chart.svg" :title="`Difficulty Rating: ${challenge.difficulty}`" alt="Easy Difficulty Icon" class="img-fluid" style="width: 30px; height: 30px;">
            <img v-if="challenge.difficulty === 2" src="../../assets/img/medium-difficulty-chart.svg" :title="`Difficulty Rating: ${challenge.difficulty}`" alt="Medium Difficulty Icon" class="img-fluid" style="width: 30px; height: 30px;">
            <img v-if="challenge.difficulty === 3" src="../../assets/img/hard-difficulty-chart.svg" :title="`Difficulty Rating: ${challenge.difficulty}`" alt="Hard Difficulty Icon" class="img-fluid" style="width: 30px; height: 30px;">
          </div>
        </div>
        <div class="col-4 d-flex justify-content-center align-items-center">
          <i class="col-4 mdi mdi-star-half-full fs-5 me-3"> <span class="ms-3" style="font-style: normal"> 4.7</span></i>
          <i class="col-4 mdi mdi-diamond-stone text-light fs-5 me-3"> <span class="ms-3" style="font-style: normal"> {{ challenge.difficulty }}</span></i>
          <i class="col-4 mdi mdi-account text-light fs-5"> <span class="ms-3" style="font-style: normal"> {{ challenge.participantCount }}</span></i>
        </div>
        <div class="col-1 d-flex justify-content-center align-items-center me-5">
          <div v-if="user.id === challenge.creatorId" class="d-flex align-items-center">
            <i class="mdi mdi-chevron-right fs-5 ms-3"></i>
            <i class="mdi mdi-dots-vertical" :title="`Delete Challenge: '${challenge.name}' ?`" style="color: var(--text-sub);" @click.stop="deleteChallenge(challenge.id)" title="Delete Challenge"></i>
          </div>
          <div v-else>
            <i class="mdi mdi-chevron-right fs-5"></i>
          </div>
        </div>
      </div>
    </router-link>
  </section>
</template>

<script>
import { computed } from 'vue'
import Pop from '../../utils/Pop'
import { useRoute } from 'vue-router'
import { AppState } from '../../AppState'
import { logger } from '../../utils/Logger'
import { Challenge } from '../../models/Challenge'
import { StrDifficultyNum } from '../../utils/StrDifficultyNum'
import { profilesService } from '../../services/ProfilesService'
import { challengesService } from '../../services/ChallengesService'

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
      return AppState.participants.filter(p => p.status === 'completed')
  })

    const difficulty = computed(() => StrDifficultyNum(props.challenge.difficulty))

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
      getProfile,
      deleteChallenge,
      user: computed(() => AppState.user),
      account: computed(() => AppState.account),
      challenges: computed(() => AppState.challenges),
      activeChallenge: computed(() => AppState.activeChallenge),
      difficulty,
      userSolveCount,

      setActiveChallenge(challengeId) {
        try {
          logger.log(`Getting Challenge by Id: ${challengeId}`)
          challengesService.setActiveChallenge(challengeId)
        } catch (error) {
          Pop.error(error)
          logger.error(error)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import url('../../assets/scss/_variables.scss');
.challenge-card {
  background-color: var(--bg-main);
  text-shadow: 0 1px #000000;
  transition: all .3s ease-in-out;
  border-top:2px solid var(--border-main);
  border-bottom:2px solid var(--border-main);
  width: 100%
}
</style>