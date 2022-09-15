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

### setDirection
```jsx
(direction: NiceDagDirection) => void
```
#### Arguments
| Name           | Optional | Description | Type  |
| --------------- | -------- | ----------|------------ |
| direction       | No       | Direction of the diagram | [NiceDagDirection](./nice-dag-config.md#nicedagdirection)|

### getScrollPosition
```jsx
() => Point
```
#### Return
| Name           | Description | Type  |
| --------------- | -------- | ----------|
| Point       | Point position | [Point](../api-ref/api-ref.md#point)|

### getAllNodes
```jsx
() => IViewNode[]
```
#### Return
| Name           | Description | Type  |
| --------------- | -------- | ----------|
| IViewNode[]     | An array of IViewNode | [IViewNode](../dag-model/node.md#api-iviewnode) []|

### getAllEdges
```jsx
() => IEdge[]
```
#### Return 
| Name            | Description | Type  |
| --------------- | -------- | ----------|
| IEdge         | `IEdge` | [IEdge](../dag-model/edge.md) |
### withNodes
```jsx
(nodes: Node[]) => NiceDag
```
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
### stopEditing
```jsx
() => void
```
### prettifier
```jsx
() => void
```
### startEdgeDragging
```jsx
(node: IViewNode, e: MouseEvent) => void
```
#### Arguments
| Name            | Optional | Description | Type  |
| --------------- | -------- | ----------|------------ |
| node           | No       | IViewNode | [IViewNode](../dag-model/node.md#api-iviewnode)  |
| e           | No       | MouseEvent | MouseEvent |

### startNodeDragging
```jsx
(node: IViewNode, e: MouseEvent) => void
```
#### Arguments
| Name            | Optional | Description | Type  |
| --------------- | -------- | ----------|------------ |
| node           | No       | IViewNode | [IViewNode](../dag-model/node.md#api-iviewnode)  |
| e           | No       | MouseEvent | MouseEvent |

### addNode
```jsx
(node: Node, point: Point, targetNodeId?: string) => void
```
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

#### Arguments
| Name            | Optional | Description | Type  |
| --------------- | -------- | ----------|------------ |
| node           | No       | Node | [IViewNode](../dag-model/node.md#node)  |
| point          | Yes      | Target positon | [Point](../api-ref/api-ref.md#point) |
| targetNodeId   | Yes      |  | string

