<template>
  <div className="editable-sample-node-group-content">
    <div>
      <div
        className="editable-sample-node-group-content-bar"
        @mousedown="startNodeDragging"
      >
        <span>{{ node.data?.label || node.id }}</span>
        <SvgIcon v-if="niceDag.editing"><MoveSvg /></SvgIcon>
      </div>
      <div
        className="editable-sample-node-group-content-delete-button"
        @mousedown="removeNode"
      >
        <CloseSvg />
      </div>
      <MyButton @click="shrinkNode">
        <ShrinkSvg />
      </MyButton>
    </div>
  </div>
</template>

<script>
import SvgIcon from "../../components/SvgIcon.vue";
import MyButton from "../../components/MyButton.vue";
import MoveSvg from "../../assets/svgs/move.vue";
import CloseSvg from "../../assets/svgs/close.vue";
import ShrinkSvg from "../../assets/svgs/shrink.vue";

export default {
  name: "EditableGroupControl",
  components: { SvgIcon, MoveSvg, CloseSvg, MyButton, ShrinkSvg },
  props: ["node", "niceDag", "type", "shape"],
  setup(props) {
    return {
      startNodeDragging(e) {
        props.niceDag.startNodeDragging(props.node, e);
      },
      shrinkNode() {
        props.node.shrink();
      },
      removeNode() {
        props.node.remove();
      },
    };
  },
};
</script>
