"use strict";(self.webpackChunkecdx=self.webpackChunkecdx||[]).push([[508],{3369:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>s,frontMatter:()=>i,metadata:()=>p,toc:()=>m});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),d=["components"],i={sidebar_position:3},l="Edge",p={unversionedId:"dag-model/edge",id:"dag-model/edge",title:"Edge",description:"Edge represents lines that connect the Node. The edge is not created by the user but initalized by Nice-DAG according to the dependencies defined by given Node set.",source:"@site/docs/dag-model/edge.md",sourceDirName:"dag-model",slug:"/dag-model/edge",permalink:"/nice-dag/docs/dag-model/edge",editUrl:"https://github.com/eBay/nice-dag/tree/nice-dag-docusaurus/docs/dag-model/edge.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Node",permalink:"/nice-dag/docs/dag-model/node"},next:{title:"Read-Only DAG",permalink:"/nice-dag/docs/tutorial-react/read-only-dag"}},c={},m=[{value:"Properties",id:"properties",level:2},{value:"API(IEdge)",id:"apiiedge",level:2}],g={toc:m};function s(e){var t=e.components,n=(0,a.Z)(e,d);return(0,o.kt)("wrapper",(0,r.Z)({},g,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"edge"},"Edge"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Edge")," represents lines that connect the ",(0,o.kt)("a",{parentName:"p",href:"/nice-dag/docs/dag-model/node"},"Node"),". The edge is not created by the user but initalized by Nice-DAG according to the dependencies defined by given ",(0,o.kt)("a",{parentName:"p",href:"/nice-dag/docs/dag-model/node"},"Node")," set."),(0,o.kt)("h2",{id:"properties"},"Properties"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"Property"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Optional"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Description"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},"source"),(0,o.kt)("td",{parentName:"tr",align:"left"},"No"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Source Node"),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("a",{parentName:"td",href:"/nice-dag/docs/dag-model/node#api-iviewnode"},"IViewNode"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},"target"),(0,o.kt)("td",{parentName:"tr",align:"left"},"No"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Target Node"),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("a",{parentName:"td",href:"/nice-dag/docs/dag-model/node#api-iviewnode"},"IViewNode"))))),(0,o.kt)("h2",{id:"apiiedge"},"API(IEdge)"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Name"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"remove"),(0,o.kt)("td",{parentName:"tr",align:null},"Remove the edge"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"()=>void"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"insertNodes"),(0,o.kt)("td",{parentName:"tr",align:null},"Insert nodes between ",(0,o.kt)("inlineCode",{parentName:"td"},"source")," and ",(0,o.kt)("inlineCode",{parentName:"td"},"target")," of the edge"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"(nodes: Node[], offset?: number) => void;"))))))}s.isMDXComponent=!0},3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>s});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function d(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):d(d({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},g=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),g=p(n),s=a,u=g["".concat(l,".").concat(s)]||g[s]||m[s]||o;return n?r.createElement(u,d(d({ref:t},c),{},{components:n})):r.createElement(u,d({ref:t},c))}));function s(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,d=new Array(o);d[0]=g;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,d[1]=i;for(var p=2;p<o;p++)d[p]=n[p];return r.createElement.apply(null,d)}return r.createElement.apply(null,n)}g.displayName="MDXCreateElement"}}]);