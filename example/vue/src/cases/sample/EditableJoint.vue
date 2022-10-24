<template>
  <div className="editable-sample-joint-node">
    <div
      className="editable-sample-joint-node-move"
      @mousedown="startNodeDragging"
    >
      <SvgIcon v-if="niceDag.editing"><MoveSvg /></SvgIcon>
    </div>
    <div
      className="editable-sample-joint-node-remove-button"
      role="button"
      @mousedown="removeNode"
      aria-label="Remove joint node"
    >
      <SvgIcon v-if="niceDag.editing"><CloseSvg /></SvgIcon>
    </div>
    <EditableConnector type="in" shape="square" />
    <EditableConnector
      type="out"
      :node="node"
      :niceDag="niceDag"
      shape="square"
    />
  </div>
</template>

<script>
import SvgIcon from "../../components/SvgIcon.vue";
import MoveSvg from "../../assets/svgs/move.vue";
import CloseSvg from "../../assets/svgs/close.vue";
import EditableConnector from "./EditableConnector";

export default {
  name: "EditableJoint",
  props: ["node", "niceDagReactive"],
  components: {
    SvgIcon,
    MoveSvg,
    CloseSvg,
    EditableConnector,
  },
  setup(props) {
    return {
      startNodeDragging(e) {
        if (props.node) {
          props.niceDagReactive.use().startNodeDragging(props.node, e);
        }
      },
      removeNode() {
        props.node.remove();
      },
      niceDag: props.niceDagReactive.use(),
    };
  },
};
</script>
