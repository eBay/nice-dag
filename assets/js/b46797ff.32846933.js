"use strict";(self.webpackChunkecdx=self.webpackChunkecdx||[]).push([[413],{8832:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>h,frontMatter:()=>s,metadata:()=>u,toc:()=>p});var a=t(7462),r=t(3366),i=(t(7294),t(3905)),o=["components"],s={sidebar_position:10},d="Sub-DAG (Node Group)",u={unversionedId:"tutorial-vue3/subview",id:"tutorial-vue3/subview",title:"Sub-DAG (Node Group)",description:"Sub DAG means a node render can be a DAG view which is generated by Nice-DAG as well. Here is to give a sample which can explain how to generate a sub DAG. To simply the illustratation, the example extends Read-Only DAG.",source:"@site/docs/tutorial-vue3/subview.md",sourceDirName:"tutorial-vue3",slug:"/tutorial-vue3/subview",permalink:"/nice-dag/docs/tutorial-vue3/subview",editUrl:"https://github.com/eBay/nice-dag/tree/nice-dag-docusaurus/docs/tutorial-vue3/subview.md",tags:[],version:"current",sidebarPosition:10,frontMatter:{sidebar_position:10},sidebar:"tutorialSidebar",previous:{title:"Remove a Node",permalink:"/nice-dag/docs/tutorial-vue3/node-deletion"},next:{title:"API Reference",permalink:"/nice-dag/docs/api-ref/"}},c={},p=[{value:"Step 1: Adapt Node List",id:"step-1-adapt-node-list",level:2},{value:"Hierarchical Structure",id:"hierarchical-structure",level:3},{value:"Flatten Structure",id:"flatten-structure",level:3},{value:"Step 2: Adapt the node render",id:"step-2-adapt-the-node-render",level:2}],l={toc:p};function h(e){var n=e.components,t=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,a.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"sub-dag-node-group"},"Sub-DAG (Node Group)"),(0,i.kt)("p",null,"Sub DAG means a node render can be a DAG view which is generated by Nice-DAG as well. Here is to give a sample which can explain how to generate a sub DAG. To simply the illustratation, the example extends ",(0,i.kt)("a",{parentName:"p",href:"./read-only-dag"},"Read-Only DAG"),"."),(0,i.kt)("h2",{id:"step-1-adapt-node-list"},"Step 1: Adapt Node List"),(0,i.kt)("p",null,"Sub-DAG can be regarded as a group of nodes. Before the render adaption, you need to know how a data structure can be represented a node group. There are two ways to define a node group. ",(0,i.kt)("inlineCode",{parentName:"p"},"modelType")," of ",(0,i.kt)("a",{parentName:"p",href:"/nice-dag/docs/api-ref/useNiceDag"},"useNiceDag")," is used to indicated which structure should be used."),(0,i.kt)("h3",{id:"hierarchical-structure"},"Hierarchical Structure"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-jsx"},'const NodeData = [\n  {\n    id: "start",\n  },\n  {\n    id: "task",\n    dependencies: ["start"],\n    children: [\n      //children is an array of nodes which can represent a node group\n      {\n        id: "sub-task-1",\n      },\n      {\n        id: "sub-task-2",\n        dependencies: ["sub-task-1"],\n      },\n    ],\n  },\n  {\n    id: "end",\n    dependencies: ["task"],\n  },\n];\n')),(0,i.kt)("p",null,"In this example, the task is a node which contains a sub DAG view because the node has a children definition with an array."),(0,i.kt)("p",null,"If you use the hierarchical structure, you don't need any change of ",(0,i.kt)("a",{parentName:"p",href:"/nice-dag/docs/api-ref/useNiceDag"},"useNiceDag")," parameters because ",(0,i.kt)("inlineCode",{parentName:"p"},"modelType")," is ",(0,i.kt)("inlineCode",{parentName:"p"},"HIERARCHY")," in default."),(0,i.kt)("h3",{id:"flatten-structure"},"Flatten Structure"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-jsx"},'const NodeData = [\n  {\n    id: "start",\n  },\n  {\n    id: "task",\n    dependencies: ["start"],\n  },\n  {\n    id: "sub-task1",\n    parentId: "task",\n  },\n  {\n    id: "sub-task2",\n    parentId: "task",\n    dependencies: ["sub-task1"],\n  },\n  {\n    id: "end",\n    dependencies: ["task"],\n  },\n];\n')),(0,i.kt)("p",null,"In this example, the task is a node which contains a sub DAG view. The difference between flatten structure and hierarchical structure is that the flatten one uses ",(0,i.kt)("inlineCode",{parentName:"p"},"parentId")," to grouping nodes. In this sample, ",(0,i.kt)("inlineCode",{parentName:"p"},"sub-task1")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"sub-task2")," have the same parentId ",(0,i.kt)("inlineCode",{parentName:"p"},"task")," so that they are in the same group."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Notes:"),"\nWhether to use hierarchical structure or flatten structure, the node ",(0,i.kt)("inlineCode",{parentName:"p"},"id")," MUST be unique. This is due to the ",(0,i.kt)("inlineCode",{parentName:"p"},"NiceDagNodes")," is unaware of the node layers. It is called by a ",(0,i.kt)("a",{parentName:"p",href:"https://vuejs.org/guide/built-ins/teleport.html"},"Teleport")," component which is associated to a DOM node by the unique id."),(0,i.kt)("p",null,"If you use the flatten structure, you don't need any change of ",(0,i.kt)("a",{parentName:"p",href:"/nice-dag/docs/api-ref/useNiceDag"},"useNiceDag")," parameters but set ",(0,i.kt)("inlineCode",{parentName:"p"},"modelType")," to ",(0,i.kt)("inlineCode",{parentName:"p"},"FLATTEN"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-jsx"},"<script>\nexport default() {\n  setup() {\n    //call useNiceDag\n    const { niceDagEl, niceDagReactive } = useNiceDag(\n      {\n        initNodes: NodeData,\n        modelType: 'FLATTEN'\n      },\n      false\n    );\n    return {\n      niceDagEl,\n      niceDagReactive,\n    };\n  },\n\n  ...\n}\n<\/script>\n")),(0,i.kt)("h2",{id:"step-2-adapt-the-node-render"},"Step 2: Adapt the node render"),(0,i.kt)("p",null,"The size of a node group isn't controlled by ",(0,i.kt)("inlineCode",{parentName:"p"},"getNodeSize")," because it is determined by the content (children) of the node. Usually, you can call ",(0,i.kt)("a",{parentName:"p",href:"/nice-dag/docs/api-ref/useNiceDag"},"useNiceDag")," with a parameter ",(0,i.kt)("inlineCode",{parentName:"p"},"subViewPadding")," object for a node group"),(0,i.kt)("p",null,"Nice-DAG gives a default sub DAG padding object."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-jsx"},"{\n  top: 40,\n  bottom: 20,\n  left: 20,\n  right: 20,\n}\n")),(0,i.kt)("p",null,"For this example, we can leave the default value. Once the node group has the paddings, you can leverage the padding to add some DOM nodes (e.g. ",(0,i.kt)("inlineCode",{parentName:"p"},"button"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"<a/>"),") to control the group."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-jsx"},'const GroupControl = {\n  props: ["node", "niceDag"],\n  emits: ["update:node", "update:niceDag"],\n  components: [ShrinkSvg, MyButton],\n  render() {\n    return (\n      <div className="my-first-dag-node-group-content">\n        <div>\n          {this.node.data?.label || this.node.id}\n          <button onClick={() => this.node.shrink()}>-</button>\n        </div>\n      </div>\n    );\n  },\n};\n\nconst NodeControl = {\n  props: ["node", "niceDag"],\n  emits: ["update:node", "update:niceDag"],\n  render() {\n    return (\n      <div className="readonly-sample-node-content">\n        <span>{this.node.data?.label || this.node.id}</span>\n        {this.node.children?.length > 0 && (\n          <button onClick={()=>this.node.expand()}>-<button>\n        )}\n      </div>\n    );\n  },\n};\n\nexport const SampleNode = {\n  props: ["node","niceDagReactive"],\n  emits: ["update:node","update:niceDagReactive"],\n  render() {\n    return (\n      <div className="my-first-dag-node">\n        {this.node.children?.length > 0 && !this.node.collapse ? (\n        <GroupControl node={this.node} niceDag={niceDagReactive.use()} />\n      ) : (\n        <NodeControl node={this.node} niceDag={niceDagReactive.use()} />\n      )}\n      </div>\n    );\n  },\n};\n')),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Notes"),"\nWhether to use hierarchical structure of flatten structure, it should use ",(0,i.kt)("inlineCode",{parentName:"p"},"children")," to indicate if it is a node group. This is due to Node objects is converted or IViewNode objects once it sets to the ",(0,i.kt)("a",{parentName:"p",href:"/nice-dag/docs/api-ref/useNiceDag"},"useNiceDag"),"."))}h.isMDXComponent=!0},3905:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>h});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var d=a.createContext({}),u=function(e){var n=a.useContext(d),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},c=function(e){var n=u(e.components);return a.createElement(d.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},l=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,i=e.originalType,d=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),l=u(t),h=r,g=l["".concat(d,".").concat(h)]||l[h]||p[h]||i;return t?a.createElement(g,o(o({ref:n},c),{},{components:t})):a.createElement(g,o({ref:n},c))}));function h(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=t.length,o=new Array(i);o[0]=l;var s={};for(var d in n)hasOwnProperty.call(n,d)&&(s[d]=n[d]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var u=2;u<i;u++)o[u]=t[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}l.displayName="MDXCreateElement"}}]);