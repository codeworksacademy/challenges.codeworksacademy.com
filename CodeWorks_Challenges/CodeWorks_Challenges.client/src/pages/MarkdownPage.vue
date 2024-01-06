<template>
  <section class="container-fluid">
    <h1>Markdown</h1>
    <textarea name="" id="" cols="30" rows="10" v-model="editable.markdown">asd</textarea>
    <div v-html="outputMarkdown"></div>
  </section>
  <section class="container-fluid">
    <MarkdownEditor />
  </section>
</template>
  
<script>
import { computed, ref } from 'vue'
import { marked } from 'marked'

import MarkdownEditor from '../components/EditChallenge/MarkdownEditor.vue'

export default {
  components: {
    MarkEditor,
    MarkdownEditor
  },
  setup() {
    const editable = ref({ markdown: '' })
    const outputMarkdown = computed(() => marked(editable.value.markdown))

    return {
      editable,
      outputMarkdown
    }
  }
}
</script>
  
<style scoped lang="scss"></style>