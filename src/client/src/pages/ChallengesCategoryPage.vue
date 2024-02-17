<template>
  <div class="container-fluid">
    <div class="row d-flex justify-content-center align-items-center" v-if="filterBy">
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
    const filterBy = ref(route.params.category)
    const difficultyFilter = ref(route.params.difficulty)

    watch(() => route.params.category, () => {
      filterBy.value = route.params.category
    })

    return {
      filterBy,
      difficultyFilter,

      challenges: computed(() => {

        if (difficultyFilter) {
          if (!filterBy.value) {
            return AppState.challenges
              .sort((a, b) => a.difficulty - b.difficulty)
          }
          return AppState.challenges
            .filter(c => c.category === filterBy.value)
            .sort((a, b) => a.difficulty - b.difficulty)
        }

      }),
    }
  }
}
</script>

<style scoped lang="scss">
.row[data-v-dc5b8c83] {
  --bs-gutter-x: 0;
}
</style>