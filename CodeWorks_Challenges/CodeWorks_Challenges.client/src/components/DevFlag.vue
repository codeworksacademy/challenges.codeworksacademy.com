<template>
  <section class="dev-flag" v-if="inDev">
    <slot></slot>
  </section>
</template>
  
<script>
import { computed } from 'vue'
import { dev } from "../env.js"

export default {
  components: {

  },
  setup() {
    return {
      inDev: computed(() => dev)
    }
  }
}
</script>
  
<style scoped lang="scss">
.dev-flag {
  outline: 1px dotted var(--bs-danger);

  &:before {
    content: "⚠️ - Dev Only";
    top: -1em;
    position: absolute;
    font-size: 11px;
    background: black;
  }
}
</style>