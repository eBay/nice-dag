<template>
  <div className="readonly-sample">
    <div className="readonly-sample-control">
      <div className="readonly-sample-control-direction">
        <el-select
          v-model="direction"
          placeholder="Select"
          @change="onDirectionChange"
        >
          <el-option
            v-for="d in directions"
            :key="d.value"
            :label="d.label"
            :value="d.value"
          >
          </el-option>
        </el-select>
      </div>
      <div className="readonly-sample-control-zoom">
        <el-slider v-model="scale" show-input @change="onScaleChange">
        </el-slider>
      </div>
    </div>
    <div className="readonly-sample-content">
      <div className="readonly-sample-content-nice-dag" ref="niceDagEl" />
      <NiceDagNodes v-slot="slotProps" :niceDagReactive="niceDagReactive">
        <StartNode v-if="slotProps.node.id === 'start'" />
        <EndNode v-if="slotProps.node.id === 'end'" />
        <Joint v-if="slotProps.node.joint" />
        <SampleNode
          :node="slotProps.node"
          :niceDagReactive="niceDagReactive"
          v-if="
            slotProps.node.id !== 'end' &&
            slotProps.node.id !== 'start' &&
            !slotProps.node.joint
          "
          :observor="niceDagReactive.observor"
        />
      </NiceDagNodes>
      <NiceDagEdges :niceDagReactive="niceDagReactive">
        <Edge />
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
import { onMounted, ref } from "vue";
import { StartNode, EndNode, SampleNode, Joint, Edge } from "./ReadOnlyNodes";
import { NiceDagNodes, NiceDagEdges, useNiceDag } from "@ebay/nice-dag-vue3";
import "./ReadOnlyView.less";

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
  name: "ReadOnlyView",
  props: {
    // initNodes: HierarchicalModel,
  },
  components: {
    NiceDagNodes,
    NiceDagEdges,
    StartNode,
    EndNode,
    SampleNode,
    Joint,
    Edge,
  },
  setup() {
    const scale = ref(100);
    const direction = ref("LR");
    const directions = [
      {
        value: "LR",
        label: "Left to Right",
      },
      {
        value: "RL",
        label: "Right to Left",
      },
      {
        value: "TB",
        label: "Top to Bottom",
      },
      {
        value: "BT",
        label: "Bottom to Top",
      },
    ];
    const { niceDagEl, minimapEl, niceDagReactive } = useNiceDag(
      {
        initNodes: HierarchicalModel,
        getNodeSize,
        minimapConfig: {
          viewBoxClassName: "readonly-sample-minimap-viewbox",
        },
      },
      false
    );
    onMounted(() => {
      const niceDag = niceDagReactive.use();
      if (niceDag) {
        const bounds = niceDagEl.value.getBoundingClientRect();
        niceDag.center({
          width: bounds.width,
          height: 400,
        });
      }
    });
    const onScaleChange = () => {
      niceDagReactive.use().setScale(scale.value / 100);
    };
    const onDirectionChange = () => {
      niceDagReactive.use().setDirection(direction.value);
    };
    return {
      niceDagEl,
      minimapEl,
      niceDagReactive,
      scale,
      onScaleChange,
      direction,
      directions,
      onDirectionChange,
    };
  },
};
</script>
