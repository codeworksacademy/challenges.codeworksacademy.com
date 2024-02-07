<template>
  <div class="text-uppercase badge p-0" :style="{ color: style?.COLOR, backgroundColor: style?.FILL_PATH }" v-if="title">
    <i class="mdi" :class="style.MDI_ICON"></i>
    {{ title }}
  </div>
</template>


<script>
import { computed } from 'vue';
import { RANK_BADGE } from '../constants/index.js';

export default {
  props: {
    title: { type: String, required: true }
  },
  setup(props) {
    return {
      style: computed(() => RANK_BADGE.find(b => b.NAME.toLowerCase() == props.title.toLowerCase()))
    }
  }
}
</script>


<style lang="scss" scoped>
.bugs-bunny {}
</style>