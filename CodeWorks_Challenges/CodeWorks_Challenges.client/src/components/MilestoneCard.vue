<template>
  <section class="row bg-dark border border-5 border-secondary-bold text-light p-1 m-1 rounded">
    <div class="col-12">
      <p>
        <span @click="claimMilestone(milestone)" v-if="milestone?.claimed == false"
          class="mdi mdi-circle text-primary selectable">NEW</span><span v-else
          class="mdi mdi-circle-outline text-primary "></span>
      </p>
    </div>

    <div class="col-6 d-flex flex-column justify-content-center align-items-center">
      <h6>
        Current Badge
      </h6>
      <!-- Use v-html to render HTML template being returned in script -->
      <div v-html="milestoneBadge.current"></div>
    </div>

    <div v-if="milestone.tier != milestoneCondition.maxTierLevel" class="col-6 d-flex flex-column justify-content-center align-items-center">
      <h6>
        Next Badge
      </h6>
      <!-- Use v-html to render HTML template being returned in script -->
      <div v-html="milestoneBadge.next"></div>
    </div>

    <div v-if="milestone.tier != milestoneCondition.maxTierLevel" class="col-12 d-flex flex-column justify-content-center align-items-center">
      <span class="text-capitalize fst-italic text-light">
        <b class="fst-normal">Next:</b> '{{ milestoneBadge.nextName }}' Badge
      </span>
      <div class="fst-italic">
        {{ milestoneBadge.nextDescription }}
      </div>
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
    </div>

  </section>
</template>


<script>
import { computed } from "vue";
import { accountMilestonesService } from "../services/AccountMilestonesService.js";
import Pop from "../utils/Pop.js";
import { RANK_TYPES } from "../constants";

export default {
  props: {
    milestone: {
      type: Object,
      required: true
    }
  },
  setup(props) {

    const getBadgeInfo = (tier) => {
      const badge = RANK_TYPES[tier - 1]
      if (badge) {
        return {
          html:`
          <div class="d-flex flex-column justify-content-center align-items-center">
            <img src="${badge.IMAGE_URL}" alt="${badge.NAME}" class="img-fluid" style="width: 5rem; height: 5rem;"/>
            <small class="text-uppercase text-light" style="white-space: nowrap;">${badge.NAME}</small>
            <span class="fst-italic">${badge.DESCRIPTION}</span>
          </div>
          `,
          name: badge.NAME,
          text: badge.DESCRIPTION,
        };
      } else {
        return {
          html: `<span class="text-secondary" style="font-style: italic;">Badge: N/A</span>`,
          text: 'No Badges Yet!',
        };
      }
    };

    
    const milestoneBadge = computed(() => {
      const badgeInfo = getBadgeInfo(props.milestone.tier);
      const nextBadgeInfo = getBadgeInfo(props.milestone.tier + 1);
      return {
        current: badgeInfo.html,
        next: nextBadgeInfo.html,
        currentName: badgeInfo.name,
        nextName: nextBadgeInfo.name,
        currentDescription: badgeInfo.text,
        nextDescription: nextBadgeInfo.text
      };
    });

    const milestoneCondition = computed(() => {
      let condition = {};
      const logicStr = props.milestone.milestone.logic;
      const logicParts = logicStr.split('%');
      const operationsArr = logicParts[0].split('-');

      condition.tierThresholdArr = logicParts[1].split('-').map((str) => {
        return parseInt(str);
      });
      condition.maxTierLevel = condition.tierThresholdArr.length + 1;
      condition.operation = operationsArr[1];

      condition.nextTier = props.milestone.tier + 1;
      condition.nextTierThreshold = condition.tierThresholdArr[props.milestone.tier];
      condition.toNextLevel = condition.tierThresholdArr[props.milestone.tier] - props.milestone.count;

      return condition;
    });

    async function claimMilestone(accountMilestone) {
      try {
        accountMilestone.claimed = true;
        await accountMilestonesService.claimMilestone(accountMilestone);
      }
      catch (error) {
        Pop.error(error);
      }
    }

    return {
      milestoneBadge,
      milestoneCondition,
      claimMilestone
    };
  }
}
</script>



<style lang="scss" scoped></style>