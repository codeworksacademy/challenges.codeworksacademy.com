<template>
  <div class="container-fluid bg-detail p-3 rounded-3">
    <section class="row" v-if="challenge">

      <div class="col-12 pb-3">
        <h3 class="fs-2" style="color: #7A7A7A">Challenge Requirements</h3>
      </div>

      <div class="col-12 text-light">
        <h4 v-if="challenge.requirements.length == 0" class="text-warning">No requirements</h4>
      </div>

      <div class="col-12">
        <ol>
          <li v-for="(requirement, index) in challenge.requirements" :key="index" class="py-2">
            <span>{{ requirement }}</span>
          </li>
        </ol>
      </div>

    </section>
  </div>
</template>
  
<script>
import { computed } from 'vue'
import { AppState } from '../AppState.js'

export default {
  setup() {
    return {
      challenge: computed(() => AppState.ChallengeState.challenge),
    }
  }
}
</script>

<style scoped lang="scss">
.card {
  background-color: #1e1e1e;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
}

li {
  font-size: 1.2rem;
}

.bg-detail {
  background-color: #1c2332;
  border: 1px solid #2d386b;
}
</style>