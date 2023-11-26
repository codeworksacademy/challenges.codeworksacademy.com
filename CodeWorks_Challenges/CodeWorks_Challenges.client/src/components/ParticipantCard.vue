<template>
  <section class="container-fluid" v-if="participant" :key="participant?.id">
    <div class="d-flex flex-column justify-content-center align-items-center">
      
        <img
          v-if="participant.status === 'submitted'"
          @click="changeRoute('grading')"
          :src="participant.profile.picture"
          :title="`${participant.profile.name} has ${participant.status}. Click to grade.`"
          :alt="`Participant Name: ${participant.profile.name} | Current Status: ${participant.status}`"
          class="rounded-circle img-fluid selectable"
          height="50"
          width="50"
        />
        <img
          v-else
          :src="participant.profile.picture"
          :title="`${participant.profile.name} has ${participant.status} but not submitted their challenge. Ineligible for grading.`"
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
import { useRouter } from "vue-router";

export default {
  props: {
    participant: {
      type: ChallengeParticipant || Object,
      required: true
    }
  },
  setup() {

    const router = useRouter();

    function changeRoute(route){
            router.push({
                    path: `${route}/`
            })
        }

    return {
      changeRoute,
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