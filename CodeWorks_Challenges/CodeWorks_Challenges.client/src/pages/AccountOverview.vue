<template>
  <div class="container-fluid">
    <section class="row">
      <!-- TODO - Add function to find all moderated and created challenges -->
      <div class="col-md-4 col-12">
        <StatCard title="Moderated Challenges" :number="myChallenges.length" color="#20C997" bgColor="#20c99629" icon="mdi-file-code" />
      </div>

      <!-- TODO - Add function to find completed Challenges -->
      <div class="col-md-4 col-12">
        <StatCard title="Completed Challenges" :number="myChallenges.length" color="#FD7E14" bgColor="#fd7d142e" icon="mdi-file-sign" />
      </div>

      <!-- TODO - Add functionality to Badges -->
      <div class="col-md-4 col-12">
        <StatCard title="Badges" number="0" color="#6F42C1" bgColor="#1D213A" icon="mdi-seal" />
      </div>
    </section>

    <section class="row">
      <div class="col-md-4 col-12">
        <StatCard />
      </div>

      <div class="col-md-8 col-12">
        <RankCard />
      </div>
    </section>
  </div>
</template>


<script>
import { computed, watchEffect } from 'vue';
import RankCard from '../components/AccountAndProfilePage/RankCard.vue';
import { AppState } from '../AppState';
import StatCard from '../components/AccountAndProfilePage/StatCard.vue';

export default {
    setup() {
        return {
          account: computed(() => AppState.account),
          myChallenges: computed(() => AppState.myChallenges),
        };
    },
    components: { RankCard, StatCard, StatCard }
}
</script>


<style lang="scss" scoped>

</style>