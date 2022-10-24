<template>
  <teleport
    v-for="edge in niceDagRef.getAllEdges()"
    v-bind:key="`edge-${edge.source.id}-${edge.target.id}`"
    :to="edge.ref"
  >
    <slot :edge="edge" />
  </teleport>
</template>

<script>
export default {
  props: ["niceDagRef", "patchVersion"],
};
</script>
