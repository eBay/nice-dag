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
The api make the main layer scroll to target id element.

### setDirection
```jsx
(direction: NiceDagDirection) => void
```
The api can set the direction of the diagram.
#### Arguments
| Name           | Optional | Description | Type  |
| --------------- | -------- | ----------|------------ |
| direction       | No       | Direction of the diagram | [NiceDagDirection](./nice-dag-config.md#nicedagdirection)|

### getScrollPosition
```jsx
() => Point
```
The api can get the main layer scroll distance.
#### Return
| Name           | Description | Type  |
| --------------- | -------- | ----------|
| Point       | Point position | [Point](../api-ref/api-ref.md#point)|

### getAllNodes
```jsx
() => IViewNode[]
```
The api can get all nodes and return the array of IViewNode.
#### Return
| Name           | Description | Type  |
| --------------- | -------- | ----------|
| IViewNode[]     | An array of IViewNode | [IViewNode](../dag-model/node.md#api-iviewnode) []|

### getAllEdges
```jsx
() => IEdge[]
```
The api can gey all edges and return the array of IEdge.
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
The api is to start editing.
### stopEditing
```jsx
() => void
```
The api is yo stop editing.
### prettifier
```jsx
() => void
```
The api is to prettify the diagram and get neat layout.
### startEdgeDragging
```jsx
(node: IViewNode, e: MouseEvent) => void
```
The api allows the edge start dargging, which is used as a MouseEvent listener.
#### Arguments
| Name            | Optional | Description | Type  |
| --------------- | -------- | ----------|------------ |
| node           | No       | IViewNode | [IViewNode](../dag-model/node.md#api-iviewnode)  |
| e           | No       | MouseEvent | MouseEvent |

### startNodeDragging
```jsx
(node: IViewNode, e: MouseEvent) => void
```
The api allows the node start dargging, which is used as a MouseEvent listener.
#### Arguments
| Name            | Optional | Description | Type  |
| --------------- | -------- | ----------|------------ |
| node           | No       | IViewNode | [IViewNode](../dag-model/node.md#api-iviewnode)  |
| e           | No       | MouseEvent | MouseEvent |

### addNode
```jsx
(node: Node, point: Point, targetNodeId?: string) => void
```
The api can add a node to target position. If set targetNodeId, it will add a child node of targetNodeId.
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
The api can add a joint node to target position. If set targetNodeId, it will add a child joint node of targetNodeId.
#### Arguments
| Name            | Optional | Description | Type  |
| --------------- | -------- | ----------|------------ |
| node           | No       | Node | [IViewNode](../dag-model/node.md#node)  |
| point          | Yes      | Target positon | [Point](../api-ref/api-ref.md#point) |
| targetNodeId   | Yes      | Parent node id | string

