<template>
  <section class="container-fluid">
    <div class="row">
      <div class="col-12">
        <MarkdownEditor :challenge="challenge" />
      </div>
    </div>
  </section>
</template>
  
<script>
import { AppState } from '../AppState.js'
import MarkdownEditor from '../components/EditChallenge/MarkdownEditor.vue'

export default {
  components: { MarkdownEditor },
  setup() {
    const challenge = AppState.ChallengeState.challenge;
    return {
      challenge,
    }
  }
}
</script>
  
<style scoped lang="scss">
.markdown-text {
  color: red;
}
</style>