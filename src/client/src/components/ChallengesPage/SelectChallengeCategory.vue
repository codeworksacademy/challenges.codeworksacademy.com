<template>
  <select v-model="filterCategory" @change="routeToCategory" name="category" id="category"
    class="select-category text-capitalize form-select">
    <option :value="''" :selected="filterCategory == '' || filterCategory == 'all'">All Categories</option>
    <option v-for="category in categoryTypes" :key="category" :value="category" :selected="category == filterCategory">
      {{ category }}
    </option>
  </select>
</template>

<script>
import Pop from "../../utils/Pop.js"
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CATEGORY_TYPES } from '../../constants'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const filterCategory = ref(route.params.category ?? '')
    const categoryTypes = ref(Object.values(CATEGORY_TYPES))

    return {
      route,
      filterCategory,
      categoryTypes,

      routeToCategory() {
        try {
          if (!filterCategory.value && (!route.params.difficulty || route.params.difficulty == 'all')) {
            router.push({ name: 'Challenges.browse' });
            return
          }
          if ((!filterCategory.value || filterCategory.value == 'all') && route.params.difficulty) {
            router.push({ name: 'Challenges.browseDifficulty', params: { difficulty: route.params.difficulty } });
            return
          }
          if (!filterCategory.value && route.params.difficulty) {
            router.push({ name: 'Challenges.challengeCategory', params: { category: 'all', difficulty: route.params.difficulty } });
            return
          }
          router.push({ name: 'Challenges.challengeCategory', params: { category: filterCategory.value, difficulty: route.params.difficulty ?? 'all' } });
        }
        catch (error) { Pop.error('[SELECT CHALLENGE CATEGORY] routeToCategory:: ' + error); }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.select-category {
  background-color: var(--bg-sub);
  border: none;
  outline: none !important;
  color: var(--text-main);
}
</style>