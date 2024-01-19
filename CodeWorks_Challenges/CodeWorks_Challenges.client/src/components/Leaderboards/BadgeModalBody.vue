<template>
  <section class="container-fluid" v-if="participant" :key="participant.id">
    <div class="p-3 text-white mt-3" style="width: 100%; background-color: var(--bg-main); border: 2px solid var(--border-main); border-radius: 10px;">
      <div class="col-12 d-flex justify-content-around align-items-center">
        
      </div>
      <div class="col-12 d-flex flex-wrap justify-content-center align-items-center">
        <div v-for="badge in participant.badges" :key="badge" class="mb-0">
          <ChallengeBadge
            class="m-3"
            :badge="badge"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ChallengeParticipant } from '../../models/ChallengeParticipant';
import ChallengeBadge from "../ChallengePage/ChallengeBadge.vue";

export default {
  props: {
    participant: {
      type: [ChallengeParticipant || Object],
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