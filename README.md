![nice-dag-logo](./static/img/logo.svg)
# Nice-DAG

[![Demo](https://img.shields.io/badge/demo-link-orange.svg)](https://opensource.ebay.com/nice-dag/examples/index.html)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/eBay/nice-dag/blob/main/LICENSE.md)

## Overview

Nice-DAG is a lightweight javascript library, which is used to present a DAG diagram. Essentially, it uses dagre to layout nodes and edges on a DAG diagram. However, the functions that Nice-DAG gives are far beyond that of dagre. 

Compared with **dagre**, **dagre** provides the position coordinates of DAG nodes, while Nice-DAG provides a DOM container of DAG diagram as well as DOM elements as the host of DAG nodes and edges. Based on the visual container, Nice-DAG also provides some generic visual features like **zoom in/out**, **mini-map** widget, etc. In addition, Nice-DAG facilities editing features, which allows the user to **drag and drop** nodes, to **connect** one node to the other, and to **create/remove** nodes or edges. When developers use Nice-DAG, they can focus on the rendering of node and edge according to their own requirements rather than the implementation of the general functions as above mentioned. Moreover, developers have complete control over the container's placement and look and feel.

In terms of usage, Nice-DAG provides two kinds of view, **read-only view** and **editable view**. For **read-only** view, it provies a set of api which allows the user to customize nodes and edges renderer. **Editable view** extends the capabilities of read-only and it provides a set of dragging&dropping api which can be applied to the nodes or edges renderers.

![nice-dag-modules](./static/img/nice-dag-modules.png)

Ideally, the Nice-DAG is framework agnostic. The DOM operations are covered by `nice-dag-core`. It doesn't rely on any 3rd party frameworks. Based on it, the Nice-DAG can be adapted for different modern frameworks like React, Vue, Angular. 

![nice-dag-adaptors](./static/img/nice-dag-adaptors.png)

Currently, Nice-DAG provides a React adaptor in the manner of a React hook.

For more details information, you can visit the [Doc Portal](https://opensource.ebay.com/nice-dag/) and the [Demo Portal](https://opensource.ebay.com/nice-dag/examples/index.html).

## Installation

If your project is using yarn, you can run the command.

```
yarn add @ebay/nice-dag-core
yarn add @ebay/nice-dag-react
```

If your projet is using npm, you can run the command. 
```
npm install @ebay/nice-dag-core
npm install @ebay/nice-dag-react
```
# Key Features
* Auto-Layout. You don't need to give fix position for each node and edge.
* Sub DAG support. A hierarchical node set (without position) can be mapped to a view with Sub-DAGs.
* Easy customization. You can control rendering completely by the interfaces **nice-dag** exposes.
* Framework agnostic. You can easily apply it to any UI library.
* Support scaling. The DAG diagram can be zoomed in/out.
* Support Mini-Map. For large diagram, you can navigate the position via the mini-map.
* Powerful Dragging & Dropping. Both nodes and edges can support DnD. Moreover, the page can auto-scroll and the size can be auto scaled.
* Rich API. You can easily use the API to control the node and edge.

# Motivation
Nowdays, there are many pipeline engines which focus on back-end pipeline orchestraction. However, most of the engines are lack of pipeline edtior. Users have to manually maintain a complicated pipeline specific. It's difficult for them either writing or validation.

To give a visualized DAG editor can significantly make pipeline maintain much efficient.

# More Documents

[Tutorial](https://opensource.ebay.com/nice-dag/docs/intro)

[API Reference](https://opensource.ebay.com/nice-dag/docs/api-ref/)

# License
[MIT](LICENSE.md)
