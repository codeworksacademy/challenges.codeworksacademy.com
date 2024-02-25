<template>
  <div :class="`details-card ${themeStyle ? 'theme-style' : ''} rounded`"
    :style="{ backgroundColor: bgColor, borderColor: color, borderStyle: 'groove' }">
    <img :src="`../../assets/img/{{difficulty}}-difficulty-chart.svg`"
      :title="`Difficulty Rating: ${challenge.difficulty}`" alt="{{difficulty}} Difficulty Icon" class="difficulty-styled">
    <h3 class="text-capitalize mt-3"> {{ difficulty }} </h3>
    <h6 class="text-uppercase">Difficulty</h6>
  </div>
</template>

<script>
import { computed } from 'vue'
import { Challenge } from '../../models/Challenge'

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

    const difficulty = computed(() => {
      switch (props.challenge.difficulty) {
        case 1:
          return 'easy';
        case 2:
          return 'medium';
        case 3:
          return 'hard';
        default:
          return 'Not Specified';
      }
    })

    return {
      difficulty
    }
  }
}
</script>

<style scoped lang="scss">
.difficulty-styled{
  width: 1.5rem; 
  height: 1.5rem; 
  margin-right: .25rem;
}
</style>