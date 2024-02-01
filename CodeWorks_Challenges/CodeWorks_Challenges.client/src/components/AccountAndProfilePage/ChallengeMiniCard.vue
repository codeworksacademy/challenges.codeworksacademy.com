<template>
  <div v-if="challenge" :key="challenge?.id"
    class="border-underline background-highlight row d-flex text-light justify-content-between align-items-center pt-2">
    <div class="col-3">
      <p class="m-0 fw-bold fs-5 text-truncate">
        {{ challenge?.name }}
      </p>
      <p class="text-uppercase">
        {{ challenge.difficultyStr?.text }}
      </p>
    </div>
    <div class="col-3">
      <span class="fw-semibold text-uppercase">
        {{ challenge.category }}
      </span>
    </div>
    <div class="col-3">
      <span class="highlight-font fw-semibold fs-5">
        <i class="mdi mdi-diamond-stone me-2 fs-5" :style="{ color: difficulty.color }"></i> {{ challenge.difficulty }}
      </span>
    </div>
    <div class="col-3">
      <div class="d-flex align-items-center justify-space-evenly align-items-center">
        <router-link :to="{ name: 'Challenge.overview', params: { challengeId: challenge?.id } }">
          <button class="btn text-light" title="view challenge">
            <i class="mdi mdi-chevron-right ms-5"></i>
          </button>
        </router-link>
        <i @click="leaveChallenge()" :title="`Leave challenge: '${challenge.name}'`" class="mdi mdi-dots-horizontal m-auto text-muted"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { Challenge } from '../../models/Challenge';
import { difficultyMap } from '../../utils/DifficultyMap.js'
import { AppState } from '../../AppState';
import { participantsService } from '../../services/ParticipantsService';
import Pop from '../../utils/Pop';
import { logger } from '../../utils/Logger';

export default {
  props: {
    challenge: {
      type: [Challenge, Object],
      required: true
    }
  },
  setup(props) {
    async function leaveChallenge() {
      try {
        const removeConfirm = await Pop.confirm("Are you sure you want to leave this challenge? Your points will not be refunded.");
        if (!removeConfirm) {
          return;
        }
        let participant = AppState.ChallengeState.participants.find(p => p.accountId == AppState.AccountState.account.id);
        participant.status = 'left';
        await participantsService.leaveChallenge(participant.id);
        Pop.toast("You have left the challenge!");
      }
      catch (error) {
        logger.error(error);
        Pop.toast(error, "error");
      }
    }
    return {
      leaveChallenge,
      difficulty: computed(() => difficultyMap[props.challenge.difficulty] || difficultyMap.default),
    }
  }
}
</script>

<style lang="scss" scoped>
.border-underline {
  border-bottom: 1px solid #2F3E57;
}

.highlight-font {
  font-family: 'Lekton', sans-serif;
}

.background-highlight:hover {
  background-color: #1A2332;
}
</style>