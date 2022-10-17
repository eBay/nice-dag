<template>
  <div className="editable-sample-node">
    <EditableGroupControl
      v-if="showGroupCtrl()"
      :node="node"
      :niceDag="niceDag"
    />
    <EditableNodeControl
      v-if="!showGroupCtrl()"
      :node="node"
      :niceDag="niceDag"
    />
    <EditableConnector type="in" />
    <EditableConnector type="out" :node="node" :niceDag="niceDag" />
  </div>
</template>

<script>
import EditableConnector from "./EditableConnector";
import EditableGroupControl from "./EditableGroupControl";
import EditableNodeControl from "./EditableNodeControl";

export default {
  name: "EditableNode",
  props: ["node", "niceDag"],
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
