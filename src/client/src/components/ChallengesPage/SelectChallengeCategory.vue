<template>
  <select v-model="filterCategory" @change="routeToCategory" name="category" id="category"
    class="select-category text-capitalize form-select">
    <option :value="''">All Categories</option>
    <option v-for="category in categoryTypes" :key="category" :value="category">{{ category }}
    </option>
  </select>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
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
.select-category {
  background-color: var(--bg-sub);
  border: none;
  outline: none !important;
  color: var(--text-main);
}
</style>