<template>
    <section class="container-fluid mb-3">
      <MarkdownEditor :challenge="challenge" v-model="challenge.description"/>
    </section>
</template>
  
<script>
import { Challenge } from '../../models/Challenge'
import MarkdownEditor from './MarkdownEditor.vue';
  
  export default {
    props: {
        challenge: {
            type: Challenge || Object,
            required: true
        }
    },
    components: { MarkdownEditor }
}
  </script>
  
  <style scoped lang="scss">
  
  </style>
