<template>
  <section class="row bg-dark border border-5 border-secondary-bold text-light p-1 m-1 rounded">
    <div class="col-12">
      <p>
        <span @click="claimMilestone(milestone)" v-if="milestone?.claimed == false"
          class="mdi mdi-circle text-primary selectable">NEW</span><span v-else
          class="mdi mdi-circle-outline text-primary "></span>
      </p>

    </div>

    <div class="col-6">
      <div>
        Current Badge
      </div>
      <!-- Use v-html to render HTML -->
      <div v-html="milestoneIcon.current"></div>
    </div>

    <div v-if="milestone.tier != milestoneCondition.maxTierLevel" class="col-6">
      <div>
        Next Badge
      </div>
      <!-- Use v-html to render HTML -->
      <div v-html="milestoneIcon.next"></div>
    </div>

    <div v-if="milestone.tier != milestoneCondition.maxTierLevel" class="col-6">
      <div>
        Next
      </div>

    </div>

    <div class="col-12">
      <div class="text-uppercase fw-bold text-light">
        {{ milestoneIcon.nextName }}
      </div>
      <div class="fst-italic">
        {{ milestoneIcon.currentDescription }}
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

// Define the getBadgeInfo function
const getBadgeInfo = (tier) => {
  const badge = RANK_TYPES[tier - 1];
  
  if (badge) {
    return {
      html: `<img src="${badge.IMAGE_URL}" alt="${badge.NAME}" class="img-fluid" style="width: 2.5rem; height: 2.5rem; margin-right: .25rem;"/>`,
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

export default {
  props: {
    milestone: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const milestoneIcon = computed(() => {
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

      condition.tierThresholdArr = logicParts[1].split('-');
      condition.maxTierLevel = operationsArr[0];
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
      milestoneIcon,
      milestoneCondition,
      claimMilestone
    };
  }
}
</script>



<style lang="scss" scoped></style>