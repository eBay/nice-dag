<template>
  <div className="readonly-sample">
    <div className="readonly-sample-content">
      <div className="readonly-sample-content-nice-dag" ref="niceDagEl" />
      <NiceDagNodes
        v-slot="slotProps"
        :niceDagRef="niceDagRef"
        v-if="niceDagRef"
        :patchVersion="patchVersion"
      >
        <StartNode v-if="slotProps.node.id === 'start'" />
        <EndNode v-if="slotProps.node.id === 'end'" />
        <Joint v-if="slotProps.node.joint" />
        <SampleNode
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
import NiceDag from "@ebay/nice-dag-core";
import { ref, onMounted } from "vue";
import { StartNode, EndNode, SampleNode, Joint, Edge } from "./EditableNodes";
import NiceDagNodes from "./NiceDagNodes.vue";
import NiceDagEdges from "./NiceDagEdges.vue";

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
    StartNode,
    EndNode,
    SampleNode,
    Joint,
    Edge,
  },
  setup() {
    const viewNodes = ref([]);
    const niceDagRef = ref(null);
    const niceDagEl = ref(null);
    const minimapEl = ref(null);
    const patchVersion = ref(0);
    const onNiceDagChange = {
      onChange: () => {
        patchVersion.value = patchVersion.value + 1;
      },
    };
    onMounted(() => {
      niceDagRef.value = NiceDag.init(
        {
          container: niceDagEl.value,
          getNodeSize,
          minimapContainer: minimapEl.value,
          jointEdgeConnectorType: 'CENTER_OF_BORDER',
          minimapConfig: {
            viewBoxClassName: "readonly-sample-minimap-viewbox",
          },
        },
        true
      );
      niceDagRef.value.withNodes(HierarchicalModel).render();
      niceDagRef.value.addNiceDagChangeListener(onNiceDagChange);
      const bounds = niceDagEl.value.getBoundingClientRect();
      niceDagRef.value.center({
        width: bounds.width,
        height: 400,
      }).startEditing();
    });
    return {
      patchVersion,
      viewNodes,
      niceDagEl,
      niceDagRef,
      minimapEl,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@conector-size: 16px;

.readonly-sample {
  border: 1px solid #eaeaea;
  padding: 4px 4px;
  box-sizing: border-box;

  &-minimap {
    width: 250px;
    height: 200px;
  }
  &-edge-label {
    text-align: center;
    margin-top: -20px;
  }
  &-start-node,
  &-end-node,
  &-joint-node {
    border: 1px solid black;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    background: white;
  }

  &-joint-node {
    font-size: 18px;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  &-end-node::before {
    content: "";
    position: absolute;
    border: 1px solid black;
    border-radius: 50%;
    background: black;
    top: 5px;
    left: 5px;
    width: 20px;
    height: 20px;
  }

  &-connector {
    &-in,
    &-out {
      width: @conector-size;
      height: @conector-size;
      border: 1px solid black;
      border-radius: 50%;
      position: absolute;
      margin: auto;
      top: 0;
      bottom: 0;
      background: white;
    }

    &-in {
      left: @conector-size / -2;
    }
    &-out {
      right: @conector-size / -2;
    }
  }

  &-node {
    width: 100%;
    height: 100%;
    &-group-content,
    &-content {
      position: relative;
      width: 100%;
      height: 100%;
      border: 1px solid #8799c1;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    &-group-content {
      padding: 4px 20px;
      > div {
        height: 30px;

        a {
          margin-left: 6px;
          font-size: 16px;
        }
      }
    }
    &-content {
      align-items: center;
      justify-content: center;
    }
  }

  &-content {
    height: 400px;
    position: relative;
    &-nice-dag {
      height: 100%;
    }
    &-minimap-row {
      height: 130px;
      position: relative;
    }
    &-minimap {
      position: absolute;
      top: 0;
      right: 0;
      width: 300px;
      height: 120px;
      bottom: 20px; //scroll bar
      border: 1px solid gray;
      padding: 2px 2px;
      background-color: #efefef;

      &-body {
        width: 100%;
        height: 100%;
      }
    }
  }
  &-minimap-viewbox {
    border: 1px solid orange !important;
  }
}
</style>
