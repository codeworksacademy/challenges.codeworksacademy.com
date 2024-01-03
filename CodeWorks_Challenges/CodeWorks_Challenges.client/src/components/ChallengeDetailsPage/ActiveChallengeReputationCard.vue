<template>
  <div class="details-card text-capitalize">
    <i class="mdi mdi-account-star-outline fs-1"></i>
    <h3>+{{ challenge.reputationIds.length }} Rep</h3>
    <h6 class="text-center">Total Reputation</h6>
  </div>
</template>

<script>
import { Challenge } from '../../models/Challenge'
export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    }
  }
}
</script>