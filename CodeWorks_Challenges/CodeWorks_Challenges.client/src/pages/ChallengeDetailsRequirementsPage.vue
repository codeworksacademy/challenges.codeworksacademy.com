<template>
  <section v-if="challenge" :key="challenge?.id" class="text-light p-3 mx-3 bg-detail rounded-2">
    <div class="col-12 justify-content-center">
      <h3 style="color: #7A7A7A">Challenge Requirements</h3>
      <h3 v-if="challenge.requirements.length == 0" class="text-warning">Challenge has no requirements</h3>

    </div>
      <ol class="col-12 justify-content-center align-items-center">
        <li v-for="(requirement, index) in challenge.requirements" :key="index" class="py-2">
          <span>{{ requirement }}</span>
        </li>
      </ol>
  </section>
</template>
  
<script>
import { computed } from 'vue'
import { AppState } from '../AppState'  

export default {
  setup() {
    return {
      challenge: computed(() => AppState.activeChallenge)
    } 
  }
}
</script>

<style scoped lang="scss">
  .card {
    background-color: #1e1e1e;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
  }
  li {
    font-size: 1.2rem;
  }
  .bg-detail{
    background-color: #1c2332
  }
</style>