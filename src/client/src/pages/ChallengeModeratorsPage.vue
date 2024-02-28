<template>
  <div class="container-fluid">
    <section class="row">
      <div class="col-12 d-flex flex-column">
        <div class="text-center my-3 mb-lg-5">
          <ModSearchForm />
        </div>
      </div>
      <div class="col-12">
        <section v-if="activeModerators" class="row justify-content-evenly">
          <div class="col-12 col-lg-5 flex-column text-light">
            <h5 class="text-center my-4" style="white-space: nowrap;">Active Challenge Moderators</h5>
            <div v-for="moderator in activeModerators" :key="moderator.id">
              <ChallengeModeratorCard :moderator="moderator" />
            </div>
          </div>
          <div class="col-0 col-lg-1 d-flex justify-content-center">
            <div class="vertical-line"></div>
          </div>
          <div class="col-12 col-lg-5 flex-column">
            <h5 class="text-light text-center my-4">Awaiting Confirmation</h5>
            <div v-for="moderator in pendingModerators" :key="moderator.id">
              <ChallengeModeratorCard :moderator="moderator" />
            </div>
          </div>
        </section>
        <section v-else>
          No Moderators
        </section>
      </div>
    </section>
  </div>
</template>

<script>

import Pop from "../utils/Pop.js";
import { useRouter } from "vue-router";
import { computed, onMounted } from 'vue';
import { AppState } from '../AppState.js';
import ModSearchForm from '../components/Forms/ModSearchForm.vue';
import ChallengeModeratorCard from '../components/ChallengeModeratorCard.vue';

export default {
  setup() {
    const router = useRouter();
    function modCheck() {
      if (!AppState.AccountState.account.id) { // give time for account to login
        setTimeout(() => modCheck(), 200);
        return
      }
      const authorizedUser = AppState.ChallengeState.challenge.creatorId == AppState.AccountState.account.id
        || !!AppState.ChallengeState.moderators.find(m => m.accountId == AppState.AccountState.account.id);
      if (!authorizedUser) {
        Pop.error('[UNAUTHORIZED ACCESS] Challenge Moderators Page');
        router.push({ name: 'Error' });
      }
    }

    onMounted(() => { modCheck(); })

    return {
      activeModerators: computed(() =>
        AppState.ChallengeState.moderators
          .filter(m => m.status == 'active' || m.status == 'CodeWorks')
      ),
      pendingModerators: computed(() =>
        AppState.ChallengeState.moderators
          .filter(m => m.status == 'pending')
      )
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