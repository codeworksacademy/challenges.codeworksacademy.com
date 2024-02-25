<template>
  <div class="details-card rounded p-0" :style="{ backgroundColor: bgColor, borderColor: color, color: color }">
    <slot></slot>
    <i class="mdi fs-1" :class="icon"></i>
    <h3 class="text-capitalize text-light"> {{ value || val }}</h3>
    <h6 class="text-uppercase">{{ prop }}</h6>
  </div>
</template>

<script>
import { Challenge } from '../../models/Challenge.js'

export default {
  props: {
    challenge: {
      type: [Challenge, Object],
      required: true
    },
    bgColor: { type: String, required: true, default: '#00000000' },
    color: { type: String, required: true },
    icon: { type: String, required: true },
    prop: { type: String, required: true },
    value: { type: [String, Number], default: '' }
  },
  setup(props) {
    return {
      val: props.challenge[props.prop]
    }
  }
}
</script>

<style lang="scss" scoped>
.details-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #f0f0f0;
  background: #1c2332;
  text-align: center;
  border-style: groove;
  position: relative;
  overflow: hidden;
}
</style>