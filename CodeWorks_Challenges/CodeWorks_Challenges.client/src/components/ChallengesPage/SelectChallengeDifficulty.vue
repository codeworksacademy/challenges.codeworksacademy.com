<template>
  <select v-model="filterBy" @change="routeToDifficulty" name="difficulty" id="difficulty"
    class="select-difficulty text-center text-uppercase">
    <option :value="''" disabled>All Difficulties</option>
    <option :value="''">All</option>
    <option v-for="difficulty in difficultyTypes" :key="difficulty" :value="difficulty">{{ difficulty }}</option>
  </select>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { logger } from "../../utils/Logger.js"
import Pop from "../../utils/Pop.js"

export default {
  setup() {
    const router = useRouter()
    const filterBy = ref('')
    const difficultyTypes = ref(['easy', 'medium', 'hard'])


    return {
      filterBy,
      difficultyTypes,

      routeToDifficulty() {
        try {
          if (!filterBy.value) {
            router.push({ name: 'Challenges.browse' })
            return
          }
          router.push({ name: 'Challenges.challengeDifficulty', params: { difficulty: filterBy.value } })
        } catch (error) {
          logger.error(error)
          Pop.error(error)
        }
      },
    }
  }
}
</script>

<style scoped lang="scss">
.select-difficulty {
  width: 100%;
  background-color: var(--bg-sub);
  border: none;
  outline: none !important;
  border-radius: 0;
  color: var(--text-main);
  margin-top: 1rem;
  margin-right: 1rem;
}
@media (max-width: 768px) {
  .select-difficulty {
    margin-bottom: 1rem;
  }
}
</style>