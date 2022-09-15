---
sidebar_position: 7
---

# API Reference

### Size

| Property | Description | Type   |
| -------- | ----------- | ------ |
| width    | Node width  | number |
| height   | Node height | number |

### Point

| Property | Description | Type   |
| -------- | ----------- | ------ |
| x        |             | number |
| y        |             | number |

### Padding

| Property | Description    | Type   | Default Value |
| -------- | -------------- | ------ | ------------- |
| top      | Padding top    | number |               |
| bottom   | Padding bottom | number |               |
| left     | Padding left   | number |               |
| right    | Padding right  | number |               |

### NiceDagMode (enum)

| Property         | Description  | Value              |
| ---------------- | ------------ | ------------------ |
| DEFAULT          | Default mode | "DEFAULT"          |
| WITH_JOINT_NODES |              | "WITH_JOINT_NODES" |

### EdgeAttributes

| Property  | Description                                   | Type    |
| --------- | --------------------------------------------- | ------- |
| color     | Edge color                                    | string  |
| hideArrow | Choose whether to hide the arrow in the edges | boolean |

### GraphLabel

| Property  | Description | Type    |
| --------- | ----------- | ------- |
| width     |             | number  |
| height    |             | number  |
| compound  |             | boolean |
| rankdir   |             | string  |
| align     |             | string  |
| nodesep   |             | number  |
| edgesep   |             | number  |
| ranksep   |             | number  |
| marginx   |             | number  |
| marginy   |             | number  |
| acyclicer |             | string  |
| ranker    |             | string  |

### GridConfig

| Property | Description | Type   |
| -------- | ----------- | ------ |
| gridSize | grid size   | number |
| color    | grid color  | string |

### NiceDagModelType (enum)

| Property  | Value       |
| --------- | ----------- |
| HIERARCHY | "HIERARCHY" |
| FLATTEN   | "FLATTEN"   |

### NiceDagDirection (enum)

| Property | Value | Description        |
| -------- | ----- | ------------------ |
| LR       | "LR"  | From left to right |
| RL       | "RL"  | From right to left |
| TB       | "TB"  | From top to button |
| BT       | "BT"  | From button to top |

### EdgeConnectorType (enum)

| Property         | Description | Value              |
| ---------------- | ----------- | ------------------ |
| CENTER_OF_BORDER |             | "CENTER_OF_BORDER" |
| CENTER           |             | "CENTER"           |

### MinimapConfig

| Property         | Description | Type   |
| ---------------- | ----------- | ------ |
| className        |             | string |
| viewBoxClassName |             | string |

### NiceDag

| Property           | Description | Type                                                                        |
| ------------------ | ----------- | --------------------------------------------------------------------------- |
| id                 |             | string                                                                      |
| render             |             | `() => void`                                                                |
| destory            |             | `() => void`                                                                |
| setScale           |             | `(scale: number) => void`                                                   |
| center             |             | `(size: Size) => niceDag`                                                   |
| scrollTo           |             | `(id: string) => void`                                                      |
| setDirection       |             | (direction: [NiceDagDirection](./api-ref.md#nicedagdirection-enum)) => void |
| getScrollPosition  |             | `() => Point`                                                               |
| getAllNodes        |             | `() => IViewNode[]`                                                         |
| getAllEdges        |             | `() => IEdge[]`                                                             |
| getElementByNodeId |             | `(id: string) => HTMLElement`                                               |
| getEdgeLabel       |             | `(sourceId: string, targetId: string) => HTMLElement`                       |
| withNodes          |             | `(nodes: Node[]) => niceDag`                                                |
| findNodeById       |             | `(id: String) => IViewNode`                                                 |
| fireNiceDagChange  |             | `() => void`                                                                |
| fireMinimapChange  |             | `() => void`                                                                |
| config             |             | NiceDagConfig                                                               |
