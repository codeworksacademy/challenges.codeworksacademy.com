<template>
    <div v-if="participant" :key="participant?.id" class="col-12 score-card d-flex justify-space-evenly text-white my-0 px-3 py-2 border text-white" style="background: linear-gradient(90deg, var(--shadow-orange) 10%, var(--shadow-purple) 53%, var(--shadow-blue) 81%, var(--shadow-green) 100%,)">
        <span class="pe-3">{{ index }}</span>
        <span class="col-4">Name: {{ participant.profile.name }}</span>
        <span class="col-3 text-center">Badge Count: {{ participant.challenge?.badges?.length }}</span>
        <span class="col-3 text-center">Rank: {{ participant.profile.rank }}</span>
        <span class="col-2 text-end pe-4">Rep: {{ participant.profile.reputation }}</span>
    </div>
</template>

<script>
import { ChallengeParticipant } from "../../models/ChallengeParticipant.js";

export default {
  props: {
    participant: {
      type: ChallengeParticipant || Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
      default: 0
    }
  },
  setup () {
    return {
      
    }
  }
}

</script>

<style scoped lang="scss">
.score-card {
  position: relative;
  background: linear-gradient(90deg, var(--shadow-orange) 10%, var(--shadow-purple) 53%, var(--shadow-blue) 81%, var(--shadow-green) 100%,) !important;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 1px);
    background: #00000050;
  
  }
  span {
    display: inline-block;
    color: var(--text-light) !important;
    text-shadow: 2px 2px 2px var(--border-dark);
    z-index: 1;
  }
}
</style>