<template>
  <div class="container-fluid">
    <div class="row d-flex justify-content-center align-items-center" v-if="categoryFilter">
      <div class="d-none d-md-flex flex-row align-items-center text-uppercase py-3">
        <div class="col-4 ps-4">
          <span class="ps-3">Challenge Name</span>
        </div>
        <div class="col-2 pe-2">
          <span class="col-12 d-flex justify-content-center">Difficulty</span>
        </div>
        <div class="col-5 d-flex justify-content-center align-items-center pe-1">
          <div class="col-3 d-flex justify-content-center">
            <span class="col-10">Reputation</span>
          </div>
          <div class="col-4 d-flex justify-content-center">
            <span>Solves</span>
          </div>
        </div>
      </div>
      <hr>
      <ChallengeCard v-for="c in challenges" :key="c.id" :challenge="c" />
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { AppState } from '../AppState'
import { computed, ref, watch } from 'vue'
import ChallengeCard from '../components/ChallengesPage/ChallengeCard.vue'

export default {
  components: { ChallengeCard, },

  setup() {
    const route = useRoute()
    const categoryFilter = ref(route.params.category)
    const difficultyFilter = ref(route.params.difficulty)
    const difficultySort = ref(AppState.enableDifficultySorting)

    watch(() => AppState.enableDifficultySorting, () => {
      difficultySort.value = AppState.enableDifficultySorting;
    })
    watch(() => route.params.category, () => {
      categoryFilter.value = route.params.category
    })
    watch(() => route.params.difficulty, () => {
      difficultyFilter.value = route.params.difficulty
    })

    return {
      categoryFilter,
      difficultyFilter,
      difficultySort,
      difficultyTypes: ['easy', 'medium', 'hard'],

      challenges: computed(() => {

        if ((!difficultyFilter.value || difficultyFilter.value == 'all') && difficultySort.value) {
          if (!categoryFilter.value || categoryFilter.value == 'all') {
            return [...AppState.challenges]
              .sort((a, b) => a.difficulty - b.difficulty)
          }
          return (AppState.challenges
            .filter(c => c.category === categoryFilter.value))
            .sort((a, b) => a.difficulty - b.difficulty)
        }

        if (!difficultyFilter.value || difficultyFilter.value == 'all') {
          if (!categoryFilter.value || categoryFilter.value == 'all') {
            return AppState.challenges
          }
          return AppState.challenges
            .filter(c => c.category === categoryFilter.value)
        }

        if (!categoryFilter.value || categoryFilter.value == 'all') {
          return AppState.challenges
            .filter(d => d.difficulty == difficultyFilter.value)
        }
        return AppState.challenges
          .filter(c => c.category === categoryFilter.value)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.row[data-v-dc5b8c83] {
  --bs-gutter-x: 0;
}
</style>