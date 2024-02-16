<template>
  <div class="container-fluid">
    <div class="row d-flex justify-content-center align-items-center" v-if="filterBy">
      <ChallengeCard v-for="c in filteredChallenges" :key="c.id" :challenge="c" />
    </div>
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
    const filterBy = ref(route.params.difficulty)

    // Create a local computed property for the filtered challenges
    const filteredChallenges = computed(() => {
      if (!filterBy.value) {
        return AppState.challenges
      }
      return AppState.challenges.filter(c => c.difficultyStr.text === filterBy.value)
    })

    // Use watch to update filterBy when the route changes
    watch(() => route.params.difficulty, () => {
      filterBy.value = route.params.difficulty
    })

    return {
      filterBy,
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
