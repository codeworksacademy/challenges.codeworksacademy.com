<!-- 
  This Tracker component is meant to render the condition of these various Milestones.
  There will be a milestone qualifying ojbect on the backend -milestone_reward-
  This reward will have a logic variable that can be parsed to retrieve the variables necessary to decide if a user has obtained the milestone
  
  Accessing this page will create the request for milestone_checks={createdChallenge, joinedChallenge, completedChallenge, moderateChallenge}
  milestone_checks will be sent up as a payload to the back end where the controller will individually send to the service for each value in milestone_checks

  service -- if (string == createdChallenge){ milestoneGet = dbContext.milestone_rewards.find({check: createdChallenge}) }
  logic = milestoneGet.logic.split(' ')
  if (logic[0] == $gte){ 
    challenge = challengeService.getchallengesbyaccountId
    cCount = challenge.count()??
    if (cCount >= logic[1]) 
    this.createMilestoneReward(accountId){
      m_reward = dbContext.milestone_rewards.post(accountId)
      return m_reward
    } else return
  }
  -->

<template>
  <h1>Badges</h1>
  <h2 class="col-4">
    Create Challenges:
    <ul v-if="cCMilestone">
      <li>1 Challenge <span v-if="cCMilestone.tier < 1" class="mdi mdi-close text-danger"></span><span v-else
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
  </h2>
  <h2 class="col-4">
    Join Challenges:
    <ul>
      <li>1 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>2 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>3 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>4 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>5 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>10 Challenge <span class="mdi mdi-close text-danger"></span></li>
    </ul>
  </h2>
  <h2 class="col-4">
    Complete Challenges:
    <ul>
      <li>1 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>2 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>3 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>4 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>5 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>10 Challenge <span class="mdi mdi-close text-danger"></span></li>
    </ul>
  </h2>
  <h2 class="col-4 mx-auto">
    Grade a challenge:
    <ul>
      <li>1 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>2 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>3 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>4 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>5 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>10 Challenge <span class="mdi mdi-close text-danger"></span></li>
    </ul>
  </h2>
  <h2 class="col-4 mx-auto">
    Contribute to a challenge (moderate):
    <ul>
      <li>1 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>2 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>3 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>4 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>5 Challenge <span class="mdi mdi-close text-danger"></span></li>
      <li>10 Challenge <span class="mdi mdi-close text-danger"></span></li>
    </ul>
  </h2>
</template>

<script>
import { computed, watchEffect } from "vue";
import { AppState } from "../AppState.js";
import Pop from "../utils/Pop.js";
import { milestonesService } from "../services/MilestonesService.js";
import { logger } from "../utils/Logger.js";


export default {
  setup() {

    async function checkMilestonesByAccountId() {
      try {
        const userId = AppState.account.id
        const checks = AppState.milestoneChecks
        await milestonesService.checkMilestonesByAccountId(userId, checks)
      } catch (error) {
        Pop.error(error)
      }
    }

    async function getAccountMilestones() {
      try {
        const userId = AppState.account.id
        await milestonesService.getAccountMilestones(userId)
      } catch (error) {
        Pop.error(error)
      }
    }

    watchEffect(() => {
      if (AppState.account.id) {
        checkMilestonesByAccountId()
        // getAccountMilestones()
      }
    })
    return {
      cCMilestone: computed(() => AppState.myMilestone.find(m => m.milestone.check == 'createdChallenge'))
    }
  }
}
</script>


<style lang="scss" scoped></style>