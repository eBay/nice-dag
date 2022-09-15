"use strict";(self.webpackChunkecdx=self.webpackChunkecdx||[]).push([[41],{9226:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>h,frontMatter:()=>d,metadata:()=>c,toc:()=>u});var a=t(7462),r=t(3366),o=(t(7294),t(3905)),i=["components"],d={sidebar_position:10},s="Sub-DAG (Node Group)",c={unversionedId:"tutorial-react/subview",id:"tutorial-react/subview",title:"Sub-DAG (Node Group)",description:"Sub DAG means a node render can be a DAG view which is generated by Nice-DAG as well. Here is to give a sample which can explain how to generate a sub DAG. To simply the illustratation, the example extends Read-Only DAG.",source:"@site/docs/tutorial-react/subview.md",sourceDirName:"tutorial-react",slug:"/tutorial-react/subview",permalink:"/eBay/nice-dag/docs/tutorial-react/subview",editUrl:"https://github.com/eBay/nice-dag/tree/nice-dag-docusaurus/docs/tutorial-react/subview.md",tags:[],version:"current",sidebarPosition:10,frontMatter:{sidebar_position:10},sidebar:"tutorialSidebar",previous:{title:"Remove a Node",permalink:"/eBay/nice-dag/docs/tutorial-react/node-deletion"},next:{title:"API Reference",permalink:"/eBay/nice-dag/docs/api-ref/"}},l={},u=[{value:"Step 1: Adapt Node List",id:"step-1-adapt-node-list",level:2},{value:"Hierarchical Structure",id:"hierarchical-structure",level:3},{value:"Flatten Structure",id:"flatten-structure",level:3},{value:"Step 2: Adapt the node render",id:"step-2-adapt-the-node-render",level:2}],p={toc:u};function h(e){var n=e.components,t=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"sub-dag-node-group"},"Sub-DAG (Node Group)"),(0,o.kt)("p",null,"Sub DAG means a node render can be a DAG view which is generated by Nice-DAG as well. Here is to give a sample which can explain how to generate a sub DAG. To simply the illustratation, the example extends ",(0,o.kt)("a",{parentName:"p",href:"./read-only-dag"},"Read-Only DAG"),"."),(0,o.kt)("h2",{id:"step-1-adapt-node-list"},"Step 1: Adapt Node List"),(0,o.kt)("p",null,"Sub-DAG can be regarded as a group of nodes. Before the render adaption, you need to know how a data structure can be represented a node group. There are two ways to define a node group. ",(0,o.kt)("inlineCode",{parentName:"p"},"modelType")," of ",(0,o.kt)("a",{parentName:"p",href:"/eBay/nice-dag/docs/api-ref/useNiceDag"},"useNiceDag")," is used to indicated which structure should be used."),(0,o.kt)("h3",{id:"hierarchical-structure"},"Hierarchical Structure"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-jsx"},'const NodeData = [\n  {\n    id: "start",\n  },\n  {\n    id: "task",\n    dependencies: ["start"],\n    children: [  //children is an array of nodes which can represent a node group\n      {\n        id: "sub-task-1",\n      },\n      {\n        id: "sub-task-2",\n        dependencies: ["sub-task-1"],\n      },\n    ]\n  },\n  {\n    id: "end",\n    dependencies: ["task"],\n  },\n];\n')),(0,o.kt)("p",null,"In this example, the task is a node which contains a sub DAG view because the node has a children definition with an array. "),(0,o.kt)("p",null,"If you use the hierarchical structure, you don't need any change of ",(0,o.kt)("a",{parentName:"p",href:"/eBay/nice-dag/docs/api-ref/useNiceDag"},"useNiceDag")," parameters because ",(0,o.kt)("inlineCode",{parentName:"p"},"modelType")," is ",(0,o.kt)("inlineCode",{parentName:"p"},"HIERARCHY")," in default. "),(0,o.kt)("h3",{id:"flatten-structure"},"Flatten Structure"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-jsx"},'const NodeData = [\n  {\n    id: "start",\n  },\n  {\n    id: "task",\n    dependencies: ["start"],\n  },\n  {\n    id: "sub-task1",\n    parentId: "task",\n  },\n  {\n    id: "sub-task2",\n    parentId: "task",\n    dependencies: ["sub-task1"],\n  },\n  {\n    id: "end",\n    dependencies: ["task"],\n  },\n];\n')),(0,o.kt)("p",null,"In this example, the task is a node which contains a sub DAG view. The difference between flatten structure and hierarchical structure is that the flatten one uses ",(0,o.kt)("inlineCode",{parentName:"p"},"parentId")," to grouping nodes. In this sample, ",(0,o.kt)("inlineCode",{parentName:"p"},"sub-task1")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"sub-task2")," have the same parentId ",(0,o.kt)("inlineCode",{parentName:"p"},"task")," so that they are in the same group."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Notes:"),"\nWhether to use hierarchical structure or flatten structure, the node ",(0,o.kt)("inlineCode",{parentName:"p"},"id")," MUST be unique. This is due to the ",(0,o.kt)("inlineCode",{parentName:"p"},"renderNode")," function is unaware of the node layers. It is called by a ",(0,o.kt)("a",{parentName:"p",href:"https://reactjs.org/docs/portals.html"},"React.createPortal")," component which is associated to a DOM node by the unique id. "),(0,o.kt)("p",null,"If you use the flatten structure, you don't need any change of ",(0,o.kt)("a",{parentName:"p",href:"/eBay/nice-dag/docs/api-ref/useNiceDag"},"useNiceDag")," parameters because ",(0,o.kt)("inlineCode",{parentName:"p"},"modelType")," is ",(0,o.kt)("inlineCode",{parentName:"p"},"FLATTEN")," in default. "),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-jsx"},"export function MyFirstDag() {\n  //call useNiceDag\n  const { niceDagEl, render } = useNiceDag({\n    initNodes: NodeData,\n    modelType: 'FLATTEN'\n  });\n\n  ...\n}\n")),(0,o.kt)("h2",{id:"step-2-adapt-the-node-render"},"Step 2: Adapt the node render"),(0,o.kt)("p",null,"The size of a node group isn't controlled by ",(0,o.kt)("inlineCode",{parentName:"p"},"getNodeSize")," because it is determined by the content (children) of the node. Usually, you can call ",(0,o.kt)("a",{parentName:"p",href:"/eBay/nice-dag/docs/api-ref/useNiceDag"},"useNiceDag")," with a parameter ",(0,o.kt)("inlineCode",{parentName:"p"},"subViewPadding")," object for a node group "),(0,o.kt)("p",null,"Nice-DAG gives a default sub DAG padding object. "),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-jsx"},"{\n  top: 40,\n  bottom: 20,\n  left: 20,\n  right: 20,\n}\n")),(0,o.kt)("p",null,"For this example, we can leave the default value. Once the node group has the paddings,  you can leverage the padding to add some DOM nodes (e.g. ",(0,o.kt)("inlineCode",{parentName:"p"},"button"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"<a/>"),") to control the group."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-jsx"},'function GroupControl({ node }) {\n  const onClick = useCallback(()=>{\n      node.shrink(); //to shrink the group\n  },[node]);\n  return (\n    <div className="my-first-dag-node-group-content">\n      <div>\n        {node.id}\n        <button onClick={onClick}/>\n      </div>\n    </div>\n  );\n}\n\nfunction NodeControl({ node }) {\n  const onClick = useCallback(()=>{\n      node.expand(); //to expand the group\n  },[node]);\n  return (\n    <div className="my-first-dag-node-group-content">\n      <div>\n        {node.id}\n        {node.children?.length > 0 && <button onClick={onClick}/>}\n      </div>\n    </div>\n  );\n}\n\nfunction SampleNode({ node, niceDag }) {\n  return (\n    <div className="my-first-dag-node">\n      {node.children?.length > 0 && !node.collapse ? (\n        <GroupControl node={node} niceDag={niceDag} />\n      ) : (\n        <NodeControl node={node} niceDag={niceDag} />\n      )}\n    </div>\n  );\n}\n')),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Notes"),"\nWhether to use hierarchical structure of flatten structure, the node passed by ",(0,o.kt)("inlineCode",{parentName:"p"},"renderNode")," function uses ",(0,o.kt)("inlineCode",{parentName:"p"},"children")," to indicate if it is a node group. This is due to Node objects is converted or IViewNode objects once it sets to the ",(0,o.kt)("a",{parentName:"p",href:"/eBay/nice-dag/docs/api-ref/useNiceDag"},"useNiceDag"),"."))}h.isMDXComponent=!0},3905:(e,n,t)=>{t.d(n,{Zo:()=>l,kt:()=>h});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function d(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var s=a.createContext({}),c=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},l=function(e){var n=c(e.components);return a.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},p=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,l=d(e,["components","mdxType","originalType","parentName"]),p=c(t),h=r,m=p["".concat(s,".").concat(h)]||p[h]||u[h]||o;return t?a.createElement(m,i(i({ref:n},l),{},{components:t})):a.createElement(m,i({ref:n},l))}));function h(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,i=new Array(o);i[0]=p;var d={};for(var s in n)hasOwnProperty.call(n,s)&&(d[s]=n[s]);d.originalType=e,d.mdxType="string"==typeof e?e:r,i[1]=d;for(var c=2;c<o;c++)i[c]=t[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}p.displayName="MDXCreateElement"}}]);