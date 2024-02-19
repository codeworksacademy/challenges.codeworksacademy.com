<template>
  <div class="text-uppercase badge p-0" :style="{ color: styleSet?.COLOR, backgroundColor: styleSet?.FILL_PATH }"
    v-if="titleName">
    <i class="mdi" :class="styleSet.MDI_ICON"></i>
    {{ titleName }}
  </div>
</template>


<script>
import { computed } from 'vue';
import { RANK_BADGE } from '../constants/index.js';

export default {
  props: {
    titleName: { type: String, required: true, default: 'bugs bunny' }
  },
  setup(props) {
    return {
      styleSet: computed(() => RANK_BADGE.find(b => b.NAME.toLowerCase() == props.titleName.toLowerCase()))
    }
  }
}
</script>


<style lang="scss" scoped></style>