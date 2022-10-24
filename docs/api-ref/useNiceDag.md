---
sidebar_position: 8
---

# useNiceDag(React)

In terms of React applications, you can simply use this customized react hook which is given by `nice-dag-react` module. Essentially, it's a wrapper of the API of `nice-dag-core`.

```jsx
useNiceDag(args: UseNiceDagArgs): UseNiceDagType
```

## Arguments(UseNiceDagArgs)

For the usage of react hook, the object extends [NiceDagConfig](./nice-dag-config.md). Besides its parent declarations, the below list show properties and API of it which need users to give.

### Properties

| Name                       | Optional | Description | Type | Default Value |
|-----|-----|-----|-----|-----|
|editable|Yes|If it is true, the DAG diagram can be editable after initialization|boolean|`false`
|initNodes|No|The init nodes list|[Node](../dag-model/node.md)[]|
|scrollPosition|Yes|The init position of scroll bar|[Point](../dag-model/geometry.md#point)

For more properties, you can click [here](./nice-dag-config.md).

### renderNode

```jsx
(props: NiceDagNodeProps) => React.Component<any, any>;
```

The method is **MANDATORY**. The key of [input](#nicedagnodeprops) is the node object. You can have different renders according to the content which the node contains. 

### renderEdge
```jsx
(props: NiceDagEdgeProps) => React.Component<any, any>;
```
The method is **OPTIONAL**. If you give the method, it will be invoked once the DAG diagram initialization finishes.

### onMount
```jsx
() => void;
```
The method is **OPTIONAL**. If you give the method, it will be invoked once the DAG diagram initialization finishes.

## Return (UseNiceDagType)

| Name          | Description | Type |
| ------------- | ----------- | ---- |
| niceDagEl | A react ref object links to a DOM (host of DAG diagram)            | `react.MutableRefObject<any>`     
| minimapEl | A react ref object links to a DOM (host of minimap diagram)            | `react.MutableRefObject<any>`    
| nicedag   | The api set which can control the DAG diagram            |   [NiceDag](./nice-dag.md)   |
| render    | A function which performs rendering for the DAG diagram            | `() => JSX.Element[]`     
| reset    | A function which can reset the DAG diagram            | `() => void;`      

**Notes**: The render method call **MUST** be called within a DAG diagram container.

## Props Types

### NiceDagNodeProps
| Name          | Description | Type |
| ------------- | ----------- | ---- |
| node | The node object  | [IViewNode](../dag-model/node.md) |
| niceDag | Nice Dag object  | [NiceDAG](./nice-dag.md) |

### NiceDagEdgeProps
| Name          | Description | Type |
| ------------- | ----------- | ---- |
| edge | The edge object  | [IEdge](../dag-model/edge.md) |
| niceDag | Nice Dag object  | [NiceDAG](./nice-dag.md) |