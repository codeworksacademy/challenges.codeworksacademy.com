<template>
  <select v-model="difficultyFilter" @change="routeToDifficulty" name="difficulty" id="difficulty"
    class="col-3 select-difficulty text-center text-uppercase p-3">
    <option :value="''" disabled>All Difficulties</option>
    <option :value="''">All</option>
    <option v-for="difficulty in difficultyTypes" :key="difficulty" :value="difficulty">{{ difficulty }}</option>
  </select>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { AppState } from "../../AppState"

export default {
  setup() {
    const router = useRouter()
    const difficultyFilter = ref('')
    const difficultyTypes = computed(() => {
      const difficulties = new Set();
      AppState.challenges.forEach(c => {
        difficulties.add(c.difficultyStr.text);
      });
      return Array.from(difficulties);
    });

    return {
      difficultyFilter,
      difficultyTypes,

      routeToDifficulty() {
        try {
          if (!difficultyFilter.value) {
            router.push({ name: 'Challenges.browse' })
            return
          }
          router.push({ name: 'Challenges.challengeDifficulty', params: { difficulty: difficultyFilter.value } })
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
  background-color: var(--bg-sub);
  border: none;
  outline: none !important;
  border-radius: 0;
  color: var(--text-main);
}
</style>