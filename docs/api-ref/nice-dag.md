---
sidebar_position: 1
---

# NiceDag

**NiceDag** defines a set of API which can control the DAG diagram.

## Properties

| Property           | Description | Type                                                                        |
| ------------------ | ----------- | --------------------------------------------------------------------------- |
| id                 | Id of DAG diagram            | string                                                                      |
| config             | DAG diagram configuration        | [NiceDagConfig](./nice-dag-config)                                                               |

## API

### setScale

```jsx
(scale:number) => void
```
The api can set scale of the diagram. The scale range is from 0 to 1.

### center

```jsx
(size: Size) => NiceDag
```

The api can make the diagram be the center position of its parent container. 

#### Arguments

| Name           | Optional | Description | Type  |
| --------------- | -------- | ----------|------------ |
| size           | No       | Size of its parent container | [Size](../dag-model/geometry.md#size)|

#### Returns 
| Name           | Description | Type  |
| --------------- | -------- | ----------|
| NiceDag         | `itself` | [NiceDag](./nice-dag.md)|


### scrollTo

```jsx
(id: string) => void
```
The api make the main layer scroll to the target id element.

### setDirection
```jsx
(direction: NiceDagDirection) => void
```
The api can set the direction of the DAG diagram.
#### Arguments
| Name           | Optional | Description | Type  |
| --------------- | -------- | ----------|------------ |
| direction       | No       | Direction of the diagram | [NiceDagDirection](./nice-dag-config.md#nicedagdirection)|

### getScrollPosition
```jsx
() => Point
```
The api can get the scroll distance of the main layer.
#### Return
| Name           | Description | Type  |
| --------------- | -------- | ----------|
| Point       | Point position | [Point](../api-ref/api-ref.md#point)|

### getAllNodes
```jsx
() => IViewNode[]
```
The api can get all nodes and return an array of IViewNode.
#### Return
| Name           | Description | Type  |
| --------------- | -------- | ----------|
| IViewNode[]     | An array of IViewNode | [IViewNode](../dag-model/node.md#api-iviewnode) []|

### getAllEdges
```jsx
() => IEdge[]
```
The api can gey all edges and return an array of IEdge.
#### Return 
| Name            | Description | Type  |
| --------------- | -------- | ----------|
| IEdge         | `IEdge` | [IEdge](../dag-model/edge.md) |
### withNodes
```jsx
(nodes: Node[]) => NiceDag
```
The api deal with init nodes and generate model and view.
#### Arguments
| Name            | Optional | Description | Type  |
| --------------- | -------- | ----------|------------ |
| nodes           | No       | Nodes array | [Node](../dag-model/node.md#node)[]  |
#### Return
| Name            | Description | Type  |
| --------------- | -------- | ----------|
| NiceDag         | `itself` | [NiceDag](./nice-dag.md) |

## API (Editable DAG)

The follow APIs are only applicable for editable DAG diagram.
### startEditing
```jsx
() => void
```
The api can make a DAG diagram editable. Usually, it is used to swipe editing feature (read-only vs editable).

### stopEditing
```jsx
() => void
```
The api can disable a DAG diagram editing feature.

### prettify
```jsx
() => void
```
The api can re-layout the DAG diagram according to the nodes and nodes' dependencies. If a node is editing, the node won't be impacted by the API.

### addNode
```jsx
(node: Node, point: Point, targetNodeId?: string) => void
```
The api can add a node to the target position. If targetNodeId is set, it will add a child node of targetNodeId.
#### Arguments
| Name            | Optional | Description | Type  |
| --------------- | -------- | ----------|------------ |
| node           | No       | Node | [IViewNode](../dag-model/node.md#node)  |
| point          | Yes      | Target positon | [Point](../api-ref/api-ref.md#point) |
| targetNodeId   | Yes      | Parent node id | string

### addJointNode
```jsx
(node: Node, point: Point, targetNodeId?: string) => void
```
The api can add a joint node to the target position. If targetNodeId is set, it will add a joint child node of targetNodeId.
#### Arguments
| Name            | Optional | Description | Type  |
| --------------- | -------- | ----------|------------ |
| node           | No       | Node | [IViewNode](../dag-model/node.md#node)  |
| point          | Yes      | Target positon | [Point](../api-ref/api-ref.md#point) |
| targetNodeId   | Yes      | Parent node id | string

