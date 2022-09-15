---
sidebar_position: 6
---

# Add Node to DAG

In terms of editable DAG, Nice-DAG supports adding nodes to existing DAG diagram. The example extends [Drag And Drop (Edge)](./edge-drag-drop).

## Step 1: Add a DOM node handling node creation

```jsx
export function MyFirstDag() {
  const { niceDagEl, render, niceDag } = useNiceDag({
    initNodes: NodeData,
    editable: true,
  });

  ...

  return (
    <div>
      <div className="control-bar">
        <button>Add</button>  <!--Here is to add a button-->
      </div>
      <div className="my-first-dag" ref={niceDagEl} />
      {render()}
    </div>
  );
}
```

## Step 2: Add an event listener to create node

The node creation is realized by a [NiceDag](../api-ref/nice-dag.md) API. In order to optimize React component updating, you can call the API within a `useCallback` clause.

```jsx
import React, {useCallback} from 'react';

let nodeCtnRef = 0; //Node count reference which is used to make node id unique.

export function MyFirstDag() {
  const { niceDagEl, render, niceDag } = useNiceDag({
    initNodes: NodeData,
    editable: true,
  });

  ...

  const createNodeFn = useCallback(() => {
    niceDag.addNode({
        id: `new-node-${nodeCtnRef}`,
    }, {
        x: 40, //offsetX related to the top container of DAG view
        y: 40  //offsetY related to the top container of DAG view
    });
    nodeCtnRef = nodeCtnRef + 1;
  }, [niceDag]);

  return (
    <div>
      <div className="control-bar">
        <button onClick={createNodeFn}>Add</button>
      </div>
      <div className="my-first-dag" ref={niceDagEl} />
      {render()}
    </div>
  );
}
```

**Notes:**
To call the [addNode](../api-ref/nice-dag.md#addnode) method, you need to give an unique node id.