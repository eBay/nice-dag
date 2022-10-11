<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div id="my-modal" />
  <ReadOnlyView msg="Welcome to Your Vue.js App" />
</template>

<script>
import ReadOnlyView from "./cases/sample/ReadOnlyView.vue";

export default {
  name: "App",
  components: {
    ReadOnlyView,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
