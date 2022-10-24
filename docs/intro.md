---
sidebar_position: 1
---

# Nice-DAG Overview

Nice-DAG is a lightweight javascript library, which is used to present a DAG diagram. Essentially, it uses dagre to layout nodes and edges on a DAG diagram. However, the functions that Nice-DAG gives are far beyond that of dagre.

Compared with **dagre**, **dagre** provides the position coordinates of DAG nodes, while Nice-DAG provides a DOM container of DAG diagram as well as DOM elements as the host of DAG nodes and edges. Based on the visual container, Nice-DAG also provides some generic visual features like **zoom in/out**, **mini-map** widget, etc. In addition, Nice-DAG facilitates editing features, which allows the user to **drag and drop** nodes, to **connect** one node to the other, and to **create/remove** nodes or edges. Using Nice-DAG, developers can focus on the rendering of nodes and edges, according to their own requirements, rather than on the implementation of general functions, as above mentioned. Moreover, developers have complete control over the container's placement, as well as the look and feel.

In terms of usage, Nice-DAG provides two views: **read-only view** and **editable view**. The **read-only** view provides a set of APIs which allows the user to customize node and edge renderers. **Editable view** extends the capabilities of read-only view, providing a set of drag & drop APIs which can be applied to the node or edge renderers.

![nice-dag-modules](../static/img/tutorial/nice-dag-modules.png)

Ideally, the Nice-DAG is framework agnostic. The DOM operations are covered by `nice-dag-core`. It doesn't rely on any 3rd party frameworks. Based on it, the Nice-DAG can be adapted for different modern frameworks like React, Vue, Angular. 

![nice-dag-adaptors](../static/img/tutorial/nice-dag-adaptors.png)

Currently, Nice-DAG provides a **React** adaptor and a **Vue3** adaptor.
