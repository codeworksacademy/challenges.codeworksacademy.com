<template>
  <select class="select-type filter-button" v-model="type" @change="filterType(filterBy)">
    <option value="" disabled>Filter By</option>
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
    <option value="cancelled">Cancelled</option>
  </select>
</template>

<script>
import { ref } from "vue"

  export default {
    setup() {
      const type = ref('')
      return {
        type,
        filterType(type) {
          if(type == 'newest'){
            AppState.challenges.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          }else if(type == 'oldest'){
            AppState.challenges.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
          }else if(type == 'cancelled'){
            AppState.challenges.filter(c => c.isCancelled == true)
          }
        },
        // filterType: function(type) {
        //   if(type == 'newest'){
        //     AppState.challenges.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        //   }else if(type == 'oldest'){
        //     AppState.challenges.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
        //   }else if(type == 'cancelled'){
        //     AppState.challenges.filter(c => c.isCancelled == true)
        //   }
        // }
      }
    }
  }
</script>