<template>
  <div class="monaco-header bg-page lift-6 d-flex align-items-center gap-2 w-100">
    <div v-if="showSave">
      <button type="button" class="btn p-1 clickable-dark square" @click="save">
        <i class="mdi mdi-cloud"></i>
        Save
      </button>
    </div>
    <slot name="toolbar"></slot>
  </div>
  <div class="editor" ref="editorElem"></div>
  <div class="monaco-footer bg-page lift-6 d-flex justify-content-end gap-3">
    <div class="dropup">
      <button type="button" class="btn clickable-dark dropdown-toggle p-1 square" data-bs-toggle="dropdown"
        aria-expanded="false">
        {{ theme }}
      </button>
      <ul class="dropdown-menu">
        <li class="dropdown-item" @click="setTheme(t)" v-for="t in themes" :key="t">{{ t }}</li>
      </ul>
    </div>
    <div class="dropup">
      <button type="button" class="btn clickable-dark dropdown-toggle p-1 square" data-bs-toggle="dropdown"
        aria-expanded="false">
        {{ lang }}
      </button>
      <ul class="dropdown-menu">
        <li class="dropdown-item" @click="setLang(l)" v-for="l in languages" :key="l">{{ l }}</li>
      </ul>
    </div>
  </div>
</template>
  
  
<script>
import { onMounted, ref, watchEffect } from 'vue';
import { monaco } from '../../utils/Monaco.js'
import { saveState, loadState } from '../../utils/Store.js'

export default {
  props: {
    value: { type: String, default: '' },
    language: { type: String, default: 'javascript' },
    showSave: { type: Boolean, default: true }
  },
  emits: ['save', 'change'],
  setup(props, { emit }) {
    const editorElem = ref()
    let editor = null
    const lang = ref('')
    const userSettings = loadState('monaco') || { theme: 'dracula' }
    const theme = ref(userSettings.theme)

    watchEffect(() => {
      lang.value = props.language
    })


    onMounted(() => {
      editor = monaco.editor.create(editorElem.value, {
        value: props.value,
        language: props.language,
        theme: userSettings.theme || 'dracula',
        fontSize: 16,
        automaticLayout: true,
        minimap: { enabled: false }
      })
      const model = editor.getModel()

      model.onDidChangeContent(() => {
        emit('change', editor.getValue())
      });
    })

    return {
      editorElem,
      lang,
      theme,
      languages: ['javascript', 'css', 'html', 'markdown', 'csharp'],
      themes: ['vs', 'vs-dark', 'hc-black', 'dracula', 'github', 'github-dark', 'night-owl', 'sunburst', 'oceanic', 'merbivore'],
      save() {
        emit('save', editor.getValue())
      },
      setLang(l) {
        lang.value = l
        monaco.editor.setModelLanguage(editor.getModel(), l)
      },
      setTheme(t) {
        theme.value = t
        monaco.editor.setTheme(t)
        userSettings.theme = t
        saveState('monaco', userSettings)
      }
    }
  }
}
</script>
  
  
<style lang="scss" scoped>
.editor {
  min-height: 500px;
}
</style>