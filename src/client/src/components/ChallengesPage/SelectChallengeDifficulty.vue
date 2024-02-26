<template>
  <div v-if="!filterDifficulty" class="">
    <button v-if="enableDifficultySorting" class="btn btn-primary px-2 py-0" @click="toggleSorting">
      <i class="fs-4 mdi mdi-sort" title="sorted by difficulty"></i>
    </button>
    <button v-else class="btn btn-outline-primary px-2 py-0" @click="toggleSorting">
      <i class="fs-4 mdi mdi-sort-variant-remove" title="difficulty level sorting disabled"></i>
    </button>
  </div>
  <select v-model="filterDifficulty" @change="routeToDifficulty" name="difficulty" id="difficulty"
    class="select-difficulty form-select text-capitalize ">
    <option :value="''" :selected="filterDifficulty == '' || filterDifficulty == 'all'">
      All Difficulties</option>
    <option v-for="difficulty in difficultyTypes" :key="difficulty" :value="difficulty"
      :selected="difficulty == filterDifficulty">{{ difficulty }}</option>
  </select>
</template>

<script>
import Pop from "../../utils/Pop.js"
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppState } from "../../AppState.js"


export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const filterDifficulty = ref(route.params.difficulty ?? '')
    const enableDifficultySorting = ref(false)

    watch(() => AppState.enableDifficultySorting, () => {
      enableDifficultySorting.value = AppState.enableDifficultySorting;
    })

    return {
      route,
      filterDifficulty,
      enableDifficultySorting,
      difficultyTypes: ['easy', 'medium', 'hard'],

      toggleSorting() {
        AppState.enableDifficultySorting = !AppState.enableDifficultySorting;
      },

      routeToDifficulty() {
        try {
          document.getElementById('difficulty').value = filterDifficulty.value;
          if ((!filterDifficulty.value || filterDifficulty.value == 'all') && (!route.params.category || route.params.category == 'all')) {
            router.push({ name: 'Challenges.browse' });
            return
          }
          if (filterDifficulty.value && (!route.params.category || route.params.category == 'all')) {
            router.push({ name: 'Challenges.browseDifficulty', params: { difficulty: filterDifficulty.value } });
            return
          }
          if ((!filterDifficulty.value || filterDifficulty.value == 'all') && route.params.category) {
            router.push({ name: 'Challenges.challengeCategory', params: { category: route.params.category, difficulty: 'all' } });
            return
          }
          router.push({ name: 'Challenges.challengeCategory', params: { category: route.params.category ?? 'all', difficulty: filterDifficulty.value } });
        }
        catch (error) { Pop.error('[SELECT CHALLENGE DIFFICULTY] routeToDifficulty:: ' + error); }
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