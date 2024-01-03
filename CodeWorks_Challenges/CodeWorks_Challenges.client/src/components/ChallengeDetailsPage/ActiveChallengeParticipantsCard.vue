<template>
  <div class="details-card">
    <div v-if="isOwned || isModerator">
      <i class="mdi mdi-bell fs-1"></i>
      <h3> {{ challenge.completedCount }} / {{ challenge.participantCount }} </h3>
      <h6 class="text-uppercase">Completed<br> Participants</h6>
    </div>
    <div v-else>
      <i class="mdi mdi-diamond fs-1"></i>
      <h3> {{ challenge.difficulty }} </h3>
      <h6 class="text-uppercase">Points</h6>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { AppState } from '../../AppState'
import { Challenge } from '../../models/Challenge'

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    }
  },
  setup(props) {
    const isOwned = computed(() => {
      return AppState.user.id === props.challenge.creatorId
    })
    const isModerator = computed(() => {
      return AppState.moderations.find(m => m.accountId === AppState.user.id)
    })
    return {
      isOwned,
      isModerator
    }
  }
}
</script>