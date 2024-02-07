import * as monaco from 'monaco-editor';
// @ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// @ts-ignore
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// @ts-ignore
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
// @ts-ignore
import javascriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
// @ts-ignore
import markdownWorker from 'monaco-editor/esm/vs/basic-languages/markdown/markdown.js?worker';
// @ts-ignore
import cSharpWorker from 'monaco-editor/esm/vs/basic-languages/csharp/csharp.js?worker';
import { dracula } from '../assets/themes/monaco-dracula.js';

// @ts-ignore
self.MonacoEnvironment = {
  // @ts-ignore
  getWorker: function(workerId, label) {
    switch (label) {
      case 'cs':
        return new cSharpWorker();
      case 'md':
        return new markdownWorker();
      case 'css':
      case 'scss':
      case 'sass':
      case 'less':
        return new cssWorker();
      case 'html':
      case 'handlebars':
      case 'razor':
        return new htmlWorker();
      case 'typescript':
      case 'javascript':
        return new javascriptWorker();
      default:
        return new editorWorker();
    }
  },
};

// @ts-ignore
monaco.editor.defineTheme('dracula', dracula)

export { monaco };