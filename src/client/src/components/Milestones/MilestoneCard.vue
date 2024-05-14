<template>
  <section @click="claimMilestone(accountMilestone)" v-if="isMyProfile && accountMilestone?.claimed == false"
    class="row achievement-card d-flex justify-content-center align-items-center selectable"
    :style="{ border: '3px', borderColor: badgeGradient1, borderStyle: 'solid' }">
    <div class="flex-grow-1 text-center m-auto fs-1">NEW</div>
  </section>

  <section v-else class="row achievement-card bg-dark"
    :style="{ border: '3px', borderColor: badgeGradient1, borderStyle: 'solid' }">
    
    <div class="col-12 col-lg-3">
      <div class="badge-wrapper d-flex flex-row">
        <div class="alt-badge badge"
          :style="{ background: `linear-gradient(${badgeGradient1} 0%, ${badgeGradient2} 100%)` }">
          <div class="circle">
            <i class="m-auto" :style="{ color: badgeGradient2 }" :class="['mdi', badgeIcon]"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-9 px-0 pb-4" :style="{ backgroundColor: badgeGradient2 }">
      <section class="d-flex justify-content-between align-items-center mb-3 py-3 px-4 rounded-end shadow">
        <div class="fs-3">{{ milestoneTitle }}</div>
        <div>XP {{ milestoneExp }}</div>
      </section>

      <section class="mb-3 px-4">{{ milestoneDescription }} </section>
      
      <section class="mb-3 px-3">
        <div class="progress rounded-0 bg-dark" role="progressbar" aria-label="Example with label" aria-valuemin="0" aria-valuemax="100" :title="tierProgress">
          <div class="progress-bar" :style="{ width: tierProgress, backgroundColor: badgeGradient1 }"></div>
        </div>
      </section>

      <section class="row justify-content-around my-2 px-4">
        <div v-for="level in parseInt(maxTierLevel)" :key="level" class="tier-block col-1 bg-dark px-0" :title="level">
          <div v-if="level <= accountMilestone.tier" class="tier-block text-center text-light" :style="{ backgroundColor: badgeGradient1 }"></div>
        </div>
      </section>
    </div>

  </section>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { AppState } from '../../AppState.js';
import { MILESTONE_TIER, MILESTONE_TIER_COLORS } from '../../constants';
import { accountMilestonesService } from '../../services/AccountMilestonesService.js';
import { AccountMilestone } from "../../models/AccountMilestone.js";
import Pop from '../../utils/Pop.js';

export default {
  props: {
    accountMilestone: { type: AccountMilestone, required: true },
    isMyProfile: { type: Boolean, required: true }
  },
  setup(props) {
    const route = useRoute();

    return {
      badgeIcon: computed(() => { return props.accountMilestone.tier > 0 ? MILESTONE_TIER[props.accountMilestone.tier - 1].TIER_CURRENT : MILESTONE_TIER[0].TIER_CURRENT }),
      badgeGradient1: computed(() => { return props.accountMilestone.tier > 0 ? MILESTONE_TIER_COLORS.COLOR_1[props.accountMilestone.tier - 1] : MILESTONE_TIER_COLORS.COLOR_1[0] }),
      badgeGradient2: computed(() => { return props.accountMilestone.tier > 0 ? MILESTONE_TIER_COLORS.COLOR_2[props.accountMilestone.tier - 1] : MILESTONE_TIER_COLORS.COLOR_2[0] }),
      milestoneExp: computed(() => props.accountMilestone.xp ),
      maxTierLevel: computed(() => props.accountMilestone.milestone.logic.split('%')[0].split('-')[0] ),
      milestoneTitle: computed(() => { return (props.accountMilestone.tier > 0 ? MILESTONE_TIER[props.accountMilestone.tier - 1].ADJECTIVE : MILESTONE_TIER[0].ADJECTIVE) + ' ' + props.accountMilestone.milestone.title }),

      tierProgress: computed(() => {
        let currentCount = props.accountMilestone.count;
        let nextTierThreshold = props.accountMilestone.milestone.logic.split('%')[1].split('-')[props.accountMilestone.tier];
        let progress = (currentCount / nextTierThreshold) * 100 + '%';
        return progress;
      }),

      milestoneDescription: computed(() => {
        const description = props.accountMilestone.milestone.description;
        const milestoneCount = props.accountMilestone.count;
        let newDescription = description.replace(/X/g, milestoneCount);
        if (!route.name.includes('Account') && !route.name.includes('Milestones')) {
          newDescription = newDescription.replace(/You have/g, AppState.ProfileState.profile.name + ' has');
          newDescription = newDescription.replace(/You've/g, AppState.ProfileState.profile.name + ' has');
          newDescription = newDescription.replace(/your/g, AppState.ProfileState.profile.name + "'s");
        }
        return newDescription;
      }),

      async claimMilestone(accountMilestone) {
        try {
          accountMilestone.claimed = true;
          await accountMilestonesService.claimMilestone(accountMilestone.id);
        }
        catch (error) {
          Pop.error('[MILESTONE CARD] claimMilestone:: ' + error);
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
  min-height: 15vh;
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