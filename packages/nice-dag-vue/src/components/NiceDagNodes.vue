<script lang="ts">
import { defineComponent, computed } from "vue";
import NiceDag from "@ebay/nice-dag-core";
import NiceDagTypes from "@ebay/nice-dag-core/lib/types";
import MutationObserver from "../mutationObversor";

export default defineComponent({
  props: {
    id: String,
  },
  setup(props) {
    return {
      getDomRef(node: NiceDagTypes.Node): HTMLElement | undefined {
        return NiceDag.use(props.id!)?.getElementByNodeId(node.id);
      },
      use: NiceDag.use,
      observer: MutationObserver.get(props.id!),
    };
  },
});
</script>

<template>
  <div v-if="observer || 0 > 0">
    <teleport
      v-for="node in use(id)?.getAllNodes() || []"
      v-bind:key="node.id"
      :to="getDomRef(node)"
    >
      <slot :node="node" />
    </teleport>
  </div>
</template>
