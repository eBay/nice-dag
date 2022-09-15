---
sidebar_position: 6
---

# Drag And Drop (Edge)

Besides the node dragging and dropping support, Nice-DAG also support edge dragging and dropping. To simplify the illustration, the example extends [Drag And Drop (Node)](./node-drag-drop).

## Step 1: Add Connector component to Node

The `Connector` component is a separated component that can handle dragging events of edge connection. The component should be added to the node component.

```jsx
function Connector({ node, niceDag }) {
  return <div className={`my-first-dag-connector`}/>
}

function SampleNode({ node, niceDag }) {
  return (
    <div className="editable-sample-node">
      <Connector node={node} niceDag={niceDag}/>
    </div>
  );
}
```

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

## Step 2: Add dragging event listener to the connector

Nice-DAG gives an edge dragging event listener in default. To get the listener, you need to use [useNiceDagNode](../api-ref/useNiceDagNode.md) hook. 

```jsx
function Connector({ niceDag, node }) {
  const { startEdgeDragging } = useNiceDagNode({ node, niceDag });
  return <div className={`my-first-dag-connector`} onMouseDown={startEdgeDragging}/>;
}
```
