<template>
  <div class="container-fluid p-0 text-light" v-if="challenge">
    <section class="row border-underline background-highlight selectable rounded align-items-center pt-2"
      @click="openChallenge(challenge.id)">
      <div class="col-11">
        <section class="row">
          <div class="col-12 col-lg-6">
            <p class="m-0 fw-bold fs-5 text-truncate">
              {{ challenge?.name }}
            </p>
          </div>

          <div class="col-8 col-lg-4">
            <span class="fw-semibold text-uppercase">
              {{ challenge.category }}
            </span>
          </div>

          <div class="col-4 col-lg-2 d-flex justify-content-center">
            <span class="highlight-font fw-semibold fs-5">
              <i class="mdi mdi-diamond-stone me-2 fs-5" :style="{ color: difficulty.color }"></i>
              {{ challenge.difficulty }}
            </span>
          </div>
        </section>
      </div>

      <div class="col-1 my-2 d-flex justify-content-md-center">
        <span v-if="isMyProfile">
          <div v-if="isParticipant?.status == 'completed'" class="me-2">
            <i title="Challenge completed!" class="mdi mdi-check-outline text-warning fs-5"></i>
          </div>
          <div v-if="type == 'Participating' && isParticipant?.status != 'completed'">
            <i @click.stop="leaveChallenge()" :title="`Leave challenge: '${challenge.name}'`"
            class="mdi mdi-file-cancel-outline text-muted fs-5"></i>
          </div>
        </span>
        <span v-if="type == 'Created'">
            <i class="mdi mdi-earth fs-5 text-primary" title="Status: Published" v-if="challenge.status == 'published'"></i>
            <i class="mdi mdi-earth-off fs-5 text-danger" title="Status: Deprecated" v-else-if="challenge.status == 'deprecated'"></i>
            <i class="mdi mdi-book-edit-outline fs-5 text-muted" title="Status: Editing" v-else></i>
        </span>
      </div>

    </section>
  </div>
</template>

<script>
import Pop from '../../utils/Pop.js';
import { computed } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { AppState } from '../../AppState.js';
import { Challenge } from '../../models/Challenge.js';
import { difficultyMap } from '../../utils/DifficultyMap.js';
import { participantsService } from '../../services/ParticipantsService.js';

export default {
  props: {
    challenge: { type: [Challenge, Object], required: true },
    type: { type: String, required: true }
  },

  setup(props) {
    const route = useRoute();
    const router = useRouter();

    async function leaveChallenge() {
      try {
        const yes = await Pop.confirm("Are you sure you want to leave this challenge? Your points will not be refunded.");
        if (!yes) { return; }

        const participant = AppState.ChallengeState.participants.find(p => p.accountId == AppState.AccountState.account.id);
        participant.status = 'left';
        await participantsService.leaveChallenge(participant.id);

        Pop.success("You have left the challenge!");
      }
      catch (error) { Pop.error('[CHALLENGE MINI CARD] leaveChallenge:: ' + error); }
    }

    return {
      route,
      leaveChallenge,
      difficulty: computed(() => difficultyMap[props.challenge.difficulty] || difficultyMap.default),
      isParticipant: computed(() => AppState.AccountState?.participation?.find(p => p.challengeId == props.challenge.id)),
      isMyProfile: computed(() => route.params.profileId == AppState.AccountState.account.id),

      openChallenge(challengeId) {
        router.push({ name: 'Challenge.overview', params: { challengeId } });
      },
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