<template>
  <div class="container-fluid my-3">

    <section class="row justify-content-center">

      <div class="col-12 col-sm-10 col-md-8 col-lg-4 px-1 px-md-2">
        <StatCard color="#20C996" bgColor="#20C99629" :themeStyle="true" :leftAlignedIcon="false" icon="mdi-file-code"
          :number="challenges?.length || 0" title="Moderated Challenges" />
      </div>

      <div class="col-12 col-sm-10 col-md-8 col-lg-4 px-1 px-md-2">
        <StatCard color="#FD7E14" bgColor="#FD7E142E" :themeStyle="true" :leftAlignedIcon="false" icon="mdi-file-sign"
          :number="completedChallenges?.length || 0" title="Completed Challenges" />
      </div>

      <div class="col-12 col-sm-10 col-md-8 col-lg-4 px-1 px-md-2">
        <StatCard color="#6F42C1" bgColor="#1D213AE9" :themeStyle="true" :leftAlignedIcon="false" icon="mdi-seal"
          :number="badges?.length || 0" title="Challenge Badges" />
      </div>

    </section>

    <section class="row justify-content-center">

      <div class="col-12 col-sm-10 col-md-8 px-1 px-md-2">
        <RankCard :profile="profile" />
      </div>

      <div class="col-12 col-sm-10 col-md-8 col-lg-4 px-1 px-md-2">
        <StatCard color="#3E5374" bgColor="#3E53742A" :themeStyle="true" :leftAlignedIcon="false"
          icon="mdi-emoticon-happy" :number="profile.reputation" title="Reputation" />
      </div>

    </section>

    <!-- TODO - Add Milestones summary card? -->

    <section class="row justify-content-center p-2">
      <UserCard :profile="profile" />
    </section>

  </div>
</template>


<script>
import { computed } from 'vue';
import { AppState } from '../AppState';
import StatCard from '../components/ProfilePage/StatCard.vue';
import RankCard from '../components/ProfilePage/RankCard.vue';
import UserCard from "../components/UserCard.vue";

export default {
  setup() {
    return {
      profile: computed(() => AppState.ProfileState.profile),
      challenges: computed(() => AppState.ProfileState.challenges),
      completedChallenges: computed(() => AppState.ProfileState.participation.filter(p => p.status == 'completed')),
      badges: computed(() => {
        return AppState.ProfileState.participation
          .filter(p => p.status == 'completed')
          .filter(c => c.challenge.badge)
      }),
    }
  },
  components: { RankCard, StatCard, UserCard }
}
</script>


<style lang="scss" scoped></style>