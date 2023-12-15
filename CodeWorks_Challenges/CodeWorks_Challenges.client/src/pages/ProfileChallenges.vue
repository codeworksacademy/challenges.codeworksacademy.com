<template>
  <div class="container-fluid">
    <section class="row mt-3 border-underline">
      <div class="col-3">
        <p class="text-white-50">
          CHALLENGE
        </p>
      </div>
      <div class="col-3">
        <p class="text-white-50">
          CATEGORY
        </p>
      </div>
      <div class="col-3">
        <p class="text-white-50">
          POINTS
        </p>
      </div>
      <div class="col-3">

      </div>
    </section>
    <section class="row">
      <div class="col-12 mt-1" v-for="challenge in challenges">
        <ChallengeMiniCard :challengeProp="challenge" />
      </div>
    </section>
  </div>
</template>


<script>
import { computed } from 'vue';
import { AppState } from '../AppState';
import ChallengeMiniCard from '../components/AccountAndProfilePage/ChallengeMiniCard.vue';

export default {
    setup() {
        return {
            challenges: computed(() => AppState.challenges)
        };
    },
    components: { ChallengeMiniCard }
}
</script>


<style lang="scss" scoped>
.border-underline{
  border-bottom: 1px solid #2F3E57;
}
</style>