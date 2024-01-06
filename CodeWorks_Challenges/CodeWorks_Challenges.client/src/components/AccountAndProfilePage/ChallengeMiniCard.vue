<template>
  <div
    class="border-underline background-highlight row d-flex text-light justify-content-between align-items-center pt-2">
    <div class="col-3">
      <p class="m-0 fw-bold fs-5 text-truncate">
        {{ challengeProp.name }}
      </p>
      <p>
        {{ challengeDifficulty }}
      </p>
    </div>
    <div class="col-3">
      <span class="fw-semibold text-uppercase">
        {{ challengeProp.category || "FULL STACK" }}
      </span>
    </div>
    <div class="col-3">
      <span class="highlight-font fw-semibold fs-5">
        <i class="mdi mdi-diamond-stone me-2 fs-5"></i> {{ challengeProp.difficulty }}
      </span>
    </div>
    <div class="col-3">
      <div class="d-flex align-items-center justify-content-center">
        <router-link :to="{ name: 'ChallengeDetails.Overview', params: { challengeId: challengeProp.id } }">
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

export default {
  props: {
    challengeProp: { type: Challenge, required: true }
  },

  setup(props) {
    return {
      challengeDifficulty: computed(() => {
        let description = ""

        if (props.challengeProp.difficulty == 1) {
          description = "EASY"
        } else if (props.challengeProp.difficulty == 2) {
          description = "MEDIUM"
        } else if (props.challengeProp.difficulty == 3) {
          description = "HARD"
        }

        return description
      })
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