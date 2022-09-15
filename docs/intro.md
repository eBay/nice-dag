---
sidebar_position: 1
---

# Nice-DAG Overview

Nice-DAG is a lightweight javascript library, which is used to present a DAG diagram. Essentially, it uses dagre to layout nodes and edges on a DAG diagram. However, the functions that Nice-DAG gives are far beyond that of dagre. 

Compared with **dagre**, **dagre** provides the position coordinates of DAG nodes, while Nice-DAG provides a DOM container of DAG diagram as well as DOM elements as the host of DAG nodes and edges. Based on the visual container, Nice-DAG also provides some generic visual features like **zoom in/out**, **mini-map** widget, etc. In addition, Nice-DAG facilities editing features, which allows the user to **drag and drop** nodes, to **connect** one node to the other, and to **create/remove** nodes or edges. When developers use Nice-DAG, they can focus on the rendering of node and edge according to their own requirements rather than the implementation of the general functions as above mentioned. Moreover, developers have complete control over the container's placement and look and feel.

In terms of usage, Nice-DAG provides two kinds of view, **read-only view** and **editable view**. For **read-only** view, it provies a set of api which allows the user to customize nodes and edges renderer. **Editable view** extends the capabilities of read-only and it provides a set of dragging&dropping api which can be applied to the nodes or edges renderers.

![nice-dag-modules](../static/img/tutorial/nice-dag-modules.png)

Ideally, the Nice-DAG is framework agnostic. The DOM operations are covered by `nice-dag-core`. It doesn't rely on any 3rd party frameworks. Based on it, the Nice-DAG can be adapted for different modern frameworks like React, Vue, Angular. 

![nice-dag-adaptors](../static/img/tutorial/nice-dag-adaptors.png)

Currently, Nice-DAG provides a React adaptor in the manner of a React hook.
