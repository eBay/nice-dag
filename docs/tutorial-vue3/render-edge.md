---
sidebar_position: 2
---

# Render Edge

Besides `NiceDagNodes`, Nice-DAG also allows you to use a given **vue** component which wraps an edge render. To simplify the illustration, the Edge render example extends [Read-Only DAG](./read-only-dag).


## Step 1: Create an Edge render function

Same as that of node component, it's strongly recommend that you can create a separate React component for edges.

```jsx
export const Edge = {
  props: ['source', 'target'],
  emits: ['update:source',"update:target'],
  render() {
    return <div className="my-first-dag-edge">{edge.source.id} to {edge.target.id}</div>;
  }
}
```

You can also specify the edge styles. Usually, you can adapt the `margin-top` to adapt the position of edge labels (above or below the line).

```css
.my-first-dag-edge {
  text-align: center;
  margin-top: -20px;
}
```

## Step 2: Use NiceDagEdges to render DAG edges

Once you have the edge **vue** component, you can simply add it to be slot component of `NiceDagEdges`.

```jsx
<template>
  <div>
    <div className="my-first-dag" ref="niceDagEl" />
    <NiceDagNodes v-slot="slotProps" :niceDagReactive="niceDagReactive">
      <SampleNode :node="slotProps.node"/>
    </NiceDagNodes>
    <NiceDagEdges v-slot="slotProps" :niceDagReactive="niceDagReactive">
        <Edge :source="slotProps.edge.source" :target="slotProps.edge.target"/>
      </NiceDagEdges>
  </div>
</template>

<script>
import { NiceDagNodes, useNiceDag, NiceDagEdges } from "@ebay/nice-dag-vue3";
import Edge from "./Edge";
import SampleNode from "./SampleNode";

...

export default {
  name: "MyFirstDag",
  components: {
    NiceDagNodes,
    NiceDagEdges,
    SampleNode,
    Edge,
  },
  setup() {
    const { niceDagEl, niceDagReactive } = useNiceDag(
      {
        initNodes: NodeData,
        getNodeSize
      },
      false
    );
    return {
      niceDagEl,
      niceDagReactive,
    };
  },
};
</script>
```
