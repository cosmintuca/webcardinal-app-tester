import{V as t,b as e,d as n,f as i,h as a,g as r,r as o,F as s,e as c}from"./p-306a0f7f.js";import"./p-e506992e.js";const l="webcardinal:config:getCoreType",u="webcardinal:config:getDocsSource",d="webcardinal:config:getIdentity",f="webcardinal:config:getLogLevel",h="webcardinal:config:getRouting",g="webcardinal:model:get",v="webcardinal:routing:get",p="webcardinal:tags:get",b="webcardinal:translationModel:get",m="webcardinal:parentChain:get",y=new Map;function w(i){let a=i.hasAttribute(t)?i.getAttribute(t):null;if(!a&&i.hasAttribute(e)&&(console.warn(`Attribute ${e} is deprecated for binding! Use the ${t} key attribute instead.`,i),a=i.getAttribute(e)),!a)return"";if(!a.startsWith(n)){const t=i.tagName.toLowerCase();return console.error([`Invalid chain found for ${t} (chain: "${a}")!`,`A valid chain must start with "${n}".`].join("\n")),""}return a}function $(t,e){return t=t.split("@").join(""),e=e.split("@").join(""),t&&e?`@${t}.${e}`:e?"@"+e:t?"@"+t:"@"}function k(t,e,n){y.set(t,{chain:e,changeHandler:n})}function M(t,e,n){y.set(t,{expression:e,changeHandler:n})}function T(t,e){const n=t=>{if(t.childNodes.length>0)for(const i of t.childNodes){if(y.has(i)){const t=y.get(i);t.chain?e.offChange(t.chain,t.changeHandler):e.offChangeExpressionChain(t.expression,t.changeHandler),y.delete(i)}n(i)}};n(t)}function x(t,e,n){let i=null;for(;t;){if(t.matches(e)){i=t;break}if(n&&t.matches(n))break;t=t.parentElement}return i}function A(t,{key:e,value:n}){if(!i.includes(e))if(["innerHTML","innerText"].includes(e)&&console.warn(`Model property "${e}" can be short handed, try "${e.substr(5).toLowerCase()}" instead!\n`,"target element:",t),["data-tag","data-view-model"].includes(e)&&console.warn(`Model property "${e}" can be shorthanded, try "${e.substr(5)}" instead!\n`,"target model:",t.getAttribute("data-model")),function(t){return["value","innerText","innerHTML"].includes(t)}(e=function(t){switch(t){case"model":return"data-view-model";case"tag":return"data-tag";case"text":return"innerText";case"html":return"innerHTML";default:return t}}(e))){if("INPUT"===t.tagName&&"file"===t.getAttribute("type")&&"value"===e)return;t[e]=n}else if("class"!==e)"boolean"!=typeof n?"string"!=typeof n?"object"!=typeof n||(t[e]=n):t.setAttribute(e,n):n?t.setAttribute(e,""):t.removeAttribute(e);else{if(""===n)return void(t.className="");if("string"==typeof n)return void t.classList.add(n);if("object"==typeof n){for(const[e,i]of Object.entries(n))i?t.classList.add(e):t.classList.remove(e);return}}}function N(t,e){return"input"===t.tagName.toLowerCase()&&"checkbox"===t.getAttribute("type")&&"checked"===e||"value"===e}function j(i,o,s=n,c=null){i.tagName.startsWith(a.toUpperCase())||Array.from(i.attributes).forEach((a=>{const l=a.nodeName;let u=a.nodeValue;if(l===t||l===e)return;if(!u.startsWith(s))return;if(u=u.slice(1),c&&(u=q(c,u)),i.webcModelChains||(i.webcModelChains={}),i.webcModelChains[l]=u,A(i,{key:l,value:o.getChainValue(u)}),r.includes(i.tagName.toLowerCase()))return;s===n&&N(i,l)&&I(i,o,u);const d=()=>{A(i,{key:l,value:o.getChainValue(u)})};if(o.onChange(u,d),k(i,u,d),o.hasExpression(u)){A(i,{key:l,value:o.evaluateExpression(u)}),s===n&&N(i,l)&&I(i,o,u);const t=()=>{A(i,{key:l,value:o.evaluateExpression(u)})};o.onChangeExpressionChain(u,t),M(i,u,t)}}))}function C(t){t.nodeType===Node.ELEMENT_NODE&&(t.removeAttribute("slot"),t.removeAttribute("hidden"))}function I(t,e,n){const i=t.tagName.toLowerCase();["input","textarea"].includes(i)?t.addEventListener("input",(a=>{const r=a.target;"input"!==i||"checkbox"!==t.getAttribute("type")?"input"!==i||"file"!==t.getAttribute("type")?e.setChainValue(n,r.value):e.setChainValue(n,Array.from(r.files)):e.setChainValue(n,r.checked)})):"select"===i&&t.addEventListener("change",(t=>{e.setChainValue(n,t.target.value)}))}function H(t,e,n){if(!e.getChainValue(n))return;const i="input"===t.tagName.toLowerCase()&&"checkbox"===t.getAttribute("type")?"checked":"value";I(t,e,`${n}.${i}`)}function L(t,e){return Array.from(t.attributes).some((t=>t.nodeName===e))}function P(t,e){return t.filter((t=>t.getAttribute("slot")===e))}function R(t,e){return P(t,e).map((t=>t.outerHTML)).join("")}function S(t,e){for(T(t,e);t.children.length>0;)t.children[0].remove()}function U(t,e){for(T(t,e);t.childNodes.length>0;)t.childNodes[0].remove()}function q(...t){return t.filter((t=>null!=t)).filter(String).join(".")}function z(t){let e;if("function"==typeof t.detail?e=t.detail:t.detail&&"function"==typeof t.detail.callback&&(e=t.detail.callback),e)return e;console.warn("Invalid callback for event",t)}function B(t,e){t.hasAttribute(o)||t.setAttribute(o,""+t.children.length),t.addEventListener("webcardinal:parentChain:get",(n=>{n.stopImmediatePropagation();const i=z(n);if(!i)return;if(n.target&&"string"!=typeof n.target.tagName)return i(void 0,e);let a=n.target;"webc-component"===n.target.tagName.toLowerCase()&&(a=a.parentElement);let r=a;for(;r.parentElement&&!r.parentElement.hasAttribute(s);)r=r.parentElement;if(!r)return i(void 0,e);let c=Array.from(t.children).indexOf(r);if(c<0)return i(void 0,e);let l=Number.parseInt(t.getAttribute(o));return(Number.isNaN(l)||l<=0)&&(l=1),c=Math.floor(c/l),i(void 0,q(e,c))}))}class D{constructor(t,{model:e,translationModel:i,tags:a,routing:r,chain:o}){this.listeners={getModel:()=>null,getTranslationModel:()=>null,getTags:()=>null,getRouting:()=>null,getParentChain:()=>null},this.host=t,e&&(this.listeners.getModel=t=>{t.stopImmediatePropagation();const i=z(t);if(i){if(t.detail.chain){let a=t.detail.chain;return a.startsWith(n)?(a=a.slice(1),void i(void 0,e.getChainValue(a))):(console.warn([`Invalid chain found for ${t} (chain: "${a}")!`,`A valid chain must start with "${n}".`].join("\n")),void i(void 0,e))}i(void 0,e)}}),i&&(this.listeners.getTranslationModel=t=>{t.stopImmediatePropagation();const e=z(t);if(e){if(t.detail.chain){let n=t.detail.chain;return n.startsWith(c)?(n=n.slice(1),void e(void 0,i.getChainValue(n))):(console.warn([`Invalid chain found for ${t} (chain: "${n}")!`,`A valid chain must start with "${c}".`].join("\n")),void e(void 0,i))}e(void 0,i)}}),a&&(this.tags=a,this.listeners.getTags=t=>{t.stopImmediatePropagation();const e=z(t);if(e)return t.detail.tag?this.tags[t.detail.tag]?e(void 0,this.tags[t.detail.tag]):e(`There is no page tag "${t.detail.tag}" registered in webcardinal.json`):e(void 0,this.tags)}),r&&(this.routing=r,this.listeners.getRouting=t=>{t.stopImmediatePropagation();const e=z(t);e&&e(void 0,this.routing)}),void 0!==o&&(this.chain=o,this.listeners.getParentChain=t=>{t.stopImmediatePropagation();const e=z(t);e&&e(void 0,this.chain)})}get getModel(){const t="webcardinal:model:get";return{add:()=>this.host.addEventListener(t,this.listeners.getModel),remove:()=>this.host.removeEventListener(t,this.listeners.getModel),eventName:t}}get getTranslationModel(){const t="webcardinal:translationModel:get";return{add:()=>this.host.addEventListener(t,this.listeners.getTranslationModel),remove:()=>this.host.removeEventListener(t,this.listeners.getTranslationModel),eventName:t}}get getParentChain(){const t="webcardinal:parentChain:get";return{add:()=>this.host.addEventListener(t,this.listeners.getParentChain),remove:()=>this.host.removeEventListener(t,this.listeners.getParentChain),eventName:t}}get getTags(){if(!this.tags)return;const t="webcardinal:tags:get";return{add:()=>this.host.addEventListener(t,this.listeners.getTags),remove:()=>this.host.removeEventListener(t,this.listeners.getTags),eventName:t}}get getRouting(){if(!this.routing)return;const t="webcardinal:routing:get";return{add:()=>this.host.addEventListener(t,this.listeners.getRouting),remove:()=>this.host.removeEventListener(t,this.listeners.getRouting),eventName:t}}}export{z as A,B,D as C,l as E,u as a,d as b,f as c,h as d,g as e,v as f,p as g,b as h,m as i,x as j,j as k,I as l,H as m,L as n,P as o,R as p,S as q,C as r,A as s,U as t,q as u,w as v,$ as w,k as x,M as y,T as z}