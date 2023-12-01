<template>
  <div class="bg-dark border border-5 border-secondary-bold text-light p-3 m-3 rounded">
    <p>
      <span @click="claimMilestone(milestone)" v-if="milestone?.claimed == false"
        class="mdi mdi-circle text-primary selectable"></span><span v-else
        class="mdi mdi-circle-outline text-primary "></span>
    </p>
    <div>
      Badge Icon
    </div>
    <i :class="['fs-1 text-success mdi', milestoneIcon]" :title="milestone.tier"></i>
    <p>
      {{ milestone.milestone.description }}
    </p>
    <p>
      Tier: {{ milestone.tier }} Out of {{ milestoneCondition.maxTierLevel }}
    </p>
    <p>
      Next Tier: {{ milestoneCondition.nextTierThreshold }} total for tier {{ milestoneCondition.nextTier }}
    </p>
    <p>
      {{ milestoneCondition.toNextLevel }} to next level:
    </p>
    <p></p>
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
      milestoneIcon: computed(() => {
        let icon = ""
        switch (props.milestone.tier) {
          case 0:
            icon = 'mdi-circle-small'
            break;
          case 1:
            icon = "mdi-flare"
            break;
          case 2:
            icon = 'mdi-triangle'
            break;
          case 3:
            icon = 'mdi-star-three-points'
            break;
          case 4:
            icon = 'mdi-star-four-points'
            break;
          case 5:
            icon = 'mdi-star'
            break;
          case 6:
            icon = 'mdi-hexagram'
            break;
          case 7:
            icon = 'mdi-hexagram-outline'
            break;
          case 8:
            icon = 'mdi-octagram'
            break;
          case 9:
            icon = 'mdi-octagram-outline'
            break;
          case 10:
            icon = 'mdi-decagram'
            break;

          default:
            icon = 'mdi-skull-scan'
            break;
        }
        return icon
      }
      ),

      milestoneCondition: computed(() => {
        let condition = {};
        const logicStr = props.milestone.milestone.logic
        const logicParts = logicStr.split('%')
        const operationsArr = logicParts[0].split('-')

        condition.tierThresholdArr = logicParts[1].split('-')
        condition.maxTierLevel = operationsArr[0]
        condition.operation = operationsArr[1]

        condition.nextTier = props.milestone.tier + 1
        condition.nextTierThreshold = condition.tierThresholdArr[props.milestone.tier]
        condition.toNextLevel = condition.tierThresholdArr[props.milestone.tier] - props.milestone.count

        return condition
      })

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