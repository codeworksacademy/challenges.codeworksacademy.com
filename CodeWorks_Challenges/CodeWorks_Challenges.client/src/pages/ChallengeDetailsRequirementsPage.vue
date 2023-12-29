<template>
  <section v-if="challenge" :key="challenge?.id" class="card text-light p-3 m-1 ms-0">
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
import { computed } from 'vue'
import { AppState } from '../../AppState'  

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
</style>