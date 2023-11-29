<template>
    <div class="markdown-editor">
      <div class="d-flex">
        <div class="editor h-100 sticky-top" v-if="!showPreview">
          <MonacoEditor language="markdown" :value="editable" @change="change" @save="save" :showSave="showSave">
            <template #toolbar>
              <div class="text-end flex-grow-1">
                <button type="button" class="btn clickable-dark square" @click="showPreview = !showPreview">
                  <i class="mdi" :class="showPreview ? 'mdi-eye' : 'mdi-eye-off'"></i>
                </button>
              </div>
            </template>
          </MonacoEditor>
        </div>
        <div class="editor bg-page drop-4" v-else>
          <div class="bg-light">
            <div class="text-end flex-grow-1">
              <button type="button" class="btn clickable-dark square" @click="showPreview = !showPreview">
                <i class="mdi" :class="showPreview ? 'mdi-eye' : 'mdi-eye-off'"></i>
              </button>
            </div>
          </div>
          <div class="p-3">
            <Markdown class="__q-md-renderer__" v-model="editable" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import { ref, watchEffect } from 'vue';
  
  export default {
    props: {
      modelValue: { type: String, default: '' },
      showSave: { type: Boolean, default: true },
      startPreview: { type: Boolean, default: false }
    },
    emits: ['update:modelValue', 'save'],
    setup(props, { emit }) {
      const editable = ref('')
      const showPreview = ref(props.startPreview)
  
      watchEffect(() => {
        editable.value = props.modelValue
      })
  
      return {
        editable,
        showPreview,
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
  
  
  <style lang="scss" scoped>
  .editor {
    overflow: hidden;
    flex-grow: 1;
  }
  </style>