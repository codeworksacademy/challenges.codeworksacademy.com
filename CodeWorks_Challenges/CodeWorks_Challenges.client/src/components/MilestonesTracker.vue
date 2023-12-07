<template>
  <section class="row">

    <div class="col-12">
      <h1>Badges</h1>
      <h3>Milestones</h3>
    </div>

    <div v-for="milestone in milestones" :key="milestone.id" class="col-3">
      <MilestoneCard :milestone="milestone" />
    </div>
  </section>
</template>

<script>
import { computed, watchEffect } from "vue";
import { AppState } from "../AppState.js";
import Pop from "../utils/Pop.js";
import { milestonesService } from "../services/MilestonesService.js";
import { accountMilestonesService } from "../services/AccountMilestonesService.js";
import { logger } from "../utils/Logger.js";
import MilestoneCard from "./MilestoneCard.vue";


export default {
  setup() {
    async function checkMilestonesByAccountId() {
      try {
        const userId = AppState.account.id;
        const checks = AppState.milestoneChecks;
        await accountMilestonesService.checkMilestonesByAccountId(userId, checks);
      }
      catch (error) {
        Pop.error(error);
      }
    }
    async function getAccountMilestones() {
      try {
        const userId = AppState.account.id;
        await accountMilestonesService.getAccountMilestones(userId);
      }
      catch (error) {
        Pop.error(error);
      }
    }
    watchEffect(() => {
      if (AppState.account.id) {
        checkMilestonesByAccountId();
        // getAccountMilestones()
      }
    });
    return {
      milestones: computed(() => AppState.myMilestone),
    };
  },
  components: { MilestoneCard }
}
</script>


<style lang="scss" scoped></style>