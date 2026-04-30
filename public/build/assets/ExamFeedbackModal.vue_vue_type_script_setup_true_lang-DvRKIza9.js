import{x as defineComponent,r as ref,z as computed,I as watch,f as createElementBlock,k as createCommentVNode,h as createBaseVNode,F as Fragment,E as renderList,n as normalizeClass,t as toDisplayString,g as openBlock,a4 as watchEffect,o as onMounted,a5 as createApp,X as onUnmounted,H as inject,B as createBlock,J as renderSlot,y as unref,p as createTextVNode,N as nextTick,m as withDirectives,v as vModelText,a6 as vModelRadio,a7 as reactive,Y as toRaw,_ as _export_sfc,G as toRefs,V as h$1,a8 as getCurrentInstance,a9 as isRef,j as createVNode,w as withCtx,i as createStaticVNode,aa as createSlots,ab as normalizeProps,ac as guardReactiveProps,ad as resolveDynamicComponent,ae as BaseStyle,af as script$2,ag as __vitePreload,ah as DomHandler,ai as mergeProps,Q as vModelSelect,c as useRoute,s as axios}from"./main-D7V3tYwM.js";const _hoisted_1$i={key:0,class:"mb-4"},_hoisted_2$g={class:"flex gap-2 mb-2"},_hoisted_3$g=["onClick"],_hoisted_4$g=["innerHTML"],_sfc_main$j=defineComponent({__name:"TabRenderer",props:{tabs:{}},setup(e){const n=e,t=ref(0),o=computed(()=>{if(!n.tabs)return[];try{const r=typeof n.tabs=="string"?JSON.parse(n.tabs||"{}"):n.tabs;return!r||typeof r!="object"?[]:Object.entries(r)}catch{return[]}});return watch(()=>n.tabs,()=>{t.value=0}),(r,a)=>o.value.length?(openBlock(),createElementBlock("div",_hoisted_1$i,[createBaseVNode("div",_hoisted_2$g,[(openBlock(!0),createElementBlock(Fragment,null,renderList(o.value,([l],s)=>(openBlock(),createElementBlock("button",{key:s,class:normalizeClass(["text-sm px-3 py-1 rounded-t border-b-1 font-bold cursor-pointer",{"border-sky-600 border-b-3 dark:text-gray-700 bg-gray-200 rounded-t-md":t.value===s,"text-gray-700 dark:text-gray-100":t.value!==s}]),onClick:i=>t.value=s},toDisplayString(l),11,_hoisted_3$g))),128))]),createBaseVNode("div",{class:"pt-2 prose max-w-none border border-gray-200 p-2 rounded",innerHTML:o.value[t.value][1]},null,8,_hoisted_4$g)])):createCommentVNode("",!0)}}),qn_arrow="/build/assets/qn_arrow-CpnXGZsK.png",_hoisted_1$h=["innerHTML"],_hoisted_2$f={class:"flex items-start gap-2"},_hoisted_3$f=["src"],_hoisted_4$f=["innerHTML"],_hoisted_5$f=["value","checked","onChange","disabled"],_hoisted_6$f=["innerHTML"],_hoisted_7$d=["innerHTML"],_hoisted_8$c=["innerHTML"],_hoisted_9$9={key:0,class:"mt-4 p-4 text-center"},_sfc_main$i=defineComponent({__name:"MMA",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","update:showSolution"],setup(e,{emit:n}){const t=e,{testMode:o,answers:r,results:a}=t.examStore,l=n,s=computed({get:()=>t.modelValue,set:Y=>l("update:modelValue",Y)}),i=Y=>{const yt=[...s.value],T=yt.indexOf(Y);T!==-1?yt.splice(T,1):yt.push(Y),s.value=yt},f=ref(!1),d=ref(!1);watchEffect(()=>{var Y,yt;switch(o){case"review":f.value=!0;break;case"exam":f.value=!1;break;case"tutor":f.value=!1,d.value=!0,t.examStore.answers[t.question.id]&&setTimeout(()=>{f.value=!!t.examStore.answers[t.question.id],E({flag:!0,value:f.value})},(Array.isArray((Y=t.question)==null?void 0:Y.correct_answer)?t.question.correct_answer:JSON.parse(((yt=t.question)==null?void 0:yt.correct_answer)??"[]")).length*1e4);break;default:f.value=!1}});const k=computed(()=>{if(Array.isArray(t.question.correct_answer))return t.question.correct_answer;try{return JSON.parse(t.question.correct_answer||"[]")}catch{return[]}}),N=Y=>k.value.includes(Y),x=Y=>{const yt=r[t.question.id]??[];return o==="review"?(a[t.question.id],yt.includes(Y)&&!k.value.includes(Y)):o==="tutor"?yt.includes(Y)&&!N(Y):!1},E=inject("showSolution"),L=()=>{f.value=!0,E({flag:!0,value:!0}),d.value=!1},j=ref(null);return onMounted(()=>{const Y=document.getElementById("exhibits");Y&&(Y.innerHTML="",j.value=createApp(_sfc_main$j,{tabs:t.question.tabs}),j.value.mount(Y))}),onUnmounted(()=>{E({flag:!0,value:!1}),j.value&&(j.value.unmount(),j.value=null)}),(Y,yt)=>(openBlock(),createElementBlock("div",{class:normalizeClass([Y.question.tabs&&["nclex","cat"].includes(Y.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[Y.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:Y.question.intro},null,8,_hoisted_1$h)):createCommentVNode("",!0),Y.question.tabs&&["nclex","cat"].includes(Y.examStore.storeName)?(openBlock(),createBlock(_sfc_main$j,{key:1,tabs:Y.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$f,[["nclex","cat"].includes(Y.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$f)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:Y.question.question},null,8,_hoisted_4$f)]),(openBlock(!0),createElementBlock(Fragment,null,renderList(Y.question.options,(T,ae)=>(openBlock(),createElementBlock("div",{key:ae,class:"mb-2 ms-4"},[T.choice!=null&&T.choice!=""&&T.choice!="None"?(openBlock(),createElementBlock("label",{key:0,class:normalizeClass(["flex items-start gap-2",{"text-teal-500 font-semibold":N(String(ae))&&f.value,"text-rose-600 font-semibold":x(String(ae))&&f.value}])},[createBaseVNode("i",{class:normalizeClass(`pi mt-1.5 text-lg ${N(String(ae))&&f.value?"pi-check-circle":x(String(ae))&&f.value?"pi-times-circle":""}`)},null,2),createBaseVNode("input",{type:"checkbox",class:"checkbox checkbox-sm mt-1 cursor-pointer border-gray-600 text-gray-700 dark:text-slate-100 dark:border-white",value:String(ae),checked:s.value.includes(String(ae)),onChange:z=>i(String(ae)),disabled:unref(o)==="review"},null,40,_hoisted_5$f),createBaseVNode("div",null,[createBaseVNode("span",{innerHTML:ae,class:"font-semibold"},null,8,_hoisted_6$f),yt[0]||(yt[0]=createTextVNode(". ")),createBaseVNode("span",{innerHTML:T.choice},null,8,_hoisted_7$d),f.value&&T.reason?(openBlock(),createElementBlock("div",{key:0,class:normalizeClass({"bg-teal-100 text-teal-800 p-0.5 rounded":N(String(ae)),"bg-rose-100 text-rose-700 p-0.5 rounded":x(String(ae))}),innerHTML:T.reason},null,10,_hoisted_8$c)):createCommentVNode("",!0)])],2)):createCommentVNode("",!0)]))),128)),d.value?(openBlock(),createElementBlock("div",_hoisted_9$9,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer",onClick:L}," Submit ")])):createCommentVNode("",!0),renderSlot(Y.$slots,"solution")])],2))}}),_hoisted_1$g=["innerHTML"],_hoisted_2$e={class:"flex items-start gap-2"},_hoisted_3$e=["src"],_hoisted_4$e=["innerHTML"],_hoisted_5$e={key:0,class:"mt-3 space-y-2 text-sm"},_hoisted_6$e={key:1,class:"mt-4 p-4 text-center"},_hoisted_7$c=["disabled"],_sfc_main$h=defineComponent({__name:"Dropdown",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,{testMode:o}=t.examStore,r=n,a=inject("showSolution",null),l=ref(!1),s=ref(!1),i=computed({get:()=>t.modelValue||{},set:u=>r("update:modelValue",u)}),f=computed(()=>{const u=t.question.correct_answer;if(!u)return{};if(typeof u=="object")return u;if(typeof u=="string")try{return JSON.parse(u)}catch{return{}}return{}}),d=computed(()=>{const u=t.question.options||{};return Object.keys(u).every(ne=>!!i.value[ne])}),k=computed(()=>Object.keys(t.question.options||{})),N=u=>f.value[u]===i.value[u],x=u=>!!i.value[u]&&f.value[u]!==i.value[u],E=u=>!i.value[u]&&!!f.value[u],L=u=>u.replace(/<[^>]*>/g,"").trim(),j=(u,ne)=>{var y;if(!ne)return"none";const gt=(y=t.question.options)==null?void 0:y[u],w=gt==null?void 0:gt[ne];return w&&L(String(w))||ne},Y=u=>{const ne=i.value[u],gt=f.value[u],w=j(u,ne),y=j(u,gt);return N(u)?`${u}: Correct`:x(u)?`${u}: Incorrect (selected "${w}", correct is "${y}")`:E(u)?`${u}: Not answered (correct is "${y}")`:`${u}: No answer`},yt=u=>N(u)?"pi-check-circle text-teal-600":x(u)?"pi-times-circle text-rose-600":E(u)?"pi-exclamation-triangle text-amber-600":"pi-circle text-gray-400",T=u=>N(u)?"text-teal-700 font-semibold":x(u)?"text-rose-700 font-semibold":E(u)?"text-amber-700 font-semibold":"text-gray-500",ae=ref(null);function z(){const u=ae.value;if(!u)return;const ne=t.question.options||{};Object.entries(ne).forEach(([gt,w])=>{let y=u.querySelector(`#${gt}`);if(!y)return;let U;y.tagName==="SELECT"?(U=y,U.innerHTML=""):(y.innerHTML="",U=document.createElement("select"),y.appendChild(U)),U.name=gt,U.disabled=o==="review",U.className=`inline-block border p-1 rounded mx-1 text-sm align-middle transition-opacity duration-300 ease-in opacity-0 ${ce(gt)}`,U.style.minWidth="6rem",U.style.maxWidth="220px",requestAnimationFrame(()=>{U.style.opacity="1"});const b=new Option("-- Select --","");b.disabled=!0,b.selected=!i.value[gt],U.appendChild(b),Object.entries(w).forEach(([H,F])=>{if(!F)return;const ft=new Option(F,H,!1,i.value[gt]===H);U.appendChild(ft)}),U.addEventListener("change",H=>{const F=H.target;r("update:modelValue",{...i.value,[gt]:F.value})})})}function ce(u){return l.value?N(u)?"border-teal-500 bg-teal-50 text-teal-800":x(u)?"border-rose-500 bg-rose-50 text-rose-800":E(u)?"border-amber-500 bg-amber-50 text-amber-800":"border-gray-300":"border-gray-300"}function v(){d.value&&(l.value=!0,s.value=!1,a&&a({flag:!0,value:!0}))}watchEffect(()=>{switch(t.question.id,o){case"review":l.value=!0,s.value=!1;break;case"exam":l.value=!1,s.value=!1;break;case"tutor":l.value=!1,s.value=!0;break;default:l.value=!1,s.value=!1}}),onMounted(()=>nextTick(z)),watch(()=>[t.question,t.modelValue,o,l.value],()=>nextTick(z),{deep:!0});const m=ref(null);return onMounted(()=>{const u=document.getElementById("exhibits");u&&(u.innerHTML="",m.value=createApp(_sfc_main$j,{tabs:t.question.tabs}),m.value.mount(u))}),onUnmounted(()=>{a&&a({flag:!0,value:!1}),m.value&&(m.value.unmount(),m.value=null)}),(u,ne)=>(openBlock(),createElementBlock("div",{class:normalizeClass([u.question.tabs&&["nclex","cat"].includes(u.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[u.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:u.question.intro},null,8,_hoisted_1$g)):createCommentVNode("",!0),u.question.tabs&&["nclex","cat"].includes(u.examStore.storeName)?(openBlock(),createBlock(_sfc_main$j,{key:1,tabs:u.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$e,[["nclex","cat"].includes(u.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$e)):createCommentVNode("",!0),createBaseVNode("div",{ref_key:"questionContainer",ref:ae,class:"prose max-w-none text-base",innerHTML:u.question.question},null,8,_hoisted_4$e)]),l.value?(openBlock(),createElementBlock("div",_hoisted_5$e,[(openBlock(!0),createElementBlock(Fragment,null,renderList(k.value,gt=>(openBlock(),createElementBlock("div",{key:`fb-${gt}`,class:"flex items-center gap-2"},[createBaseVNode("i",{class:normalizeClass(`pi ${yt(gt)}`)},null,2),createBaseVNode("span",{class:normalizeClass(T(gt))},toDisplayString(Y(gt)),3)]))),128))])):createCommentVNode("",!0),s.value?(openBlock(),createElementBlock("div",_hoisted_6$e,[createBaseVNode("button",{class:normalizeClass(["px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer",d.value?"":"opacity-50 cursor-not-allowed"]),disabled:!d.value,onClick:v}," Submit ",10,_hoisted_7$c)])):createCommentVNode("",!0),renderSlot(u.$slots,"solution")])],2))}}),_hoisted_1$f=["innerHTML"],_hoisted_2$d={class:"flex items-start gap-2"},_hoisted_3$d=["src"],_hoisted_4$d=["innerHTML"],_hoisted_5$d={class:"flex items-center gap-2"},_hoisted_6$d=["disabled"],_hoisted_7$b={key:0},_hoisted_8$b=["innerHTML"],numericTolerance=.01,_sfc_main$g=defineComponent({__name:"FIB",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,{testMode:o,answers:r}=t.examStore,a=n,l=computed({get:()=>t.modelValue,set:E=>a("update:modelValue",E)}),s=computed(()=>{if(Array.isArray(t.question.correct_answer))return t.question.correct_answer;try{return JSON.parse(t.question.correct_answer||"[]")}catch{return[]}}),i=computed(()=>{switch(o){case"review":return!0;case"exam":return!1;case"tutor":return!!t.examStore.answers[t.question.id];default:return!1}}),f=E=>E.trim().toLowerCase(),d=E=>!isNaN(parseFloat(E))&&isFinite(Number(E)),k=computed(()=>{if(!i.value)return!1;const E=l.value.trim();if(!E)return!1;for(const L of s.value){const j=String(L).trim();if(d(j)&&d(E)){const Y=parseFloat(j),yt=parseFloat(E);if(Math.abs(Y-yt)<=numericTolerance)return!0}if(f(j)===f(E))return!0}return!1}),N=computed(()=>i.value&&l.value.trim()!==""&&!k.value),x=ref(null);return onMounted(()=>{const E=document.getElementById("exhibits");E&&(E.innerHTML="",x.value=createApp(_sfc_main$j,{tabs:t.question.tabs}),x.value.mount(E))}),onUnmounted(()=>{x.value&&(x.value.unmount(),x.value=null)}),(E,L)=>(openBlock(),createElementBlock("div",{class:normalizeClass([E.question.tabs&&["nclex","cat"].includes(E.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[E.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:E.question.intro},null,8,_hoisted_1$f)):createCommentVNode("",!0),E.question.tabs&&["nclex","cat"].includes(E.examStore.storeName)?(openBlock(),createBlock(_sfc_main$j,{key:1,tabs:E.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$d,[["nclex","cat"].includes(E.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$d)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:E.question.question},null,8,_hoisted_4$d)]),createBaseVNode("div",null,[createBaseVNode("label",_hoisted_5$d,[L[1]||(L[1]=createBaseVNode("span",null,"Answer:",-1)),withDirectives(createBaseVNode("input",{type:"text","onUpdate:modelValue":L[0]||(L[0]=j=>l.value=j),class:"border-b border-black dark:border-slate-300 dark:bg-sky-950 px-2 py-1 w-32",disabled:unref(o)==="review"},null,8,_hoisted_6$d),[[vModelText,l.value]]),E.question.units?(openBlock(),createElementBlock("span",_hoisted_7$b,toDisplayString(E.question.units),1)):createCommentVNode("",!0),i.value?(openBlock(),createElementBlock("i",{key:1,class:normalizeClass(`ms-2 pi text-lg ${k.value?"pi-check-circle text-teal-500":N.value?"pi-times-circle text-rose-600":""}`)},null,2)):createCommentVNode("",!0)]),i.value&&E.question.solution?(openBlock(),createElementBlock("div",{key:0,class:"mt-2 bg-teal-50 text-teal-800 p-2 rounded",innerHTML:E.question.solution},null,8,_hoisted_8$b)):createCommentVNode("",!0)])],2))}}),_hoisted_1$e=["innerHTML"],_hoisted_2$c={class:"flex items-start gap-2"},_hoisted_3$c=["src"],_hoisted_4$c=["innerHTML"],_hoisted_5$c=["value","name","disabled"],_hoisted_6$c=["innerHTML"],_hoisted_7$a=["innerHTML"],_hoisted_8$a=["innerHTML"],_sfc_main$f=defineComponent({__name:"MSA",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","update:showSolution"],setup(e,{emit:n}){const t=e,{testMode:o,results:r,answers:a}=t.examStore,l=n,s=computed({get:()=>t.modelValue,set:N=>l("update:modelValue",N)}),i=computed(()=>{switch(o){case"review":return!0;case"tutor":return!!t.examStore.answers[t.question.id];default:return!1}}),f=N=>{const x=t.question.correct_answer;return Array.isArray(x)?x.includes(N):x===N},d=N=>{const x=t.examStore.answers[t.question.id];if(o==="review"){const E=r[t.question.id];return(E==null?void 0:E.correct)===!1&&x===N}return o==="tutor"?x===N&&!f(N):!1},k=ref(null);return onMounted(()=>{const N=document.getElementById("exhibits");N&&(N.innerHTML="",k.value=createApp(_sfc_main$j,{tabs:t.question.tabs}),k.value.mount(N))}),onUnmounted(()=>{k.value&&(k.value.unmount(),k.value=null)}),(N,x)=>(openBlock(),createElementBlock("div",{class:normalizeClass([N.question.tabs&&["nclex","cat"].includes(N.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[N.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:N.question.intro},null,8,_hoisted_1$e)):createCommentVNode("",!0),N.question.tabs&&["nclex","cat"].includes(N.examStore.storeName)?(openBlock(),createBlock(_sfc_main$j,{key:1,tabs:N.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$c,[["nclex","cat"].includes(N.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$c)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:N.question.question},null,8,_hoisted_4$c)]),(openBlock(!0),createElementBlock(Fragment,null,renderList(N.question.options,(E,L)=>(openBlock(),createElementBlock("div",{key:L,class:"mb-2 ms-4"},[E.choice!=null&&E.choice!=""&&E.choice!="None"?(openBlock(),createElementBlock("label",{key:0,class:normalizeClass(["flex items-start gap-2",{"text-teal-500 font-semibold":f(String(L))&&i.value,"text-rose-600 font-semibold":d(String(L))&&i.value}])},[createBaseVNode("i",{class:normalizeClass(`pi mt-1.5 text-lg ${f(String(L))&&i.value?"pi-check-circle":d(String(L))&&i.value?"pi-times-circle":""}`)},null,2),withDirectives(createBaseVNode("input",{type:"radio",class:"radio radio-neutral radio-sm mt-1 cursor-pointer border-gray-600 dark:text-slate-100 dark:border-white",value:L,"onUpdate:modelValue":x[0]||(x[0]=j=>s.value=j),name:`question-${N.question.id}`,disabled:unref(o)==="review"},null,8,_hoisted_5$c),[[vModelRadio,s.value]]),createBaseVNode("div",null,[createBaseVNode("span",{innerHTML:L,class:"font-semibold"},null,8,_hoisted_6$c),x[1]||(x[1]=createTextVNode(". ")),createBaseVNode("span",{innerHTML:E.choice},null,8,_hoisted_7$a),i.value&&E.reason?(openBlock(),createElementBlock("div",{key:0,class:normalizeClass({"bg-teal-100 text-teal-800 p-0.5 rounded":f(String(L)),"bg-rose-100 text-rose-700 p-0.5 rounded":d(String(L))}),innerHTML:E.reason},null,10,_hoisted_8$a)):createCommentVNode("",!0)])],2)):createCommentVNode("",!0)]))),128)),renderSlot(N.$slots,"solution")])],2))}}),_hoisted_1$d={class:"rounded-lg border border-gray-200 bg-gray-50 p-4 max-w-md m-auto mt-12 text-center"},_sfc_main$e=defineComponent({__name:"Unknown",props:{question:{},modelValue:{},examStore:{}},setup(e){return(n,t)=>{var o,r;return openBlock(),createElementBlock("div",_hoisted_1$d,[t[0]||(t[0]=createBaseVNode("p",{class:"font-medium text-gray-700 mb-12"}," This question is currently under review for accuracy. ",-1)),t[1]||(t[1]=createBaseVNode("p",{class:"mt-1 text-gray-500"},[createTextVNode(" Please click "),createBaseVNode("span",{class:"font-semibold"},"Next"),createTextVNode(" to continue with rest of the exam. You may return later. ")],-1)),createBaseVNode("p",null,"Code "+toDisplayString((r=(o=n.question)==null?void 0:o.question_type)==null?void 0:r.code),1)])}}}),_hoisted_1$c=["innerHTML"],_hoisted_2$b=["innerHTML"],_hoisted_3$b={class:"grouping-table border border-gray-200 w-full mt-2"},_hoisted_4$b={class:"bg-gray-100"},_hoisted_5$b=["innerHTML"],_hoisted_6$b={class:"p-2"},_hoisted_7$9={class:"font-semibold"},_hoisted_8$9=["innerHTML"],_hoisted_9$8=["name","value","checked","disabled","onChange"],_hoisted_10$6={key:2,class:"text-red-600 mt-2"},_hoisted_11$4={key:3,class:"mt-4 text-center"},_sfc_main$d=defineComponent({__name:"Grouping",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","submitted"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=(b,H)=>{if(b==null)return H;if(typeof b!="string")return b;try{return JSON.parse(b)}catch{return H}},l=computed(()=>a(t.question.correct_answer,{})),s=computed(()=>{var H,F;const b=((H=t.question)==null?void 0:H.match_options)??((F=t.question)==null?void 0:F.match_option)??{};return a(b,{})}),i=computed(()=>{const b={};if(Object.keys(s.value||{}).sort().forEach(ft=>{const _=s.value[ft];if(typeof _=="string"){b[ft]=_;return}b[ft]=(_==null?void 0:_.option)||`Category ${ft}`}),Object.keys(b).length)return b;const F=new Set;return Object.keys(l.value||{}).forEach(ft=>{var it;const _=(it=l.value)==null?void 0:it[ft],$e=Array.isArray(_==null?void 0:_.answers)?_.answers[0]:_==null?void 0:_.answers;$e!=null&&F.add(String($e))}),Array.from(F).sort().forEach(ft=>{b[ft]=`Category ${ft}`}),b}),f=computed(()=>{var H;const b=(H=t.question)==null?void 0:H.options;return!b||typeof b!="object"?{}:b}),d=computed(()=>Object.keys(f.value)),k=reactive({}),N=ref(null),x=computed(()=>{var b;return typeof((b=t.question)==null?void 0:b.question)=="string"&&t.question.question.includes('id="exhibits"')}),E=computed(()=>{var b;return!!((b=t.question)!=null&&b.tabs)&&!x.value}),L=b=>{var H;return typeof b=="string"?b:typeof(b==null?void 0:b.choice)=="string"?b.choice:((H=b==null?void 0:b.choice)==null?void 0:H.choice)||""},j=b=>{var ft;const H=(ft=l.value)==null?void 0:ft[b],F=Array.isArray(H==null?void 0:H.answers)?H.answers[0]:H==null?void 0:H.answers;return F==null?null:String(F)},Y=()=>{const b={};return d.value.forEach(H=>{const F=k[H];F&&(b[H]={answers:String(F)})}),b},yt=b=>{!b||typeof b!="object"||d.value.forEach(H=>{const F=b==null?void 0:b[H];if(F!=null){if(typeof F=="object"&&F!==null&&"answers"in F){const ft=F.answers;if(Array.isArray(ft)){k[H]=ft.length?String(ft[0]):null;return}k[H]=ft==null?null:String(ft);return}k[H]=String(F)}})};watch(()=>{var b,H,F,ft,_;return[(b=t.question)==null?void 0:b.id,(H=t.question)==null?void 0:H.options,(F=t.question)==null?void 0:F.correct_answer,(ft=t.question)==null?void 0:ft.match_option,(_=t.question)==null?void 0:_.match_options]},()=>{Object.keys(k).forEach(b=>delete k[b]),d.value.forEach(b=>{k[b]=null}),yt(t.modelValue)},{immediate:!0,deep:!0}),watch(()=>t.modelValue,b=>{b&&yt(b)},{deep:!0});const ae=()=>{N.value&&(N.value.unmount(),N.value=null)},z=async()=>{var H;if(ae(),!((H=t.question)!=null&&H.tabs)||!x.value)return;await nextTick();const b=document.getElementById("exhibits");b&&(b.innerHTML="",N.value=createApp(_sfc_main$j,{tabs:t.question.tabs}),N.value.mount(b))};watch(()=>{var b,H,F;return[(b=t.question)==null?void 0:b.id,(H=t.question)==null?void 0:H.tabs,(F=t.question)==null?void 0:F.question]},()=>{z()},{immediate:!0});function ce(b,H){v.value="",k[b]=H,o("update:modelValue",Y())}const v=ref(""),m=ref(!1),u=ref(!1);function ne(b,H){return j(b)===H}function gt(b,H){if(!m.value)return"";const F=ne(b,H),ft=k[b]===H;return F&&ft?"accent-teal-500":!F&&ft?"accent-rose-600":F&&!ft?"ring-2 ring-teal-500":""}const w=inject("showSolution");function y(){const b=toRaw(Y());try{if(typeof structuredClone=="function")return structuredClone(b)}catch{}return JSON.parse(JSON.stringify(b))}function U(){if(d.value.filter(H=>!k[H]).length){v.value="Select one category for every row before submitting.";return}v.value="",m.value=!0,u.value=!1,w&&w({flag:!0,value:!0}),o("submitted",{answer:y()})}return watchEffect(()=>{switch(r){case"review":m.value=!0,u.value=!1;break;case"exam":m.value=!1,u.value=!1;break;case"tutor":m.value=!1,u.value=!0;break;default:m.value=!1,u.value=!1}}),onUnmounted(()=>{ae(),w&&w({flag:!0,value:!1})}),(b,H)=>(openBlock(),createElementBlock("div",null,[b.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:b.question.intro},null,8,_hoisted_1$c)):createCommentVNode("",!0),E.value?(openBlock(),createBlock(_sfc_main$j,{key:1,tabs:b.question.tabs},null,8,["tabs"])):createCommentVNode("",!0),createBaseVNode("div",{innerHTML:b.question.question,class:"question-text"},null,8,_hoisted_2$b),createBaseVNode("table",_hoisted_3$b,[createBaseVNode("thead",_hoisted_4$b,[createBaseVNode("tr",null,[createBaseVNode("th",{class:"p-2 text-left",innerHTML:b.question.table_header||"Option"},null,8,_hoisted_5$b),(openBlock(!0),createElementBlock(Fragment,null,renderList(i.value,(F,ft)=>(openBlock(),createElementBlock("th",{key:ft,class:"p-2 text-center"},toDisplayString(F),1))),128))])]),createBaseVNode("tbody",null,[(openBlock(!0),createElementBlock(Fragment,null,renderList(f.value,(F,ft)=>(openBlock(),createElementBlock("tr",{key:ft,class:"hover:bg-gray-50"},[createBaseVNode("td",_hoisted_6$b,[createBaseVNode("span",_hoisted_7$9,toDisplayString(ft)+".",1),createBaseVNode("span",{innerHTML:L(F)},null,8,_hoisted_8$9)]),(openBlock(!0),createElementBlock(Fragment,null,renderList(i.value,(_,$e)=>(openBlock(),createElementBlock("td",{key:$e,class:"p-2 text-center"},[createBaseVNode("input",{type:"radio",name:String(ft),value:String($e),checked:k[String(ft)]===String($e),disabled:unref(r)==="review",class:normalizeClass(gt(String(ft),String($e))),onChange:it=>ce(String(ft),String($e))},null,42,_hoisted_9$8)]))),128))]))),128))])]),v.value?(openBlock(),createElementBlock("div",_hoisted_10$6,toDisplayString(v.value),1)):createCommentVNode("",!0),u.value?(openBlock(),createElementBlock("div",_hoisted_11$4,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer",onClick:U}," Submit ")])):createCommentVNode("",!0),renderSlot(b.$slots,"solution")]))}}),_hoisted_1$b=["innerHTML"],_hoisted_2$a={class:"flex items-start gap-2"},_hoisted_3$a=["src"],_hoisted_4$a=["innerHTML"],_hoisted_5$a={key:1,class:"mt-3 flex justify-end"},_hoisted_6$a=["disabled"],_sfc_main$c=defineComponent({__name:"Highlight",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,r=computed(()=>t.examStore.testMode),a=ref(!1),l=v=>{if(Array.isArray(v))return v.map(m=>String(m));if(typeof v=="string"){if(!v.trim())return[];try{const m=JSON.parse(v);return l(m)}catch{return[v]}}return v==null?[]:[String(v)]},s=v=>Array.from(new Set(v)),i=computed({get:()=>s(l(t.modelValue)),set:v=>o("update:modelValue",s(v))}),f=computed(()=>i.value),d=computed(()=>s(l(t.question.correct_answer))),k=computed(()=>r.value==="review"?!0:r.value==="tutor"?a.value:!1),N=computed(()=>Object.entries(t.question.options||{}).map(([v,m])=>{const u=String((m==null?void 0:m.choice)??"").trim();return{key:v,text:u,textLower:u.toLowerCase()}}).filter(v=>!!v.text).sort((v,m)=>m.text.length-v.text.length)),x=v=>v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),E=v=>{const m=f.value.includes(v);if(!k.value)return m?"hl-token-selected":"hl-token-idle";const u=d.value.includes(v);return u&&m?"hl-token-correct":u&&!m?"hl-token-missed":!u&&m?"hl-token-wrong":"hl-token-idle"},L=(v,m)=>{if(!v||!N.value.length)return{changed:!1,html:x(v||"")};const u=v.toLowerCase();let ne=0,gt=!1,w="";for(;ne<v.length;){let y=-1,U=null;for(const H of N.value){const F=u.indexOf(H.textLower,ne);F!==-1&&(U===null||F<y||F===y&&H.text.length>U.text.length)&&(y=F,U=H)}if(!U||y===-1){w+=x(v.slice(ne));break}y>ne&&(w+=x(v.slice(ne,y)));const b=v.slice(y,y+U.text.length);m.add(U.key),w+=`<span class="hl-token ${E(U.key)}" role="button" tabindex="0" data-hl-key="${x(U.key)}" aria-pressed="${f.value.includes(U.key)}">${x(b)}</span>`,ne=y+U.text.length,gt=!0}return{changed:gt,html:w||x(v)}},j=v=>{v.querySelectorAll("#exhibits").forEach(u=>u.remove()),v.querySelectorAll("p,div,span,strong").forEach(u=>{(u.textContent||"").trim().toLowerCase()==="exhibits"&&u.remove()})},Y=computed(()=>{var y;const v=String(t.question.question||"");if(!v)return{html:"",matchedKeys:[]};if(typeof document>"u")return{html:v,matchedKeys:[]};const m=document.createElement("div");m.innerHTML=v,j(m);const u=new Set,ne=document.createTreeWalker(m,NodeFilter.SHOW_TEXT),gt=[];let w;for(;w=ne.nextNode();)gt.push(w);for(const U of gt){const b=U.nodeValue||"";if(!b.trim())continue;const H=L(b,u);if(!H.changed)continue;const F=document.createElement("span");F.innerHTML=H.html,(y=U.parentNode)==null||y.replaceChild(F,U)}return{html:m.innerHTML,matchedKeys:Array.from(u)}}),yt=computed(()=>Y.value.html),T=v=>{if(r.value==="review"||r.value==="tutor"&&a.value)return;const m=[...i.value],u=m.indexOf(v);u===-1?m.push(v):m.splice(u,1),i.value=m},ae=()=>{r.value==="tutor"&&f.value.length!==0&&(a.value=!0)},z=v=>{const m=v.target,u=m==null?void 0:m.closest("[data-hl-key]"),ne=u==null?void 0:u.dataset.hlKey;ne&&T(ne)},ce=v=>{if(v.key!=="Enter"&&v.key!==" ")return;const m=v.target,u=m==null?void 0:m.closest("[data-hl-key]"),ne=u==null?void 0:u.dataset.hlKey;ne&&(v.preventDefault(),T(ne))};return watch(()=>{var v;return[(v=t.question)==null?void 0:v.id,r.value]},()=>{a.value=!1},{immediate:!0}),(v,m)=>(openBlock(),createElementBlock("div",null,[v.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:v.question.intro},null,8,_hoisted_1$b)):createCommentVNode("",!0),createBaseVNode("div",_hoisted_2$a,[["nclex","cat"].includes(v.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$a)):createCommentVNode("",!0),createBaseVNode("div",{class:"hl-content mb-2 font-base leading-relaxed",onClick:z,onKeydown:ce,innerHTML:yt.value},null,40,_hoisted_4$a)]),r.value==="tutor"&&!a.value?(openBlock(),createElementBlock("div",_hoisted_5$a,[createBaseVNode("button",{type:"button",class:"rounded-full bg-sky-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60",disabled:f.value.length===0,onClick:ae}," Submit Highlight ",8,_hoisted_6$a)])):createCommentVNode("",!0)]))}}),Highlight=_export_sfc(_sfc_main$c,[["__scopeId","data-v-7b04cc84"]]);var rn=Object.defineProperty,Ne=Object.getOwnPropertySymbols,vt=Object.prototype.hasOwnProperty,bt=Object.prototype.propertyIsEnumerable,mt=(e,n,t)=>n in e?rn(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t,fe=(e,n)=>{for(var t in n||(n={}))vt.call(n,t)&&mt(e,t,n[t]);if(Ne)for(var t of Ne(n))bt.call(n,t)&&mt(e,t,n[t]);return e},Ve=(e,n)=>{var t={};for(var o in e)vt.call(e,o)&&n.indexOf(o)<0&&(t[o]=e[o]);if(e!=null&&Ne)for(var o of Ne(e))n.indexOf(o)<0&&bt.call(e,o)&&(t[o]=e[o]);return t};const Bt="[vue-draggable-plus]: ";function gn(e){console.warn(Bt+e)}function mn(e){console.error(Bt+e)}function wt(e,n,t){return t>=0&&t<e.length&&e.splice(t,0,e.splice(n,1)[0]),e}function vn(e){return e.replace(/-(\w)/g,(n,t)=>t?t.toUpperCase():"")}function bn(e){return Object.keys(e).reduce((n,t)=>(typeof e[t]<"u"&&(n[vn(t)]=e[t]),n),{})}function Et(e,n){return Array.isArray(e)&&e.splice(n,1),e}function St(e,n,t){return Array.isArray(e)&&e.splice(n,0,t),e}function yn(e){return typeof e>"u"}function wn(e){return typeof e=="string"}function Dt(e,n,t){const o=e.children[t];e.insertBefore(n,o)}function qe(e){e.parentNode&&e.parentNode.removeChild(e)}function En(e,n=document){var t;let o=null;return typeof(n==null?void 0:n.querySelector)=="function"?o=(t=n==null?void 0:n.querySelector)==null?void 0:t.call(n,e):o=document.querySelector(e),o||gn(`Element not found: ${e}`),o}function Sn(e,n,t=null){return function(...o){return e.apply(t,o),n.apply(t,o)}}function Dn(e,n){const t=fe({},e);return Object.keys(n).forEach(o=>{t[o]?t[o]=Sn(e[o],n[o]):t[o]=n[o]}),t}function _n(e){return e instanceof HTMLElement}function _t(e,n){Object.keys(e).forEach(t=>{n(t,e[t])})}function Tn(e){return e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97)}const Cn=Object.assign;/**!
 * Sortable 1.15.2
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */function Tt(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function te(e){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?Tt(Object(t),!0).forEach(function(o){On(e,o,t[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):Tt(Object(t)).forEach(function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(t,o))})}return e}function Xe(e){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?Xe=function(n){return typeof n}:Xe=function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},Xe(e)}function On(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function re(){return re=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},re.apply(this,arguments)}function In(e,n){if(e==null)return{};var t={},o=Object.keys(e),r,a;for(a=0;a<o.length;a++)r=o[a],!(n.indexOf(r)>=0)&&(t[r]=e[r]);return t}function An(e,n){if(e==null)return{};var t=In(e,n),o,r;if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)o=a[r],!(n.indexOf(o)>=0)&&Object.prototype.propertyIsEnumerable.call(e,o)&&(t[o]=e[o])}return t}var xn="1.15.2";function oe(e){if(typeof window<"u"&&window.navigator)return!!navigator.userAgent.match(e)}var ie=oe(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),Ae=oe(/Edge/i),Ct=oe(/firefox/i),_e=oe(/safari/i)&&!oe(/chrome/i)&&!oe(/android/i),kt=oe(/iP(ad|od|hone)/i),Ht=oe(/chrome/i)&&oe(/android/i),Lt={capture:!1,passive:!1};function D(e,n,t){e.addEventListener(n,t,!ie&&Lt)}function S(e,n,t){e.removeEventListener(n,t,!ie&&Lt)}function Le(e,n){if(n){if(n[0]===">"&&(n=n.substring(1)),e)try{if(e.matches)return e.matches(n);if(e.msMatchesSelector)return e.msMatchesSelector(n);if(e.webkitMatchesSelector)return e.webkitMatchesSelector(n)}catch{return!1}return!1}}function Nn(e){return e.host&&e!==document&&e.host.nodeType?e.host:e.parentNode}function Z(e,n,t,o){if(e){t=t||document;do{if(n!=null&&(n[0]===">"?e.parentNode===t&&Le(e,n):Le(e,n))||o&&e===t)return e;if(e===t)break}while(e=Nn(e))}return null}var Ot=/\s+/g;function V(e,n,t){if(e&&n)if(e.classList)e.classList[t?"add":"remove"](n);else{var o=(" "+e.className+" ").replace(Ot," ").replace(" "+n+" "," ");e.className=(o+(t?" "+n:"")).replace(Ot," ")}}function h(e,n,t){var o=e&&e.style;if(o){if(t===void 0)return document.defaultView&&document.defaultView.getComputedStyle?t=document.defaultView.getComputedStyle(e,""):e.currentStyle&&(t=e.currentStyle),n===void 0?t:t[n];!(n in o)&&n.indexOf("webkit")===-1&&(n="-webkit-"+n),o[n]=t+(typeof t=="string"?"":"px")}}function ye(e,n){var t="";if(typeof e=="string")t=e;else do{var o=h(e,"transform");o&&o!=="none"&&(t=o+" "+t)}while(!n&&(e=e.parentNode));var r=window.DOMMatrix||window.WebKitCSSMatrix||window.CSSMatrix||window.MSCSSMatrix;return r&&new r(t)}function Wt(e,n,t){if(e){var o=e.getElementsByTagName(n),r=0,a=o.length;if(t)for(;r<a;r++)t(o[r],r);return o}return[]}function ee(){var e=document.scrollingElement;return e||document.documentElement}function M(e,n,t,o,r){if(!(!e.getBoundingClientRect&&e!==window)){var a,l,s,i,f,d,k;if(e!==window&&e.parentNode&&e!==ee()?(a=e.getBoundingClientRect(),l=a.top,s=a.left,i=a.bottom,f=a.right,d=a.height,k=a.width):(l=0,s=0,i=window.innerHeight,f=window.innerWidth,d=window.innerHeight,k=window.innerWidth),(n||t)&&e!==window&&(r=r||e.parentNode,!ie))do if(r&&r.getBoundingClientRect&&(h(r,"transform")!=="none"||t&&h(r,"position")!=="static")){var N=r.getBoundingClientRect();l-=N.top+parseInt(h(r,"border-top-width")),s-=N.left+parseInt(h(r,"border-left-width")),i=l+a.height,f=s+a.width;break}while(r=r.parentNode);if(o&&e!==window){var x=ye(r||e),E=x&&x.a,L=x&&x.d;x&&(l/=L,s/=E,k/=E,d/=L,i=l+d,f=s+k)}return{top:l,left:s,bottom:i,right:f,width:k,height:d}}}function It(e,n,t){for(var o=ue(e,!0),r=M(e)[n];o;){var a=M(o)[t],l=void 0;if(l=r>=a,!l)return o;if(o===ee())break;o=ue(o,!1)}return!1}function we(e,n,t,o){for(var r=0,a=0,l=e.children;a<l.length;){if(l[a].style.display!=="none"&&l[a]!==p.ghost&&(o||l[a]!==p.dragged)&&Z(l[a],t.draggable,e,!1)){if(r===n)return l[a];r++}a++}return null}function dt(e,n){for(var t=e.lastElementChild;t&&(t===p.ghost||h(t,"display")==="none"||n&&!Le(t,n));)t=t.previousElementSibling;return t||null}function K(e,n){var t=0;if(!e||!e.parentNode)return-1;for(;e=e.previousElementSibling;)e.nodeName.toUpperCase()!=="TEMPLATE"&&e!==p.clone&&(!n||Le(e,n))&&t++;return t}function At(e){var n=0,t=0,o=ee();if(e)do{var r=ye(e),a=r.a,l=r.d;n+=e.scrollLeft*a,t+=e.scrollTop*l}while(e!==o&&(e=e.parentNode));return[n,t]}function Pn(e,n){for(var t in e)if(e.hasOwnProperty(t)){for(var o in n)if(n.hasOwnProperty(o)&&n[o]===e[t][o])return Number(t)}return-1}function ue(e,n){if(!e||!e.getBoundingClientRect)return ee();var t=e,o=!1;do if(t.clientWidth<t.scrollWidth||t.clientHeight<t.scrollHeight){var r=h(t);if(t.clientWidth<t.scrollWidth&&(r.overflowX=="auto"||r.overflowX=="scroll")||t.clientHeight<t.scrollHeight&&(r.overflowY=="auto"||r.overflowY=="scroll")){if(!t.getBoundingClientRect||t===document.body)return ee();if(o||n)return t;o=!0}}while(t=t.parentNode);return ee()}function Mn(e,n){if(e&&n)for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t]);return e}function Ke(e,n){return Math.round(e.top)===Math.round(n.top)&&Math.round(e.left)===Math.round(n.left)&&Math.round(e.height)===Math.round(n.height)&&Math.round(e.width)===Math.round(n.width)}var Te;function Gt(e,n){return function(){if(!Te){var t=arguments,o=this;t.length===1?e.call(o,t[0]):e.apply(o,t),Te=setTimeout(function(){Te=void 0},n)}}}function Fn(){clearTimeout(Te),Te=void 0}function jt(e,n,t){e.scrollLeft+=n,e.scrollTop+=t}function zt(e){var n=window.Polymer,t=window.jQuery||window.Zepto;return n&&n.dom?n.dom(e).cloneNode(!0):t?t(e).clone(!0)[0]:e.cloneNode(!0)}function Ut(e,n,t){var o={};return Array.from(e.children).forEach(function(r){var a,l,s,i;if(!(!Z(r,n.draggable,e,!1)||r.animated||r===t)){var f=M(r);o.left=Math.min((a=o.left)!==null&&a!==void 0?a:1/0,f.left),o.top=Math.min((l=o.top)!==null&&l!==void 0?l:1/0,f.top),o.right=Math.max((s=o.right)!==null&&s!==void 0?s:-1/0,f.right),o.bottom=Math.max((i=o.bottom)!==null&&i!==void 0?i:-1/0,f.bottom)}}),o.width=o.right-o.left,o.height=o.bottom-o.top,o.x=o.left,o.y=o.top,o}var q="Sortable"+new Date().getTime();function Rn(){var e=[],n;return{captureAnimationState:function(){if(e=[],!!this.options.animation){var t=[].slice.call(this.el.children);t.forEach(function(o){if(!(h(o,"display")==="none"||o===p.ghost)){e.push({target:o,rect:M(o)});var r=te({},e[e.length-1].rect);if(o.thisAnimationDuration){var a=ye(o,!0);a&&(r.top-=a.f,r.left-=a.e)}o.fromRect=r}})}},addAnimationState:function(t){e.push(t)},removeAnimationState:function(t){e.splice(Pn(e,{target:t}),1)},animateAll:function(t){var o=this;if(!this.options.animation){clearTimeout(n),typeof t=="function"&&t();return}var r=!1,a=0;e.forEach(function(l){var s=0,i=l.target,f=i.fromRect,d=M(i),k=i.prevFromRect,N=i.prevToRect,x=l.rect,E=ye(i,!0);E&&(d.top-=E.f,d.left-=E.e),i.toRect=d,i.thisAnimationDuration&&Ke(k,d)&&!Ke(f,d)&&(x.top-d.top)/(x.left-d.left)===(f.top-d.top)/(f.left-d.left)&&(s=Yn(x,k,N,o.options)),Ke(d,f)||(i.prevFromRect=f,i.prevToRect=d,s||(s=o.options.animation),o.animate(i,x,d,s)),s&&(r=!0,a=Math.max(a,s),clearTimeout(i.animationResetTimer),i.animationResetTimer=setTimeout(function(){i.animationTime=0,i.prevFromRect=null,i.fromRect=null,i.prevToRect=null,i.thisAnimationDuration=null},s),i.thisAnimationDuration=s)}),clearTimeout(n),r?n=setTimeout(function(){typeof t=="function"&&t()},a):typeof t=="function"&&t(),e=[]},animate:function(t,o,r,a){if(a){h(t,"transition",""),h(t,"transform","");var l=ye(this.el),s=l&&l.a,i=l&&l.d,f=(o.left-r.left)/(s||1),d=(o.top-r.top)/(i||1);t.animatingX=!!f,t.animatingY=!!d,h(t,"transform","translate3d("+f+"px,"+d+"px,0)"),this.forRepaintDummy=Xn(t),h(t,"transition","transform "+a+"ms"+(this.options.easing?" "+this.options.easing:"")),h(t,"transform","translate3d(0,0,0)"),typeof t.animated=="number"&&clearTimeout(t.animated),t.animated=setTimeout(function(){h(t,"transition",""),h(t,"transform",""),t.animated=!1,t.animatingX=!1,t.animatingY=!1},a)}}}}function Xn(e){return e.offsetWidth}function Yn(e,n,t,o){return Math.sqrt(Math.pow(n.top-e.top,2)+Math.pow(n.left-e.left,2))/Math.sqrt(Math.pow(n.top-t.top,2)+Math.pow(n.left-t.left,2))*o.animation}var ge=[],Je={initializeByDefault:!0},xe={mount:function(e){for(var n in Je)Je.hasOwnProperty(n)&&!(n in e)&&(e[n]=Je[n]);ge.forEach(function(t){if(t.pluginName===e.pluginName)throw"Sortable: Cannot mount plugin ".concat(e.pluginName," more than once")}),ge.push(e)},pluginEvent:function(e,n,t){var o=this;this.eventCanceled=!1,t.cancel=function(){o.eventCanceled=!0};var r=e+"Global";ge.forEach(function(a){n[a.pluginName]&&(n[a.pluginName][r]&&n[a.pluginName][r](te({sortable:n},t)),n.options[a.pluginName]&&n[a.pluginName][e]&&n[a.pluginName][e](te({sortable:n},t)))})},initializePlugins:function(e,n,t,o){ge.forEach(function(l){var s=l.pluginName;if(!(!e.options[s]&&!l.initializeByDefault)){var i=new l(e,n,e.options);i.sortable=e,i.options=e.options,e[s]=i,re(t,i.defaults)}});for(var r in e.options)if(e.options.hasOwnProperty(r)){var a=this.modifyOption(e,r,e.options[r]);typeof a<"u"&&(e.options[r]=a)}},getEventProperties:function(e,n){var t={};return ge.forEach(function(o){typeof o.eventProperties=="function"&&re(t,o.eventProperties.call(n[o.pluginName],e))}),t},modifyOption:function(e,n,t){var o;return ge.forEach(function(r){e[r.pluginName]&&r.optionListeners&&typeof r.optionListeners[n]=="function"&&(o=r.optionListeners[n].call(e[r.pluginName],t))}),o}};function Bn(e){var n=e.sortable,t=e.rootEl,o=e.name,r=e.targetEl,a=e.cloneEl,l=e.toEl,s=e.fromEl,i=e.oldIndex,f=e.newIndex,d=e.oldDraggableIndex,k=e.newDraggableIndex,N=e.originalEvent,x=e.putSortable,E=e.extraEventProperties;if(n=n||t&&t[q],!!n){var L,j=n.options,Y="on"+o.charAt(0).toUpperCase()+o.substr(1);window.CustomEvent&&!ie&&!Ae?L=new CustomEvent(o,{bubbles:!0,cancelable:!0}):(L=document.createEvent("Event"),L.initEvent(o,!0,!0)),L.to=l||t,L.from=s||t,L.item=r||t,L.clone=a,L.oldIndex=i,L.newIndex=f,L.oldDraggableIndex=d,L.newDraggableIndex=k,L.originalEvent=N,L.pullMode=x?x.lastPutMode:void 0;var yt=te(te({},E),xe.getEventProperties(o,n));for(var T in yt)L[T]=yt[T];t&&t.dispatchEvent(L),j[Y]&&j[Y].call(n,L)}}var kn=["evt"],G=function(e,n){var t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},o=t.evt,r=An(t,kn);xe.pluginEvent.bind(p)(e,n,te({dragEl:c,parentEl:I,ghostEl:g,rootEl:C,nextEl:pe,lastDownEl:Ye,cloneEl:O,cloneHidden:se,dragStarted:Ee,putSortable:X,activeSortable:p.active,originalEvent:o,oldIndex:be,oldDraggableIndex:Ce,newIndex:$,newDraggableIndex:le,hideGhostForTarget:Kt,unhideGhostForTarget:Jt,cloneNowHidden:function(){se=!0},cloneNowShown:function(){se=!1},dispatchSortableEvent:function(a){W({sortable:n,name:a,originalEvent:o})}},r))};function W(e){Bn(te({putSortable:X,cloneEl:O,targetEl:c,rootEl:C,oldIndex:be,oldDraggableIndex:Ce,newIndex:$,newDraggableIndex:le},e))}var c,I,g,C,pe,Ye,O,se,be,$,Ce,le,Pe,X,ve=!1,We=!1,Ge=[],de,J,Ze,Qe,xt,Nt,Ee,me,Oe,Ie=!1,Me=!1,Be,B,et=[],at=!1,je=[],Ue=typeof document<"u",Fe=kt,Pt=Ae||ie?"cssFloat":"float",Hn=Ue&&!Ht&&!kt&&"draggable"in document.createElement("div"),Vt=function(){if(Ue){if(ie)return!1;var e=document.createElement("x");return e.style.cssText="pointer-events:auto",e.style.pointerEvents==="auto"}}(),$t=function(e,n){var t=h(e),o=parseInt(t.width)-parseInt(t.paddingLeft)-parseInt(t.paddingRight)-parseInt(t.borderLeftWidth)-parseInt(t.borderRightWidth),r=we(e,0,n),a=we(e,1,n),l=r&&h(r),s=a&&h(a),i=l&&parseInt(l.marginLeft)+parseInt(l.marginRight)+M(r).width,f=s&&parseInt(s.marginLeft)+parseInt(s.marginRight)+M(a).width;if(t.display==="flex")return t.flexDirection==="column"||t.flexDirection==="column-reverse"?"vertical":"horizontal";if(t.display==="grid")return t.gridTemplateColumns.split(" ").length<=1?"vertical":"horizontal";if(r&&l.float&&l.float!=="none"){var d=l.float==="left"?"left":"right";return a&&(s.clear==="both"||s.clear===d)?"vertical":"horizontal"}return r&&(l.display==="block"||l.display==="flex"||l.display==="table"||l.display==="grid"||i>=o&&t[Pt]==="none"||a&&t[Pt]==="none"&&i+f>o)?"vertical":"horizontal"},Ln=function(e,n,t){var o=t?e.left:e.top,r=t?e.right:e.bottom,a=t?e.width:e.height,l=t?n.left:n.top,s=t?n.right:n.bottom,i=t?n.width:n.height;return o===l||r===s||o+a/2===l+i/2},Wn=function(e,n){var t;return Ge.some(function(o){var r=o[q].options.emptyInsertThreshold;if(!(!r||dt(o))){var a=M(o),l=e>=a.left-r&&e<=a.right+r,s=n>=a.top-r&&n<=a.bottom+r;if(l&&s)return t=o}}),t},qt=function(e){function n(r,a){return function(l,s,i,f){var d=l.options.group.name&&s.options.group.name&&l.options.group.name===s.options.group.name;if(r==null&&(a||d))return!0;if(r==null||r===!1)return!1;if(a&&r==="clone")return r;if(typeof r=="function")return n(r(l,s,i,f),a)(l,s,i,f);var k=(a?l:s).options.group.name;return r===!0||typeof r=="string"&&r===k||r.join&&r.indexOf(k)>-1}}var t={},o=e.group;(!o||Xe(o)!="object")&&(o={name:o}),t.name=o.name,t.checkPull=n(o.pull,!0),t.checkPut=n(o.put),t.revertClone=o.revertClone,e.group=t},Kt=function(){!Vt&&g&&h(g,"display","none")},Jt=function(){!Vt&&g&&h(g,"display","")};Ue&&!Ht&&document.addEventListener("click",function(e){if(We)return e.preventDefault(),e.stopPropagation&&e.stopPropagation(),e.stopImmediatePropagation&&e.stopImmediatePropagation(),We=!1,!1},!0);var he=function(e){if(c){e=e.touches?e.touches[0]:e;var n=Wn(e.clientX,e.clientY);if(n){var t={};for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.target=t.rootEl=n,t.preventDefault=void 0,t.stopPropagation=void 0,n[q]._onDragOver(t)}}},Gn=function(e){c&&c.parentNode[q]._isOutsideThisEl(e.target)};function p(e,n){if(!(e&&e.nodeType&&e.nodeType===1))throw"Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));this.el=e,this.options=n=re({},n),e[q]=this;var t={group:null,sort:!0,disabled:!1,store:null,handle:null,draggable:/^[uo]l$/i.test(e.nodeName)?">li":">*",swapThreshold:1,invertSwap:!1,invertedSwapThreshold:null,removeCloneOnHide:!0,direction:function(){return $t(e,this.options)},ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,preventOnFilter:!0,animation:0,easing:null,setData:function(a,l){a.setData("Text",l.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,delayOnTouchOnly:!1,touchStartThreshold:(Number.parseInt?Number:window).parseInt(window.devicePixelRatio,10)||1,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0},supportPointer:p.supportPointer!==!1&&"PointerEvent"in window&&!_e,emptyInsertThreshold:5};xe.initializePlugins(this,e,t);for(var o in t)!(o in n)&&(n[o]=t[o]);qt(n);for(var r in this)r.charAt(0)==="_"&&typeof this[r]=="function"&&(this[r]=this[r].bind(this));this.nativeDraggable=n.forceFallback?!1:Hn,this.nativeDraggable&&(this.options.touchStartThreshold=1),n.supportPointer?D(e,"pointerdown",this._onTapStart):(D(e,"mousedown",this._onTapStart),D(e,"touchstart",this._onTapStart)),this.nativeDraggable&&(D(e,"dragover",this),D(e,"dragenter",this)),Ge.push(this.el),n.store&&n.store.get&&this.sort(n.store.get(this)||[]),re(this,Rn())}p.prototype={constructor:p,_isOutsideThisEl:function(e){!this.el.contains(e)&&e!==this.el&&(me=null)},_getDirection:function(e,n){return typeof this.options.direction=="function"?this.options.direction.call(this,e,n,c):this.options.direction},_onTapStart:function(e){if(e.cancelable){var n=this,t=this.el,o=this.options,r=o.preventOnFilter,a=e.type,l=e.touches&&e.touches[0]||e.pointerType&&e.pointerType==="touch"&&e,s=(l||e).target,i=e.target.shadowRoot&&(e.path&&e.path[0]||e.composedPath&&e.composedPath()[0])||s,f=o.filter;if(Jn(t),!c&&!(/mousedown|pointerdown/.test(a)&&e.button!==0||o.disabled)&&!i.isContentEditable&&!(!this.nativeDraggable&&_e&&s&&s.tagName.toUpperCase()==="SELECT")&&(s=Z(s,o.draggable,t,!1),!(s&&s.animated)&&Ye!==s)){if(be=K(s),Ce=K(s,o.draggable),typeof f=="function"){if(f.call(this,e,s,this)){W({sortable:n,rootEl:i,name:"filter",targetEl:s,toEl:t,fromEl:t}),G("filter",n,{evt:e}),r&&e.cancelable&&e.preventDefault();return}}else if(f&&(f=f.split(",").some(function(d){if(d=Z(i,d.trim(),t,!1),d)return W({sortable:n,rootEl:d,name:"filter",targetEl:s,fromEl:t,toEl:t}),G("filter",n,{evt:e}),!0}),f)){r&&e.cancelable&&e.preventDefault();return}o.handle&&!Z(i,o.handle,t,!1)||this._prepareDragStart(e,l,s)}}},_prepareDragStart:function(e,n,t){var o=this,r=o.el,a=o.options,l=r.ownerDocument,s;if(t&&!c&&t.parentNode===r){var i=M(t);if(C=r,c=t,I=c.parentNode,pe=c.nextSibling,Ye=t,Pe=a.group,p.dragged=c,de={target:c,clientX:(n||e).clientX,clientY:(n||e).clientY},xt=de.clientX-i.left,Nt=de.clientY-i.top,this._lastX=(n||e).clientX,this._lastY=(n||e).clientY,c.style["will-change"]="all",s=function(){if(G("delayEnded",o,{evt:e}),p.eventCanceled){o._onDrop();return}o._disableDelayedDragEvents(),!Ct&&o.nativeDraggable&&(c.draggable=!0),o._triggerDragStart(e,n),W({sortable:o,name:"choose",originalEvent:e}),V(c,a.chosenClass,!0)},a.ignore.split(",").forEach(function(f){Wt(c,f.trim(),tt)}),D(l,"dragover",he),D(l,"mousemove",he),D(l,"touchmove",he),D(l,"mouseup",o._onDrop),D(l,"touchend",o._onDrop),D(l,"touchcancel",o._onDrop),Ct&&this.nativeDraggable&&(this.options.touchStartThreshold=4,c.draggable=!0),G("delayStart",this,{evt:e}),a.delay&&(!a.delayOnTouchOnly||n)&&(!this.nativeDraggable||!(Ae||ie))){if(p.eventCanceled){this._onDrop();return}D(l,"mouseup",o._disableDelayedDrag),D(l,"touchend",o._disableDelayedDrag),D(l,"touchcancel",o._disableDelayedDrag),D(l,"mousemove",o._delayedDragTouchMoveHandler),D(l,"touchmove",o._delayedDragTouchMoveHandler),a.supportPointer&&D(l,"pointermove",o._delayedDragTouchMoveHandler),o._dragStartTimer=setTimeout(s,a.delay)}else s()}},_delayedDragTouchMoveHandler:function(e){var n=e.touches?e.touches[0]:e;Math.max(Math.abs(n.clientX-this._lastX),Math.abs(n.clientY-this._lastY))>=Math.floor(this.options.touchStartThreshold/(this.nativeDraggable&&window.devicePixelRatio||1))&&this._disableDelayedDrag()},_disableDelayedDrag:function(){c&&tt(c),clearTimeout(this._dragStartTimer),this._disableDelayedDragEvents()},_disableDelayedDragEvents:function(){var e=this.el.ownerDocument;S(e,"mouseup",this._disableDelayedDrag),S(e,"touchend",this._disableDelayedDrag),S(e,"touchcancel",this._disableDelayedDrag),S(e,"mousemove",this._delayedDragTouchMoveHandler),S(e,"touchmove",this._delayedDragTouchMoveHandler),S(e,"pointermove",this._delayedDragTouchMoveHandler)},_triggerDragStart:function(e,n){n=n||e.pointerType=="touch"&&e,!this.nativeDraggable||n?this.options.supportPointer?D(document,"pointermove",this._onTouchMove):n?D(document,"touchmove",this._onTouchMove):D(document,"mousemove",this._onTouchMove):(D(c,"dragend",this),D(C,"dragstart",this._onDragStart));try{document.selection?ke(function(){document.selection.empty()}):window.getSelection().removeAllRanges()}catch{}},_dragStarted:function(e,n){if(ve=!1,C&&c){G("dragStarted",this,{evt:n}),this.nativeDraggable&&D(document,"dragover",Gn);var t=this.options;!e&&V(c,t.dragClass,!1),V(c,t.ghostClass,!0),p.active=this,e&&this._appendGhost(),W({sortable:this,name:"start",originalEvent:n})}else this._nulling()},_emulateDragOver:function(){if(J){this._lastX=J.clientX,this._lastY=J.clientY,Kt();for(var e=document.elementFromPoint(J.clientX,J.clientY),n=e;e&&e.shadowRoot&&(e=e.shadowRoot.elementFromPoint(J.clientX,J.clientY),e!==n);)n=e;if(c.parentNode[q]._isOutsideThisEl(e),n)do{if(n[q]){var t=void 0;if(t=n[q]._onDragOver({clientX:J.clientX,clientY:J.clientY,target:e,rootEl:n}),t&&!this.options.dragoverBubble)break}e=n}while(n=n.parentNode);Jt()}},_onTouchMove:function(e){if(de){var n=this.options,t=n.fallbackTolerance,o=n.fallbackOffset,r=e.touches?e.touches[0]:e,a=g&&ye(g,!0),l=g&&a&&a.a,s=g&&a&&a.d,i=Fe&&B&&At(B),f=(r.clientX-de.clientX+o.x)/(l||1)+(i?i[0]-et[0]:0)/(l||1),d=(r.clientY-de.clientY+o.y)/(s||1)+(i?i[1]-et[1]:0)/(s||1);if(!p.active&&!ve){if(t&&Math.max(Math.abs(r.clientX-this._lastX),Math.abs(r.clientY-this._lastY))<t)return;this._onDragStart(e,!0)}if(g){a?(a.e+=f-(Ze||0),a.f+=d-(Qe||0)):a={a:1,b:0,c:0,d:1,e:f,f:d};var k="matrix(".concat(a.a,",").concat(a.b,",").concat(a.c,",").concat(a.d,",").concat(a.e,",").concat(a.f,")");h(g,"webkitTransform",k),h(g,"mozTransform",k),h(g,"msTransform",k),h(g,"transform",k),Ze=f,Qe=d,J=r}e.cancelable&&e.preventDefault()}},_appendGhost:function(){if(!g){var e=this.options.fallbackOnBody?document.body:C,n=M(c,!0,Fe,!0,e),t=this.options;if(Fe){for(B=e;h(B,"position")==="static"&&h(B,"transform")==="none"&&B!==document;)B=B.parentNode;B!==document.body&&B!==document.documentElement?(B===document&&(B=ee()),n.top+=B.scrollTop,n.left+=B.scrollLeft):B=ee(),et=At(B)}g=c.cloneNode(!0),V(g,t.ghostClass,!1),V(g,t.fallbackClass,!0),V(g,t.dragClass,!0),h(g,"transition",""),h(g,"transform",""),h(g,"box-sizing","border-box"),h(g,"margin",0),h(g,"top",n.top),h(g,"left",n.left),h(g,"width",n.width),h(g,"height",n.height),h(g,"opacity","0.8"),h(g,"position",Fe?"absolute":"fixed"),h(g,"zIndex","100000"),h(g,"pointerEvents","none"),p.ghost=g,e.appendChild(g),h(g,"transform-origin",xt/parseInt(g.style.width)*100+"% "+Nt/parseInt(g.style.height)*100+"%")}},_onDragStart:function(e,n){var t=this,o=e.dataTransfer,r=t.options;if(G("dragStart",this,{evt:e}),p.eventCanceled){this._onDrop();return}G("setupClone",this),p.eventCanceled||(O=zt(c),O.removeAttribute("id"),O.draggable=!1,O.style["will-change"]="",this._hideClone(),V(O,this.options.chosenClass,!1),p.clone=O),t.cloneId=ke(function(){G("clone",t),!p.eventCanceled&&(t.options.removeCloneOnHide||C.insertBefore(O,c),t._hideClone(),W({sortable:t,name:"clone"}))}),!n&&V(c,r.dragClass,!0),n?(We=!0,t._loopId=setInterval(t._emulateDragOver,50)):(S(document,"mouseup",t._onDrop),S(document,"touchend",t._onDrop),S(document,"touchcancel",t._onDrop),o&&(o.effectAllowed="move",r.setData&&r.setData.call(t,o,c)),D(document,"drop",t),h(c,"transform","translateZ(0)")),ve=!0,t._dragStartId=ke(t._dragStarted.bind(t,n,e)),D(document,"selectstart",t),Ee=!0,_e&&h(document.body,"user-select","none")},_onDragOver:function(e){var n=this.el,t=e.target,o,r,a,l=this.options,s=l.group,i=p.active,f=Pe===s,d=l.sort,k=X||i,N,x=this,E=!1;if(at)return;function L(F,ft){G(F,x,te({evt:e,isOwner:f,axis:N?"vertical":"horizontal",revert:a,dragRect:o,targetRect:r,canSort:d,fromSortable:k,target:t,completed:Y,onMove:function(_,$e){return Re(C,n,c,o,_,M(_),e,$e)},changed:yt},ft))}function j(){L("dragOverAnimationCapture"),x.captureAnimationState(),x!==k&&k.captureAnimationState()}function Y(F){return L("dragOverCompleted",{insertion:F}),F&&(f?i._hideClone():i._showClone(x),x!==k&&(V(c,X?X.options.ghostClass:i.options.ghostClass,!1),V(c,l.ghostClass,!0)),X!==x&&x!==p.active?X=x:x===p.active&&X&&(X=null),k===x&&(x._ignoreWhileAnimating=t),x.animateAll(function(){L("dragOverAnimationComplete"),x._ignoreWhileAnimating=null}),x!==k&&(k.animateAll(),k._ignoreWhileAnimating=null)),(t===c&&!c.animated||t===n&&!t.animated)&&(me=null),!l.dragoverBubble&&!e.rootEl&&t!==document&&(c.parentNode[q]._isOutsideThisEl(e.target),!F&&he(e)),!l.dragoverBubble&&e.stopPropagation&&e.stopPropagation(),E=!0}function yt(){$=K(c),le=K(c,l.draggable),W({sortable:x,name:"change",toEl:n,newIndex:$,newDraggableIndex:le,originalEvent:e})}if(e.preventDefault!==void 0&&e.cancelable&&e.preventDefault(),t=Z(t,l.draggable,n,!0),L("dragOver"),p.eventCanceled)return E;if(c.contains(e.target)||t.animated&&t.animatingX&&t.animatingY||x._ignoreWhileAnimating===t)return Y(!1);if(We=!1,i&&!l.disabled&&(f?d||(a=I!==C):X===this||(this.lastPutMode=Pe.checkPull(this,i,c,e))&&s.checkPut(this,i,c,e))){if(N=this._getDirection(e,t)==="vertical",o=M(c),L("dragOverValid"),p.eventCanceled)return E;if(a)return I=C,j(),this._hideClone(),L("revert"),p.eventCanceled||(pe?C.insertBefore(c,pe):C.appendChild(c)),Y(!0);var T=dt(n,l.draggable);if(!T||Vn(e,N,this)&&!T.animated){if(T===c)return Y(!1);if(T&&n===e.target&&(t=T),t&&(r=M(t)),Re(C,n,c,o,t,r,e,!!t)!==!1)return j(),T&&T.nextSibling?n.insertBefore(c,T.nextSibling):n.appendChild(c),I=n,yt(),Y(!0)}else if(T&&Un(e,N,this)){var ae=we(n,0,l,!0);if(ae===c)return Y(!1);if(t=ae,r=M(t),Re(C,n,c,o,t,r,e,!1)!==!1)return j(),n.insertBefore(c,ae),I=n,yt(),Y(!0)}else if(t.parentNode===n){r=M(t);var z=0,ce,v=c.parentNode!==n,m=!Ln(c.animated&&c.toRect||o,t.animated&&t.toRect||r,N),u=N?"top":"left",ne=It(t,"top","top")||It(c,"top","top"),gt=ne?ne.scrollTop:void 0;me!==t&&(ce=r[u],Ie=!1,Me=!m&&l.invertSwap||v),z=$n(e,t,r,N,m?1:l.swapThreshold,l.invertedSwapThreshold==null?l.swapThreshold:l.invertedSwapThreshold,Me,me===t);var w;if(z!==0){var y=K(c);do y-=z,w=I.children[y];while(w&&(h(w,"display")==="none"||w===g))}if(z===0||w===t)return Y(!1);me=t,Oe=z;var U=t.nextElementSibling,b=!1;b=z===1;var H=Re(C,n,c,o,t,r,e,b);if(H!==!1)return(H===1||H===-1)&&(b=H===1),at=!0,setTimeout(zn,30),j(),b&&!U?n.appendChild(c):t.parentNode.insertBefore(c,b?U:t),ne&&jt(ne,0,gt-ne.scrollTop),I=c.parentNode,ce!==void 0&&!Me&&(Be=Math.abs(ce-M(t)[u])),yt(),Y(!0)}if(n.contains(c))return Y(!1)}return!1},_ignoreWhileAnimating:null,_offMoveEvents:function(){S(document,"mousemove",this._onTouchMove),S(document,"touchmove",this._onTouchMove),S(document,"pointermove",this._onTouchMove),S(document,"dragover",he),S(document,"mousemove",he),S(document,"touchmove",he)},_offUpEvents:function(){var e=this.el.ownerDocument;S(e,"mouseup",this._onDrop),S(e,"touchend",this._onDrop),S(e,"pointerup",this._onDrop),S(e,"touchcancel",this._onDrop),S(document,"selectstart",this)},_onDrop:function(e){var n=this.el,t=this.options;if($=K(c),le=K(c,t.draggable),G("drop",this,{evt:e}),I=c&&c.parentNode,$=K(c),le=K(c,t.draggable),p.eventCanceled){this._nulling();return}ve=!1,Me=!1,Ie=!1,clearInterval(this._loopId),clearTimeout(this._dragStartTimer),lt(this.cloneId),lt(this._dragStartId),this.nativeDraggable&&(S(document,"drop",this),S(n,"dragstart",this._onDragStart)),this._offMoveEvents(),this._offUpEvents(),_e&&h(document.body,"user-select",""),h(c,"transform",""),e&&(Ee&&(e.cancelable&&e.preventDefault(),!t.dropBubble&&e.stopPropagation()),g&&g.parentNode&&g.parentNode.removeChild(g),(C===I||X&&X.lastPutMode!=="clone")&&O&&O.parentNode&&O.parentNode.removeChild(O),c&&(this.nativeDraggable&&S(c,"dragend",this),tt(c),c.style["will-change"]="",Ee&&!ve&&V(c,X?X.options.ghostClass:this.options.ghostClass,!1),V(c,this.options.chosenClass,!1),W({sortable:this,name:"unchoose",toEl:I,newIndex:null,newDraggableIndex:null,originalEvent:e}),C!==I?($>=0&&(W({rootEl:I,name:"add",toEl:I,fromEl:C,originalEvent:e}),W({sortable:this,name:"remove",toEl:I,originalEvent:e}),W({rootEl:I,name:"sort",toEl:I,fromEl:C,originalEvent:e}),W({sortable:this,name:"sort",toEl:I,originalEvent:e})),X&&X.save()):$!==be&&$>=0&&(W({sortable:this,name:"update",toEl:I,originalEvent:e}),W({sortable:this,name:"sort",toEl:I,originalEvent:e})),p.active&&(($==null||$===-1)&&($=be,le=Ce),W({sortable:this,name:"end",toEl:I,originalEvent:e}),this.save()))),this._nulling()},_nulling:function(){G("nulling",this),C=c=I=g=pe=O=Ye=se=de=J=Ee=$=le=be=Ce=me=Oe=X=Pe=p.dragged=p.ghost=p.clone=p.active=null,je.forEach(function(e){e.checked=!0}),je.length=Ze=Qe=0},handleEvent:function(e){switch(e.type){case"drop":case"dragend":this._onDrop(e);break;case"dragenter":case"dragover":c&&(this._onDragOver(e),jn(e));break;case"selectstart":e.preventDefault();break}},toArray:function(){for(var e=[],n,t=this.el.children,o=0,r=t.length,a=this.options;o<r;o++)n=t[o],Z(n,a.draggable,this.el,!1)&&e.push(n.getAttribute(a.dataIdAttr)||Kn(n));return e},sort:function(e,n){var t={},o=this.el;this.toArray().forEach(function(r,a){var l=o.children[a];Z(l,this.options.draggable,o,!1)&&(t[r]=l)},this),n&&this.captureAnimationState(),e.forEach(function(r){t[r]&&(o.removeChild(t[r]),o.appendChild(t[r]))}),n&&this.animateAll()},save:function(){var e=this.options.store;e&&e.set&&e.set(this)},closest:function(e,n){return Z(e,n||this.options.draggable,this.el,!1)},option:function(e,n){var t=this.options;if(n===void 0)return t[e];var o=xe.modifyOption(this,e,n);typeof o<"u"?t[e]=o:t[e]=n,e==="group"&&qt(t)},destroy:function(){G("destroy",this);var e=this.el;e[q]=null,S(e,"mousedown",this._onTapStart),S(e,"touchstart",this._onTapStart),S(e,"pointerdown",this._onTapStart),this.nativeDraggable&&(S(e,"dragover",this),S(e,"dragenter",this)),Array.prototype.forEach.call(e.querySelectorAll("[draggable]"),function(n){n.removeAttribute("draggable")}),this._onDrop(),this._disableDelayedDragEvents(),Ge.splice(Ge.indexOf(this.el),1),this.el=e=null},_hideClone:function(){if(!se){if(G("hideClone",this),p.eventCanceled)return;h(O,"display","none"),this.options.removeCloneOnHide&&O.parentNode&&O.parentNode.removeChild(O),se=!0}},_showClone:function(e){if(e.lastPutMode!=="clone"){this._hideClone();return}if(se){if(G("showClone",this),p.eventCanceled)return;c.parentNode==C&&!this.options.group.revertClone?C.insertBefore(O,c):pe?C.insertBefore(O,pe):C.appendChild(O),this.options.group.revertClone&&this.animate(c,O),h(O,"display",""),se=!1}}};function jn(e){e.dataTransfer&&(e.dataTransfer.dropEffect="move"),e.cancelable&&e.preventDefault()}function Re(e,n,t,o,r,a,l,s){var i,f=e[q],d=f.options.onMove,k;return window.CustomEvent&&!ie&&!Ae?i=new CustomEvent("move",{bubbles:!0,cancelable:!0}):(i=document.createEvent("Event"),i.initEvent("move",!0,!0)),i.to=n,i.from=e,i.dragged=t,i.draggedRect=o,i.related=r||n,i.relatedRect=a||M(n),i.willInsertAfter=s,i.originalEvent=l,e.dispatchEvent(i),d&&(k=d.call(f,i,l)),k}function tt(e){e.draggable=!1}function zn(){at=!1}function Un(e,n,t){var o=M(we(t.el,0,t.options,!0)),r=Ut(t.el,t.options,g),a=10;return n?e.clientX<r.left-a||e.clientY<o.top&&e.clientX<o.right:e.clientY<r.top-a||e.clientY<o.bottom&&e.clientX<o.left}function Vn(e,n,t){var o=M(dt(t.el,t.options.draggable)),r=Ut(t.el,t.options,g),a=10;return n?e.clientX>r.right+a||e.clientY>o.bottom&&e.clientX>o.left:e.clientY>r.bottom+a||e.clientX>o.right&&e.clientY>o.top}function $n(e,n,t,o,r,a,l,s){var i=o?e.clientY:e.clientX,f=o?t.height:t.width,d=o?t.top:t.left,k=o?t.bottom:t.right,N=!1;if(!l){if(s&&Be<f*r){if(!Ie&&(Oe===1?i>d+f*a/2:i<k-f*a/2)&&(Ie=!0),Ie)N=!0;else if(Oe===1?i<d+Be:i>k-Be)return-Oe}else if(i>d+f*(1-r)/2&&i<k-f*(1-r)/2)return qn(n)}return N=N||l,N&&(i<d+f*a/2||i>k-f*a/2)?i>d+f/2?1:-1:0}function qn(e){return K(c)<K(e)?1:-1}function Kn(e){for(var n=e.tagName+e.className+e.src+e.href+e.textContent,t=n.length,o=0;t--;)o+=n.charCodeAt(t);return o.toString(36)}function Jn(e){je.length=0;for(var n=e.getElementsByTagName("input"),t=n.length;t--;){var o=n[t];o.checked&&je.push(o)}}function ke(e){return setTimeout(e,0)}function lt(e){return clearTimeout(e)}Ue&&D(document,"touchmove",function(e){(p.active||ve)&&e.cancelable&&e.preventDefault()});p.utils={on:D,off:S,css:h,find:Wt,is:function(e,n){return!!Z(e,n,e,!1)},extend:Mn,throttle:Gt,closest:Z,toggleClass:V,clone:zt,index:K,nextTick:ke,cancelNextTick:lt,detectDirection:$t,getChild:we};p.get=function(e){return e[q]};p.mount=function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];n[0].constructor===Array&&(n=n[0]),n.forEach(function(o){if(!o.prototype||!o.prototype.constructor)throw"Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(o));o.utils&&(p.utils=te(te({},p.utils),o.utils)),xe.mount(o)})};p.create=function(e,n){return new p(e,n)};p.version=xn;var P=[],Se,st,ut=!1,nt,ot,ze,De;function Zn(){function e(){this.defaults={scroll:!0,forceAutoScrollFallback:!1,scrollSensitivity:30,scrollSpeed:10,bubbleScroll:!0};for(var n in this)n.charAt(0)==="_"&&typeof this[n]=="function"&&(this[n]=this[n].bind(this))}return e.prototype={dragStarted:function(n){var t=n.originalEvent;this.sortable.nativeDraggable?D(document,"dragover",this._handleAutoScroll):this.options.supportPointer?D(document,"pointermove",this._handleFallbackAutoScroll):t.touches?D(document,"touchmove",this._handleFallbackAutoScroll):D(document,"mousemove",this._handleFallbackAutoScroll)},dragOverCompleted:function(n){var t=n.originalEvent;!this.options.dragOverBubble&&!t.rootEl&&this._handleAutoScroll(t)},drop:function(){this.sortable.nativeDraggable?S(document,"dragover",this._handleAutoScroll):(S(document,"pointermove",this._handleFallbackAutoScroll),S(document,"touchmove",this._handleFallbackAutoScroll),S(document,"mousemove",this._handleFallbackAutoScroll)),Mt(),He(),Fn()},nulling:function(){ze=st=Se=ut=De=nt=ot=null,P.length=0},_handleFallbackAutoScroll:function(n){this._handleAutoScroll(n,!0)},_handleAutoScroll:function(n,t){var o=this,r=(n.touches?n.touches[0]:n).clientX,a=(n.touches?n.touches[0]:n).clientY,l=document.elementFromPoint(r,a);if(ze=n,t||this.options.forceAutoScrollFallback||Ae||ie||_e){rt(n,this.options,l,t);var s=ue(l,!0);ut&&(!De||r!==nt||a!==ot)&&(De&&Mt(),De=setInterval(function(){var i=ue(document.elementFromPoint(r,a),!0);i!==s&&(s=i,He()),rt(n,o.options,i,t)},10),nt=r,ot=a)}else{if(!this.options.bubbleScroll||ue(l,!0)===ee()){He();return}rt(n,this.options,ue(l,!1),!1)}}},re(e,{pluginName:"scroll",initializeByDefault:!0})}function He(){P.forEach(function(e){clearInterval(e.pid)}),P=[]}function Mt(){clearInterval(De)}var rt=Gt(function(e,n,t,o){if(n.scroll){var r=(e.touches?e.touches[0]:e).clientX,a=(e.touches?e.touches[0]:e).clientY,l=n.scrollSensitivity,s=n.scrollSpeed,i=ee(),f=!1,d;st!==t&&(st=t,He(),Se=n.scroll,d=n.scrollFn,Se===!0&&(Se=ue(t,!0)));var k=0,N=Se;do{var x=N,E=M(x),L=E.top,j=E.bottom,Y=E.left,yt=E.right,T=E.width,ae=E.height,z=void 0,ce=void 0,v=x.scrollWidth,m=x.scrollHeight,u=h(x),ne=x.scrollLeft,gt=x.scrollTop;x===i?(z=T<v&&(u.overflowX==="auto"||u.overflowX==="scroll"||u.overflowX==="visible"),ce=ae<m&&(u.overflowY==="auto"||u.overflowY==="scroll"||u.overflowY==="visible")):(z=T<v&&(u.overflowX==="auto"||u.overflowX==="scroll"),ce=ae<m&&(u.overflowY==="auto"||u.overflowY==="scroll"));var w=z&&(Math.abs(yt-r)<=l&&ne+T<v)-(Math.abs(Y-r)<=l&&!!ne),y=ce&&(Math.abs(j-a)<=l&&gt+ae<m)-(Math.abs(L-a)<=l&&!!gt);if(!P[k])for(var U=0;U<=k;U++)P[U]||(P[U]={});(P[k].vx!=w||P[k].vy!=y||P[k].el!==x)&&(P[k].el=x,P[k].vx=w,P[k].vy=y,clearInterval(P[k].pid),(w!=0||y!=0)&&(f=!0,P[k].pid=setInterval((function(){o&&this.layer===0&&p.active._onTouchMove(ze);var b=P[this.layer].vy?P[this.layer].vy*s:0,H=P[this.layer].vx?P[this.layer].vx*s:0;typeof d=="function"&&d.call(p.dragged.parentNode[q],H,b,e,ze,P[this.layer].el)!=="continue"||jt(P[this.layer].el,H,b)}).bind({layer:k}),24))),k++}while(n.bubbleScroll&&N!==i&&(N=ue(N,!1)));ut=f}},30),Zt=function(e){var n=e.originalEvent,t=e.putSortable,o=e.dragEl,r=e.activeSortable,a=e.dispatchSortableEvent,l=e.hideGhostForTarget,s=e.unhideGhostForTarget;if(n){var i=t||r;l();var f=n.changedTouches&&n.changedTouches.length?n.changedTouches[0]:n,d=document.elementFromPoint(f.clientX,f.clientY);s(),i&&!i.el.contains(d)&&(a("spill"),this.onSpill({dragEl:o,putSortable:t}))}};function ht(){}ht.prototype={startIndex:null,dragStart:function(e){var n=e.oldDraggableIndex;this.startIndex=n},onSpill:function(e){var n=e.dragEl,t=e.putSortable;this.sortable.captureAnimationState(),t&&t.captureAnimationState();var o=we(this.sortable.el,this.startIndex,this.options);o?this.sortable.el.insertBefore(n,o):this.sortable.el.appendChild(n),this.sortable.animateAll(),t&&t.animateAll()},drop:Zt};re(ht,{pluginName:"revertOnSpill"});function pt(){}pt.prototype={onSpill:function(e){var n=e.dragEl,t=e.putSortable,o=t||this.sortable;o.captureAnimationState(),n.parentNode&&n.parentNode.removeChild(n),o.animateAll()},drop:Zt};re(pt,{pluginName:"removeOnSpill"});p.mount(new Zn);p.mount(pt,ht);function Qn(e){return e==null?e:JSON.parse(JSON.stringify(e))}function eo(e){getCurrentInstance()&&onUnmounted(e)}function to(e){getCurrentInstance()?onMounted(e):nextTick(e)}let Qt=null,en=null;function Ft(e=null,n=null){Qt=e,en=n}function no(){return{data:Qt,clonedData:en}}const Rt=Symbol("cloneElement");function tn(...e){var n,t;const o=(n=getCurrentInstance())==null?void 0:n.proxy;let r=null;const a=e[0];let[,l,s]=e;Array.isArray(unref(l))||(s=l,l=null);let i=null;const{immediate:f=!0,clone:d=Qn,customUpdate:k}=(t=unref(s))!=null?t:{};function N(m){var u;const{from:ne,oldIndex:gt,item:w}=m;r=Array.from(ne.childNodes);const y=unref((u=unref(l))==null?void 0:u[gt]),U=d(y);Ft(y,U),w[Rt]=U}function x(m){const u=m.item[Rt];if(!yn(u)){if(qe(m.item),isRef(l)){const ne=[...unref(l)];l.value=St(ne,m.newDraggableIndex,u);return}St(unref(l),m.newDraggableIndex,u)}}function E(m){const{from:u,item:ne,oldIndex:gt,oldDraggableIndex:w,pullMode:y,clone:U}=m;if(Dt(u,ne,gt),y==="clone"){qe(U);return}if(isRef(l)){const b=[...unref(l)];l.value=Et(b,w);return}Et(unref(l),w)}function L(m){if(k){k(m);return}const{from:u,item:ne,oldIndex:gt,oldDraggableIndex:w,newDraggableIndex:y}=m;if(qe(ne),Dt(u,ne,gt),isRef(l)){const U=[...unref(l)];l.value=wt(U,w,y);return}wt(unref(l),w,y)}function j(m){const{newIndex:u,oldIndex:ne,from:gt,to:w}=m;let y=null;const U=u===ne&&gt===w;try{if(U){let b=null;r==null||r.some((H,F)=>{if(b&&(r==null?void 0:r.length)!==w.childNodes.length)return gt.insertBefore(b,H.nextSibling),!0;const ft=w.childNodes[F];b=w==null?void 0:w.replaceChild(H,ft)})}}catch(b){y=b}finally{r=null}nextTick(()=>{if(Ft(),y)throw y})}const Y={onUpdate:L,onStart:N,onAdd:x,onRemove:E,onEnd:j};function yt(m){const u=unref(a);return m||(m=wn(u)?En(u,o==null?void 0:o.$el):u),m&&!_n(m)&&(m=m.$el),m||mn("Root element not found"),m}function T(){var m;const u=(m=unref(s))!=null?m:{},{immediate:ne,clone:gt}=u,w=Ve(u,["immediate","clone"]);return _t(w,(y,U)=>{Tn(y)&&(w[y]=(b,...H)=>{const F=no();return Cn(b,F),U(b,...H)})}),Dn(l===null?{}:Y,w)}const ae=m=>{m=yt(m),i&&z.destroy(),i=new p(m,T())};watch(()=>s,()=>{i&&_t(T(),(m,u)=>{i==null||i.option(m,u)})},{deep:!0});const z={option:(m,u)=>i==null?void 0:i.option(m,u),destroy:()=>{i==null||i.destroy(),i=null},save:()=>i==null?void 0:i.save(),toArray:()=>i==null?void 0:i.toArray(),closest:(...m)=>i==null?void 0:i.closest(...m)},ce=()=>z==null?void 0:z.option("disabled",!0),v=()=>z==null?void 0:z.option("disabled",!1);return to(()=>{f&&ae()}),eo(z.destroy),fe({start:ae,pause:ce,resume:v},z)}const ct=["update","start","add","remove","choose","unchoose","end","sort","filter","clone","move","change"],oo=["clone","animation","ghostClass","group","sort","disabled","store","handle","draggable","swapThreshold","invertSwap","invertedSwapThreshold","removeCloneOnHide","direction","chosenClass","dragClass","ignore","filter","preventOnFilter","easing","setData","dropBubble","dragoverBubble","dataIdAttr","delay","delayOnTouchOnly","touchStartThreshold","forceFallback","fallbackClass","fallbackOnBody","fallbackTolerance","fallbackOffset","supportPointer","emptyInsertThreshold","scroll","forceAutoScrollFallback","scrollSensitivity","scrollSpeed","bubbleScroll","modelValue","tag","target","customUpdate",...ct.map(e=>`on${e.replace(/^\S/,n=>n.toUpperCase())}`)],lo=defineComponent({name:"VueDraggable",model:{prop:"modelValue",event:"update:modelValue"},props:oo,emits:["update:modelValue",...ct],setup(e,{slots:n,emit:t,expose:o,attrs:r}){const a=ct.reduce((d,k)=>{const N=`on${k.replace(/^\S/,x=>x.toUpperCase())}`;return d[N]=(...x)=>t(k,...x),d},{}),l=computed(()=>{const d=toRefs(e),{modelValue:k}=d,N=Ve(d,["modelValue"]),x=Object.entries(N).reduce((E,[L,j])=>{const Y=unref(j);return Y!==void 0&&(E[L]=Y),E},{});return fe(fe({},a),bn(fe(fe({},r),x)))}),s=computed({get:()=>e.modelValue,set:d=>t("update:modelValue",d)}),i=ref(),f=reactive(tn(e.target||i,s,l));return o(f),()=>{var d;return h$1(e.tag||"div",{ref:i},(d=n==null?void 0:n.default)==null?void 0:d.call(n,f))}}}),_hoisted_1$a=["innerHTML"],_hoisted_2$9={class:"flex items-start gap-2"},_hoisted_3$9=["src"],_hoisted_4$9=["innerHTML"],_hoisted_5$9={class:"w-8 h-8 rounded-full bg-sky-100 text-sky-600 font-bold flex items-center justify-center"},_hoisted_6$9=["innerHTML"],_hoisted_7$8={key:0,class:"mt-5 p-4 text-sm text-gray-600 border-t border-gray-200"},_hoisted_8$8=["innerHTML"],_sfc_main$b=defineComponent({__name:"Ordering",props:{question:{},modelValue:{},examStore:{}},setup(e){const n=e,{testMode:t,answers:o}=n.examStore,r=Array.isArray(n.question.correct_answer)?n.question.correct_answer:(n.question.correct_answer||"").split(","),a=ref(Object.entries(n.question.options).map(([d,k])=>({id:d,choice:k.choice})));watch(a,d=>{t.value==="exam"&&(o[n.question.id]=d.map(k=>k.id).join(","))},{deep:!0});const l=computed(()=>{const d=o[n.question.id];return d?d.split(","):[]}),s=computed(()=>t.value==="review"?!0:t.value==="tutor"?!!l.value.length:!1),i=(d,k)=>{if(t.value==="exam")return"";const N=r.indexOf(d),x=l.value.indexOf(d);return x===-1?"bg-red-50 border-red-200":x===N?"bg-green-50 border-green-200":"bg-yellow-50 border-yellow-200"},f=ref(null);return onMounted(()=>{const d=document.getElementById("exhibits");d&&(d.innerHTML="",f.value=createApp(_sfc_main$j,{tabs:n.question.tabs}),f.value.mount(d))}),onUnmounted(()=>{f.value&&(f.value.unmount(),f.value=null)}),(d,k)=>(openBlock(),createElementBlock("div",{class:normalizeClass([d.question.tabs&&["nclex","cat"].includes(d.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[d.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:d.question.intro},null,8,_hoisted_1$a)):createCommentVNode("",!0),d.question.tabs&&["nclex","cat"].includes(d.examStore.storeName)?(openBlock(),createBlock(_sfc_main$j,{key:1,tabs:d.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$9,[["nclex","cat"].includes(d.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$9)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:d.question.question},null,8,_hoisted_4$9)]),createVNode(unref(lo),{modelValue:a.value,"onUpdate:modelValue":k[0]||(k[0]=N=>a.value=N),"item-key":"id",disabled:unref(t)!=="exam",class:"space-y-3"},{item:withCtx(({element:N,index:x})=>[createBaseVNode("div",{class:normalizeClass(["p-3 bg-white border rounded-xl shadow-sm flex items-center gap-3 transition-colors",i(N.id,x)])},[createBaseVNode("div",_hoisted_5$9,toDisplayString(String.fromCharCode(65+x)),1),createBaseVNode("div",{class:"flex-1 text-gray-800",innerHTML:N.choice},null,8,_hoisted_6$9)],2)]),_:1},8,["modelValue","disabled"]),s.value?(openBlock(),createElementBlock("div",_hoisted_7$8,[k[1]||(k[1]=createBaseVNode("div",{class:"font-semibold mb-2"},"Explanation:",-1)),createBaseVNode("div",{innerHTML:d.question.solution},null,8,_hoisted_8$8)])):createCommentVNode("",!0)],2))}}),_hoisted_1$9=["innerHTML"],_hoisted_2$8={class:"rounded-xl bg-gray-50 p-4 md:p-6"},_hoisted_3$8={class:"flex items-start gap-2"},_hoisted_4$8=["src"],_hoisted_5$8=["innerHTML"],_hoisted_6$8={class:"bowtie-board"},_hoisted_7$7={class:"bowtie-layout flex justify-between items-center"},_hoisted_8$7={class:"bow-column"},_hoisted_9$7={class:"slot-title"},_hoisted_10$5={class:"slot-stack"},_hoisted_11$3={class:"bow-column center-column"},_hoisted_12$1={class:"slot-title"},_hoisted_13$1={class:"bow-column"},_hoisted_14={class:"slot-title"},_hoisted_15={class:"slot-stack"},_hoisted_16={class:"mt-5 grid gap-4 md:grid-cols-3"},_hoisted_17={class:"pool-panel"},_hoisted_18={class:"pool-title"},_hoisted_19={class:"pool-panel"},_hoisted_20={class:"pool-title"},_hoisted_21={class:"pool-panel"},_hoisted_22={class:"pool-title"},_hoisted_23={key:0,class:"mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm"},_hoisted_24={class:"space-y-1"},_hoisted_25={key:1,class:"mt-4 p-4 text-center"},_sfc_main$a=defineComponent({__name:"BowTie",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=inject("showSolution",null),l=ref(!1),s=ref(!1),i=ref([]),f=ref([]),d=ref([]),k=ref([]),N=ref({correctId:null,items:[]}),x=ref([]);function E(A,Q){if(A==null)return Q;if(typeof A!="string")return A;try{return JSON.parse(A)}catch{return Q}}function L(A){if(Array.isArray(A))return A.map(Q=>String(Q));if(typeof A=="string"){const Q=E(A,A);return Array.isArray(Q)?Q.map(R=>String(R)):A?[A]:[]}return[]}const j=computed(()=>{var R,Yt;const A=E((Yt=(R=t.question.options)==null?void 0:R.dynamicColumns)==null?void 0:Yt.choice,[]),Q=Array.isArray(A)?A.reduce((on,an)=>({...on,...an}),{}):{};return{actions:Q.column1||"Action to take",potential:Q.column2||"Potential condition",parameters:Q.column3||"Parameter to monitor"}});function Y(A,Q,R,Yt){var sn,Xt;const on=E((Xt=(sn=t.question.options)==null?void 0:sn[A])==null?void 0:Xt.choice,{});return(Array.isArray(on==null?void 0:on[Q])?on[Q]:[]).filter(ln=>(ln==null?void 0:ln.markAs)&&(ln==null?void 0:ln.text)).map(ln=>({id:`${Yt}:${ln.markAs}`,text:ln.text,mark:ln.markAs,group:R}))}function yt(){i.value=Y("finalActionsToTake","actionsToTake","action","action"),f.value=Y("finalPotentialConditionsData","potentialConditions","potential","potential"),d.value=Y("finalParametersToMonitorData","parametersToMonitor","parameter","parameter");const A=E(t.question.correct_answer,{}),Q=L(A.actionsAnswers),R=L(A.potentialAnswers),Yt=L(A.paramerAnswers??A.parameterAnswers);k.value=Array.from({length:Math.max(2,Q.length||2)},(on,an)=>({correctId:Q[an]?`action:${Q[an]}`:null,items:[]})),N.value={correctId:R[0]?`potential:${R[0]}`:null,items:[]},x.value=Array.from({length:Math.max(2,Yt.length||2)},(on,an)=>({correctId:Yt[an]?`parameter:${Yt[an]}`:null,items:[]}))}function T(){return t.modelValue?typeof t.modelValue=="string"?E(t.modelValue,{}):typeof t.modelValue=="object"?t.modelValue:null:null}function ae(){const A=T();if(!A)return;const Q=L(A.actionsAnswers).map(Xt=>`action:${Xt}`),R=L(A.potentialAnswers).map(Xt=>`potential:${Xt}`),Yt=L(A.paramerAnswers??A.parameterAnswers).map(Xt=>`parameter:${Xt}`),on=new Map(i.value.map(Xt=>[Xt.id,Xt])),an=new Map(f.value.map(Xt=>[Xt.id,Xt])),sn=new Map(d.value.map(Xt=>[Xt.id,Xt]));Q.forEach((Xt,ln)=>{k.value[ln]&&on.has(Xt)&&(k.value[ln].items=[on.get(Xt)])}),R[0]&&an.has(R[0])&&(N.value.items=[an.get(R[0])]),Yt.forEach((Xt,ln)=>{x.value[ln]&&sn.has(Xt)&&(x.value[ln].items=[sn.get(Xt)])}),i.value=i.value.filter(Xt=>!Q.includes(Xt.id)),f.value=f.value.filter(Xt=>!R.includes(Xt.id)),d.value=d.value.filter(Xt=>!Yt.includes(Xt.id))}function z(A,Q){A.items=A.items.filter(R=>R.group===Q).slice(0,1)}function ce(A){z(k.value[A],"action")}function v(){z(N.value,"potential")}function m(A){z(x.value[A],"parameter")}function u(A){return A==="action"?k.value:A==="parameter"?x.value:[N.value]}function ne(A){return u(A).map(Q=>Q.correctId).filter(Q=>!!Q)}function gt(A){return u(A).map(Q=>{var R;return((R=Q.items[0])==null?void 0:R.id)||null}).filter(Q=>!!Q)}function w(A,Q){var sn;if(!l.value)return"none";const R=((sn=A.items[0])==null?void 0:sn.id)||null;if(Q==="potential")return!R&&A.correctId?"missed":!R&&!A.correctId?"none":R===A.correctId?"correct":"incorrect";const Yt=ne(Q),on=gt(Q);return R?Yt.includes(R)?"correct":"incorrect":on.filter(Xt=>Yt.includes(Xt)).length<Yt.length?"missed":"none"}function y(A,Q){const R=A==="action"?k.value[Q]:A==="potential"?N.value:x.value[Q];if(!R)return"";switch(w(R,A)){case"correct":return"border-emerald-500 bg-emerald-50";case"incorrect":return"border-rose-500 bg-rose-50";case"missed":return"border-amber-500 bg-amber-50";default:return""}}function U(A,Q){const R=A==="action"?k.value[Q]:A==="potential"?N.value:x.value[Q];if(!R)return"";const Yt=w(R,A);return Yt==="correct"?"border-emerald-400 bg-emerald-100":Yt==="incorrect"?"border-rose-400 bg-rose-100":""}const b=A=>A.replace(/<[^>]*>/g,"").trim(),H=computed(()=>{const A=[...i.value,...f.value,...d.value,...k.value.flatMap(R=>R.items),...N.value.items,...x.value.flatMap(R=>R.items)],Q=new Map;return A.forEach(R=>{Q.has(R.id)||Q.set(R.id,R)}),Array.from(Q.values())});function F(A){if(!A)return"none";const Q=H.value.find(R=>R.id===A);return Q?b(Q.text)||Q.mark||A:A.split(":")[1]||A}const ft=computed(()=>{const A=[];return k.value.forEach((Q,R)=>{A.push({key:`action-${R}`,status:w(Q,"action"),label:`${j.value.actions} ${R+1}: ${_(w(Q,"action"),Q,"action")}`})}),A.push({key:"potential-0",status:w(N.value,"potential"),label:`${j.value.potential}: ${_(w(N.value,"potential"),N.value,"potential")}`}),x.value.forEach((Q,R)=>{A.push({key:`parameter-${R}`,status:w(Q,"parameter"),label:`${j.value.parameters} ${R+1}: ${_(w(Q,"parameter"),Q,"parameter")}`})}),A});function _(A,Q,R){var Yt,on;if(A==="correct")return"Correct";if(A==="incorrect"){const an=b(((Yt=Q.items[0])==null?void 0:Yt.text)||"")||((on=Q.items[0])==null?void 0:on.mark)||"none",sn=R==="potential"?F(Q.correctId):ne(R).map(Xt=>F(Xt)).join(", ");return`Incorrect (selected "${an}", correct is "${sn}")`}return A==="missed"?`Not answered (correct is "${R==="potential"?F(Q.correctId):ne(R).map(sn=>F(sn)).join(", ")}")`:"Not answered"}function $e(A){return A==="correct"?"pi-check-circle text-emerald-600":A==="incorrect"?"pi-times-circle text-rose-600":A==="missed"?"pi-exclamation-triangle text-amber-600":"pi-circle text-gray-400"}function it(A){return A==="correct"?"text-emerald-700 font-semibold":A==="incorrect"?"text-rose-700 font-semibold":A==="missed"?"text-amber-700 font-semibold":"text-gray-500"}function nn(){l.value=!0,s.value=!1,a&&a({flag:!0,value:!0})}watchEffect(()=>{switch(t.question.id,r){case"review":l.value=!0,s.value=!1;break;case"exam":l.value=!1,s.value=!1;break;case"tutor":l.value=!1,s.value=!0;break;default:l.value=!1,s.value=!1}});const cn=computed(()=>{var A;return{actionsAnswers:k.value.map(Q=>{var R;return((R=Q.items[0])==null?void 0:R.mark)||null}),potentialAnswers:[((A=N.value.items[0])==null?void 0:A.mark)||null],paramerAnswers:x.value.map(Q=>{var R;return((R=Q.items[0])==null?void 0:R.mark)||null})}});return watch(()=>[t.question.id,t.question.options,t.question.correct_answer],()=>{yt(),ae()},{immediate:!0,deep:!0}),watch(cn,A=>o("update:modelValue",A),{deep:!0}),onUnmounted(()=>{a&&a({flag:!0,value:!1})}),(A,Q)=>(openBlock(),createElementBlock("div",{class:normalizeClass([A.question.tabs&&["nclex","cat"].includes(A.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[A.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:A.question.intro},null,8,_hoisted_1$9)):createCommentVNode("",!0),A.question.tabs&&["nclex","cat"].includes(A.examStore.storeName)?(openBlock(),createBlock(_sfc_main$j,{key:1,tabs:A.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$8,[createBaseVNode("div",_hoisted_3$8,[["nclex","cat"].includes(A.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_4$8)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:A.question.question},null,8,_hoisted_5$8)]),createBaseVNode("div",_hoisted_6$8,[Q[4]||(Q[4]=createStaticVNode('<svg class="bowtie-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" data-v-95e60f00><defs data-v-95e60f00><marker id="bowtieDot" markerWidth="4" markerHeight="4" refX="2" refY="2" data-v-95e60f00><circle cx="2" cy="2" r="1.6" fill="#94a3b8" data-v-95e60f00></circle></marker></defs><path d="M 22 28 C 35 28, 42 40, 50 50" data-v-95e60f00></path><path d="M 22 72 C 35 72, 42 60, 50 50" data-v-95e60f00></path><path d="M 50 50 C 58 40, 65 28, 78 28" data-v-95e60f00></path><path d="M 50 50 C 58 60, 65 72, 78 72" data-v-95e60f00></path><circle cx="50" cy="50" r="1.8" class="center-dot" data-v-95e60f00></circle><circle cx="22" cy="28" r="1.4" class="edge-dot" data-v-95e60f00></circle><circle cx="22" cy="72" r="1.4" class="edge-dot" data-v-95e60f00></circle><circle cx="78" cy="28" r="1.4" class="edge-dot" data-v-95e60f00></circle><circle cx="78" cy="72" r="1.4" class="edge-dot" data-v-95e60f00></circle></svg>',1)),createBaseVNode("div",_hoisted_7$7,[createBaseVNode("div",_hoisted_8$7,[createBaseVNode("h4",_hoisted_9$7,toDisplayString(j.value.actions),1),createBaseVNode("div",_hoisted_10$5,[(openBlock(!0),createElementBlock(Fragment,null,renderList(k.value,(R,Yt)=>(openBlock(),createElementBlock("div",{key:"a-"+Yt,class:"slot-wrap"},[createVNode(unref(lo),{modelValue:R.items,"onUpdate:modelValue":on=>R.items=on,group:"bow-action","item-key":"id",onAdd:on=>ce(Yt),disabled:unref(r)==="review",class:normalizeClass(["slot-box action-slot",y("action",Yt)])},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(R.items,on=>(openBlock(),createElementBlock("div",{key:on.id,class:normalizeClass(["drag-item",U("action",Yt)])},toDisplayString(on.text),3))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onAdd","disabled","class"])]))),128))])]),createBaseVNode("div",_hoisted_11$3,[createBaseVNode("h4",_hoisted_12$1,toDisplayString(j.value.potential),1),createVNode(unref(lo),{modelValue:N.value.items,"onUpdate:modelValue":Q[0]||(Q[0]=R=>N.value.items=R),group:"bow-potential","item-key":"id",onAdd:v,disabled:unref(r)==="review",class:normalizeClass(["hazard-box min-w-[150px]",y("potential",0)])},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(N.value.items,R=>(openBlock(),createElementBlock("div",{key:R.id,class:normalizeClass(["drag-item",U("potential",0)])},toDisplayString(R.text),3))),128))]),_:1},8,["modelValue","disabled","class"])]),createBaseVNode("div",_hoisted_13$1,[createBaseVNode("h4",_hoisted_14,toDisplayString(j.value.parameters),1),createBaseVNode("div",_hoisted_15,[(openBlock(!0),createElementBlock(Fragment,null,renderList(x.value,(R,Yt)=>(openBlock(),createElementBlock("div",{key:"p-"+Yt,class:"slot-wrap"},[createVNode(unref(lo),{modelValue:R.items,"onUpdate:modelValue":on=>R.items=on,group:"bow-parameter","item-key":"id",onAdd:on=>m(Yt),disabled:unref(r)==="review",class:normalizeClass(["slot-box parameter-slot",y("parameter",Yt)])},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(R.items,on=>(openBlock(),createElementBlock("div",{key:on.id,class:normalizeClass(["drag-item",U("parameter",Yt)])},toDisplayString(on.text),3))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onAdd","disabled","class"])]))),128))])])])]),createBaseVNode("div",_hoisted_16,[createBaseVNode("section",_hoisted_17,[createBaseVNode("h5",_hoisted_18,toDisplayString(j.value.actions),1),createVNode(unref(lo),{modelValue:i.value,"onUpdate:modelValue":Q[1]||(Q[1]=R=>i.value=R),group:"bow-action","item-key":"id",disabled:unref(r)==="review",class:"pool-box min-h-[84px]"},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(i.value,R=>(openBlock(),createElementBlock("div",{key:R.id,class:"pool-item"},toDisplayString(R.text),1))),128))]),_:1},8,["modelValue","disabled"])]),createBaseVNode("section",_hoisted_19,[createBaseVNode("h5",_hoisted_20,toDisplayString(j.value.potential),1),createVNode(unref(lo),{modelValue:f.value,"onUpdate:modelValue":Q[2]||(Q[2]=R=>f.value=R),group:"bow-potential","item-key":"id",disabled:unref(r)==="review",class:"pool-box min-h-[84px]"},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(f.value,R=>(openBlock(),createElementBlock("div",{key:R.id,class:"pool-item"},toDisplayString(R.text),1))),128))]),_:1},8,["modelValue","disabled"])]),createBaseVNode("section",_hoisted_21,[createBaseVNode("h5",_hoisted_22,toDisplayString(j.value.parameters),1),createVNode(unref(lo),{modelValue:d.value,"onUpdate:modelValue":Q[3]||(Q[3]=R=>d.value=R),group:"bow-parameter","item-key":"id",disabled:unref(r)==="review",class:"pool-box min-h-[84px]"},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(d.value,R=>(openBlock(),createElementBlock("div",{key:R.id,class:"pool-item"},toDisplayString(R.text),1))),128))]),_:1},8,["modelValue","disabled"])])]),l.value?(openBlock(),createElementBlock("div",_hoisted_23,[Q[5]||(Q[5]=createBaseVNode("h5",{class:"font-semibold text-slate-700 mb-2"},"Feedback",-1)),createBaseVNode("div",_hoisted_24,[(openBlock(!0),createElementBlock(Fragment,null,renderList(ft.value,R=>(openBlock(),createElementBlock("div",{key:R.key,class:"flex items-center gap-2"},[createBaseVNode("i",{class:normalizeClass(`pi ${$e(R.status)}`)},null,2),createBaseVNode("span",{class:normalizeClass(it(R.status))},toDisplayString(R.label),3)]))),128))])])):createCommentVNode("",!0),s.value?(openBlock(),createElementBlock("div",_hoisted_25,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer",onClick:nn}," Submit ")])):createCommentVNode("",!0)])],2))}}),BowTie=_export_sfc(_sfc_main$a,[["__scopeId","data-v-95e60f00"]]),_hoisted_1$8=["innerHTML"],_hoisted_2$7={class:"flex items-start gap-2"},_hoisted_3$7=["src"],_hoisted_4$7=["innerHTML"],_hoisted_5$7={class:"matrix-table border border-gray-200 w-full"},_hoisted_6$7={class:"bg-gray-100"},_hoisted_7$6=["innerHTML"],_hoisted_8$6={class:"p-2"},_hoisted_9$6=["checked","disabled","onChange"],_hoisted_10$4={key:0,class:"mt-4 text-center"},_sfc_main$9=defineComponent({__name:"MTX",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","submitted","update:showSolution"],setup(e,{emit:n}){const t=e,o=n,{testMode:r,answers:a,results:l}=t.examStore,s=computed(()=>{if(Array.isArray(t.question.correct_answer))return t.question.correct_answer;try{return JSON.parse(t.question.correct_answer||"{}")}catch{return{}}}),i=t.question.mtx_option||"{}",f=JSON.parse(i),d={};Object.keys(s.value).forEach(z=>{const ce=s.value[z];(Array.isArray(ce.answers)?ce.answers:[]).forEach(m=>{var u;d[m]||(d[m]=((u=f[m])==null?void 0:u.option)||`Category ${m}`)})});const k=reactive({});Object.keys(d).forEach(z=>{k[z]={answers:[]}});function N(z,ce){var v;return(v=k[ce])==null?void 0:v.answers.includes(z)}function x(z,ce){const v=k[ce].answers,m=v.indexOf(z);m>-1?v.splice(m,1):v.push(z),o("update:modelValue",E())}function E(){const z=toRaw(k);try{if(typeof structuredClone=="function")return structuredClone(z)}catch{}return JSON.parse(JSON.stringify(z))}function L(z,ce){var v,m;return(m=(v=s.value[z])==null?void 0:v.answers)==null?void 0:m.includes(ce)}function j(z,ce){if(!Y.value)return"";const v=L(z,ce),m=N(z,ce);return v&&m?"accent-teal-500":!v&&m?"accent-rose-600":v&&!m?"ring-2 ring-teal-500":""}const Y=ref(!1),yt=ref(!1);watchEffect(()=>{switch(r){case"review":Y.value=!0,yt.value=!1;break;case"exam":Y.value=!1,yt.value=!1;break;case"tutor":Y.value=!1,yt.value=!0;break;default:Y.value=!1,yt.value=!1}});const T=inject("showSolution");function ae(){Y.value=!0,T({flag:!0,value:!0}),yt.value=!1}return onUnmounted(()=>{T&&T({flag:!0,value:!1})}),(z,ce)=>(openBlock(),createElementBlock("div",{class:normalizeClass([z.question.tabs&&["nclex","cat"].includes(z.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[z.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:z.question.intro},null,8,_hoisted_1$8)):createCommentVNode("",!0),z.question.tabs&&["nclex","cat"].includes(z.examStore.storeName)?(openBlock(),createBlock(_sfc_main$j,{key:1,tabs:z.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$7,[["nclex","cat"].includes(z.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$7)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:z.question.question},null,8,_hoisted_4$7)]),createBaseVNode("table",_hoisted_5$7,[createBaseVNode("thead",_hoisted_6$7,[createBaseVNode("tr",null,[createBaseVNode("th",{class:"p-2 text-left",innerHTML:z.question.table_header},null,8,_hoisted_7$6),(openBlock(),createElementBlock(Fragment,null,renderList(d,(v,m)=>createBaseVNode("th",{key:m,class:"p-2 text-center"},toDisplayString(v),1)),64))])]),createBaseVNode("tbody",null,[(openBlock(!0),createElementBlock(Fragment,null,renderList(z.question.options,(v,m)=>(openBlock(),createElementBlock("tr",{key:m,class:"hover:bg-gray-50"},[createBaseVNode("td",_hoisted_8$6,toDisplayString(v.choice.choice),1),(openBlock(),createElementBlock(Fragment,null,renderList(d,(u,ne)=>createBaseVNode("td",{key:ne,class:"p-2 text-center"},[createBaseVNode("input",{type:"checkbox",checked:N(String(m),String(ne)),disabled:unref(r)==="review",onChange:gt=>x(String(m),String(ne)),class:normalizeClass(j(String(m),String(ne)))},null,42,_hoisted_9$6)])),64))]))),128))])]),yt.value?(openBlock(),createElementBlock("div",_hoisted_10$4,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer",onClick:ae}," Submit ")])):createCommentVNode("",!0),renderSlot(z.$slots,"solution")])],2))}}),_hoisted_1$7=["innerHTML"],_hoisted_2$6=["innerHTML"],_hoisted_3$6={class:"grouping-table border border-gray-200 w-full mt-2"},_hoisted_4$6={class:"bg-gray-100"},_hoisted_5$6=["innerHTML"],_hoisted_6$6={class:"p-2"},_hoisted_7$5=["name","value","checked","disabled","onChange"],_hoisted_8$5={key:0,class:"text-red-600 mt-2"},_hoisted_9$5={key:1,class:"mt-4 text-center"},_sfc_main$8=defineComponent({__name:"MMC",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","submitted"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=computed(()=>{if(!t.question.correct_answer)return{};if(typeof t.question.correct_answer=="string")try{return JSON.parse(t.question.correct_answer)}catch{return{}}return t.question.correct_answer}),l=t.question.mtx_option||"{}";let s={};try{s=JSON.parse(l)}catch{s={}}const i={};Object.keys(a.value).forEach(T=>{var ce;const ae=(ce=a.value)==null?void 0:ce[T];(Array.isArray(ae==null?void 0:ae.answers)?ae.answers:[]).forEach(v=>{var m;i[v]||(i[v]=((m=s[v])==null?void 0:m.option)||`Category ${v}`)})}),Object.keys(i).length||Object.keys(s||{}).forEach(T=>{var ae;i[T]=((ae=s[T])==null?void 0:ae.option)||`Category ${T}`});const f=reactive({});Object.keys(t.question.options).forEach(T=>f[T]=null),t.modelValue&&Object.assign(f,t.modelValue);function d(T,ae){f[T]=ae,o("update:modelValue",Y())}const k=ref(""),N=ref(!1),x=ref(!1);function E(T,ae){var z,ce,v;return(v=(ce=(z=a.value)==null?void 0:z[T])==null?void 0:ce.answers)==null?void 0:v.includes(ae)}function L(T,ae){if(!N.value)return"";const z=E(T,ae),ce=f[T]===ae;return z&&ce?"accent-teal-500":!z&&ce?"accent-rose-600":z&&!ce?"ring-2 ring-teal-500":""}const j=inject("showSolution");function Y(){const T=toRaw(f);try{if(typeof structuredClone=="function")return structuredClone(T)}catch{}return JSON.parse(JSON.stringify(T))}function yt(){N.value=!0,x.value=!1,j&&j({flag:!0,value:!0}),o("submitted",{answer:Y()})}return watchEffect(()=>{switch(r){case"review":N.value=!0,x.value=!1;break;case"exam":N.value=!1,x.value=!1;break;case"tutor":N.value=!1,x.value=!0;break;default:N.value=!1,x.value=!1}}),onUnmounted(()=>{j&&j({flag:!0,value:!1})}),(T,ae)=>(openBlock(),createElementBlock("div",{class:normalizeClass([T.question.tabs&&["nclex","cat"].includes(T.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[T.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:T.question.intro},null,8,_hoisted_1$7)):createCommentVNode("",!0),T.question.tabs&&["nclex","cat"].includes(T.examStore.storeName)?(openBlock(),createBlock(_sfc_main$j,{key:1,tabs:T.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",{innerHTML:T.question.question,class:"question-text"},null,8,_hoisted_2$6),createBaseVNode("table",_hoisted_3$6,[createBaseVNode("thead",_hoisted_4$6,[createBaseVNode("tr",null,[createBaseVNode("th",{class:"p-2 text-left",innerHTML:T.question.table_header},null,8,_hoisted_5$6),(openBlock(),createElementBlock(Fragment,null,renderList(i,(z,ce)=>createBaseVNode("th",{key:ce,class:"p-2 text-center"},toDisplayString(z),1)),64))])]),createBaseVNode("tbody",null,[(openBlock(!0),createElementBlock(Fragment,null,renderList(T.question.options,(z,ce)=>(openBlock(),createElementBlock("tr",{key:ce,class:"hover:bg-gray-50"},[createBaseVNode("td",_hoisted_6$6,toDisplayString(z.choice.choice),1),(openBlock(),createElementBlock(Fragment,null,renderList(i,(v,m)=>createBaseVNode("td",{key:m,class:"p-2 text-center"},[createBaseVNode("input",{type:"radio",name:String(ce),value:String(m),checked:f[String(ce)]===String(m),disabled:unref(r)==="review",class:normalizeClass(L(String(ce),String(m))),onChange:u=>d(String(ce),String(m))},null,42,_hoisted_7$5)])),64))]))),128))])]),k.value?(openBlock(),createElementBlock("div",_hoisted_8$5,toDisplayString(k.value),1)):createCommentVNode("",!0),x.value?(openBlock(),createElementBlock("div",_hoisted_9$5,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer",onClick:yt}," Submit ")])):createCommentVNode("",!0),renderSlot(T.$slots,"solution")])],2))}}),_hoisted_1$6=["innerHTML"],_hoisted_2$5={class:"rounded-xl bg-gray-50 p-4 md:p-6"},_hoisted_3$5={class:"flex items-start gap-2"},_hoisted_4$5=["src"],_hoisted_5$5=["innerHTML"],_hoisted_6$5={class:"mb-4"},_hoisted_7$4={key:0,class:"placeholder"},_hoisted_8$4={class:"mt-4 rounded-xl border border-gray-200 bg-white p-3"},_hoisted_9$4={key:0,class:"mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm"},_hoisted_10$3={class:"flex items-center gap-2"},_hoisted_11$2={key:1,class:"mt-4 text-center"},_hoisted_12=["disabled"],_hoisted_13=["innerHTML"],_sfc_main$7=defineComponent({__name:"DDC",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=inject("showSolution",null),l=ref(!1),s=ref(!1);function i(v,m){if(v==null)return m;if(typeof v!="string")return v;try{return JSON.parse(v)}catch{return m}}const f=ref([]),d=ref({correctId:null,items:[]});function k(){var ne;f.value=[];const v=t.question.options||[];f.value=v.filter(gt=>{var w,y;return((w=gt==null?void 0:gt.choice)==null?void 0:w.text)&&((y=gt==null?void 0:gt.choice)==null?void 0:y.markKey)}).map(gt=>({id:gt.choice.id||`opt-${gt.choice.markKey}`,text:gt.choice.text,mark:gt.choice.markKey,group:"ddc"}));const m=i(t.question.correct_answer,[]),u=((ne=m==null?void 0:m[0])==null?void 0:ne.answer)??null;d.value={correctId:u?`opt-${u}`:null,items:[]}}function N(){return t.modelValue?typeof t.modelValue=="string"?i(t.modelValue,{}):typeof t.modelValue=="object"?t.modelValue:null:null}function x(){const v=N();if(!(v!=null&&v.answer))return;const m=`opt-${v.answer}`,u=f.value.find(ne=>`opt-${ne.mark}`===m);u&&(d.value.items=[u],f.value=f.value.filter(ne=>ne.id!==u.id))}function E(){d.value.items=d.value.items.slice(0,1)}const L=computed(()=>{var v;return{answer:((v=d.value.items[0])==null?void 0:v.mark)||null}}),j=computed(()=>{var m;if(!l.value)return"none";const v=((m=d.value.items[0])==null?void 0:m.id)||null;return!v&&d.value.correctId?"missed":!v&&!d.value.correctId?"none":v===d.value.correctId?"correct":"incorrect"}),Y=computed(()=>j.value==="correct"?"border-emerald-500 bg-emerald-50":j.value==="incorrect"?"border-rose-500 bg-rose-50":j.value==="missed"?"border-amber-500 bg-amber-50":""),yt=computed(()=>j.value==="correct"?"border-emerald-400 bg-emerald-100":j.value==="incorrect"?"border-rose-400 bg-rose-100":""),T=computed(()=>{var v,m,u;if(j.value==="correct")return"Correct";if(j.value==="incorrect"){const ne=((v=d.value.items[0])==null?void 0:v.mark)||"none",gt=((m=d.value.correctId)==null?void 0:m.replace("opt-",""))||"none";return`Incorrect (selected "${ne}", correct is "${gt}")`}return j.value==="missed"?`Not answered (correct is "${((u=d.value.correctId)==null?void 0:u.replace("opt-",""))||"none"}")`:"Not answered"}),ae=computed(()=>j.value==="correct"?"pi-check-circle text-emerald-600":j.value==="incorrect"?"pi-times-circle text-rose-600":j.value==="missed"?"pi-exclamation-triangle text-amber-600":"pi-circle text-gray-400"),z=computed(()=>j.value==="correct"?"text-emerald-700 font-semibold":j.value==="incorrect"?"text-rose-700 font-semibold":j.value==="missed"?"text-amber-700 font-semibold":"text-gray-500");function ce(){d.value.items.length&&(l.value=!0,s.value=!1,a&&a({flag:!0,value:!0}))}return watchEffect(()=>{switch(t.question.id,r){case"review":l.value=!0,s.value=!1;break;case"exam":l.value=!1,s.value=!1;break;case"tutor":l.value=!1,s.value=!0;break;default:l.value=!1,s.value=!1}}),watch(()=>[t.question.id,t.question.options,t.question.correct_answer],()=>{k(),x()},{immediate:!0,deep:!0}),watch(L,v=>o("update:modelValue",v),{deep:!0}),onUnmounted(()=>{a&&a({flag:!0,value:!1})}),(v,m)=>(openBlock(),createElementBlock("div",{class:normalizeClass([v.question.tabs&&["nclex","cat"].includes(v.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[v.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:v.question.intro},null,8,_hoisted_1$6)):createCommentVNode("",!0),v.question.tabs&&["nclex","cat"].includes(v.examStore.storeName)?(openBlock(),createBlock(_sfc_main$j,{key:1,tabs:v.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$5,[createBaseVNode("div",_hoisted_3$5,[["nclex","cat"].includes(v.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_4$5)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:v.question.question},null,8,_hoisted_5$5)]),createBaseVNode("div",_hoisted_6$5,[m[2]||(m[2]=createBaseVNode("h4",{class:"mb-2 text-sm font-semibold text-gray-700"},"Select priority finding",-1)),createVNode(unref(lo),{modelValue:d.value.items,"onUpdate:modelValue":m[0]||(m[0]=u=>d.value.items=u),group:"ddc","item-key":"id",onAdd:E,disabled:unref(r)==="review",class:normalizeClass(["slot-box min-h-[56px] bg-gray-100",Y.value])},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(d.value.items,u=>(openBlock(),createElementBlock("div",{key:u.id,class:normalizeClass(["drag-item",yt.value])},toDisplayString(u.text),3))),128)),d.value.items.length?createCommentVNode("",!0):(openBlock(),createElementBlock("span",_hoisted_7$4,"Drop answer here"))]),_:1},8,["modelValue","disabled","class"])]),createBaseVNode("div",_hoisted_8$4,[createVNode(unref(lo),{modelValue:f.value,"onUpdate:modelValue":m[1]||(m[1]=u=>f.value=u),group:"ddc","item-key":"id",disabled:unref(r)==="review",class:"pool-box min-h-[80px]"},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(f.value,u=>(openBlock(),createElementBlock("div",{key:u.id,class:"pool-item"},toDisplayString(u.text),1))),128))]),_:1},8,["modelValue","disabled"])]),l.value?(openBlock(),createElementBlock("div",_hoisted_9$4,[createBaseVNode("div",_hoisted_10$3,[createBaseVNode("i",{class:normalizeClass(`pi ${ae.value}`)},null,2),createBaseVNode("span",{class:normalizeClass(z.value)},toDisplayString(T.value),3)])])):createCommentVNode("",!0),s.value?(openBlock(),createElementBlock("div",_hoisted_11$2,[createBaseVNode("button",{class:normalizeClass(["px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer",d.value.items.length?"":"opacity-50 cursor-not-allowed"]),disabled:!d.value.items.length,onClick:ce}," Submit ",10,_hoisted_12)])):createCommentVNode("",!0),l.value&&v.question.solution?(openBlock(),createElementBlock("div",{key:2,class:"mt-4 p-3 rounded bg-teal-50 text-sm prose",innerHTML:v.question.solution},null,8,_hoisted_13)):createCommentVNode("",!0)])],2))}}),DDC=_export_sfc(_sfc_main$7,[["__scopeId","data-v-4af1fa0c"]]),_hoisted_1$5=["innerHTML"],_hoisted_2$4={class:"rounded-xl bg-gray-50 p-4 md:p-6"},_hoisted_3$4={class:"flex items-start gap-2"},_hoisted_4$4=["src"],_hoisted_5$4=["innerHTML"],_hoisted_6$4={key:0,class:"mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm"},_hoisted_7$3={class:"space-y-1"},_hoisted_8$3={key:1,class:"mt-4 text-center"},_hoisted_9$3=["disabled"],_hoisted_10$2={key:0,class:"mt-2 text-xs text-gray-500"},_sfc_main$6=defineComponent({__name:"DRDCLOZE",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=ref(null),l=ref({}),s=ref(!1);function i(w,y){if(w==null)return y;if(typeof w!="string")return w;try{return JSON.parse(w)}catch{return y}}function f(){var w;l.value={},(w=t.question.options)==null||w.forEach(y=>{l.value[y.choice.id]=null})}const d=computed(()=>(t.question.options||[]).map(w=>{var y;return String(((y=w==null?void 0:w.choice)==null?void 0:y.id)||"")}).filter(Boolean));function k(w){return w.replace(/<[^>]*>/g,"").trim()}function N(){const w={},y=t.question.correct_answer,U=i(y,y);return Array.isArray(U)?(U.forEach((b,H)=>{if(b&&typeof b=="object"){const _=String(b.id??b.choice_id??d.value[H]??""),$e=String(b.answer??b.value??"").trim();_&&$e&&(w[_]=$e);return}const F=d.value[H],ft=String(b??"").trim();F&&ft&&(w[F]=ft)}),w):(U&&typeof U=="object"&&Object.entries(U).forEach(([b,H])=>{if(H&&typeof H=="object"){const ft=String(H.id??b??""),_=String(H.answer??H.value??"").trim();ft&&_&&(w[ft]=_);return}const F=String(H??"").trim();b&&F&&(w[String(b)]=F)}),w)}const x=computed(()=>N());function E(w,y){var H,F;if(!y)return"none";const U=(t.question.options||[]).find(ft=>{var _;return String((_=ft==null?void 0:ft.choice)==null?void 0:_.id)===w}),b=(F=(H=U==null?void 0:U.choice)==null?void 0:H.options)==null?void 0:F[y];return b&&k(String(b))||y}function L(w){const y=l.value[w],U=x.value[w];return!y&&U?"missed":!y&&!U?"none":y===U?"correct":"incorrect"}const j=computed(()=>r==="review"?!0:r==="tutor"?s.value:!1),Y=computed(()=>d.value.map((w,y)=>{const U=L(w),b=E(w,l.value[w]),H=E(w,x.value[w]);let F=`Blank ${y+1}: Not answered`;return U==="correct"?F=`Blank ${y+1}: Correct`:U==="incorrect"?F=`Blank ${y+1}: Incorrect (selected "${b}", correct is "${H}")`:U==="missed"&&(F=`Blank ${y+1}: Not answered (correct is "${H}")`),{id:w,status:U,label:F}}));function yt(){if(!t.modelValue)return;let w=t.modelValue;typeof w=="string"&&(w=i(w,{})),Object.keys(w||{}).forEach(y=>{y in l.value&&(l.value[y]=w[y])})}async function T(){var y;if(await nextTick(),!a.value)return;const w=a.value;(y=t.question.options)==null||y.forEach(U=>{const b=U.choice.id,H=w.querySelector(`#${b}`);if(!H)return;const F=document.createElement("select");F.className="inline-block border border-gray-300 p-1 rounded mx-1 text-sm align-middle",F.disabled=r==="review"||r==="tutor"&&s.value;const ft=document.createElement("option");ft.value="",ft.textContent="-- Select --",ft.disabled=!0,ft.selected=!l.value[b],F.appendChild(ft),Object.entries(U.choice.options).forEach(([_,$e])=>{const it=document.createElement("option");it.value=_,it.textContent=$e,l.value[b]===_&&(it.selected=!0),F.appendChild(it)}),F.addEventListener("change",_=>{l.value[b]=_.target.value,z()}),H.replaceWith(F)})}function ae(){if(!a.value)return;const w=r==="review"||r==="tutor"&&s.value;a.value.querySelectorAll("select").forEach(y=>{y.disabled=w})}function z(){a.value&&a.value.querySelectorAll("select").forEach(w=>{const y=w,U=y.name,b=L(U),H=x.value[U],F=l.value[U],ft="inline-block border p-1 rounded mx-1 text-sm align-middle";if(y.style.opacity="1",y.style.fontWeight="500",y.style.color="#111827",y.style.backgroundColor="#ffffff",y.style.borderColor="#d1d5db",y.style.webkitTextFillColor="#111827",Array.from(y.options).forEach((_,$e)=>{const it=_;it.style.fontWeight="400",it.style.color="#111827",it.style.backgroundColor="#ffffff",$e===0&&(it.style.color="#6b7280"),j.value&&it.value&&(H&&it.value===H&&(it.style.color="#047857",it.style.backgroundColor="#ecfdf5",it.style.fontWeight="600"),F&&it.value===F&&F!==H&&(it.style.color="#be123c",it.style.backgroundColor="#fff1f2",it.style.fontWeight="600"))}),!j.value){y.className=`${ft} border-gray-300`;return}if(b==="correct"){y.className=`${ft} border-emerald-500 bg-emerald-50 text-emerald-800`,y.style.color="#047857",y.style.backgroundColor="#ecfdf5",y.style.borderColor="#10b981",y.style.webkitTextFillColor="#047857";return}if(b==="incorrect"){y.className=`${ft} border-rose-500 bg-rose-50 text-rose-800`,y.style.color="#be123c",y.style.backgroundColor="#fff1f2",y.style.borderColor="#f43f5e",y.style.webkitTextFillColor="#be123c";return}if(b==="missed"){y.className=`${ft} border-amber-500 bg-amber-50 text-amber-800`,y.style.color="#b45309",y.style.backgroundColor="#fffbeb",y.style.borderColor="#f59e0b",y.style.webkitTextFillColor="#b45309";return}y.className=`${ft} border-gray-300`})}computed(()=>l.value);const ce=computed(()=>{const w=Object.values(l.value||{});return w.length?w.every(y=>!!y):!1}),v=computed(()=>r==="tutor"&&!s.value),m=inject("showSolution",null);function u(){ce.value&&(s.value=!0,ae(),z(),m&&m({flag:!0,value:!0}))}watch(()=>[t.question.id,t.question.options],async()=>{s.value=!1,f(),yt(),await T(),ae(),z()},{immediate:!0,deep:!0}),watch(l,w=>o("update:modelValue",w),{deep:!0}),watchEffect(()=>{r!=="tutor"&&(s.value=!1),ae(),z()}),watch(()=>[l.value,j.value],()=>z(),{deep:!0});function ne(w){return w==="correct"?"pi-check-circle text-emerald-600":w==="incorrect"?"pi-times-circle text-rose-600":w==="missed"?"pi-exclamation-triangle text-amber-600":"pi-circle text-gray-400"}function gt(w){return w==="correct"?"text-emerald-700 font-semibold":w==="incorrect"?"text-rose-700 font-semibold":w==="missed"?"text-amber-700 font-semibold":"text-gray-500"}return onUnmounted(()=>{m&&m({flag:!0,value:!1})}),(w,y)=>(openBlock(),createElementBlock("div",{class:normalizeClass([w.question.tabs&&["nclex","cat"].includes(w.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[w.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:w.question.intro},null,8,_hoisted_1$5)):createCommentVNode("",!0),w.question.tabs&&["nclex","cat"].includes(w.examStore.storeName)?(openBlock(),createBlock(_sfc_main$j,{key:1,tabs:w.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$4,[createBaseVNode("div",_hoisted_3$4,[["nclex","cat"].includes(w.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_4$4)):createCommentVNode("",!0),createBaseVNode("div",{ref_key:"questionContainer",ref:a,class:"prose max-w-none text-base",innerHTML:w.question.question},null,8,_hoisted_5$4)]),j.value?(openBlock(),createElementBlock("div",_hoisted_6$4,[y[0]||(y[0]=createBaseVNode("h5",{class:"font-semibold text-slate-700 mb-2"},"Feedback",-1)),createBaseVNode("div",_hoisted_7$3,[(openBlock(!0),createElementBlock(Fragment,null,renderList(Y.value,U=>(openBlock(),createElementBlock("div",{key:U.id,class:"flex items-center gap-2"},[createBaseVNode("i",{class:normalizeClass(`pi ${ne(U.status)}`)},null,2),createBaseVNode("span",{class:normalizeClass(gt(U.status))},toDisplayString(U.label),3)]))),128))])])):createCommentVNode("",!0),v.value?(openBlock(),createElementBlock("div",_hoisted_8$3,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer",disabled:!ce.value,onClick:u}," Submit ",8,_hoisted_9$3),ce.value?createCommentVNode("",!0):(openBlock(),createElementBlock("div",_hoisted_10$2," Complete all blanks to submit. "))])):createCommentVNode("",!0),renderSlot(w.$slots,"solution",{},void 0,!0)])],2))}}),DRDCLOZE=_export_sfc(_sfc_main$6,[["__scopeId","data-v-212cc404"]]),_hoisted_1$4=["innerHTML"],_hoisted_2$3={class:"flex items-start gap-2"},_hoisted_3$3=["src"],_hoisted_4$3=["innerHTML"],_hoisted_5$3={class:"text-sm text-gray-500 mb-3 italic"},_hoisted_6$3={key:0},_hoisted_7$2=["value","checked","onChange","disabled"],_hoisted_8$2=["innerHTML"],_hoisted_9$2=["innerHTML"],_hoisted_10$1=["innerHTML"],_hoisted_11$1={key:0,class:"mt-4 p-4 text-center"},_sfc_main$5=defineComponent({__name:"MMN",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","update:showSolution"],setup(e,{emit:n}){const t=e,{testMode:o,answers:r,results:a}=t.examStore,l=n,s=computed({get:()=>t.modelValue,set:T=>l("update:modelValue",T)}),i=computed(()=>t.question.total_points),f=T=>{const ae=[...s.value],z=ae.indexOf(T);if(z!==-1)ae.splice(z,1);else{if(ae.length>=i.value)return;ae.push(T)}s.value=ae},d=T=>o==="review"?!0:s.value.includes(T)?!1:s.value.length>=i.value,k=ref(!1),N=ref(!1),x=computed(()=>{if(Array.isArray(t.question.correct_answer))return t.question.correct_answer;try{return JSON.parse(t.question.correct_answer||"[]")}catch{return[]}});watchEffect(()=>{switch(o){case"review":k.value=!0;break;case"exam":k.value=!1;break;case"tutor":k.value=!1,N.value=!0,t.examStore.answers[t.question.id]&&setTimeout(()=>{k.value=!0,j({flag:!0,value:!0})},x.value.length*1e4);break;default:k.value=!1}});const E=T=>x.value.includes(T),L=T=>{const ae=r[t.question.id]??[];return o==="review"?ae.includes(T)&&!x.value.includes(T):o==="tutor"?ae.includes(T)&&!E(T):!1},j=inject("showSolution"),Y=()=>{k.value=!0,j({flag:!0,value:!0}),N.value=!1},yt=ref(null);return onMounted(()=>{const T=document.getElementById("exhibits");T&&(T.innerHTML="",yt.value=createApp(_sfc_main$j,{tabs:t.question.tabs}),yt.value.mount(T))}),onUnmounted(()=>{j({flag:!0,value:!1}),yt.value&&(yt.value.unmount(),yt.value=null)}),(T,ae)=>(openBlock(),createElementBlock("div",{class:normalizeClass([T.question.tabs&&["nclex","cat"].includes(T.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[T.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:T.question.intro},null,8,_hoisted_1$4)):createCommentVNode("",!0),T.question.tabs&&["nclex","cat"].includes(T.examStore.storeName)?(openBlock(),createBlock(_sfc_main$j,{key:1,tabs:T.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$3,[["nclex","cat"].includes(T.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$3)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:T.question.question},null,8,_hoisted_4$3)]),createBaseVNode("div",_hoisted_5$3,[createTextVNode(" Select "+toDisplayString(i.value)+" option",1),i.value>1?(openBlock(),createElementBlock("span",_hoisted_6$3,"s")):createCommentVNode("",!0),ae[0]||(ae[0]=createTextVNode(". "))]),(openBlock(!0),createElementBlock(Fragment,null,renderList(T.question.options,(z,ce)=>(openBlock(),createElementBlock("div",{key:ce,class:"mb-2 ms-4"},[z.choice!=null&&z.choice!=""&&z.choice!="None"?(openBlock(),createElementBlock("label",{key:0,class:normalizeClass(["flex items-start gap-2",{"text-teal-500 font-semibold":E(String(ce))&&k.value,"text-rose-600 font-semibold":L(String(ce))&&k.value}])},[createBaseVNode("i",{class:normalizeClass(`pi mt-1.5 text-lg ${E(String(ce))&&k.value?"pi-check-circle":L(String(ce))&&k.value?"pi-times-circle":""}`)},null,2),createBaseVNode("input",{type:"checkbox",class:"checkbox checkbox-sm mt-1 cursor-pointer border-gray-600 text-gray-700 dark:text-slate-100 dark:border-white",value:String(ce),checked:s.value.includes(String(ce)),onChange:v=>f(String(ce)),disabled:d(String(ce))},null,40,_hoisted_7$2),createBaseVNode("div",null,[createBaseVNode("span",{innerHTML:ce,class:"font-semibold"},null,8,_hoisted_8$2),ae[1]||(ae[1]=createTextVNode(". ")),createBaseVNode("span",{innerHTML:z.choice},null,8,_hoisted_9$2),k.value&&z.reason?(openBlock(),createElementBlock("div",{key:0,class:normalizeClass({"bg-teal-100 text-teal-800 p-0.5 rounded":E(String(ce)),"bg-rose-100 text-rose-700 p-0.5 rounded":L(String(ce))}),innerHTML:z.reason},null,10,_hoisted_10$1)):createCommentVNode("",!0)])],2)):createCommentVNode("",!0)]))),128)),N.value?(openBlock(),createElementBlock("div",_hoisted_11$1,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer",onClick:Y}," Submit ")])):createCommentVNode("",!0),renderSlot(T.$slots,"solution")])],2))}}),_hoisted_1$3=["innerHTML"],_hoisted_2$2=["innerHTML"],_hoisted_3$2={class:"grouping-table border border-gray-200 w-full mt-2"},_hoisted_4$2={class:"bg-gray-100"},_hoisted_5$2=["innerHTML"],_hoisted_6$2={class:"p-2"},_hoisted_7$1={class:"font-semibold"},_hoisted_8$1=["innerHTML"],_hoisted_9$1=["checked","disabled","onChange"],_hoisted_10={key:2,class:"text-red-600 mt-2"},_hoisted_11={key:3,class:"mt-4 text-center"},_sfc_main$4=defineComponent({__name:"GRPCHCKBOX",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","submitted"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=(_,$e)=>{if(_==null)return $e;if(typeof _!="string")return _;try{return JSON.parse(_)}catch{return $e}},l=_=>_&&typeof _=="object"?_:{},s=_=>_==null?[]:Array.isArray(_)?_.map($e=>String($e).trim()).filter(Boolean):typeof _=="string"?_.split(",").map($e=>$e.trim()).filter(Boolean):[String(_)],i=computed(()=>a(t.question.correct_answer,{})),f=computed(()=>l(t.question.options)),d=computed(()=>Object.keys(f.value)),k=ref(null),N=computed(()=>{var _;return typeof((_=t.question)==null?void 0:_.question)=="string"&&t.question.question.includes('id="exhibits"')}),x=computed(()=>{var _;return!!((_=t.question)!=null&&_.tabs)&&!N.value}),E=computed(()=>{var $e,it,nn;const _=(($e=t.question)==null?void 0:$e.match_options)??((it=t.question)==null?void 0:it.match_option)??((nn=t.question)==null?void 0:nn.mtx_option)??{};return a(_,{})}),L=computed(()=>{const _={};if(Object.keys(E.value||{}).sort().forEach(it=>{const nn=E.value[it];if(typeof nn=="string"){_[it]=nn;return}_[it]=(nn==null?void 0:nn.option)||it}),Object.keys(_).length)return _;const $e=new Set;return Object.keys(i.value||{}).forEach(it=>{var cn,A;const nn=(A=(cn=i.value)==null?void 0:cn[it])==null?void 0:A.answers;s(nn).forEach(Q=>$e.add(Q))}),Array.from($e).sort().forEach(it=>{_[it]=it}),_}),j=reactive({}),Y=_=>{var $e;return typeof _=="string"?_:typeof(_==null?void 0:_.choice)=="string"?_.choice:(($e=_==null?void 0:_.choice)==null?void 0:$e.choice)||""},yt=_=>{var it;const $e=(it=i.value)==null?void 0:it[_];return s($e==null?void 0:$e.answers)},T=()=>{const _={};return d.value.forEach($e=>{const it=j[$e]||[];_[$e]={answers:it.slice().sort().join(",")}}),_},ae=_=>{!_||typeof _!="object"||d.value.forEach($e=>{const it=_==null?void 0:_[$e];if(it!=null){if(typeof it=="object"&&it!==null&&"answers"in it){j[$e]=s(it.answers);return}j[$e]=s(it)}})};watch(()=>{var _,$e,it,nn,cn,A;return[(_=t.question)==null?void 0:_.id,($e=t.question)==null?void 0:$e.options,(it=t.question)==null?void 0:it.correct_answer,(nn=t.question)==null?void 0:nn.match_option,(cn=t.question)==null?void 0:cn.match_options,(A=t.question)==null?void 0:A.mtx_option]},()=>{Object.keys(j).forEach(_=>delete j[_]),d.value.forEach(_=>{j[_]=[]}),ae(t.modelValue)},{immediate:!0,deep:!0}),watch(()=>t.modelValue,_=>{_&&ae(_)},{deep:!0});const ce=()=>{k.value&&(k.value.unmount(),k.value=null)},v=async()=>{var $e;if(ce(),!(($e=t.question)!=null&&$e.tabs)||!N.value)return;await nextTick();const _=document.getElementById("exhibits");_&&(_.innerHTML="",k.value=createApp(_sfc_main$j,{tabs:t.question.tabs}),k.value.mount(_))};watch(()=>{var _,$e,it;return[(_=t.question)==null?void 0:_.id,($e=t.question)==null?void 0:$e.tabs,(it=t.question)==null?void 0:it.question]},()=>{v()},{immediate:!0});const m=ref(""),u=()=>{o("update:modelValue",T())},ne=(_,$e)=>(j[_]||[]).includes($e);function gt(_,$e){m.value="";const it=j[_]||[],nn=it.indexOf($e);nn>-1?it.splice(nn,1):it.push($e),j[_]=it.slice(),u()}const w=ref(!1),y=ref(!1),U=(_,$e)=>yt(_).includes($e),b=(_,$e)=>{if(!w.value)return"";const it=U(_,$e),nn=ne(_,$e);return it&&nn?"accent-teal-500":!it&&nn?"accent-rose-600":it&&!nn?"ring-2 ring-teal-500":""},H=inject("showSolution");function F(){const _=toRaw(T());try{if(typeof structuredClone=="function")return structuredClone(_)}catch{}return JSON.parse(JSON.stringify(_))}function ft(){if(d.value.filter($e=>!(j[$e]||[]).length).length){m.value="Select at least one category for every row before submitting.";return}m.value="",w.value=!0,y.value=!1,H&&H({flag:!0,value:!0}),o("submitted",{answer:F()})}return watchEffect(()=>{switch(r){case"review":w.value=!0,y.value=!1;break;case"exam":w.value=!1,y.value=!1;break;case"tutor":w.value=!1,y.value=!0;break;default:w.value=!1,y.value=!1}}),onUnmounted(()=>{ce(),H&&H({flag:!0,value:!1})}),(_,$e)=>(openBlock(),createElementBlock("div",null,[_.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:_.question.intro},null,8,_hoisted_1$3)):createCommentVNode("",!0),x.value?(openBlock(),createBlock(_sfc_main$j,{key:1,tabs:_.question.tabs},null,8,["tabs"])):createCommentVNode("",!0),createBaseVNode("div",{innerHTML:_.question.question,class:"question-text"},null,8,_hoisted_2$2),createBaseVNode("table",_hoisted_3$2,[createBaseVNode("thead",_hoisted_4$2,[createBaseVNode("tr",null,[createBaseVNode("th",{class:"p-2 text-left",innerHTML:_.question.table_header||"Finding"},null,8,_hoisted_5$2),(openBlock(!0),createElementBlock(Fragment,null,renderList(L.value,(it,nn)=>(openBlock(),createElementBlock("th",{key:nn,class:"p-2 text-center"},toDisplayString(it),1))),128))])]),createBaseVNode("tbody",null,[(openBlock(!0),createElementBlock(Fragment,null,renderList(f.value,(it,nn)=>(openBlock(),createElementBlock("tr",{key:nn,class:"hover:bg-gray-50"},[createBaseVNode("td",_hoisted_6$2,[createBaseVNode("span",_hoisted_7$1,toDisplayString(nn)+".",1),createBaseVNode("span",{innerHTML:Y(it)},null,8,_hoisted_8$1)]),(openBlock(!0),createElementBlock(Fragment,null,renderList(L.value,(cn,A)=>(openBlock(),createElementBlock("td",{key:A,class:"p-2 text-center"},[createBaseVNode("input",{type:"checkbox",checked:ne(String(nn),String(A)),disabled:unref(r)==="review",class:normalizeClass(b(String(nn),String(A))),onChange:Q=>gt(String(nn),String(A))},null,42,_hoisted_9$1)]))),128))]))),128))])]),m.value?(openBlock(),createElementBlock("div",_hoisted_10,toDisplayString(m.value),1)):createCommentVNode("",!0),y.value?(openBlock(),createElementBlock("div",_hoisted_11,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer",onClick:ft}," Submit ")])):createCommentVNode("",!0),renderSlot(_.$slots,"solution")]))}}),_sfc_main$3=defineComponent({__name:"QuestionRenderer",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,r=computed({get:()=>t.modelValue,set:l=>o("update:modelValue",l)}),a=computed(()=>{var l,s;switch((s=(l=t.question)==null?void 0:l.question_type)==null?void 0:s.code){case"MMA":return _sfc_main$i;case"DRD":return _sfc_main$h;case"MSA":return _sfc_main$f;case"FIB":return _sfc_main$g;case"GRP":return _sfc_main$d;case"GRPCHCKBOX":return _sfc_main$4;case"HL":return Highlight;case"ORD":return _sfc_main$b;case"BOW":return BowTie;case"MTX":return _sfc_main$9;case"MMC":return _sfc_main$8;case"DDC":return DDC;case"DRDCLOZE":return DRDCLOZE;case"MMN":return _sfc_main$5;default:return _sfc_main$e}});return(l,s)=>(openBlock(),createBlock(resolveDynamicComponent(a.value),{question:l.question,examStore:l.examStore,modelValue:r.value,"onUpdate:modelValue":s[0]||(s[0]=i=>r.value=i)},createSlots({_:2},[renderList(l.$slots,(i,f)=>({name:f,fn:withCtx(d=>[renderSlot(l.$slots,f,normalizeProps(guardReactiveProps(d)),void 0,!0)])}))]),1032,["question","examStore","modelValue"]))}}),QuestionRenderer=_export_sfc(_sfc_main$3,[["__scopeId","data-v-fa4da289"]]),_hoisted_1$2={id:"calculator_id",class:"modal"},_hoisted_2$1={class:"modal-box bg-transparent shadow-none"},_hoisted_3$1={class:"flex flex-col items-center font-mono"},_hoisted_4$1={class:"p-4 space-y-2 shadow-md w-64 select-none bg-sky-950 rounded-2xl"},_hoisted_5$1={class:"text-lg font-bold text-center"},_hoisted_6$1={class:"grid grid-cols-4 gap-2 mt-2 text-center"},_sfc_main$2=defineComponent({__name:"Calculator",setup(__props){const expression=ref(""),error=ref(!1),result=computed(()=>{try{const safeExpr=expression.value.replace(/[^-()\d/*+.]/g,""),res=eval(safeExpr);return error.value=!1,isNaN(res)?"-":res}catch(e){return error.value=!0,"-"}}),append=e=>{expression.value+=e},calculate=()=>{error.value||(expression.value=result.value.toString())},clear=()=>{expression.value=""},backspace=()=>{expression.value=expression.value.slice(0,-1)};return(e,n)=>(openBlock(),createElementBlock("dialog",_hoisted_1$2,[createBaseVNode("div",_hoisted_2$1,[n[20]||(n[20]=createBaseVNode("form",{method:"dialog"},[createBaseVNode("button",{class:"btn btn-sm btn-circle btn-ghost absolute right-1 top-1"},[createBaseVNode("i",{class:"pi pi-times text-white"})])],-1)),createBaseVNode("div",_hoisted_3$1,[createBaseVNode("div",_hoisted_4$1,[withDirectives(createBaseVNode("input",{"onUpdate:modelValue":n[0]||(n[0]=t=>expression.value=t),type:"text",class:"p-2 border bg-blue-100 text-blue-900 rounded w-full text-right",placeholder:"0",readonly:""},null,512),[[vModelText,expression.value]]),createBaseVNode("p",_hoisted_5$1,toDisplayString(result.value),1),createBaseVNode("div",_hoisted_6$1,[createBaseVNode("button",{class:"btn",onClick:n[1]||(n[1]=t=>append("7"))},"7"),createBaseVNode("button",{class:"btn",onClick:n[2]||(n[2]=t=>append("8"))},"8"),createBaseVNode("button",{class:"btn",onClick:n[3]||(n[3]=t=>append("9"))},"9"),createBaseVNode("button",{class:"btn btn-error",onClick:n[4]||(n[4]=t=>backspace())},n[19]||(n[19]=[createBaseVNode("i",{class:"pi pi-backspace text-white"},"Del",-1)])),createBaseVNode("button",{class:"btn",onClick:n[5]||(n[5]=t=>append("4"))},"4"),createBaseVNode("button",{class:"btn",onClick:n[6]||(n[6]=t=>append("5"))},"5"),createBaseVNode("button",{class:"btn",onClick:n[7]||(n[7]=t=>append("6"))},"6"),createBaseVNode("button",{class:"btn",onClick:n[8]||(n[8]=t=>append("*"))},"×"),createBaseVNode("button",{class:"btn",onClick:n[9]||(n[9]=t=>append("1"))},"1"),createBaseVNode("button",{class:"btn",onClick:n[10]||(n[10]=t=>append("2"))},"2"),createBaseVNode("button",{class:"btn",onClick:n[11]||(n[11]=t=>append("3"))},"3"),createBaseVNode("button",{class:"btn",onClick:n[12]||(n[12]=t=>append("-"))},"−"),createBaseVNode("button",{class:"btn",onClick:n[13]||(n[13]=t=>append("0"))},"0"),createBaseVNode("button",{class:"btn",onClick:n[14]||(n[14]=t=>append("."))},"."),createBaseVNode("button",{class:"btn",onClick:n[15]||(n[15]=t=>append("/"))},"/"),createBaseVNode("button",{class:"btn",onClick:n[16]||(n[16]=t=>append("+"))},"+"),createBaseVNode("button",{class:"btn col-span-2 btn-success",onClick:n[17]||(n[17]=t=>calculate())},"="),createBaseVNode("button",{class:"btn col-span-2 btn-warning",onClick:n[18]||(n[18]=t=>clear())},"C")])])])])]))}});var quillCSS=`
/*!
* Quill Editor v1.3.3
* https://quilljs.com/
* Copyright (c) 2014, Jason Chen
* Copyright (c) 2013, salesforce.com
*/
.ql-container {
    box-sizing: border-box;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 13px;
    height: 100%;
    margin: 0px;
    position: relative;
}
.ql-container.ql-disabled .ql-tooltip {
    visibility: hidden;
}
.ql-container.ql-disabled .ql-editor ul[data-checked] > li::before {
    pointer-events: none;
}
.ql-clipboard {
    left: -100000px;
    height: 1px;
    overflow-y: hidden;
    position: absolute;
    top: 50%;
}
.ql-clipboard p {
    margin: 0;
    padding: 0;
}
.ql-editor {
    box-sizing: border-box;
    line-height: 1.42;
    height: 100%;
    outline: none;
    overflow-y: auto;
    padding: 12px 15px;
    tab-size: 4;
    -moz-tab-size: 4;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
}
.ql-editor > * {
    cursor: text;
}
.ql-editor p,
.ql-editor ol,
.ql-editor ul,
.ql-editor pre,
.ql-editor blockquote,
.ql-editor h1,
.ql-editor h2,
.ql-editor h3,
.ql-editor h4,
.ql-editor h5,
.ql-editor h6 {
    margin: 0;
    padding: 0;
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol,
.ql-editor ul {
    padding-left: 1.5rem;
}
.ql-editor ol > li,
.ql-editor ul > li {
    list-style-type: none;
}
.ql-editor ul > li::before {
    content: '\\2022';
}
.ql-editor ul[data-checked='true'],
.ql-editor ul[data-checked='false'] {
    pointer-events: none;
}
.ql-editor ul[data-checked='true'] > li *,
.ql-editor ul[data-checked='false'] > li * {
    pointer-events: all;
}
.ql-editor ul[data-checked='true'] > li::before,
.ql-editor ul[data-checked='false'] > li::before {
    color: #777;
    cursor: pointer;
    pointer-events: all;
}
.ql-editor ul[data-checked='true'] > li::before {
    content: '\\2611';
}
.ql-editor ul[data-checked='false'] > li::before {
    content: '\\2610';
}
.ql-editor li::before {
    display: inline-block;
    white-space: nowrap;
    width: 1.2rem;
}
.ql-editor li:not(.ql-direction-rtl)::before {
    margin-left: -1.5rem;
    margin-right: 0.3rem;
    text-align: right;
}
.ql-editor li.ql-direction-rtl::before {
    margin-left: 0.3rem;
    margin-right: -1.5rem;
}
.ql-editor ol li:not(.ql-direction-rtl),
.ql-editor ul li:not(.ql-direction-rtl) {
    padding-left: 1.5rem;
}
.ql-editor ol li.ql-direction-rtl,
.ql-editor ul li.ql-direction-rtl {
    padding-right: 1.5rem;
}
.ql-editor ol li {
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    counter-increment: list-0;
}
.ql-editor ol li:before {
    content: counter(list-0, decimal) '. ';
}
.ql-editor ol li.ql-indent-1 {
    counter-increment: list-1;
}
.ql-editor ol li.ql-indent-1:before {
    content: counter(list-1, lower-alpha) '. ';
}
.ql-editor ol li.ql-indent-1 {
    counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-2 {
    counter-increment: list-2;
}
.ql-editor ol li.ql-indent-2:before {
    content: counter(list-2, lower-roman) '. ';
}
.ql-editor ol li.ql-indent-2 {
    counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-3 {
    counter-increment: list-3;
}
.ql-editor ol li.ql-indent-3:before {
    content: counter(list-3, decimal) '. ';
}
.ql-editor ol li.ql-indent-3 {
    counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-4 {
    counter-increment: list-4;
}
.ql-editor ol li.ql-indent-4:before {
    content: counter(list-4, lower-alpha) '. ';
}
.ql-editor ol li.ql-indent-4 {
    counter-reset: list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-5 {
    counter-increment: list-5;
}
.ql-editor ol li.ql-indent-5:before {
    content: counter(list-5, lower-roman) '. ';
}
.ql-editor ol li.ql-indent-5 {
    counter-reset: list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-6 {
    counter-increment: list-6;
}
.ql-editor ol li.ql-indent-6:before {
    content: counter(list-6, decimal) '. ';
}
.ql-editor ol li.ql-indent-6 {
    counter-reset: list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-7 {
    counter-increment: list-7;
}
.ql-editor ol li.ql-indent-7:before {
    content: counter(list-7, lower-alpha) '. ';
}
.ql-editor ol li.ql-indent-7 {
    counter-reset: list-8 list-9;
}
.ql-editor ol li.ql-indent-8 {
    counter-increment: list-8;
}
.ql-editor ol li.ql-indent-8:before {
    content: counter(list-8, lower-roman) '. ';
}
.ql-editor ol li.ql-indent-8 {
    counter-reset: list-9;
}
.ql-editor ol li.ql-indent-9 {
    counter-increment: list-9;
}
.ql-editor ol li.ql-indent-9:before {
    content: counter(list-9, decimal) '. ';
}
.ql-editor .ql-indent-1:not(.ql-direction-rtl) {
    padding-left: 3rem;
}
.ql-editor li.ql-indent-1:not(.ql-direction-rtl) {
    padding-left: 4.5rem;
}
.ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {
    padding-right: 3rem;
}
.ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {
    padding-right: 4.5rem;
}
.ql-editor .ql-indent-2:not(.ql-direction-rtl) {
    padding-left: 6rem;
}
.ql-editor li.ql-indent-2:not(.ql-direction-rtl) {
    padding-left: 7.5rem;
}
.ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {
    padding-right: 6rem;
}
.ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {
    padding-right: 7.5rem;
}
.ql-editor .ql-indent-3:not(.ql-direction-rtl) {
    padding-left: 9rem;
}
.ql-editor li.ql-indent-3:not(.ql-direction-rtl) {
    padding-left: 10.5rem;
}
.ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {
    padding-right: 9rem;
}
.ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {
    padding-right: 10.5rem;
}
.ql-editor .ql-indent-4:not(.ql-direction-rtl) {
    padding-left: 12rem;
}
.ql-editor li.ql-indent-4:not(.ql-direction-rtl) {
    padding-left: 13.5rem;
}
.ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {
    padding-right: 12rem;
}
.ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {
    padding-right: 13.5rem;
}
.ql-editor .ql-indent-5:not(.ql-direction-rtl) {
    padding-left: 15rem;
}
.ql-editor li.ql-indent-5:not(.ql-direction-rtl) {
    padding-left: 16.5rem;
}
.ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {
    padding-right: 15rem;
}
.ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {
    padding-right: 16.5rem;
}
.ql-editor .ql-indent-6:not(.ql-direction-rtl) {
    padding-left: 18rem;
}
.ql-editor li.ql-indent-6:not(.ql-direction-rtl) {
    padding-left: 19.5rem;
}
.ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {
    padding-right: 18rem;
}
.ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {
    padding-right: 19.5rem;
}
.ql-editor .ql-indent-7:not(.ql-direction-rtl) {
    padding-left: 21rem;
}
.ql-editor li.ql-indent-7:not(.ql-direction-rtl) {
    padding-left: 22.5rem;
}
.ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {
    padding-right: 21rem;
}
.ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {
    padding-right: 22.5rem;
}
.ql-editor .ql-indent-8:not(.ql-direction-rtl) {
    padding-left: 24rem;
}
.ql-editor li.ql-indent-8:not(.ql-direction-rtl) {
    padding-left: 25.5rem;
}
.ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {
    padding-right: 24rem;
}
.ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {
    padding-right: 25.5rem;
}
.ql-editor .ql-indent-9:not(.ql-direction-rtl) {
    padding-left: 27rem;
}
.ql-editor li.ql-indent-9:not(.ql-direction-rtl) {
    padding-left: 28.5rem;
}
.ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {
    padding-right: 27rem;
}
.ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {
    padding-right: 28.5rem;
}
.ql-editor .ql-video {
    display: block;
    max-width: 100%;
}
.ql-editor .ql-video.ql-align-center {
    margin: 0 auto;
}
.ql-editor .ql-video.ql-align-right {
    margin: 0 0 0 auto;
}
.ql-editor .ql-bg-black {
    background-color: #000;
}
.ql-editor .ql-bg-red {
    background-color: #e60000;
}
.ql-editor .ql-bg-orange {
    background-color: #f90;
}
.ql-editor .ql-bg-yellow {
    background-color: #ff0;
}
.ql-editor .ql-bg-green {
    background-color: #008a00;
}
.ql-editor .ql-bg-blue {
    background-color: #06c;
}
.ql-editor .ql-bg-purple {
    background-color: #93f;
}
.ql-editor .ql-color-white {
    color: #fff;
}
.ql-editor .ql-color-red {
    color: #e60000;
}
.ql-editor .ql-color-orange {
    color: #f90;
}
.ql-editor .ql-color-yellow {
    color: #ff0;
}
.ql-editor .ql-color-green {
    color: #008a00;
}
.ql-editor .ql-color-blue {
    color: #06c;
}
.ql-editor .ql-color-purple {
    color: #93f;
}
.ql-editor .ql-font-serif {
    font-family: Georgia, Times New Roman, serif;
}
.ql-editor .ql-font-monospace {
    font-family: Monaco, Courier New, monospace;
}
.ql-editor .ql-size-small {
    font-size: 0.75rem;
}
.ql-editor .ql-size-large {
    font-size: 1.5rem;
}
.ql-editor .ql-size-huge {
    font-size: 2.5rem;
}
.ql-editor .ql-direction-rtl {
    direction: rtl;
    text-align: inherit;
}
.ql-editor .ql-align-center {
    text-align: center;
}
.ql-editor .ql-align-justify {
    text-align: justify;
}
.ql-editor .ql-align-right {
    text-align: right;
}
.ql-editor.ql-blank::before {
    color: rgba(0, 0, 0, 0.6);
    content: attr(data-placeholder);
    font-style: italic;
    left: 15px;
    pointer-events: none;
    position: absolute;
    right: 15px;
}
.ql-snow.ql-toolbar:after,
.ql-snow .ql-toolbar:after {
    clear: both;
    content: '';
    display: table;
}
.ql-snow.ql-toolbar button,
.ql-snow .ql-toolbar button {
    background: none;
    border: none;
    cursor: pointer;
    display: inline-block;
    float: left;
    height: 24px;
    padding: 3px 5px;
    width: 28px;
}
.ql-snow.ql-toolbar button svg,
.ql-snow .ql-toolbar button svg {
    float: left;
    height: 100%;
}
.ql-snow.ql-toolbar button:active:hover,
.ql-snow .ql-toolbar button:active:hover {
    outline: none;
}
.ql-snow.ql-toolbar input.ql-image[type='file'],
.ql-snow .ql-toolbar input.ql-image[type='file'] {
    display: none;
}
.ql-snow.ql-toolbar button:hover,
.ql-snow .ql-toolbar button:hover,
.ql-snow.ql-toolbar button:focus,
.ql-snow .ql-toolbar button:focus,
.ql-snow.ql-toolbar button.ql-active,
.ql-snow .ql-toolbar button.ql-active,
.ql-snow.ql-toolbar .ql-picker-label:hover,
.ql-snow .ql-toolbar .ql-picker-label:hover,
.ql-snow.ql-toolbar .ql-picker-label.ql-active,
.ql-snow .ql-toolbar .ql-picker-label.ql-active,
.ql-snow.ql-toolbar .ql-picker-item:hover,
.ql-snow .ql-toolbar .ql-picker-item:hover,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected {
    color: #06c;
}
.ql-snow.ql-toolbar button:hover .ql-fill,
.ql-snow .ql-toolbar button:hover .ql-fill,
.ql-snow.ql-toolbar button:focus .ql-fill,
.ql-snow .ql-toolbar button:focus .ql-fill,
.ql-snow.ql-toolbar button.ql-active .ql-fill,
.ql-snow .ql-toolbar button.ql-active .ql-fill,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
.ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,
.ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill,
.ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill,
.ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,
.ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
    fill: #06c;
}
.ql-snow.ql-toolbar button:hover .ql-stroke,
.ql-snow .ql-toolbar button:hover .ql-stroke,
.ql-snow.ql-toolbar button:focus .ql-stroke,
.ql-snow .ql-toolbar button:focus .ql-stroke,
.ql-snow.ql-toolbar button.ql-active .ql-stroke,
.ql-snow .ql-toolbar button.ql-active .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
.ql-snow.ql-toolbar button:hover .ql-stroke-miter,
.ql-snow .ql-toolbar button:hover .ql-stroke-miter,
.ql-snow.ql-toolbar button:focus .ql-stroke-miter,
.ql-snow .ql-toolbar button:focus .ql-stroke-miter,
.ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
.ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
    stroke: #06c;
}
@media (pointer: coarse) {
    .ql-snow.ql-toolbar button:hover:not(.ql-active),
    .ql-snow .ql-toolbar button:hover:not(.ql-active) {
        color: #444;
    }
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-fill,
    .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-fill,
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill {
        fill: #444;
    }
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke,
    .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke,
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter,
    .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter {
        stroke: #444;
    }
}
.ql-snow {
    box-sizing: border-box;
}
.ql-snow * {
    box-sizing: border-box;
}
.ql-snow .ql-hidden {
    display: none;
}
.ql-snow .ql-out-bottom,
.ql-snow .ql-out-top {
    visibility: hidden;
}
.ql-snow .ql-tooltip {
    position: absolute;
    transform: translateY(10px);
}
.ql-snow .ql-tooltip a {
    cursor: pointer;
    text-decoration: none;
}
.ql-snow .ql-tooltip.ql-flip {
    transform: translateY(-10px);
}
.ql-snow .ql-formats {
    display: inline-block;
    vertical-align: middle;
}
.ql-snow .ql-formats:after {
    clear: both;
    content: '';
    display: table;
}
.ql-snow .ql-stroke {
    fill: none;
    stroke: #444;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
}
.ql-snow .ql-stroke-miter {
    fill: none;
    stroke: #444;
    stroke-miterlimit: 10;
    stroke-width: 2;
}
.ql-snow .ql-fill,
.ql-snow .ql-stroke.ql-fill {
    fill: #444;
}
.ql-snow .ql-empty {
    fill: none;
}
.ql-snow .ql-even {
    fill-rule: evenodd;
}
.ql-snow .ql-thin,
.ql-snow .ql-stroke.ql-thin {
    stroke-width: 1;
}
.ql-snow .ql-transparent {
    opacity: 0.4;
}
.ql-snow .ql-direction svg:last-child {
    display: none;
}
.ql-snow .ql-direction.ql-active svg:last-child {
    display: inline;
}
.ql-snow .ql-direction.ql-active svg:first-child {
    display: none;
}
.ql-snow .ql-editor h1 {
    font-size: 2rem;
}
.ql-snow .ql-editor h2 {
    font-size: 1.5rem;
}
.ql-snow .ql-editor h3 {
    font-size: 1.17rem;
}
.ql-snow .ql-editor h4 {
    font-size: 1rem;
}
.ql-snow .ql-editor h5 {
    font-size: 0.83rem;
}
.ql-snow .ql-editor h6 {
    font-size: 0.67rem;
}
.ql-snow .ql-editor a {
    text-decoration: underline;
}
.ql-snow .ql-editor blockquote {
    border-left: 4px solid #ccc;
    margin-bottom: 5px;
    margin-top: 5px;
    padding-left: 16px;
}
.ql-snow .ql-editor code,
.ql-snow .ql-editor pre {
    background-color: #f0f0f0;
    border-radius: 3px;
}
.ql-snow .ql-editor pre {
    white-space: pre-wrap;
    margin-bottom: 5px;
    margin-top: 5px;
    padding: 5px 10px;
}
.ql-snow .ql-editor code {
    font-size: 85%;
    padding: 2px 4px;
}
.ql-snow .ql-editor pre.ql-syntax {
    background-color: #23241f;
    color: #f8f8f2;
    overflow: visible;
}
.ql-snow .ql-editor img {
    max-width: 100%;
}
.ql-snow .ql-picker {
    color: #444;
    display: inline-block;
    float: left;
    font-size: 14px;
    font-weight: 500;
    height: 24px;
    position: relative;
    vertical-align: middle;
}
.ql-snow .ql-picker-label {
    cursor: pointer;
    display: inline-block;
    height: 100%;
    padding-left: 8px;
    padding-right: 2px;
    position: relative;
    width: 100%;
}
.ql-snow .ql-picker-label::before {
    display: inline-block;
    line-height: 22px;
}
.ql-snow .ql-picker-options {
    background-color: #fff;
    display: none;
    min-width: 100%;
    padding: 4px 8px;
    position: absolute;
    white-space: nowrap;
}
.ql-snow .ql-picker-options .ql-picker-item {
    cursor: pointer;
    display: block;
    padding-bottom: 5px;
    padding-top: 5px;
}
.ql-snow .ql-picker.ql-expanded .ql-picker-label {
    color: #ccc;
    z-index: 2;
}
.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-fill {
    fill: #ccc;
}
.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke {
    stroke: #ccc;
}
.ql-snow .ql-picker.ql-expanded .ql-picker-options {
    display: block;
    margin-top: -1px;
    top: 100%;
    z-index: 1;
}
.ql-snow .ql-color-picker,
.ql-snow .ql-icon-picker {
    width: 28px;
}
.ql-snow .ql-color-picker .ql-picker-label,
.ql-snow .ql-icon-picker .ql-picker-label {
    padding: 2px 4px;
}
.ql-snow .ql-color-picker .ql-picker-label svg,
.ql-snow .ql-icon-picker .ql-picker-label svg {
    right: 4px;
}
.ql-snow .ql-icon-picker .ql-picker-options {
    padding: 4px 0px;
}
.ql-snow .ql-icon-picker .ql-picker-item {
    height: 24px;
    width: 24px;
    padding: 2px 4px;
}
.ql-snow .ql-color-picker .ql-picker-options {
    padding: 3px 5px;
    width: 152px;
}
.ql-snow .ql-color-picker .ql-picker-item {
    border: 1px solid transparent;
    float: left;
    height: 16px;
    margin: 2px;
    padding: 0px;
    width: 16px;
}
.ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
    position: absolute;
    margin-top: -9px;
    right: 0;
    top: 50%;
    width: 18px;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=''])::before,
.ql-snow .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=''])::before,
.ql-snow .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=''])::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=''])::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=''])::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=''])::before {
    content: attr(data-label);
}
.ql-snow .ql-picker.ql-header {
    width: 98px;
}
.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: 'Normal';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
    content: 'Heading 1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
    content: 'Heading 2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
    content: 'Heading 3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
    content: 'Heading 4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
    content: 'Heading 5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
    content: 'Heading 6';
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
    font-size: 2rem;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
    font-size: 1.5rem;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
    font-size: 1.17rem;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
    font-size: 1rem;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
    font-size: 0.83rem;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
    font-size: 0.67rem;
}
.ql-snow .ql-picker.ql-font {
    width: 108px;
}
.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: 'Sans Serif';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
    content: 'Serif';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
    content: 'Monospace';
}
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
    font-family: Georgia, Times New Roman, serif;
}
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
    font-family: Monaco, Courier New, monospace;
}
.ql-snow .ql-picker.ql-size {
    width: 98px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: 'Normal';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
    content: 'Small';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
    content: 'Large';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
    content: 'Huge';
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
    font-size: 10px;
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
    font-size: 18px;
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
    font-size: 32px;
}
.ql-snow .ql-color-picker.ql-background .ql-picker-item {
    background-color: #fff;
}
.ql-snow .ql-color-picker.ql-color .ql-picker-item {
    background-color: #000;
}
.ql-toolbar.ql-snow {
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    padding: 8px;
}
.ql-toolbar.ql-snow .ql-formats {
    margin-right: 15px;
}
.ql-toolbar.ql-snow .ql-picker-label {
    border: 1px solid transparent;
}
.ql-toolbar.ql-snow .ql-picker-options {
    border: 1px solid transparent;
    box-shadow: rgba(0, 0, 0, 0.2) 0 2px 8px;
}
.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {
    border-color: #ccc;
}
.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
    border-color: #ccc;
}
.ql-toolbar.ql-snow .ql-color-picker .ql-picker-item.ql-selected,
.ql-toolbar.ql-snow .ql-color-picker .ql-picker-item:hover {
    border-color: #000;
}
.ql-toolbar.ql-snow + .ql-container.ql-snow {
    border-top: 0px;
}
.ql-snow .ql-tooltip {
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0px 0px 5px #ddd;
    color: #444;
    padding: 5px 12px;
    white-space: nowrap;
}
.ql-snow .ql-tooltip::before {
    content: 'Visit URL:';
    line-height: 26px;
    margin-right: 8px;
}
.ql-snow .ql-tooltip input[type='text'] {
    display: none;
    border: 1px solid #ccc;
    font-size: 13px;
    height: 26px;
    margin: 0px;
    padding: 3px 5px;
    width: 170px;
}
.ql-snow .ql-tooltip a.ql-preview {
    display: inline-block;
    max-width: 200px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
}
.ql-snow .ql-tooltip a.ql-action::after {
    border-right: 1px solid #ccc;
    content: 'Edit';
    margin-left: 16px;
    padding-right: 8px;
}
.ql-snow .ql-tooltip a.ql-remove::before {
    content: 'Remove';
    margin-left: 8px;
}
.ql-snow .ql-tooltip a {
    line-height: 26px;
}
.ql-snow .ql-tooltip.ql-editing a.ql-preview,
.ql-snow .ql-tooltip.ql-editing a.ql-remove {
    display: none;
}
.ql-snow .ql-tooltip.ql-editing input[type='text'] {
    display: inline-block;
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: 'Save';
    padding-right: 0px;
}
.ql-snow .ql-tooltip[data-mode='link']::before {
    content: 'Enter link:';
}
.ql-snow .ql-tooltip[data-mode='formula']::before {
    content: 'Enter formula:';
}
.ql-snow .ql-tooltip[data-mode='video']::before {
    content: 'Enter video:';
}
.ql-snow a {
    color: #06c;
}
.ql-container.ql-snow {
    border: 1px solid #ccc;
}
`,classes={root:"p-editor-container",toolbar:"p-editor-toolbar",content:"p-editor-content"},EditorStyle=BaseStyle.extend({name:"editor",css:quillCSS,classes}),script$1={name:"BaseEditor",extends:script$2,props:{modelValue:String,placeholder:String,readonly:Boolean,formats:Array,editorStyle:null,modules:null},style:EditorStyle,provide:function e(){return{$parentInstance:this}},beforeMount:function e(){var n;EditorStyle.loadStyle({nonce:(n=this.$primevue)===null||n===void 0||(n=n.config)===null||n===void 0||(n=n.csp)===null||n===void 0?void 0:n.nonce})}};function _typeof(e){"@babel/helpers - typeof";return _typeof=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},_typeof(e)}function ownKeys(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function _objectSpread(e){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?ownKeys(Object(t),!0).forEach(function(o){_defineProperty(e,o,t[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach(function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(t,o))})}return e}function _defineProperty(e,n,t){return n=_toPropertyKey(n),n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function _toPropertyKey(e){var n=_toPrimitive(e,"string");return _typeof(n)=="symbol"?n:String(n)}function _toPrimitive(e,n){if(_typeof(e)!="object"||!e)return e;var t=e[Symbol.toPrimitive];if(t!==void 0){var o=t.call(e,n);if(_typeof(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(e)}var QuillJS=function(){try{return window.Quill}catch{return null}}(),script={name:"Editor",extends:script$1,inheritAttrs:!1,emits:["update:modelValue","text-change","selection-change","load"],data:function e(){return{reRenderColorKey:0}},quill:null,watch:{modelValue:function e(n,t){n!==t&&this.quill&&!this.quill.hasFocus()&&(this.reRenderColorKey++,this.renderValue(n))},readonly:function e(){this.handleReadOnlyChange()}},mounted:function e(){var n=this,t={modules:_objectSpread({toolbar:this.$refs.toolbarElement},this.modules),readOnly:this.readonly,theme:"snow",formats:this.formats,placeholder:this.placeholder};QuillJS?(this.quill=new QuillJS(this.$refs.editorElement,t),this.initQuill(),this.handleLoad()):__vitePreload(()=>import("./quill-B7ULj2qj.js"),[]).then(function(o){o&&DomHandler.isExist(n.$refs.editorElement)&&(o.default?n.quill=new o.default(n.$refs.editorElement,t):n.quill=new o(n.$refs.editorElement,t),n.initQuill())}).then(function(){n.handleLoad()})},beforeUnmount:function e(){this.quill=null},methods:{renderValue:function e(n){this.quill&&(n?this.quill.setContents(this.quill.clipboard.convert(n)):this.quill.setText(""))},initQuill:function e(){var n=this;this.renderValue(this.modelValue),this.quill.on("text-change",function(t,o,r){if(r==="user"){var a=n.$refs.editorElement.children[0].innerHTML,l=n.quill.getText().trim();a==="<p><br></p>"&&(a=""),n.$emit("update:modelValue",a),n.$emit("text-change",{htmlValue:a,textValue:l,delta:t,source:r,instance:n.quill})}}),this.quill.on("selection-change",function(t,o,r){var a=n.$refs.editorElement.children[0].innerHTML,l=n.quill.getText().trim();n.$emit("selection-change",{htmlValue:a,textValue:l,range:t,oldRange:o,source:r,instance:n.quill})})},handleLoad:function e(){this.quill&&this.quill.getModule("toolbar")&&this.$emit("load",{instance:this.quill})},handleReadOnlyChange:function e(){this.quill&&this.quill.enable(!this.readonly)}}};function render(e,n,t,o,r,a){return openBlock(),createElementBlock("div",mergeProps({class:e.cx("root")},e.ptmi("root")),[createBaseVNode("div",mergeProps({ref:"toolbarElement",class:e.cx("toolbar")},e.ptm("toolbar")),[renderSlot(e.$slots,"toolbar",{},function(){return[createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("select",mergeProps({class:"ql-header",defaultValue:"0"},e.ptm("header")),[createBaseVNode("option",mergeProps({value:"1"},e.ptm("option")),"Heading",16),createBaseVNode("option",mergeProps({value:"2"},e.ptm("option")),"Subheading",16),createBaseVNode("option",mergeProps({value:"0"},e.ptm("option")),"Normal",16)],16),createBaseVNode("select",mergeProps({class:"ql-font"},e.ptm("font")),[createBaseVNode("option",normalizeProps(guardReactiveProps(e.ptm("option"))),null,16),createBaseVNode("option",mergeProps({value:"serif"},e.ptm("option")),null,16),createBaseVNode("option",mergeProps({value:"monospace"},e.ptm("option")),null,16)],16)],16),createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("button",mergeProps({class:"ql-bold",type:"button"},e.ptm("bold")),null,16),createBaseVNode("button",mergeProps({class:"ql-italic",type:"button"},e.ptm("italic")),null,16),createBaseVNode("button",mergeProps({class:"ql-underline",type:"button"},e.ptm("underline")),null,16)],16),(openBlock(),createElementBlock("span",mergeProps({key:r.reRenderColorKey,class:"ql-formats"},e.ptm("formats")),[createBaseVNode("select",mergeProps({class:"ql-color"},e.ptm("color")),null,16),createBaseVNode("select",mergeProps({class:"ql-background"},e.ptm("background")),null,16)],16)),createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("button",mergeProps({class:"ql-list",value:"ordered",type:"button"},e.ptm("list")),null,16),createBaseVNode("button",mergeProps({class:"ql-list",value:"bullet",type:"button"},e.ptm("list")),null,16),createBaseVNode("select",mergeProps({class:"ql-align"},e.ptm("select")),[createBaseVNode("option",mergeProps({defaultValue:""},e.ptm("option")),null,16),createBaseVNode("option",mergeProps({value:"center"},e.ptm("option")),null,16),createBaseVNode("option",mergeProps({value:"right"},e.ptm("option")),null,16),createBaseVNode("option",mergeProps({value:"justify"},e.ptm("option")),null,16)],16)],16),createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("button",mergeProps({class:"ql-link",type:"button"},e.ptm("link")),null,16),createBaseVNode("button",mergeProps({class:"ql-image",type:"button"},e.ptm("image")),null,16),createBaseVNode("button",mergeProps({class:"ql-code-block",type:"button"},e.ptm("codeBlock")),null,16)],16),createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("button",mergeProps({class:"ql-clean",type:"button"},e.ptm("clean")),null,16)],16)]})],16),createBaseVNode("div",mergeProps({ref:"editorElement",class:e.cx("content"),style:e.editorStyle},e.ptm("content")),null,16)],16)}script.render=render;const _hoisted_1$1={class:"card"},_sfc_main$1=defineComponent({__name:"ExamNotes",props:{modelValue:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=n;return(o,r)=>(openBlock(),createElementBlock("div",_hoisted_1$1,[createVNode(unref(script),{modelValue:o.modelValue,"onUpdate:modelValue":r[0]||(r[0]=a=>t("update:modelValue",a)),editorStyle:"height: 320px",class:"w-full"},null,8,["modelValue"])]))}}),_hoisted_1={key:0,class:"fixed inset-0 z-[80] bg-slate-950/55 backdrop-blur-[1px] flex items-center justify-center p-4"},_hoisted_2={class:"w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl"},_hoisted_3={class:"flex items-start justify-between gap-2"},_hoisted_4={class:"mt-1 text-xs text-slate-500"},_hoisted_5={class:"mt-4 space-y-3"},_hoisted_6={class:"block text-sm"},_hoisted_7={class:"block text-sm"},_hoisted_8={class:"mt-4 flex items-center justify-end gap-2"},_hoisted_9=["disabled"],_sfc_main=defineComponent({__name:"ExamFeedbackModal",props:{sourceProduct:{},examMode:{},questionId:{},examId:{}},setup(e){const n=e,t=useRoute(),o=ref(!1),r=ref(!1),a=ref("technical_issue"),l=ref(""),s=ref(""),i=ref("success"),f=computed(()=>{const E=Number(n.questionId);return Number.isFinite(E)&&E>0?E:null}),d=computed(()=>{const E=Number(n.examId);return Number.isFinite(E)&&E>0?E:null}),k=computed(()=>[`Product: ${n.sourceProduct.toUpperCase()}`,n.examMode?`Mode: ${String(n.examMode).toUpperCase()}`:null,d.value?`Exam ID: ${d.value}`:null,f.value?`Question ID: ${f.value}`:"Question ID: n/a"].filter(Boolean).join(" | ")),N=()=>{o.value=!1},x=async()=>{var E,L;if(!(l.value.trim().length<5||r.value)){r.value=!0,s.value="";try{await axios.post("/exam-feedback",{source_product:n.sourceProduct,exam_mode:n.examMode??null,exam_id:d.value,question_id:f.value,issue_type:a.value,message:l.value.trim(),route:t.fullPath,metadata:{current_path:t.fullPath,user_agent:typeof navigator<"u"?navigator.userAgent:null}}),i.value="success",s.value="Thanks. Your report was sent to our team.",l.value="",setTimeout(()=>{N(),s.value=""},900)}catch(j){i.value="error",s.value=((L=(E=j==null?void 0:j.response)==null?void 0:E.data)==null?void 0:L.message)||"Unable to send report. Please try again."}finally{r.value=!1}}};return(E,L)=>(openBlock(),createElementBlock(Fragment,null,[createBaseVNode("button",{type:"button",class:"inline-flex items-center gap-1 cursor-pointer",onClick:L[0]||(L[0]=j=>o.value=!0)},L[3]||(L[3]=[createBaseVNode("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"size-6"},[createBaseVNode("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"})],-1),createBaseVNode("span",{class:"hidden 2xl:block"},"Report",-1)])),o.value?(openBlock(),createElementBlock("div",_hoisted_1,[createBaseVNode("div",_hoisted_2,[createBaseVNode("div",_hoisted_3,[createBaseVNode("div",null,[L[4]||(L[4]=createBaseVNode("h3",{class:"text-lg font-semibold"},"Report Question or Issue",-1)),createBaseVNode("p",_hoisted_4,toDisplayString(k.value),1)]),createBaseVNode("button",{type:"button",class:"text-slate-400 hover:text-slate-600",onClick:N},L[5]||(L[5]=[createBaseVNode("i",{class:"pi pi-times"},null,-1)]))]),createBaseVNode("div",_hoisted_5,[createBaseVNode("label",_hoisted_6,[L[7]||(L[7]=createBaseVNode("span",{class:"mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"},"Issue Type",-1)),withDirectives(createBaseVNode("select",{"onUpdate:modelValue":L[1]||(L[1]=j=>a.value=j),class:"w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500"},L[6]||(L[6]=[createBaseVNode("option",{value:"technical_issue"},"Technical issue",-1),createBaseVNode("option",{value:"content_error"},"Question/content error",-1),createBaseVNode("option",{value:"answer_issue"},"Answer/rationale concern",-1),createBaseVNode("option",{value:"other"},"Other",-1)]),512),[[vModelSelect,a.value]])]),createBaseVNode("label",_hoisted_7,[L[8]||(L[8]=createBaseVNode("span",{class:"mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"},"Details",-1)),withDirectives(createBaseVNode("textarea",{"onUpdate:modelValue":L[2]||(L[2]=j=>l.value=j),rows:"5",maxlength:"3000",placeholder:"Tell us what happened, what looked wrong, and what you expected.",class:"w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"},null,512),[[vModelText,l.value]])]),s.value?(openBlock(),createElementBlock("p",{key:0,class:normalizeClass(["text-xs rounded-lg px-3 py-2",i.value==="success"?"bg-emerald-100 text-emerald-700":"bg-rose-100 text-rose-700"])},toDisplayString(s.value),3)):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_8,[createBaseVNode("button",{type:"button",class:"rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100",onClick:N}," Cancel "),createBaseVNode("button",{type:"button",class:"rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60",disabled:r.value||l.value.trim().length<5,onClick:x},toDisplayString(r.value?"Sending...":"Send Report"),9,_hoisted_9)])])])):createCommentVNode("",!0)],64))}});export{QuestionRenderer as Q,_sfc_main as _,_sfc_main$2 as a,_sfc_main$1 as b};
