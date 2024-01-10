<template>
  <div class="container-fluid">
    <section class="row my-3">
      <div class="col-12 text-white">
        <h5 class="text-center">
          <span>My Achievements</span>
          <div>
            <div class="col-12 d-flex justify-content-center align-items-center m-auto">
              <div class="col-3" v-for="completed in badgeArray" :key="completed">
                <ChallengeBadge :challenge="completed.challenge" />
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
      participation: computed(() => AppState.ProfileState.participation?.challenge),
      badgeArray: computed(() => AppState.AccountState.participation.filter(p => p.status == 'completed'))
    }
  },
  components: { ChallengeBadge }
}
</script>

<style scoped lang="scss"></style>