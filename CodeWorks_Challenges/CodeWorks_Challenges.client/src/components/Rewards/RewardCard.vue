<template>
  <section class="container fluid" v-if="reward" :key="reward?.id">
    <p> {{ reward }} </p>
  </section>
</template>
<script>
import { computed } from 'vue'
import { AppState } from '../../AppState.js'
import RewardCard from '../../components/Rewards/RewardCard.vue'
import { Reward } from "../../models/Reward.js"

export default {

  props: {
    reward: {
      type: Reward || Object,
      required: true
    }
  },

  setup() {
    return {

    }
  }
}
</script>

<style lang="scss">

</style>