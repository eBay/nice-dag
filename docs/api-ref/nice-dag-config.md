---
sidebar_position: 2
---

# NiceDagConfig

**NiceDagConfig** is a configuration object of DAG diagram.

## Properties

| Property           | Optional | Description | Type                                                                        | Default Value|
| ------------------ | -------- | ----------- | --------------------------------------------------------------------------- |--------------|
| mode               | Yes | Type of DAG diagram. Currently, there are only 2 mode, if DAG diagram should create joint node automatically.| [NiceDagMode](#nicedagmode) | [NiceDagMode.DEFAULT](#nicedagmode)
| graphLabel         | Yes | GraphLabel is the object derived from dagre |[GraphLabel](#graphlabel)|`{rankdir: "LR",  ranksep: 60,  edgesep: 10}`
| gridConfig         | Yes| Gird [Config](#gridconfig). It is only applicable when DAG view is editable. |[Size](../dag-model/geometry.md#size)|`color: "blue",  size: 40}`
| modelType         | Yes| | [NiceDagModelType](#nicedagmodeltype) | [NiceDagModelType.HIERARCHY](#nice-dag-model-hierarchy)
| edgeConnectorType   | Yes|Default edge connector type, which deterimines the position of node edges | [EdgeConnectorType](../dag-model/node.md#edgeconnectortype) | [EdgeConnectorType.CENTER_OF_BORDER](../dag-model/node.md#edge-connector-type-center-of-border)
| edgeConnectorType   | Yes| Default edge connector type, which deterimines the position of joint node edges| [EdgeConnectorType](../dag-model/node.md#edgeconnectortype) | [EdgeConnectorType.CENTER](../dag-model/node.md#edge-connector-type-center)
| subViewPadding   | Yes| Padding of subview| [Padding](../dag-model/geometry.md#padding) | `{top: 40,bottom:20,left:20,right: 20}`
| minimapConfig   | Yes| Mini-map configuration| [MinimapConfig](#minimapconfig) | `{top: 40,bottom:20,left:20,right: 20}`
| getNodeSize | No | The method asks users to implement| [GetNodeSize](#genodesize)|

## Interfaces
### getNodeSize

```jsx
(node: Node) => Size;
```

The method is **MANDATORY**. The key of [input](#nicedagnodeprops) is the node object. You can have different renders according to the content which the node contains. 

## Enums
### NiceDagMode
| Property         | Description  | 
| ---------------- | ------------ | 
| DEFAULT          | No joint nodes created in default 
| WITH_JOINT_NODES | Create joint nodes in default   

### NiceDagModelType
| Property  | Description       |
| --------- | ----------- |
| <a name="nice-dag-model-hierarchy">HIERARCHY</a> | `children` of nodes represent a node group |
| FLATTEN   | `parentId` of nodes associate nodes as a node group   |

### NiceDagDirection

It is used to define DAG diagram direction

| Property |  Description        |
| -------- |  ------------------ |
| LR       |  From left to right |
| RL       |  From right to left |
| TB       |  From top to button |
| BT       |  From button to top |

## Configurations
### GridConfig
Grid configuration object is used by editable view only.

| Property | Description | Type   |
| -------- | ----------- | ------ |
| gridSize | width & height of the grid   | number |
| color    | link color (hex)  | string |

### MinimapConfig
| Property         | Description | Type   |
| ---------------- | ----------- | ------ |
| className        | Class name of minimap container            | string |
| viewBoxClassName | Class name of view box in the minimap container        | string |

### GraphLabel

The graph label type is defined by dagre. For most cases, you can focus the following fields. 

| Property         | Description | Type   | Default |
| ---------------- | ----------- | ------ | ----|
| ranksep        | Distance of two nodes            | number | 60
| edgesep | Distance of two edges        | number | 10
| rankdir | Direction of diagram  `LR` `RL` `TB` `BT`  | string | LR

For others, you can check it from dagre official website.