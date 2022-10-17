<template>
  <prism-editor
    class="vue-code-editor"
    v-model="content"
    :highlight="highlighter"
    line-numbers
  ></prism-editor>
</template>

<script>
import readOnlyViewCode from "!!raw-loader!./cases/sample/ReadOnlyView.vue";
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; 
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

export default {
  name: "App",
  props: ["filename"],
  components: {
    PrismEditor,
  },
  setup(props) {
    const codeMap = {
      "ReadOnlyView.vue": readOnlyViewCode,
    };
    const content = codeMap[props.filename];
    return {
      content,
    };
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages.js); 
    },
  },
};
</script>

<style lang="less">
pre {
  margin-top: 0;
}
</style>

<style>
/* required class */
.vue-code-editor {
  background: #2d2d2d;
  color: #ccc;
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
</style>