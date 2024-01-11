<template>
  <div :class="`details-card ${themeStyle ? 'theme-style' : ''} rounded`" :style="{backgroundColor: bgColor, borderColor: color, borderStyle: 'groove'}">
    <i class="mdi mdi-office-building-cog-outline fs-1"></i>
    <h3 class="text-capitalize"> {{ challenge.category }} </h3>
    <h6 class="text-uppercase">Category</h6>
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
    bgColor: {type: String, required: true},
    color: {type: String, required: true},
    themeStyle: {type: Boolean, required: true, default: false}
  }
}
</script>