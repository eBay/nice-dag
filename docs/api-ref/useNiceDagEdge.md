---
sidebar_position: 10
---

# useNiceDagEdge

The method is used to get utilities methods for edge deletion and node inserting.

```jsx
useNiceDagEdge(edge: IEdge): { onEdgeRemove, onNodeInsert}
```

## Arguments(UseNiceDagArgs)

[IEdge](../dag-model/edge.md#apiiedge) object is given by **nice-dag**.

## Return

### onEdgeRemove

```jsx
() => void
```

The function is usually used as an event listener. Once it is bound to a DOM object, it can perform the edge deletion when the event is fired.

### onNodeInsert

```jsx
(nodes: NiceDagTypes.Node[], offset: number) => void
```

The function is used to insert nodes between **source** node and **target** of the edge.

#### Arguments

| Name   | Optional | Description                                      | Type                                    |
| ------ | -------- | ------------------------------------------------ | --------------------------------------- |
| nodes  | No       | Given node list (You need to give the node list) | [Node](../dag-model/node.md)[]          |
| offset | Yes      | The offset (x,y) position of the start node)     | [Point](../dag-model/geometry.md#point) |
