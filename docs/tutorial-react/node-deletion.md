---
sidebar_position: 7
---

# Remove a Node

In terms of editable DAG, Nice-DAG supports node deletion. The example extends [Add Node to DAG](./node-creation).

## Step 1: Add a DOM node handling node deletion

Because Nice-DAG doesn't give any node component, the delete actions should be handle by a DOM node separately like `button` or `<a/>`. To do this, you need to adapt the renderNode method. Since we re-use Dragging and Dropping example, you can simply adapt the SampleNode component.

```jsx
import { useNiceDag, useNiceDagNode } from "@ebay/nice-dag-react";

function SampleNode({ node, niceDag }) {
  const { startNodeDragging } = useNiceDagNode({ node, niceDag }); //call nice dag hook to get the startNodeDragging method
  return (
    <div className="my-first-dag-node">
      <span onMouseDown={startNodeDragging}>{node.id}</span>
      <Connector node={node} niceDag={niceDag}/>
      <a>X</a> <!--to handle deletion-->
    </div>
  );
}
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

After then, you can get [onNodeRemove](../api-ref/useNiceDagNode.md#onnoderemove) function from [useNiceDagNode](../api-ref/useNiceDagNode.md) hook and bind the event listener to `<a/>`.

```jsx
import { useNiceDag, useNiceDagNode } from "@ebay/nice-dag-react";

function SampleNode({ node, niceDag }) {
  const { startNodeDragging, onNodeRemove } = useNiceDagNode({ node, niceDag }); //call nice dag hook to get the startNodeDragging method
  return (
    <div className="my-first-dag-node">
      <span onMouseDown={startNodeDragging}>{node.id}</span>
      <Connector node={node} niceDag={niceDag}/>
      <a onClick={onNodeRemove}>X</a>
    </div>
  );
}
```