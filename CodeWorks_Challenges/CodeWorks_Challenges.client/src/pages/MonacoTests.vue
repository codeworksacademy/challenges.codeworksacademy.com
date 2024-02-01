<template>
    <section class="container-fluid">
      <div class="row justify-content-between">
        <div class="col-md-6 mt-3">
          <div class="bg-detail rounded-3">
            <h4 class="ps-3 pt-3">Code</h4>
            <CodeEditor/>
          </div>
        </div>
        <div class="col-md-6 mt-3">
          <div class="bg-detail rounded-3">
            <h4 class="ps-3 pt-3">Tests</h4>
            <TestEditor/>
          </div>
        </div>
      </div>
    </section>
</template>
  
<script>
import { ref, onMounted } from 'vue'
import CodeEditor from '../components/MonacoEditor/CodeEditor.vue'
import TestEditor from '../components/MonacoEditor/TestEditor.vue'
  
  export default {
    components: {
    CodeEditor,
    TestEditor
},
    setup(props, {emit}) {
      const code = ref('')
      const tests = ref('')
      onMounted(() => {

      })
      return {
        code,
        tests
      } 
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  .code-editor{
    padding-right: 1rem;
  }

  </style>