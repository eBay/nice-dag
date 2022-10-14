<template>
  <teleport
    v-for="node in niceDagRef.getAllNodes()"
    v-bind:key="node.id"
    :to="getDomRef(node)"
  >
    <slot :node="node" />
  </teleport>
</template>

<script>
export default {
  props: ["niceDagRef", "patchVersion"],
  setup(props) {
    return {
      getDomRef(node) {
        return props.niceDagRef.getElementByNodeId(node.id);
      },
    };
  },
};
</script>
