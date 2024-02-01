<template>
    <section class="container-fluid">
      <div class="row">
        <div class="col-md-6 bg-detail mt-3">
          
        </div>
        <div class="col-md-6 bg-detail mt-3">
          <h4 class="ps-3 pt-3">Tests</h4>
          <MonacoEditor language="javascript" :value="tests"/>
          <p>{{ tests }}</p>
        </div>
      </div>
    </section>
</template>
  
<script>
  import { ref, computed, onMounted, watchEffect } from 'vue'
  import { AppState } from '../AppState'
  import Pop from "../utils/Pop.js"
  import { logger } from "../utils/Logger.js"  
  import MonacoEditor from '../components/MonacoEditor/MonacoEditor.vue'
  
  export default {
    components: {

    },
    setup(props, {emit}) {
      const code = ref('asd')
      const tests = ref('')

      // watchEffect(() => {
      //   code.value = props.modelValue
      // })

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
  
  </style>