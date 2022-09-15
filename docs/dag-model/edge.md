---
sidebar_position: 3
---

# Edge

**Edge** represents lines that connect the [Node](./node.md). The edge is not created by the user but initalized by Nice-DAG according to the dependencies defined by given [Node](./node.md) set.

## Properties

| Property    | Optional | Description                        | Type                                  | 
| :---------- | :------- | :--------------------------------- | :------------------------------------ |
| source      | No       | Source Node                        | [IViewNode](./node.md#api-iviewnode)      |
| target      | No       | Target Node                        | [IViewNode](./node.md#api-iviewnode)      |

## API(IEdge)

| Name         | Description                                           | Type                                                      |
| ---------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| remove           | Remove the edge                                       | `()=>void`                                                |
| insertNodes     | Insert nodes between `source` and `target` of the edge   | `(nodes: Node[], offset?: number) => void;` |