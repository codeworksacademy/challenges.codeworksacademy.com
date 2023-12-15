<template>
  <div class="border-bottom border-dark d-flex text-light justify-content-between">
    <div class="d-flex">
      <p>
        {{ challengeProp.name }}
      </p>
      <span>
        {{ challengeProp.difficulty }}
      </span>
    </div>
    <div>
      {{ challengeProp.category || "Full Stack" }}
    </div>
    <div>
      <router-link :to="{name: 'ChallengeDetails', params: { challengeId: challengeProp.id }}">
        <button class="btn text-light">
          <i class="mdi mdi-chevron-right"></i>
        </button>
      </router-link>
    </div>
  </div>
</template>


<script>
import { Challenge } from '../../models/Challenge';

export default {
  props:{
    challengeProp: {type: Challenge, required: true}
  },

  setup(props){
    return {
    }
  }
}
</script>


<style lang="scss" scoped>

</style>