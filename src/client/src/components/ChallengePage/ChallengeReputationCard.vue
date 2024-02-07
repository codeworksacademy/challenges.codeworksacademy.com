<template>
  <div class="details-card d-flex justify-content-center align-items-center rounded text-capitalize pt-3"
    :style="{ backgroundColor: bgColor, color, borderColor: color }">

    <i class="mdi mdi-account-star-outline"></i>
    <div class="d-flex flex-column justify-content-center align-items-center text-uppercase pb-5 pt-3">
      <h3 class="text-capitalize">{{ challenge.reputationIds.length }} Reputation</h3>
    </div>
  </div>
</template>

<script>
import { Challenge } from '../../models/Challenge'
import { computed } from 'vue'
import { AppState } from '../../AppState'
import { challengesService } from '../../services/ChallengesService'
import Pop from '../../utils/Pop'
import GiveRepButton from './GiveRepButton.vue'

export default {
    props: {
        challenge: {
            type: Challenge || Object,
            required: true
        },
        bgColor: { type: String, required: true },
        color: { type: String, required: true },
        themeStyle: { type: Boolean, required: true, default: false }
    },
    
    components: { GiveRepButton }
}
</script>

<style scoped lang="scss">

</style>