import{x as defineComponent,r as ref,z as computed,E as watch,f as createElementBlock,k as createCommentVNode,h as createBaseVNode,F as Fragment,G as renderList,n as normalizeClass,t as toDisplayString,g as openBlock,a4 as watchEffect,o as onMounted,a5 as createApp,X as onUnmounted,I as inject,B as createBlock,J as renderSlot,y as unref,p as createTextVNode,N as nextTick,m as withDirectives,v as vModelText,a6 as vModelRadio,a7 as reactive,Y as toRaw,_ as _export_sfc,H as toRefs,V as h$1,a8 as getCurrentInstance,a9 as isRef,i as createVNode,w as withCtx,j as createStaticVNode,aa as createSlots,ab as normalizeProps,ac as guardReactiveProps,ad as resolveDynamicComponent,ae as BaseStyle,af as script$2,ag as __vitePreload,ah as DomHandler,ai as mergeProps,Q as vModelSelect,c as useRoute,s as axios,A as onBeforeUnmount,P as vModelCheckbox,l as withModifiers}from"./main-B0vwFK2x.js";const _hoisted_1$j={key:0,class:"mb-4"},_hoisted_2$h={class:"flex gap-2 mb-2"},_hoisted_3$h=["onClick"],_hoisted_4$h=["innerHTML"],_sfc_main$k=defineComponent({__name:"TabRenderer",props:{tabs:{}},setup(e){const n=e,t=ref(0),o=computed(()=>{if(!n.tabs)return[];try{const r=typeof n.tabs=="string"?JSON.parse(n.tabs||"{}"):n.tabs;return!r||typeof r!="object"?[]:Object.entries(r)}catch{return[]}});return watch(()=>n.tabs,()=>{t.value=0}),(r,a)=>o.value.length?(openBlock(),createElementBlock("div",_hoisted_1$j,[createBaseVNode("div",_hoisted_2$h,[(openBlock(!0),createElementBlock(Fragment,null,renderList(o.value,([l],u)=>(openBlock(),createElementBlock("button",{key:u,class:normalizeClass(["text-sm px-3 py-1 rounded-t border-b-1 font-bold cursor-pointer",{"border-sky-600 border-b-3 dark:text-gray-700 bg-gray-200 rounded-t-md":t.value===u,"text-gray-700 dark:text-gray-100":t.value!==u}]),onClick:s=>t.value=u},toDisplayString(l),11,_hoisted_3$h))),128))]),createBaseVNode("div",{class:"pt-2 prose max-w-none border border-gray-200 p-2 rounded",innerHTML:o.value[t.value][1]},null,8,_hoisted_4$h)])):createCommentVNode("",!0)}}),qn_arrow="/build/assets/qn_arrow-CpnXGZsK.png",_hoisted_1$i=["innerHTML"],_hoisted_2$g={class:"flex items-start gap-2"},_hoisted_3$g=["src"],_hoisted_4$g=["innerHTML"],_hoisted_5$g=["value","checked","onChange","disabled"],_hoisted_6$g=["innerHTML"],_hoisted_7$e=["innerHTML"],_hoisted_8$d=["innerHTML"],_hoisted_9$a={key:0,class:"mt-4 p-4 text-center"},_sfc_main$j=defineComponent({__name:"MMA",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","update:showSolution"],setup(e,{emit:n}){const t=e,{testMode:o,answers:r,results:a}=t.examStore,l=n,u=computed({get:()=>t.modelValue,set:ne=>l("update:modelValue",ne)}),s=ne=>{const yt=[...u.value],A=yt.indexOf(ne);A!==-1?yt.splice(A,1):yt.push(ne),u.value=yt},f=ref(!1),d=ref(!1);watchEffect(()=>{var ne,yt;switch(o){case"review":f.value=!0;break;case"exam":f.value=!1;break;case"tutor":f.value=!1,d.value=!0,t.examStore.answers[t.question.id]&&setTimeout(()=>{f.value=!!t.examStore.answers[t.question.id],E({flag:!0,value:f.value})},(Array.isArray((ne=t.question)==null?void 0:ne.correct_answer)?t.question.correct_answer:JSON.parse(((yt=t.question)==null?void 0:yt.correct_answer)??"[]")).length*1e4);break;default:f.value=!1}});const v=computed(()=>{if(Array.isArray(t.question.correct_answer))return t.question.correct_answer;try{return JSON.parse(t.question.correct_answer||"[]")}catch{return[]}}),_=ne=>v.value.includes(ne),x=ne=>{const yt=r[t.question.id]??[];return o==="review"?(a[t.question.id],yt.includes(ne)&&!v.value.includes(ne)):o==="tutor"?yt.includes(ne)&&!_(ne):!1},E=inject("showSolution"),H=()=>{f.value=!0,E({flag:!0,value:!0}),d.value=!1},z=ref(null);return onMounted(()=>{const ne=document.getElementById("exhibits");ne&&(ne.innerHTML="",z.value=createApp(_sfc_main$k,{tabs:t.question.tabs}),z.value.mount(ne))}),onUnmounted(()=>{E({flag:!0,value:!1}),z.value&&(z.value.unmount(),z.value=null)}),(ne,yt)=>(openBlock(),createElementBlock("div",{class:normalizeClass([ne.question.tabs&&["nclex","cat"].includes(ne.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[ne.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:ne.question.intro},null,8,_hoisted_1$i)):createCommentVNode("",!0),ne.question.tabs&&["nclex","cat"].includes(ne.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:ne.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$g,[["nclex","cat"].includes(ne.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$g)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:ne.question.question},null,8,_hoisted_4$g)]),(openBlock(!0),createElementBlock(Fragment,null,renderList(ne.question.options,(A,ce)=>(openBlock(),createElementBlock("div",{key:ce,class:"mb-2 ms-4"},[A.choice!=null&&A.choice!=""&&A.choice!="None"?(openBlock(),createElementBlock("label",{key:0,class:normalizeClass(["flex items-start gap-2",{"text-teal-500 font-semibold":_(String(ce))&&f.value,"text-rose-600 font-semibold":x(String(ce))&&f.value}])},[createBaseVNode("i",{class:normalizeClass(`pi mt-1.5 text-lg ${_(String(ce))&&f.value?"pi-check-circle":x(String(ce))&&f.value?"pi-times-circle":""}`)},null,2),createBaseVNode("input",{type:"checkbox",class:"checkbox checkbox-sm mt-1 cursor-pointer border-gray-600 text-gray-700 dark:text-slate-100 dark:border-white",value:String(ce),checked:u.value.includes(String(ce)),onChange:R=>s(String(ce)),disabled:unref(o)==="review"},null,40,_hoisted_5$g),createBaseVNode("div",null,[createBaseVNode("span",{innerHTML:ce,class:"font-semibold"},null,8,_hoisted_6$g),yt[0]||(yt[0]=createTextVNode(". ")),createBaseVNode("span",{innerHTML:A.choice},null,8,_hoisted_7$e),f.value&&A.reason?(openBlock(),createElementBlock("div",{key:0,class:normalizeClass({"bg-teal-100 text-teal-800 p-0.5 rounded":_(String(ce)),"bg-rose-100 text-rose-700 p-0.5 rounded":x(String(ce))}),innerHTML:A.reason},null,10,_hoisted_8$d)):createCommentVNode("",!0)])],2)):createCommentVNode("",!0)]))),128)),d.value?(openBlock(),createElementBlock("div",_hoisted_9$a,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",onClick:H}," Submit ")])):createCommentVNode("",!0),renderSlot(ne.$slots,"solution")])],2))}}),_hoisted_1$h=["innerHTML"],_hoisted_2$f={class:"flex items-start gap-2"},_hoisted_3$f=["src"],_hoisted_4$f=["innerHTML"],_hoisted_5$f={key:0,class:"mt-3 space-y-2 text-sm"},_hoisted_6$f={key:1,class:"mt-4 p-4 text-center"},_hoisted_7$d=["disabled"],_sfc_main$i=defineComponent({__name:"Dropdown",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,{testMode:o}=t.examStore,r=n,a=inject("showSolution",null),l=ref(!1),u=ref(!1),s=computed({get:()=>t.modelValue||{},set:i=>r("update:modelValue",i)}),f=computed(()=>{const i=t.question.correct_answer;if(!i)return{};if(typeof i=="object")return i;if(typeof i=="string")try{return JSON.parse(i)}catch{return{}}return{}}),d=computed(()=>{const i=t.question.options||{};return Object.keys(i).every(T=>!!s.value[T])}),v=computed(()=>Object.keys(t.question.options||{})),_=i=>f.value[i]===s.value[i],x=i=>!!s.value[i]&&f.value[i]!==s.value[i],E=i=>!s.value[i]&&!!f.value[i],H=i=>i.replace(/<[^>]*>/g,"").trim(),z=(i,T)=>{var N;if(!T)return"none";const Q=(N=t.question.options)==null?void 0:N[i],w=Q==null?void 0:Q[T];return w&&H(String(w))||T},ne=i=>{const T=s.value[i],Q=f.value[i],w=z(i,T),N=z(i,Q);return _(i)?`${i}: Correct`:x(i)?`${i}: Incorrect (selected "${w}", correct is "${N}")`:E(i)?`${i}: Not answered (correct is "${N}")`:`${i}: No answer`},yt=i=>_(i)?"pi-check-circle text-teal-600":x(i)?"pi-times-circle text-rose-600":E(i)?"pi-exclamation-triangle text-amber-600":"pi-circle text-gray-400",A=i=>_(i)?"text-teal-700 font-semibold":x(i)?"text-rose-700 font-semibold":E(i)?"text-amber-700 font-semibold":"text-gray-500",ce=ref(null);function R(){const i=ce.value;if(!i)return;const T=t.question.options||{};Object.entries(T).forEach(([Q,w])=>{let N=i.querySelector(`#${Q}`);if(!N)return;let U;N.tagName==="SELECT"?(U=N,U.innerHTML=""):(N.innerHTML="",U=document.createElement("select"),N.appendChild(U)),U.name=Q,U.disabled=o==="review",U.className=`inline-block border p-1 rounded mx-1 text-sm align-middle transition-opacity duration-300 ease-in opacity-0 ${ft(Q)}`,U.style.minWidth="6rem",U.style.maxWidth="220px",requestAnimationFrame(()=>{U.style.opacity="1"});const k=new Option("-- Select --","");k.disabled=!0,k.selected=!s.value[Q],U.appendChild(k),Object.entries(w).forEach(([j,Y])=>{if(!Y)return;const $e=new Option(Y,j,!1,s.value[Q]===j);U.appendChild($e)}),U.addEventListener("change",j=>{const Y=j.target;r("update:modelValue",{...s.value,[Q]:Y.value})})})}function ft(i){return l.value?_(i)?"border-teal-500 bg-teal-50 text-teal-800":x(i)?"border-rose-500 bg-rose-50 text-rose-800":E(i)?"border-amber-500 bg-amber-50 text-amber-800":"border-gray-300":"border-gray-300"}function b(){d.value&&(l.value=!0,u.value=!1,a&&a({flag:!0,value:!0}))}watchEffect(()=>{switch(t.question.id,o){case"review":l.value=!0,u.value=!1;break;case"exam":l.value=!1,u.value=!1;break;case"tutor":l.value=!1,u.value=!0;break;default:l.value=!1,u.value=!1}}),onMounted(()=>nextTick(R)),watch(()=>[t.question,t.modelValue,o,l.value],()=>nextTick(R),{deep:!0});const m=ref(null);return onMounted(()=>{const i=document.getElementById("exhibits");i&&(i.innerHTML="",m.value=createApp(_sfc_main$k,{tabs:t.question.tabs}),m.value.mount(i))}),onUnmounted(()=>{a&&a({flag:!0,value:!1}),m.value&&(m.value.unmount(),m.value=null)}),(i,T)=>(openBlock(),createElementBlock("div",{class:normalizeClass([i.question.tabs&&["nclex","cat"].includes(i.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[i.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:i.question.intro},null,8,_hoisted_1$h)):createCommentVNode("",!0),i.question.tabs&&["nclex","cat"].includes(i.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:i.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$f,[["nclex","cat"].includes(i.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$f)):createCommentVNode("",!0),createBaseVNode("div",{ref_key:"questionContainer",ref:ce,class:"prose max-w-none text-base",innerHTML:i.question.question},null,8,_hoisted_4$f)]),l.value?(openBlock(),createElementBlock("div",_hoisted_5$f,[(openBlock(!0),createElementBlock(Fragment,null,renderList(v.value,Q=>(openBlock(),createElementBlock("div",{key:`fb-${Q}`,class:"flex items-center gap-2"},[createBaseVNode("i",{class:normalizeClass(`pi ${yt(Q)}`)},null,2),createBaseVNode("span",{class:normalizeClass(A(Q))},toDisplayString(ne(Q)),3)]))),128))])):createCommentVNode("",!0),u.value?(openBlock(),createElementBlock("div",_hoisted_6$f,[createBaseVNode("button",{class:normalizeClass(["px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",d.value?"":"opacity-50 cursor-not-allowed"]),disabled:!d.value,onClick:b}," Submit ",10,_hoisted_7$d)])):createCommentVNode("",!0),renderSlot(i.$slots,"solution")])],2))}}),_hoisted_1$g=["innerHTML"],_hoisted_2$e={class:"flex items-start gap-2"},_hoisted_3$e=["src"],_hoisted_4$e=["innerHTML"],_hoisted_5$e={class:"flex items-center gap-2"},_hoisted_6$e=["disabled"],_hoisted_7$c={key:0},_hoisted_8$c=["innerHTML"],numericTolerance=.01,_sfc_main$h=defineComponent({__name:"FIB",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,{testMode:o,answers:r}=t.examStore,a=n,l=computed({get:()=>t.modelValue,set:E=>a("update:modelValue",E)}),u=computed(()=>{if(Array.isArray(t.question.correct_answer))return t.question.correct_answer;try{return JSON.parse(t.question.correct_answer||"[]")}catch{return[]}}),s=computed(()=>{switch(o){case"review":return!0;case"exam":return!1;case"tutor":return!!t.examStore.answers[t.question.id];default:return!1}}),f=E=>E.trim().toLowerCase(),d=E=>!isNaN(parseFloat(E))&&isFinite(Number(E)),v=computed(()=>{if(!s.value)return!1;const E=l.value.trim();if(!E)return!1;for(const H of u.value){const z=String(H).trim();if(d(z)&&d(E)){const ne=parseFloat(z),yt=parseFloat(E);if(Math.abs(ne-yt)<=numericTolerance)return!0}if(f(z)===f(E))return!0}return!1}),_=computed(()=>s.value&&l.value.trim()!==""&&!v.value),x=ref(null);return onMounted(()=>{const E=document.getElementById("exhibits");E&&(E.innerHTML="",x.value=createApp(_sfc_main$k,{tabs:t.question.tabs}),x.value.mount(E))}),onUnmounted(()=>{x.value&&(x.value.unmount(),x.value=null)}),(E,H)=>(openBlock(),createElementBlock("div",{class:normalizeClass([E.question.tabs&&["nclex","cat"].includes(E.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[E.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:E.question.intro},null,8,_hoisted_1$g)):createCommentVNode("",!0),E.question.tabs&&["nclex","cat"].includes(E.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:E.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$e,[["nclex","cat"].includes(E.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$e)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:E.question.question},null,8,_hoisted_4$e)]),createBaseVNode("div",null,[createBaseVNode("label",_hoisted_5$e,[H[1]||(H[1]=createBaseVNode("span",null,"Answer:",-1)),withDirectives(createBaseVNode("input",{type:"text","onUpdate:modelValue":H[0]||(H[0]=z=>l.value=z),class:"border-b border-black dark:border-slate-300 dark:bg-sky-950 px-2 py-1 w-32",disabled:unref(o)==="review"},null,8,_hoisted_6$e),[[vModelText,l.value]]),E.question.units?(openBlock(),createElementBlock("span",_hoisted_7$c,toDisplayString(E.question.units),1)):createCommentVNode("",!0),s.value?(openBlock(),createElementBlock("i",{key:1,class:normalizeClass(`ms-2 pi text-lg ${v.value?"pi-check-circle text-teal-500":_.value?"pi-times-circle text-rose-600":""}`)},null,2)):createCommentVNode("",!0)]),s.value&&E.question.solution?(openBlock(),createElementBlock("div",{key:0,class:"mt-2 bg-teal-50 text-teal-800 p-2 rounded",innerHTML:E.question.solution},null,8,_hoisted_8$c)):createCommentVNode("",!0)])],2))}}),_hoisted_1$f=["innerHTML"],_hoisted_2$d={class:"flex items-start gap-2"},_hoisted_3$d=["src"],_hoisted_4$d=["innerHTML"],_hoisted_5$d=["value","name","disabled"],_hoisted_6$d=["innerHTML"],_hoisted_7$b=["innerHTML"],_hoisted_8$b=["innerHTML"],_sfc_main$g=defineComponent({__name:"MSA",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","update:showSolution"],setup(e,{emit:n}){const t=e,{testMode:o,results:r,answers:a}=t.examStore,l=n,u=computed({get:()=>t.modelValue,set:_=>l("update:modelValue",_)}),s=computed(()=>{switch(o){case"review":return!0;case"tutor":return!!t.examStore.answers[t.question.id];default:return!1}}),f=_=>{const x=t.question.correct_answer;return Array.isArray(x)?x.includes(_):x===_},d=_=>{const x=t.examStore.answers[t.question.id];if(o==="review"){const E=r[t.question.id];return(E==null?void 0:E.correct)===!1&&x===_}return o==="tutor"?x===_&&!f(_):!1},v=ref(null);return onMounted(()=>{const _=document.getElementById("exhibits");_&&(_.innerHTML="",v.value=createApp(_sfc_main$k,{tabs:t.question.tabs}),v.value.mount(_))}),onUnmounted(()=>{v.value&&(v.value.unmount(),v.value=null)}),(_,x)=>(openBlock(),createElementBlock("div",{class:normalizeClass([_.question.tabs&&["nclex","cat"].includes(_.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[_.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:_.question.intro},null,8,_hoisted_1$f)):createCommentVNode("",!0),_.question.tabs&&["nclex","cat"].includes(_.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:_.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$d,[["nclex","cat"].includes(_.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$d)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:_.question.question},null,8,_hoisted_4$d)]),(openBlock(!0),createElementBlock(Fragment,null,renderList(_.question.options,(E,H)=>(openBlock(),createElementBlock("div",{key:H,class:"mb-2 ms-4"},[E.choice!=null&&E.choice!=""&&E.choice!="None"?(openBlock(),createElementBlock("label",{key:0,class:normalizeClass(["flex items-start gap-2",{"text-teal-500 font-semibold":f(String(H))&&s.value,"text-rose-600 font-semibold":d(String(H))&&s.value}])},[createBaseVNode("i",{class:normalizeClass(`pi mt-1.5 text-lg ${f(String(H))&&s.value?"pi-check-circle":d(String(H))&&s.value?"pi-times-circle":""}`)},null,2),withDirectives(createBaseVNode("input",{type:"radio",class:"radio radio-neutral radio-sm mt-1 cursor-pointer border-gray-600 dark:text-slate-100 dark:border-white",value:H,"onUpdate:modelValue":x[0]||(x[0]=z=>u.value=z),name:`question-${_.question.id}`,disabled:unref(o)==="review"},null,8,_hoisted_5$d),[[vModelRadio,u.value]]),createBaseVNode("div",null,[createBaseVNode("span",{innerHTML:H,class:"font-semibold"},null,8,_hoisted_6$d),x[1]||(x[1]=createTextVNode(". ")),createBaseVNode("span",{innerHTML:E.choice},null,8,_hoisted_7$b),s.value&&E.reason?(openBlock(),createElementBlock("div",{key:0,class:normalizeClass({"bg-teal-100 text-teal-800 p-0.5 rounded":f(String(H)),"bg-rose-100 text-rose-700 p-0.5 rounded":d(String(H))}),innerHTML:E.reason},null,10,_hoisted_8$b)):createCommentVNode("",!0)])],2)):createCommentVNode("",!0)]))),128)),renderSlot(_.$slots,"solution")])],2))}}),_hoisted_1$e={class:"rounded-lg border border-gray-200 bg-gray-50 p-4 max-w-md m-auto mt-12 text-center"},_sfc_main$f=defineComponent({__name:"Unknown",props:{question:{},modelValue:{},examStore:{}},setup(e){return(n,t)=>{var o,r;return openBlock(),createElementBlock("div",_hoisted_1$e,[t[0]||(t[0]=createBaseVNode("p",{class:"font-medium text-gray-700 mb-12"}," This question is currently under review for accuracy. ",-1)),t[1]||(t[1]=createBaseVNode("p",{class:"mt-1 text-gray-500"},[createTextVNode(" Please click "),createBaseVNode("span",{class:"font-semibold"},"Next"),createTextVNode(" to continue with rest of the exam. You may return later. ")],-1)),createBaseVNode("p",null,"Code "+toDisplayString((r=(o=n.question)==null?void 0:o.question_type)==null?void 0:r.code),1)])}}}),_hoisted_1$d=["innerHTML"],_hoisted_2$c=["innerHTML"],_hoisted_3$c={class:"grouping-table border border-gray-200 w-full mt-2"},_hoisted_4$c={class:"bg-gray-100"},_hoisted_5$c=["innerHTML"],_hoisted_6$c={class:"p-2"},_hoisted_7$a={class:"font-semibold"},_hoisted_8$a=["innerHTML"],_hoisted_9$9=["name","value","checked","disabled","onChange"],_hoisted_10$7={key:2,class:"text-red-600 mt-2"},_hoisted_11$5={key:3,class:"mt-4 text-center"},_sfc_main$e=defineComponent({__name:"Grouping",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","submitted"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=(k,j)=>{if(k==null)return j;if(typeof k!="string")return k;try{return JSON.parse(k)}catch{return j}},l=computed(()=>a(t.question.correct_answer,{})),u=computed(()=>{var j,Y;const k=((j=t.question)==null?void 0:j.match_options)??((Y=t.question)==null?void 0:Y.match_option)??{};return a(k,{})}),s=computed(()=>{const k={};if(Object.keys(u.value||{}).sort().forEach($e=>{const y=u.value[$e];if(typeof y=="string"){k[$e]=y;return}k[$e]=(y==null?void 0:y.option)||`Category ${$e}`}),Object.keys(k).length)return k;const Y=new Set;return Object.keys(l.value||{}).forEach($e=>{var it;const y=(it=l.value)==null?void 0:it[$e],gt=Array.isArray(y==null?void 0:y.answers)?y.answers[0]:y==null?void 0:y.answers;gt!=null&&Y.add(String(gt))}),Array.from(Y).sort().forEach($e=>{k[$e]=`Category ${$e}`}),k}),f=computed(()=>{var j;const k=(j=t.question)==null?void 0:j.options;return!k||typeof k!="object"?{}:k}),d=computed(()=>Object.keys(f.value)),v=reactive({}),_=ref(null),x=computed(()=>{var k;return typeof((k=t.question)==null?void 0:k.question)=="string"&&t.question.question.includes('id="exhibits"')}),E=computed(()=>{var k;return!!((k=t.question)!=null&&k.tabs)&&!x.value}),H=k=>{var j;return typeof k=="string"?k:typeof(k==null?void 0:k.choice)=="string"?k.choice:((j=k==null?void 0:k.choice)==null?void 0:j.choice)||""},z=k=>{var $e;const j=($e=l.value)==null?void 0:$e[k],Y=Array.isArray(j==null?void 0:j.answers)?j.answers[0]:j==null?void 0:j.answers;return Y==null?null:String(Y)},ne=()=>{const k={};return d.value.forEach(j=>{const Y=v[j];Y&&(k[j]={answers:String(Y)})}),k},yt=k=>{!k||typeof k!="object"||d.value.forEach(j=>{const Y=k==null?void 0:k[j];if(Y!=null){if(typeof Y=="object"&&Y!==null&&"answers"in Y){const $e=Y.answers;if(Array.isArray($e)){v[j]=$e.length?String($e[0]):null;return}v[j]=$e==null?null:String($e);return}v[j]=String(Y)}})};watch(()=>{var k,j,Y,$e,y;return[(k=t.question)==null?void 0:k.id,(j=t.question)==null?void 0:j.options,(Y=t.question)==null?void 0:Y.correct_answer,($e=t.question)==null?void 0:$e.match_option,(y=t.question)==null?void 0:y.match_options]},()=>{Object.keys(v).forEach(k=>delete v[k]),d.value.forEach(k=>{v[k]=null}),yt(t.modelValue)},{immediate:!0,deep:!0}),watch(()=>t.modelValue,k=>{k&&yt(k)},{deep:!0});const ce=()=>{_.value&&(_.value.unmount(),_.value=null)},R=async()=>{var j;if(ce(),!((j=t.question)!=null&&j.tabs)||!x.value)return;await nextTick();const k=document.getElementById("exhibits");k&&(k.innerHTML="",_.value=createApp(_sfc_main$k,{tabs:t.question.tabs}),_.value.mount(k))};watch(()=>{var k,j,Y;return[(k=t.question)==null?void 0:k.id,(j=t.question)==null?void 0:j.tabs,(Y=t.question)==null?void 0:Y.question]},()=>{R()},{immediate:!0});function ft(k,j){b.value="",v[k]=j,o("update:modelValue",ne())}const b=ref(""),m=ref(!1),i=ref(!1);function T(k,j){return z(k)===j}function Q(k,j){if(!m.value)return"";const Y=T(k,j),$e=v[k]===j;return Y&&$e?"accent-teal-500":!Y&&$e?"accent-rose-600":Y&&!$e?"ring-2 ring-teal-500":""}const w=inject("showSolution");function N(){const k=toRaw(ne());try{if(typeof structuredClone=="function")return structuredClone(k)}catch{}return JSON.parse(JSON.stringify(k))}function U(){if(d.value.filter(j=>!v[j]).length){b.value="Select one category for every row before submitting.";return}b.value="",m.value=!0,i.value=!1,w&&w({flag:!0,value:!0}),o("submitted",{answer:N()})}return watchEffect(()=>{switch(r){case"review":m.value=!0,i.value=!1;break;case"exam":m.value=!1,i.value=!1;break;case"tutor":m.value=!1,i.value=!0;break;default:m.value=!1,i.value=!1}}),onUnmounted(()=>{ce(),w&&w({flag:!0,value:!1})}),(k,j)=>(openBlock(),createElementBlock("div",null,[k.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:k.question.intro},null,8,_hoisted_1$d)):createCommentVNode("",!0),E.value?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:k.question.tabs},null,8,["tabs"])):createCommentVNode("",!0),createBaseVNode("div",{innerHTML:k.question.question,class:"question-text"},null,8,_hoisted_2$c),createBaseVNode("table",_hoisted_3$c,[createBaseVNode("thead",_hoisted_4$c,[createBaseVNode("tr",null,[createBaseVNode("th",{class:"p-2 text-left",innerHTML:k.question.table_header||"Option"},null,8,_hoisted_5$c),(openBlock(!0),createElementBlock(Fragment,null,renderList(s.value,(Y,$e)=>(openBlock(),createElementBlock("th",{key:$e,class:"p-2 text-center"},toDisplayString(Y),1))),128))])]),createBaseVNode("tbody",null,[(openBlock(!0),createElementBlock(Fragment,null,renderList(f.value,(Y,$e)=>(openBlock(),createElementBlock("tr",{key:$e,class:"hover:bg-gray-50"},[createBaseVNode("td",_hoisted_6$c,[createBaseVNode("span",_hoisted_7$a,toDisplayString($e)+".",1),createBaseVNode("span",{innerHTML:H(Y)},null,8,_hoisted_8$a)]),(openBlock(!0),createElementBlock(Fragment,null,renderList(s.value,(y,gt)=>(openBlock(),createElementBlock("td",{key:gt,class:"p-2 text-center"},[createBaseVNode("input",{type:"radio",name:String($e),value:String(gt),checked:v[String($e)]===String(gt),disabled:unref(r)==="review",class:normalizeClass(Q(String($e),String(gt))),onChange:it=>ft(String($e),String(gt))},null,42,_hoisted_9$9)]))),128))]))),128))])]),b.value?(openBlock(),createElementBlock("div",_hoisted_10$7,toDisplayString(b.value),1)):createCommentVNode("",!0),i.value?(openBlock(),createElementBlock("div",_hoisted_11$5,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",onClick:U}," Submit ")])):createCommentVNode("",!0),renderSlot(k.$slots,"solution")]))}}),_hoisted_1$c=["innerHTML"],_hoisted_2$b={class:"flex items-start gap-2"},_hoisted_3$b=["src"],_hoisted_4$b=["innerHTML"],_hoisted_5$b={key:1,class:"mt-3 flex justify-end"},_hoisted_6$b=["disabled"],_sfc_main$d=defineComponent({__name:"Highlight",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,r=computed(()=>t.examStore.testMode),a=ref(!1),l=b=>{if(Array.isArray(b))return b.map(m=>String(m));if(typeof b=="string"){if(!b.trim())return[];try{const m=JSON.parse(b);return l(m)}catch{return[b]}}return b==null?[]:[String(b)]},u=b=>Array.from(new Set(b)),s=computed({get:()=>u(l(t.modelValue)),set:b=>o("update:modelValue",u(b))}),f=computed(()=>s.value),d=computed(()=>u(l(t.question.correct_answer))),v=computed(()=>r.value==="review"?!0:r.value==="tutor"?a.value:!1),_=computed(()=>Object.entries(t.question.options||{}).map(([b,m])=>{const i=String((m==null?void 0:m.choice)??"").trim();return{key:b,text:i,textLower:i.toLowerCase()}}).filter(b=>!!b.text).sort((b,m)=>m.text.length-b.text.length)),x=b=>b.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),E=b=>{const m=f.value.includes(b);if(!v.value)return m?"hl-token-selected":"hl-token-idle";const i=d.value.includes(b);return i&&m?"hl-token-correct":i&&!m?"hl-token-missed":!i&&m?"hl-token-wrong":"hl-token-idle"},H=(b,m)=>{if(!b||!_.value.length)return{changed:!1,html:x(b||"")};const i=b.toLowerCase();let T=0,Q=!1,w="";for(;T<b.length;){let N=-1,U=null;for(const j of _.value){const Y=i.indexOf(j.textLower,T);Y!==-1&&(U===null||Y<N||Y===N&&j.text.length>U.text.length)&&(N=Y,U=j)}if(!U||N===-1){w+=x(b.slice(T));break}N>T&&(w+=x(b.slice(T,N)));const k=b.slice(N,N+U.text.length);m.add(U.key),w+=`<span class="hl-token ${E(U.key)}" role="button" tabindex="0" data-hl-key="${x(U.key)}" aria-pressed="${f.value.includes(U.key)}">${x(k)}</span>`,T=N+U.text.length,Q=!0}return{changed:Q,html:w||x(b)}},z=b=>{b.querySelectorAll("#exhibits").forEach(i=>i.remove()),b.querySelectorAll("p,div,span,strong").forEach(i=>{(i.textContent||"").trim().toLowerCase()==="exhibits"&&i.remove()})},ne=computed(()=>{var N;const b=String(t.question.question||"");if(!b)return{html:"",matchedKeys:[]};if(typeof document>"u")return{html:b,matchedKeys:[]};const m=document.createElement("div");m.innerHTML=b,z(m);const i=new Set,T=document.createTreeWalker(m,NodeFilter.SHOW_TEXT),Q=[];let w;for(;w=T.nextNode();)Q.push(w);for(const U of Q){const k=U.nodeValue||"";if(!k.trim())continue;const j=H(k,i);if(!j.changed)continue;const Y=document.createElement("span");Y.innerHTML=j.html,(N=U.parentNode)==null||N.replaceChild(Y,U)}return{html:m.innerHTML,matchedKeys:Array.from(i)}}),yt=computed(()=>ne.value.html),A=b=>{if(r.value==="review"||r.value==="tutor"&&a.value)return;const m=[...s.value],i=m.indexOf(b);i===-1?m.push(b):m.splice(i,1),s.value=m},ce=()=>{r.value==="tutor"&&f.value.length!==0&&(a.value=!0)},R=b=>{const m=b.target,i=m==null?void 0:m.closest("[data-hl-key]"),T=i==null?void 0:i.dataset.hlKey;T&&A(T)},ft=b=>{if(b.key!=="Enter"&&b.key!==" ")return;const m=b.target,i=m==null?void 0:m.closest("[data-hl-key]"),T=i==null?void 0:i.dataset.hlKey;T&&(b.preventDefault(),A(T))};return watch(()=>{var b;return[(b=t.question)==null?void 0:b.id,r.value]},()=>{a.value=!1},{immediate:!0}),(b,m)=>(openBlock(),createElementBlock("div",null,[b.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:b.question.intro},null,8,_hoisted_1$c)):createCommentVNode("",!0),createBaseVNode("div",_hoisted_2$b,[["nclex","cat"].includes(b.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$b)):createCommentVNode("",!0),createBaseVNode("div",{class:"hl-content mb-2 font-base leading-relaxed",onClick:R,onKeydown:ft,innerHTML:yt.value},null,40,_hoisted_4$b)]),r.value==="tutor"&&!a.value?(openBlock(),createElementBlock("div",_hoisted_5$b,[createBaseVNode("button",{type:"button",class:"rounded-full bg-sky-500/95 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60",disabled:f.value.length===0,onClick:ce}," Submit Highlight ",8,_hoisted_6$b)])):createCommentVNode("",!0)]))}}),Highlight=_export_sfc(_sfc_main$d,[["__scopeId","data-v-c76684b1"]]);var rn=Object.defineProperty,Ne=Object.getOwnPropertySymbols,vt=Object.prototype.hasOwnProperty,bt=Object.prototype.propertyIsEnumerable,mt=(e,n,t)=>n in e?rn(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t,fe=(e,n)=>{for(var t in n||(n={}))vt.call(n,t)&&mt(e,t,n[t]);if(Ne)for(var t of Ne(n))bt.call(n,t)&&mt(e,t,n[t]);return e},Ve=(e,n)=>{var t={};for(var o in e)vt.call(e,o)&&n.indexOf(o)<0&&(t[o]=e[o]);if(e!=null&&Ne)for(var o of Ne(e))n.indexOf(o)<0&&bt.call(e,o)&&(t[o]=e[o]);return t};const Bt="[vue-draggable-plus]: ";function gn(e){console.warn(Bt+e)}function mn(e){console.error(Bt+e)}function wt(e,n,t){return t>=0&&t<e.length&&e.splice(t,0,e.splice(n,1)[0]),e}function vn(e){return e.replace(/-(\w)/g,(n,t)=>t?t.toUpperCase():"")}function bn(e){return Object.keys(e).reduce((n,t)=>(typeof e[t]<"u"&&(n[vn(t)]=e[t]),n),{})}function Et(e,n){return Array.isArray(e)&&e.splice(n,1),e}function St(e,n,t){return Array.isArray(e)&&e.splice(n,0,t),e}function yn(e){return typeof e>"u"}function wn(e){return typeof e=="string"}function Dt(e,n,t){const o=e.children[t];e.insertBefore(n,o)}function qe(e){e.parentNode&&e.parentNode.removeChild(e)}function En(e,n=document){var t;let o=null;return typeof(n==null?void 0:n.querySelector)=="function"?o=(t=n==null?void 0:n.querySelector)==null?void 0:t.call(n,e):o=document.querySelector(e),o||gn(`Element not found: ${e}`),o}function Sn(e,n,t=null){return function(...o){return e.apply(t,o),n.apply(t,o)}}function Dn(e,n){const t=fe({},e);return Object.keys(n).forEach(o=>{t[o]?t[o]=Sn(e[o],n[o]):t[o]=n[o]}),t}function _n(e){return e instanceof HTMLElement}function _t(e,n){Object.keys(e).forEach(t=>{n(t,e[t])})}function Tn(e){return e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97)}const Cn=Object.assign;/**!
 * Sortable 1.15.2
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */function Tt(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function te(e){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?Tt(Object(t),!0).forEach(function(o){On(e,o,t[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):Tt(Object(t)).forEach(function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(t,o))})}return e}function Xe(e){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?Xe=function(n){return typeof n}:Xe=function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},Xe(e)}function On(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function re(){return re=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},re.apply(this,arguments)}function In(e,n){if(e==null)return{};var t={},o=Object.keys(e),r,a;for(a=0;a<o.length;a++)r=o[a],!(n.indexOf(r)>=0)&&(t[r]=e[r]);return t}function An(e,n){if(e==null)return{};var t=In(e,n),o,r;if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)o=a[r],!(n.indexOf(o)>=0)&&Object.prototype.propertyIsEnumerable.call(e,o)&&(t[o]=e[o])}return t}var xn="1.15.2";function oe(e){if(typeof window<"u"&&window.navigator)return!!navigator.userAgent.match(e)}var ie=oe(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),Ae=oe(/Edge/i),Ct=oe(/firefox/i),_e=oe(/safari/i)&&!oe(/chrome/i)&&!oe(/android/i),kt=oe(/iP(ad|od|hone)/i),Ht=oe(/chrome/i)&&oe(/android/i),Lt={capture:!1,passive:!1};function D(e,n,t){e.addEventListener(n,t,!ie&&Lt)}function S(e,n,t){e.removeEventListener(n,t,!ie&&Lt)}function Le(e,n){if(n){if(n[0]===">"&&(n=n.substring(1)),e)try{if(e.matches)return e.matches(n);if(e.msMatchesSelector)return e.msMatchesSelector(n);if(e.webkitMatchesSelector)return e.webkitMatchesSelector(n)}catch{return!1}return!1}}function Nn(e){return e.host&&e!==document&&e.host.nodeType?e.host:e.parentNode}function Z(e,n,t,o){if(e){t=t||document;do{if(n!=null&&(n[0]===">"?e.parentNode===t&&Le(e,n):Le(e,n))||o&&e===t)return e;if(e===t)break}while(e=Nn(e))}return null}var Ot=/\s+/g;function V(e,n,t){if(e&&n)if(e.classList)e.classList[t?"add":"remove"](n);else{var o=(" "+e.className+" ").replace(Ot," ").replace(" "+n+" "," ");e.className=(o+(t?" "+n:"")).replace(Ot," ")}}function h(e,n,t){var o=e&&e.style;if(o){if(t===void 0)return document.defaultView&&document.defaultView.getComputedStyle?t=document.defaultView.getComputedStyle(e,""):e.currentStyle&&(t=e.currentStyle),n===void 0?t:t[n];!(n in o)&&n.indexOf("webkit")===-1&&(n="-webkit-"+n),o[n]=t+(typeof t=="string"?"":"px")}}function ye(e,n){var t="";if(typeof e=="string")t=e;else do{var o=h(e,"transform");o&&o!=="none"&&(t=o+" "+t)}while(!n&&(e=e.parentNode));var r=window.DOMMatrix||window.WebKitCSSMatrix||window.CSSMatrix||window.MSCSSMatrix;return r&&new r(t)}function Wt(e,n,t){if(e){var o=e.getElementsByTagName(n),r=0,a=o.length;if(t)for(;r<a;r++)t(o[r],r);return o}return[]}function ee(){var e=document.scrollingElement;return e||document.documentElement}function M(e,n,t,o,r){if(!(!e.getBoundingClientRect&&e!==window)){var a,l,u,s,f,d,v;if(e!==window&&e.parentNode&&e!==ee()?(a=e.getBoundingClientRect(),l=a.top,u=a.left,s=a.bottom,f=a.right,d=a.height,v=a.width):(l=0,u=0,s=window.innerHeight,f=window.innerWidth,d=window.innerHeight,v=window.innerWidth),(n||t)&&e!==window&&(r=r||e.parentNode,!ie))do if(r&&r.getBoundingClientRect&&(h(r,"transform")!=="none"||t&&h(r,"position")!=="static")){var _=r.getBoundingClientRect();l-=_.top+parseInt(h(r,"border-top-width")),u-=_.left+parseInt(h(r,"border-left-width")),s=l+a.height,f=u+a.width;break}while(r=r.parentNode);if(o&&e!==window){var x=ye(r||e),E=x&&x.a,H=x&&x.d;x&&(l/=H,u/=E,v/=E,d/=H,s=l+d,f=u+v)}return{top:l,left:u,bottom:s,right:f,width:v,height:d}}}function It(e,n,t){for(var o=ue(e,!0),r=M(e)[n];o;){var a=M(o)[t],l=void 0;if(l=r>=a,!l)return o;if(o===ee())break;o=ue(o,!1)}return!1}function we(e,n,t,o){for(var r=0,a=0,l=e.children;a<l.length;){if(l[a].style.display!=="none"&&l[a]!==p.ghost&&(o||l[a]!==p.dragged)&&Z(l[a],t.draggable,e,!1)){if(r===n)return l[a];r++}a++}return null}function dt(e,n){for(var t=e.lastElementChild;t&&(t===p.ghost||h(t,"display")==="none"||n&&!Le(t,n));)t=t.previousElementSibling;return t||null}function K(e,n){var t=0;if(!e||!e.parentNode)return-1;for(;e=e.previousElementSibling;)e.nodeName.toUpperCase()!=="TEMPLATE"&&e!==p.clone&&(!n||Le(e,n))&&t++;return t}function At(e){var n=0,t=0,o=ee();if(e)do{var r=ye(e),a=r.a,l=r.d;n+=e.scrollLeft*a,t+=e.scrollTop*l}while(e!==o&&(e=e.parentNode));return[n,t]}function Pn(e,n){for(var t in e)if(e.hasOwnProperty(t)){for(var o in n)if(n.hasOwnProperty(o)&&n[o]===e[t][o])return Number(t)}return-1}function ue(e,n){if(!e||!e.getBoundingClientRect)return ee();var t=e,o=!1;do if(t.clientWidth<t.scrollWidth||t.clientHeight<t.scrollHeight){var r=h(t);if(t.clientWidth<t.scrollWidth&&(r.overflowX=="auto"||r.overflowX=="scroll")||t.clientHeight<t.scrollHeight&&(r.overflowY=="auto"||r.overflowY=="scroll")){if(!t.getBoundingClientRect||t===document.body)return ee();if(o||n)return t;o=!0}}while(t=t.parentNode);return ee()}function Mn(e,n){if(e&&n)for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t]);return e}function Ke(e,n){return Math.round(e.top)===Math.round(n.top)&&Math.round(e.left)===Math.round(n.left)&&Math.round(e.height)===Math.round(n.height)&&Math.round(e.width)===Math.round(n.width)}var Te;function Gt(e,n){return function(){if(!Te){var t=arguments,o=this;t.length===1?e.call(o,t[0]):e.apply(o,t),Te=setTimeout(function(){Te=void 0},n)}}}function Fn(){clearTimeout(Te),Te=void 0}function jt(e,n,t){e.scrollLeft+=n,e.scrollTop+=t}function zt(e){var n=window.Polymer,t=window.jQuery||window.Zepto;return n&&n.dom?n.dom(e).cloneNode(!0):t?t(e).clone(!0)[0]:e.cloneNode(!0)}function Ut(e,n,t){var o={};return Array.from(e.children).forEach(function(r){var a,l,u,s;if(!(!Z(r,n.draggable,e,!1)||r.animated||r===t)){var f=M(r);o.left=Math.min((a=o.left)!==null&&a!==void 0?a:1/0,f.left),o.top=Math.min((l=o.top)!==null&&l!==void 0?l:1/0,f.top),o.right=Math.max((u=o.right)!==null&&u!==void 0?u:-1/0,f.right),o.bottom=Math.max((s=o.bottom)!==null&&s!==void 0?s:-1/0,f.bottom)}}),o.width=o.right-o.left,o.height=o.bottom-o.top,o.x=o.left,o.y=o.top,o}var q="Sortable"+new Date().getTime();function Rn(){var e=[],n;return{captureAnimationState:function(){if(e=[],!!this.options.animation){var t=[].slice.call(this.el.children);t.forEach(function(o){if(!(h(o,"display")==="none"||o===p.ghost)){e.push({target:o,rect:M(o)});var r=te({},e[e.length-1].rect);if(o.thisAnimationDuration){var a=ye(o,!0);a&&(r.top-=a.f,r.left-=a.e)}o.fromRect=r}})}},addAnimationState:function(t){e.push(t)},removeAnimationState:function(t){e.splice(Pn(e,{target:t}),1)},animateAll:function(t){var o=this;if(!this.options.animation){clearTimeout(n),typeof t=="function"&&t();return}var r=!1,a=0;e.forEach(function(l){var u=0,s=l.target,f=s.fromRect,d=M(s),v=s.prevFromRect,_=s.prevToRect,x=l.rect,E=ye(s,!0);E&&(d.top-=E.f,d.left-=E.e),s.toRect=d,s.thisAnimationDuration&&Ke(v,d)&&!Ke(f,d)&&(x.top-d.top)/(x.left-d.left)===(f.top-d.top)/(f.left-d.left)&&(u=Yn(x,v,_,o.options)),Ke(d,f)||(s.prevFromRect=f,s.prevToRect=d,u||(u=o.options.animation),o.animate(s,x,d,u)),u&&(r=!0,a=Math.max(a,u),clearTimeout(s.animationResetTimer),s.animationResetTimer=setTimeout(function(){s.animationTime=0,s.prevFromRect=null,s.fromRect=null,s.prevToRect=null,s.thisAnimationDuration=null},u),s.thisAnimationDuration=u)}),clearTimeout(n),r?n=setTimeout(function(){typeof t=="function"&&t()},a):typeof t=="function"&&t(),e=[]},animate:function(t,o,r,a){if(a){h(t,"transition",""),h(t,"transform","");var l=ye(this.el),u=l&&l.a,s=l&&l.d,f=(o.left-r.left)/(u||1),d=(o.top-r.top)/(s||1);t.animatingX=!!f,t.animatingY=!!d,h(t,"transform","translate3d("+f+"px,"+d+"px,0)"),this.forRepaintDummy=Xn(t),h(t,"transition","transform "+a+"ms"+(this.options.easing?" "+this.options.easing:"")),h(t,"transform","translate3d(0,0,0)"),typeof t.animated=="number"&&clearTimeout(t.animated),t.animated=setTimeout(function(){h(t,"transition",""),h(t,"transform",""),t.animated=!1,t.animatingX=!1,t.animatingY=!1},a)}}}}function Xn(e){return e.offsetWidth}function Yn(e,n,t,o){return Math.sqrt(Math.pow(n.top-e.top,2)+Math.pow(n.left-e.left,2))/Math.sqrt(Math.pow(n.top-t.top,2)+Math.pow(n.left-t.left,2))*o.animation}var ge=[],Je={initializeByDefault:!0},xe={mount:function(e){for(var n in Je)Je.hasOwnProperty(n)&&!(n in e)&&(e[n]=Je[n]);ge.forEach(function(t){if(t.pluginName===e.pluginName)throw"Sortable: Cannot mount plugin ".concat(e.pluginName," more than once")}),ge.push(e)},pluginEvent:function(e,n,t){var o=this;this.eventCanceled=!1,t.cancel=function(){o.eventCanceled=!0};var r=e+"Global";ge.forEach(function(a){n[a.pluginName]&&(n[a.pluginName][r]&&n[a.pluginName][r](te({sortable:n},t)),n.options[a.pluginName]&&n[a.pluginName][e]&&n[a.pluginName][e](te({sortable:n},t)))})},initializePlugins:function(e,n,t,o){ge.forEach(function(l){var u=l.pluginName;if(!(!e.options[u]&&!l.initializeByDefault)){var s=new l(e,n,e.options);s.sortable=e,s.options=e.options,e[u]=s,re(t,s.defaults)}});for(var r in e.options)if(e.options.hasOwnProperty(r)){var a=this.modifyOption(e,r,e.options[r]);typeof a<"u"&&(e.options[r]=a)}},getEventProperties:function(e,n){var t={};return ge.forEach(function(o){typeof o.eventProperties=="function"&&re(t,o.eventProperties.call(n[o.pluginName],e))}),t},modifyOption:function(e,n,t){var o;return ge.forEach(function(r){e[r.pluginName]&&r.optionListeners&&typeof r.optionListeners[n]=="function"&&(o=r.optionListeners[n].call(e[r.pluginName],t))}),o}};function Bn(e){var n=e.sortable,t=e.rootEl,o=e.name,r=e.targetEl,a=e.cloneEl,l=e.toEl,u=e.fromEl,s=e.oldIndex,f=e.newIndex,d=e.oldDraggableIndex,v=e.newDraggableIndex,_=e.originalEvent,x=e.putSortable,E=e.extraEventProperties;if(n=n||t&&t[q],!!n){var H,z=n.options,ne="on"+o.charAt(0).toUpperCase()+o.substr(1);window.CustomEvent&&!ie&&!Ae?H=new CustomEvent(o,{bubbles:!0,cancelable:!0}):(H=document.createEvent("Event"),H.initEvent(o,!0,!0)),H.to=l||t,H.from=u||t,H.item=r||t,H.clone=a,H.oldIndex=s,H.newIndex=f,H.oldDraggableIndex=d,H.newDraggableIndex=v,H.originalEvent=_,H.pullMode=x?x.lastPutMode:void 0;var yt=te(te({},E),xe.getEventProperties(o,n));for(var A in yt)H[A]=yt[A];t&&t.dispatchEvent(H),z[ne]&&z[ne].call(n,H)}}var kn=["evt"],G=function(e,n){var t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},o=t.evt,r=An(t,kn);xe.pluginEvent.bind(p)(e,n,te({dragEl:c,parentEl:I,ghostEl:g,rootEl:C,nextEl:pe,lastDownEl:Ye,cloneEl:O,cloneHidden:se,dragStarted:Ee,putSortable:X,activeSortable:p.active,originalEvent:o,oldIndex:be,oldDraggableIndex:Ce,newIndex:$,newDraggableIndex:le,hideGhostForTarget:Kt,unhideGhostForTarget:Jt,cloneNowHidden:function(){se=!0},cloneNowShown:function(){se=!1},dispatchSortableEvent:function(a){W({sortable:n,name:a,originalEvent:o})}},r))};function W(e){Bn(te({putSortable:X,cloneEl:O,targetEl:c,rootEl:C,oldIndex:be,oldDraggableIndex:Ce,newIndex:$,newDraggableIndex:le},e))}var c,I,g,C,pe,Ye,O,se,be,$,Ce,le,Pe,X,ve=!1,We=!1,Ge=[],de,J,Ze,Qe,xt,Nt,Ee,me,Oe,Ie=!1,Me=!1,Be,B,et=[],at=!1,je=[],Ue=typeof document<"u",Fe=kt,Pt=Ae||ie?"cssFloat":"float",Hn=Ue&&!Ht&&!kt&&"draggable"in document.createElement("div"),Vt=function(){if(Ue){if(ie)return!1;var e=document.createElement("x");return e.style.cssText="pointer-events:auto",e.style.pointerEvents==="auto"}}(),$t=function(e,n){var t=h(e),o=parseInt(t.width)-parseInt(t.paddingLeft)-parseInt(t.paddingRight)-parseInt(t.borderLeftWidth)-parseInt(t.borderRightWidth),r=we(e,0,n),a=we(e,1,n),l=r&&h(r),u=a&&h(a),s=l&&parseInt(l.marginLeft)+parseInt(l.marginRight)+M(r).width,f=u&&parseInt(u.marginLeft)+parseInt(u.marginRight)+M(a).width;if(t.display==="flex")return t.flexDirection==="column"||t.flexDirection==="column-reverse"?"vertical":"horizontal";if(t.display==="grid")return t.gridTemplateColumns.split(" ").length<=1?"vertical":"horizontal";if(r&&l.float&&l.float!=="none"){var d=l.float==="left"?"left":"right";return a&&(u.clear==="both"||u.clear===d)?"vertical":"horizontal"}return r&&(l.display==="block"||l.display==="flex"||l.display==="table"||l.display==="grid"||s>=o&&t[Pt]==="none"||a&&t[Pt]==="none"&&s+f>o)?"vertical":"horizontal"},Ln=function(e,n,t){var o=t?e.left:e.top,r=t?e.right:e.bottom,a=t?e.width:e.height,l=t?n.left:n.top,u=t?n.right:n.bottom,s=t?n.width:n.height;return o===l||r===u||o+a/2===l+s/2},Wn=function(e,n){var t;return Ge.some(function(o){var r=o[q].options.emptyInsertThreshold;if(!(!r||dt(o))){var a=M(o),l=e>=a.left-r&&e<=a.right+r,u=n>=a.top-r&&n<=a.bottom+r;if(l&&u)return t=o}}),t},qt=function(e){function n(r,a){return function(l,u,s,f){var d=l.options.group.name&&u.options.group.name&&l.options.group.name===u.options.group.name;if(r==null&&(a||d))return!0;if(r==null||r===!1)return!1;if(a&&r==="clone")return r;if(typeof r=="function")return n(r(l,u,s,f),a)(l,u,s,f);var v=(a?l:u).options.group.name;return r===!0||typeof r=="string"&&r===v||r.join&&r.indexOf(v)>-1}}var t={},o=e.group;(!o||Xe(o)!="object")&&(o={name:o}),t.name=o.name,t.checkPull=n(o.pull,!0),t.checkPut=n(o.put),t.revertClone=o.revertClone,e.group=t},Kt=function(){!Vt&&g&&h(g,"display","none")},Jt=function(){!Vt&&g&&h(g,"display","")};Ue&&!Ht&&document.addEventListener("click",function(e){if(We)return e.preventDefault(),e.stopPropagation&&e.stopPropagation(),e.stopImmediatePropagation&&e.stopImmediatePropagation(),We=!1,!1},!0);var he=function(e){if(c){e=e.touches?e.touches[0]:e;var n=Wn(e.clientX,e.clientY);if(n){var t={};for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.target=t.rootEl=n,t.preventDefault=void 0,t.stopPropagation=void 0,n[q]._onDragOver(t)}}},Gn=function(e){c&&c.parentNode[q]._isOutsideThisEl(e.target)};function p(e,n){if(!(e&&e.nodeType&&e.nodeType===1))throw"Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));this.el=e,this.options=n=re({},n),e[q]=this;var t={group:null,sort:!0,disabled:!1,store:null,handle:null,draggable:/^[uo]l$/i.test(e.nodeName)?">li":">*",swapThreshold:1,invertSwap:!1,invertedSwapThreshold:null,removeCloneOnHide:!0,direction:function(){return $t(e,this.options)},ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,preventOnFilter:!0,animation:0,easing:null,setData:function(a,l){a.setData("Text",l.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,delayOnTouchOnly:!1,touchStartThreshold:(Number.parseInt?Number:window).parseInt(window.devicePixelRatio,10)||1,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0},supportPointer:p.supportPointer!==!1&&"PointerEvent"in window&&!_e,emptyInsertThreshold:5};xe.initializePlugins(this,e,t);for(var o in t)!(o in n)&&(n[o]=t[o]);qt(n);for(var r in this)r.charAt(0)==="_"&&typeof this[r]=="function"&&(this[r]=this[r].bind(this));this.nativeDraggable=n.forceFallback?!1:Hn,this.nativeDraggable&&(this.options.touchStartThreshold=1),n.supportPointer?D(e,"pointerdown",this._onTapStart):(D(e,"mousedown",this._onTapStart),D(e,"touchstart",this._onTapStart)),this.nativeDraggable&&(D(e,"dragover",this),D(e,"dragenter",this)),Ge.push(this.el),n.store&&n.store.get&&this.sort(n.store.get(this)||[]),re(this,Rn())}p.prototype={constructor:p,_isOutsideThisEl:function(e){!this.el.contains(e)&&e!==this.el&&(me=null)},_getDirection:function(e,n){return typeof this.options.direction=="function"?this.options.direction.call(this,e,n,c):this.options.direction},_onTapStart:function(e){if(e.cancelable){var n=this,t=this.el,o=this.options,r=o.preventOnFilter,a=e.type,l=e.touches&&e.touches[0]||e.pointerType&&e.pointerType==="touch"&&e,u=(l||e).target,s=e.target.shadowRoot&&(e.path&&e.path[0]||e.composedPath&&e.composedPath()[0])||u,f=o.filter;if(Jn(t),!c&&!(/mousedown|pointerdown/.test(a)&&e.button!==0||o.disabled)&&!s.isContentEditable&&!(!this.nativeDraggable&&_e&&u&&u.tagName.toUpperCase()==="SELECT")&&(u=Z(u,o.draggable,t,!1),!(u&&u.animated)&&Ye!==u)){if(be=K(u),Ce=K(u,o.draggable),typeof f=="function"){if(f.call(this,e,u,this)){W({sortable:n,rootEl:s,name:"filter",targetEl:u,toEl:t,fromEl:t}),G("filter",n,{evt:e}),r&&e.cancelable&&e.preventDefault();return}}else if(f&&(f=f.split(",").some(function(d){if(d=Z(s,d.trim(),t,!1),d)return W({sortable:n,rootEl:d,name:"filter",targetEl:u,fromEl:t,toEl:t}),G("filter",n,{evt:e}),!0}),f)){r&&e.cancelable&&e.preventDefault();return}o.handle&&!Z(s,o.handle,t,!1)||this._prepareDragStart(e,l,u)}}},_prepareDragStart:function(e,n,t){var o=this,r=o.el,a=o.options,l=r.ownerDocument,u;if(t&&!c&&t.parentNode===r){var s=M(t);if(C=r,c=t,I=c.parentNode,pe=c.nextSibling,Ye=t,Pe=a.group,p.dragged=c,de={target:c,clientX:(n||e).clientX,clientY:(n||e).clientY},xt=de.clientX-s.left,Nt=de.clientY-s.top,this._lastX=(n||e).clientX,this._lastY=(n||e).clientY,c.style["will-change"]="all",u=function(){if(G("delayEnded",o,{evt:e}),p.eventCanceled){o._onDrop();return}o._disableDelayedDragEvents(),!Ct&&o.nativeDraggable&&(c.draggable=!0),o._triggerDragStart(e,n),W({sortable:o,name:"choose",originalEvent:e}),V(c,a.chosenClass,!0)},a.ignore.split(",").forEach(function(f){Wt(c,f.trim(),tt)}),D(l,"dragover",he),D(l,"mousemove",he),D(l,"touchmove",he),D(l,"mouseup",o._onDrop),D(l,"touchend",o._onDrop),D(l,"touchcancel",o._onDrop),Ct&&this.nativeDraggable&&(this.options.touchStartThreshold=4,c.draggable=!0),G("delayStart",this,{evt:e}),a.delay&&(!a.delayOnTouchOnly||n)&&(!this.nativeDraggable||!(Ae||ie))){if(p.eventCanceled){this._onDrop();return}D(l,"mouseup",o._disableDelayedDrag),D(l,"touchend",o._disableDelayedDrag),D(l,"touchcancel",o._disableDelayedDrag),D(l,"mousemove",o._delayedDragTouchMoveHandler),D(l,"touchmove",o._delayedDragTouchMoveHandler),a.supportPointer&&D(l,"pointermove",o._delayedDragTouchMoveHandler),o._dragStartTimer=setTimeout(u,a.delay)}else u()}},_delayedDragTouchMoveHandler:function(e){var n=e.touches?e.touches[0]:e;Math.max(Math.abs(n.clientX-this._lastX),Math.abs(n.clientY-this._lastY))>=Math.floor(this.options.touchStartThreshold/(this.nativeDraggable&&window.devicePixelRatio||1))&&this._disableDelayedDrag()},_disableDelayedDrag:function(){c&&tt(c),clearTimeout(this._dragStartTimer),this._disableDelayedDragEvents()},_disableDelayedDragEvents:function(){var e=this.el.ownerDocument;S(e,"mouseup",this._disableDelayedDrag),S(e,"touchend",this._disableDelayedDrag),S(e,"touchcancel",this._disableDelayedDrag),S(e,"mousemove",this._delayedDragTouchMoveHandler),S(e,"touchmove",this._delayedDragTouchMoveHandler),S(e,"pointermove",this._delayedDragTouchMoveHandler)},_triggerDragStart:function(e,n){n=n||e.pointerType=="touch"&&e,!this.nativeDraggable||n?this.options.supportPointer?D(document,"pointermove",this._onTouchMove):n?D(document,"touchmove",this._onTouchMove):D(document,"mousemove",this._onTouchMove):(D(c,"dragend",this),D(C,"dragstart",this._onDragStart));try{document.selection?ke(function(){document.selection.empty()}):window.getSelection().removeAllRanges()}catch{}},_dragStarted:function(e,n){if(ve=!1,C&&c){G("dragStarted",this,{evt:n}),this.nativeDraggable&&D(document,"dragover",Gn);var t=this.options;!e&&V(c,t.dragClass,!1),V(c,t.ghostClass,!0),p.active=this,e&&this._appendGhost(),W({sortable:this,name:"start",originalEvent:n})}else this._nulling()},_emulateDragOver:function(){if(J){this._lastX=J.clientX,this._lastY=J.clientY,Kt();for(var e=document.elementFromPoint(J.clientX,J.clientY),n=e;e&&e.shadowRoot&&(e=e.shadowRoot.elementFromPoint(J.clientX,J.clientY),e!==n);)n=e;if(c.parentNode[q]._isOutsideThisEl(e),n)do{if(n[q]){var t=void 0;if(t=n[q]._onDragOver({clientX:J.clientX,clientY:J.clientY,target:e,rootEl:n}),t&&!this.options.dragoverBubble)break}e=n}while(n=n.parentNode);Jt()}},_onTouchMove:function(e){if(de){var n=this.options,t=n.fallbackTolerance,o=n.fallbackOffset,r=e.touches?e.touches[0]:e,a=g&&ye(g,!0),l=g&&a&&a.a,u=g&&a&&a.d,s=Fe&&B&&At(B),f=(r.clientX-de.clientX+o.x)/(l||1)+(s?s[0]-et[0]:0)/(l||1),d=(r.clientY-de.clientY+o.y)/(u||1)+(s?s[1]-et[1]:0)/(u||1);if(!p.active&&!ve){if(t&&Math.max(Math.abs(r.clientX-this._lastX),Math.abs(r.clientY-this._lastY))<t)return;this._onDragStart(e,!0)}if(g){a?(a.e+=f-(Ze||0),a.f+=d-(Qe||0)):a={a:1,b:0,c:0,d:1,e:f,f:d};var v="matrix(".concat(a.a,",").concat(a.b,",").concat(a.c,",").concat(a.d,",").concat(a.e,",").concat(a.f,")");h(g,"webkitTransform",v),h(g,"mozTransform",v),h(g,"msTransform",v),h(g,"transform",v),Ze=f,Qe=d,J=r}e.cancelable&&e.preventDefault()}},_appendGhost:function(){if(!g){var e=this.options.fallbackOnBody?document.body:C,n=M(c,!0,Fe,!0,e),t=this.options;if(Fe){for(B=e;h(B,"position")==="static"&&h(B,"transform")==="none"&&B!==document;)B=B.parentNode;B!==document.body&&B!==document.documentElement?(B===document&&(B=ee()),n.top+=B.scrollTop,n.left+=B.scrollLeft):B=ee(),et=At(B)}g=c.cloneNode(!0),V(g,t.ghostClass,!1),V(g,t.fallbackClass,!0),V(g,t.dragClass,!0),h(g,"transition",""),h(g,"transform",""),h(g,"box-sizing","border-box"),h(g,"margin",0),h(g,"top",n.top),h(g,"left",n.left),h(g,"width",n.width),h(g,"height",n.height),h(g,"opacity","0.8"),h(g,"position",Fe?"absolute":"fixed"),h(g,"zIndex","100000"),h(g,"pointerEvents","none"),p.ghost=g,e.appendChild(g),h(g,"transform-origin",xt/parseInt(g.style.width)*100+"% "+Nt/parseInt(g.style.height)*100+"%")}},_onDragStart:function(e,n){var t=this,o=e.dataTransfer,r=t.options;if(G("dragStart",this,{evt:e}),p.eventCanceled){this._onDrop();return}G("setupClone",this),p.eventCanceled||(O=zt(c),O.removeAttribute("id"),O.draggable=!1,O.style["will-change"]="",this._hideClone(),V(O,this.options.chosenClass,!1),p.clone=O),t.cloneId=ke(function(){G("clone",t),!p.eventCanceled&&(t.options.removeCloneOnHide||C.insertBefore(O,c),t._hideClone(),W({sortable:t,name:"clone"}))}),!n&&V(c,r.dragClass,!0),n?(We=!0,t._loopId=setInterval(t._emulateDragOver,50)):(S(document,"mouseup",t._onDrop),S(document,"touchend",t._onDrop),S(document,"touchcancel",t._onDrop),o&&(o.effectAllowed="move",r.setData&&r.setData.call(t,o,c)),D(document,"drop",t),h(c,"transform","translateZ(0)")),ve=!0,t._dragStartId=ke(t._dragStarted.bind(t,n,e)),D(document,"selectstart",t),Ee=!0,_e&&h(document.body,"user-select","none")},_onDragOver:function(e){var n=this.el,t=e.target,o,r,a,l=this.options,u=l.group,s=p.active,f=Pe===u,d=l.sort,v=X||s,_,x=this,E=!1;if(at)return;function H(Y,$e){G(Y,x,te({evt:e,isOwner:f,axis:_?"vertical":"horizontal",revert:a,dragRect:o,targetRect:r,canSort:d,fromSortable:v,target:t,completed:ne,onMove:function(y,gt){return Re(C,n,c,o,y,M(y),e,gt)},changed:yt},$e))}function z(){H("dragOverAnimationCapture"),x.captureAnimationState(),x!==v&&v.captureAnimationState()}function ne(Y){return H("dragOverCompleted",{insertion:Y}),Y&&(f?s._hideClone():s._showClone(x),x!==v&&(V(c,X?X.options.ghostClass:s.options.ghostClass,!1),V(c,l.ghostClass,!0)),X!==x&&x!==p.active?X=x:x===p.active&&X&&(X=null),v===x&&(x._ignoreWhileAnimating=t),x.animateAll(function(){H("dragOverAnimationComplete"),x._ignoreWhileAnimating=null}),x!==v&&(v.animateAll(),v._ignoreWhileAnimating=null)),(t===c&&!c.animated||t===n&&!t.animated)&&(me=null),!l.dragoverBubble&&!e.rootEl&&t!==document&&(c.parentNode[q]._isOutsideThisEl(e.target),!Y&&he(e)),!l.dragoverBubble&&e.stopPropagation&&e.stopPropagation(),E=!0}function yt(){$=K(c),le=K(c,l.draggable),W({sortable:x,name:"change",toEl:n,newIndex:$,newDraggableIndex:le,originalEvent:e})}if(e.preventDefault!==void 0&&e.cancelable&&e.preventDefault(),t=Z(t,l.draggable,n,!0),H("dragOver"),p.eventCanceled)return E;if(c.contains(e.target)||t.animated&&t.animatingX&&t.animatingY||x._ignoreWhileAnimating===t)return ne(!1);if(We=!1,s&&!l.disabled&&(f?d||(a=I!==C):X===this||(this.lastPutMode=Pe.checkPull(this,s,c,e))&&u.checkPut(this,s,c,e))){if(_=this._getDirection(e,t)==="vertical",o=M(c),H("dragOverValid"),p.eventCanceled)return E;if(a)return I=C,z(),this._hideClone(),H("revert"),p.eventCanceled||(pe?C.insertBefore(c,pe):C.appendChild(c)),ne(!0);var A=dt(n,l.draggable);if(!A||Vn(e,_,this)&&!A.animated){if(A===c)return ne(!1);if(A&&n===e.target&&(t=A),t&&(r=M(t)),Re(C,n,c,o,t,r,e,!!t)!==!1)return z(),A&&A.nextSibling?n.insertBefore(c,A.nextSibling):n.appendChild(c),I=n,yt(),ne(!0)}else if(A&&Un(e,_,this)){var ce=we(n,0,l,!0);if(ce===c)return ne(!1);if(t=ce,r=M(t),Re(C,n,c,o,t,r,e,!1)!==!1)return z(),n.insertBefore(c,ce),I=n,yt(),ne(!0)}else if(t.parentNode===n){r=M(t);var R=0,ft,b=c.parentNode!==n,m=!Ln(c.animated&&c.toRect||o,t.animated&&t.toRect||r,_),i=_?"top":"left",T=It(t,"top","top")||It(c,"top","top"),Q=T?T.scrollTop:void 0;me!==t&&(ft=r[i],Ie=!1,Me=!m&&l.invertSwap||b),R=$n(e,t,r,_,m?1:l.swapThreshold,l.invertedSwapThreshold==null?l.swapThreshold:l.invertedSwapThreshold,Me,me===t);var w;if(R!==0){var N=K(c);do N-=R,w=I.children[N];while(w&&(h(w,"display")==="none"||w===g))}if(R===0||w===t)return ne(!1);me=t,Oe=R;var U=t.nextElementSibling,k=!1;k=R===1;var j=Re(C,n,c,o,t,r,e,k);if(j!==!1)return(j===1||j===-1)&&(k=j===1),at=!0,setTimeout(zn,30),z(),k&&!U?n.appendChild(c):t.parentNode.insertBefore(c,k?U:t),T&&jt(T,0,Q-T.scrollTop),I=c.parentNode,ft!==void 0&&!Me&&(Be=Math.abs(ft-M(t)[i])),yt(),ne(!0)}if(n.contains(c))return ne(!1)}return!1},_ignoreWhileAnimating:null,_offMoveEvents:function(){S(document,"mousemove",this._onTouchMove),S(document,"touchmove",this._onTouchMove),S(document,"pointermove",this._onTouchMove),S(document,"dragover",he),S(document,"mousemove",he),S(document,"touchmove",he)},_offUpEvents:function(){var e=this.el.ownerDocument;S(e,"mouseup",this._onDrop),S(e,"touchend",this._onDrop),S(e,"pointerup",this._onDrop),S(e,"touchcancel",this._onDrop),S(document,"selectstart",this)},_onDrop:function(e){var n=this.el,t=this.options;if($=K(c),le=K(c,t.draggable),G("drop",this,{evt:e}),I=c&&c.parentNode,$=K(c),le=K(c,t.draggable),p.eventCanceled){this._nulling();return}ve=!1,Me=!1,Ie=!1,clearInterval(this._loopId),clearTimeout(this._dragStartTimer),lt(this.cloneId),lt(this._dragStartId),this.nativeDraggable&&(S(document,"drop",this),S(n,"dragstart",this._onDragStart)),this._offMoveEvents(),this._offUpEvents(),_e&&h(document.body,"user-select",""),h(c,"transform",""),e&&(Ee&&(e.cancelable&&e.preventDefault(),!t.dropBubble&&e.stopPropagation()),g&&g.parentNode&&g.parentNode.removeChild(g),(C===I||X&&X.lastPutMode!=="clone")&&O&&O.parentNode&&O.parentNode.removeChild(O),c&&(this.nativeDraggable&&S(c,"dragend",this),tt(c),c.style["will-change"]="",Ee&&!ve&&V(c,X?X.options.ghostClass:this.options.ghostClass,!1),V(c,this.options.chosenClass,!1),W({sortable:this,name:"unchoose",toEl:I,newIndex:null,newDraggableIndex:null,originalEvent:e}),C!==I?($>=0&&(W({rootEl:I,name:"add",toEl:I,fromEl:C,originalEvent:e}),W({sortable:this,name:"remove",toEl:I,originalEvent:e}),W({rootEl:I,name:"sort",toEl:I,fromEl:C,originalEvent:e}),W({sortable:this,name:"sort",toEl:I,originalEvent:e})),X&&X.save()):$!==be&&$>=0&&(W({sortable:this,name:"update",toEl:I,originalEvent:e}),W({sortable:this,name:"sort",toEl:I,originalEvent:e})),p.active&&(($==null||$===-1)&&($=be,le=Ce),W({sortable:this,name:"end",toEl:I,originalEvent:e}),this.save()))),this._nulling()},_nulling:function(){G("nulling",this),C=c=I=g=pe=O=Ye=se=de=J=Ee=$=le=be=Ce=me=Oe=X=Pe=p.dragged=p.ghost=p.clone=p.active=null,je.forEach(function(e){e.checked=!0}),je.length=Ze=Qe=0},handleEvent:function(e){switch(e.type){case"drop":case"dragend":this._onDrop(e);break;case"dragenter":case"dragover":c&&(this._onDragOver(e),jn(e));break;case"selectstart":e.preventDefault();break}},toArray:function(){for(var e=[],n,t=this.el.children,o=0,r=t.length,a=this.options;o<r;o++)n=t[o],Z(n,a.draggable,this.el,!1)&&e.push(n.getAttribute(a.dataIdAttr)||Kn(n));return e},sort:function(e,n){var t={},o=this.el;this.toArray().forEach(function(r,a){var l=o.children[a];Z(l,this.options.draggable,o,!1)&&(t[r]=l)},this),n&&this.captureAnimationState(),e.forEach(function(r){t[r]&&(o.removeChild(t[r]),o.appendChild(t[r]))}),n&&this.animateAll()},save:function(){var e=this.options.store;e&&e.set&&e.set(this)},closest:function(e,n){return Z(e,n||this.options.draggable,this.el,!1)},option:function(e,n){var t=this.options;if(n===void 0)return t[e];var o=xe.modifyOption(this,e,n);typeof o<"u"?t[e]=o:t[e]=n,e==="group"&&qt(t)},destroy:function(){G("destroy",this);var e=this.el;e[q]=null,S(e,"mousedown",this._onTapStart),S(e,"touchstart",this._onTapStart),S(e,"pointerdown",this._onTapStart),this.nativeDraggable&&(S(e,"dragover",this),S(e,"dragenter",this)),Array.prototype.forEach.call(e.querySelectorAll("[draggable]"),function(n){n.removeAttribute("draggable")}),this._onDrop(),this._disableDelayedDragEvents(),Ge.splice(Ge.indexOf(this.el),1),this.el=e=null},_hideClone:function(){if(!se){if(G("hideClone",this),p.eventCanceled)return;h(O,"display","none"),this.options.removeCloneOnHide&&O.parentNode&&O.parentNode.removeChild(O),se=!0}},_showClone:function(e){if(e.lastPutMode!=="clone"){this._hideClone();return}if(se){if(G("showClone",this),p.eventCanceled)return;c.parentNode==C&&!this.options.group.revertClone?C.insertBefore(O,c):pe?C.insertBefore(O,pe):C.appendChild(O),this.options.group.revertClone&&this.animate(c,O),h(O,"display",""),se=!1}}};function jn(e){e.dataTransfer&&(e.dataTransfer.dropEffect="move"),e.cancelable&&e.preventDefault()}function Re(e,n,t,o,r,a,l,u){var s,f=e[q],d=f.options.onMove,v;return window.CustomEvent&&!ie&&!Ae?s=new CustomEvent("move",{bubbles:!0,cancelable:!0}):(s=document.createEvent("Event"),s.initEvent("move",!0,!0)),s.to=n,s.from=e,s.dragged=t,s.draggedRect=o,s.related=r||n,s.relatedRect=a||M(n),s.willInsertAfter=u,s.originalEvent=l,e.dispatchEvent(s),d&&(v=d.call(f,s,l)),v}function tt(e){e.draggable=!1}function zn(){at=!1}function Un(e,n,t){var o=M(we(t.el,0,t.options,!0)),r=Ut(t.el,t.options,g),a=10;return n?e.clientX<r.left-a||e.clientY<o.top&&e.clientX<o.right:e.clientY<r.top-a||e.clientY<o.bottom&&e.clientX<o.left}function Vn(e,n,t){var o=M(dt(t.el,t.options.draggable)),r=Ut(t.el,t.options,g),a=10;return n?e.clientX>r.right+a||e.clientY>o.bottom&&e.clientX>o.left:e.clientY>r.bottom+a||e.clientX>o.right&&e.clientY>o.top}function $n(e,n,t,o,r,a,l,u){var s=o?e.clientY:e.clientX,f=o?t.height:t.width,d=o?t.top:t.left,v=o?t.bottom:t.right,_=!1;if(!l){if(u&&Be<f*r){if(!Ie&&(Oe===1?s>d+f*a/2:s<v-f*a/2)&&(Ie=!0),Ie)_=!0;else if(Oe===1?s<d+Be:s>v-Be)return-Oe}else if(s>d+f*(1-r)/2&&s<v-f*(1-r)/2)return qn(n)}return _=_||l,_&&(s<d+f*a/2||s>v-f*a/2)?s>d+f/2?1:-1:0}function qn(e){return K(c)<K(e)?1:-1}function Kn(e){for(var n=e.tagName+e.className+e.src+e.href+e.textContent,t=n.length,o=0;t--;)o+=n.charCodeAt(t);return o.toString(36)}function Jn(e){je.length=0;for(var n=e.getElementsByTagName("input"),t=n.length;t--;){var o=n[t];o.checked&&je.push(o)}}function ke(e){return setTimeout(e,0)}function lt(e){return clearTimeout(e)}Ue&&D(document,"touchmove",function(e){(p.active||ve)&&e.cancelable&&e.preventDefault()});p.utils={on:D,off:S,css:h,find:Wt,is:function(e,n){return!!Z(e,n,e,!1)},extend:Mn,throttle:Gt,closest:Z,toggleClass:V,clone:zt,index:K,nextTick:ke,cancelNextTick:lt,detectDirection:$t,getChild:we};p.get=function(e){return e[q]};p.mount=function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];n[0].constructor===Array&&(n=n[0]),n.forEach(function(o){if(!o.prototype||!o.prototype.constructor)throw"Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(o));o.utils&&(p.utils=te(te({},p.utils),o.utils)),xe.mount(o)})};p.create=function(e,n){return new p(e,n)};p.version=xn;var P=[],Se,st,ut=!1,nt,ot,ze,De;function Zn(){function e(){this.defaults={scroll:!0,forceAutoScrollFallback:!1,scrollSensitivity:30,scrollSpeed:10,bubbleScroll:!0};for(var n in this)n.charAt(0)==="_"&&typeof this[n]=="function"&&(this[n]=this[n].bind(this))}return e.prototype={dragStarted:function(n){var t=n.originalEvent;this.sortable.nativeDraggable?D(document,"dragover",this._handleAutoScroll):this.options.supportPointer?D(document,"pointermove",this._handleFallbackAutoScroll):t.touches?D(document,"touchmove",this._handleFallbackAutoScroll):D(document,"mousemove",this._handleFallbackAutoScroll)},dragOverCompleted:function(n){var t=n.originalEvent;!this.options.dragOverBubble&&!t.rootEl&&this._handleAutoScroll(t)},drop:function(){this.sortable.nativeDraggable?S(document,"dragover",this._handleAutoScroll):(S(document,"pointermove",this._handleFallbackAutoScroll),S(document,"touchmove",this._handleFallbackAutoScroll),S(document,"mousemove",this._handleFallbackAutoScroll)),Mt(),He(),Fn()},nulling:function(){ze=st=Se=ut=De=nt=ot=null,P.length=0},_handleFallbackAutoScroll:function(n){this._handleAutoScroll(n,!0)},_handleAutoScroll:function(n,t){var o=this,r=(n.touches?n.touches[0]:n).clientX,a=(n.touches?n.touches[0]:n).clientY,l=document.elementFromPoint(r,a);if(ze=n,t||this.options.forceAutoScrollFallback||Ae||ie||_e){rt(n,this.options,l,t);var u=ue(l,!0);ut&&(!De||r!==nt||a!==ot)&&(De&&Mt(),De=setInterval(function(){var s=ue(document.elementFromPoint(r,a),!0);s!==u&&(u=s,He()),rt(n,o.options,s,t)},10),nt=r,ot=a)}else{if(!this.options.bubbleScroll||ue(l,!0)===ee()){He();return}rt(n,this.options,ue(l,!1),!1)}}},re(e,{pluginName:"scroll",initializeByDefault:!0})}function He(){P.forEach(function(e){clearInterval(e.pid)}),P=[]}function Mt(){clearInterval(De)}var rt=Gt(function(e,n,t,o){if(n.scroll){var r=(e.touches?e.touches[0]:e).clientX,a=(e.touches?e.touches[0]:e).clientY,l=n.scrollSensitivity,u=n.scrollSpeed,s=ee(),f=!1,d;st!==t&&(st=t,He(),Se=n.scroll,d=n.scrollFn,Se===!0&&(Se=ue(t,!0)));var v=0,_=Se;do{var x=_,E=M(x),H=E.top,z=E.bottom,ne=E.left,yt=E.right,A=E.width,ce=E.height,R=void 0,ft=void 0,b=x.scrollWidth,m=x.scrollHeight,i=h(x),T=x.scrollLeft,Q=x.scrollTop;x===s?(R=A<b&&(i.overflowX==="auto"||i.overflowX==="scroll"||i.overflowX==="visible"),ft=ce<m&&(i.overflowY==="auto"||i.overflowY==="scroll"||i.overflowY==="visible")):(R=A<b&&(i.overflowX==="auto"||i.overflowX==="scroll"),ft=ce<m&&(i.overflowY==="auto"||i.overflowY==="scroll"));var w=R&&(Math.abs(yt-r)<=l&&T+A<b)-(Math.abs(ne-r)<=l&&!!T),N=ft&&(Math.abs(z-a)<=l&&Q+ce<m)-(Math.abs(H-a)<=l&&!!Q);if(!P[v])for(var U=0;U<=v;U++)P[U]||(P[U]={});(P[v].vx!=w||P[v].vy!=N||P[v].el!==x)&&(P[v].el=x,P[v].vx=w,P[v].vy=N,clearInterval(P[v].pid),(w!=0||N!=0)&&(f=!0,P[v].pid=setInterval((function(){o&&this.layer===0&&p.active._onTouchMove(ze);var k=P[this.layer].vy?P[this.layer].vy*u:0,j=P[this.layer].vx?P[this.layer].vx*u:0;typeof d=="function"&&d.call(p.dragged.parentNode[q],j,k,e,ze,P[this.layer].el)!=="continue"||jt(P[this.layer].el,j,k)}).bind({layer:v}),24))),v++}while(n.bubbleScroll&&_!==s&&(_=ue(_,!1)));ut=f}},30),Zt=function(e){var n=e.originalEvent,t=e.putSortable,o=e.dragEl,r=e.activeSortable,a=e.dispatchSortableEvent,l=e.hideGhostForTarget,u=e.unhideGhostForTarget;if(n){var s=t||r;l();var f=n.changedTouches&&n.changedTouches.length?n.changedTouches[0]:n,d=document.elementFromPoint(f.clientX,f.clientY);u(),s&&!s.el.contains(d)&&(a("spill"),this.onSpill({dragEl:o,putSortable:t}))}};function ht(){}ht.prototype={startIndex:null,dragStart:function(e){var n=e.oldDraggableIndex;this.startIndex=n},onSpill:function(e){var n=e.dragEl,t=e.putSortable;this.sortable.captureAnimationState(),t&&t.captureAnimationState();var o=we(this.sortable.el,this.startIndex,this.options);o?this.sortable.el.insertBefore(n,o):this.sortable.el.appendChild(n),this.sortable.animateAll(),t&&t.animateAll()},drop:Zt};re(ht,{pluginName:"revertOnSpill"});function pt(){}pt.prototype={onSpill:function(e){var n=e.dragEl,t=e.putSortable,o=t||this.sortable;o.captureAnimationState(),n.parentNode&&n.parentNode.removeChild(n),o.animateAll()},drop:Zt};re(pt,{pluginName:"removeOnSpill"});p.mount(new Zn);p.mount(pt,ht);function Qn(e){return e==null?e:JSON.parse(JSON.stringify(e))}function eo(e){getCurrentInstance()&&onUnmounted(e)}function to(e){getCurrentInstance()?onMounted(e):nextTick(e)}let Qt=null,en=null;function Ft(e=null,n=null){Qt=e,en=n}function no(){return{data:Qt,clonedData:en}}const Rt=Symbol("cloneElement");function tn(...e){var n,t;const o=(n=getCurrentInstance())==null?void 0:n.proxy;let r=null;const a=e[0];let[,l,u]=e;Array.isArray(unref(l))||(u=l,l=null);let s=null;const{immediate:f=!0,clone:d=Qn,customUpdate:v}=(t=unref(u))!=null?t:{};function _(m){var i;const{from:T,oldIndex:Q,item:w}=m;r=Array.from(T.childNodes);const N=unref((i=unref(l))==null?void 0:i[Q]),U=d(N);Ft(N,U),w[Rt]=U}function x(m){const i=m.item[Rt];if(!yn(i)){if(qe(m.item),isRef(l)){const T=[...unref(l)];l.value=St(T,m.newDraggableIndex,i);return}St(unref(l),m.newDraggableIndex,i)}}function E(m){const{from:i,item:T,oldIndex:Q,oldDraggableIndex:w,pullMode:N,clone:U}=m;if(Dt(i,T,Q),N==="clone"){qe(U);return}if(isRef(l)){const k=[...unref(l)];l.value=Et(k,w);return}Et(unref(l),w)}function H(m){if(v){v(m);return}const{from:i,item:T,oldIndex:Q,oldDraggableIndex:w,newDraggableIndex:N}=m;if(qe(T),Dt(i,T,Q),isRef(l)){const U=[...unref(l)];l.value=wt(U,w,N);return}wt(unref(l),w,N)}function z(m){const{newIndex:i,oldIndex:T,from:Q,to:w}=m;let N=null;const U=i===T&&Q===w;try{if(U){let k=null;r==null||r.some((j,Y)=>{if(k&&(r==null?void 0:r.length)!==w.childNodes.length)return Q.insertBefore(k,j.nextSibling),!0;const $e=w.childNodes[Y];k=w==null?void 0:w.replaceChild(j,$e)})}}catch(k){N=k}finally{r=null}nextTick(()=>{if(Ft(),N)throw N})}const ne={onUpdate:H,onStart:_,onAdd:x,onRemove:E,onEnd:z};function yt(m){const i=unref(a);return m||(m=wn(i)?En(i,o==null?void 0:o.$el):i),m&&!_n(m)&&(m=m.$el),m||mn("Root element not found"),m}function A(){var m;const i=(m=unref(u))!=null?m:{},{immediate:T,clone:Q}=i,w=Ve(i,["immediate","clone"]);return _t(w,(N,U)=>{Tn(N)&&(w[N]=(k,...j)=>{const Y=no();return Cn(k,Y),U(k,...j)})}),Dn(l===null?{}:ne,w)}const ce=m=>{m=yt(m),s&&R.destroy(),s=new p(m,A())};watch(()=>u,()=>{s&&_t(A(),(m,i)=>{s==null||s.option(m,i)})},{deep:!0});const R={option:(m,i)=>s==null?void 0:s.option(m,i),destroy:()=>{s==null||s.destroy(),s=null},save:()=>s==null?void 0:s.save(),toArray:()=>s==null?void 0:s.toArray(),closest:(...m)=>s==null?void 0:s.closest(...m)},ft=()=>R==null?void 0:R.option("disabled",!0),b=()=>R==null?void 0:R.option("disabled",!1);return to(()=>{f&&ce()}),eo(R.destroy),fe({start:ce,pause:ft,resume:b},R)}const ct=["update","start","add","remove","choose","unchoose","end","sort","filter","clone","move","change"],oo=["clone","animation","ghostClass","group","sort","disabled","store","handle","draggable","swapThreshold","invertSwap","invertedSwapThreshold","removeCloneOnHide","direction","chosenClass","dragClass","ignore","filter","preventOnFilter","easing","setData","dropBubble","dragoverBubble","dataIdAttr","delay","delayOnTouchOnly","touchStartThreshold","forceFallback","fallbackClass","fallbackOnBody","fallbackTolerance","fallbackOffset","supportPointer","emptyInsertThreshold","scroll","forceAutoScrollFallback","scrollSensitivity","scrollSpeed","bubbleScroll","modelValue","tag","target","customUpdate",...ct.map(e=>`on${e.replace(/^\S/,n=>n.toUpperCase())}`)],lo=defineComponent({name:"VueDraggable",model:{prop:"modelValue",event:"update:modelValue"},props:oo,emits:["update:modelValue",...ct],setup(e,{slots:n,emit:t,expose:o,attrs:r}){const a=ct.reduce((d,v)=>{const _=`on${v.replace(/^\S/,x=>x.toUpperCase())}`;return d[_]=(...x)=>t(v,...x),d},{}),l=computed(()=>{const d=toRefs(e),{modelValue:v}=d,_=Ve(d,["modelValue"]),x=Object.entries(_).reduce((E,[H,z])=>{const ne=unref(z);return ne!==void 0&&(E[H]=ne),E},{});return fe(fe({},a),bn(fe(fe({},r),x)))}),u=computed({get:()=>e.modelValue,set:d=>t("update:modelValue",d)}),s=ref(),f=reactive(tn(e.target||s,u,l));return o(f),()=>{var d;return h$1(e.tag||"div",{ref:s},(d=n==null?void 0:n.default)==null?void 0:d.call(n,f))}}}),_hoisted_1$b=["innerHTML"],_hoisted_2$a={class:"flex items-start gap-2"},_hoisted_3$a=["src"],_hoisted_4$a=["innerHTML"],_hoisted_5$a={class:"w-8 h-8 rounded-full bg-sky-100 text-sky-600 font-bold flex items-center justify-center"},_hoisted_6$a=["innerHTML"],_hoisted_7$9={key:0,class:"mt-5 p-4 text-sm text-gray-600 border-t border-gray-200"},_hoisted_8$9=["innerHTML"],_sfc_main$c=defineComponent({__name:"Ordering",props:{question:{},modelValue:{},examStore:{}},setup(e){const n=e,{testMode:t,answers:o}=n.examStore,r=Array.isArray(n.question.correct_answer)?n.question.correct_answer:(n.question.correct_answer||"").split(","),a=ref(Object.entries(n.question.options).map(([d,v])=>({id:d,choice:v.choice})));watch(a,d=>{t.value==="exam"&&(o[n.question.id]=d.map(v=>v.id).join(","))},{deep:!0});const l=computed(()=>{const d=o[n.question.id];return d?d.split(","):[]}),u=computed(()=>t.value==="review"?!0:t.value==="tutor"?!!l.value.length:!1),s=(d,v)=>{if(t.value==="exam")return"";const _=r.indexOf(d),x=l.value.indexOf(d);return x===-1?"bg-red-50 border-red-200":x===_?"bg-green-50 border-green-200":"bg-yellow-50 border-yellow-200"},f=ref(null);return onMounted(()=>{const d=document.getElementById("exhibits");d&&(d.innerHTML="",f.value=createApp(_sfc_main$k,{tabs:n.question.tabs}),f.value.mount(d))}),onUnmounted(()=>{f.value&&(f.value.unmount(),f.value=null)}),(d,v)=>(openBlock(),createElementBlock("div",{class:normalizeClass([d.question.tabs&&["nclex","cat"].includes(d.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[d.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:d.question.intro},null,8,_hoisted_1$b)):createCommentVNode("",!0),d.question.tabs&&["nclex","cat"].includes(d.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:d.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$a,[["nclex","cat"].includes(d.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$a)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:d.question.question},null,8,_hoisted_4$a)]),createVNode(unref(lo),{modelValue:a.value,"onUpdate:modelValue":v[0]||(v[0]=_=>a.value=_),"item-key":"id",disabled:unref(t)!=="exam",class:"space-y-3"},{item:withCtx(({element:_,index:x})=>[createBaseVNode("div",{class:normalizeClass(["p-3 bg-white border rounded-xl shadow-sm flex items-center gap-3 transition-colors",s(_.id,x)])},[createBaseVNode("div",_hoisted_5$a,toDisplayString(String.fromCharCode(65+x)),1),createBaseVNode("div",{class:"flex-1 text-gray-800",innerHTML:_.choice},null,8,_hoisted_6$a)],2)]),_:1},8,["modelValue","disabled"]),u.value?(openBlock(),createElementBlock("div",_hoisted_7$9,[v[1]||(v[1]=createBaseVNode("div",{class:"font-semibold mb-2"},"Explanation:",-1)),createBaseVNode("div",{innerHTML:d.question.solution},null,8,_hoisted_8$9)])):createCommentVNode("",!0)],2))}}),_hoisted_1$a=["innerHTML"],_hoisted_2$9={class:"rounded-xl bg-gray-50 p-4 md:p-6"},_hoisted_3$9={class:"flex items-start gap-2"},_hoisted_4$9=["src"],_hoisted_5$9=["innerHTML"],_hoisted_6$9={class:"bowtie-board"},_hoisted_7$8={class:"bowtie-layout flex justify-between items-center"},_hoisted_8$8={class:"bow-column"},_hoisted_9$8={class:"slot-title"},_hoisted_10$6={class:"slot-stack"},_hoisted_11$4={class:"bow-column center-column"},_hoisted_12$2={class:"slot-title"},_hoisted_13$2={class:"bow-column"},_hoisted_14$1={class:"slot-title"},_hoisted_15$1={class:"slot-stack"},_hoisted_16$1={class:"mt-5 grid gap-4 md:grid-cols-3"},_hoisted_17$1={class:"pool-panel"},_hoisted_18$1={class:"pool-title"},_hoisted_19={class:"pool-panel"},_hoisted_20={class:"pool-title"},_hoisted_21={class:"pool-panel"},_hoisted_22={class:"pool-title"},_hoisted_23={key:0,class:"mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm"},_hoisted_24={class:"space-y-1"},_hoisted_25={key:1,class:"mt-4 p-4 text-center"},_sfc_main$b=defineComponent({__name:"BowTie",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=inject("showSolution",null),l=ref(!1),u=ref(!1),s=ref([]),f=ref([]),d=ref([]),v=ref([]),_=ref({correctId:null,items:[]}),x=ref([]);function E(L,ae){if(L==null)return ae;if(typeof L!="string")return L;try{return JSON.parse(L)}catch{return ae}}function H(L){if(Array.isArray(L))return L.map(ae=>String(ae));if(typeof L=="string"){const ae=E(L,L);return Array.isArray(ae)?ae.map(F=>String(F)):L?[L]:[]}return[]}const z=computed(()=>{var F,nn;const L=E((nn=(F=t.question.options)==null?void 0:F.dynamicColumns)==null?void 0:nn.choice,[]),ae=Array.isArray(L)?L.reduce((on,ln)=>({...on,...ln}),{}):{};return{actions:ae.column1||"Action to take",potential:ae.column2||"Potential condition",parameters:ae.column3||"Parameter to monitor"}});function ne(L,ae,F,nn){var sn,Xt;const on=E((Xt=(sn=t.question.options)==null?void 0:sn[L])==null?void 0:Xt.choice,{});return(Array.isArray(on==null?void 0:on[ae])?on[ae]:[]).filter(an=>(an==null?void 0:an.markAs)&&(an==null?void 0:an.text)).map(an=>({id:`${nn}:${an.markAs}`,text:an.text,mark:an.markAs,group:F}))}function yt(){s.value=ne("finalActionsToTake","actionsToTake","action","action"),f.value=ne("finalPotentialConditionsData","potentialConditions","potential","potential"),d.value=ne("finalParametersToMonitorData","parametersToMonitor","parameter","parameter");const L=E(t.question.correct_answer,{}),ae=H(L.actionsAnswers),F=H(L.potentialAnswers),nn=H(L.paramerAnswers??L.parameterAnswers);v.value=Array.from({length:Math.max(2,ae.length||2)},(on,ln)=>({correctId:ae[ln]?`action:${ae[ln]}`:null,items:[]})),_.value={correctId:F[0]?`potential:${F[0]}`:null,items:[]},x.value=Array.from({length:Math.max(2,nn.length||2)},(on,ln)=>({correctId:nn[ln]?`parameter:${nn[ln]}`:null,items:[]}))}function A(){return t.modelValue?typeof t.modelValue=="string"?E(t.modelValue,{}):typeof t.modelValue=="object"?t.modelValue:null:null}function ce(){const L=A();if(!L)return;const ae=H(L.actionsAnswers).map(Xt=>`action:${Xt}`),F=H(L.potentialAnswers).map(Xt=>`potential:${Xt}`),nn=H(L.paramerAnswers??L.parameterAnswers).map(Xt=>`parameter:${Xt}`),on=new Map(s.value.map(Xt=>[Xt.id,Xt])),ln=new Map(f.value.map(Xt=>[Xt.id,Xt])),sn=new Map(d.value.map(Xt=>[Xt.id,Xt]));ae.forEach((Xt,an)=>{v.value[an]&&on.has(Xt)&&(v.value[an].items=[on.get(Xt)])}),F[0]&&ln.has(F[0])&&(_.value.items=[ln.get(F[0])]),nn.forEach((Xt,an)=>{x.value[an]&&sn.has(Xt)&&(x.value[an].items=[sn.get(Xt)])}),s.value=s.value.filter(Xt=>!ae.includes(Xt.id)),f.value=f.value.filter(Xt=>!F.includes(Xt.id)),d.value=d.value.filter(Xt=>!nn.includes(Xt.id))}function R(L,ae){L.items=L.items.filter(F=>F.group===ae).slice(0,1)}function ft(L){R(v.value[L],"action")}function b(){R(_.value,"potential")}function m(L){R(x.value[L],"parameter")}function i(L){return L==="action"?v.value:L==="parameter"?x.value:[_.value]}function T(L){return i(L).map(ae=>ae.correctId).filter(ae=>!!ae)}function Q(L){return i(L).map(ae=>{var F;return((F=ae.items[0])==null?void 0:F.id)||null}).filter(ae=>!!ae)}function w(L,ae){var sn;if(!l.value)return"none";const F=((sn=L.items[0])==null?void 0:sn.id)||null;if(ae==="potential")return!F&&L.correctId?"missed":!F&&!L.correctId?"none":F===L.correctId?"correct":"incorrect";const nn=T(ae),on=Q(ae);return F?nn.includes(F)?"correct":"incorrect":on.filter(Xt=>nn.includes(Xt)).length<nn.length?"missed":"none"}function N(L,ae){const F=L==="action"?v.value[ae]:L==="potential"?_.value:x.value[ae];if(!F)return"";switch(w(F,L)){case"correct":return"border-emerald-500 bg-emerald-50";case"incorrect":return"border-rose-500 bg-rose-50";case"missed":return"border-amber-500 bg-amber-50";default:return""}}function U(L,ae){const F=L==="action"?v.value[ae]:L==="potential"?_.value:x.value[ae];if(!F)return"";const nn=w(F,L);return nn==="correct"?"border-emerald-400 bg-emerald-100":nn==="incorrect"?"border-rose-400 bg-rose-100":""}const k=L=>L.replace(/<[^>]*>/g,"").trim(),j=computed(()=>{const L=[...s.value,...f.value,...d.value,...v.value.flatMap(F=>F.items),..._.value.items,...x.value.flatMap(F=>F.items)],ae=new Map;return L.forEach(F=>{ae.has(F.id)||ae.set(F.id,F)}),Array.from(ae.values())});function Y(L){if(!L)return"none";const ae=j.value.find(F=>F.id===L);return ae?k(ae.text)||ae.mark||L:L.split(":")[1]||L}const $e=computed(()=>{const L=[];return v.value.forEach((ae,F)=>{L.push({key:`action-${F}`,status:w(ae,"action"),label:`${z.value.actions} ${F+1}: ${y(w(ae,"action"),ae,"action")}`})}),L.push({key:"potential-0",status:w(_.value,"potential"),label:`${z.value.potential}: ${y(w(_.value,"potential"),_.value,"potential")}`}),x.value.forEach((ae,F)=>{L.push({key:`parameter-${F}`,status:w(ae,"parameter"),label:`${z.value.parameters} ${F+1}: ${y(w(ae,"parameter"),ae,"parameter")}`})}),L});function y(L,ae,F){var nn,on;if(L==="correct")return"Correct";if(L==="incorrect"){const ln=k(((nn=ae.items[0])==null?void 0:nn.text)||"")||((on=ae.items[0])==null?void 0:on.mark)||"none",sn=F==="potential"?Y(ae.correctId):T(F).map(Xt=>Y(Xt)).join(", ");return`Incorrect (selected "${ln}", correct is "${sn}")`}return L==="missed"?`Not answered (correct is "${F==="potential"?Y(ae.correctId):T(F).map(sn=>Y(sn)).join(", ")}")`:"Not answered"}function gt(L){return L==="correct"?"pi-check-circle text-emerald-600":L==="incorrect"?"pi-times-circle text-rose-600":L==="missed"?"pi-exclamation-triangle text-amber-600":"pi-circle text-gray-400"}function it(L){return L==="correct"?"text-emerald-700 font-semibold":L==="incorrect"?"text-rose-700 font-semibold":L==="missed"?"text-amber-700 font-semibold":"text-gray-500"}function Yt(){l.value=!0,u.value=!1,a&&a({flag:!0,value:!0})}watchEffect(()=>{switch(t.question.id,r){case"review":l.value=!0,u.value=!1;break;case"exam":l.value=!1,u.value=!1;break;case"tutor":l.value=!1,u.value=!0;break;default:l.value=!1,u.value=!1}});const cn=computed(()=>{var L;return{actionsAnswers:v.value.map(ae=>{var F;return((F=ae.items[0])==null?void 0:F.mark)||null}),potentialAnswers:[((L=_.value.items[0])==null?void 0:L.mark)||null],paramerAnswers:x.value.map(ae=>{var F;return((F=ae.items[0])==null?void 0:F.mark)||null})}});return watch(()=>[t.question.id,t.question.options,t.question.correct_answer],()=>{yt(),ce()},{immediate:!0,deep:!0}),watch(cn,L=>o("update:modelValue",L),{deep:!0}),onUnmounted(()=>{a&&a({flag:!0,value:!1})}),(L,ae)=>(openBlock(),createElementBlock("div",{class:normalizeClass([L.question.tabs&&["nclex","cat"].includes(L.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[L.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:L.question.intro},null,8,_hoisted_1$a)):createCommentVNode("",!0),L.question.tabs&&["nclex","cat"].includes(L.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:L.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$9,[createBaseVNode("div",_hoisted_3$9,[["nclex","cat"].includes(L.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_4$9)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:L.question.question},null,8,_hoisted_5$9)]),createBaseVNode("div",_hoisted_6$9,[ae[4]||(ae[4]=createStaticVNode('<svg class="bowtie-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" data-v-7d2c0ed2><defs data-v-7d2c0ed2><marker id="bowtieDot" markerWidth="4" markerHeight="4" refX="2" refY="2" data-v-7d2c0ed2><circle cx="2" cy="2" r="1.6" fill="#94a3b8" data-v-7d2c0ed2></circle></marker></defs><path d="M 22 28 C 35 28, 42 40, 50 50" data-v-7d2c0ed2></path><path d="M 22 72 C 35 72, 42 60, 50 50" data-v-7d2c0ed2></path><path d="M 50 50 C 58 40, 65 28, 78 28" data-v-7d2c0ed2></path><path d="M 50 50 C 58 60, 65 72, 78 72" data-v-7d2c0ed2></path><circle cx="50" cy="50" r="1.8" class="center-dot" data-v-7d2c0ed2></circle><circle cx="22" cy="28" r="1.4" class="edge-dot" data-v-7d2c0ed2></circle><circle cx="22" cy="72" r="1.4" class="edge-dot" data-v-7d2c0ed2></circle><circle cx="78" cy="28" r="1.4" class="edge-dot" data-v-7d2c0ed2></circle><circle cx="78" cy="72" r="1.4" class="edge-dot" data-v-7d2c0ed2></circle></svg>',1)),createBaseVNode("div",_hoisted_7$8,[createBaseVNode("div",_hoisted_8$8,[createBaseVNode("h4",_hoisted_9$8,toDisplayString(z.value.actions),1),createBaseVNode("div",_hoisted_10$6,[(openBlock(!0),createElementBlock(Fragment,null,renderList(v.value,(F,nn)=>(openBlock(),createElementBlock("div",{key:"a-"+nn,class:"slot-wrap"},[createVNode(unref(lo),{modelValue:F.items,"onUpdate:modelValue":on=>F.items=on,group:"bow-action","item-key":"id",onAdd:on=>ft(nn),disabled:unref(r)==="review",class:normalizeClass(["slot-box action-slot",N("action",nn)])},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(F.items,on=>(openBlock(),createElementBlock("div",{key:on.id,class:normalizeClass(["drag-item",U("action",nn)])},toDisplayString(on.text),3))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onAdd","disabled","class"])]))),128))])]),createBaseVNode("div",_hoisted_11$4,[createBaseVNode("h4",_hoisted_12$2,toDisplayString(z.value.potential),1),createVNode(unref(lo),{modelValue:_.value.items,"onUpdate:modelValue":ae[0]||(ae[0]=F=>_.value.items=F),group:"bow-potential","item-key":"id",onAdd:b,disabled:unref(r)==="review",class:normalizeClass(["hazard-box min-w-[150px]",N("potential",0)])},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(_.value.items,F=>(openBlock(),createElementBlock("div",{key:F.id,class:normalizeClass(["drag-item",U("potential",0)])},toDisplayString(F.text),3))),128))]),_:1},8,["modelValue","disabled","class"])]),createBaseVNode("div",_hoisted_13$2,[createBaseVNode("h4",_hoisted_14$1,toDisplayString(z.value.parameters),1),createBaseVNode("div",_hoisted_15$1,[(openBlock(!0),createElementBlock(Fragment,null,renderList(x.value,(F,nn)=>(openBlock(),createElementBlock("div",{key:"p-"+nn,class:"slot-wrap"},[createVNode(unref(lo),{modelValue:F.items,"onUpdate:modelValue":on=>F.items=on,group:"bow-parameter","item-key":"id",onAdd:on=>m(nn),disabled:unref(r)==="review",class:normalizeClass(["slot-box parameter-slot",N("parameter",nn)])},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(F.items,on=>(openBlock(),createElementBlock("div",{key:on.id,class:normalizeClass(["drag-item",U("parameter",nn)])},toDisplayString(on.text),3))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onAdd","disabled","class"])]))),128))])])])]),createBaseVNode("div",_hoisted_16$1,[createBaseVNode("section",_hoisted_17$1,[createBaseVNode("h5",_hoisted_18$1,toDisplayString(z.value.actions),1),createVNode(unref(lo),{modelValue:s.value,"onUpdate:modelValue":ae[1]||(ae[1]=F=>s.value=F),group:"bow-action","item-key":"id",disabled:unref(r)==="review",class:"pool-box min-h-[84px]"},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(s.value,F=>(openBlock(),createElementBlock("div",{key:F.id,class:"pool-item"},toDisplayString(F.text),1))),128))]),_:1},8,["modelValue","disabled"])]),createBaseVNode("section",_hoisted_19,[createBaseVNode("h5",_hoisted_20,toDisplayString(z.value.potential),1),createVNode(unref(lo),{modelValue:f.value,"onUpdate:modelValue":ae[2]||(ae[2]=F=>f.value=F),group:"bow-potential","item-key":"id",disabled:unref(r)==="review",class:"pool-box min-h-[84px]"},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(f.value,F=>(openBlock(),createElementBlock("div",{key:F.id,class:"pool-item"},toDisplayString(F.text),1))),128))]),_:1},8,["modelValue","disabled"])]),createBaseVNode("section",_hoisted_21,[createBaseVNode("h5",_hoisted_22,toDisplayString(z.value.parameters),1),createVNode(unref(lo),{modelValue:d.value,"onUpdate:modelValue":ae[3]||(ae[3]=F=>d.value=F),group:"bow-parameter","item-key":"id",disabled:unref(r)==="review",class:"pool-box min-h-[84px]"},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(d.value,F=>(openBlock(),createElementBlock("div",{key:F.id,class:"pool-item"},toDisplayString(F.text),1))),128))]),_:1},8,["modelValue","disabled"])])]),l.value?(openBlock(),createElementBlock("div",_hoisted_23,[ae[5]||(ae[5]=createBaseVNode("h5",{class:"font-semibold text-slate-700 mb-2"},"Feedback",-1)),createBaseVNode("div",_hoisted_24,[(openBlock(!0),createElementBlock(Fragment,null,renderList($e.value,F=>(openBlock(),createElementBlock("div",{key:F.key,class:"flex items-center gap-2"},[createBaseVNode("i",{class:normalizeClass(`pi ${gt(F.status)}`)},null,2),createBaseVNode("span",{class:normalizeClass(it(F.status))},toDisplayString(F.label),3)]))),128))])])):createCommentVNode("",!0),u.value?(openBlock(),createElementBlock("div",_hoisted_25,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",onClick:Yt}," Submit ")])):createCommentVNode("",!0)])],2))}}),BowTie=_export_sfc(_sfc_main$b,[["__scopeId","data-v-7d2c0ed2"]]),_hoisted_1$9=["innerHTML"],_hoisted_2$8={class:"flex items-start gap-2"},_hoisted_3$8=["src"],_hoisted_4$8=["innerHTML"],_hoisted_5$8={class:"matrix-table border border-gray-200 w-full"},_hoisted_6$8={class:"bg-gray-100"},_hoisted_7$7=["innerHTML"],_hoisted_8$7={class:"p-2"},_hoisted_9$7=["checked","disabled","onChange"],_hoisted_10$5={key:0,class:"mt-4 text-center"},_sfc_main$a=defineComponent({__name:"MTX",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","submitted","update:showSolution"],setup(e,{emit:n}){const t=e,o=n,{testMode:r,answers:a,results:l}=t.examStore,u=computed(()=>{if(Array.isArray(t.question.correct_answer))return t.question.correct_answer;try{return JSON.parse(t.question.correct_answer||"{}")}catch{return{}}}),s=t.question.mtx_option||"{}",f=JSON.parse(s),d={};Object.keys(u.value).forEach(R=>{const ft=u.value[R];(Array.isArray(ft.answers)?ft.answers:[]).forEach(m=>{var i;d[m]||(d[m]=((i=f[m])==null?void 0:i.option)||`Category ${m}`)})});const v=reactive({});Object.keys(d).forEach(R=>{v[R]={answers:[]}});function _(R,ft){var b;return(b=v[ft])==null?void 0:b.answers.includes(R)}function x(R,ft){const b=v[ft].answers,m=b.indexOf(R);m>-1?b.splice(m,1):b.push(R),o("update:modelValue",E())}function E(){const R=toRaw(v);try{if(typeof structuredClone=="function")return structuredClone(R)}catch{}return JSON.parse(JSON.stringify(R))}function H(R,ft){var b,m;return(m=(b=u.value[R])==null?void 0:b.answers)==null?void 0:m.includes(ft)}function z(R,ft){if(!ne.value)return"";const b=H(R,ft),m=_(R,ft);return b&&m?"accent-teal-500":!b&&m?"accent-rose-600":b&&!m?"ring-2 ring-teal-500":""}const ne=ref(!1),yt=ref(!1);watchEffect(()=>{switch(r){case"review":ne.value=!0,yt.value=!1;break;case"exam":ne.value=!1,yt.value=!1;break;case"tutor":ne.value=!1,yt.value=!0;break;default:ne.value=!1,yt.value=!1}});const A=inject("showSolution");function ce(){ne.value=!0,A({flag:!0,value:!0}),yt.value=!1}return onUnmounted(()=>{A&&A({flag:!0,value:!1})}),(R,ft)=>(openBlock(),createElementBlock("div",{class:normalizeClass([R.question.tabs&&["nclex","cat"].includes(R.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[R.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:R.question.intro},null,8,_hoisted_1$9)):createCommentVNode("",!0),R.question.tabs&&["nclex","cat"].includes(R.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:R.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$8,[["nclex","cat"].includes(R.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$8)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:R.question.question},null,8,_hoisted_4$8)]),createBaseVNode("table",_hoisted_5$8,[createBaseVNode("thead",_hoisted_6$8,[createBaseVNode("tr",null,[createBaseVNode("th",{class:"p-2 text-left",innerHTML:R.question.table_header},null,8,_hoisted_7$7),(openBlock(),createElementBlock(Fragment,null,renderList(d,(b,m)=>createBaseVNode("th",{key:m,class:"p-2 text-center"},toDisplayString(b),1)),64))])]),createBaseVNode("tbody",null,[(openBlock(!0),createElementBlock(Fragment,null,renderList(R.question.options,(b,m)=>(openBlock(),createElementBlock("tr",{key:m,class:"hover:bg-gray-50"},[createBaseVNode("td",_hoisted_8$7,toDisplayString(b.choice.choice),1),(openBlock(),createElementBlock(Fragment,null,renderList(d,(i,T)=>createBaseVNode("td",{key:T,class:"p-2 text-center"},[createBaseVNode("input",{type:"checkbox",checked:_(String(m),String(T)),disabled:unref(r)==="review",onChange:Q=>x(String(m),String(T)),class:normalizeClass(z(String(m),String(T)))},null,42,_hoisted_9$7)])),64))]))),128))])]),yt.value?(openBlock(),createElementBlock("div",_hoisted_10$5,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",onClick:ce}," Submit ")])):createCommentVNode("",!0),renderSlot(R.$slots,"solution")])],2))}}),_hoisted_1$8=["innerHTML"],_hoisted_2$7=["innerHTML"],_hoisted_3$7={class:"grouping-table border border-gray-200 w-full mt-2"},_hoisted_4$7={class:"bg-gray-100"},_hoisted_5$7=["innerHTML"],_hoisted_6$7={class:"p-2"},_hoisted_7$6=["name","value","checked","disabled","onChange"],_hoisted_8$6={key:0,class:"text-red-600 mt-2"},_hoisted_9$6={key:1,class:"mt-4 text-center"},_sfc_main$9=defineComponent({__name:"MMC",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","submitted"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=computed(()=>{if(!t.question.correct_answer)return{};if(typeof t.question.correct_answer=="string")try{return JSON.parse(t.question.correct_answer)}catch{return{}}return t.question.correct_answer}),l=t.question.mtx_option||"{}";let u={};try{u=JSON.parse(l)}catch{u={}}const s={};Object.keys(a.value).forEach(A=>{var ft;const ce=(ft=a.value)==null?void 0:ft[A];(Array.isArray(ce==null?void 0:ce.answers)?ce.answers:[]).forEach(b=>{var m;s[b]||(s[b]=((m=u[b])==null?void 0:m.option)||`Category ${b}`)})}),Object.keys(s).length||Object.keys(u||{}).forEach(A=>{var ce;s[A]=((ce=u[A])==null?void 0:ce.option)||`Category ${A}`});const f=reactive({});Object.keys(t.question.options).forEach(A=>f[A]=null),t.modelValue&&Object.assign(f,t.modelValue);function d(A,ce){f[A]=ce,o("update:modelValue",ne())}const v=ref(""),_=ref(!1),x=ref(!1);function E(A,ce){var R,ft,b;return(b=(ft=(R=a.value)==null?void 0:R[A])==null?void 0:ft.answers)==null?void 0:b.includes(ce)}function H(A,ce){if(!_.value)return"";const R=E(A,ce),ft=f[A]===ce;return R&&ft?"accent-teal-500":!R&&ft?"accent-rose-600":R&&!ft?"ring-2 ring-teal-500":""}const z=inject("showSolution");function ne(){const A=toRaw(f);try{if(typeof structuredClone=="function")return structuredClone(A)}catch{}return JSON.parse(JSON.stringify(A))}function yt(){_.value=!0,x.value=!1,z&&z({flag:!0,value:!0}),o("submitted",{answer:ne()})}return watchEffect(()=>{switch(r){case"review":_.value=!0,x.value=!1;break;case"exam":_.value=!1,x.value=!1;break;case"tutor":_.value=!1,x.value=!0;break;default:_.value=!1,x.value=!1}}),onUnmounted(()=>{z&&z({flag:!0,value:!1})}),(A,ce)=>(openBlock(),createElementBlock("div",{class:normalizeClass([A.question.tabs&&["nclex","cat"].includes(A.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[A.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:A.question.intro},null,8,_hoisted_1$8)):createCommentVNode("",!0),A.question.tabs&&["nclex","cat"].includes(A.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:A.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",{innerHTML:A.question.question,class:"question-text"},null,8,_hoisted_2$7),createBaseVNode("table",_hoisted_3$7,[createBaseVNode("thead",_hoisted_4$7,[createBaseVNode("tr",null,[createBaseVNode("th",{class:"p-2 text-left",innerHTML:A.question.table_header},null,8,_hoisted_5$7),(openBlock(),createElementBlock(Fragment,null,renderList(s,(R,ft)=>createBaseVNode("th",{key:ft,class:"p-2 text-center"},toDisplayString(R),1)),64))])]),createBaseVNode("tbody",null,[(openBlock(!0),createElementBlock(Fragment,null,renderList(A.question.options,(R,ft)=>(openBlock(),createElementBlock("tr",{key:ft,class:"hover:bg-gray-50"},[createBaseVNode("td",_hoisted_6$7,toDisplayString(R.choice.choice),1),(openBlock(),createElementBlock(Fragment,null,renderList(s,(b,m)=>createBaseVNode("td",{key:m,class:"p-2 text-center"},[createBaseVNode("input",{type:"radio",name:String(ft),value:String(m),checked:f[String(ft)]===String(m),disabled:unref(r)==="review",class:normalizeClass(H(String(ft),String(m))),onChange:i=>d(String(ft),String(m))},null,42,_hoisted_7$6)])),64))]))),128))])]),v.value?(openBlock(),createElementBlock("div",_hoisted_8$6,toDisplayString(v.value),1)):createCommentVNode("",!0),x.value?(openBlock(),createElementBlock("div",_hoisted_9$6,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",onClick:yt}," Submit ")])):createCommentVNode("",!0),renderSlot(A.$slots,"solution")])],2))}}),_hoisted_1$7=["innerHTML"],_hoisted_2$6={class:"rounded-xl bg-gray-50 p-4 md:p-6"},_hoisted_3$6={class:"flex items-start gap-2"},_hoisted_4$6=["src"],_hoisted_5$6=["innerHTML"],_hoisted_6$6={class:"mb-4"},_hoisted_7$5={key:0,class:"placeholder"},_hoisted_8$5={class:"mt-4 rounded-xl border border-gray-200 bg-white p-3"},_hoisted_9$5={key:0,class:"mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm"},_hoisted_10$4={class:"flex items-center gap-2"},_hoisted_11$3={key:1,class:"mt-4 text-center"},_hoisted_12$1=["disabled"],_hoisted_13$1=["innerHTML"],_sfc_main$8=defineComponent({__name:"DDC",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=inject("showSolution",null),l=ref(!1),u=ref(!1);function s(b,m){if(b==null)return m;if(typeof b!="string")return b;try{return JSON.parse(b)}catch{return m}}const f=ref([]),d=ref({correctId:null,items:[]});function v(){var T;f.value=[];const b=t.question.options||[];f.value=b.filter(Q=>{var w,N;return((w=Q==null?void 0:Q.choice)==null?void 0:w.text)&&((N=Q==null?void 0:Q.choice)==null?void 0:N.markKey)}).map(Q=>({id:Q.choice.id||`opt-${Q.choice.markKey}`,text:Q.choice.text,mark:Q.choice.markKey,group:"ddc"}));const m=s(t.question.correct_answer,[]),i=((T=m==null?void 0:m[0])==null?void 0:T.answer)??null;d.value={correctId:i?`opt-${i}`:null,items:[]}}function _(){return t.modelValue?typeof t.modelValue=="string"?s(t.modelValue,{}):typeof t.modelValue=="object"?t.modelValue:null:null}function x(){const b=_();if(!(b!=null&&b.answer))return;const m=`opt-${b.answer}`,i=f.value.find(T=>`opt-${T.mark}`===m);i&&(d.value.items=[i],f.value=f.value.filter(T=>T.id!==i.id))}function E(){d.value.items=d.value.items.slice(0,1)}const H=computed(()=>{var b;return{answer:((b=d.value.items[0])==null?void 0:b.mark)||null}}),z=computed(()=>{var m;if(!l.value)return"none";const b=((m=d.value.items[0])==null?void 0:m.id)||null;return!b&&d.value.correctId?"missed":!b&&!d.value.correctId?"none":b===d.value.correctId?"correct":"incorrect"}),ne=computed(()=>z.value==="correct"?"border-emerald-500 bg-emerald-50":z.value==="incorrect"?"border-rose-500 bg-rose-50":z.value==="missed"?"border-amber-500 bg-amber-50":""),yt=computed(()=>z.value==="correct"?"border-emerald-400 bg-emerald-100":z.value==="incorrect"?"border-rose-400 bg-rose-100":""),A=computed(()=>{var b,m,i;if(z.value==="correct")return"Correct";if(z.value==="incorrect"){const T=((b=d.value.items[0])==null?void 0:b.mark)||"none",Q=((m=d.value.correctId)==null?void 0:m.replace("opt-",""))||"none";return`Incorrect (selected "${T}", correct is "${Q}")`}return z.value==="missed"?`Not answered (correct is "${((i=d.value.correctId)==null?void 0:i.replace("opt-",""))||"none"}")`:"Not answered"}),ce=computed(()=>z.value==="correct"?"pi-check-circle text-emerald-600":z.value==="incorrect"?"pi-times-circle text-rose-600":z.value==="missed"?"pi-exclamation-triangle text-amber-600":"pi-circle text-gray-400"),R=computed(()=>z.value==="correct"?"text-emerald-700 font-semibold":z.value==="incorrect"?"text-rose-700 font-semibold":z.value==="missed"?"text-amber-700 font-semibold":"text-gray-500");function ft(){d.value.items.length&&(l.value=!0,u.value=!1,a&&a({flag:!0,value:!0}))}return watchEffect(()=>{switch(t.question.id,r){case"review":l.value=!0,u.value=!1;break;case"exam":l.value=!1,u.value=!1;break;case"tutor":l.value=!1,u.value=!0;break;default:l.value=!1,u.value=!1}}),watch(()=>[t.question.id,t.question.options,t.question.correct_answer],()=>{v(),x()},{immediate:!0,deep:!0}),watch(H,b=>o("update:modelValue",b),{deep:!0}),onUnmounted(()=>{a&&a({flag:!0,value:!1})}),(b,m)=>(openBlock(),createElementBlock("div",{class:normalizeClass([b.question.tabs&&["nclex","cat"].includes(b.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[b.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:b.question.intro},null,8,_hoisted_1$7)):createCommentVNode("",!0),b.question.tabs&&["nclex","cat"].includes(b.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:b.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$6,[createBaseVNode("div",_hoisted_3$6,[["nclex","cat"].includes(b.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_4$6)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:b.question.question},null,8,_hoisted_5$6)]),createBaseVNode("div",_hoisted_6$6,[m[2]||(m[2]=createBaseVNode("h4",{class:"mb-2 text-sm font-semibold text-gray-700"},"Select priority finding",-1)),createVNode(unref(lo),{modelValue:d.value.items,"onUpdate:modelValue":m[0]||(m[0]=i=>d.value.items=i),group:"ddc","item-key":"id",onAdd:E,disabled:unref(r)==="review",class:normalizeClass(["slot-box min-h-[56px] bg-gray-100",ne.value])},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(d.value.items,i=>(openBlock(),createElementBlock("div",{key:i.id,class:normalizeClass(["drag-item",yt.value])},toDisplayString(i.text),3))),128)),d.value.items.length?createCommentVNode("",!0):(openBlock(),createElementBlock("span",_hoisted_7$5,"Drop answer here"))]),_:1},8,["modelValue","disabled","class"])]),createBaseVNode("div",_hoisted_8$5,[createVNode(unref(lo),{modelValue:f.value,"onUpdate:modelValue":m[1]||(m[1]=i=>f.value=i),group:"ddc","item-key":"id",disabled:unref(r)==="review",class:"pool-box min-h-[80px]"},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(f.value,i=>(openBlock(),createElementBlock("div",{key:i.id,class:"pool-item"},toDisplayString(i.text),1))),128))]),_:1},8,["modelValue","disabled"])]),l.value?(openBlock(),createElementBlock("div",_hoisted_9$5,[createBaseVNode("div",_hoisted_10$4,[createBaseVNode("i",{class:normalizeClass(`pi ${ce.value}`)},null,2),createBaseVNode("span",{class:normalizeClass(R.value)},toDisplayString(A.value),3)])])):createCommentVNode("",!0),u.value?(openBlock(),createElementBlock("div",_hoisted_11$3,[createBaseVNode("button",{class:normalizeClass(["px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",d.value.items.length?"":"opacity-50 cursor-not-allowed"]),disabled:!d.value.items.length,onClick:ft}," Submit ",10,_hoisted_12$1)])):createCommentVNode("",!0),l.value&&b.question.solution?(openBlock(),createElementBlock("div",{key:2,class:"mt-4 p-3 rounded bg-teal-50 text-sm prose",innerHTML:b.question.solution},null,8,_hoisted_13$1)):createCommentVNode("",!0)])],2))}}),DDC=_export_sfc(_sfc_main$8,[["__scopeId","data-v-61a8e905"]]),_hoisted_1$6=["innerHTML"],_hoisted_2$5={class:"rounded-xl bg-gray-50 p-4 md:p-6"},_hoisted_3$5={class:"flex items-start gap-2"},_hoisted_4$5=["src"],_hoisted_5$5=["innerHTML"],_hoisted_6$5={key:0,class:"mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm"},_hoisted_7$4={class:"space-y-1"},_hoisted_8$4={key:1,class:"mt-4 text-center"},_hoisted_9$4=["disabled"],_hoisted_10$3={key:0,class:"mt-2 text-xs text-gray-500"},_sfc_main$7=defineComponent({__name:"DRDCLOZE",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=ref(null),l=ref({}),u=ref(!1);function s(w,N){if(w==null)return N;if(typeof w!="string")return w;try{return JSON.parse(w)}catch{return N}}function f(){var w;l.value={},(w=t.question.options)==null||w.forEach(N=>{l.value[N.choice.id]=null})}const d=computed(()=>(t.question.options||[]).map(w=>{var N;return String(((N=w==null?void 0:w.choice)==null?void 0:N.id)||"")}).filter(Boolean));function v(w){return w.replace(/<[^>]*>/g,"").trim()}function _(){const w={},N=t.question.correct_answer,U=s(N,N);return Array.isArray(U)?(U.forEach((k,j)=>{if(k&&typeof k=="object"){const y=String(k.id??k.choice_id??d.value[j]??""),gt=String(k.answer??k.value??"").trim();y&&gt&&(w[y]=gt);return}const Y=d.value[j],$e=String(k??"").trim();Y&&$e&&(w[Y]=$e)}),w):(U&&typeof U=="object"&&Object.entries(U).forEach(([k,j])=>{if(j&&typeof j=="object"){const $e=String(j.id??k??""),y=String(j.answer??j.value??"").trim();$e&&y&&(w[$e]=y);return}const Y=String(j??"").trim();k&&Y&&(w[String(k)]=Y)}),w)}const x=computed(()=>_());function E(w,N){var j,Y;if(!N)return"none";const U=(t.question.options||[]).find($e=>{var y;return String((y=$e==null?void 0:$e.choice)==null?void 0:y.id)===w}),k=(Y=(j=U==null?void 0:U.choice)==null?void 0:j.options)==null?void 0:Y[N];return k&&v(String(k))||N}function H(w){const N=l.value[w],U=x.value[w];return!N&&U?"missed":!N&&!U?"none":N===U?"correct":"incorrect"}const z=computed(()=>r==="review"?!0:r==="tutor"?u.value:!1),ne=computed(()=>d.value.map((w,N)=>{const U=H(w),k=E(w,l.value[w]),j=E(w,x.value[w]);let Y=`Blank ${N+1}: Not answered`;return U==="correct"?Y=`Blank ${N+1}: Correct`:U==="incorrect"?Y=`Blank ${N+1}: Incorrect (selected "${k}", correct is "${j}")`:U==="missed"&&(Y=`Blank ${N+1}: Not answered (correct is "${j}")`),{id:w,status:U,label:Y}}));function yt(){if(!t.modelValue)return;let w=t.modelValue;typeof w=="string"&&(w=s(w,{})),Object.keys(w||{}).forEach(N=>{N in l.value&&(l.value[N]=w[N])})}async function A(){var N;if(await nextTick(),!a.value)return;const w=a.value;(N=t.question.options)==null||N.forEach(U=>{const k=U.choice.id,j=w.querySelector(`#${k}`);if(!j)return;const Y=document.createElement("select");Y.className="inline-block border border-gray-300 p-1 rounded mx-1 text-sm align-middle",Y.disabled=r==="review"||r==="tutor"&&u.value;const $e=document.createElement("option");$e.value="",$e.textContent="-- Select --",$e.disabled=!0,$e.selected=!l.value[k],Y.appendChild($e),Object.entries(U.choice.options).forEach(([y,gt])=>{const it=document.createElement("option");it.value=y,it.textContent=gt,l.value[k]===y&&(it.selected=!0),Y.appendChild(it)}),Y.addEventListener("change",y=>{l.value[k]=y.target.value,R()}),j.replaceWith(Y)})}function ce(){if(!a.value)return;const w=r==="review"||r==="tutor"&&u.value;a.value.querySelectorAll("select").forEach(N=>{N.disabled=w})}function R(){a.value&&a.value.querySelectorAll("select").forEach(w=>{const N=w,U=N.name,k=H(U),j=x.value[U],Y=l.value[U],$e="inline-block border p-1 rounded mx-1 text-sm align-middle";if(N.style.opacity="1",N.style.fontWeight="500",N.style.color="#111827",N.style.backgroundColor="#ffffff",N.style.borderColor="#d1d5db",N.style.webkitTextFillColor="#111827",Array.from(N.options).forEach((y,gt)=>{const it=y;it.style.fontWeight="400",it.style.color="#111827",it.style.backgroundColor="#ffffff",gt===0&&(it.style.color="#6b7280"),z.value&&it.value&&(j&&it.value===j&&(it.style.color="#047857",it.style.backgroundColor="#ecfdf5",it.style.fontWeight="600"),Y&&it.value===Y&&Y!==j&&(it.style.color="#be123c",it.style.backgroundColor="#fff1f2",it.style.fontWeight="600"))}),!z.value){N.className=`${$e} border-gray-300`;return}if(k==="correct"){N.className=`${$e} border-emerald-500 bg-emerald-50 text-emerald-800`,N.style.color="#047857",N.style.backgroundColor="#ecfdf5",N.style.borderColor="#10b981",N.style.webkitTextFillColor="#047857";return}if(k==="incorrect"){N.className=`${$e} border-rose-500 bg-rose-50 text-rose-800`,N.style.color="#be123c",N.style.backgroundColor="#fff1f2",N.style.borderColor="#f43f5e",N.style.webkitTextFillColor="#be123c";return}if(k==="missed"){N.className=`${$e} border-amber-500 bg-amber-50 text-amber-800`,N.style.color="#b45309",N.style.backgroundColor="#fffbeb",N.style.borderColor="#f59e0b",N.style.webkitTextFillColor="#b45309";return}N.className=`${$e} border-gray-300`})}computed(()=>l.value);const ft=computed(()=>{const w=Object.values(l.value||{});return w.length?w.every(N=>!!N):!1}),b=computed(()=>r==="tutor"&&!u.value),m=inject("showSolution",null);function i(){ft.value&&(u.value=!0,ce(),R(),m&&m({flag:!0,value:!0}))}watch(()=>[t.question.id,t.question.options],async()=>{u.value=!1,f(),yt(),await A(),ce(),R()},{immediate:!0,deep:!0}),watch(l,w=>o("update:modelValue",w),{deep:!0}),watchEffect(()=>{r!=="tutor"&&(u.value=!1),ce(),R()}),watch(()=>[l.value,z.value],()=>R(),{deep:!0});function T(w){return w==="correct"?"pi-check-circle text-emerald-600":w==="incorrect"?"pi-times-circle text-rose-600":w==="missed"?"pi-exclamation-triangle text-amber-600":"pi-circle text-gray-400"}function Q(w){return w==="correct"?"text-emerald-700 font-semibold":w==="incorrect"?"text-rose-700 font-semibold":w==="missed"?"text-amber-700 font-semibold":"text-gray-500"}return onUnmounted(()=>{m&&m({flag:!0,value:!1})}),(w,N)=>(openBlock(),createElementBlock("div",{class:normalizeClass([w.question.tabs&&["nclex","cat"].includes(w.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[w.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:w.question.intro},null,8,_hoisted_1$6)):createCommentVNode("",!0),w.question.tabs&&["nclex","cat"].includes(w.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:w.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$5,[createBaseVNode("div",_hoisted_3$5,[["nclex","cat"].includes(w.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_4$5)):createCommentVNode("",!0),createBaseVNode("div",{ref_key:"questionContainer",ref:a,class:"prose max-w-none text-base",innerHTML:w.question.question},null,8,_hoisted_5$5)]),z.value?(openBlock(),createElementBlock("div",_hoisted_6$5,[N[0]||(N[0]=createBaseVNode("h5",{class:"font-semibold text-slate-700 mb-2"},"Feedback",-1)),createBaseVNode("div",_hoisted_7$4,[(openBlock(!0),createElementBlock(Fragment,null,renderList(ne.value,U=>(openBlock(),createElementBlock("div",{key:U.id,class:"flex items-center gap-2"},[createBaseVNode("i",{class:normalizeClass(`pi ${T(U.status)}`)},null,2),createBaseVNode("span",{class:normalizeClass(Q(U.status))},toDisplayString(U.label),3)]))),128))])])):createCommentVNode("",!0),b.value?(openBlock(),createElementBlock("div",_hoisted_8$4,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",disabled:!ft.value,onClick:i}," Submit ",8,_hoisted_9$4),ft.value?createCommentVNode("",!0):(openBlock(),createElementBlock("div",_hoisted_10$3," Complete all blanks to submit. "))])):createCommentVNode("",!0),renderSlot(w.$slots,"solution",{},void 0,!0)])],2))}}),DRDCLOZE=_export_sfc(_sfc_main$7,[["__scopeId","data-v-b7a5af97"]]),_hoisted_1$5=["innerHTML"],_hoisted_2$4={class:"flex items-start gap-2"},_hoisted_3$4=["src"],_hoisted_4$4=["innerHTML"],_hoisted_5$4={class:"text-sm text-gray-500 mb-3 italic"},_hoisted_6$4={key:0},_hoisted_7$3=["value","checked","onChange","disabled"],_hoisted_8$3=["innerHTML"],_hoisted_9$3=["innerHTML"],_hoisted_10$2=["innerHTML"],_hoisted_11$2={key:0,class:"mt-4 p-4 text-center"},_sfc_main$6=defineComponent({__name:"MMN",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","update:showSolution"],setup(e,{emit:n}){const t=e,{testMode:o,answers:r,results:a}=t.examStore,l=n,u=computed({get:()=>t.modelValue,set:A=>l("update:modelValue",A)}),s=computed(()=>t.question.total_points),f=A=>{const ce=[...u.value],R=ce.indexOf(A);if(R!==-1)ce.splice(R,1);else{if(ce.length>=s.value)return;ce.push(A)}u.value=ce},d=A=>o==="review"?!0:u.value.includes(A)?!1:u.value.length>=s.value,v=ref(!1),_=ref(!1),x=computed(()=>{if(Array.isArray(t.question.correct_answer))return t.question.correct_answer;try{return JSON.parse(t.question.correct_answer||"[]")}catch{return[]}});watchEffect(()=>{switch(o){case"review":v.value=!0;break;case"exam":v.value=!1;break;case"tutor":v.value=!1,_.value=!0,t.examStore.answers[t.question.id]&&setTimeout(()=>{v.value=!0,z({flag:!0,value:!0})},x.value.length*1e4);break;default:v.value=!1}});const E=A=>x.value.includes(A),H=A=>{const ce=r[t.question.id]??[];return o==="review"?ce.includes(A)&&!x.value.includes(A):o==="tutor"?ce.includes(A)&&!E(A):!1},z=inject("showSolution"),ne=()=>{v.value=!0,z({flag:!0,value:!0}),_.value=!1},yt=ref(null);return onMounted(()=>{const A=document.getElementById("exhibits");A&&(A.innerHTML="",yt.value=createApp(_sfc_main$k,{tabs:t.question.tabs}),yt.value.mount(A))}),onUnmounted(()=>{z({flag:!0,value:!1}),yt.value&&(yt.value.unmount(),yt.value=null)}),(A,ce)=>(openBlock(),createElementBlock("div",{class:normalizeClass([A.question.tabs&&["nclex","cat"].includes(A.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[A.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:A.question.intro},null,8,_hoisted_1$5)):createCommentVNode("",!0),A.question.tabs&&["nclex","cat"].includes(A.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:A.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$4,[["nclex","cat"].includes(A.examStore.storeName)?(openBlock(),createElementBlock("img",{key:0,src:unref(qn_arrow),class:"h-8 shrink-0"},null,8,_hoisted_3$4)):createCommentVNode("",!0),createBaseVNode("div",{class:"mb-2 font-base leading-relaxed",innerHTML:A.question.question},null,8,_hoisted_4$4)]),createBaseVNode("div",_hoisted_5$4,[createTextVNode(" Select "+toDisplayString(s.value)+" option",1),s.value>1?(openBlock(),createElementBlock("span",_hoisted_6$4,"s")):createCommentVNode("",!0),ce[0]||(ce[0]=createTextVNode(". "))]),(openBlock(!0),createElementBlock(Fragment,null,renderList(A.question.options,(R,ft)=>(openBlock(),createElementBlock("div",{key:ft,class:"mb-2 ms-4"},[R.choice!=null&&R.choice!=""&&R.choice!="None"?(openBlock(),createElementBlock("label",{key:0,class:normalizeClass(["flex items-start gap-2",{"text-teal-500 font-semibold":E(String(ft))&&v.value,"text-rose-600 font-semibold":H(String(ft))&&v.value}])},[createBaseVNode("i",{class:normalizeClass(`pi mt-1.5 text-lg ${E(String(ft))&&v.value?"pi-check-circle":H(String(ft))&&v.value?"pi-times-circle":""}`)},null,2),createBaseVNode("input",{type:"checkbox",class:"checkbox checkbox-sm mt-1 cursor-pointer border-gray-600 text-gray-700 dark:text-slate-100 dark:border-white",value:String(ft),checked:u.value.includes(String(ft)),onChange:b=>f(String(ft)),disabled:d(String(ft))},null,40,_hoisted_7$3),createBaseVNode("div",null,[createBaseVNode("span",{innerHTML:ft,class:"font-semibold"},null,8,_hoisted_8$3),ce[1]||(ce[1]=createTextVNode(". ")),createBaseVNode("span",{innerHTML:R.choice},null,8,_hoisted_9$3),v.value&&R.reason?(openBlock(),createElementBlock("div",{key:0,class:normalizeClass({"bg-teal-100 text-teal-800 p-0.5 rounded":E(String(ft)),"bg-rose-100 text-rose-700 p-0.5 rounded":H(String(ft))}),innerHTML:R.reason},null,10,_hoisted_10$2)):createCommentVNode("",!0)])],2)):createCommentVNode("",!0)]))),128)),_.value?(openBlock(),createElementBlock("div",_hoisted_11$2,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",onClick:ne}," Submit ")])):createCommentVNode("",!0),renderSlot(A.$slots,"solution")])],2))}}),_hoisted_1$4=["innerHTML"],_hoisted_2$3=["innerHTML"],_hoisted_3$3={class:"grouping-table border border-gray-200 w-full mt-2"},_hoisted_4$3={class:"bg-gray-100"},_hoisted_5$3=["innerHTML"],_hoisted_6$3={class:"p-2"},_hoisted_7$2={class:"font-semibold"},_hoisted_8$2=["innerHTML"],_hoisted_9$2=["checked","disabled","onChange"],_hoisted_10$1={key:2,class:"text-red-600 mt-2"},_hoisted_11$1={key:3,class:"mt-4 text-center"},_sfc_main$5=defineComponent({__name:"GRPCHCKBOX",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","submitted"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=(y,gt)=>{if(y==null)return gt;if(typeof y!="string")return y;try{return JSON.parse(y)}catch{return gt}},l=y=>y&&typeof y=="object"?y:{},u=y=>y==null?[]:Array.isArray(y)?y.map(gt=>String(gt).trim()).filter(Boolean):typeof y=="string"?y.split(",").map(gt=>gt.trim()).filter(Boolean):[String(y)],s=computed(()=>a(t.question.correct_answer,{})),f=computed(()=>l(t.question.options)),d=computed(()=>Object.keys(f.value)),v=ref(null),_=computed(()=>{var y;return typeof((y=t.question)==null?void 0:y.question)=="string"&&t.question.question.includes('id="exhibits"')}),x=computed(()=>{var y;return!!((y=t.question)!=null&&y.tabs)&&!_.value}),E=computed(()=>{var gt,it,Yt;const y=((gt=t.question)==null?void 0:gt.match_options)??((it=t.question)==null?void 0:it.match_option)??((Yt=t.question)==null?void 0:Yt.mtx_option)??{};return a(y,{})}),H=computed(()=>{const y={};if(Object.keys(E.value||{}).sort().forEach(it=>{const Yt=E.value[it];if(typeof Yt=="string"){y[it]=Yt;return}y[it]=(Yt==null?void 0:Yt.option)||it}),Object.keys(y).length)return y;const gt=new Set;return Object.keys(s.value||{}).forEach(it=>{var cn,L;const Yt=(L=(cn=s.value)==null?void 0:cn[it])==null?void 0:L.answers;u(Yt).forEach(ae=>gt.add(ae))}),Array.from(gt).sort().forEach(it=>{y[it]=it}),y}),z=reactive({}),ne=y=>{var gt;return typeof y=="string"?y:typeof(y==null?void 0:y.choice)=="string"?y.choice:((gt=y==null?void 0:y.choice)==null?void 0:gt.choice)||""},yt=y=>{var it;const gt=(it=s.value)==null?void 0:it[y];return u(gt==null?void 0:gt.answers)},A=()=>{const y={};return d.value.forEach(gt=>{const it=z[gt]||[];y[gt]={answers:it.slice().sort().join(",")}}),y},ce=y=>{!y||typeof y!="object"||d.value.forEach(gt=>{const it=y==null?void 0:y[gt];if(it!=null){if(typeof it=="object"&&it!==null&&"answers"in it){z[gt]=u(it.answers);return}z[gt]=u(it)}})};watch(()=>{var y,gt,it,Yt,cn,L;return[(y=t.question)==null?void 0:y.id,(gt=t.question)==null?void 0:gt.options,(it=t.question)==null?void 0:it.correct_answer,(Yt=t.question)==null?void 0:Yt.match_option,(cn=t.question)==null?void 0:cn.match_options,(L=t.question)==null?void 0:L.mtx_option]},()=>{Object.keys(z).forEach(y=>delete z[y]),d.value.forEach(y=>{z[y]=[]}),ce(t.modelValue)},{immediate:!0,deep:!0}),watch(()=>t.modelValue,y=>{y&&ce(y)},{deep:!0});const ft=()=>{v.value&&(v.value.unmount(),v.value=null)},b=async()=>{var gt;if(ft(),!((gt=t.question)!=null&&gt.tabs)||!_.value)return;await nextTick();const y=document.getElementById("exhibits");y&&(y.innerHTML="",v.value=createApp(_sfc_main$k,{tabs:t.question.tabs}),v.value.mount(y))};watch(()=>{var y,gt,it;return[(y=t.question)==null?void 0:y.id,(gt=t.question)==null?void 0:gt.tabs,(it=t.question)==null?void 0:it.question]},()=>{b()},{immediate:!0});const m=ref(""),i=()=>{o("update:modelValue",A())},T=(y,gt)=>(z[y]||[]).includes(gt);function Q(y,gt){m.value="";const it=z[y]||[],Yt=it.indexOf(gt);Yt>-1?it.splice(Yt,1):it.push(gt),z[y]=it.slice(),i()}const w=ref(!1),N=ref(!1),U=(y,gt)=>yt(y).includes(gt),k=(y,gt)=>{if(!w.value)return"";const it=U(y,gt),Yt=T(y,gt);return it&&Yt?"accent-teal-500":!it&&Yt?"accent-rose-600":it&&!Yt?"ring-2 ring-teal-500":""},j=inject("showSolution");function Y(){const y=toRaw(A());try{if(typeof structuredClone=="function")return structuredClone(y)}catch{}return JSON.parse(JSON.stringify(y))}function $e(){if(d.value.filter(gt=>!(z[gt]||[]).length).length){m.value="Select at least one category for every row before submitting.";return}m.value="",w.value=!0,N.value=!1,j&&j({flag:!0,value:!0}),o("submitted",{answer:Y()})}return watchEffect(()=>{switch(r){case"review":w.value=!0,N.value=!1;break;case"exam":w.value=!1,N.value=!1;break;case"tutor":w.value=!1,N.value=!0;break;default:w.value=!1,N.value=!1}}),onUnmounted(()=>{ft(),j&&j({flag:!0,value:!1})}),(y,gt)=>(openBlock(),createElementBlock("div",null,[y.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold",innerHTML:y.question.intro},null,8,_hoisted_1$4)):createCommentVNode("",!0),x.value?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:y.question.tabs},null,8,["tabs"])):createCommentVNode("",!0),createBaseVNode("div",{innerHTML:y.question.question,class:"question-text"},null,8,_hoisted_2$3),createBaseVNode("table",_hoisted_3$3,[createBaseVNode("thead",_hoisted_4$3,[createBaseVNode("tr",null,[createBaseVNode("th",{class:"p-2 text-left",innerHTML:y.question.table_header||"Finding"},null,8,_hoisted_5$3),(openBlock(!0),createElementBlock(Fragment,null,renderList(H.value,(it,Yt)=>(openBlock(),createElementBlock("th",{key:Yt,class:"p-2 text-center"},toDisplayString(it),1))),128))])]),createBaseVNode("tbody",null,[(openBlock(!0),createElementBlock(Fragment,null,renderList(f.value,(it,Yt)=>(openBlock(),createElementBlock("tr",{key:Yt,class:"hover:bg-gray-50"},[createBaseVNode("td",_hoisted_6$3,[createBaseVNode("span",_hoisted_7$2,toDisplayString(Yt)+".",1),createBaseVNode("span",{innerHTML:ne(it)},null,8,_hoisted_8$2)]),(openBlock(!0),createElementBlock(Fragment,null,renderList(H.value,(cn,L)=>(openBlock(),createElementBlock("td",{key:L,class:"p-2 text-center"},[createBaseVNode("input",{type:"checkbox",checked:T(String(Yt),String(L)),disabled:unref(r)==="review",class:normalizeClass(k(String(Yt),String(L))),onChange:ae=>Q(String(Yt),String(L))},null,42,_hoisted_9$2)]))),128))]))),128))])]),m.value?(openBlock(),createElementBlock("div",_hoisted_10$1,toDisplayString(m.value),1)):createCommentVNode("",!0),N.value?(openBlock(),createElementBlock("div",_hoisted_11$1,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",onClick:$e}," Submit ")])):createCommentVNode("",!0),renderSlot(y.$slots,"solution")]))}}),_sfc_main$4=defineComponent({__name:"QuestionRenderer",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,r=computed({get:()=>t.modelValue,set:l=>o("update:modelValue",l)}),a=computed(()=>{var l,u;switch((u=(l=t.question)==null?void 0:l.question_type)==null?void 0:u.code){case"MMA":return _sfc_main$j;case"DRD":return _sfc_main$i;case"MSA":return _sfc_main$g;case"FIB":return _sfc_main$h;case"GRP":return _sfc_main$e;case"GRPCHCKBOX":return _sfc_main$5;case"HL":return Highlight;case"ORD":return _sfc_main$c;case"BOW":return BowTie;case"MTX":return _sfc_main$a;case"MMC":return _sfc_main$9;case"DDC":return DDC;case"DRDCLOZE":return DRDCLOZE;case"MMN":return _sfc_main$6;default:return _sfc_main$f}});return(l,u)=>(openBlock(),createBlock(resolveDynamicComponent(a.value),{question:l.question,examStore:l.examStore,modelValue:r.value,"onUpdate:modelValue":u[0]||(u[0]=s=>r.value=s)},createSlots({_:2},[renderList(l.$slots,(s,f)=>({name:f,fn:withCtx(d=>[renderSlot(l.$slots,f,normalizeProps(guardReactiveProps(d)),void 0,!0)])}))]),1032,["question","examStore","modelValue"]))}}),QuestionRenderer=_export_sfc(_sfc_main$4,[["__scopeId","data-v-fa4da289"]]),_hoisted_1$3={id:"calculator_id",class:"modal"},_hoisted_2$2={class:"modal-box bg-transparent shadow-none"},_hoisted_3$2={class:"flex flex-col items-center font-mono"},_hoisted_4$2={class:"p-4 space-y-2 shadow-md w-64 select-none bg-sky-950 rounded-2xl"},_hoisted_5$2={class:"text-lg font-bold text-center"},_hoisted_6$2={class:"grid grid-cols-4 gap-2 mt-2 text-center"},_sfc_main$3=defineComponent({__name:"Calculator",setup(__props){const expression=ref(""),error=ref(!1),result=computed(()=>{try{const safeExpr=expression.value.replace(/[^-()\d/*+.]/g,""),res=eval(safeExpr);return error.value=!1,isNaN(res)?"-":res}catch(e){return error.value=!0,"-"}}),append=e=>{expression.value+=e},calculate=()=>{error.value||(expression.value=result.value.toString())},clear=()=>{expression.value=""},backspace=()=>{expression.value=expression.value.slice(0,-1)};return(e,n)=>(openBlock(),createElementBlock("dialog",_hoisted_1$3,[createBaseVNode("div",_hoisted_2$2,[n[20]||(n[20]=createBaseVNode("form",{method:"dialog"},[createBaseVNode("button",{class:"btn btn-sm btn-circle btn-ghost absolute right-1 top-1"},[createBaseVNode("i",{class:"pi pi-times text-white"})])],-1)),createBaseVNode("div",_hoisted_3$2,[createBaseVNode("div",_hoisted_4$2,[withDirectives(createBaseVNode("input",{"onUpdate:modelValue":n[0]||(n[0]=t=>expression.value=t),type:"text",class:"p-2 border bg-blue-100 text-blue-900 rounded w-full text-right",placeholder:"0",readonly:""},null,512),[[vModelText,expression.value]]),createBaseVNode("p",_hoisted_5$2,toDisplayString(result.value),1),createBaseVNode("div",_hoisted_6$2,[createBaseVNode("button",{class:"btn",onClick:n[1]||(n[1]=t=>append("7"))},"7"),createBaseVNode("button",{class:"btn",onClick:n[2]||(n[2]=t=>append("8"))},"8"),createBaseVNode("button",{class:"btn",onClick:n[3]||(n[3]=t=>append("9"))},"9"),createBaseVNode("button",{class:"btn btn-error",onClick:n[4]||(n[4]=t=>backspace())},n[19]||(n[19]=[createBaseVNode("i",{class:"pi pi-backspace text-white"},"Del",-1)])),createBaseVNode("button",{class:"btn",onClick:n[5]||(n[5]=t=>append("4"))},"4"),createBaseVNode("button",{class:"btn",onClick:n[6]||(n[6]=t=>append("5"))},"5"),createBaseVNode("button",{class:"btn",onClick:n[7]||(n[7]=t=>append("6"))},"6"),createBaseVNode("button",{class:"btn",onClick:n[8]||(n[8]=t=>append("*"))},"×"),createBaseVNode("button",{class:"btn",onClick:n[9]||(n[9]=t=>append("1"))},"1"),createBaseVNode("button",{class:"btn",onClick:n[10]||(n[10]=t=>append("2"))},"2"),createBaseVNode("button",{class:"btn",onClick:n[11]||(n[11]=t=>append("3"))},"3"),createBaseVNode("button",{class:"btn",onClick:n[12]||(n[12]=t=>append("-"))},"−"),createBaseVNode("button",{class:"btn",onClick:n[13]||(n[13]=t=>append("0"))},"0"),createBaseVNode("button",{class:"btn",onClick:n[14]||(n[14]=t=>append("."))},"."),createBaseVNode("button",{class:"btn",onClick:n[15]||(n[15]=t=>append("/"))},"/"),createBaseVNode("button",{class:"btn",onClick:n[16]||(n[16]=t=>append("+"))},"+"),createBaseVNode("button",{class:"btn col-span-2 btn-success",onClick:n[17]||(n[17]=t=>calculate())},"="),createBaseVNode("button",{class:"btn col-span-2 btn-warning",onClick:n[18]||(n[18]=t=>clear())},"C")])])])])]))}});var quillCSS=`
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
`,classes={root:"p-editor-container",toolbar:"p-editor-toolbar",content:"p-editor-content"},EditorStyle=BaseStyle.extend({name:"editor",css:quillCSS,classes}),script$1={name:"BaseEditor",extends:script$2,props:{modelValue:String,placeholder:String,readonly:Boolean,formats:Array,editorStyle:null,modules:null},style:EditorStyle,provide:function e(){return{$parentInstance:this}},beforeMount:function e(){var n;EditorStyle.loadStyle({nonce:(n=this.$primevue)===null||n===void 0||(n=n.config)===null||n===void 0||(n=n.csp)===null||n===void 0?void 0:n.nonce})}};function _typeof(e){"@babel/helpers - typeof";return _typeof=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},_typeof(e)}function ownKeys(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function _objectSpread(e){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?ownKeys(Object(t),!0).forEach(function(o){_defineProperty(e,o,t[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach(function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(t,o))})}return e}function _defineProperty(e,n,t){return n=_toPropertyKey(n),n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function _toPropertyKey(e){var n=_toPrimitive(e,"string");return _typeof(n)=="symbol"?n:String(n)}function _toPrimitive(e,n){if(_typeof(e)!="object"||!e)return e;var t=e[Symbol.toPrimitive];if(t!==void 0){var o=t.call(e,n);if(_typeof(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(e)}var QuillJS=function(){try{return window.Quill}catch{return null}}(),script={name:"Editor",extends:script$1,inheritAttrs:!1,emits:["update:modelValue","text-change","selection-change","load"],data:function e(){return{reRenderColorKey:0}},quill:null,watch:{modelValue:function e(n,t){n!==t&&this.quill&&!this.quill.hasFocus()&&(this.reRenderColorKey++,this.renderValue(n))},readonly:function e(){this.handleReadOnlyChange()}},mounted:function e(){var n=this,t={modules:_objectSpread({toolbar:this.$refs.toolbarElement},this.modules),readOnly:this.readonly,theme:"snow",formats:this.formats,placeholder:this.placeholder};QuillJS?(this.quill=new QuillJS(this.$refs.editorElement,t),this.initQuill(),this.handleLoad()):__vitePreload(()=>import("./quill-B7ULj2qj.js"),[]).then(function(o){o&&DomHandler.isExist(n.$refs.editorElement)&&(o.default?n.quill=new o.default(n.$refs.editorElement,t):n.quill=new o(n.$refs.editorElement,t),n.initQuill())}).then(function(){n.handleLoad()})},beforeUnmount:function e(){this.quill=null},methods:{renderValue:function e(n){this.quill&&(n?this.quill.setContents(this.quill.clipboard.convert(n)):this.quill.setText(""))},initQuill:function e(){var n=this;this.renderValue(this.modelValue),this.quill.on("text-change",function(t,o,r){if(r==="user"){var a=n.$refs.editorElement.children[0].innerHTML,l=n.quill.getText().trim();a==="<p><br></p>"&&(a=""),n.$emit("update:modelValue",a),n.$emit("text-change",{htmlValue:a,textValue:l,delta:t,source:r,instance:n.quill})}}),this.quill.on("selection-change",function(t,o,r){var a=n.$refs.editorElement.children[0].innerHTML,l=n.quill.getText().trim();n.$emit("selection-change",{htmlValue:a,textValue:l,range:t,oldRange:o,source:r,instance:n.quill})})},handleLoad:function e(){this.quill&&this.quill.getModule("toolbar")&&this.$emit("load",{instance:this.quill})},handleReadOnlyChange:function e(){this.quill&&this.quill.enable(!this.readonly)}}};function render(e,n,t,o,r,a){return openBlock(),createElementBlock("div",mergeProps({class:e.cx("root")},e.ptmi("root")),[createBaseVNode("div",mergeProps({ref:"toolbarElement",class:e.cx("toolbar")},e.ptm("toolbar")),[renderSlot(e.$slots,"toolbar",{},function(){return[createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("select",mergeProps({class:"ql-header",defaultValue:"0"},e.ptm("header")),[createBaseVNode("option",mergeProps({value:"1"},e.ptm("option")),"Heading",16),createBaseVNode("option",mergeProps({value:"2"},e.ptm("option")),"Subheading",16),createBaseVNode("option",mergeProps({value:"0"},e.ptm("option")),"Normal",16)],16),createBaseVNode("select",mergeProps({class:"ql-font"},e.ptm("font")),[createBaseVNode("option",normalizeProps(guardReactiveProps(e.ptm("option"))),null,16),createBaseVNode("option",mergeProps({value:"serif"},e.ptm("option")),null,16),createBaseVNode("option",mergeProps({value:"monospace"},e.ptm("option")),null,16)],16)],16),createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("button",mergeProps({class:"ql-bold",type:"button"},e.ptm("bold")),null,16),createBaseVNode("button",mergeProps({class:"ql-italic",type:"button"},e.ptm("italic")),null,16),createBaseVNode("button",mergeProps({class:"ql-underline",type:"button"},e.ptm("underline")),null,16)],16),(openBlock(),createElementBlock("span",mergeProps({key:r.reRenderColorKey,class:"ql-formats"},e.ptm("formats")),[createBaseVNode("select",mergeProps({class:"ql-color"},e.ptm("color")),null,16),createBaseVNode("select",mergeProps({class:"ql-background"},e.ptm("background")),null,16)],16)),createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("button",mergeProps({class:"ql-list",value:"ordered",type:"button"},e.ptm("list")),null,16),createBaseVNode("button",mergeProps({class:"ql-list",value:"bullet",type:"button"},e.ptm("list")),null,16),createBaseVNode("select",mergeProps({class:"ql-align"},e.ptm("select")),[createBaseVNode("option",mergeProps({defaultValue:""},e.ptm("option")),null,16),createBaseVNode("option",mergeProps({value:"center"},e.ptm("option")),null,16),createBaseVNode("option",mergeProps({value:"right"},e.ptm("option")),null,16),createBaseVNode("option",mergeProps({value:"justify"},e.ptm("option")),null,16)],16)],16),createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("button",mergeProps({class:"ql-link",type:"button"},e.ptm("link")),null,16),createBaseVNode("button",mergeProps({class:"ql-image",type:"button"},e.ptm("image")),null,16),createBaseVNode("button",mergeProps({class:"ql-code-block",type:"button"},e.ptm("codeBlock")),null,16)],16),createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("button",mergeProps({class:"ql-clean",type:"button"},e.ptm("clean")),null,16)],16)]})],16),createBaseVNode("div",mergeProps({ref:"editorElement",class:e.cx("content"),style:e.editorStyle},e.ptm("content")),null,16)],16)}script.render=render;const _hoisted_1$2={class:"card"},_sfc_main$2=defineComponent({__name:"ExamNotes",props:{modelValue:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=n;return(o,r)=>(openBlock(),createElementBlock("div",_hoisted_1$2,[createVNode(unref(script),{modelValue:o.modelValue,"onUpdate:modelValue":r[0]||(r[0]=a=>t("update:modelValue",a)),editorStyle:"height: 320px",class:"w-full"},null,8,["modelValue"])]))}}),_hoisted_1$1={key:0,class:"fixed inset-0 z-[80] bg-slate-950/55 backdrop-blur-[1px] flex items-center justify-center p-4"},_hoisted_2$1={class:"w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl"},_hoisted_3$1={class:"flex items-start justify-between gap-2"},_hoisted_4$1={class:"mt-1 text-xs text-slate-500"},_hoisted_5$1={class:"mt-4 space-y-3"},_hoisted_6$1={class:"block text-sm"},_hoisted_7$1={class:"block text-sm"},_hoisted_8$1={class:"mt-4 flex items-center justify-end gap-2"},_hoisted_9$1=["disabled"],_sfc_main$1=defineComponent({__name:"ExamFeedbackModal",props:{sourceProduct:{},examMode:{},questionId:{},examId:{}},setup(e){const n=e,t=useRoute(),o=ref(!1),r=ref(!1),a=ref("technical_issue"),l=ref(""),u=ref(""),s=ref("success"),f=computed(()=>{const E=Number(n.questionId);return Number.isFinite(E)&&E>0?E:null}),d=computed(()=>{const E=Number(n.examId);return Number.isFinite(E)&&E>0?E:null}),v=computed(()=>[`Product: ${n.sourceProduct.toUpperCase()}`,n.examMode?`Mode: ${String(n.examMode).toUpperCase()}`:null,d.value?`Exam ID: ${d.value}`:null,f.value?`Question ID: ${f.value}`:"Question ID: n/a"].filter(Boolean).join(" | ")),_=()=>{o.value=!1},x=async()=>{var E,H;if(!(l.value.trim().length<5||r.value)){r.value=!0,u.value="";try{await axios.post("/exam-feedback",{source_product:n.sourceProduct,exam_mode:n.examMode??null,exam_id:d.value,question_id:f.value,issue_type:a.value,message:l.value.trim(),route:t.fullPath,metadata:{current_path:t.fullPath,user_agent:typeof navigator<"u"?navigator.userAgent:null}}),s.value="success",u.value="Thanks. Your report was sent to our team.",l.value="",setTimeout(()=>{_(),u.value=""},900)}catch(z){s.value="error",u.value=((H=(E=z==null?void 0:z.response)==null?void 0:E.data)==null?void 0:H.message)||"Unable to send report. Please try again."}finally{r.value=!1}}};return(E,H)=>(openBlock(),createElementBlock(Fragment,null,[createBaseVNode("button",{type:"button",class:"inline-flex items-center gap-1 cursor-pointer",onClick:H[0]||(H[0]=z=>o.value=!0)},H[3]||(H[3]=[createBaseVNode("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"size-6"},[createBaseVNode("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"})],-1),createBaseVNode("span",{class:"hidden 2xl:block"},"Report",-1)])),o.value?(openBlock(),createElementBlock("div",_hoisted_1$1,[createBaseVNode("div",_hoisted_2$1,[createBaseVNode("div",_hoisted_3$1,[createBaseVNode("div",null,[H[4]||(H[4]=createBaseVNode("h3",{class:"text-lg font-semibold"},"Report Question or Issue",-1)),createBaseVNode("p",_hoisted_4$1,toDisplayString(v.value),1)]),createBaseVNode("button",{type:"button",class:"text-slate-400 hover:text-slate-600",onClick:_},H[5]||(H[5]=[createBaseVNode("i",{class:"pi pi-times"},null,-1)]))]),createBaseVNode("div",_hoisted_5$1,[createBaseVNode("label",_hoisted_6$1,[H[7]||(H[7]=createBaseVNode("span",{class:"mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"},"Issue Type",-1)),withDirectives(createBaseVNode("select",{"onUpdate:modelValue":H[1]||(H[1]=z=>a.value=z),class:"w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500"},H[6]||(H[6]=[createBaseVNode("option",{value:"technical_issue"},"Technical issue",-1),createBaseVNode("option",{value:"content_error"},"Question/content error",-1),createBaseVNode("option",{value:"answer_issue"},"Answer/rationale concern",-1),createBaseVNode("option",{value:"other"},"Other",-1)]),512),[[vModelSelect,a.value]])]),createBaseVNode("label",_hoisted_7$1,[H[8]||(H[8]=createBaseVNode("span",{class:"mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"},"Details",-1)),withDirectives(createBaseVNode("textarea",{"onUpdate:modelValue":H[2]||(H[2]=z=>l.value=z),rows:"5",maxlength:"3000",placeholder:"Tell us what happened, what looked wrong, and what you expected.",class:"w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"},null,512),[[vModelText,l.value]])]),u.value?(openBlock(),createElementBlock("p",{key:0,class:normalizeClass(["text-xs rounded-lg px-3 py-2",s.value==="success"?"bg-emerald-100 text-emerald-700":"bg-rose-100 text-rose-700"])},toDisplayString(u.value),3)):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_8$1,[createBaseVNode("button",{type:"button",class:"rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100",onClick:_}," Cancel "),createBaseVNode("button",{type:"button",class:"rounded-full bg-sky-500/95 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60",disabled:r.value||l.value.trim().length<5,onClick:x},toDisplayString(r.value?"Sending...":"Send Report"),9,_hoisted_9$1)])])])):createCommentVNode("",!0)],64))}}),_hoisted_1=["aria-busy"],_hoisted_2={class:"border-b border-white/10 bg-slate-950 px-4 py-3 text-white"},_hoisted_3={class:"mt-3 flex flex-wrap items-center justify-between gap-2"},_hoisted_4={key:0,class:"inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100 ring-1 ring-white/15",for:"customSwitch1"},_hoisted_5={key:1,class:"inline-flex items-center gap-2 rounded-full bg-teal-400/15 px-3 py-1.5 text-xs font-semibold text-teal-100 ring-1 ring-teal-300/30"},_hoisted_6={key:2,class:"inline-flex items-center gap-2 rounded-full bg-sky-400/15 px-3 py-1.5 text-xs font-semibold text-sky-100 ring-1 ring-sky-300/30"},_hoisted_7={key:0,class:"flex justify-start"},_hoisted_8={class:"max-w-[92%] rounded-2xl rounded-tl-sm border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm dark:border-amber-400/20 dark:bg-amber-400/10"},_hoisted_9=["innerHTML"],_hoisted_10=["innerHTML"],_hoisted_11={key:1,class:"flex h-full min-h-64 flex-col items-center justify-center text-center text-slate-500 dark:text-slate-300"},_hoisted_12={key:2,class:"flex justify-start"},_hoisted_13={key:3,class:"flex justify-start"},_hoisted_14={class:"max-w-[86%] rounded-2xl rounded-tl-sm border border-dashed border-teal-300 bg-white px-4 py-3 text-slate-800 shadow-sm dark:border-teal-500/60 dark:bg-slate-800 dark:text-slate-100"},_hoisted_15=["innerHTML"],_hoisted_16={class:"border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950"},_hoisted_17=["disabled"],_hoisted_18=["disabled"],_sfc_main={__name:"AiChat",props:{question:{type:[Object,String],default:null},solution:{type:String,default:""},chatOpened:{type:Boolean,default:!0}},emits:["update:chatOpened","close"],setup(e,{emit:n}){const t=e,o=n,r=ref([]),a=ref(""),l=ref(""),u=ref(!1),s=ref(!1),f=ref(!1),d=ref(null),v=ref(""),_=ref(""),x=computed(()=>{var T;const i=typeof t.question=="string"?t.question:(T=t.question)==null?void 0:T.question;return typeof i=="string"?i.trim():""}),E=computed(()=>t.question?typeof t.question=="string"?{question:t.question,solution:t.solution||void 0}:t.question:null);let H=null;const z=computed(()=>s.value&&f.value),ne=i=>String(i??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),yt=i=>ne(i).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>"),A=async()=>{await nextTick(),d.value&&(d.value.scrollTop=d.value.scrollHeight)},ce=()=>{H&&(H.abort(),H=null),s.value=!1,f.value=!1},R=()=>{a.value!==""&&(r.value.push({id:`${Date.now()}-assistant`,role:"assistant",content:a.value}),a.value="")},ft=()=>{const i=t.question&&typeof t.question=="object"&&t.question.id?t.question.id:null;return i==null||String(i).trim()===""?null:String(i)},b=async(i=null,T={})=>{if(!t.chatOpened)return 0;const{showUserMessage:Q=!0,clearInput:w=!0,showErrorMessage:N=!0}=T;i&&typeof i=="object"&&"preventDefault"in i&&(i=null);const U=String(i??l.value??"").trim();if(!U||s.value)return!1;ce(),Q&&r.value.push({id:`${Date.now()}-user`,role:"user",content:U});const k={message:U,deep_reasoning:u.value},j=ft();j!==null&&(k.question_id=j);const Y="/api/ai/incident-assistant";w&&i===null&&(l.value=""),a.value="",s.value=!0,f.value=!0,H=new AbortController;try{const $e=await fetch(Y,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json",Accept:"text/event-stream"},body:JSON.stringify(k),signal:H.signal});if(!$e.ok||!$e.body){let Yt="";try{Yt=(await $e.text()).trim()}catch{Yt=""}const cn=Yt?` - ${Yt.slice(0,300)}`:"";throw new Error(`Stream request failed: ${$e.status}${cn}`)}const y=$e.body.getReader(),gt=new TextDecoder("utf-8");let it="";for(;;){const{done:Yt,value:cn}=await y.read();if(Yt)break;for(it+=gt.decode(cn,{stream:!0});;){const L=it.indexOf(`

`);if(L===-1)break;const ae=it.slice(0,L);it=it.slice(L+2);const F=ae.split(`
`),nn=[];for(const ln of F){const sn=ln.endsWith("\r")?ln.slice(0,-1):ln;if(!sn.startsWith("data:"))continue;let Xt=sn.slice(5);Xt.startsWith(" ")&&(Xt=Xt.slice(1)),nn.push(Xt)}if(nn.length===0)continue;const on=nn.join(`
`);if(on==="[DONE]")return R(),H=null,s.value=!1,f.value=!1,await A(),!0;on.trim()!==""&&(f.value=!1),a.value+=on,await A()}}return R(),H=null,s.value=!1,f.value=!1,await A(),!0}catch($e){return($e==null?void 0:$e.name)!=="AbortError"&&(console.error("Stream error",$e),!a.value&&N?r.value.push({id:`${Date.now()}-error`,role:"assistant",content:"Unable to respond right now. Try again later."}):R()),H=null,s.value=!1,f.value=!1,await A(),!1}},m=()=>{ce(),l.value="",o("update:chatOpened",!1),o("close")};return watch(()=>[E.value,t.chatOpened],async([i,T])=>{if(!T||!i||typeof i!="object")return;const Q=JSON.stringify(i);if(!Q||Q==="{}"||Q===v.value||Q===_.value)return;const w=s.value;await b(Q,{showUserMessage:!1,clearInput:!1,showErrorMessage:!1})?(v.value=Q,_.value=""):w?_.value=Q:_.value=""},{immediate:!0,deep:!0}),watch(()=>s.value,async i=>{if(i||!_.value)return;if(_.value===v.value){_.value="";return}const T=_.value;await b(T,{showUserMessage:!1,clearInput:!1,showErrorMessage:!1})&&(v.value=T),_.value=""}),onBeforeUnmount(()=>{ce()}),(i,T)=>t.chatOpened?(openBlock(),createElementBlock("section",{key:0,class:"fixed left-3 right-3 bottom-3 z-50 mx-auto flex h-[min(78vh,680px)] w-auto max-w-xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 dark:border-sky-800 dark:bg-slate-950 dark:shadow-black/30 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[520px]",role:"dialog","aria-label":"Nursedive AI Assistant","aria-busy":s.value},[createBaseVNode("header",_hoisted_2,[createBaseVNode("div",{class:"flex items-start justify-between gap-3"},[T[4]||(T[4]=createStaticVNode('<div class="flex min-w-0 items-center gap-3"><a href="/" class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-white/30" aria-label="Nursedive home"><img src="https://www.nursedive.com/images/favicon.png" class="h-7 w-7 object-contain" alt="Nursedive"></a><div class="min-w-0"><h2 class="truncate text-base font-semibold leading-5">Nursing AI Assistant</h2><p class="mt-0.5 text-xs text-slate-300">Nursedive AI</p></div></div>',1)),createBaseVNode("button",{type:"button",onClick:m,class:"grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-300","aria-label":"Close chat"},T[3]||(T[3]=[createBaseVNode("i",{class:"pi pi-times text-sm"},null,-1)]))]),createBaseVNode("div",_hoisted_3,[s.value?createCommentVNode("",!0):(openBlock(),createElementBlock("label",_hoisted_4,[T[5]||(T[5]=createBaseVNode("span",null,"Deeper Reasoning",-1)),withDirectives(createBaseVNode("input",{id:"customSwitch1","onUpdate:modelValue":T[0]||(T[0]=Q=>u.value=Q),type:"checkbox",class:"peer sr-only"},null,512),[[vModelCheckbox,u.value]]),T[6]||(T[6]=createBaseVNode("span",{class:"relative h-5 w-9 rounded-full bg-white/25 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-teal-400 peer-checked:after:translate-x-4","aria-hidden":"true"},null,-1))])),z.value?(openBlock(),createElementBlock("span",_hoisted_5,T[7]||(T[7]=[createBaseVNode("span",{class:"h-3 w-3 animate-spin rounded-full border-2 border-teal-100/40 border-t-teal-100","aria-hidden":"true"},null,-1),createTextVNode(" Thinking... ")]))):s.value?(openBlock(),createElementBlock("span",_hoisted_6,T[8]||(T[8]=[createBaseVNode("span",{class:"h-2 w-2 rounded-full bg-sky-200"},null,-1),createTextVNode(" Responding... ")]))):createCommentVNode("",!0)])]),createBaseVNode("div",{ref_key:"chatContainer",ref:d,class:"flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-900/95 sm:p-5"},[x.value?(openBlock(),createElementBlock("div",_hoisted_7,[createBaseVNode("div",_hoisted_8,[T[9]||(T[9]=createBaseVNode("div",{class:"mb-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-200"}," Question Recap ",-1)),createBaseVNode("div",{class:"whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800 dark:text-slate-100 [&_strong]:font-semibold",innerHTML:x.value},null,8,_hoisted_9)])])):createCommentVNode("",!0),(openBlock(!0),createElementBlock(Fragment,null,renderList(r.value,Q=>(openBlock(),createElementBlock("div",{key:Q.id,class:normalizeClass(["flex w-full",Q.role==="user"?"justify-end":"justify-start"])},[createBaseVNode("div",{class:normalizeClass(["max-w-[86%] px-4 py-3 shadow-sm ring-1",Q.role==="user"?"rounded-2xl rounded-tr-sm bg-teal-600 text-white ring-teal-500/40":"rounded-2xl rounded-tl-sm bg-white text-slate-800 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700"])},[createBaseVNode("div",{class:normalizeClass(["mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide",Q.role==="user"?"text-teal-50":"text-slate-500 dark:text-slate-300"])},[createBaseVNode("span",{class:normalizeClass(["h-1.5 w-1.5 rounded-full",Q.role==="user"?"bg-white/80":"bg-teal-500"])},null,2),createTextVNode(" "+toDisplayString(Q.role==="user"?"You":"AI Tutor"),1)],2),createBaseVNode("div",{class:"whitespace-pre-wrap break-words text-sm leading-relaxed [&_strong]:font-semibold",innerHTML:yt(Q.content)},null,8,_hoisted_10)],2)],2))),128)),r.value.length===0&&!x.value?(openBlock(),createElementBlock("div",_hoisted_11,T[10]||(T[10]=[createBaseVNode("div",{class:"grid h-14 w-14 place-items-center rounded-2xl bg-white text-teal-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"},[createBaseVNode("i",{class:"pi pi-comments text-xl"})],-1),createBaseVNode("p",{class:"mt-3 text-sm font-medium text-slate-700 dark:text-slate-100"},"Start a chat with Nursedive AI tutor",-1),createBaseVNode("p",{class:"mt-1 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400"}," Ask about rationales, topics, or study strategy. ",-1)]))):createCommentVNode("",!0),f.value?(openBlock(),createElementBlock("div",_hoisted_12,T[11]||(T[11]=[createStaticVNode('<div class="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"><div class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"> AI Tutor </div><div class="flex items-center gap-1.5 py-1" aria-label="Loading response"><span class="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.3s]"></span><span class="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.15s]"></span><span class="h-2 w-2 animate-bounce rounded-full bg-teal-500"></span></div></div>',1)]))):createCommentVNode("",!0),a.value?(openBlock(),createElementBlock("div",_hoisted_13,[createBaseVNode("div",_hoisted_14,[T[12]||(T[12]=createBaseVNode("div",{class:"mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"},[createBaseVNode("span",{class:"h-1.5 w-1.5 rounded-full bg-teal-500"}),createTextVNode(" AI Tutor ")],-1)),createBaseVNode("div",{class:"whitespace-pre-wrap break-words text-sm leading-relaxed [&_strong]:font-semibold",innerHTML:yt(a.value)},null,8,_hoisted_15)])])):createCommentVNode("",!0)],512),createBaseVNode("footer",_hoisted_16,[createBaseVNode("form",{onSubmit:T[2]||(T[2]=withModifiers(Q=>b(),["prevent"])),class:"flex items-center gap-2 rounded-[1.5rem] bg-slate-100 p-2 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"},[withDirectives(createBaseVNode("input",{"onUpdate:modelValue":T[1]||(T[1]=Q=>l.value=Q),type:"text",class:"min-h-11 flex-1 rounded-full border-0 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white dark:placeholder:text-slate-500",placeholder:"Type your message",disabled:s.value},null,8,_hoisted_17),[[vModelText,l.value,void 0,{trim:!0}]]),createBaseVNode("button",{class:"grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-600 text-white shadow-sm shadow-teal-900/20 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:focus:ring-offset-slate-950",type:"submit",disabled:s.value||!l.value.trim(),"aria-label":"Send message"},T[13]||(T[13]=[createBaseVNode("i",{class:"pi pi-arrow-up text-sm"},null,-1)]),8,_hoisted_18)],32)])],8,_hoisted_1)):createCommentVNode("",!0)}};export{QuestionRenderer as Q,_sfc_main$1 as _,_sfc_main$3 as a,_sfc_main$2 as b,_sfc_main as c};
