<template>
  <pre>
      <code className="language-jsx line-numbers">
        {{content}}
      </code>
    </pre>
</template>

<script>
import readOnlyViewCode from "!!raw-loader!./cases/sample/ReadOnlyView.vue";

export default {
  name: "App",
  props: ["filename"],
  setup(props) {
    const codeMap = {
      "ReadOnlyView.vue": readOnlyViewCode,
    };
    const content = codeMap[props.filename];
    return {
      content,
    };
  },
};
</script>

<style lang="less">
pre {
  margin-top: 0;
}
</style>