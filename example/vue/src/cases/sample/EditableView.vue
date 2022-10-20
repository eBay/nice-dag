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
      <NiceDagNodes
        v-slot="slotProps"
        :niceDagRef="niceDagRef"
        v-if="niceDagRef"
        :patchVersion="patchVersion"
      >
        <EditableStartNode
          v-if="slotProps.node.id === 'start'"
          :niceDag="niceDagRef"
          :node="slotProps.node"
        />
        <EditableEndNode
          v-if="slotProps.node.id === 'end'"
          :niceDag="niceDagRef"
          :node="slotProps.node"
        />
        <EditableJoint
          v-if="slotProps.node.joint"
          :niceDag="niceDagRef"
          :node="slotProps.node"
        />
        <EditableNode
          :node="slotProps.node"
          :niceDag="niceDagRef"
          v-if="
            slotProps.node.id !== 'end' &&
            slotProps.node.id !== 'start' &&
            !slotProps.node.joint
          "
        />
      </NiceDagNodes>
      <NiceDagEdges
        :niceDagRef="niceDagRef"
        v-if="niceDagRef"
        :patchVersion="patchVersion"
      >
        <EditableEdge />
      </NiceDagEdges>
    </div>
    <div className="readonly-sample-content-minimap-row">
      <div className="readonly-sample-content-minimap">
        <div className="readonly-sample-content-minimap-body" ref="minimapEl" />
      </div>
    </div>
  </div>
</template>

<script>
import { HierarchicalModel } from "../data/ReadOnlyViewData";
import NiceDag from "@ebay/nice-dag-core";
import { ref, onMounted } from "vue";
import { NiceDagNodes, NiceDagEdges } from "@ebay/nice-dag-vue";
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
    const viewNodes = ref([]);
    const niceDagRef = ref(null);
    const niceDagEl = ref(null);
    const minimapEl = ref(null);
    const patchVersion = ref(0);
    const scale = ref(100);
    const onNiceDagChange = {
      onChange: () => {
        patchVersion.value = patchVersion.value + 1;
      },
    };

    const onScaleChange = () => {
      niceDagRef.value.setScale(scale.value / 100);
    };
    const prettify = () => {
      niceDagRef.value.prettify();
    };
    const addNode = () => {
      niceDagRef.value.addNode(
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
      niceDagRef.value.addJointNode(
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
      niceDagRef.value = NiceDag.init(
        {
          container: niceDagEl.value,
          getNodeSize,
          minimapContainer: minimapEl.value,
          jointEdgeConnectorType: "CENTER_OF_BORDER",
          minimapConfig: {
            viewBoxClassName: "readonly-sample-minimap-viewbox",
          },
        },
        true
      );
      niceDagRef.value.withNodes(HierarchicalModel).render();
      niceDagRef.value.addNiceDagChangeListener(onNiceDagChange);
      const bounds = niceDagEl.value.getBoundingClientRect();
      niceDagRef.value
        .center({
          width: bounds.width,
          height: 400,
        })
        .startEditing();
    });
    return {
      nodeCtnRef,
      patchVersion,
      viewNodes,
      niceDagEl,
      niceDagRef,
      minimapEl,
      scale,
      onScaleChange,
      prettify,
      addNode,
      addJointNode,
    };
  },
};
</script>
