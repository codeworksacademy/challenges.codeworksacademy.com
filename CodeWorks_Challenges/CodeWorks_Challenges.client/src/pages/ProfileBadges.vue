<template>
  <div class="container-fluid">
    <section class="my-3">
      <div class="text-white">
        <h5 class="text-center">
          <span>My Achievements</span>
          <div>
            <div class="row badge-card d-flex flex-row justify-space-evenly align-items-center mt-4 me-3">
              <div class="col-3 d-flex justify-content-center align-items-center my-3" v-for="badge in challengeBadges" :key="badge">
                <ChallengeBadge :challenge="badge.challenge" />
              </div>
            </div>
          </div>
        </h5>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from "vue";
import { AppState } from '../AppState';
import ChallengeBadge from "../components/ChallengePage/ChallengeBadge.vue";
import { accountService } from "../services/AccountService.js";
import { logger } from "../utils/Logger.js";

export default {
  setup() {
 
    return {
      account: computed(() => AppState.AccountState.account),
      challenges: computed(() => {
        return AppState.AccountState.challenges.filter(c => c.creatorId !== AppState.AccountState.account.id)
      }),
      challengeBadges: computed(() => AppState.ProfileState.participation.filter(p => p.status == 'completed')),
    }
  },
  components: { ChallengeBadge }
}
</script>

<style scoped lang="scss"></style>