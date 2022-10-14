<template>
  <div className="app">
    <div className="sider">
      <h1>
        <span className="header-name">@ebay/nice-dag</span>
        <span className="example-title">Examples</span>
      </h1>
      <div className="scroll-container" id="scroll-container">
        <ul>
          <li v-for="example in examples" :key="example.key">
            <a
              :href="`#${example.key}`"
              :class="{ active: isActive(example.key) }"
            >
              {{ example.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="sample-content">
      <h2>{{ getCurrentExample(current).name }}</h2>
      <ReadOnlyView v-if="current === 'read-only-view'" />
      <EditableView v-if="current === 'editable-view'" />
    </div>
  </div>
</template>

<script>
import ReadOnlyView from "./cases/sample/ReadOnlyView.vue";
import EditableView from "./cases/sample/EditableView.vue";
import { ref } from "vue";

export default {
  name: "App",
  components: {
    ReadOnlyView,
    EditableView,
  },
  setup() {
    const examples = [
      {
        key: "read-only-view",
        name: "Read Only View",
      },
      {
        key: "editable-view",
        name: "Editable View",
      },
    ];
    const current = ref(examples[0].key);
    window.onhashchange = () => {
      const key = window.location.hash.replace("#", "");
      current.value = key;
    };
    return {
      examples,
      current,
      getCurrentExample(key) {
        return examples.find((example) => example.key === key);
      },
      isActive(key) {
        return current.value === key;
      },
    };
  },
};
</script>

<style lang="less">
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
  position: relative;
  background-color: #f0f0f0;
  padding: 10px 0 10px 28px;
  height: 80px;
}
.app .sider h1 .header-name {
  display: block;
  font-size: 12px;
  color: #999;
}

.app .sider img.logo {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 32px;
}

.app .sider h1 span.example-title {
  font-size: 20px;
  display: block;
  margin-top: 5px;
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
