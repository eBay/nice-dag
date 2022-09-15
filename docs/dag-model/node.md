---
sidebar_position: 2
---

# Node

**Node** is the unit of DAG diagram, which can represent an activity like a batch process, a task, etc.

## Properties

| Property          | Optional | Description                                          | Type                                                              | Default          |
| :---------------- | :------- | :--------------------------------------------------- | :---------------------------------------------------------------- | :--------------- |
| id                | No       | Node Identifier                                      | string                                                            |                  |
| dependencies      | Yes      | List of ID list which represents the node depends on | string[]                                                          |                  |
| data              | Yes      | Data object of node                                  | A flexible JSON Object                                                          |                  |
| children          | Yes      | Child Nodes                                          | [Node](node)[]                                                            |                  |
| parentId          | Yes      | Parent Node Id                                       | string                                                            |                  |
| collapse          | Yes      | Boolean indicator shows if children are hidden       | boolean                                                           |                  |
| edgeConnectorType | Yes      | Position of edge connector                           | [EdgeConnectorType](#edgeconnectortype) | [CENTER_OF_BORDER](#edge-connector-type-center-of-border) |

## API (IViewNode)

After the DAG initialization, all **Node** objects given by the uses are wrapped with a set of API that can control node behavior. The wrap object is called `IViewNode`.

| Name         | Description                                           | Type                                                      |
| ---------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| shrink           | Hide child nodes | `()=>void`                                                |
| expand           | Show all child nodes  | `()=>void`                                                |
| remove           | Remove the node                                       | `()=>void`                                                |
| withChildren     | Call the method can change the children of the node   | ` (promise: Promise<Node[]>, useCache?: boolean) => void` |
| joint            | Indicator which shows the node is a joint node        | `boolean`                                                 |
| setPoint         | Set node position                                     | `(point: Point) => void`                                  |
| connect          | Create an Edge with the given node                    | `(node: IViewNode) => void`                               |
| addChildNode     | Add a child node                                      | `(node: Node, point: Point) => void`                      |

## Enums

### EdgeConnectorType


| Enum         | Description              |
| ---------------- | ------------------ |
| <a name="edge-connector-type-center-of-border">CENTER_OF_BORDER</a> | Center position of the node border |
| <a name="edge-connector-type-center">CENTER</a>           | Center position of the node           |