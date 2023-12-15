<template>
  <div class="container-fluid">
    <section class="row">
      <div class="col-12" v-for="challenge in challenges">
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
            challenges: computed(() => AppState.myChallenges)
        };
    },
    components: { ChallengeMiniCard }
}
</script>


<style lang="scss" scoped>

</style>