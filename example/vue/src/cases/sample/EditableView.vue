<template>
  <div className="editable-sample">
    <div className="editable-sample-control">
      <div className="editable-sample-control-action">
        <el-row>
          <el-button @click="prettify">Prettify</el-button>
          <el-button @click="addNode">Add Node</el-button>
          <el-button @click="addJointNode">Add Joint Node</el-button>
        </el-row>
      </div>
      <div className="editable-sample-control-zoom">
        <el-slider v-model="scale" show-input @change="onScaleChange">
        </el-slider>
      </div>
    </div>
    <div className="editable-sample-content">
      <div className="editable-sample-content-nice-dag" ref="niceDagEl" />
      <NiceDagNodes v-slot="slotProps" :niceDagReactive="niceDagReactive">
        <EditableStartNode
          v-if="slotProps.node.id === 'start'"
          :niceDagReactive="niceDagReactive"
          :observor="niceDagReactive.observor"
          :node="slotProps.node"
        />
        <EditableEndNode
          v-if="slotProps.node.id === 'end'"
          :niceDagReactive="niceDagReactive"
          :observor="niceDagReactive.observor"
          :node="slotProps.node"
        />
        <EditableJoint
          v-if="slotProps.node.joint"
          :niceDagReactive="niceDagReactive"
          :observor="niceDagReactive.observor"
          :node="slotProps.node"
        />
        <EditableNode
          :node="slotProps.node"
          :niceDagReactive="niceDagReactive"
          :observor="niceDagReactive.observor"
          v-if="
            slotProps.node.id !== 'end' &&
            slotProps.node.id !== 'start' &&
            !slotProps.node.joint
          "
        />
      </NiceDagNodes>
      <NiceDagEdges :niceDagReactive="niceDagReactive">
        <EditableEdge />
      </NiceDagEdges>
    </div>
  </div>
</template>

<script>
import { HierarchicalModel } from "../data/ReadOnlyViewData";
import { ref, onMounted } from "vue";
import { NiceDagNodes, NiceDagEdges, useNiceDag } from "@ebay/nice-dag-vue3";
import EditableNode from "./EditableNode";
import EditableEdge from "./EditableEdge";
import EditableStartNode from "./EditableStartNode";
import EditableEndNode from "./EditableEndNode";
import EditableJoint from "./EditableJoint";
import "./EditableView.less";

const NODE_WIDTH = 150;
const NODE_HEIGHT = 60;
const CIRCLE_W_H = 30;

const getNodeSize = (node) => {
  if (node.id === "start" || node.id === "end" || node.joint) {
    return {
      width: CIRCLE_W_H,
      height: CIRCLE_W_H,
    };
  }
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  };
};

export default {
  name: "EditableView",
  props: {
    // initNodes: HierarchicalModel,
  },
  components: {
    NiceDagNodes,
    NiceDagEdges,
    EditableStartNode,
    EditableNode,
    EditableJoint,
    EditableEdge,
    EditableEndNode,
  },
  setup() {
    let nodeCtnRef = 0;
    const scale = ref(100);
    const { niceDagEl, niceDagReactive } = useNiceDag({
      initNodes: HierarchicalModel,
      getNodeSize,
      jointEdgeConnectorType: "CENTER_OF_BORDER",
      editable: true,
    });
    const onScaleChange = () => {
      niceDagReactive.use().setScale(scale.value / 100);
    };
    const prettify = () => {
      niceDagReactive.use().prettify();
    };
    const addNode = () => {
      niceDagReactive.use().addNode(
        {
          id: `new-node-${nodeCtnRef}`,
        },
        {
          x: 40,
          y: 40,
        }
      );
      nodeCtnRef = nodeCtnRef + 1;
    };
    const addJointNode = () => {
      niceDagReactive.use().addJointNode(
        {
          id: `new-node-${nodeCtnRef}`,
        },
        {
          x: 40,
          y: 40,
        }
      );
      nodeCtnRef = nodeCtnRef + 1;
    };
    onMounted(() => {
      const niceDag = niceDagReactive.use();
      if (niceDag) {
        const bounds = niceDagEl.value.getBoundingClientRect();
        niceDag
          .center({
            width: bounds.width,
            height: 400,
          })
          .startEditing();
      }
    });

    return {
      nodeCtnRef,
      niceDagEl,
      niceDagReactive,
      scale,
      onScaleChange,
      prettify,
      addNode,
      addJointNode,
    };
  },
};
</script>
