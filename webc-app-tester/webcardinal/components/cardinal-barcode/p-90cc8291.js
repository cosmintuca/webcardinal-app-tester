import{g as e,d as t,n,c as i,e as o}from"./p-bca3f9a1.js";function r(e){return null!==e&&"string"==typeof e&&!!e.startsWith("@")&&e.length>=1}function s(e,n,i){return!!r(n)&&void 0===i[t(e)]&&"view-model"!==e}function a(e,t){switch(e){case"attr":return function(e,n){this.setAttribute(e,t.getChainValue(n))};default:return function(e,n){let i=t.getChainValue(n);this[e]=Array.isArray(this[e])?[...i]:i}}}function l(e,t){this.createBoundedModel=function(i,o){return o=n(o),t.onChange(o,(()=>{e(i,o)})),e(i,o),{updateModel:e=>{t.setChainValue(o,e)}}}}function c(e,t,i){let{properties:o,hasViewModel:r,instanceName:s}=t;e.dispatchEvent(new CustomEvent("getModelEvent",{bubbles:!0,composed:!0,detail:{callback:(t,c)=>{let p;t&&console.error(t);let u={};const f=t=>{if(!u[t]){let n="attr"===o[t].type?e:this,i=new l(a.call(n,o[t].type,c).bind(n),c);u[t]=i.createBoundedModel(t,o[t].value)}},d=()=>{for(let e in o)f(e)};if(r){p=e.getAttribute("view-model"),p=n(p);const t=()=>{let e=c.getChainValue(p);for(let t in e)o[t]||(o[t]={value:p?p+"."+t:t,type:"prop"})};t(),c.onChange(p,(()=>{t(),d()}))}if(d(),void 0!==this[s])throw new Error(`BindModel decorator received a wrong argument as instance name: [${s}]`);this[s]={updateModel:(e,t)=>{o[e]||(o[e]={value:p?p+"."+e:e,type:"prop"},f(e)),u[e].updateModel(t)}},i()}}}))}function p(){return(t,n)=>{let{componentWillLoad:i}=t;t.componentWillLoad=function(){let t=this.__proto__,o=this,a=e(o),l=e=>e?new Promise((t=>{e.then((()=>{t(i&&i.call(o))}))})):i&&i.call(o);if(a.isConnected){let e=Object.keys(t),i=a.getAttributeNames(),p={};for(let t=0;t<e.length;t++){let n=e[t];r(this[n])&&(p[n]={value:this[n],type:"prop"})}for(let e=0;e<i.length;e++){let t=i[e],n=a.getAttribute(t);s(t,n,p)&&(p[t]={value:n,type:"attr"})}let u=a.hasAttribute("view-model");if(Object.keys(p).length>0||u)return l(new Promise((e=>{c.call(o,a,{properties:p,hasViewModel:u,instanceName:n},e)})))}return l()}}}function u(t){return function(n,r){const{connectedCallback:s,render:a,componentWillLoad:l,componentDidLoad:c}=n;n.componentWillLoad=function(){if(!e(this).hasAttribute("data-define-props"))return l&&l.call(this)},n.componentDidLoad=function(){if(!e(this).hasAttribute("data-define-props"))return c&&c.call(this)},n.connectedCallback=function(){let n=this,o=e(n),a=i(String(r));if(o.hasAttribute("data-define-props")){if(!n.componentDefinitions)return n.componentDefinitions={definedProperties:[Object.assign(Object.assign({},t),{propertyName:a})]},s&&s.call(n);let e=n.componentDefinitions;const i=Object.assign(Object.assign({},t),{propertyName:a});if(e&&e.hasOwnProperty("definedProperties")){let t=[...e.definedProperties];t.push(i),e.definedProperties=[...t]}else e.definedProperties=[i];n.componentDefinitions=Object.assign({},e)}return s&&s.call(n)},n.render=function(){let t=this;const n=e(t).tagName.toLowerCase();if(!t.componentDefinitions||!t.componentDefinitions||!t.componentDefinitions.definedProperties)return a&&a.call(t);let i=t.componentDefinitions.definedProperties;i&&(i=i.reverse()),o("psk-send-props",{composed:!0,bubbles:!0,cancelable:!0,detail:{tag:n,props:i}},!0)}}}export{p as B,u as T}