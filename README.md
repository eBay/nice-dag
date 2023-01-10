![nice-dag-logo](./static/img/logo.svg)

# Nice-DAG

[![Demo](https://img.shields.io/badge/demo-link-orange.svg)](https://opensource.ebay.com/nice-dag/examples/index.html)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/eBay/nice-dag/blob/main/LICENSE.md)

https://user-images.githubusercontent.com/3853/191567804-6e3dfb37-f1fd-4a70-976a-8aa543feff4e.mov

## Overview

Nice-DAG is a lightweight javascript library, which is used to present a DAG diagram. Essentially, it uses dagre to layout nodes and edges on a DAG diagram. However, the functions that Nice-DAG gives are far beyond that of dagre.

Compared with **dagre**, **dagre** provides the position coordinates of DAG nodes, while Nice-DAG provides a DOM container of DAG diagram as well as DOM elements as the host of DAG nodes and edges. Based on the visual container, Nice-DAG also provides some generic visual features like **zoom in/out**, **mini-map** widget, etc. In addition, Nice-DAG facilitates editing features, which allows the user to **drag and drop** nodes, to **connect** one node to the other, and to **create/remove** nodes or edges. Using Nice-DAG, developers can focus on the rendering of nodes and edges, according to their own requirements, rather than on the implementation of general functions, as above mentioned. Moreover, developers have complete control over the container's placement, as well as the look and feel.

In terms of usage, Nice-DAG provides two views: **read-only view** and **editable view**. The **read-only** view provides a set of APIs which allows the user to customize node and edge renderers. **Editable view** extends the capabilities of read-only view, providing a set of drag & drop APIs which can be applied to the node or edge renderers.

![nice-dag-modules](./static/img/nice-dag-modules.png)

Ideally, the Nice-DAG is framework agnostic. The DOM operations are covered by `nice-dag-core`. It doesn't rely on any 3rd party frameworks. Based on it, the Nice-DAG can be adapted for different modern frameworks like React, Vue, Angular.

![nice-dag-adaptors](./static/img/nice-dag-adaptors.png)

Currently, Nice-DAG provides a React adaptor and a Vue(3.0) adaptor.

For more details information, you can visit the [Doc Portal](https://opensource.ebay.com/nice-dag/), the [React Demo Portal](https://opensource.ebay.com/nice-dag/examples/react/index.html) and the [Vue Demo Portal](https://opensource.ebay.com/nice-dag/examples/vue/index.html).

## Installation (React App)

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

## Installation (Vue3 App)

If your project is using yarn, you can run the command.

```
yarn add @ebay/nice-dag-core
yarn add @ebay/nice-dag-vue3
```

If your projet is using npm, you can run the command.

```
npm install @ebay/nice-dag-vue3
npm install @ebay/nice-dag-vue3
```

# Key Features

- Auto-Layout. No need to give fixed positions for each node and edge.
- Sub DAG support. A hierarchical node set (without position) can be mapped to a view with Sub-DAGs.
- Easy customization. Rendering can be controlled completely with the interfaces **nice-dag** exposes.
- Framework agnostic. Easily integrated with any UI library.
- Support scaling. The DAG diagram can be zoomed in/out.
- Support Mini-Map. For large diagrams, navigation can be done via a mini-map.
- Powerful Dragging & Dropping. Both nodes and edges can support DnD. Moreover, the page can auto-scroll and the size can be auto-scaled.
- Rich APIs. Comprehensive APIs to control nodes and edges.

# Motivation

Nowdays, there are many pipeline engines focusing on back-end pipeline orchestractions. Unfortunately those engines are, very often, lacking good pipeline edition capabilities, with poor or no UI at all. Users have to manually maintain complicated pipeline specific configurations, making it difficult either to write or validate pipelines.

Having a visualized DAG editor significantly increases pipeline efficiency and maintainability.

# More Documents

[Tutorial](https://opensource.ebay.com/nice-dag/docs/intro)

[API Reference](https://opensource.ebay.com/nice-dag/docs/api-ref/)

# License

[MIT](LICENSE.md)
