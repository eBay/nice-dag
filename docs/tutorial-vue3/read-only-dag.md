---
sidebar_position: 1
---

# Read-Only DAG

## Pre-Steps

### Create a React Component

Since **Nice-Dag** doesn't give a **vue3** component in default, you need to create a **vue** component which can have a container showing DAG diagram.

```jsx
<template>
  <div>
    <div className="my-first-dag" ref="niceDagEl" />
  </div>
</template>

<script>
export default {
  name: 'MyFirstDag'
}
</script>
```

Please give the container default height or width (depends on direction of the DAG diagram). For this example, we should set height of the container.

```jsx
.my-first-dag {
  height: 400px;
  width: 400px;
}
```

### Create initNodes list

To simplify the sample, we add a mock node list to the same file of the component. The node list is used to initiate the DAG diagram.

```jsx
<script>
const NodeData = [
  {
    id: "start",
  },
  {
    id: "task",
    dependencies: ["start"],
  },
  {
    id: "end",
    dependencies: ["task"],
  },
];

export default {
  name: 'MyFirstDag'
}
</script>
```

The sample shows a typical DAG diagram has 3 nodes, **start**, **task**, and **end**.

Once you apply the hook to your application, you can adapt the incoming of the node list, such that it can be in the manner of **vue** component `property` or a list from **vue** `ref`.

## Step 1: Add `useNiceDag` hook

To use [useNiceDag](../api-ref/useNiceDag.md), you need to import it from `@ebay/nice-dag-vue3`.

```jsx
import { useNiceDag } from "@ebay/nice-dag-vue3";
```

After then, you can add the hook to the script.

```jsx
export default {
  name: "MyFirstDag",
  setup() {
    const { niceDagEl, niceDagReactive } = useNiceDag(
      {
        initNodes: NodeData,
      },
      false
    );
    return {
      niceDagEl,
      niceDagReactive,
    };
  },
};
```

There are two objects return by [useNiceDag](../api-ref/useNiceDag.md), of which one is **niceDagEl**, and the other is `niceDagReactive` which is a reference of **NiceDag**.

Essentically, the dom operations is handled by **nice-dag-core**, we give a DOM host which can associate **vue** component with pure DOM operations. `niceDagEl` is used to link the **vue** component to the DOM elements created by `nice-dag-core`.

```jsx
<div className="my-first-dag" ref="niceDagEl" />
```

## Step 2: Use NiceDagNodes to render DAG nodes

**Nice-Dag** doesn't give any default render for node. However, for **vue3**, you need to use a given component `NiceDagNodes` which wraps node renderers.

```jsx
<template>
  <div>
    <div className="my-first-dag" ref="niceDagEl" />
    <NiceDagNodes v-slot="slotProps" :niceDagReactive="niceDagReactive">
      <!--Add node renderers here-->
    </NiceDagNodes>
  </div>
</template>

<script>
import { NiceDagNodes, useNiceDag } from "@ebay/nice-dag-vue3";

export default {
  name: "MyFirstDag",
  components: {
    NiceDagNodes,
  },
  setup() {
    const { niceDagEl, niceDagReactive } = useNiceDag(
      {
        initNodes: NodeData,
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

As the above code shows, the `niceDagReactive` should be assigned to the `NiceDagNodes`.

Now, you can create customized node renderers (a separated file **SampleNode.vue**). To simplify the example, here is to use a JSX vue component.

```jsx
export const SampleNode = {
  props: ["node"],
  emits: ["update:node"],
  render() {
    return (
      <div className="my-first-dag-node">
        <span>{this.node.id}</span>
      </div>
    );
  },
};
```

We also need to give a simple style.

```jsx
.my-first-dag-node {
  width: 100%;
  height: 100%;
  border: 1px solid black;
}
```

After then, you can import the component and add the component to be one of `NiceDagNodes` slot components.

```jsx
<template>
  <div>
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
  components: {
    NiceDagNodes,
    SampleNode,
  },
  setup() {
    const { niceDagEl, niceDagReactive } = useNiceDag(
      {
        initNodes: NodeData,
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
The node object can be derived from `slotProps` of `NiceDagNodes`.

Besides, you need to give the size of node by a function.

```jsx
<script>
import { NiceDagNodes, useNiceDag } from "@ebay/nice-dag-vue3";

function getNodeSize({ node }) {
  return {
    width: 60,
    height: 60,
  };
}

export default {
  name: "MyFirstDag",
  components: {
    NiceDagNodes,
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

## Step 3: Adapt DAG diagram position

If you want to make the diagram position in the center of the container, you can call [**niceDag.center**](../api-ref/nice-dag.md#center) function within a `onMounted` hook.

```jsx
<script>
import { NiceDagNodes, useNiceDag } from "@ebay/nice-dag-vue3";

function getNodeSize({ node }) {
  return {
    width: 60,
    height: 60,
  };
}

export default {
  name: "MyFirstDag",
  components: {
    NiceDagNodes,
  },
  setup() {
    const { niceDagEl, niceDagReactive } = useNiceDag(
      {
        initNodes: NodeData,
        getNodeSize
      },
      false
    );
    onMounted(() => {
      const niceDag = niceDagReactive.use();  //get niceDag object
      if (niceDag) {
        const bounds = niceDagEl.value.getBoundingClientRect();
        niceDag.center({
          width: bounds.width,
          height: 400,
        });
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

Please check if [niceDag](../api-ref/nice-dag.md) exists before use the `center` api.

Finally, we can get the **DAG diagram** , as shown below.

![sampleDAG](../../static/img/sampleDAG.png)
