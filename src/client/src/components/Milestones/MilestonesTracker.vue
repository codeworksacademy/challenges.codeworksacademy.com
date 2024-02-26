<template>
  <div class="container-fluid">
    <section v-if="milestones?.length > 0" class="row">
      <div v-for="milestone in milestones" :key="milestone.id" class="col-12">
        <MilestoneCard :milestone="milestone" />
      </div>
    </section>
    <section v-else class="row badge-card text-white">
      <div class="col-12 rounded-top text-center">
        <div class="my-2"> <em> Milestones TBD! </em> </div>
        <router-link :to="{ name: 'Challenges.browse' }" class="d-flex justify-content-center">
          <p class="btn selectable">Find and complete some challenges!</p>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import Pop from '../../utils/Pop';
import { useRoute } from 'vue-router';
import { AppState } from '../../AppState';
import { computed, watchEffect } from 'vue';
import { accountMilestonesService } from '../../services/AccountMilestonesService.js';
import MilestoneCard from './MilestoneCard.vue';

export default {
  components: { MilestoneCard },

  setup() {

    const route = useRoute()

    // QUESTION REFACTOR can I do this once on login?
    // This is the key trigger for the calculation of milestones, With it just on login, You could complete 3 challenges and see no results without loging in and out.
    // The 'get' that was a layer up in AccountMilestones.vue wasn't following order of operations and would never allow a new profile to generate miletstones.
    async function checkMyMilestones() {
      try {
        const checks = AppState.MilestoneState.milestoneChecks;
        if (route.name.includes('Account') || route.name == 'Milestones') {
          await accountMilestonesService.checkMyMilestones(checks);
        } else {
          const userId = route.params.profileId
          await accountMilestonesService.checkMilestonesByUserId(userId, checks);
        }
      }
      catch (error) { Pop.error('[MILESTONES TRACKER] checkMyMilestones:: ' + error); }
    };

    watchEffect(() => {
      if (AppState.AccountState.account.id) {
        checkMyMilestones();
      }
    });

    return {
      milestones: computed(() => AppState.AccountState.milestones),
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