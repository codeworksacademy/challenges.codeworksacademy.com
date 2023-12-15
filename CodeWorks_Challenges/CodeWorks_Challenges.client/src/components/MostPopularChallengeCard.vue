<template>
  <section v-if="challenge" :key="challenge?.id" class="container-fluid">
    <div class="card">
      <div class="col-4 d-flex justify-content-center align-items-center">
        <div class="rounded-circle border-dark">
          <i :class="categoryIcon" class="mdi"></i>
        </div>
      </div>
      <div class="col-8">
        <h6>{{ AppState.activeChallenge.name }}</h6>
        <small> {{ difficulty }} </small>
      </div>
    </div>
  </section>
</template>
  
<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"  

export default {
  setup() {
    const categoryIcon = computed(() => {
      switch (AppState.activeChallenge.category) {
        case 'full stack':
          return 'mdi-console-network-outline'
        case 'front end':
          return 'mdi-image-filter-hdr'
        case 'back end':
          return 'mdi-database-edit'
        case 'puzzles':
          return 'mdi-account-group'
        case 'data structures':
          return 'mdi-chart-bubble'
        case 'style and design':
          return 'mdi-format-color-fill'
        case 'other':
          return 'mdi-help-circle'
      }
    })

    const mostPopularChallenge = computed(() => {
      const sortedChallenges = AppState.challenges.sort((challenge1, challenge2) => {
        challenge2.participantCount - challenge1.participantCount
        if (sortedChallenges.length > 0) {
          const mostPopularChallenge = sortedChallenges[0];
          logger.log("Featured Challenge:", mostPopularChallenge);
          return mostPopularChallenge;
        } else {
          logger.log("No challenges available");
        }
      })
    })

    onMounted(() => {

    })
    return {
      mostPopularChallenge,
      categoryIcon,
      challenge: computed(() => AppState.activeChallenge),
    } 
  }
}
</script>

<style scoped lang="scss">

</style>