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

export default {
  setup() {
    const route = useRoute();

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
        const userId = AppState.account.id;
        await milestonesService.getMilestones(userId);
      }
      catch (error) {
        Pop.error(error);
      }
    };

    watchEffect(() => {
      if (AppState.account.id) {
        checkMyMilestones();
        getMilestones()
      }
    });

    return {
      milestones: computed(() => AppState.myMilestone),
    };
  },
  components: { MilestoneCard, }
}
</script>


<style lang="scss" scoped></style>