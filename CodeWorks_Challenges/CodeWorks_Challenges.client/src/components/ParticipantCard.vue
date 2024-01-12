<template>
  <section class="container-fluid" v-if="participant" :key="participant?.id">
    <div class="d-flex flex-column justify-content-center align-items-center">
        <router-link v-if="participant.status === 'submitted' && isGrader" :to="{ name: 'Challenge.gradeSubmissionsPage' }">
          <img
            :src="participant.profile.picture"
            :title="`${participant.profile.name} has ${participant.status}. Click to grade.`"
            :alt="`Participant Name: ${participant.profile.name} | Current Status: ${participant.status}`"
            class="rounded-circle img-fluid selectable"
            height="150"
            width="150"
          />
        </router-link>
        <router-link v-else :to="{ name: 'Profile.overview', params: { profileId: participant.profile?.id } }">
          <img
            :src="participant.profile.picture"
            :title="`Click to Visit ${participant.profile.name}'s Profile Page`"
            :alt="`Participant Name: ${participant.profile.name} | Current Status: ${participant.status}`"
            class="rounded-circle img-fluid selectable"
            height="150"
            width="150"
          />
        </router-link>
        <p v-if="participant.status == 'completed'" class="text-success">{{ participant.status }}</p>
        <p v-if="participant.status == 'submitted'" class="text-warning">{{ participant.status }}</p>
        <p v-if="participant.status == 'started'" class="text-info">{{ participant.status }}</p>
        <small class="text-truncate"> {{ participant.profile.name }} </small>
    </div>
  </section>
</template>

<script>
import { computed } from "vue";
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

    return {
      profile: computed(() => {
        return AppState.ProfileState.profile
      }),
      isGrader: computed(() => AppState.ChallengeState.moderators.find(m => m.accountId == AppState.AccountState.account.id || m.originId == AppState.AccountState.account.id)),
    }
  }
}
</script>