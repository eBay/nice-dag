# nice-dag-core
[![NPM](https://img.shields.io/npm/v/@ebay/nice-dag-core.svg)](https://www.npmjs.com/package/@ebay/nice-dag-core)
[![Downloads](https://img.shields.io/npm/dm/@ebay/nice-dag-core.svg)](https://www.npmjs.com/package/@ebay/nice-dag-core)
[![Demo](https://img.shields.io/badge/demo-link-orange.svg)](https://opensource.ebay.com/nice-dag/examples/index.html)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/eBay/nice-dag/blob/main/LICENSE.md)

## What is nice-dag-core?

`nice-dag-core` creates and maintains an easy-to-use DOM structure for visualising **DAG Diagram**. The positions of nodes and lines are calculated based on [Dagre](https://github.com/dagrejs/dagre), while the rendering logic is controlled by developers in the manner of **JS APIs**.

Besides DAG diagram layout, it also provides build-in functions for **Flow Editor** interactions like **dragging**, **dropping**, creating or removing nodes and edges. Developers can use these functions according to their customized use cases. 

Ideally, `nice-dag-core` is framework agnostic. For the current version, `nice-dag-core` can be used with [nice-dag-react](https://www.npmjs.com/package/@ebay/nice-dag-react) or with [nice-dag-vue3](https://www.npmjs.com/package/@ebay/nice-dag-vue3). 

## Installation

If your project is using yarn, you can run the command.

```
yarn add @ebay/nice-dag-core
```

If your projet is using npm, you can run the command.

```
npm install @ebay/nice-dag-core
```

Besides, you can add `/node_modules/@ebay/nice-dag-core/lib/index.umd.cjs` to html <script> directly if you are not working on `react` or `vue3` framework.

For more details, please you can visit [Doc Portal](https://opensource.ebay.com/nice-dag/docs/intro).
