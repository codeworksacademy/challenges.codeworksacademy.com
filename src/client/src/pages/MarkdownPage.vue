<template>
  <section class="container-fluid">
    <div class="row">
      <div class="col-md-6">
        <!-- <h1>Markdown</h1> -->
        <!-- <textarea name="" id="" cols="30" rows="10" v-model="editable.markdown">asd</textarea> -->
        <!-- <Markdown/> -->
      </div>
      <div class="col-md-6">
        <!-- <div v-html="outputMarkdown" class="text-light markdown-text"></div> -->
      </div>
      <MarkdownEditor :challenge="challenge"/>
    </div>
  </section>
  <section class="container-fluid">
  </section>
</template>
  
<script>
import { computed, ref } from 'vue'
import { marked } from 'marked'
import { AppState } from '../AppState'
import MarkdownEditor from '../components/EditChallenge/MarkdownEditor.vue'
import Markdown from '../components/EditChallenge/Markdown.vue'

export default {
  components: {
    // MarkEditor,
    Markdown,
    MarkdownEditor
  },
  setup() {
    const editable = ref({ markdown: '' })
    const outputMarkdown = computed(() => marked(editable.value.markdown))
    const challenge = AppState.ChallengeState.challenge
    return {
      editable,
      challenge,
      outputMarkdown
    }
  }
}
</script>
  
<style scoped lang="scss">
.markdown-text{
  color: red;
}
</style>