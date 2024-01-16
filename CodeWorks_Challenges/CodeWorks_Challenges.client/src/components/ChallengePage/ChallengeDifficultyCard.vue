<template>
  <div :class="`details-card ${themeStyle ? 'theme-style' : ''} rounded`"
    :style="{ backgroundColor: bgColor, borderColor: color, borderStyle: 'groove' }">
    <img v-if="challenge.difficulty === 1" src="../../assets/img/easy-difficulty-chart.svg"
      :title="`Difficulty Rating: ${challenge.difficulty}`" alt="Easy Difficulty Icon" class="img-fluid"
      style="width: 70px; height: 50px;">
    <img v-if="challenge.difficulty === 2" src="../../assets/img/medium-difficulty-chart.svg"
      :title="`Difficulty Rating: ${challenge.difficulty}`" alt="Medium Difficulty Icon" class="img-fluid"
      style="width: 70px; height: 50px;">
    <img v-if="challenge.difficulty === 3" src="../../assets/img/hard-difficulty-chart.svg"
      :title="`Difficulty Rating: ${challenge.difficulty}`" alt="Hard Difficulty Icon" class="img-fluid"
      style="width: 70px; height: 50px;">
    <h3 class="text-capitalize mt-3"> {{ difficulty.text }} </h3>
    <h6 class="text-uppercase">Difficulty</h6>
  </div>
</template>

<script>
import { computed } from 'vue'
import { Challenge } from '../../models/Challenge'
import { StrDifficultyNum } from '../../utils/StrDifficultyNum'

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
  setup(props) {

    const difficulty = computed(() => StrDifficultyNum(props.challenge.difficulty))

    return {
      difficulty
    }
  }
}
</script>