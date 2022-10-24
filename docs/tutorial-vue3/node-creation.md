---
sidebar_position: 6
---

# Add Node to DAG

In terms of editable DAG, Nice-DAG supports adding nodes to existing DAG diagram. The example extends [Drag And Drop (Edge)](./edge-drag-drop).

## Step 1: Add a DOM node handling node creation

```jsx
<template>
  <div>
    <div><button>Add</button></div>
    <div className="my-first-dag" ref="niceDagEl" />
    ...
  </div>
</template>

<script>
...
export default {
  name: "MyFirstDag",
  ...
};
</script>
```
## Step 2: Add an event listener to create node

The node creation is realized by a [NiceDag](../api-ref/nice-dag.md) API.

```jsx
<template>
  <div>
    <div><button @click="addNode">Add</button></div>
    <div className="my-first-dag" ref="niceDagEl" />
    <NiceDagNodes v-slot="slotProps" :niceDagReactive="niceDagReactive">
      <SampleNode :node="slotProps.node"/>
    </NiceDagNodes>
  </div>
</template>

<script>
import { NiceDagNodes, useNiceDag } from "@ebay/nice-dag-vue3";
import SampleNode from './SampleNode';

export default {
  name: "MyFirstDag",
  ...
  setup() {
    let nodeCtnRef = 0;  //count of node is used to generate an unique id
    const addNode = () => {
      niceDagReactive.use().addNode(
        {
          id: `new-node-${nodeCtnRef}`,
        },
        { 
          x: 40,  //default posistion
          y: 40,
        }
      );
      nodeCtnRef = nodeCtnRef + 1;
    };
    ...
    return {
      addNode,
      niceDagEl,
      niceDagReactive,
    };
  },
};
</script>
```

**Notes:**
To call the [addNode](../api-ref/nice-dag.md#addnode) method, you need to give an unique node id.