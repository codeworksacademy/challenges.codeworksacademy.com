<template>
  <section v-if="challenge" class="selectable fs-5">
    <router-link :to="{ name: 'Challenge.overview', params: { challengeId: challenge.id } }" class=""
      style="z-index: 0; text-decoration: none;">
      <div class="challenge-card d-flex flex-row align-items-center text-light"
        style="height: 50px; font-weight: 500; padding: 1.75rem 0 1.75rem 0">

        <span class="col-6 col-md-4 ps-lg-4 ms-lg-3 fs-6">
          {{ challenge.name }}
        </span>

        <div class="col-2 me-lg-5 pe-lg-5">
          <div class="d-flex flex-lg-row flex-column align-items-center">
            <i class="mdi mdi-diamond-stone" :style="{ color: difficulty.color }" :title="difficulty.value"></i>
            <sub class="ms-lg-3 mb-2">{{ difficulty.value }}</sub>
          </div>
        </div>

        <div class="col-4 d-flex justify-content-center align-items-center">
          <i class="col-4 mdi mdi-account-star-outline fs-lg-5 me-lg-3">
            <span class="ms-3" style="font-style: normal">{{ challenge.reputationIds.length }}</span>
          </i>

          <i class="col-4 d-none d-md-block mdi mdi-seal text-light fs-lg-5"> <span class="ms-3"
              style="font-style: normal">
              {{ challenge.completedCount }}</span>
          </i>
        </div>

      </div>
    </router-link>
  </section>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../../AppState'
import { Challenge } from '../../models/Challenge'
import { difficultyMap } from '../../utils/DifficultyMap.js'

export default {
  props: {
    challenge: {
      type: [Challenge, Object],
      required: true
    }
  },
  setup(props) {

    return {
      user: computed(() => AppState.user),
      account: computed(() => AppState.AccountState.account),
      challenges: computed(() => AppState.challenges),
      activeChallenge: computed(() => AppState.ChallengeState.challenge),
      difficulty: computed(() => difficultyMap[props.challenge.difficulty] || difficultyMap.default),
    }
  }
}
</script>

<style scoped lang="scss">
.challenge-card {
  background-color: var(--bg-main);
  text-shadow: 0 1px #000000;
  transition: all .3s ease-in-out;
  border-bottom: 2px dotted var(--border-main);
  width: 100%
}
</style>