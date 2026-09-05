import{j as e}from"./app-CV1-Ju8z.js";import{B as d}from"./button-CXfee992.js";import{D as m,a as l,C as p,b as h,c as r,d as x}from"./dropdown-menu-dWnHVB01.js";import{c as n}from"./utils-jAU0Cazi.js";import{c as o}from"./createLucideIcon-BgOqmyOR.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]],c=o("ArrowDown",g);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]],i=o("ArrowUp",u);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],f=o("EyeOff",j);function D({column:s,title:t,className:a}){return s.getCanSort()?e.jsx("div",{className:n("flex items-center space-x-2",a),children:e.jsxs(m,{children:[e.jsx(l,{asChild:!0,children:e.jsxs(d,{variant:"ghost",size:"sm",className:"data-[state=open]:bg-[#EAE7FF] -ml-3 h-8 rounded-lg px-2 text-[11px] font-extrabold tracking-[0.06em] text-[#686673] uppercase hover:cursor-pointer hover:bg-[#F1EFFD] hover:text-[#5E4BF2]",children:[e.jsx("span",{children:t}),s.getIsSorted()==="desc"?e.jsx(c,{className:"ml-1.5 size-3.5"}):s.getIsSorted()==="asc"?e.jsx(i,{className:"ml-1.5 size-3.5"}):e.jsx(p,{className:"ml-1.5 size-3.5"})]})}),e.jsxs(h,{align:"start",children:[e.jsxs(r,{className:"hover:cursor-pointer",onClick:()=>s.toggleSorting(!1),children:[e.jsx(i,{className:"text-muted-foreground/70 mr-2 h-3.5 w-3.5"}),"Asc"]}),e.jsxs(r,{className:"hover:cursor-pointer",onClick:()=>s.toggleSorting(!0),children:[e.jsx(c,{className:"text-muted-foreground/70 mr-2 h-3.5 w-3.5"}),"Desc"]}),e.jsx(x,{}),e.jsxs(r,{className:"hover:cursor-pointer",onClick:()=>s.toggleVisibility(!1),children:[e.jsx(f,{className:"text-muted-foreground/70 mr-2 h-3.5 w-3.5"}),"Sembunyikan"]})]})]})}):e.jsx("div",{className:n(a),children:t})}export{D};
