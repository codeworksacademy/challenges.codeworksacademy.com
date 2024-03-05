<template>
  <div class="bg-dark text-white p-3 p-md-5">
    {{ error?.message || 'something went wrong' }}

    <details>
      <summary>
        View Trace
      </summary>
      <pre><code>{{ JSON.stringify(error, null, 2) }}</code></pre>
    </details>

  </div>
</template>


<script>
import { computed } from 'vue';
import { AppState } from '../AppState.js';


export default {
  setup() {

    return {
      error: computed(() => AppState.error)
    }

  }
}
</script>


<style lang="scss" scoped></style>