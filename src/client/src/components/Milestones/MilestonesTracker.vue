<template>
  <div class="container-fluid">
    <section v-if="accountMilestones?.length > 0" class="row">
      <div v-for="accountMilestone in accountMilestones" :key="accountMilestone?.id" class="col-12 col-lg-6 px-1 px-lg-4 py-2 py-lg-3">
        <MilestoneCard :accountMilestone="accountMilestone" :isMyProfile="isMyProfile" />
      </div>
    </section>
    <section v-else class="row badge-card text-white">
      <div class="col-12 rounded-top text-center">
        <div class="my-2"> <em> No Milestones Tiggered Yet! </em> </div>
        <router-link :to="{ name: 'Challenges.browse' }" class="d-flex justify-content-center">
          <p class="btn selectable">Find and complete some challenges!</p>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import Pop from '../../utils/Pop.js';
import { useRoute } from 'vue-router';
import { computed, ref, watchEffect } from 'vue';
import { AppState } from '../../AppState.js';
import { accountMilestonesService } from '../../services/AccountMilestonesService.js';
import MilestoneCard from './MilestoneCard.vue';

export default {
  components: { MilestoneCard },

  setup() {
    const route = useRoute();
    const accountMilestones = ref([]);

    async function getAccountMilestones() {
      try {
        if (route.name == 'Milestones') {
          if (AppState.ProfileState.profile?.id != AppState.AccountState.account.id || !AppState.ProfileState.milestones) {
            await accountMilestonesService.getAccountMilestonesByAccountId(AppState.AccountState.account.id);
          }
        } else {
          if (!AppState.ProfileState.milestones) {
            await accountMilestonesService.getAccountMilestonesByAccountId(route.params.profileId);
          }
        }
        accountMilestones.value = AppState.ProfileState.milestones;
      }
      catch (error) { Pop.error('[MILESTONES TRACKER] getAccountMilestones:: ' + error); }
    };

    watchEffect(() => {
      if (AppState.AccountState.account.id) {
        getAccountMilestones();
      }
    });

    return {
      accountMilestones,
      isMyProfile: computed(() => { return AppState.AccountState.account?.id == route.params.profileId }),
    };
  }
}
</script>

<style scoped lang="scss">
.badge-card {
  background-color: #1D213A;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
  height: 100%;
  width: 100%;
  padding: 20px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
  max-width: 100%;
  transition: all .3s ease-in-out;
}
</style>