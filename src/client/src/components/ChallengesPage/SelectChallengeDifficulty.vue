<template>
  <select v-model="filterDifficulty" @change="routeToDifficulty" name="difficulty" id="difficulty"
    class="select-difficulty form-select text-capitalize ">
    <option :value="''">All Difficulties</option>
    <option v-for="difficulty in difficultyTypes" :key="difficulty" :value="difficulty">{{ difficulty }}</option>
  </select>
</template>

<script>
import Pop from "../../utils/Pop.js"
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'


export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const filterDifficulty = ref('')
    const difficultyTypes = ref(['easy', 'medium', 'hard'])

    return {
      route,
      filterDifficulty,
      difficultyTypes,

      routeToDifficulty() {
        try {
          if (!filterDifficulty.value && (!route.params.category || route.params.category == 'all')) {
            router.push({ name: 'Challenges.browse' });
            return
          }
          if (!filterDifficulty.value && route.params.category) {
            router.push({ name: 'Challenges.challengeCategory', params: { category: route.params.category, difficulty: 'all' } });
            return
          }
          router.push({ name: 'Challenges.challengeCategory', params: { category: route.params.category ?? 'all', difficulty: filterDifficulty.value } });
        }
        catch (error) { Pop.error(error); }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.select-difficulty {
  background-color: var(--bg-sub);
  border: none;
  outline: none !important;
  color: var(--text-main);
}
</style>