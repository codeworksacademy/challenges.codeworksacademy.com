<template>
  <!-- <div class="col-12">
    <p>
      <span @click="claimMilestone(milestone)" v-if="milestone?.claimed == false"
        class="mdi mdi-circle text-primary selectable">NEW</span><span v-else
        class="mdi mdi-circle-outline text-primary "></span>
    </p>


  </div>
  <div class="col-12 d-flex justify-content-end">
    <p>
      <span class="text-light"> XP: XX</span>
    </p>
  </div>

  <div class="col-6">
    <div>
      Badge
    </div>
    <i :class="['fs-1 text-success mdi', milestoneIcon.current]" :title="milestone.tier"></i>


  </div>

  <div v-if="milestone.tier != milestoneCondition.maxTierLevel" class="col-6">
    <div>
      Next
    </div>
    <i :class="['fs-1 text-secondary mdi', milestoneIcon.next]" :title="milestone.tier"></i>

  </div>

  <div class="col-12">
    <p>
      {{ milestone.milestone.description }}
    </p>
  </div>

  <div class="col-6">
    <p>
      Tier: {{ milestone.tier }} Out of {{ milestoneCondition.maxTierLevel }}
    </p>
    <p>
      {{ milestone.count }} so far
    </p>
  </div>
  <div class="col-6">
    <p>
      Next Tier:
    </p>
    <p>
      Tier {{ milestoneCondition.nextTier }} - {{ milestoneCondition.nextTierThreshold }} total
    </p>
    <p>
      {{ milestoneCondition.toNextLevel }} till next level
    </p>
  </div> -->
  <section class="row bg-dark border border-2 border-secondary-bold text-light m-2  rounded">
    <div class="col-3 text-center py-3" :class="['fs-1 text-success mdi', milestoneIcon.current]"></div>
    <div class="col-9 bg-info py-3">
      <section class="d-flex justify-content-between mb-3">
        <div>{{ milestoneTitle }}</div>
        <div>XP {{ milestoneExp }}</div>
      </section>
      <section class="mb-3">{{ milestoneDescription }} </section>
      <section class=" mx-2 mb-3">
        <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0"
          aria-valuemax="100" :title="tierProgress">
          <div class="progress-bar" :style="{ 'width': tierProgress }">
          </div>
        </div>
      </section>
      <section class="row justify-content-around mx-1 my-2">
        <div v-for="(level, index) in milestoneCondition.maxTierLevel" :key="index"
          class="tier-block col-1 bg-light px-0">
          <div v-if="level <= milestone.tier" class="tier-block bg-primary text-center text-light" :title="level"></div>
        </div>
      </section>
    </div>
  </section>
</template>


<script>
import { computed } from "vue";
import { Milestone } from "../models/Milestone.js";
import { logger } from "../utils/Logger.js";
import { accountMilestonesService } from "../services/AccountMilestonesService.js";
import Pop from "../utils/Pop.js";
import { AppState } from "../AppState.js";

export default {
  props: {
    milestone: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const milestoneCondition = computed(() => {
      let condition = {};
      const logicStr = props.milestone.milestone.logic
      const logicParts = logicStr.split('%')
      const operationsArr = logicParts[0].split('-')

      condition.tierThresholdArr = logicParts[1].split('-')
      condition.maxTierLevel = Number(operationsArr[0])
      condition.operation = operationsArr[1]

      condition.nextTier = props.milestone.tier + 1
      condition.nextTierThreshold = Number(condition.tierThresholdArr[props.milestone.tier])
      condition.toNextLevel = condition.tierThresholdArr[props.milestone.tier] - props.milestone.count

      return condition
    })
    return {
      milestoneCondition,
      milestoneIcon: computed(() => {
        let icon = {}
        switch (props.milestone.tier) {
          case 0:
            icon.current = 'mdi-circle-small'
            icon.next = 'mdi-flare'
            break;
          case 1:
            icon.current = "mdi-flare"
            icon.next = 'mdi-triangle'
            break;
          case 2:
            icon.current = 'mdi-triangle'
            icon.next = 'mdi-star-three-points'
            break;
          case 3:
            icon.current = 'mdi-star-three-points'
            icon.next = 'mdi-star-four-points'
            break;
          case 4:
            icon.current = 'mdi-star-four-points'
            icon.next = 'mdi-star'
            break;
          case 5:
            icon.current = 'mdi-star'
            icon.next = 'mdi-hexagram'
            break;
          case 6:
            icon.current = 'mdi-hexagram'
            icon.next = 'mdi-hexagram-outline'
            break;
          case 7:
            icon.current = 'mdi-hexagram-outline'
            icon.next = 'mdi-octagram'
            break;
          case 8:
            icon.current = 'mdi-octagram'
            icon.next = 'mdi-octagram-outline'
            break;
          case 9:
            icon.current = 'mdi-octagram-outline'
            icon.next = 'mdi-decagram'
            break;
          case 10:
            icon.current = 'mdi-decagram'
            icon.next = 'mdi-decagram'
            break;

          default:
            icon.current = 'mdi-skull-scan'
            icon.next = 'mdi-circle-small'
            break;
        }
        return icon
      }
      ),

      tierProgress: computed(() => {
        let currentCount = props.milestone.count
        let nextTierThreshold = milestoneCondition.value.nextTierThreshold
        let tp = (currentCount / nextTierThreshold) * 100 + '%'
        return tp
      }),

      milestoneExp: computed(() => {
        let experience = 0
        let tier = props.milestone.tier
        while (tier != 0) {
          experience += tier * 5
          tier--
        }
        return experience
      }),

      milestoneTitle: computed(() => {
        const milestone = props.milestone.milestone.title
        return milestone
      }),

      milestoneDescription: computed(() => {
        const milestoneData = props.milestone.milestone
        const accountMilestone = props.milestone
        let descriptionString = milestoneData.description
        return descriptionString
      }),

      async claimMilestone(accountMilestone) {
        try {
          accountMilestone.claimed = true;
          await accountMilestonesService.claimMilestone(accountMilestone);
        }
        catch (error) {
          Pop.error(error);
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.tier-block {
  height: 8px;
}
</style>