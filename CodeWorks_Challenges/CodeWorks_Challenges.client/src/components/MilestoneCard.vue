<template>
  <section class="row bg-dark border border-5 border-secondary-bold text-light p-3 m-3 rounded">
    <div class="col-12">
      <p>
        <span @click="claimMilestone(milestone)" v-if="milestone?.claimed == false"
          class="mdi mdi-circle text-primary selectable"></span><span v-else
          class="mdi mdi-circle-outline text-primary "></span>
      </p>
      <p>
        {{ milestone.milestone.description }}
      </p>
    </div>

    <div class="col-6">
      <div>
        Badge
      </div>
      <i :class="['fs-1 text-success mdi', milestoneIcon.current]" :title="milestone.tier"></i>

      <p>
        Tier: {{ milestone.tier }} Out of {{ milestoneCondition.maxTierLevel }}
      </p>
      <p>
        {{ milestone.count }} so far
      </p>
    </div>

    <div v-if="milestone.tier != milestoneCondition.maxTierLevel" class="col-6">
      <div>
        Next
      </div>
      <i :class="['fs-1 text-secondary mdi', milestoneIcon.next]" :title="milestone.tier"></i>
      <p>
        Next Tier: {{ milestoneCondition.nextTierThreshold }} total for tier {{ milestoneCondition.nextTier }}
      </p>
      <p>
        {{ milestoneCondition.toNextLevel }} to next level:
      </p>
      <p></p>

    </div>
  </section>
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