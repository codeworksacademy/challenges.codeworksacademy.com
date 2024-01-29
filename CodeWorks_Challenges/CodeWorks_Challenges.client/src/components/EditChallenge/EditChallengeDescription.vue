<template>
    <section class="container-fluid mb-3">
      <MarkdownEditor :challenge="challenge"/>
      <!-- <div class="form-floating text-end">
        <textarea v-model="challenge.description" class="form-control" placeholder="Challenge Description" id="challengeDescriptionTextArea" style="height: 300px"></textarea>
        <button class="btn btn-success">Edit in Markdown</button>
      </div> -->
    </section>
</template>
  
<script>
  import {Challenge} from '../../models/Challenge'
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
