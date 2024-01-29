<template>
  <div class="details-card rounded p-0" :style="{ backgroundColor: bgColor, borderColor: color, color: color }">
    <slot></slot>
    <i class="mdi fs-1" :class="icon"></i>
    <h3 class="text-capitalize text-light"> {{ value || val || 0 }}</h3>
    <h6 class="text-uppercase">{{ prop }}</h6>
  </div>
</template>

<script>
import { Challenge } from '../../models/Challenge'

export default {
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    },
    bgColor: { type: String, required: true },
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
  max-height: 125vh;
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

@media screen and (max-width: 768px) {
  .mdi-account-star-outline {
    position: relative;
    top: 15%;
    margin-bottom: 1rem;
    font-size: 3rem;
    transform: translateX(-10%);
  }
}
</style>