<template>
  <div className="editable-sample-end-node" @mousedown="startNodeDragging">
    <EditableConnector type="in" shape="square" />
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
