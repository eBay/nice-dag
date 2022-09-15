---
sidebar_position: 5
---

# Drag And Drop (Node)

To enable **dnd** support, we need to create an editable DAG view. The editable DAG example extends [Read-Only DAG](./read-only-dag).

## Step 1: Add `editable` to `useNiceDag` hook

To make the DAG view editable is pretty simple. You can add a boolean parameter `editable` to the [useNiceDag](../api-ref/useNiceDag.md) hook. Besides, you need to have a React hook which should call [startEditing()](../api-ref/nice-dag.md#startediting) because Nice-DAG disables edit function in default.

```jsx
export function MyFirstDag() {
  //call useNiceDag
  const { niceDagEl, render, niceDag } = useNiceDag({
    initNodes: NodeData,
    editable: true,
  });

  useEffect(() => {
    if (niceDag) {
      niceDag.startEditing(); //MUST call startEditing before edit DAG
    }
  }, [niceDag]);

  return (
    <div>
      <div className="my-first-dag" ref={niceDagEl} />
      {render()}
    </div>
  );
}
```

## Step 2: Add Dragging&Dropping event listener

To make the node movable, you need to adapt the method signature of `renderNode` by add `niceDag` parameter.

```jsx
function renderNode({ node, niceDag }) {
  return <SampleNode node={node} niceDag={niceDag} />;
}
```
After then, you need to pass `niceDag` to the node component.

```jsx
import { useNiceDag, useNiceDagNode } from "@ebay/nice-dag-react";

function SampleNode({ node, niceDag }) {
  const { startNodeDragging } = useNiceDagNode({ node, niceDag }); //call nice dag hook to get the startNodeDragging method
  return (
    <div className="my-first-dag-node">
      <span onMouseDown={startNodeDragging}>{node.id}</span>
    </div>
  );
}
```

As the code shows, the event listener [startNodeDragging](../api-ref/nice-dag.md#startnodedragging) is returned by [useNiceDagNode](../api-ref/useNiceDagNode.md) hook so that you need to import it from `@ebay/nice-dag-react`. After then, you need to bind the event listener to `onMouseDown` of the target DOM which should be clickable for movement. 

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

