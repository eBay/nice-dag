<template>
  <div class="app">
    <div class="sider">
      <h1>
        <LogoSvg />
        <div class="header-info">
          <span class="example-title">Vue.js Example</span>
          <span class="header-name">@ebay/nice-dag-vue3</span>
        </div>
      </h1>
      <div class="scroll-container" id="scroll-container">
        <ul>
          <li v-for="(example, key) in examples" :key="key">
            <a :href="`#${key}`" :class="{ active: isActive(key) }">
              {{ example.name }}
            </a>
          </li>
        </ul>
      </div>
      <div class="footer-info">
        <span class="footer-label">Other Reference</span>
        <a href="../react/index.html#read-only-view">React.js Example</a>
      </div>
    </div>
    <div class="sample-content">
      <h1>
        <span>{{ getCurrentExample(current).name }}</span>
      </h1>
      <ReadOnlyView v-if="current === 'read-only-view'" />
      <EditableView v-if="current === 'editable-view'" />
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane label="Code" name="code">
          <div v-for="code in examples[current].codes" :key="code">
            <div class="code-viewer-title">
              {{ code }}
            </div>
            <CodeViewer :filename="code" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Less" name="less">
          <div class="code-viewer-title">Less</div>
          <CodeViewer :filename="examples[current].less" />
        </el-tab-pane>
        <el-tab-pane label="Data" name="data">
          <div class="code-viewer-title">Data</div>
          <CodeViewer :filename="examples[current].data" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ReadOnlyView from "./cases/sample/ReadOnlyView.vue";
import EditableView from "./cases/sample/EditableView.vue";
import CodeViewer from "./CodeViewer.vue";
import LogoSvg from "./assets/svgs/logo.vue";
import { ref } from "vue";

export default {
  name: "App",
  components: {
    ReadOnlyView,
    EditableView,
    CodeViewer,
    LogoSvg,
  },
  setup() {
    const examples = {
      "read-only-view": {
        name: "Read Only View",
        codes: ["ReadOnlyView.vue", "ReadOnlyNodes.js"],
        less: "ReadOnlyView.less",
        data: "ReadOnlyViewData.js",
      },
      "editable-view": {
        name: "Editable View",
        codes: [
          "EditableView.vue",
          "EditableNode.vue",
          "EditableJoint.vue",
          "EditableStartNode.vue",
          "EditableEndNode.vue",
          "EditableConnector.vue",
          "EditableEdge.vue",
          "EditableNodeControl.vue",
          "EditableGroupControl.vue",
        ],
        less: "EditableView.less",
        data: "ReadOnlyViewData.js",
      },
    };
    const activeTab = ref("code");
    const hashKey = window.location.hash.replace("#", "");
    const current = ref(
      !hashKey || hashKey === "" ? "read-only-view" : hashKey
    );
    window.onhashchange = () => {
      const key = window.location.hash.replace("#", "");
      current.value = key;
    };
    return {
      examples,
      current,
      activeTab,
      getCurrentExample(key) {
        return examples[key];
      },
      handleClick() {},
      isActive(key) {
        return current.value === key;
      },
    };
  },
};
</script>

<style lang="less">
*,
:after,
:before {
  box-sizing: border-box;
}
html {
  height: 100%;
  width: 100%;
}
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: sans-serif;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
}
.app {
  padding-left: 240px;
  box-sizing: border-box;
}
.app .sider {
  position: fixed;
  width: 240px;
  height: 100%;
  top: 0px;
  left: 0px;
  background-color: #f7f7f7;
}
.app .sider .footer-info {
  position: fixed;
  bottom: 20px;
  width: 240px;
}
.app .sider .footer-info > span {
  font-size: 18px;
  color: darkgray;
}
.app .sider .footer-info > span,
.app .sider .footer-info > a {
  padding: 4px 4px;
  display: block;
  text-align: center;
  width: 100%;
}

.app .sider .footer-info > a {
  color: #1890ff;
  cursor: pointer;
  font-size: 16px;
}

.sample-content {
  padding: 16px 16px;
  position: absolute;
  height: 100%;
  top: 0;
  left: 240px;
  bottom: 0;
  right: 0;
  overflow: auto;
  background-color: #f7f7f7;
}

.app .sider h1 {
  display: flex;
  position: relative;
  // background-color: #f0f0f0;
  padding: 10px 0 10px 28px;
  height: 64px;
  margin-bottom: 0.5em;
  margin-top: 0;
  align-items: center;
  padding-left: 8px;
  border-bottom: 1px solid #f0f0f0;
}
.app .sider h1 .header-name {
  display: block;
  font-size: 12px;
  color: rgb(95, 93, 93);
  margin-top: 4px;
}

.header-info {
  padding-left: 8px;
}

.app .sider img.logo {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 32px;
}

.app .sample-content > h1 {
  margin-top: 0;
}

.app .sample-content > h1 > span,
.app .sider h1 span.example-title {
  font-size: 20px;
  display: block;
  color: #333;
  display: inline-block;
}
.app .sider h1 .ant-select {
  margin-top: 5px;
  color: #666;
  margin-left: 10px;
}

.app .sider .scroll-container::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}

.app .sider .scroll-container::-webkit-scrollbar-thumb {
  transition: all 0.3s ease;
  border-color: transparent;
  background-color: #ddd;
  z-index: 40;
}

.app .sider .scroll-container::-webkit-scrollbar-corner {
  background-color: rgba(0, 0, 0, 0);
}

.app .sider ul,
.app .sider li {
  margin: 0;
  padding: 0;
  list-style: none;
}

.app .sider li {
  line-height: 260%;
}

.app .sider li a {
  display: block;
  padding-left: 28px;
  color: #1890ff;
  cursor: pointer;
  outline: none;
  text-decoration: none;
}

.app .sider li a.active {
  color: #f90;
}

.app .sider .social {
  padding-left: 28px;
  margin-top: 20px;
  line-height: 40px;
}

.app .example-container {
  // padding: 40px;
}

.app .example-container h1 {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.app .example-container .ant-form {
  width: 600px;
}

.example-description {
  color: #777;
  font-size: 14px;
  margin: 10px 0 0 0;
  line-height: 150%;
}

.code-viewer {
  transform: translateY(-16px);

  &-title {
    margin-top: 8px;
    background-color: #333;
    color: white;
    padding: 4px 12px;
  }
}
</style>
