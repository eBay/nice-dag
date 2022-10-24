<script lang="ts">
import type { NiceDagReactiveType } from "../niceDagReactive";
import type { PropType } from "vue";
import { defineComponent } from "vue";

export default defineComponent({
  props: { niceDagReactive: Object as PropType<NiceDagReactiveType> },
});
</script>

<template>
  <div v-if="niceDagReactive && niceDagReactive.observor > 0">
    <teleport
      v-for="edge in niceDagReactive?.use()?.getAllEdges() || []"
      v-bind:key="`edge-${edge.source.id}-${edge.target.id}`"
      :to="edge.ref"
    >
      <slot :edge="edge" />
    </teleport>
  </div>
</template>
