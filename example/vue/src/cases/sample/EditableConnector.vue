<template>
  <div
    :class="`editable-sample-${shape || 'circle'}-connector-${type}`"
    @mousedown="startEdgeDragging"
  />
</template>

<script>
export default {
  name: "EditableConnector",
  props: ["node", "niceDag", "type", "shape"],
  setup(props) {
    return {
      startEdgeDragging(e) {
        if (props.node) {
          props.niceDag.startEdgeDragging(props.node, e);
        }
      },
    };
  },
};
</script>
