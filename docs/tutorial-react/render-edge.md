---
sidebar_position: 2
---

# Render Edge

Besides `renderNode`, Nice-DAG also allows you to define a render for an edge. To simplify the illustration, the Edge render example extends [Read-Only DAG](./read-only-dag).


## Step 1: Create an Edge render function

Same as that of node component, it's strongly recommend that you can create a separate React component for edges.

```jsx
function Edge({edge}) {
    return <div className="my-first-dag-edge">{edge.source.id} to {edge.target.id}</div>;
}

const renderEdge = props => {
  return <Edge {...props} />;
};
```

The `edge` object is passed the functional component as the properties. It is given by Nice-DAG in default.

You can also specify the edge styles. Usually, you can adapt the `margin-top` to adapt the position of edge labels (above or below the line).

```css
.my-first-dag-edge {
  text-align: center;
  margin-top: -20px;
}
```

## Step 2: Pass the render function to useNiceDag

Once you have the render method, you can simply add it to be the parameter of [useNiceDag](../api-ref/useNiceDag.md).

```jsx
import { useNiceDag } from "@ebay/nice-dag-react";
...

export function MyFirstDag() {
  //call useNiceDag
  const { niceDag, niceDagEl, render } = useNiceDag({
    initNodes: NodeData,
    renderNode,
    renderEdge,  //pass edge render function 
    getNodeSize
  });
  ...
}
```
