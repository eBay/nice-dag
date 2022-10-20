<template>
  <div v-if="observer || 0 > 0">
    <teleport
      v-for="edge in use(id)?.getAllEdges() || []"
      v-bind:key="`edge-${edge.source.id}-${edge.target.id}`"
      :to="edge.ref"
    >
      <slot :edge="edge" />
    </teleport>
  </div>
</template>

<script lang="ts">
import NiceDag from "@ebay/nice-dag-core";
import { defineComponent } from "vue";
import MutationObserver from "../mutationObversor";

export default defineComponent({
  props: {
    id: String,
  },
  setup(props) {
    return {
      use: NiceDag.use,
      observer: MutationObserver.get(props.id!),
    };
  },
});
</script>
