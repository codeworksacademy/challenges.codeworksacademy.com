<template>
  <section @click="claimMilestone(milestone)" v-if="milestone?.claimed == false"
    class="achievement-card mt-3 row selectable"
    :style="{ border: '3px', borderColor: tierAttributes.color1, borderStyle: 'solid' }">
    <div class="flex-grow-1 text-center m-auto fs-1">NEW</div>
  </section>

  <section v-else class="achievement-card bg-dark row mt-3 "
    :style="{ border: '3px', borderColor: tierAttributes.color1, borderStyle: 'solid' }">

    <div class="col-12 col-md-3 icon flex-grow-1 m-auto text-center py-3" :class="[' mdi', tierAttributes.tierCurrent]"
      :style="{ color: tierAttributes.color1, textShadow: `0px 0px 15px ${tierAttributes.color2}` }">
    </div>

    <div class="col-12 col-md-9 py-3" :style="{ backgroundColor: tierAttributes.color2 }">
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
      const color1 = ['#dfdbe8', "#70369d", "#4b369d", "#487de7", "#79c314", "#faeb36", "#ffa500", "#e81416", "#CD7F32", "#B4B4B4", "#C9B037"]
      // const color2 = ["#bab4c7", "#5a4290", "#464290", "#4971c3", "#61973e", "#b4b359", "#b88631", "#a82b41", "#956e56", "#8d94a9", "#918b59"]
      const color2 = ["#bab4c7", "#44375d", "#3a375d", "#3e527e", "#476333", "#757548", "#7a5e2a", "#6f2631", "#615044", "#6d6c6c", "#5e5c46"]
      let attributes = {}
      switch (props.milestone.tier) {
        case 0:
          attributes.adjective = 'Novice'
          attributes.tierCurrent = 'mdi-circle-small'
          attributes.tierNext = 'mdi-flare'
          attributes.color1 = color1[0]
          attributes.color2 = color2[0]
          break;
        case 1:
          attributes.adjective = 'Developing'
          attributes.tierCurrent = "mdi-flare"
          attributes.tierNext = 'mdi-triangle'
          attributes.color1 = color1[1]
          attributes.color2 = color2[1]
          break;
        case 2:
          attributes.adjective = 'Improving'
          attributes.tierCurrent = 'mdi-triangle'
          attributes.tierNext = 'mdi-star-three-points'
          attributes.color1 = color1[2]
          attributes.color2 = color2[2]
          break;
        case 3:
          attributes.adjective = 'Proficient'
          attributes.tierCurrent = 'mdi-star-three-points'
          attributes.tierNext = 'mdi-star-four-points'
          attributes.color1 = color1[3]
          attributes.color2 = color2[3]
          break;
        case 4:
          attributes.adjective = 'Skilled'
          attributes.tierCurrent = 'mdi-star-four-points'
          attributes.tierNext = 'mdi-star'
          attributes.color1 = color1[4]
          attributes.color2 = color2[4]
          break;
        case 5:
          attributes.adjective = 'Competent'
          attributes.tierCurrent = 'mdi-star'
          attributes.tierNext = 'mdi-hexagram'
          attributes.color1 = color1[5]
          attributes.color2 = color2[5]
          break;
        case 6:
          attributes.adjective = 'Accomplished'
          attributes.tierCurrent = 'mdi-hexagram'
          attributes.tierNext = 'mdi-hexagram-outline'
          attributes.color1 = color1[6]
          attributes.color2 = color2[6]
          break;
        case 7:
          attributes.adjective = 'Expert'
          attributes.tierCurrent = 'mdi-hexagram-outline'
          attributes.tierNext = 'mdi-octagram'
          attributes.color1 = color1[7]
          attributes.color2 = color2[7]
          break;
        case 8:
          attributes.adjective = 'Masterful'
          attributes.tierCurrent = 'mdi-octagram'
          attributes.tierNext = 'mdi-octagram-outline'
          attributes.color1 = color1[8]
          attributes.color2 = color2[8]
          break;
        case 9:
          attributes.adjective = 'Pinnacle'
          attributes.tierCurrent = 'mdi-octagram-outline'
          attributes.tierNext = 'mdi-decagram'
          attributes.color1 = color1[9]
          attributes.color2 = color2[9]
          break;
        case 10:
          attributes.adjective = ''
          attributes.tierCurrent = 'mdi-decagram'
          attributes.tierNext = 'mdi-decagram'
          attributes.color1 = color1[10]
          attributes.color2 = color2[10]
          break;

        default:
          attributes.adjective = ''
          attributes.tierCurrent = 'mdi-skull-scan'
          attributes.tierNext = 'mdi-circle-small'
          attributes.color1 = color1[10]
          attributes.color2 = color2[10]
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
  font-family: 'Lekton', sans-serif;
  font-size: large;
  font-weight: bold;
  border-radius: .5rem;
  min-height: 22vh;
}

.icon {
  font-size: 96px;
  background: rgb(49, 64, 89);
  background: radial-gradient(circle, rgba(49, 64, 89, 1) 0%, rgba(31, 41, 57, 1) 61%, rgba(22, 28, 40, 1) 100%);
}
</style>