---
sidebar_position: 5
---

# Drag And Drop (Node)

To enable **DnD** support, we need to create an editable DAG view. The editable DAG example extends [Read-Only DAG](./read-only-dag).

## Step 1: Add `editable` to `useNiceDag` hook

To make the DAG view editable is pretty simple. You can add a boolean parameter `editable` to the [useNiceDag](../api-ref/useNiceDag.md) hook. Besides, you need to have a Vue hook which should call [startEditing()](../api-ref/nice-dag.md#startediting) because Nice-DAG disables edit function in default.

```jsx
<script>
import { NiceDagNodes, useNiceDag, NiceDagEdges } from "@ebay/nice-dag-vue3";
import Edge from "./Edge";
import SampleNode from './SampleNode';

...

export default {
  name: "MyFirstDag",
  components: {
    NiceDagNodes,
    NiceDagEdges,
    Edge,
    SampleNode,
  },
  setup() {
    const { niceDagEl, niceDagReactive } = useNiceDag(
      {
        initNodes: NodeData,
        getNodeSize
      },
      true  //must true if editable
    );
    onMounted(() => {
      const niceDag = niceDagReactive.use();
      if (niceDag) {
        const bounds = niceDagEl.value.getBoundingClientRect();
        niceDag.startEditing();
      }
    });
    return {
      niceDagEl,
      niceDagReactive,
    };
  },
};
</script>
```

## Step 2: Add Dragging&Dropping event listener

To make the node movable, you need to adapt the props of Node renderers by giving a `NiceDag` object.

Before that, you can create a separate Vue component named "EditableNode.vue".

```jsx
<template>
<div class="my-first-dag-node">
  <div @mousedown="startNodeDragging">
      <span>{{ node.data?.label || node.id }}</span>
  </div>
</div>
</template>
<script>
export default {
  name: "EditableNode",
  props: ["node", "niceDagReactive"],
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

```jsx
<template>
...
  <EditableNode
          :node="slotProps.node"
          :niceDag="niceDagReactive.use()"
  />
...
</template>
<script>
import { NiceDagNodes, useNiceDag, NiceDagEdges } from "@ebay/nice-dag-vue3";
import Edge from "./Edge";
import EditableNode from "./EditableNode";

...

export default {
  name: "MyFirstDag",
  components: {
    NiceDagNodes,
    NiceDagEdges,
    Edge,
  },
  setup() {
    const { niceDagEl, niceDagReactive } = useNiceDag(
      {
        initNodes: NodeData,
        getNodeSize
      },
      true  //must true if editable
    );
    onMounted(() => {
      const niceDag = niceDagReactive.use();
      if (niceDag) {
        const bounds = niceDagEl.value.getBoundingClientRect();
        niceDag.startEditing(); //must call before editing
      }
    });
    return {
      niceDagEl,
      niceDagReactive,
    };
  },
};
</script>
```

As the code shows, the event listener [startNodeDragging](../api-ref/nice-dag.md#startnodedragging) is given by `NiceDag` object. After then, you need to bind the event listener to `@mousedown` of the target DOM which should be clickable for movement.

**Notes:**

The `onMouseDown` listener should not be added to the top-level container of node but a child DOM node in order to avoid events conflicts. For example, a child DOM node for node deleting can not response if the top-level container is added `onMouseDown` event.

For this sample, we need to adapt the `<span>` size by given a css class.

```css
.my-first-dag-node > span {
  display: block;
  height: 100%;
  width: 100%;
}
```
