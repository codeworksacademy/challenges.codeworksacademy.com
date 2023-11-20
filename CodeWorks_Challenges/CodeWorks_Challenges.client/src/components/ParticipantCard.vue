<template>
  <div  v-if="participant" :key="participant?.id" id="SubmissionsOffcanvas" class="col-1 m-auto d-flex flex-column align-items-center">
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
</template>

<script>
import { ChallengeParticipant } from "../models/ChallengeParticipant.js";
import { computed, onMounted } from "vue";
import { AppState } from "../AppState.js";
import { useRoute } from "vue-router";
import Pop from "../utils/Pop.js";
import { logger } from "../utils/Logger.js";
import { participantsService } from "../services/ParticipantsService.js";

export default {
  props: {
    participant: {
      type: ChallengeParticipant || Object,
      required: true
    }
  },
  setup() {

    const route = useRoute()

    async function getParticipantsByChallengeId() {
      try {
        const challengeId = route.params.challengeId
        await participantsService.getParticipantsByChallengeId(challengeId)
      } catch (error) {
        logger.error(error)
        Pop.toast(error, 'error')
      }
    }

    onMounted(() => {
      getParticipantsByChallengeId()
    })


    return {
      // participant: computed(() => {
      //   return AppState.participants.find(p => p.accountId === AppState.account.id)
      // })
    }
  }
}
</script>