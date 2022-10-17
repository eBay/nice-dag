<template>
  <div className="editable-sample-start-node">
    <div
      className="editable-sample-start-node-move-hand"
      @mousedown="startNodeDragging"
    />
    <EditableConnector
      type="out"
      shape="square"
      :node="node"
      :niceDag="niceDag"
    />
  </div>
</template>

<script>
import EditableConnector from "./EditableConnector";
export default {
  components: { EditableConnector },
  props: ["niceDag", "node"],
  setup(props) {
    return {
      startNodeDragging(e) {
        props.niceDag.startNodeDragging(props.node, e);
      },
    };
  },
};
</script>
