<template>
  <section class="container-fluid">
    <div v-for="milestone in milestones" :key="milestone.id" class="col-12">
      <MilestoneCard :milestone="milestone" />
    </div>
  </section>
</template>

<script>
import Pop from '../../utils/Pop';
import { useRoute } from 'vue-router';
import { AppState } from '../../AppState';
import { computed, watchEffect } from 'vue';
import MilestoneCard from './MilestoneCard.vue';
import { milestonesService } from '../../services/MilestonesService';
import { accountMilestonesService } from '../../services/AccountMilestonesService';
import { logger } from "../../utils/Logger.js";

export default {
  setup() {
    const route = useRoute();

    // QUESTION REFACTOR can I do this once on login?
    // This is the key trigger for the calculation of milestones, With it just on login, You could complete 3 challenges and see no results without loging in and out.
    // The 'get' that was a layer up in AccountMilestones.vue wasn't following order of operations and would never allow a new profile to generate miletstones.
    async function checkMyMilestones() {
      try {
        const checks = AppState.milestoneChecks;
        if (route.name.includes('Account') || route.name == 'Milestones') {
          await accountMilestonesService.checkMyMilestones(checks);
        } else {
          const userId = route.params.profileId
          await accountMilestonesService.checkMilestonesByUserId(userId, checks);
        }
      }
      catch (error) {
        Pop.error(error);
      }
    };

    async function getMilestones() {
      try {
        const userId = AppState.AccountState.account.id;
        await milestonesService.getMilestones(userId);
      }
      catch (error) {
        Pop.error(error);
      }
    };

    watchEffect(() => {
      if (AppState.AccountState.account.id) {
        checkMyMilestones();
      }
    });

    return {
      milestones: computed(() => AppState.AccountState.milestones),
    };
  },
  components: { MilestoneCard, }
}
</script>