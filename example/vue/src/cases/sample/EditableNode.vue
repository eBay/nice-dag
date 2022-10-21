<template>
  <div className="editable-sample-node">
    <EditableGroupControl
      v-if="showGroupCtrl()"
      :node="node"
      :niceDag="niceDagReactive.use()"
    />
    <EditableNodeControl
      v-if="!showGroupCtrl()"
      :node="node"
      :niceDag="niceDagReactive.use()"
    />
    <EditableConnector type="in" />
    <EditableConnector type="out" :node="node" :niceDag="niceDagReactive.use()" />
  </div>
</template>

<script>
import EditableConnector from "./EditableConnector";
import EditableGroupControl from "./EditableGroupControl";
import EditableNodeControl from "./EditableNodeControl";

export default {
  name: "EditableNode",
  props: ["node", "niceDagReactive"],
  components: {
    EditableConnector,
    EditableGroupControl,
    EditableNodeControl,
  },
  setup(props) {
    return {
      showGroupCtrl() {
        return props.node.children?.length > 0 && !props.node.collapse;
      },
    };
  },
};
</script>
