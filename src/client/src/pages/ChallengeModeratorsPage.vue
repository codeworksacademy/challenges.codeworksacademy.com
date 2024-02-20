<template>
  <div class="container-fluid">
    <section class="row">
      <div class="col-12 d-flex flex-column">
        <div>
          <div class="text-center mt-3 mb-5">
            <ModSearchForm />
          </div>
        </div>
      </div>
      <div v-if="moderators" class="col-12 d-flex justify-content-evenly">
        <div class="col-4 flex-column">
          <h5 class="text-light text-center mb-5" style="white-space: nowrap;">Active Challenge Moderators</h5>
          <div v-for="moderator in moderators" :key="moderator.id">
            <div v-if="moderator.status == 'active' || moderator.status == 'CodeWorks'" class="text-light">
              <ChallengeModeratorCard :moderator="moderator" />
            </div>
          </div>
        </div>
        <span class="col-1 vertical-line"></span>
        <div class="col-4 flex-column">
          <h5 class="text-light text-center mb-5">Awaiting Confirmation</h5>
          <div v-for="moderator in moderators" :key="moderator.id">
            <div v-if="moderator.status == 'pending'">
              <ChallengeModeratorCard :moderator="moderator" />
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        No Moderators
      </div>
    </section>
  </div>
</template>

<script>

import Pop from "../utils/Pop.js";
import { AppState } from '../AppState';
import { useRouter } from "vue-router";
import { computed, onMounted } from 'vue';
import ModSearchForm from '../components/Forms/ModSearchForm.vue';
import ChallengeModeratorCard from '../components/ChallengeModeratorCard.vue';
import { logger } from "../utils/Logger.js";

export default {
  setup() {

    const router = useRouter();
    function modCheck() {
      if (!AppState.AccountState.account.id) { // give time for account to login
        logger.log('[MODCHECK] loop trigger, no ID:', AppState.AccountState.account.id);
        setTimeout(() => modCheck(), 200);
        return
      }
      logger.log('[MODCHECK] loop bypass trigger', AppState.AccountState.account.id);
      const authorizedUser = AppState.ChallengeState.challenge.creatorId == AppState.AccountState.account.id
        || !!AppState.ChallengeState.moderators.find(m => m.accountId == AppState.AccountState.account.id);
      // logger.log('[MODCHECK] ', AppState.ChallengeState.challenge.creatorId == AppState.AccountState.account.id);
      // logger.log('[MODCHECK] ', !!AppState.ChallengeState.moderators.find(m => m.accountId == AppState.AccountState.account.id));
      if (!authorizedUser) {
        Pop.error('[UNAUTHORIZED ACCESS] Challenge Moderators Page');
        router.push({ name: 'Error' });
      }
    }
    onMounted(() => { modCheck(); })

    return {
      moderators: computed(() => AppState.ChallengeState.moderators)
    };
  },
  components: { ModSearchForm, ChallengeModeratorCard }
}
</script>

<style scoped lang="scss">
.vertical-line {
  width: 5px;
  height: 100%;
  background-color: #77777733;
}
</style>