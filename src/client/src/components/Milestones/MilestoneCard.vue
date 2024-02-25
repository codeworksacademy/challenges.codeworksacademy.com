<template>
  <section @click="claimMilestone(milestone)" v-if="milestone?.claimed == false"
    class="row achievement-card d-flex justify-content-center align-items-center mt-3 selectable"
    :style="{ border: '3px', borderColor: tierAttributes.color1, borderStyle: 'solid' }">
    <div class="flex-grow-1 text-center m-auto fs-1">NEW</div>
  </section>

  <section v-else class="row achievement-card bg-dark mt-3"
    :style="{ border: '3px', borderColor: tierAttributes.color1, borderStyle: 'solid' }">
    <div class="col-12 col-lg-3">
      <div class="badge-wrapper d-flex flex-row">
        <div class="alt-badge badge"
          :style="{ background: `linear-gradient(${tierAttributes.color1} 0%, ${tierAttributes.color2} 100%)` }">
          <div class="circle">
            <i class="m-auto" :style="{ color: tierAttributes.color2 }" :class="['mdi', tierAttributes.tierCurrent]"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-9 py-3" :style="{ backgroundColor: tierAttributes.color2 }">
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
import { computed } from 'vue';
import { accountMilestonesService } from '../../services/AccountMilestonesService';
import Pop from '../../utils/Pop';
import { MILESTONE_TIER } from '../../constants';
import { AppState } from '../../AppState';
import { useRoute } from 'vue-router';

export default {
  props: {
    milestone: {
      type: Object,
      required: true
    }
  },
  setup(props) {

    const route = useRoute()

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
      const badge = MILESTONE_TIER[props.milestone.tier]
      attributes.adjective = badge.ADJECTIVE
      attributes.tierCurrent = badge.TIER_CURRENT
      attributes.tierNext = badge.TIER_NEXT

      if (props.milestone.tier == 0) {
        attributes.color1 = badge.COLOR_1[0]
        attributes.color2 = badge.COLOR_2[0]
      } else {
        attributes.color1 = badge.COLOR_1[props.milestone.tier - 1]
        attributes.color2 = badge.COLOR_2[props.milestone.tier - 1]
      }
      return attributes
    })
    return {
      badgeGradient1: computed(() => {
        const badge = tierAttributes.value.color1
        return badge
      }),
      badgeGradient2: computed(() => {
        const badge = tierAttributes.value.color2
        return badge
      }),
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
        if (!route.name.includes('Account') && !route.name.includes('Milestones')) {
          newDescription = newDescription.replace(/You have/g, AppState.activeProfile.name + ' has')
          newDescription = newDescription.replace(/You've/g, AppState.activeProfile.name + ' has')
          newDescription = newDescription.replace(/your/g, AppState.activeProfile.name + "'s")
        }
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
@mixin margin-auto {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
}

.achievement-card {
  color: white;
  background-color: #3e53742a;
  font-family: 'Lekton', sans-serif;
  font-size: large;
  font-weight: bold;
  border-radius: .5rem;
  min-height: 22vh;
  overflow-x: hidden;

  .badge-wrapper {
    font-family: 'Comfortaa', sans-serif;
    width: 100%;
    margin: .5em auto;
    text-align: center;

    .alt-badge {
      position: relative;
      top: 0;
      margin: 1.75em auto;
      width: 7.67em;
      height: 12.25em;
      aspect-ratio: 1/1;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.2s ease;

      &:before,
      &:after {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border-radius: inherit;
        background: inherit;
        @include margin-auto;
      }

      &:before {
        transform: rotate(60deg);
      }

      &:after {
        transform: rotate(-60deg);
      }

      &:hover {
        top: -4px;
      }

      .circle {
        position: absolute;
        display: flex;
        justify-content: center;
        width: 105px;
        height: 105px;
        background: #dadada;
        outline: none;
        border: none;
        box-shadow: inset 0 0 30px -10px v-bind(badgeGradient1), 0 0 20px;
        z-index: 10;
        border-radius: 50%;
        @include margin-auto;

        i.mdi {
          margin-top: 8px;
          font-size: 5.5em;
          color: v-bind(badgeGradient2);
          filter: drop-shadow(0 .5px .5px #000);
        }

        /*NOTE - For when you can't find the mdi icon you want, you can use a v-bind computed background image on any .png, just make sure the background of the .png is transparent */
        img {
          width: 2em;
          height: 2em;
          margin-top: 8px;
        }
      }

      .font {
        display: flex;
        margin-top: 1em;
      }
    }
  }

  .tier-block {
    height: 8px;
  }
}
</style>