![nice-dag-logo](./static/img/logo.svg)

# Nice-DAG

[![Demo](https://img.shields.io/badge/demo-link-orange.svg)](https://opensource.ebay.com/nice-dag/examples/index.html)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/eBay/nice-dag/blob/main/LICENSE.md)

https://user-images.githubusercontent.com/3853/191567804-6e3dfb37-f1fd-4a70-976a-8aa543feff4e.mov

## Overview

Nice-DAG is a lightweight JavaScript library designed for presenting Directed Acyclic Graphs (DAGs). It builds on **dagre** to layout nodes and edges within a DAG diagram. However, the functionality provided by Nice-DAG goes far beyond what dagre offers.

While **dagre** supplies position coordinates for DAG nodes, Nice-DAG offers a complete DOM container for DAG diagrams, including DOM elements to host both nodes and edges. Utilizing this visual container, Nice-DAG introduces generic visual features such as **zoom in/out**, a **mini-map** widget, and more. Additionally, Nice-DAG provides robust editing capabilities, allowing users to **drag and drop** nodes, **connect** nodes to each other, and **create/remove** nodes or edges. This enables developers to concentrate on customizing the rendering of nodes and edges according to their requirements, without needing to implement foundational functionalities. Furthermore, Nice-DAG grants developers full control over the container’s placement, as well as its overall look and feel.

When it comes to usage, Nice-DAG offers two distinct views: **read-only view** and **editable view**. The **read-only view** provides a set of APIs that allow users to customize node and edge renderers for static visualizations. The **editable view** expands upon the read-only view's capabilities by incorporating a set of drag-and-drop APIs that can be applied to node and edge renderers, making it suitable for dynamic and interactive graph editing.

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
