<template>
</template>

<script>
import { ref, computed } from 'vue'
import { AppState } from '../../AppState'

export default {
  setup() {
    const filterBy = ref('')
    return {
      filterBy,
    }
  }
}
</script>