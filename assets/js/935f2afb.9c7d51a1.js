"use strict";(self.webpackChunkecdx=self.webpackChunkecdx||[]).push([[53],{1109:e=>{e.exports=JSON.parse('{"pluginId":"default","version":"current","label":"Next","banner":null,"badge":false,"className":"docs-version-current","isLast":true,"docsSidebars":{"tutorialSidebar":[{"type":"link","label":"Nice-DAG Overview","href":"/eBay/nice-dag/docs/intro","docId":"intro"},{"type":"link","label":"Getting Started","href":"/eBay/nice-dag/docs/getting-started","docId":"getting-started"},{"type":"category","label":"DAG Model","collapsible":true,"collapsed":true,"items":[{"type":"link","label":"Geometry","href":"/eBay/nice-dag/docs/dag-model/geometry","docId":"dag-model/geometry"},{"type":"link","label":"Node","href":"/eBay/nice-dag/docs/dag-model/node","docId":"dag-model/node"},{"type":"link","label":"Edge","href":"/eBay/nice-dag/docs/dag-model/edge","docId":"dag-model/edge"}]},{"type":"category","label":"Tutorial - React","collapsible":true,"collapsed":true,"items":[{"type":"link","label":"Read-Only DAG","href":"/eBay/nice-dag/docs/tutorial-react/read-only-dag","docId":"tutorial-react/read-only-dag"},{"type":"link","label":"Render Edge","href":"/eBay/nice-dag/docs/tutorial-react/render-edge","docId":"tutorial-react/render-edge"},{"type":"link","label":"Drag And Drop (Node)","href":"/eBay/nice-dag/docs/tutorial-react/node-drag-drop","docId":"tutorial-react/node-drag-drop"},{"type":"link","label":"Drag And Drop (Edge)","href":"/eBay/nice-dag/docs/tutorial-react/edge-drag-drop","docId":"tutorial-react/edge-drag-drop"},{"type":"link","label":"Add Node to DAG","href":"/eBay/nice-dag/docs/tutorial-react/node-creation","docId":"tutorial-react/node-creation"},{"type":"link","label":"Remove a Node","href":"/eBay/nice-dag/docs/tutorial-react/node-deletion","docId":"tutorial-react/node-deletion"},{"type":"link","label":"Sub-DAG (Node Group)","href":"/eBay/nice-dag/docs/tutorial-react/subview","docId":"tutorial-react/subview"}]},{"type":"category","label":"API Reference","collapsible":true,"collapsed":true,"items":[{"type":"link","label":"NiceDag","href":"/eBay/nice-dag/docs/api-ref/nice-dag","docId":"api-ref/nice-dag"},{"type":"link","label":"NiceDagConfig","href":"/eBay/nice-dag/docs/api-ref/nice-dag-config","docId":"api-ref/nice-dag-config"},{"type":"link","label":"useNiceDag","href":"/eBay/nice-dag/docs/api-ref/useNiceDag","docId":"api-ref/useNiceDag"},{"type":"link","label":"useNiceDagNode","href":"/eBay/nice-dag/docs/api-ref/useNiceDagNode","docId":"api-ref/useNiceDagNode"},{"type":"link","label":"useNiceDagEdge","href":"/eBay/nice-dag/docs/api-ref/useNiceDagEdge","docId":"api-ref/useNiceDagEdge"}],"href":"/eBay/nice-dag/docs/api-ref/"},{"type":"link","label":"Contribution","href":"/eBay/nice-dag/docs/contribution/","docId":"contribution/contribution"}]},"docs":{"api-ref/api-ref":{"id":"api-ref/api-ref","title":"API Reference","description":"Size","sidebar":"tutorialSidebar"},"api-ref/nice-dag":{"id":"api-ref/nice-dag","title":"NiceDag","description":"NiceDag defines a set of API which can control the DAG diagram.","sidebar":"tutorialSidebar"},"api-ref/nice-dag-config":{"id":"api-ref/nice-dag-config","title":"NiceDagConfig","description":"NiceDagConfig is a configuration object of DAG diagram.","sidebar":"tutorialSidebar"},"api-ref/useNiceDag":{"id":"api-ref/useNiceDag","title":"useNiceDag","description":"It is a customized react hook given by nice-dag-react module, which encapsulates API of nice-dag-core.","sidebar":"tutorialSidebar"},"api-ref/useNiceDagEdge":{"id":"api-ref/useNiceDagEdge","title":"useNiceDagEdge","description":"The method is used to get utilities methods for edge deletion and node inserting.","sidebar":"tutorialSidebar"},"api-ref/useNiceDagNode":{"id":"api-ref/useNiceDagNode","title":"useNiceDagNode","description":"The method is used to get utilities methods for node deletion and listeners of edge dragging and node dragging.","sidebar":"tutorialSidebar"},"contribution/contribution":{"id":"contribution/contribution","title":"Contribution","description":"Setup Dev Environment","sidebar":"tutorialSidebar"},"dag-model/edge":{"id":"dag-model/edge","title":"Edge","description":"Edge represents lines that connect the Node. The edge is not created by the user but initalized by Nice-DAG according to the dependencies defined by given Node set.","sidebar":"tutorialSidebar"},"dag-model/geometry":{"id":"dag-model/geometry","title":"Geometry","description":"Nice-DAG is written based on typescript. It defines a couple of geometry models as following list.","sidebar":"tutorialSidebar"},"dag-model/node":{"id":"dag-model/node","title":"Node","description":"Node is the unit of DAG diagram, which can represent an activity like a batch process, a task, etc.","sidebar":"tutorialSidebar"},"getting-started":{"id":"getting-started","title":"Getting Started","description":"Install","sidebar":"tutorialSidebar"},"intro":{"id":"intro","title":"Nice-DAG Overview","description":"Nice-DAG is a lightweight javascript library, which is used to present a DAG diagram. Essentially, it uses dagre to layout nodes and edges on a DAG diagram. However, the functions that Nice-DAG gives are far beyond that of dagre.","sidebar":"tutorialSidebar"},"tutorial-react/edge-drag-drop":{"id":"tutorial-react/edge-drag-drop","title":"Drag And Drop (Edge)","description":"Besides the node dragging and dropping support, Nice-DAG also support edge dragging and dropping. To simplify the illustration, the example extends Drag And Drop (Node).","sidebar":"tutorialSidebar"},"tutorial-react/node-creation":{"id":"tutorial-react/node-creation","title":"Add Node to DAG","description":"In terms of editable DAG, Nice-DAG supports adding nodes to existing DAG diagram. The example extends Drag And Drop (Edge).","sidebar":"tutorialSidebar"},"tutorial-react/node-deletion":{"id":"tutorial-react/node-deletion","title":"Remove a Node","description":"In terms of editable DAG, Nice-DAG supports node deletion. The example extends Add Node to DAG.","sidebar":"tutorialSidebar"},"tutorial-react/node-drag-drop":{"id":"tutorial-react/node-drag-drop","title":"Drag And Drop (Node)","description":"To enable dnd support, we need to create an editable DAG view. The editable DAG example extends Read-Only DAG.","sidebar":"tutorialSidebar"},"tutorial-react/read-only-dag":{"id":"tutorial-react/read-only-dag","title":"Read-Only DAG","description":"Pre-Steps","sidebar":"tutorialSidebar"},"tutorial-react/render-edge":{"id":"tutorial-react/render-edge","title":"Render Edge","description":"Besides renderNode, Nice-DAG also allows you to define a render for an edge. To simplify the illustration, the Edge render example extends Read-Only DAG.","sidebar":"tutorialSidebar"},"tutorial-react/subview":{"id":"tutorial-react/subview","title":"Sub-DAG (Node Group)","description":"Sub DAG means a node render can be a DAG view which is generated by Nice-DAG as well. Here is to give a sample which can explain how to generate a sub DAG. To simply the illustratation, the example extends Read-Only DAG.","sidebar":"tutorialSidebar"}}}')}}]);