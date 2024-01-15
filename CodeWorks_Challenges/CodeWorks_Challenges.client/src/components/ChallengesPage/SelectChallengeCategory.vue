<template>
  <select v-model="filterCategory" @change="routeToCategory" name="category" id="category"
    class="select-category text-center text-uppercase">
    <option class="disabled-option" :value="''" disabled>All Categories</option>
    <option class="option-item" :value="''">All</option>
    <option class="option-item" v-for="category in categoryTypes" :key="category" :value="category">{{ category }}</option>
  </select>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { AppState } from "../../AppState"
import { CATEGORY_TYPES } from '../../constants'

export default {

  setup() {
    const router = useRouter()
    const filterCategory = ref('')
    const categoryTypes = ref(Object.values(CATEGORY_TYPES))

    return {
      filterCategory,
      categoryTypes,

      routeToCategory() {
        try {
          if (!filterCategory.value) {
            router.push({ name: 'Challenges.browse' })
            return
          }
          router.push({ name: 'Challenges.challengeCategory', params: { category: filterCategory.value } })
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
@import url('../../assets/scss/_formStyles.scss');
.select-category {
  width: 100%;
  background-color: var(--bg-sub);
  border: none;
  outline: none !important;
  border-radius: 0;
  color: var(--text-main);
  margin-top: 1rem;
  margin-right: 1rem;
}
</style>