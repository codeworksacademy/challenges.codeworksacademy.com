<template>
  <div v-if="challenge" :key="challenge?.id"
    class="border-underline background-highlight row d-flex text-light justify-content-between align-items-center pt-2">
    <div class="col-3">
      <p class="m-0 fw-bold fs-5 text-truncate">
        {{ challenge?.name }}
      </p>
      <p class="text-uppercase">
        {{ challenge.difficultyStr?.text }}
      </p>
    </div>
    <div class="col-3">
      <span class="fw-semibold text-uppercase">
        {{ challenge.category }}
      </span>
    </div>
    <div class="col-3">
      <span class="highlight-font fw-semibold fs-5">
        <i class="mdi mdi-diamond-stone me-2 fs-5" :style="{ color: difficulty.color }"></i> {{ challenge.difficulty }}
      </span>
    </div>
    <div class="col-3">
      <div class="d-flex align-items-center justify-content-center">
        <router-link :to="{ name: 'Challenge.overview', params: { challengeId: challenge?.id } }">
          <button class="btn text-light" title="view challenge">
            <i class="mdi mdi-chevron-right"></i>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { Challenge } from '../../models/Challenge';
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
      difficulty: computed(() => difficultyMap[props.challenge.difficulty] || difficultyMap.default),
    }
  }
}
</script>

<style lang="scss" scoped>
.border-underline {
  border-bottom: 1px solid #2F3E57;
}

.highlight-font {
  font-family: 'Lekton', sans-serif;
}

.background-highlight:hover {
  background-color: #1A2332;
}
</style>