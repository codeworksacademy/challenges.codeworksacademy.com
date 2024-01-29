<template>
    <div class="markdown-editor">
      <div class="d-flex bg-menu rounded-3">
        <div class="editor h-100 sticky-top" v-if="!showPreview">
          <MonacoEditor language="markdown" :value="editable" @change="change" @save="save" :showSave="showSave">
            <template #toolbar>
              <div class="text-end flex-grow-1">
                <button type="button" class="btn clickable-dark square text-light" @click="showPreview = !showPreview">
                  <i class="mdi" :class="showPreview ? 'mdi-eye' : 'mdi-eye-off'"></i>
                </button>
              </div>
            </template>
          </MonacoEditor>
        </div>
        <div class="editor bg-page drop-4" v-else>
          <div class="menu-border">
            <div class="text-end flex-grow-1 text-light">
              <div class="d-flex justify-content-between ">
                <span class="text-light fs-6 pt-2 ps-3">Description Preview</span>
                <button type="button" class="btn clickable-dark square" @click="showPreview = !showPreview">
                  <i class="mdi" :class="showPreview ? 'mdi-eye' : 'mdi-eye-off'"></i>
                </button>
              </div>
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
  import Markdown from './Markdown.vue';
  import MonacoEditor from './MonacoEditor.vue';
  import { Challenge } from '../../models/Challenge';
  
  export default {
    props: {
      challenge: {type: Challenge},
      modelValue: { type: String, default: '' },
      showSave: { type: Boolean, default: true },
      startPreview: { type: Boolean, default: false }
    },
    emits: ['update:modelValue', 'save'],
    setup(props, { emit }) {
      const editable = ref('')
      // const editable = ref(props.challenge.description)
      const showPreview = ref(props.startPreview)
  
      watchEffect(() => {
        // editable.value = props.modelValue
        editable.value = props.challenge.description
        // editable.value = 'Hello World'
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
    .bg-menu {
    background-color: #1c2332;
    border: 1px solid #2d386b;
  }
  .menu-border{
    border-bottom: 1px solid #2d386b;
  }
  .editor {
    overflow: hidden;
    flex-grow: 1;
  }
  </style>