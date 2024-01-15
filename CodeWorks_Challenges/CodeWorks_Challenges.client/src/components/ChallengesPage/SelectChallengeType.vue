<template>
  <select id="select-type" v-model="type" @change="filterType(filterBy)">
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
        }
      }
    }
  }
</script>

<style scoped lang="scss">
@import url('../../assets/scss/_formStyles.scss');

#select-type {
  width: 100%;
  height: 50px !important;
  background-color: var(--bg-sub);
  border: none;
  outline: none !important;
  border-radius: 0;
  color: var(--text-main);
  margin-top: 1rem;
  margin-right: 1rem;
}
</style>