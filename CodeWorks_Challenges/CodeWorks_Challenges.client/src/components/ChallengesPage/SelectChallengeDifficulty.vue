<template>
  <select v-model="difficultyFilter" @change="routeToDifficulty" name="difficulty" id="difficulty"
    class="col-2 select-category text-center text-uppercase p-3">
    <option class="disabled-option" :value="''" disabled>All Difficulties</option>
    <option class="option-item" v-for="difficulty in difficultyTypes" :key="difficulty" :value="difficulty">{{ difficulty }}</option>
  </select>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { AppState } from "../../AppState"
import { StrDifficultyNum } from "../../utils/StrDifficultyNum"

export default {
  setup(){
    const router = useRouter()
    const difficultyFilter = ref('')
    const difficultyTypes = computed(() => {
      const difficulties = []
      AppState.challenges.forEach(c => {
        if (!difficulties.includes(StrDifficultyNum(c.difficulty).text)) {
          difficulties.push(StrDifficultyNum(c.difficulty).text)
        }
      })
      return difficulties
    })
    return {
      difficultyFilter,
      difficultyTypes,

      challengesByDifficulty: computed(() => {
        if (!difficultyFilter.value) {
          return AppState.challenges
        }
        return AppState.challenges.filter(c => StrDifficultyNum(c.difficulty).text === difficultyFilter.value)
      }),

      routeToDifficulty() {
        try {
          if (!difficultyFilter.value) {
            router.push({ name: 'Challenges' })
            return
          }
          router.push({ name: 'ChallengeDifficulty', params: { difficulty: difficultyFilter.value } })
        } catch (error) {
          logger.error(error)
          Pop.error(error)
        }
      },
      allDifficulties() {
        router.push({ name: 'Challenges' }, { params: { difficulty: '' } })
      }
    }
  }
}
</script>