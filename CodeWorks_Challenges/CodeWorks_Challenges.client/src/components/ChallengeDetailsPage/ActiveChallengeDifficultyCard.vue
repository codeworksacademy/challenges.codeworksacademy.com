<template>
  <div class="details-card">
    <img v-if="challenge.difficulty === 1" src="../../assets/img/easy-difficulty-chart.svg" :title="`Difficulty Rating: ${challenge.difficulty}`" alt="Easy Difficulty Icon" class="img-fluid" style="width: 70px; height: 50px;">
    <img v-if="challenge.difficulty === 2" src="../../assets/img/medium-difficulty-chart.svg" :title="`Difficulty Rating: ${challenge.difficulty}`" alt="Medium Difficulty Icon" class="img-fluid" style="width: 70px; height: 50px;">
    <img v-if="challenge.difficulty === 3" src="../../assets/img/hard-difficulty-chart.svg" :title="`Difficulty Rating: ${challenge.difficulty}`" alt="Hard Difficulty Icon" class="img-fluid" style="width: 70px; height: 50px;">
    <h3 class="text-capitalize mt-3"> {{ difficulty.text }} </h3>
    <h6 class="text-uppercase">Difficulty</h6>
  </div>
</template>

<script>
import { computed } from 'vue'
import { StrDifficultyNum } from '../../utils/StrDifficultyNum'
import { Challenge } from '../../models/Challenge'

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    }
  },
  setup(props) {

    const difficulty = computed(() => StrDifficultyNum(props.challenge.difficulty))

    return {
      difficulty
    }
  }
}
</script>