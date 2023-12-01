<template>
  <div class="bg-light p-3 m-3 rounded">
    <p>
      <span @click="claimMilestone(milestone)" v-if="milestone?.claimed == false"
        class="mdi mdi-circle text-primary selectable"></span><span v-else
        class="mdi mdi-circle-outline text-primary "></span>
    </p>
    <p>
      {{ milestone.milestone.description }}
    </p>
    <p>
      Tier: {{ milestone.tier }} Out of Max Tier {{ logicParts.maxTierLevel }}
    </p>
  </div>
</template>


<script>
import { computed } from "vue";
import { Milestone } from "../models/Milestone.js";
import { logger } from "../utils/Logger.js";

export default {
  props: {
    milestone: {
      type: Milestone || Object,
      required: true
    }
  },
  setup(props) {

    return {
      logicParts: computed(() => {
        let logic = {};
        logger.log('[Props Milestone]', props.milestone)
        const logicStr = props.milestone.milestone.logic
        const logicParts = logicStr.split('%')
        const operationsArr = logicParts[0].split('-')
        logic.tierThresholdArr = logicParts[1].split('-')
        logic.maxTierLevel = operationsArr[0]
        logic.operation = operationsArr[1]
        return logic
      }),
    }
  }
}
</script>


<style lang="scss" scoped></style>


<!-- {
  "id": "65450a1a87fcfa1de891ea8e",
  "accountId": "6520b10e234aa5b3827dcaa5",
  "milestoneId": "654457fedf1ee2374ca87930",
  "claimed": true,
  "tier": 1,
  "milestone": {
      "_id": "654457fedf1ee2374ca87930",
      "description": "Created Challenge Milestones",
      "check": "createdChallenge",
      "logic": "6-$gte%1-2-3-4-5-10",
      "ref": "Challenges",
      "createdAt": "2023-11-03T02:16:30.401Z",
      "updatedAt": "2023-11-09T21:30:00.858Z",
      "__v": 0,
      "id": "654457fedf1ee2374ca87930"
  }
} -->