<template>
  <teleport :to="node.ref">
    <div>AAAA</div>
  </teleport>
</template>

<script>
export default {
  props: ["node"],
  setup() {
    return {
      selector: "#modal",
    };
  },
};
</script>
