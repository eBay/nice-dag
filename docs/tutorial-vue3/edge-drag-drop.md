---
sidebar_position: 6
---

# Drag And Drop (Edge)

Besides the node dragging and dropping support, Nice-DAG also support edge dragging and dropping. To simplify the illustration, the example extends [Drag And Drop (Node)](./node-drag-drop).

## Step 1: Add Connector component

The `Connector` component is a separated component that can handle dragging events of edge connection. The component should be added to the node component.

Here is the sample of connector component.
```jsx
<template>
  <div
    class="my-first-dag-connector"
    @mousedown="startEdgeDragging"
  />
</template>

<script>
export default {
  name: "EditableConnector",
  props: ["node", "niceDag"],
  setup(props) {
    return {
      startEdgeDragging(e) {
        if (props.node) {
          props.niceDag.startEdgeDragging(props.node, e); //start to dragging edge
        }
      },
    };
  },
};
</script>
```
Similar to that of node component, the connector should be add a mouse down event for edge dragging. To enable the dragging of edge, the mouse down event should call `startEdgeDragging` method which is given by [NiceDag](../api-ref/nice-dag.md) object.

Here is to give the node position by css.

```css
.my-first-dag-connector {
    width: 16px;
    height: 16px;
    border: 1px solid black;
    border-radius: 50%;
    position: absolute;
    top: 0;
    bottom: 0;
    background: white;
    cursor: pointer;
    right: -8px;
}
```

## Step 2: Add Connector component to Node component

Now, you can simply add the connector component to the node component.

```jsx
<template>
<div class="my-first-dag-node">
  <div @mousedown="startNodeDragging">
      <span>{{ node.data?.label || node.id }}</span>
  </div>
  <EditableConnector :node="node" :niceDag="niceDagReactive.use()">
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
</script>
```
