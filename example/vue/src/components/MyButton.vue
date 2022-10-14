<template>
  <button @click="$emit('onClick')" class="nice-dag-vue-sample-icon-button">
    <slot></slot>
  </button>
</template>
<script>
export default {
  name: "MyButton",
};
</script>
<style lang="less" scoped>
.nice-dag-vue-sample-icon-button {
  border-radius: 2px;
  font-size: 16px;
  height: 32px;
  padding: 2.4px 0;
  vertical-align: -3px;
  width: 32px;
  background: transparent;
  border-color: transparent;
  box-shadow: none;
  color: #1890ff;
  cursor: pointer;
}
</style>
