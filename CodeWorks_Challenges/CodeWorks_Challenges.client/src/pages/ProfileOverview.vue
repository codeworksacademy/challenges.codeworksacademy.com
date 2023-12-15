<template>
  <div class="container-fluid">
    <section class="row mt-3 my-0 my-md-3 mt-md-3">

      <div class="col-md-4 col-12">
        <StatCard title="Moderated Challenges" :number="(challenges.length + approvedModerations.length)" color="#20C997" bgColor="#20c99629" icon="mdi-file-code" />
      </div>

      <div class="col-md-4 col-12">
        <StatCard title="Completed Challenges" :number="0" color="#FD7E14" bgColor="#fd7d142e" icon="mdi-file-sign" />
      </div>

      <!-- TODO - Add functionality to Badges -->
      <div class="col-md-4 col-12">
        <StatCard title="Badges" number="0" color="#6F42C1" bgColor="#1D213A" icon="mdi-seal" />
      </div>
    </section>

    <section class="row">
      <div class="col-md-8 col-12">
        <RankCard :userRank="activeProfile.rank" />
      </div>

      <div class="col-md-4 col-12">
        <StatCard title="Reputation" :number="activeProfile.reputation" color="#3E5374" bgColor="#3e53742a" icon="mdi-emoticon-happy" :leftAlignedIcon="false" :themeStyle="true" />
      </div>
    </section>
  </div>
</template>


<script>
import { computed } from 'vue'
import { AppState } from '../AppState'
import StatCard from '../components/AccountAndProfilePage/StatCard.vue'
import RankCard from '../components/AccountAndProfilePage/RankCard.vue';

export default {
    setup() {
        return {
            activeProfile: computed(() => AppState.activeProfile),
            challenges: computed(() => AppState.challenges),
            completedChallenges: computed(() => {
              const completed = AppState.participants.filter(p => p.status == 'completed')
              return completed || 0
            }),
            approvedModerations: computed(() => {
                const approvedMods = AppState.moderations.filter(m => m.status == 'active' && m.challenge.creatorId != AppState.activeProfile.id);
                return approvedMods;
            })
        };
    },
    components: { StatCard, RankCard }
}
</script>


<style lang="scss" scoped>

</style>