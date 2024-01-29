<template>
  <div class="container-fluid">
    <section class="row mt-3 my-0 my-md-3 mt-md-3">

      <div class="col-lg-4 col-12">
        <StatCard title="Moderated Challenges" :number="challenges.length" color="#20C997" bgColor="#20c99629"
          icon="mdi-file-code" :themeStyle="true" :leftAlignedIcon="false" />
      </div>

      <div class="col-lg-4 col-12">
        <StatCard title="Completed Challenges" :number="completedChallenges.length" color="#FD7E14" bgColor="#fd7d142e"
          icon="mdi-file-sign" :themeStyle="true" :leftAlignedIcon="false" />
      </div>

      <div class="col-lg-4 col-12">
        <StatCard title="Challenge Badges" :number="badges.length" color="#6F42C1" bgColor="#1D213A" icon="mdi-seal"
          :themeStyle="true" :leftAlignedIcon="false" />
      </div>
    </section>

    <section class="row">
      <div class="col-lg-8 col-12">
        <RankCard :profile="profile" />
      </div>

      <div class="col-lg-4 col-12">
        <StatCard title="Reputation" :number="profile.reputation" color="#3E5374" bgColor="#3e53742a"
          icon="mdi-emoticon-happy" :leftAlignedIcon="false" :themeStyle="true" />
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
      profile: computed(() => AppState.ProfileState.profile),
      profileRank: computed(() => AppState.ProfileState.profile.rank),
      milestones: computed(() => AppState.ProfileState.milestones),
      challenges: computed(() => AppState.ProfileState.challenges),
      completedChallenges: computed(() => AppState.ProfileState.participation.filter(p => p.status == 'completed')),
      badges: computed(() => AppState.ProfileState.participation.filter(p => p.status == 'completed' && p.challenge?.badge !== undefined))
    };
  },
  components: { StatCard, RankCard }
}
</script>


<style lang="scss" scoped></style>