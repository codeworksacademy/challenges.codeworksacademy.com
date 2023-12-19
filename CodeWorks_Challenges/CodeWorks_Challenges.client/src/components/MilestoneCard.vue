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

  <section @click="claimMilestone(milestone)" v-if="milestone?.claimed == false"
    class="achievement-card mt-3 row selectable"
    :style="{ border: '3px', borderColor: tierAttributes.color1, borderStyle: 'solid' }">
    <div class="flex-grow-1 text-center m-auto fs-1">NEW</div>
  </section>

  <section v-else class="achievement-card bg-dark row mt-3 "
    :style="{ border: '3px', borderColor: tierAttributes.color1, borderStyle: 'solid' }">

    <div class="col-3 icon flex-grow-1 m-auto text-center py-3" :class="[' mdi', tierAttributes.tierCurrent]"
      :style="{ color: tierAttributes.color1, textShadow: `0px 0px 15px ${tierAttributes.color1}` }"></div>

    <div class="col-9 py-3" :style="{ backgroundColor: '#3e53742a' }">
      <section class="d-flex justify-content-between mb-3 mx-2">
        <div class="fs-3">{{ milestoneTitle }}</div>
        <div>XP {{ milestoneExp }}</div>
      </section>

      <section class="mb-3 mx-2">{{ milestoneDescription }} </section>

      <section class=" mx-2 mb-3">
        <div class="progress rounded-0 bg-dark" role="progressbar" aria-label="Example with label" aria-valuenow="25"
          aria-valuemin="0" aria-valuemax="100" :title="tierProgress">
          <div class="progress-bar" :style="{ 'width': tierProgress, backgroundColor: tierAttributes.color1 }">
          </div>
        </div>
      </section>

      <section class="row justify-content-around mx-1 my-2">
        <div v-for="(level, index) in milestoneCondition.maxTierLevel" :key="index" class="tier-block col-1 bg-dark px-0">
          <div v-if="level <= milestone.tier" class="tier-block text-center text-light"
            :style="{ backgroundColor: tierAttributes.color1 }" :title="level"></div>
        </div>
      </section>

    </div>
  </section>
</template>


<script>
import { computed } from "vue";
import { accountMilestonesService } from "../services/AccountMilestonesService.js";
import Pop from "../utils/Pop.js";

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
    const tierAttributes = computed(() => {
      let attributes = {}
      switch (props.milestone.tier) {
        case 0:
          attributes.adjective = 'Novice'
          attributes.tierCurrent = 'mdi-circle-small'
          attributes.tierNext = 'mdi-flare'
          attributes.color1 = '#000000'
          break;
        case 1:
          attributes.adjective = 'Developing'
          attributes.tierCurrent = "mdi-flare"
          attributes.tierNext = 'mdi-triangle'
          attributes.color1 = '#9400D3'
          break;
        case 2:
          attributes.adjective = 'Improving'
          attributes.tierCurrent = 'mdi-triangle'
          attributes.tierNext = 'mdi-star-three-points'
          attributes.color1 = '#4B0082'
          break;
        case 3:
          attributes.adjective = 'Proficient'
          attributes.tierCurrent = 'mdi-star-three-points'
          attributes.tierNext = 'mdi-star-four-points'
          attributes.color1 = '#0000FF'
          break;
        case 4:
          attributes.adjective = 'Skilled'
          attributes.tierCurrent = 'mdi-star-four-points'
          attributes.tierNext = 'mdi-star'
          attributes.color1 = '#00FF00'
          break;
        case 5:
          attributes.adjective = 'Competent'
          attributes.tierCurrent = 'mdi-star'
          attributes.tierNext = 'mdi-hexagram'
          attributes.color1 = '#FFFF00'
          break;
        case 6:
          attributes.adjective = 'Accomplished'
          attributes.tierCurrent = 'mdi-hexagram'
          attributes.tierNext = 'mdi-hexagram-outline'
          attributes.color1 = '#FF7F00'
          break;
        case 7:
          attributes.adjective = 'Expert'
          attributes.tierCurrent = 'mdi-hexagram-outline'
          attributes.tierNext = 'mdi-octagram'
          attributes.color1 = '#FF0000'
          break;
        case 8:
          attributes.adjective = 'Masterful'
          attributes.tierCurrent = 'mdi-octagram'
          attributes.tierNext = 'mdi-octagram-outline'
          attributes.color1 = '#6A3805'
          break;
        case 9:
          attributes.adjective = 'Pinnacle'
          attributes.tierCurrent = 'mdi-octagram-outline'
          attributes.tierNext = 'mdi-decagram'
          attributes.color1 = '#B4B4B4'
          break;
        case 10:
          attributes.adjective = ''
          attributes.tierCurrent = 'mdi-decagram'
          attributes.tierNext = 'mdi-decagram'
          attributes.color1 = '#C9B037'
          break;

        default:
          attributes.adjective = ''
          attributes.tierCurrent = 'mdi-skull-scan'
          attributes.tierNext = 'mdi-circle-small'
          attributes.color1 = 'Gold'
          break;
      }
      return attributes
    }
    )
    return {
      milestoneCondition,
      tierAttributes,

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
        const milestone = tierAttributes.value.adjective + ' ' + props.milestone.milestone.title
        return milestone
      }),

      milestoneDescription: computed(() => {
        const milestoneDescription = props.milestone.milestone.description
        const milestoneCount = props.milestone.count
        let newDescription = milestoneDescription.replace(/X/g, milestoneCount)
        return newDescription
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

.achievement-card {
  color: white;
  background-color: #3e53742a;
  padding: .5rem;
  font-family: 'Lekton', sans-serif;
  font-size: large;
  font-weight: bold;
  border-radius: .5rem;
  min-height: 22vh;
}

.icon {
  font-size: 96px;
}
</style>