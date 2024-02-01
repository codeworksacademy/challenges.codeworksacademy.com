<template>
    <section class="container-fluid">
      <MonacoEditor language="javascript" :value="editable" @change="change"/>
      <div class="bg-dark">
        {{ editable }}
      </div>
    </section>
</template>
  
<script>
  import { computed, onMounted, ref, watch, watchEffect } from 'vue'
  import MonacoEditor from './MonacoEditor.vue'
  
  export default {
    props: {
      modelValue: {type: String, default: ''}
    },
    components: {
      MonacoEditor
    },
    setup(props, {emit}) {
      const editable = ref('')
      onMounted(() => {

      })
      watchEffect(() => {
        editable.value = props.modelValue
      })
      return {
        editable,
        change(value) {
          editable.value = value
          emit('update:modelValue', value)
        },
        save(value) {
          editable.value = value
          emit('update:modelValue', value)
          emit('save')
        }
      } 
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  </style>