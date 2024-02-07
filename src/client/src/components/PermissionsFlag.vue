<template>
  <section class="permission-flag" :class="permissions" v-if="isVisible">
    <slot></slot>
  </section>
</template>
  
<script>
import { computed, watch, ref } from 'vue'
import { AppState } from "../AppState.js"
import { AuthService } from "../services/AuthService.js"

export default {
  props: {
    permissions: { type: [String, Array] }
  },
  setup(props) {

    const account = computed(() => AppState.AccountState.account)

    const isVisible = ref(false)

    watch(account, () => {
      isVisible.value = AuthService.hasPermissions(props.permissions)
    }, { immediate: true })


    return {
      isVisible,
      account
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