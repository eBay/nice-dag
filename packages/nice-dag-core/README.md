# nice-dag-core

## What Is nice-dag-Core?

nice-dag-Core is one of kernel libraries. It creates and maintains an easy-to-use DOM structure for visualising directed graphs. The positions of nodes and lines are calculated based on [Dagre](https://github.com/dagrejs/dagre). Various APIs and rendering layers are provided for injecting custom elements. Rendering nodes inside nodes are also supported.

## Use nice-dag-Core in Your Project

Install nice-dag-core with NPM:
```bash
npm install '@ebay/nice-dag-core'
```

Import the the library:
```js
const NiceDag = require('@ebay/nice-dag-core');
// or
import NiceDag from '@ebay/nice-dag-core';
```

## Initialization

The `init` function returns an unique ID for you to keep track of the graph. To initialize a graph properly, you need to provide the properties below. 

### Mandatory Property

| Property | Description | Type | 
|:---------|:-------------|:-------------|
| containerHtmlElm | An HTML element that wraps the graph | HTMLElement |
| getNodeSize | A function providing width and height of each node placeholder | Size |

### Optional Property

| Property | Description | Type | Default | 
|:---------|:-------------|:-------------|:-------------|
| padding | Padding of each group node placeholder | Padding | `{ top: 0, bottom: 0, left: 0, right: 0 }` |
| graphLabel | Parameters for calculating the graph layout | dagre.GraphLabel | `{ rankdir: 'LR', ranksep: 60, edgesep: 10 }` |
| mapNodeToElement | Create an HTML element for a node and show on the page | (node: Node) => HTMLElement | |
| mapEdgeToPoints | Decide the start and end point of any edges on the graph | (edge: Edge) => { source: Point, target: Point } | Each edge would start and end on the node placeholder's bound |
| mapEdgeAttributes | Decide the style of every edge on the graph | () => EdgeAtrributes | `() => { color: "black" }`|

#### Example of mapEdgeToPoints in JavaScript
```js
const mapEdgeToPoints = (edge) => {
  let sp = {
    x: edge.source.x + edge.source.width,
    y: edge.source.y + edge.source.height / 2,
  };
  let tp = { x: edge.target.x, y: edge.target.y + edge.target.height / 2 };
  if (edge.type === "start-of-group") {
    sp = { x: edge.source.x, y: edge.source.y + edge.source.height / 2 };
  } else if (edge.type === "end-of-group") {
    tp = { x: edge.target.x + edge.target.width, y: edge.target.y + edge.target.height / 2 };
  }
  return {
    source: sp,
    target: tp,
    labelCenterOffset: { x: -7, y: -10 },
  };
};
```

After `init`, you have the nodes and edges in the directed graph with position calculated. The graph is now ready for CRUD operations and rendering with the help of various APIs provided in the core.

## API

Through the `use` function, you can access many APIs to perform CRUD operations on the graph DOM as well as getting more details.

#### ```render: ({ nodes: Node[] }) => void```

Render a graph that represents the node array structure

#### ```clear: () => void```

Delete the current graph

#### ```remove: ({ node: Node }) => void```

Remove a node from the graph

#### ```removeEdge: ({ sourceId: string, targetId: string }) => void```

Remove an edge with the correspondig source and target IDs

#### ```move: ({ nodeId: string, point: Point }) => void```

Move node with a given ID to a new position.

#### ```reload: ({ nodes: Node[] }) => void```

Regenerate a graph for the given node structure

#### ```getElementByNodeId: (node: Node) => HTMLElement```

Return an HTML div Element that currently placeholds for the node

#### ```getEdgeLabel: (sourceId: string, targetId: string) => HTMLElement```

Return an HTML div Element that currently placeholds for the label of an edge with given source and target IDs

#### ```closestParentElement: (element: HTMLElement) => HTMLElement```

Retrieve the outermost parent node's HTML element of a child element

#### ```getNodeId: (elememt: HTMLElement) => string```

Get the node ID of an HTML element

#### ```tryConnect: ({ point: Point, sourceNodeId: string }) => boolean```

Add an edge for between a source node and a node near a point on the graph when possible

## Appendix: Data Structure

### Bounds

| Property | Type |
|:---------|:-------------|
| x | number |
| y |  number |
| width | number |
| height |  number |

### dagre.GraphLabel

See 'Configuring the Layout' section of [Dagre's documentation](https://github.com/dagrejs/dagre/wiki).

### Edge

| Property | Type |
|:---------|:-------------|
| source | ViewNode |
| target |  ViewNode |
| type | `'start-of-group'`, `'end-of-group'`, `'regular'` | 
| labelCenterOffset | Point | 

### EdgeAttributes

| Property | Type |
|:---------|:-------------|
| color? | string |
| hideArrow? |  boolean |

### GraphParams

| Property | Description | Type |
|:---------|:-------------|:-------------|
| rankdir | The direction for displaying nodes (available options are `'LR'`, `'RL'`, `'TB'`, `'BT'`) | string |
| ranksep | Number of pixels that separate nodes horizontally in the layout. | number |
| edgesep | Number of pixels that separate edges horizontally in the layout.| number |

### Node

| Property | Description | Type |
|:---------|:-----------|:-------------|
| id  | A unique ID for identifying the node | string|
| data | Key-value pairs for users to store extra information | {[key: string]: any} |
| dependencies | An array of IDs of nodes which connect to the node | string[] |
| children | Children nodes that are nested in the node | Node[] |

### Padding

| Property | Type |
|:---------|:-------------|
| top | number |
| bottom |  number |
| left | number |
| right |  number |

### Point

| Property | Description | Type |
|:---------|:-------------|:-------------|
| x | Horizontal distance in pixels from the top left point of a parent element | number |
| y | Vertical distance in pixels from the top left point of a parent element | number |

### Size

| Property | Type |
|:---------|:-------------|
| width | number |
| height |  number |

### ViewNode extends Node

| Property | Type |
|:---------|:-------------|
| x | number |
| y |  number |
| width | number |
| height |  number |