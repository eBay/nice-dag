---
sidebar_position: 9
---

# useNiceDagNode(React)

The method is used to get utilities methods for node deletion and listeners of edge dragging and node dragging.

```jsx
useNiceDagNode(
        { node, niceDag }: { node: IViewNode, niceDag: NiceDag }
    ) : { onNodeRemove, startEdgeDragging, startNodeDragging }
```


## Arguments

### node

[IViewNode](../dag-model/node.md#api-iviewnode) object is given by **nice-dag**.

### niceDag

[NiceDag](./nice-dag.md) object allows you to control the DAG diagram

## Return

### onNodeRemove

```jsx
() => void
```

The function is usually used as an event listener. Once it is bound to a DOM object, it can perform the node deletion when the event is fired.

### startNodeDragging

```jsx
(e: MouseEvent): void
```

The function is used as a MouseEvent listener. You need to add the mouse listener to the DOM which can be movable. 


### startEdgeDragging

```jsx
(e: MouseEvent): void
```

The function is used as a MouseEvent listener. You need to add the mouse listener to the DOM (positioned in a node component) which can be regarded as the outbound of the node. 
