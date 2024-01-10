<template>
  <div class="container-fluid">
    <section class="row mt-3 my-0 my-md-3 mt-md-3">

      <div class="col-md-4 col-12">
        <StatCard title="Moderated Challenges" :number="challenges.length" color="#20C997" bgColor="#20c99629"
          icon="mdi-file-code" :themeStyle="true" :leftAlignedIcon="false" />
      </div>

      <div class="col-md-4 col-12">
        <StatCard title="Completed Challenges" :number="completedChallenges.length" color="#FD7E14" bgColor="#fd7d142e"
          icon="mdi-file-sign" :themeStyle="true" :leftAlignedIcon="false" />
      </div>

      <!-- TODO - Add functionality to Badges -->
      <div class="col-md-4 col-12">
        <StatCard title="Milestones" :number="milestones.length" color="#6F42C1" bgColor="#1D213A" icon="mdi-seal"
          :themeStyle="true" :leftAlignedIcon="false" />
      </div>
    </section>

    <section class="row">
      <div class="col-md-8 col-12">
        <RankCard :profile="account" />
      </div>

      <div class="col-md-4 col-12">
        <StatCard title="Reputation" :number="account.reputation" color="#3E5374" bgColor="#3e53742a"
          icon="mdi-emoticon-happy" :leftAlignedIcon="false" :themeStyle="true" />
      </div>
    </section>
  </div>
</template>


<script>
import { computed } from 'vue';
import RankCard from '../components/AccountAndProfilePage/RankCard.vue';
import { AppState } from '../AppState';
import StatCard from '../components/AccountAndProfilePage/StatCard.vue';


export default {
  setup() {

    return {
      account: computed(() => AppState.AccountState.account),
      challenges: computed(() => AppState.AccountState.challenges),
      participation: computed(() => AppState.AccountState.participation),
      milestones: computed(() => AppState.AccountState.milestones),
      completedChallenges: computed(() => {
        const completed = AppState.AccountState.participation.filter(p => p.status == 'completed')

        return completed
      }),
    };
  },
  components: { RankCard, StatCard, StatCard }
}
</script>


<style lang="scss" scoped></style>