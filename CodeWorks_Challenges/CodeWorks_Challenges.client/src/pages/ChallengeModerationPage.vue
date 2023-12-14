<!-- 🚨🚨🚨Trash -->
<template>
  <section class="container-fluid">
    Challenge Moderation
    {{ challenge }}
  </section>
</template>
  
<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState'
import Pop from "../utils/Pop.js"
import { logger } from "../utils/Logger.js"

export default {
  components: {

  },
  setup() {

    onMounted(() => {

    })
    return {
      challenge: computed(() => AppState.activeChallenge)
    }
  }
}
</script>
  
<style scoped lang="scss"></style>