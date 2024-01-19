<template>
    <div v-if="participant" :key="participant.id">
      <div class="card bg-dark p-3 text-white mb-2" style="width: 100%;">
        <div class="col-12 d-flex justify-content-around align-items-center">
          <h4>{{ participant.profile.name }} bas earned {{ participant.badges.length }} badges!</h4>
          <h4>Badges {{ participant.profile.name  }} has earned</h4>
        </div>
        <div class="col-12 d-flex flex-wrap justify-content-center align-items-center">
          <div v-for="badge in participant.badges" :key="badge" class="mb-0">
            <ChallengeBadge
              class="my-0 me-3"
              :badge="badge"
            />
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import ChallengeBadge from "../ChallengePage/ChallengeBadge.vue"
import { computed } from "vue";
import { AppState } from '../../AppState';
import { ChallengeParticipant } from '../../models/ChallengeParticipant';

export default {
  props: {
    participant: {
      type: ChallengeParticipant || Object,
      required: true
    }
  },
  setup() {
    return { 
    }
  },
  components: {
    ChallengeBadge
  }
}

</script>