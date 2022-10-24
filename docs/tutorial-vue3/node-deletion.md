---
sidebar_position: 7
---

# Remove a Node

In terms of editable DAG, Nice-DAG supports node deletion. The example extends [Add Node to DAG](./node-creation).

## Step 1: Add a DOM node handling node deletion

Because Nice-DAG doesn't give any node component, the delete actions should be handle by a DOM node separately like `button` or `<a/>`. To do this, you need to adapt the Node component. Since we re-use Dragging and Dropping example, you can simply adapt the `EditableNode` component.

```jsx
<template>
<div class="my-first-dag-node">
  <div @mousedown="startNodeDragging">
      <span>{{ node.data?.label || node.id }}</span>
  </div>
  <EditableConnector :node="node" :niceDag="niceDagReactive.use()">
  <a>X</a> <!--to handle deletion-->
</div>
</template>
<script>
import EditableConnector from './EditableConnector';

export default {
  name: "EditableNode",
  props: ["node", "niceDagReactive"],
  components: {
    EditableConnector,
  },
  setup(props) {
    return {
      startNodeDragging(e) {
        props.niceDagReactive.use().startNodeDragging(props.node, e);
      },
    };
  },
};
```
In order to make the `<a>` responsable, we should set the css for the DOM correspondingly.

```css
.my-first-dag-node > a {
  position: absolute;
  top: -12px;
  right: -12px;
  z-index: 1;
}
```


## Step 2: Add event listener

After then, you can call node.[remove](../dag-model/node.md#api-iviewnode) and bind the event listener to `<a/>`.

```jsx
<template>
<div class="my-first-dag-node">
  <div @mousedown="startNodeDragging">
      <span>{{ node.data?.label || node.id }}</span>
  </div>
  <EditableConnector :node="node" :niceDag="niceDagReactive.use()">
  <a>X</a> <!--to handle deletion-->
</div>
</template>
<script>
import EditableConnector from './EditableConnector';

export default {
  name: "EditableNode",
  props: ["node", "niceDagReactive"],
  components: {
    EditableConnector,
  },
  setup(props) {
    return {
      ...
      removeNode() {
        props.node.remove();
      },
    };
  },
};
```