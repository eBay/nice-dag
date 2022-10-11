<template>
  <div className="readonly-sample">
    <div className="readonly-sample-content">
      <div className="readonly-sample-content-nice-dag" ref="niceDagEl" />
    </div>
    <Fragment v-if="test">
      <VueDagNode v-for="node in viewNodes" v-bind:key="node.id" :node="node"/>
    </Fragment>
  </div>
</template>

<script>
import { HierarchicalModel } from "../data/ReadOnlyViewData";
import NiceDag from "@ebay/nice-dag-core";
import { ref, onMounted } from "vue";
import VueDagNode from "./VueDagNode.vue";

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
  name: "HelloWorld",
  props: {
    // initNodes: HierarchicalModel,
  },
  components: {
    VueDagNode,
  },
  setup() {
    const viewNodes = ref([]);
    const niceDagEl = ref(null);
    const test = ref(false);
    onMounted(() => {
      const nideDag = NiceDag.init(
        {
          container: niceDagEl.value,
          getNodeSize,
        },
        false
      );
      nideDag.withNodes(HierarchicalModel).render();
      viewNodes.value = nideDag.getAllNodes();
      test.value = true;
      console.log(`the component is now mounted.`);
    });
    return {
      viewNodes,
      niceDagEl,
      test,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.readonly-sample-content-nice-dag {
  height: 500px;
}
</style>