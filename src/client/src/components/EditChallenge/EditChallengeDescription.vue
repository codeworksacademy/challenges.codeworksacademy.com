<template>
  <section class="px-2 mb-4">
    <MarkdownEditor :challenge="challenge" v-model="challenge.description" />
  </section>
</template>
  
<script>
import { Challenge } from '../../models/Challenge'
import MarkdownEditor from './MarkdownEditor.vue';

export default {
  components: { MarkdownEditor },
  props: {
    challenge: {
      type: Challenge || Object,
      required: true
    }
  },
  setup() {
    return {

    }
  }
}
</script>
  
<style scoped lang="scss"></style>
