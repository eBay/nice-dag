<script lang="ts">
import { defineComponent } from "vue";
import NiceDagTypes from "@ebay/nice-dag-core/lib/types";
import type { NiceDagReactiveType } from "../niceDagReactive";
import type { PropType } from "vue";

export default defineComponent({
  props: { niceDagReactive: Object as PropType<NiceDagReactiveType> },
  setup(props) {
    return {
      getDomRef(node: NiceDagTypes.Node): HTMLElement | undefined {
        return props.niceDagReactive?.use()?.getElementByNodeId(node.id);
      },
    };
  },
});
</script>

<template>
  <div v-if="niceDagReactive && niceDagReactive.observor > 0">
    <teleport
      v-for="node in niceDagReactive?.use()?.getAllNodes() || []"
      v-bind:key="node.id"
      :to="getDomRef(node)"
    >
      <slot :node="node" />
    </teleport>
  </div>
</template>
