(function(){const g=document.createElement("link").relList;if(g&&g.supports&&g.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))C(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const p of l.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&C(p)}).observe(document,{childList:!0,subtree:!0});function _(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function C(a){if(a.ep)return;a.ep=!0;const l=_(a);fetch(a.href,l)}})();const Q="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20height='24'%20width='21'%20viewBox='0%200%20448%20512'%3e%3c!--!Font%20Awesome%20Free%206.5.1%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202024%20Fonticons,%20Inc.%20--%3e%3cpath%20fill='%23ffffff'%20d='M0%2096C0%2078.3%2014.3%2064%2032%2064H416c17.7%200%2032%2014.3%2032%2032s-14.3%2032-32%2032H32C14.3%20128%200%20113.7%200%2096zM0%20256c0-17.7%2014.3-32%2032-32H416c17.7%200%2032%2014.3%2032%2032s-14.3%2032-32%2032H32c-17.7%200-32-14.3-32-32zM448%20416c0%2017.7-14.3%2032-32%2032H32c-17.7%200-32-14.3-32-32s14.3-32%2032-32H416c17.7%200%2032%2014.3%2032%2032z'%20/%3e%3c/svg%3e",Z="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20height='16'%20width='10'%20viewBox='0%200%20320%20512'%3e%3c!--!Font%20Awesome%20Free%206.5.1%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202024%20Fonticons,%20Inc.%20--%3e%3cpath%20fill='%23ffffff'%20d='M41.4%20233.4c-12.5%2012.5-12.5%2032.8%200%2045.3l160%20160c12.5%2012.5%2032.8%2012.5%2045.3%200s12.5-32.8%200-45.3L109.3%20256%20246.6%20118.6c12.5-12.5%2012.5-32.8%200-45.3s-32.8-12.5-45.3%200l-160%20160z'%20/%3e%3c/svg%3e",ee=()=>{const d="td-root",g="td-root-list",_="td-toggle-btn-box",C="td-toggle-btn",a="td-header-box",l="td-default-header",p="td-menu-item-box",k="td-menu-item-content",A="td-menu-item-content-inner",D="td-menu-item-sub-list",F="td-menu-item-text",R="td-arrow-icon",U="td-level-",v="td-sticky",h="td-selected",x="td-open",M="td-close",o={open:!1,multiSelection:!1,toggleBtn:{sticky:!0,enabled:!0},showHeader:!0,onModeChanged:()=>{},renderToggleBtn:e=>{const t=document.createElement("img");return t.classList.add(C),t.src=Q,e.appendChild(t),t},renderHeader:(e,t)=>{const n=document.createElement("div");n.classList.add(l);const s=document.createElement("div");return t?s.innerText="T-Drawer Open":s.innerText="TD",n.appendChild(s),e.appendChild(n),n},renderMenuItemContentText:(e,t,n,s)=>{const i=document.createElement("div");i.classList.add(F),i.style.paddingLeft=`${n*20}px`;const r=document.createElement("i");if(t.icon&&(r.className=t.icon,r.style.marginRight="4px"),!s&&n===0&&(r.style.fontSize="20px",r.style.paddingLeft="20px"),s&&n===0&&(r.style.paddingLeft="10px"),i.appendChild(r),s||n!==0){const f=document.createElement("span");f.innerText=t.name,i.appendChild(f)}return e.appendChild(i),i},onMenuItemClick:e=>{console.log(e)}},y={menuItems:[]};let c,m,L,u,b=null;function j(e){c=document.createElement("div"),c.classList.add(d),m=document.createElement("div"),m.classList.add(_),c.appendChild(m),L=document.createElement("div"),L.classList.add(a),c.appendChild(L),u=document.createElement("div"),u.classList.add(`${g}`),c.appendChild(u),e.appendChild(c)}function q(e){Object.assign(o,e)}function z(e){Object.assign(y,e)}function X(){m.replaceChildren(),L.replaceChildren(),u.replaceChildren()}function G(){var e;(e=o.toggleBtn)!=null&&e.enabled&&W(),o.showHeader&&J(),V()}function S(e){let t=c.querySelector(`[data-id="${e}"]`);H(t)}function I(e){return e.parentElement.parentElement.classList.contains(p)?e.parentElement.parentElement:null}function O(){T(!o.open)}function T(e){o.open=e,N(),o.onModeChanged&&o.onModeChanged(e)}function N(){o.open?(c.classList.add(x),c.classList.remove(M)):(c.classList.remove(x),c.classList.add(M)),X(),G(),S(b)}function K(e,t,n){if(!e.subList)return;const s=n.offsetHeight,i=t.offsetTop-c.scrollTop,r=c.clientHeight;let f=i;i+s>r&&(f=r-s,f<0&&(f=0)),n.style.top=f+"px",n.style.left=c.clientWidth+"px"}function W(){var t;(t=o.toggleBtn)!=null&&t.sticky?m.classList.add(v):m.classList.remove(v),o.renderToggleBtn(m).addEventListener("click",()=>{O()})}function J(){o.renderHeader(L,o.open)}function V(){y.menuItems.map(e=>{const t=B(e,0);u.appendChild(t)}),c.appendChild(u)}function B(e,t){const n=document.createElement("div"),s=U+t;if(n.classList.add(p,s),n.setAttribute("data-id",e.id),Y(n,e,t),n.addEventListener("click",i=>{i.stopPropagation(),H(n),o.onMenuItemClick&&o.onMenuItemClick(e)}),e.subList&&e.subList.length>0){const i=document.createElement("div");i.className=`${D}`;for(const r of e.subList)i.appendChild(B(r,t+1));n.appendChild(i),n.addEventListener("mouseenter",r=>{o.open||K(e,n,i)})}return u.appendChild(n),n}function H(e){if(!e)return;if(e.classList.contains(h)){e.classList.remove(h),b=null;return}if(!o.multiSelection){const n=c.querySelectorAll(`.${h}`);for(const s of n)s.classList.remove(h)}let t=I(e);for(;t;)t.classList.add(h),t=I(t);e.classList.add(h),b=e.getAttribute("data-id")}function Y(e,t,n){const s=document.createElement("div");s.classList.add(k);const i=document.createElement("div");if(i.classList.add(A),o.open?i.appendChild(o.renderMenuItemContentText(s,t,n,!0)):i.appendChild(o.renderMenuItemContentText(s,t,n,!1)),s.appendChild(i),t.subList&&t.subList.length>0){const r=document.createElement("img");r.classList.add(R),r.src=Z,s.appendChild(r)}return e.appendChild(s),s}return{create:j,setOptions:q,setData:z,render:N,toggle:O,select:S,open:()=>T(!0),close:()=>T(!1)}},P={menuItems:[{id:"1",icon:"fa fa-search",name:"검색엔진",subList:[{id:"11",name:"구글",url:"https://www.google.com"},{id:"12",name:"네이버",url:"https://naver.com"},{id:"13",name:"빙",url:"https://bing.com"}]},{id:"2",icon:"fa-regular fa-map",name:"중첩메뉴",subList:[{id:"21",name:"PS",subList:[{id:"211",name:"프로그래머스",url:"https://programmers.co.kr/"},{id:"212",name:"백준",url:"https://www.acmicpc.net"},{id:"213",name:"코드업",url:"https://codeup.kr/"}]},{id:"22",name:"도구모음",subList:[{id:"221",name:"다이어그램",url:"https://www.draw.io"},{id:"222",name:"JSON생성",url:"https://www.json-generator.com"},{id:"223",name:"피그마: 디자인,목업",url:"https://www.figma.com"}]}]},{id:"3",icon:"fa-solid fa-blog",name:"Blog",subList:[{id:"31",name:"리눅스 분석",url:"https://netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds-accc10403c55"},{id:"32",name:"프로그래머 필독서",url:"https://www.sangkon.com/good_books_for_dev/"},{id:"33",name:"mes-service",url:"https://www.ge.com/digital/documentation/proficy-plant-applications/version82/common_service_docs/mes-service-impl-1.0.0-documentation.html#_overview"}]},{id:"4",icon:"fa fa-cubes",name:"4번",subList:[{id:"4-1",name:"1"},{id:"4-2",name:"2"},{id:"4-3",name:"3"},{id:"4-4",name:"4"}]},{id:"5",icon:"fa fa-cubes",name:"5번",subList:[{id:"5-1",name:"1"},{id:"5-2",name:"2"},{id:"5-3",name:"3"},{id:"5-4",name:"4"}]},{id:"6",icon:"fa fa-cubes",name:"6번",subList:[{id:"6-1",name:"1"},{id:"6-2",name:"2"},{id:"6-3",name:"3"},{id:"6-4",name:"4"}]},{id:"7",icon:"fa fa-cubes",name:"7번",subList:[{id:"7-1",name:"1"},{id:"7-2",name:"2"},{id:"7-3",name:"3"},{id:"7-4",name:"4"}]},{id:"8",icon:"fa fa-cubes",name:"8번",subList:[{id:"8-1",name:"1"},{id:"8-2",name:"2"},{id:"8-3",name:"3"},{id:"8-4",name:"4"}]},{id:"9",icon:"fa fa-cubes",name:"9번",subList:[{id:"9-1",name:"1"},{id:"9-2",name:"2"},{id:"9-3",name:"3"},{id:"9-4",name:"4"}]},{id:"10",icon:"fa fa-cubes",name:"10번",subList:[{id:"10-1",name:"1"},{id:"10-2",name:"2"},{id:"10-3",name:"3"},{id:"10-4",name:"4"}]},{id:"11",icon:"fa fa-cubes",name:"11번",subList:[{id:"11-1",name:"1"},{id:"11-2",name:"2"},{id:"11-3",name:"3"},{id:"11-4",name:"4"}]}]},te=document.querySelector(".drawer-container"),w=document.querySelector(".content-box"),E=ee();E.create(te);const $={multiSelection:!1,toggleBtn:{sticky:!0,enabled:!0},showHeader:!0,open:!0,onModeChanged:d=>{d?document.documentElement.style.setProperty("--drawer-width","300px"):document.documentElement.style.setProperty("--drawer-width","70px")},onMenuItemClick:d=>{d.subList||(d.id[0]==="1"||d.id[0]==="2"||d.id[0]==="3"?(w.replaceChildren(),w.innerHTML=`
                <h1 class='flex-top'>id: ${d.id}, name: ${d.name}, url: ${d.url}</h1>
                <iframe class='flex-fill' src="${d.url}" width="100%" height="100%" frameborder="0" ></iframe>
              `):(w.replaceChildren(),w.innerHTML=`
                  <h1 class='flex-top'>id: ${d.id}, name: ${d.name}, url: ${d.url}</h1>
                  
              `))}};E.setOptions($);E.setData(P);E.render();E.select("13");$.onMenuItemClick(P.menuItems[0].subList[2]);
