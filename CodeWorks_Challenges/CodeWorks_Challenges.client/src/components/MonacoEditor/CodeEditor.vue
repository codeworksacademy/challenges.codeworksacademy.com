<template>
    <section class="">
      <MonacoEditor language="javascript" :value="editable" @change="change"/>
      <div class="p-2 mb-3 mx-2 mt-2 bg-dark rounded-2 bg-detail" v-if="editable">
        {{ editable }}
      </div>
    </section>
</template>
  
<script>
  import { computed, onMounted, ref, watchEffect } from 'vue'
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