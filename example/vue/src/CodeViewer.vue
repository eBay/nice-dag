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
import readOnlyNodes from "!!raw-loader!./cases/sample/ReadOnlyNodes.js";
import readOnlyViewLess from "!!raw-loader!./cases/sample/ReadOnlyView.less";
import readOnlyViewData from "!!raw-loader!./cases/data/ReadOnlyViewData.js";

import editableViewCode from "!!raw-loader!./cases/sample/EditableView.vue";
import editableViewLess from "!!raw-loader!./cases/sample/EditableView.less";
import editableNodeCode from "!!raw-loader!./cases/sample/EditableNode.vue";
import editableJointCode from "!!raw-loader!./cases/sample/EditableJoint.vue";
import editableConnectorCode from "!!raw-loader!./cases/sample/EditableConnector.vue";
import editableStartNodeCode from "!!raw-loader!./cases/sample/EditableStartNode.vue";
import editableEndNodeCode from "!!raw-loader!./cases/sample/EditableEndNode.vue";
import editableEdgeCode from "!!raw-loader!./cases/sample/EditableEdge.vue";
import editableGroupControlCode from "!!raw-loader!./cases/sample/EditableGroupControl.vue";
import editableNodeControlCode from "!!raw-loader!./cases/sample/EditableNodeControl.vue";

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
      "ReadOnlyNodes.js": readOnlyNodes,
      "ReadOnlyView.less": readOnlyViewLess,
      "ReadOnlyViewData.js": readOnlyViewData,
      "EditableView.vue": editableViewCode,
      "EditableNode.vue": editableNodeCode,
      "EditableConnector.vue": editableConnectorCode,
      "EditableStartNode.vue": editableStartNodeCode,
      "EditableEndNode.vue": editableEndNodeCode,
      "EditableGroupControl.vue": editableGroupControlCode,
      "EditableEdge.vue": editableEdgeCode,
      "EditableNodeControl.vue": editableNodeControlCode,
      "EditableJoint.vue": editableJointCode,
      "EditableView.less": editableViewLess,
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
