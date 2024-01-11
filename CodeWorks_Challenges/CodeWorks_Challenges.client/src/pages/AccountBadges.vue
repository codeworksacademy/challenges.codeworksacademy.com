<template>
  <div class="container-fluid">
    <section class="my-3">
      <div class="col-12 text-white">
        <h5 class="text-center">
          <span>My Achievements</span>
        </h5>
        <div class="row badge-card d-flex flex-row justify-space-evenly align-items-center mt-4 me-3">
          <div class="col-3 d-flex justify-content-center align-items-center my-3" v-for="badge in challengeBadges" :key="badge">
              <ChallengeBadge :challenge="badge.challenge" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from "vue";
import { AppState } from '../AppState';
import ChallengeBadge from "../components/ChallengePage/ChallengeBadge.vue";

export default {
  setup() {
 
    return {
      account: computed(() => AppState.AccountState.account),
      challenges: computed(() => {
        return AppState.AccountState.challenges.filter(c => c.creatorId !== AppState.AccountState.account.id)
      }),
      challengeBadges: computed(() => AppState.AccountState.participation.filter(p => p.status == 'completed'))
    }
  },
  components: { ChallengeBadge }
}
</script>

<style scoped lang="scss">
.badge-card {
  background-color: #1D213A;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
  height: 100%;
  width: 100%;
  padding: 20px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
  max-width: 100%;
}
</style>