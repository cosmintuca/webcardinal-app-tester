import{g as e,d as t,e as n}from"./p-d5cf8399.js";function o(e){return null!==e&&"string"==typeof e&&!!e.startsWith("@")&&e.length>=1}function i(e,n,i){return!!o(n)&&void 0===i[t(e)]&&"view-model"!==e}function r(e,t){switch(e){case"attr":return function(e,n){this.setAttribute(e,t.getChainValue(n))};default:return function(e,n){let o=t.getChainValue(n);this[e]=Array.isArray(this[e])?[...o]:o}}}function l(e,t){this.createBoundedModel=function(o,i){return i=n(i),t.onChange(i,(()=>{e(o,i)})),e(o,i),{updateModel:e=>{t.setChainValue(i,e)}}}}function s(e,t,o){let{properties:i,hasViewModel:s,instanceName:a}=t;e.dispatchEvent(new CustomEvent("getModelEvent",{bubbles:!0,composed:!0,detail:{callback:(t,u)=>{let c;t&&console.error(t);let f={};const d=t=>{if(!f[t]){let n="attr"===i[t].type?e:this,o=new l(r.call(n,i[t].type,u).bind(n),u);f[t]=o.createBoundedModel(t,i[t].value)}},p=()=>{for(let e in i)d(e)};if(s){c=e.getAttribute("view-model"),c=n(c);const t=()=>{let e=u.getChainValue(c);for(let t in e)i[t]||(i[t]={value:c?c+"."+t:t,type:"prop"})};t(),u.onChange(c,(()=>{t(),p()}))}if(p(),void 0!==this[a])throw new Error(`BindModel decorator received a wrong argument as instance name: [${a}]`);this[a]={updateModel:(e,t)=>{i[e]||(i[e]={value:c?c+"."+e:e,type:"prop"},d(e)),f[e].updateModel(t)}},o()}}}))}function a(){return(t,n)=>{let{componentWillLoad:r}=t;t.componentWillLoad=function(){let t=this.__proto__,l=this,a=e(l),u=e=>e?new Promise((t=>{e.then((()=>{t(r&&r.call(l))}))})):r&&r.call(l);if(a.isConnected){let e=Object.keys(t),r=a.getAttributeNames(),c={};for(let t=0;t<e.length;t++){let n=e[t];o(this[n])&&(c[n]={value:this[n],type:"prop"})}for(let e=0;e<r.length;e++){let t=r[e],n=a.getAttribute(t);i(t,n,c)&&(c[t]={value:n,type:"attr"})}let f=a.hasAttribute("view-model");if(Object.keys(c).length>0||f)return u(new Promise((e=>{s.call(l,a,{properties:c,hasViewModel:f,instanceName:n},e)})))}return u()}}}export{a as B}