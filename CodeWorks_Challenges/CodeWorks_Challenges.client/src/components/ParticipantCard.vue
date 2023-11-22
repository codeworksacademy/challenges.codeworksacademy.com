<template>
  <section class="container-fluid" v-if="participant" :key="participant.id">
    <div v-for="p in activeSubmission" :key="p.id" class="col-1 m-auto d-flex flex-column align-items-center">
      <router-link :to="{ name: 'Profile', params: { profileId: participant.profile.id } }">
        <img
          :src="participant.profile.picture"
          :title="`PARTICIPANT: ${participant.profile.name} ➡️ STATUS: ${participant.status}`"
          :alt="`Participant Name: ${participant.profile.name} | Current Status: ${participant.status}`"
          class="rounded-circle img-fluid"
        />
      </router-link>
      <small class="text-truncate"> {{ participant.profile.name }} </small>
    </div>
  </section>
</template>

<script>
import { ChallengeParticipant } from "../models/ChallengeParticipant.js";
import { computed } from "vue";
import { AppState } from "../AppState.js";

export default {
  // props: {
  //   participant: {
  //     type: ChallengeParticipant || Object,
  //     required: true
  //   }
  // },
  setup() {


    return {
      participant: computed(() => AppState.participants.find(p => p.id === AppState.activeParticipant?.id)),
      activeSubmission: computed(() => {
        const participant = AppState.participants.find(p => p.id === AppState.activeParticipant.id)
        if (participant.value.status === 'submitted') {
          return AppState.challenges.find(challenge => challenge.id === participant.challengeId)
        }
        return null;
      }),
    }
  }
}
</script>