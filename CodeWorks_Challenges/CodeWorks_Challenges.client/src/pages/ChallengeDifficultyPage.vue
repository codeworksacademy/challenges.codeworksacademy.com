<template>
  <div class="row d-flex justify-content-center align-items-center" v-if="difficultyFilter">
    <ChallengeCard v-for="c in filteredChallenges" :key="c.id" :challenge="c" />
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import ChallengeCard from '../components/ChallengesPage/ChallengeCard.vue'
import { StrDifficultyNum } from "../utils/StrDifficultyNum.js"
import { AppState } from '../AppState'

export default {
  components: { ChallengeCard },

  setup() {
    const route = useRoute()
    const difficultyFilter = ref('')

    // Create a local computed property for the filtered challenges
    const filteredChallenges = computed(() => {
      if (!difficultyFilter.value) {
        return AppState.challenges
      }
      return AppState.challenges.filter(c => StrDifficultyNum(c.difficulty).text === difficultyFilter.value)
    })

    // Use watch to update difficultyFilter when the route changes
    watch(() => route.params.difficulty, () => {
      difficultyFilter.value = route.params.difficulty
    })

    return {
      difficultyFilter,
      filteredChallenges,
    }
  }
}
</script>

<style scoped lang="scss">
.row[data-v-dc5b8c83] {
  --bs-gutter-x: 0;
}
</style>
