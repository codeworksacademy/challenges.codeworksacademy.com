<template>
  <section v-if="challenge" :key="challenge?.id" class="container-fluid card bg-dark text-light p-3 m-1 ms-0">
    <div class="col-12 d-flex justify-content-center align-items-center">
      <h3 class="text-center text-uppercase">Challenge Requirements</h3>
    </div>
      <ol class="col-12 justify-content-center align-items-center">
        <li v-for="(requirement, index) in challenge.requirements" :key="index" class="py-2">
          <span>{{ requirement }}</span>
        </li>
      </ol>
  </section>
</template>
  
<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../../AppState'
import Pop from "../../utils/Pop.js"
import { logger } from "../../utils/Logger.js"  

export default {
  setup() {

    onMounted(() => {
      if (route.params.challengeId != challengeId) {
        challengeId = route.params.challengeId
        setActiveChallenge()
      }
    })
    return {
      challenge: computed(() => AppState.activeChallenge)
    } 
  }
}
</script>

<style scoped lang="scss">

</style>