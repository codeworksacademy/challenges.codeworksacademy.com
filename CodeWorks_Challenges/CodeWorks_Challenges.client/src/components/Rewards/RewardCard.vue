<template>
  <section class="container fluid" v-if="reward" :key="reward?.id">
    <p> {{ reward }} </p>
    <div>
      <Completionist />
    </div>
  </section>
</template>
<script>
import { computed } from 'vue'
import { AppState } from '../../AppState.js'
import Completionist from '../../components/Rewards/Badges/Completionist.vue'
import { Reward } from "../../models/Reward.js"


export default {

  props: {
    reward: {
      type: Reward || Object,
      required: true
    }
  },

  components: {
    Completionist
  },

  setup() {
    return {

    }
  }
}
</script>

<style lang="scss">

</style>