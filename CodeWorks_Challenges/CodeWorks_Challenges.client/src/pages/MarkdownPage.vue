<template>
    <section class="container-fluid">
        <h1>Markdown</h1>
        <textarea name="" id="" cols="30" rows="10" v-model="editable.markdown">asd</textarea>
        <div v-html="outputMarkdown"></div>
    </section>
</template>
  
<script>
  import { computed, onMounted, watchEffect, ref } from 'vue'
  import {marked} from 'marked'
  import { AppState } from '../AppState'
  import Pop from "../utils/Pop.js"
  import { logger } from "../utils/Logger.js"  
  
  export default {
    components: {

    },
    setup() {
      const editable = ref({ markdown: ''})
      const outputMarkdown = computed(() => marked(editable.value.markdown))
      onMounted(() => {

      })
      return {
        editable,
        outputMarkdown
      } 
    }
  }
  </script>
  
  <style scoped lang="scss">
  

  </style>