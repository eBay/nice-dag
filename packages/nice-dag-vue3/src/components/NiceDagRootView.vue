<script lang="ts">
import type { NiceDagReactiveType } from "../niceDagReactive";
import type { PropType } from "vue";
import { defineComponent } from "vue";

export default defineComponent({
  props: { niceDagReactive: Object as PropType<NiceDagReactiveType> },
  setup(props) {
    return {
      getDomRef(): HTMLElement | undefined {
        return props.niceDagReactive?.use()?.getRootContentElement();
      },
    };
  },
});
</script>

<template>
  <div v-if="niceDagReactive && niceDagReactive.observor > 0">
    <teleport :to="getDomRef()">
      <slot />
    </teleport>
  </div>
</template>
