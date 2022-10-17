<template>
  <span class="nice-dag-vue-sample-icon">
    <slot></slot>
  </span>
</template>
<script>
export default {
  name: "SvgIcon",
};
</script>
<style lang="less" scoped>
.nice-dag-vue-sample-icon {
  margin-left: 4px;
  font-size: 16px;
  display: inline-block;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-rendering: optimizelegibility;
  text-transform: none;
  vertical-align: -0.125em;
}
</style>
