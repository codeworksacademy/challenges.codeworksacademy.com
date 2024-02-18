<template>
  <div class="container-fluid my-3">

    <section class="row justify-content-center">

      <div class="col-12 col-sm-10 col-md-8 col-lg-4 px-1 px-md-2">
        <StatCard color="#20C996" bgColor="#20C99629" :themeStyle="true" :leftAlignedIcon="false" icon="mdi-file-code"
          :number="challenges.length" title="Moderated Challenges" />
      </div>

      <div class="col-12 col-sm-10 col-md-8 col-lg-4 px-1 px-md-2">
        <StatCard color="#FD7E14" bgColor="#FD7E142E" :themeStyle="true" :leftAlignedIcon="false" icon="mdi-file-sign"
          :number="completedChallenges.length" title="Completed Challenges" />
      </div>

      <div class="col-12 col-sm-10 col-md-8 col-lg-4 px-1 px-md-2">
        <StatCard color="#6F42C1" bgColor="#1D213AE9" :themeStyle="true" :leftAlignedIcon="false" icon="mdi-seal"
          :number="badges.length" title="Challenge Badges" />
      </div>

    </section>

    <section class="row justify-content-center">

      <div class="col-12 col-sm-10 col-md-8 px-1 px-md-2">
        <RankCard :profile="account" />
      </div>

      <div class="col-12 col-sm-10 col-md-8 col-lg-4 px-1 px-md-2">
        <StatCard color="#3E5374" bgColor="#3E53742A" :themeStyle="true" :leftAlignedIcon="false"
          icon="mdi-emoticon-happy" :number="account.reputation" title="Reputation" />
      </div>

    </section>

  </div>
</template>


<script>
import { computed } from 'vue';
import { AppState } from '../AppState';
import StatCard from '../components/AccountAndProfilePage/StatCard.vue';
import RankCard from '../components/AccountAndProfilePage/RankCard.vue';

export default {
  setup() {

    return {
      account: computed(() => AppState.AccountState.account),
      challenges: computed(() => AppState.AccountState.challenges),
      milestones: computed(() => AppState.AccountState.milestones),
      participation: computed(() => AppState.AccountState.participation),

      // profile: computed(() => AppState.ProfileState.profile),
      // challenges: computed(() => AppState.ProfileState.challenges),
      // milestones: computed(() => AppState.ProfileState.milestones),
      // profileRank: computed(() => AppState.ProfileState.profile.rank),

      completedChallenges: computed(() => {
        const completed = AppState.AccountState.participation.filter(p => p.status == 'completed')
        return completed
      }),
      badges: computed(() => {
        const challengeWithBadge = AppState.AccountState.participation.filter(p => p.status == 'completed')
        const hasBadge = challengeWithBadge.filter(c => c.challenge.badge)
        return hasBadge
      })
    }
  },
  components: { RankCard, StatCard }
}
</script>


<style lang="scss" scoped></style>