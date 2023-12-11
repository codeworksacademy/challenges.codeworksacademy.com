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
import { accountMilestonesService } from "../services/AccountMilestonesService.js";
import MilestoneCard from "./MilestoneCard.vue";
import { useRoute } from "vue-router";


export default {
  setup() {

    const route = useRoute()

    async function checkMyMilestones() {
      try {
        const checks = AppState.milestoneChecks;
        if (route.name == 'Account') {
          await accountMilestonesService.checkMyMilestones(checks);
        } else {
          const userId = route.params.profileId
          await accountMilestonesService.checkMilestonesByUserId(userId, checks);
        }
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
        checkMyMilestones();
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