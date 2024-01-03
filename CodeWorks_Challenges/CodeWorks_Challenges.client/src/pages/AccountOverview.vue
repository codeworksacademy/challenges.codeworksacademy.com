<template>
  <div class="container-fluid">
    <section class="row mt-3 my-0 my-md-3 mt-md-3">

      <div class="col-md-4 col-12">
        <StatCard title="Moderated Challenges" :number="(myChallenges.length + approvedModerations.length)" color="#20C997" bgColor="#20c99629" icon="mdi-file-code" :themeStyle="true" :leftAlignedIcon="false" />
      </div>

      <div class="col-md-4 col-12">
        <StatCard title="Completed Challenges" :number="completedChallenges.length" color="#FD7E14" bgColor="#fd7d142e" icon="mdi-file-sign" :themeStyle="true" :leftAlignedIcon="false" />
      </div>

      <!-- TODO - Add functionality to Badges -->
      <div class="col-md-4 col-12">
        <StatCard title="Badges" :number="badges.length" color="#6F42C1" bgColor="#1D213A" icon="mdi-seal" :themeStyle="true" :leftAlignedIcon="false" />
      </div>
    </section>

    <section class="row">
      <div class="col-md-8 col-12">
        <RankCard :userRank="account.rank" />
      </div>

      <div class="col-md-4 col-12">
        <StatCard title="Reputation" :number="account.reputation" color="#3E5374" bgColor="#3e53742a" icon="mdi-emoticon-happy" :leftAlignedIcon="false" :themeStyle="true" />
      </div>
    </section>
  </div>
</template>


<script>
import { computed, onMounted } from 'vue';
import RankCard from '../components/AccountAndProfilePage/RankCard.vue';
import { AppState } from '../AppState';
import StatCard from '../components/AccountAndProfilePage/StatCard.vue';
import { accountMilestonesService } from "../services/AccountMilestonesService.js";

export default {
    setup() {
      onMounted(() => {
        accountMilestonesService.getAccountMilestonesByUserId(AppState.account.id)
      })
        return {
          account: computed(() => AppState.account),
          // accountReputation: computed(() => {
          //   AppState.myChallenges.forEach(c => {
          //     AppState.account.reputation += c.reputationIds.length
          //   })
          // }),
          myChallenges: computed(() => AppState.myChallenges),
          myParticipations: computed(() => AppState.myParticipants),
          badges: computed(() => AppState.myMilestone),

          completedChallenges: computed(() => {
            const completed = AppState.myParticipants.filter(p => p.status == 'completed')

            return completed
          }),

          approvedModerations: computed(() => {
            const approvedMods = AppState.moderations.filter(m => m.status == 'active' && m.challenge.creatorId != AppState.account.id)

            return approvedMods
          })
        };
    },
    components: { RankCard, StatCard, StatCard }
}
</script>


<style lang="scss" scoped>
</style>