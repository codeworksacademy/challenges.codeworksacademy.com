<template>
  <select v-model="filterCategory" @change="routeToCategory" name="category" id="category"
    class="col-2 select-category text-center text-uppercase p-3">
    <option class="disabled-option" :value="''" disabled>All Categories</option>
    <option class="option-item" v-for="option in categoryTypes" :key="option" :value="option">{{ option }}</option>
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
            router.push({ name: 'Challenges' })
            return
          }
          router.push({ name: 'ChallengeCategory', params: { category: filterCategory.value } })
        } catch (error) {
          logger.error(error)
          Pop.error(error)
        }
      },
    }
  }
}
</script>