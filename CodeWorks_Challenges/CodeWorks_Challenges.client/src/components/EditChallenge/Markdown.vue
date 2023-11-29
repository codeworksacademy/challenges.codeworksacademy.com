<template>
    <div class="__q-md-renderer__" v-html="formatted" v-if="!edit"></div>
    <textarea v-else class="form-control __q-md-editor__" rows="10" @input="change" @blur="blur"
      @keydown.tab.exact.prevent="onTab" @keydown.shift.tab.exact.prevent="onShiftTab" :value="modelValue"></textarea>
  </template>
  
  <script>
  import hljs from 'highlight.js'
  import { marked } from 'marked'
  import { computed, watch } from 'vue'
  import insane from 'insane'
  
  export default {
    props: {
      edit: { type: Boolean, default: false },
      value: { type: String, default: '' },
      modelValue: {
        type: String,
        default: ''
      },
      config: {
        type: Object,
        default: () => {
          return {
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false,
            headerIds: false,
            mangle: false,
            langPrefix: 'hljs lang-'
          }
        }
      },
      highlighter: {
        type: Function,
        default(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext'
          return hljs.highlight(code, { language }).value
        }
      },
      theme: { type: String, default: 'night-owl' },
      customStyles: {
        type: String,
        default: ''
      }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      // eslint-disable-next-line vue/no-mutating-props
      props.config.renderer.link = (href, title, text) => `<a target="_blank" href="${href}" title="${title}">${text}</a>`
  
      marked.setOptions({ highlight: props.highlighter, ...props.config })
      let linkElem = document.querySelector('#hljs-theme')
  
      watch(() => props.theme, (old, update) => {
        if (!linkElem) {
          linkElem = document.createElement('link')
          document.body.prepend(linkElem)
          linkElem.id = 'hljs-theme'
          linkElem.rel = 'stylesheet'
        }
        linkElem.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.4.1/styles/${props.theme}.min.css`
      }, { immediate: true })
  
      let md = ''
      function fire() {
        emit('update:modelValue', md)
      }
  
      return {
        formatted: computed(() => (insane(marked(props.modelValue || props.value), {
          "allowedAttributes": {
            "a": ["href", "name", "target"],
            "br": ["class"],
            "code": ["class"],
            "iframe": ["allowfullscreen", "frameborder", "src"],
            "img": ["src"],
            "p": ["class"],
            "span": ["class"]
          },
          "allowedClasses": {},
          "allowedSchemes": ["http", "https", "mailto"],
          "allowedTags": [
            "a", "article", "b", "blockquote", "br", "caption", "code", "del", "details", "div", "em",
            "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "ins", "kbd", "li", "main", "ol",
            "p", "pre", "section", "span", "strike", "strong", "sub", "summary", "sup", "table",
            "tbody", "td", "th", "thead", "tr", "u", "ul"
          ],
          "filter": null,
          "transformText": null
        }))),
        change() {
          md = event.target.value
        },
        blur() {
          md = event.target.value.trim()
          fire()
        },
        onTab() {
          let text = event.target.value
          const originalSelectionStart = event.target.selectionStart
          const textStart = text.slice(0, originalSelectionStart)
          const textEnd = text.slice(originalSelectionStart)
  
          text = `${textStart}\t${textEnd}`
          event.target.value = text
          event.target.selectionEnd = event.target.selectionStart = originalSelectionStart + 1
        },
        onShiftTab() {
          let text = event.target.value
          const originalSelectionStart = event.target.selectionStart
          const textStart = text.slice(0, originalSelectionStart)
          const textEnd = text.slice(originalSelectionStart)
          const i = textStart.lastIndexOf('\t')
          if (i === -1) { return }
          text = `${textStart.slice(0, i)}${textEnd}`
          event.target.value = text
          event.target.selectionEnd = event.target.selectionStart = originalSelectionStart - 1
        }
      }
    }
  }
  </script>
  
  <style lang="scss">
  .collapse:not(.show) {
    .__q-md-renderer__ {
      display: none;
    }
  }
  
  
  .__q-md-renderer__ {
    color: #d6dae3;
    font-size: 17px;
    letter-spacing: .04em;
    line-height: 1.7em;
  
    br.spoiler {
      display: none;
    }
  
    br.spoiler+*,
    div.spoiler {
      position: relative;
  
      &:hover::after {
        opacity: 0;
        transition: all .3s .2s ease-in-out;
        pointer-events: none;
      }
  
      &::after {
        transition: all .3s 60s ease-in-out;
        position: absolute;
        content: "Hover to Reveal";
        display: grid;
        place-content: center;
        background-color: #262127;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        font-weight: bold;
        cursor: pointer;
  
      }
    }
  
    a {
      transition: all .15s linear;
      color: #ffb97f;
      text-decoration: underline;
  
      &::before {
        content: '⭧ ';
      }
  
      &:hover {
        color: #ffcfa8;
        background-color: #383028
      }
    }
  
    p>code,
    li>code,
    div>code {
      font-size: 0.875em;
      color: #00f397;
      word-wrap: break-word;
      background: #091621;
      padding: .3em;
    }
  
  
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 0.5rem;
      margin-bottom: 0;
      font-weight: 600;
      line-height: 2.2;
      letter-spacing: .03em;
      color: #f4d9c4;
    }
  
    img {
      max-width: 70%;
      object-fit: contain;
    }
  
    p:has(img:only-child) {
      text-align: center;
    }
  
    pre {
      border-radius: 5px;
      box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2),
        0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
    }
  }
  
  .__q-md-editor__ {
    min-height: 500px;
    resize: vertical;
  }
  </style>