<template>
  <div class="container-fluid">
    <section v-if="milestones?.length > 0" class="row">
      <div v-for="milestone in milestones" :key="milestone?.id" class="col-12 col-lg-6 px-1 px-lg-4 py-2 py-lg-3">
        <MilestoneCard :milestone="milestone" :isMyProfile="isMyProfile" />
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
    const milestones = ref([]);

    // This is the key trigger for the calculation of milestones. With it just on login, You could complete 3 challenges and see no results without logging in and out.
    // The 'get' that was a layer up in AccountMilestones.vue wasn't following order of operations and would never allow a new profile to generate milestones.
    async function getAccountMilestones() {
      try {
        if (route.name == 'Milestones') {
          if (AppState.ProfileState.profile?.id != AppState.AccountState.account.id || !AppState.ProfileState.milestones) {
            await accountMilestonesService.getAccountMilestonesByUserId(AppState.AccountState.account.id);
          }
        } else {
          if (!AppState.ProfileState.milestones) {
            await accountMilestonesService.getAccountMilestonesByUserId(route.params.profileId);
          }
        }
        milestones.value = AppState.ProfileState.milestones;
      }
      catch (error) { Pop.error('[MILESTONES TRACKER] getAccountMilestones:: ' + error); }
    };

    watchEffect(() => {
      if (AppState.AccountState.account.id) {
        getAccountMilestones();
      }
    });

    return {
      milestones,
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