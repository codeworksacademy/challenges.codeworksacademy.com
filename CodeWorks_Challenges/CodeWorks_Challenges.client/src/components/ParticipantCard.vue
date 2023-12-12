<template>
  <section class="container-fluid" v-if="participant" :key="participant?.id">
    <div class="d-flex flex-column justify-content-center align-items-center">
        <img
          v-if="participant.status === 'submitted'"
          @click="`${isGrader ? changeRoute('grade') : ''}`"
          :src="participant.profile.picture"
          :title="`${participant.profile.name} has ${participant.status}. Click to grade.`"
          :alt="`Participant Name: ${participant.profile.name} | Current Status: ${participant.status}`"
          class="rounded-circle img-fluid selectable"
          height="150"
          width="150"
        />
        <img
          v-else
          :src="participant.profile.picture"
          :title="`${participant.profile.name} has ${participant.status} but not submitted their challenge. Ineligible for grading.`"
          :alt="`Participant Name: ${participant.profile.name} | Current Status: ${participant.status}`"
          class="rounded-circle img-fluid"
          height="150"
          width="150"
        />
        <p v-if="participant.status == 'completed'" class="text-success">{{ participant.status }}</p>
        <p v-if="participant.status == 'submitted'" class="text-warning">{{ participant.status }}</p>
        <p v-if="participant.status == 'started'" class="text-info">{{ participant.status }}</p>
        <small class="text-truncate"> {{ participant.profile.name }} </small>
    </div>
  </section>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { AppState } from "../AppState.js";
import { ChallengeParticipant } from "../models/ChallengeParticipant.js";

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
      isGrader: computed(() => AppState.moderators.find(m => m.accountId == AppState.account.id || m.originId == AppState.account.id)),
    }
  }
}
</script>