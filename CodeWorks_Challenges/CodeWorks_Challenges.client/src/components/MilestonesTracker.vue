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

  <!-- <h5 class="col-2">
    <span @click="claimMilestone(cCMilestone)" v-if="cCMilestone?.claimed == false"
      class="mdi mdi-circle text-primary selectable"></span><span v-else
      class="mdi mdi-circle-outline text-primary "></span> Create Challenges:
    <ul v-if="cCMilestone">
      <li> 1 Challenge <span v-if="cCMilestone.tier < 1" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>2 Challenge <span v-if="cCMilestone.tier < 2" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>3 Challenge <span v-if="cCMilestone.tier < 3" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>4 Challenge <span v-if="cCMilestone.tier < 4" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>5 Challenge <span v-if="cCMilestone.tier < 5" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>10 Challenge <span v-if="cCMilestone.tier < 10" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
    </ul>
  </h5>
  <h5 class="col-2">
    <span @click="claimMilestone(pCMilestone)" v-if="pCMilestone?.claimed == false"
      class="mdi mdi-circle text-primary selectable"></span><span v-else
      class="mdi mdi-circle-outline text-primary "></span>Join Challenges:
    <ul v-if="pCMilestone">
      <li>1 Challenge <span v-if="pCMilestone.tier < 1" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>2 Challenge <span v-if="pCMilestone.tier < 2" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>3 Challenge <span v-if="pCMilestone.tier < 3" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>4 Challenge <span v-if="pCMilestone.tier < 4" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>5 Challenge <span v-if="pCMilestone.tier < 5" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>6 Challenge <span v-if="pCMilestone.tier < 6" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
    </ul>
  </h5>
  <h5 class="col-2">
    Complete Challenges:
    <ul>
      <li>1 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>2 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>3 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>4 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>5 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>10 Challenge <span class="mdi mdi-close text-danger"></span></li>
    </ul>
  </h5>
  <h5 class="col-2">
    Grade a challenge:
    <ul>
      <li>1 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>2 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>3 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>4 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>5 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>10 Challenge <span class="mdi mdi-close text-danger"></span></li>
    </ul>
  </h5>
  <h5 class="col-2">
    <span @click="claimMilestone(mCMilestone)" v-if="mCMilestone?.claimed == false"
      class="mdi mdi-circle text-primary selectable"></span><span v-else
      class="mdi mdi-circle-outline text-primary "></span>Contribute to a challenge (moderate):
    <ul v-if="mCMilestone">
      <li>1 Challenge <span v-if="mCMilestone.tier < 1" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>2 Challenge <span v-if="mCMilestone.tier < 2" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>3 Challenge <span v-if="mCMilestone.tier < 3" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>4 Challenge <span v-if="mCMilestone.tier < 4" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>5 Challenge <span v-if="mCMilestone.tier < 5" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
      <li>10 Challenge <span v-if="mCMilestone.tier < 10" class="mdi mdi-close text-danger"></span><span v-else
          class="mdi mdi-check text-success"></span></li>
    </ul>
  </h5> -->
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
      cCMilestone: computed(() => AppState.myMilestone.find(m => m.milestone.check == 'createdChallenge')),
      pCMilestone: computed(() => AppState.myMilestone.find(m => m.milestone.check == 'joinedChallenge')),
      mCMilestone: computed(() => AppState.myMilestone.find(m => m.milestone.check == 'moderateChallenge')),
      async claimMilestone(accountMilestone) {
        try {
          accountMilestone.claimed = true;
          await accountMilestonesService.claimMilestone(accountMilestone);
        }
        catch (error) {
          Pop.error(error);
        }
      }
    };
  },
  components: { MilestoneCard }
}
</script>


<style lang="scss" scoped></style>