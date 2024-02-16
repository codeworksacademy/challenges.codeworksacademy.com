<template>
  <select v-model="filterBy" @change="routeToDifficulty" name="difficulty" id="difficulty"
    class="select-difficulty form-select text-capitalize ">
    <option :value="''">All Difficulties</option>
    <option v-for="difficulty in difficultyTypes" :key="difficulty" :value="difficulty">{{ difficulty }}</option>
  </select>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
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
        }
        catch (error) { Pop.error(error); }
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
  color: var(--text-main);
}
</style>