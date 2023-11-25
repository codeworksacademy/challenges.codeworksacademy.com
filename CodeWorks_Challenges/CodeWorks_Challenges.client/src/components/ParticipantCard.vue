<template>
  <section class="container-fluid" v-if="participant" :key="participant?.id">
    <div class="d-flex flex-column justify-content-center align-items-center">
      
        <img
          :src="participant.profile.picture"
          :title="`PARTICIPANT: ${participant.profile.name} ➡️ STATUS: ${participant.status}`"
          :alt="`Participant Name: ${participant.profile.name} | Current Status: ${participant.status}`"
          class="rounded-circle img-fluid"
          height="50"
          width="50"
        />
      <small class="text-truncate"> {{ participant.profile.name }} </small>
    </div>
  </section>
</template>

<script>
import { ChallengeParticipant } from "../models/ChallengeParticipant.js";
import { computed } from "vue";
import { AppState } from "../AppState.js";

export default {
  props: {
    participant: {
      type: ChallengeParticipant || Object,
      required: true
    }
  },
  setup() {


    return {
      profile: computed(() => {
        return AppState.profiles.find(p => p.id === AppState.activeParticipant?.profile.id)
      }),
      activeSubmission: computed(() => {
        const participant = AppState.participants.find(p => p.id === AppState.activeParticipant?.id)
        if (participant.value.status === 'submitted') {
          return AppState.challenges.find(challenge => challenge.id === participant.challengeId)
        }
        return null;
      }),
    }
  }
}
</script>