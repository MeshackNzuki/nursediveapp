import{z as defineComponent,r as ref,A as computed,F as watch,f as createElementBlock,k as createCommentVNode,h as createBaseVNode,G as Fragment,H as renderList,n as normalizeClass,t as toDisplayString,g as openBlock,a4 as watchEffect,o as onMounted,a5 as createApp,Y as onUnmounted,J as inject,l as createBlock,K as renderSlot,s as unref,q as createTextVNode,O as nextTick,p as withDirectives,v as vModelText,a6 as vModelRadio,a7 as reactive,Z as toRaw,_ as _export_sfc,I as toRefs,W as h$1,a8 as getCurrentInstance,a9 as isRef,i as createVNode,w as withCtx,j as createStaticVNode,aa as createSlots,ab as normalizeProps,ac as guardReactiveProps,ad as resolveDynamicComponent,ae as BaseStyle,af as script$2,ag as __vitePreload,ah as DomHandler,ai as mergeProps,R as vModelSelect,c as useRoute,y as axios,u as useAuthStore,B as onBeforeUnmount,e as resolveComponent,Q as vModelCheckbox,m as withModifiers}from"./main-DPSVGGOu.js";const _hoisted_1$j={key:0,class:"mb-4"},_hoisted_2$h={class:"flex gap-2 mb-2"},_hoisted_3$h=["onClick"],_hoisted_4$h=["innerHTML"],_sfc_main$k=defineComponent({__name:"TabRenderer",props:{tabs:{}},setup(e){const n=e,t=ref(0),o=computed(()=>{if(!n.tabs)return[];try{const r=typeof n.tabs=="string"?JSON.parse(n.tabs||"{}"):n.tabs;return!r||typeof r!="object"?[]:Object.entries(r)}catch{return[]}});return watch(()=>n.tabs,()=>{t.value=0}),(r,a)=>o.value.length?(openBlock(),createElementBlock("div",_hoisted_1$j,[createBaseVNode("div",_hoisted_2$h,[(openBlock(!0),createElementBlock(Fragment,null,renderList(o.value,([l],d)=>(openBlock(),createElementBlock("button",{key:d,class:normalizeClass(["text-sm px-3 py-1 rounded-t border-b-1 font-bold cursor-pointer",{"border-sky-600 border-b-3 dark:text-gray-700 bg-gray-200 rounded-t-md":t.value===d,"text-gray-700 dark:text-gray-100":t.value!==d}]),onClick:s=>t.value=d},toDisplayString(l),11,_hoisted_3$h))),128))]),createBaseVNode("div",{class:"pt-2 prose max-w-none border border-gray-200 p-2 rounded",innerHTML:o.value[t.value][1]},null,8,_hoisted_4$h)])):createCommentVNode("",!0)}}),qn_arrow="/build/assets/qn_arrow-CpnXGZsK.png",_hoisted_1$i=["innerHTML"],_hoisted_2$g={class:"flex items-start gap-2"},_hoisted_3$g=["src"],_hoisted_4$g=["innerHTML"],_hoisted_5$g=["value","checked","onChange","disabled"],_hoisted_6$g=["innerHTML"],_hoisted_7$e=["innerHTML"],_hoisted_8$d={class:"text-lg font-normal"},_hoisted_9$b=["innerHTML"],_hoisted_10$9={key:0,class:"mt-4 p-4 text-center"},_sfc_main$j=defineComponent({__name:"MMA",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","update:showSolution"],setup(e,{emit:n}){const t=e,{testMode:o,answers:r,results:a}=t.examStore,l=n,d=computed({get:()=>t.modelValue,set:ne=>l("update:modelValue",ne)}),s=ne=>{const yt=[...d.value],A=yt.indexOf(ne);A!==-1?yt.splice(A,1):yt.push(ne),d.value=yt},f=ref(!1),u=ref(!1);watchEffect(()=>{var ne,yt;switch(o){case"review":f.value=!0;break;case"exam":f.value=!1;break;case"tutor":f.value=!1,u.value=!0,t.examStore.answers[t.question.id]&&setTimeout(()=>{f.value=!!t.examStore.answers[t.question.id],E({flag:!0,value:f.value})},(Array.isArray((ne=t.question)==null?void 0:ne.correct_answer)?t.question.correct_answer:JSON.parse(((yt=t.question)==null?void 0:yt.correct_answer)??"[]")).length*1e4);break;default:f.value=!1}});const k=computed(()=>{if(Array.isArray(t.question.correct_answer))return t.question.correct_answer;try{return JSON.parse(t.question.correct_answer||"[]")}catch{return[]}}),N=ne=>k.value.includes(ne),y=ne=>{const yt=r[t.question.id]??[];return o==="review"?(a[t.question.id],yt.includes(ne)&&!k.value.includes(ne)):o==="tutor"?yt.includes(ne)&&!N(ne):!1},E=inject("showSolution"),L=()=>{f.value=!0,E({flag:!0,value:!0}),u.value=!1},H=ref(null);return onMounted(()=>{const ne=document.getElementById("exhibits");ne&&(ne.innerHTML="",H.value=createApp(_sfc_main$k,{tabs:t.question.tabs}),H.value.mount(ne))}),onUnmounted(()=>{E({flag:!0,value:!1}),H.value&&(H.value.unmount(),H.value=null)}),(ne,yt)=>(openBlock(),createElementBlock("div",{class:normalizeClass([ne.question.tabs&&["nclex","cat"].includes(ne.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[ne.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold text-gray-950 dark:text-white",innerHTML:ne.question.intro},null,8,_hoisted_1$i)):createCommentVNode("",!0),ne.question.tabs&&["nclex","cat"].includes(ne.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:ne.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$g,[createBaseVNode("img",{src:unref(qn_arrow),class:"h-7 shrink-0"},null,8,_hoisted_3$g),createBaseVNode("div",{class:"mb-2 font-bold text-gray-950 leading-relaxed dark:text-white",innerHTML:ne.question.question},null,8,_hoisted_4$g)]),(openBlock(!0),createElementBlock(Fragment,null,renderList(ne.question.options,(A,ae)=>(openBlock(),createElementBlock("div",{key:ae,class:"mb-2 ms-2 md:ms-8"},[A.choice!=null&&A.choice!=""&&A.choice!="None"?(openBlock(),createElementBlock("label",{key:0,class:normalizeClass(["flex items-start gap-2",{"text-teal-600 font-semibold":N(String(ae))&&f.value,"text-rose-600 font-semibold":y(String(ae))&&f.value}])},[createBaseVNode("input",{type:"checkbox",class:"checkbox checkbox-sm mt-1 cursor-pointer border-gray-600 text-gray-700 dark:text-slate-100 dark:border-white",value:String(ae),checked:d.value.includes(String(ae)),onChange:R=>s(String(ae)),disabled:unref(o)==="review"},null,40,_hoisted_5$g),createBaseVNode("div",null,[createBaseVNode("span",{innerHTML:ae,class:"font-semibold"},null,8,_hoisted_6$g),yt[0]||(yt[0]=createTextVNode(". ")),createBaseVNode("span",{innerHTML:A.choice},null,8,_hoisted_7$e),yt[1]||(yt[1]=createTextVNode()),createBaseVNode("span",_hoisted_8$d,toDisplayString(N(String(ae))&&f.value?"✓":y(String(ae))&&f.value?"✗":""),1),f.value&&A.reason?(openBlock(),createElementBlock("div",{key:0,class:normalizeClass({"bg-teal-100/90 text-teal-800 p-0.5 rounded":N(String(ae)),"bg-rose-100/90 text-rose-800 p-0.5 rounded":y(String(ae))}),innerHTML:A.reason},null,10,_hoisted_9$b)):createCommentVNode("",!0)])],2)):createCommentVNode("",!0)]))),128)),u.value?(openBlock(),createElementBlock("div",_hoisted_10$9,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",onClick:L}," Submit ")])):createCommentVNode("",!0),renderSlot(ne.$slots,"solution")])],2))}}),_hoisted_1$h=["innerHTML"],_hoisted_2$f={class:"flex items-start gap-2"},_hoisted_3$f=["src"],_hoisted_4$f=["innerHTML"],_hoisted_5$f={key:0,class:"mt-3 space-y-2 text-sm"},_hoisted_6$f={key:1,class:"mt-4 p-4 text-center"},_hoisted_7$d=["disabled"],_sfc_main$i=defineComponent({__name:"Dropdown",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,{testMode:o}=t.examStore,r=n,a=inject("showSolution",null),l=ref(!1),d=ref(!1),s=computed({get:()=>t.modelValue||{},set:m=>r("update:modelValue",m)}),f=computed(()=>{const m=t.question.correct_answer;if(!m)return{};if(typeof m=="object")return m;if(typeof m=="string")try{return JSON.parse(m)}catch{return{}}return{}}),u=computed(()=>{const m=t.question.options||{};return Object.keys(m).every(ce=>!!s.value[ce])}),k=computed(()=>Object.keys(t.question.options||{})),N=m=>f.value[m]===s.value[m],y=m=>!!s.value[m]&&f.value[m]!==s.value[m],E=m=>!s.value[m]&&!!f.value[m],L=m=>m.replace(/<[^>]*>/g,"").trim(),H=(m,ce)=>{var w;if(!ce)return"none";const Y=(w=t.question.options)==null?void 0:w[m],i=Y==null?void 0:Y[ce];return i&&L(String(i))||ce},ne=m=>{const ce=s.value[m],Y=f.value[m],i=H(m,ce),w=H(m,Y);return N(m)?`${m}: Correct`:y(m)?`${m}: Incorrect (selected "${i}", correct is "${w}")`:E(m)?`${m}: Not answered (correct is "${w}")`:`${m}: No answer`},yt=m=>N(m)?"pi-check text-teal-600":y(m)?"pi-times text-rose-600":E(m)?"pi-exclamation-triangle text-amber-600":"pi-circle text-gray-400",A=m=>N(m)?"text-teal-700 font-semibold":y(m)?"text-rose-700 font-semibold":E(m)?"text-amber-700 font-semibold":"text-gray-500",ae=ref(null);function R(){const m=ae.value;if(!m)return;const ce=t.question.options||{};Object.entries(ce).forEach(([Y,i])=>{let w=m.querySelector(`#${Y}`);if(!w)return;let z;w.tagName==="SELECT"?(z=w,z.innerHTML=""):(w.innerHTML="",z=document.createElement("select"),w.appendChild(z)),z.name=Y,z.disabled=o==="review",z.className=`inline-block border p-1 rounded mx-1 text-sm align-middle transition-opacity duration-300 ease-in opacity-0 ${$e(Y)}`,z.style.minWidth="6rem",z.style.maxWidth="220px",requestAnimationFrame(()=>{z.style.opacity="1"});const _=new Option("-- Select --","");_.disabled=!0,_.selected=!s.value[Y],z.appendChild(_),Object.entries(i).forEach(([j,U])=>{if(!U)return;const gt=new Option(U,j,!1,s.value[Y]===j);z.appendChild(gt)}),z.addEventListener("change",j=>{const U=j.target;r("update:modelValue",{...s.value,[Y]:U.value})})})}function $e(m){return l.value?N(m)?"border-teal-500 bg-teal-50 text-teal-800":y(m)?"border-rose-500 bg-rose-50 text-rose-800":E(m)?"border-amber-500 bg-amber-50 text-amber-800":"border-gray-300":"border-gray-300"}function v(){u.value&&(l.value=!0,d.value=!1,a&&a({flag:!0,value:!0}))}watchEffect(()=>{switch(t.question.id,o){case"review":l.value=!0,d.value=!1;break;case"exam":l.value=!1,d.value=!1;break;case"tutor":l.value=!1,d.value=!0;break;default:l.value=!1,d.value=!1}}),onMounted(()=>nextTick(R)),watch(()=>[t.question,t.modelValue,o,l.value],()=>nextTick(R),{deep:!0});const b=ref(null);return onMounted(()=>{const m=document.getElementById("exhibits");m&&(m.innerHTML="",b.value=createApp(_sfc_main$k,{tabs:t.question.tabs}),b.value.mount(m))}),onUnmounted(()=>{a&&a({flag:!0,value:!1}),b.value&&(b.value.unmount(),b.value=null)}),(m,ce)=>(openBlock(),createElementBlock("div",{class:normalizeClass([m.question.tabs&&["nclex","cat"].includes(m.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[m.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold text-gray-950 dark:text-white",innerHTML:m.question.intro},null,8,_hoisted_1$h)):createCommentVNode("",!0),m.question.tabs&&["nclex","cat"].includes(m.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:m.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$f,[createBaseVNode("img",{src:unref(qn_arrow),class:"h-7 shrink-0"},null,8,_hoisted_3$f),createBaseVNode("div",{ref_key:"questionContainer",ref:ae,class:"prose max-w-none mb-2 font-bold text-gray-950 leading-relaxed dark:prose-invert dark:text-white",innerHTML:m.question.question},null,8,_hoisted_4$f)]),l.value?(openBlock(),createElementBlock("div",_hoisted_5$f,[(openBlock(!0),createElementBlock(Fragment,null,renderList(k.value,Y=>(openBlock(),createElementBlock("div",{key:`fb-${Y}`,class:"flex items-center gap-2"},[createBaseVNode("i",{class:normalizeClass(`pi ${yt(Y)}`)},null,2),createBaseVNode("span",{class:normalizeClass(A(Y))},toDisplayString(ne(Y)),3)]))),128))])):createCommentVNode("",!0),d.value?(openBlock(),createElementBlock("div",_hoisted_6$f,[createBaseVNode("button",{class:normalizeClass(["px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",u.value?"":"opacity-50 cursor-not-allowed"]),disabled:!u.value,onClick:v}," Submit ",10,_hoisted_7$d)])):createCommentVNode("",!0),renderSlot(m.$slots,"solution")])],2))}}),_hoisted_1$g=["innerHTML"],_hoisted_2$e={class:"flex items-start gap-2"},_hoisted_3$e=["src"],_hoisted_4$e=["innerHTML"],_hoisted_5$e={class:"flex items-center gap-2"},_hoisted_6$e=["disabled"],_hoisted_7$c={key:0},_hoisted_8$c=["innerHTML"],numericTolerance=.01,_sfc_main$h=defineComponent({__name:"FIB",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,{testMode:o,answers:r}=t.examStore,a=n,l=computed({get:()=>t.modelValue,set:E=>a("update:modelValue",E)}),d=computed(()=>{if(Array.isArray(t.question.correct_answer))return t.question.correct_answer;try{return JSON.parse(t.question.correct_answer||"[]")}catch{return[]}}),s=computed(()=>{switch(o){case"review":return!0;case"exam":return!1;case"tutor":return!!t.examStore.answers[t.question.id];default:return!1}}),f=E=>E.trim().toLowerCase(),u=E=>!isNaN(parseFloat(E))&&isFinite(Number(E)),k=computed(()=>{if(!s.value)return!1;const E=l.value.trim();if(!E)return!1;for(const L of d.value){const H=String(L).trim();if(u(H)&&u(E)){const ne=parseFloat(H),yt=parseFloat(E);if(Math.abs(ne-yt)<=numericTolerance)return!0}if(f(H)===f(E))return!0}return!1}),N=computed(()=>s.value&&l.value.trim()!==""&&!k.value),y=ref(null);return onMounted(()=>{const E=document.getElementById("exhibits");E&&(E.innerHTML="",y.value=createApp(_sfc_main$k,{tabs:t.question.tabs}),y.value.mount(E))}),onUnmounted(()=>{y.value&&(y.value.unmount(),y.value=null)}),(E,L)=>(openBlock(),createElementBlock("div",{class:normalizeClass([E.question.tabs&&["nclex","cat"].includes(E.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[E.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold text-gray-950 dark:text-white",innerHTML:E.question.intro},null,8,_hoisted_1$g)):createCommentVNode("",!0),E.question.tabs&&["nclex","cat"].includes(E.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:E.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$e,[createBaseVNode("img",{src:unref(qn_arrow),class:"h-7 shrink-0"},null,8,_hoisted_3$e),createBaseVNode("div",{class:"mb-2 font-bold text-gray-950 leading-relaxed dark:text-white",innerHTML:E.question.question},null,8,_hoisted_4$e)]),createBaseVNode("div",null,[createBaseVNode("label",_hoisted_5$e,[L[1]||(L[1]=createBaseVNode("span",null,"Answer:",-1)),withDirectives(createBaseVNode("input",{type:"text","onUpdate:modelValue":L[0]||(L[0]=H=>l.value=H),class:"border-b border-black dark:border-slate-300 dark:bg-sky-950 px-2 py-1 w-32",disabled:unref(o)==="review"},null,8,_hoisted_6$e),[[vModelText,l.value]]),E.question.units?(openBlock(),createElementBlock("span",_hoisted_7$c,toDisplayString(E.question.units),1)):createCommentVNode("",!0),s.value?(openBlock(),createElementBlock("i",{key:1,class:normalizeClass(`ms-2 pi text-lg ${k.value?"pi-check text-teal-600":N.value?"pi-times text-rose-600":""}`)},null,2)):createCommentVNode("",!0)]),s.value&&E.question.solution?(openBlock(),createElementBlock("div",{key:0,class:"mt-2 bg-teal-100/90 text-teal-800 p-2 rounded",innerHTML:E.question.solution},null,8,_hoisted_8$c)):createCommentVNode("",!0)])],2))}}),_hoisted_1$f=["innerHTML"],_hoisted_2$d={class:"flex items-start gap-2"},_hoisted_3$d=["src"],_hoisted_4$d=["innerHTML"],_hoisted_5$d=["value","name","disabled"],_hoisted_6$d=["innerHTML"],_hoisted_7$b=["innerHTML"],_hoisted_8$b={class:"text-lg font-normal"},_hoisted_9$a=["innerHTML"],_sfc_main$g=defineComponent({__name:"MSA",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","update:showSolution"],setup(e,{emit:n}){const t=e,{testMode:o,results:r,answers:a}=t.examStore,l=n,d=computed({get:()=>t.modelValue,set:N=>l("update:modelValue",N)}),s=computed(()=>{switch(o){case"review":return!0;case"tutor":return!!t.examStore.answers[t.question.id];default:return!1}}),f=N=>{const y=t.question.correct_answer;return Array.isArray(y)?y.includes(N):y===N},u=N=>{const y=t.examStore.answers[t.question.id];if(o==="review"){const E=r[t.question.id];return(E==null?void 0:E.correct)===!1&&y===N}return o==="tutor"?y===N&&!f(N):!1},k=ref(null);return onMounted(()=>{const N=document.getElementById("exhibits");N&&(N.innerHTML="",k.value=createApp(_sfc_main$k,{tabs:t.question.tabs}),k.value.mount(N))}),onUnmounted(()=>{k.value&&(k.value.unmount(),k.value=null)}),(N,y)=>(openBlock(),createElementBlock("div",{class:normalizeClass([N.question.tabs&&["nclex","cat"].includes(N.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[N.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold text-gray-950 dark:text-white",innerHTML:N.question.intro},null,8,_hoisted_1$f)):createCommentVNode("",!0),N.question.tabs&&["nclex","cat"].includes(N.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:N.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$d,[createBaseVNode("img",{src:unref(qn_arrow),class:"h-7 shrink-0"},null,8,_hoisted_3$d),createBaseVNode("div",{class:"mb-2 font-bold text-gray-950 leading-relaxed dark:text-white",innerHTML:N.question.question},null,8,_hoisted_4$d)]),(openBlock(!0),createElementBlock(Fragment,null,renderList(N.question.options,(E,L)=>(openBlock(),createElementBlock("div",{key:L,class:"mb-2 ms-2 md:ms-8"},[E.choice!=null&&E.choice!=""&&E.choice!="None"?(openBlock(),createElementBlock("label",{key:0,class:normalizeClass(["flex items-start gap-2",{"text-teal-600 font-semibold":f(String(L))&&s.value,"text-rose-600 font-semibold":u(String(L))&&s.value}])},[withDirectives(createBaseVNode("input",{type:"radio",class:"radio bg-blue-50 radio-neutral checked:radio-accent checked:bg-sky-50 checked:text-sky-600 mt-1 cursor-pointer border-gray-600 dark:text-slate-100 dark:border-white",value:L,"onUpdate:modelValue":y[0]||(y[0]=H=>d.value=H),name:`question-${N.question.id}`,disabled:unref(o)==="review"},null,8,_hoisted_5$d),[[vModelRadio,d.value]]),createBaseVNode("div",null,[createBaseVNode("span",{innerHTML:L,class:"font-semibold"},null,8,_hoisted_6$d),y[1]||(y[1]=createTextVNode(". ")),createBaseVNode("span",{innerHTML:E.choice},null,8,_hoisted_7$b),y[2]||(y[2]=createTextVNode()),createBaseVNode("span",_hoisted_8$b,toDisplayString(f(String(L))&&s.value?"✓":u(String(L))&&s.value?"✗":""),1),s.value&&E.reason?(openBlock(),createElementBlock("div",{key:0,class:normalizeClass({"bg-teal-100/90 text-teal-800 p-0.5 rounded":f(String(L)),"bg-rose-100/90 text-rose-800 p-0.5 rounded":u(String(L))}),innerHTML:E.reason},null,10,_hoisted_9$a)):createCommentVNode("",!0)])],2)):createCommentVNode("",!0)]))),128)),renderSlot(N.$slots,"solution")])],2))}}),_hoisted_1$e={class:"rounded-lg border border-gray-200 bg-gray-50 p-4 max-w-md m-auto mt-12 text-center"},_sfc_main$f=defineComponent({__name:"Unknown",props:{question:{},modelValue:{},examStore:{}},setup(e){return(n,t)=>{var o,r;return openBlock(),createElementBlock("div",_hoisted_1$e,[t[0]||(t[0]=createBaseVNode("p",{class:"font-medium text-gray-700 mb-12"}," This question is currently under review for accuracy. ",-1)),t[1]||(t[1]=createBaseVNode("p",{class:"mt-1 text-gray-500"},[createTextVNode(" Please click "),createBaseVNode("span",{class:"font-semibold"},"Next"),createTextVNode(" to continue with rest of the exam. You may return later. ")],-1)),createBaseVNode("p",null,"Code "+toDisplayString((r=(o=n.question)==null?void 0:o.question_type)==null?void 0:r.code),1)])}}}),_hoisted_1$d=["innerHTML"],_hoisted_2$c={class:"flex items-start gap-2"},_hoisted_3$c=["src"],_hoisted_4$c=["innerHTML"],_hoisted_5$c={class:"grouping-table border border-gray-200 w-full mt-2"},_hoisted_6$c={class:"bg-gray-100"},_hoisted_7$a=["innerHTML"],_hoisted_8$a={class:"p-2"},_hoisted_9$9={class:"font-semibold"},_hoisted_10$8=["innerHTML"],_hoisted_11$6=["name","value","checked","disabled","onChange"],_hoisted_12$5={key:2,class:"text-red-600 mt-2"},_hoisted_13$4={key:3,class:"mt-4 text-center"},_sfc_main$e=defineComponent({__name:"Grouping",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","submitted"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=(_,j)=>{if(_==null)return j;if(typeof _!="string")return _;try{return JSON.parse(_)}catch{return j}},l=computed(()=>a(t.question.correct_answer,{})),d=computed(()=>{var j,U;const _=((j=t.question)==null?void 0:j.match_options)??((U=t.question)==null?void 0:U.match_option)??{};return a(_,{})}),s=computed(()=>{const _={};if(Object.keys(d.value||{}).sort().forEach(gt=>{const x=d.value[gt];if(typeof x=="string"){_[gt]=x;return}_[gt]=(x==null?void 0:x.option)||`Category ${gt}`}),Object.keys(_).length)return _;const U=new Set;return Object.keys(l.value||{}).forEach(gt=>{var it;const x=(it=l.value)==null?void 0:it[gt],ft=Array.isArray(x==null?void 0:x.answers)?x.answers[0]:x==null?void 0:x.answers;ft!=null&&U.add(String(ft))}),Array.from(U).sort().forEach(gt=>{_[gt]=`Category ${gt}`}),_}),f=computed(()=>{var j;const _=(j=t.question)==null?void 0:j.options;return!_||typeof _!="object"?{}:_}),u=computed(()=>Object.keys(f.value)),k=reactive({}),N=ref(null),y=computed(()=>{var _;return typeof((_=t.question)==null?void 0:_.question)=="string"&&t.question.question.includes('id="exhibits"')}),E=computed(()=>{var _;return!!((_=t.question)!=null&&_.tabs)&&!y.value}),L=_=>{var j;return typeof _=="string"?_:typeof(_==null?void 0:_.choice)=="string"?_.choice:((j=_==null?void 0:_.choice)==null?void 0:j.choice)||""},H=_=>{var gt;const j=(gt=l.value)==null?void 0:gt[_],U=Array.isArray(j==null?void 0:j.answers)?j.answers[0]:j==null?void 0:j.answers;return U==null?null:String(U)},ne=()=>{const _={};return u.value.forEach(j=>{const U=k[j];U&&(_[j]={answers:String(U)})}),_},yt=_=>{!_||typeof _!="object"||u.value.forEach(j=>{const U=_==null?void 0:_[j];if(U!=null){if(typeof U=="object"&&U!==null&&"answers"in U){const gt=U.answers;if(Array.isArray(gt)){k[j]=gt.length?String(gt[0]):null;return}k[j]=gt==null?null:String(gt);return}k[j]=String(U)}})};watch(()=>{var _,j,U,gt,x;return[(_=t.question)==null?void 0:_.id,(j=t.question)==null?void 0:j.options,(U=t.question)==null?void 0:U.correct_answer,(gt=t.question)==null?void 0:gt.match_option,(x=t.question)==null?void 0:x.match_options]},()=>{Object.keys(k).forEach(_=>delete k[_]),u.value.forEach(_=>{k[_]=null}),yt(t.modelValue)},{immediate:!0,deep:!0}),watch(()=>t.modelValue,_=>{_&&yt(_)},{deep:!0});const ae=()=>{N.value&&(N.value.unmount(),N.value=null)},R=async()=>{var j;if(ae(),!((j=t.question)!=null&&j.tabs)||!y.value)return;await nextTick();const _=document.getElementById("exhibits");_&&(_.innerHTML="",N.value=createApp(_sfc_main$k,{tabs:t.question.tabs}),N.value.mount(_))};watch(()=>{var _,j,U;return[(_=t.question)==null?void 0:_.id,(j=t.question)==null?void 0:j.tabs,(U=t.question)==null?void 0:U.question]},()=>{R()},{immediate:!0});function $e(_,j){v.value="",k[_]=j,o("update:modelValue",ne())}const v=ref(""),b=ref(!1),m=ref(!1);function ce(_,j){return H(_)===j}function Y(_,j){if(!b.value)return"";const U=ce(_,j),gt=k[_]===j;return U&&gt?"accent-teal-600":!U&&gt?"accent-rose-600":U&&!gt?"ring-2 ring-teal-600":""}const i=inject("showSolution");function w(){const _=toRaw(ne());try{if(typeof structuredClone=="function")return structuredClone(_)}catch{}return JSON.parse(JSON.stringify(_))}function z(){if(u.value.filter(j=>!k[j]).length){v.value="Select one category for every row before submitting.";return}v.value="",b.value=!0,m.value=!1,i&&i({flag:!0,value:!0}),o("submitted",{answer:w()})}return watchEffect(()=>{switch(r){case"review":b.value=!0,m.value=!1;break;case"exam":b.value=!1,m.value=!1;break;case"tutor":b.value=!1,m.value=!0;break;default:b.value=!1,m.value=!1}}),onUnmounted(()=>{ae(),i&&i({flag:!0,value:!1})}),(_,j)=>(openBlock(),createElementBlock("div",null,[_.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold text-gray-950 dark:text-white",innerHTML:_.question.intro},null,8,_hoisted_1$d)):createCommentVNode("",!0),E.value?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:_.question.tabs},null,8,["tabs"])):createCommentVNode("",!0),createBaseVNode("div",_hoisted_2$c,[createBaseVNode("img",{src:unref(qn_arrow),class:"h-7 shrink-0"},null,8,_hoisted_3$c),createBaseVNode("div",{class:"mb-2 font-bold text-gray-950 leading-relaxed dark:text-white",innerHTML:_.question.question},null,8,_hoisted_4$c)]),createBaseVNode("table",_hoisted_5$c,[createBaseVNode("thead",_hoisted_6$c,[createBaseVNode("tr",null,[createBaseVNode("th",{class:"p-2 text-left",innerHTML:_.question.table_header||"Option"},null,8,_hoisted_7$a),(openBlock(!0),createElementBlock(Fragment,null,renderList(s.value,(U,gt)=>(openBlock(),createElementBlock("th",{key:gt,class:"p-2 text-center"},toDisplayString(U),1))),128))])]),createBaseVNode("tbody",null,[(openBlock(!0),createElementBlock(Fragment,null,renderList(f.value,(U,gt)=>(openBlock(),createElementBlock("tr",{key:gt,class:"hover:bg-gray-50"},[createBaseVNode("td",_hoisted_8$a,[createBaseVNode("span",_hoisted_9$9,toDisplayString(gt)+".",1),createBaseVNode("span",{innerHTML:L(U)},null,8,_hoisted_10$8)]),(openBlock(!0),createElementBlock(Fragment,null,renderList(s.value,(x,ft)=>(openBlock(),createElementBlock("td",{key:ft,class:"p-2 text-center"},[createBaseVNode("input",{type:"radio",name:String(gt),value:String(ft),checked:k[String(gt)]===String(ft),disabled:unref(r)==="review",class:normalizeClass(Y(String(gt),String(ft))),onChange:it=>$e(String(gt),String(ft))},null,42,_hoisted_11$6)]))),128))]))),128))])]),v.value?(openBlock(),createElementBlock("div",_hoisted_12$5,toDisplayString(v.value),1)):createCommentVNode("",!0),m.value?(openBlock(),createElementBlock("div",_hoisted_13$4,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",onClick:z}," Submit ")])):createCommentVNode("",!0),renderSlot(_.$slots,"solution")]))}}),_hoisted_1$c=["innerHTML"],_hoisted_2$b={class:"flex items-start gap-2"},_hoisted_3$b=["src"],_hoisted_4$b=["innerHTML"],_hoisted_5$b={key:1,class:"mt-3 flex justify-end"},_hoisted_6$b=["disabled"],_sfc_main$d=defineComponent({__name:"Highlight",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,r=computed(()=>t.examStore.testMode),a=ref(!1),l=v=>{if(Array.isArray(v))return v.map(b=>String(b));if(typeof v=="string"){if(!v.trim())return[];try{const b=JSON.parse(v);return l(b)}catch{return[v]}}return v==null?[]:[String(v)]},d=v=>Array.from(new Set(v)),s=computed({get:()=>d(l(t.modelValue)),set:v=>o("update:modelValue",d(v))}),f=computed(()=>s.value),u=computed(()=>d(l(t.question.correct_answer))),k=computed(()=>r.value==="review"?!0:r.value==="tutor"?a.value:!1),N=computed(()=>Object.entries(t.question.options||{}).map(([v,b])=>{const m=String((b==null?void 0:b.choice)??"").trim();return{key:v,text:m,textLower:m.toLowerCase()}}).filter(v=>!!v.text).sort((v,b)=>b.text.length-v.text.length)),y=v=>v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),E=v=>{const b=f.value.includes(v);if(!k.value)return b?"hl-token-selected":"hl-token-idle";const m=u.value.includes(v);return m&&b?"hl-token-correct":m&&!b?"hl-token-missed":!m&&b?"hl-token-wrong":"hl-token-idle"},L=(v,b)=>{if(!v||!N.value.length)return{changed:!1,html:y(v||"")};const m=v.toLowerCase();let ce=0,Y=!1,i="";for(;ce<v.length;){let w=-1,z=null;for(const j of N.value){const U=m.indexOf(j.textLower,ce);U!==-1&&(z===null||U<w||U===w&&j.text.length>z.text.length)&&(w=U,z=j)}if(!z||w===-1){i+=y(v.slice(ce));break}w>ce&&(i+=y(v.slice(ce,w)));const _=v.slice(w,w+z.text.length);b.add(z.key),i+=`<span class="hl-token ${E(z.key)}" role="button" tabindex="0" data-hl-key="${y(z.key)}" aria-pressed="${f.value.includes(z.key)}">${y(_)}</span>`,ce=w+z.text.length,Y=!0}return{changed:Y,html:i||y(v)}},H=v=>{v.querySelectorAll("#exhibits").forEach(m=>m.remove()),v.querySelectorAll("p,div,span,strong").forEach(m=>{(m.textContent||"").trim().toLowerCase()==="exhibits"&&m.remove()})},ne=computed(()=>{var w;const v=String(t.question.question||"");if(!v)return{html:"",matchedKeys:[]};if(typeof document>"u")return{html:v,matchedKeys:[]};const b=document.createElement("div");b.innerHTML=v,H(b);const m=new Set,ce=document.createTreeWalker(b,NodeFilter.SHOW_TEXT),Y=[];let i;for(;i=ce.nextNode();)Y.push(i);for(const z of Y){const _=z.nodeValue||"";if(!_.trim())continue;const j=L(_,m);if(!j.changed)continue;const U=document.createElement("span");U.innerHTML=j.html,(w=z.parentNode)==null||w.replaceChild(U,z)}return{html:b.innerHTML,matchedKeys:Array.from(m)}}),yt=computed(()=>ne.value.html),A=v=>{if(r.value==="review"||r.value==="tutor"&&a.value)return;const b=[...s.value],m=b.indexOf(v);m===-1?b.push(v):b.splice(m,1),s.value=b},ae=()=>{r.value==="tutor"&&f.value.length!==0&&(a.value=!0)},R=v=>{const b=v.target,m=b==null?void 0:b.closest("[data-hl-key]"),ce=m==null?void 0:m.dataset.hlKey;ce&&A(ce)},$e=v=>{if(v.key!=="Enter"&&v.key!==" ")return;const b=v.target,m=b==null?void 0:b.closest("[data-hl-key]"),ce=m==null?void 0:m.dataset.hlKey;ce&&(v.preventDefault(),A(ce))};return watch(()=>{var v;return[(v=t.question)==null?void 0:v.id,r.value]},()=>{a.value=!1},{immediate:!0}),(v,b)=>(openBlock(),createElementBlock("div",null,[v.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold text-gray-950 dark:text-white",innerHTML:v.question.intro},null,8,_hoisted_1$c)):createCommentVNode("",!0),createBaseVNode("div",_hoisted_2$b,[createBaseVNode("img",{src:unref(qn_arrow),class:"h-7 shrink-0"},null,8,_hoisted_3$b),createBaseVNode("div",{class:"hl-content mb-2 font-bold text-gray-950 leading-relaxed dark:text-white",onClick:R,onKeydown:$e,innerHTML:yt.value},null,40,_hoisted_4$b)]),r.value==="tutor"&&!a.value?(openBlock(),createElementBlock("div",_hoisted_5$b,[createBaseVNode("button",{type:"button",class:"rounded-full bg-sky-500/95 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60",disabled:f.value.length===0,onClick:ae}," Submit Highlight ",8,_hoisted_6$b)])):createCommentVNode("",!0)]))}}),Highlight=_export_sfc(_sfc_main$d,[["__scopeId","data-v-1406ca86"]]);var rn=Object.defineProperty,Ne=Object.getOwnPropertySymbols,vt=Object.prototype.hasOwnProperty,bt=Object.prototype.propertyIsEnumerable,mt=(e,n,t)=>n in e?rn(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t,fe=(e,n)=>{for(var t in n||(n={}))vt.call(n,t)&&mt(e,t,n[t]);if(Ne)for(var t of Ne(n))bt.call(n,t)&&mt(e,t,n[t]);return e},Ve=(e,n)=>{var t={};for(var o in e)vt.call(e,o)&&n.indexOf(o)<0&&(t[o]=e[o]);if(e!=null&&Ne)for(var o of Ne(e))n.indexOf(o)<0&&bt.call(e,o)&&(t[o]=e[o]);return t};const Bt="[vue-draggable-plus]: ";function gn(e){console.warn(Bt+e)}function mn(e){console.error(Bt+e)}function wt(e,n,t){return t>=0&&t<e.length&&e.splice(t,0,e.splice(n,1)[0]),e}function vn(e){return e.replace(/-(\w)/g,(n,t)=>t?t.toUpperCase():"")}function bn(e){return Object.keys(e).reduce((n,t)=>(typeof e[t]<"u"&&(n[vn(t)]=e[t]),n),{})}function Et(e,n){return Array.isArray(e)&&e.splice(n,1),e}function St(e,n,t){return Array.isArray(e)&&e.splice(n,0,t),e}function yn(e){return typeof e>"u"}function wn(e){return typeof e=="string"}function Dt(e,n,t){const o=e.children[t];e.insertBefore(n,o)}function qe(e){e.parentNode&&e.parentNode.removeChild(e)}function En(e,n=document){var t;let o=null;return typeof(n==null?void 0:n.querySelector)=="function"?o=(t=n==null?void 0:n.querySelector)==null?void 0:t.call(n,e):o=document.querySelector(e),o||gn(`Element not found: ${e}`),o}function Sn(e,n,t=null){return function(...o){return e.apply(t,o),n.apply(t,o)}}function Dn(e,n){const t=fe({},e);return Object.keys(n).forEach(o=>{t[o]?t[o]=Sn(e[o],n[o]):t[o]=n[o]}),t}function _n(e){return e instanceof HTMLElement}function _t(e,n){Object.keys(e).forEach(t=>{n(t,e[t])})}function Tn(e){return e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97)}const Cn=Object.assign;/**!
 * Sortable 1.15.2
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */function Tt(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function te(e){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?Tt(Object(t),!0).forEach(function(o){On(e,o,t[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):Tt(Object(t)).forEach(function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(t,o))})}return e}function Xe(e){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?Xe=function(n){return typeof n}:Xe=function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},Xe(e)}function On(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function re(){return re=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},re.apply(this,arguments)}function In(e,n){if(e==null)return{};var t={},o=Object.keys(e),r,a;for(a=0;a<o.length;a++)r=o[a],!(n.indexOf(r)>=0)&&(t[r]=e[r]);return t}function An(e,n){if(e==null)return{};var t=In(e,n),o,r;if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)o=a[r],!(n.indexOf(o)>=0)&&Object.prototype.propertyIsEnumerable.call(e,o)&&(t[o]=e[o])}return t}var xn="1.15.2";function oe(e){if(typeof window<"u"&&window.navigator)return!!navigator.userAgent.match(e)}var ie=oe(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),Ae=oe(/Edge/i),Ct=oe(/firefox/i),_e=oe(/safari/i)&&!oe(/chrome/i)&&!oe(/android/i),kt=oe(/iP(ad|od|hone)/i),Ht=oe(/chrome/i)&&oe(/android/i),Lt={capture:!1,passive:!1};function D(e,n,t){e.addEventListener(n,t,!ie&&Lt)}function S(e,n,t){e.removeEventListener(n,t,!ie&&Lt)}function Le(e,n){if(n){if(n[0]===">"&&(n=n.substring(1)),e)try{if(e.matches)return e.matches(n);if(e.msMatchesSelector)return e.msMatchesSelector(n);if(e.webkitMatchesSelector)return e.webkitMatchesSelector(n)}catch{return!1}return!1}}function Nn(e){return e.host&&e!==document&&e.host.nodeType?e.host:e.parentNode}function Z(e,n,t,o){if(e){t=t||document;do{if(n!=null&&(n[0]===">"?e.parentNode===t&&Le(e,n):Le(e,n))||o&&e===t)return e;if(e===t)break}while(e=Nn(e))}return null}var Ot=/\s+/g;function V(e,n,t){if(e&&n)if(e.classList)e.classList[t?"add":"remove"](n);else{var o=(" "+e.className+" ").replace(Ot," ").replace(" "+n+" "," ");e.className=(o+(t?" "+n:"")).replace(Ot," ")}}function h(e,n,t){var o=e&&e.style;if(o){if(t===void 0)return document.defaultView&&document.defaultView.getComputedStyle?t=document.defaultView.getComputedStyle(e,""):e.currentStyle&&(t=e.currentStyle),n===void 0?t:t[n];!(n in o)&&n.indexOf("webkit")===-1&&(n="-webkit-"+n),o[n]=t+(typeof t=="string"?"":"px")}}function ye(e,n){var t="";if(typeof e=="string")t=e;else do{var o=h(e,"transform");o&&o!=="none"&&(t=o+" "+t)}while(!n&&(e=e.parentNode));var r=window.DOMMatrix||window.WebKitCSSMatrix||window.CSSMatrix||window.MSCSSMatrix;return r&&new r(t)}function Wt(e,n,t){if(e){var o=e.getElementsByTagName(n),r=0,a=o.length;if(t)for(;r<a;r++)t(o[r],r);return o}return[]}function ee(){var e=document.scrollingElement;return e||document.documentElement}function M(e,n,t,o,r){if(!(!e.getBoundingClientRect&&e!==window)){var a,l,d,s,f,u,k;if(e!==window&&e.parentNode&&e!==ee()?(a=e.getBoundingClientRect(),l=a.top,d=a.left,s=a.bottom,f=a.right,u=a.height,k=a.width):(l=0,d=0,s=window.innerHeight,f=window.innerWidth,u=window.innerHeight,k=window.innerWidth),(n||t)&&e!==window&&(r=r||e.parentNode,!ie))do if(r&&r.getBoundingClientRect&&(h(r,"transform")!=="none"||t&&h(r,"position")!=="static")){var N=r.getBoundingClientRect();l-=N.top+parseInt(h(r,"border-top-width")),d-=N.left+parseInt(h(r,"border-left-width")),s=l+a.height,f=d+a.width;break}while(r=r.parentNode);if(o&&e!==window){var y=ye(r||e),E=y&&y.a,L=y&&y.d;y&&(l/=L,d/=E,k/=E,u/=L,s=l+u,f=d+k)}return{top:l,left:d,bottom:s,right:f,width:k,height:u}}}function It(e,n,t){for(var o=ue(e,!0),r=M(e)[n];o;){var a=M(o)[t],l=void 0;if(l=r>=a,!l)return o;if(o===ee())break;o=ue(o,!1)}return!1}function we(e,n,t,o){for(var r=0,a=0,l=e.children;a<l.length;){if(l[a].style.display!=="none"&&l[a]!==p.ghost&&(o||l[a]!==p.dragged)&&Z(l[a],t.draggable,e,!1)){if(r===n)return l[a];r++}a++}return null}function dt(e,n){for(var t=e.lastElementChild;t&&(t===p.ghost||h(t,"display")==="none"||n&&!Le(t,n));)t=t.previousElementSibling;return t||null}function K(e,n){var t=0;if(!e||!e.parentNode)return-1;for(;e=e.previousElementSibling;)e.nodeName.toUpperCase()!=="TEMPLATE"&&e!==p.clone&&(!n||Le(e,n))&&t++;return t}function At(e){var n=0,t=0,o=ee();if(e)do{var r=ye(e),a=r.a,l=r.d;n+=e.scrollLeft*a,t+=e.scrollTop*l}while(e!==o&&(e=e.parentNode));return[n,t]}function Pn(e,n){for(var t in e)if(e.hasOwnProperty(t)){for(var o in n)if(n.hasOwnProperty(o)&&n[o]===e[t][o])return Number(t)}return-1}function ue(e,n){if(!e||!e.getBoundingClientRect)return ee();var t=e,o=!1;do if(t.clientWidth<t.scrollWidth||t.clientHeight<t.scrollHeight){var r=h(t);if(t.clientWidth<t.scrollWidth&&(r.overflowX=="auto"||r.overflowX=="scroll")||t.clientHeight<t.scrollHeight&&(r.overflowY=="auto"||r.overflowY=="scroll")){if(!t.getBoundingClientRect||t===document.body)return ee();if(o||n)return t;o=!0}}while(t=t.parentNode);return ee()}function Mn(e,n){if(e&&n)for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t]);return e}function Ke(e,n){return Math.round(e.top)===Math.round(n.top)&&Math.round(e.left)===Math.round(n.left)&&Math.round(e.height)===Math.round(n.height)&&Math.round(e.width)===Math.round(n.width)}var Te;function Gt(e,n){return function(){if(!Te){var t=arguments,o=this;t.length===1?e.call(o,t[0]):e.apply(o,t),Te=setTimeout(function(){Te=void 0},n)}}}function Fn(){clearTimeout(Te),Te=void 0}function jt(e,n,t){e.scrollLeft+=n,e.scrollTop+=t}function zt(e){var n=window.Polymer,t=window.jQuery||window.Zepto;return n&&n.dom?n.dom(e).cloneNode(!0):t?t(e).clone(!0)[0]:e.cloneNode(!0)}function Ut(e,n,t){var o={};return Array.from(e.children).forEach(function(r){var a,l,d,s;if(!(!Z(r,n.draggable,e,!1)||r.animated||r===t)){var f=M(r);o.left=Math.min((a=o.left)!==null&&a!==void 0?a:1/0,f.left),o.top=Math.min((l=o.top)!==null&&l!==void 0?l:1/0,f.top),o.right=Math.max((d=o.right)!==null&&d!==void 0?d:-1/0,f.right),o.bottom=Math.max((s=o.bottom)!==null&&s!==void 0?s:-1/0,f.bottom)}}),o.width=o.right-o.left,o.height=o.bottom-o.top,o.x=o.left,o.y=o.top,o}var q="Sortable"+new Date().getTime();function Rn(){var e=[],n;return{captureAnimationState:function(){if(e=[],!!this.options.animation){var t=[].slice.call(this.el.children);t.forEach(function(o){if(!(h(o,"display")==="none"||o===p.ghost)){e.push({target:o,rect:M(o)});var r=te({},e[e.length-1].rect);if(o.thisAnimationDuration){var a=ye(o,!0);a&&(r.top-=a.f,r.left-=a.e)}o.fromRect=r}})}},addAnimationState:function(t){e.push(t)},removeAnimationState:function(t){e.splice(Pn(e,{target:t}),1)},animateAll:function(t){var o=this;if(!this.options.animation){clearTimeout(n),typeof t=="function"&&t();return}var r=!1,a=0;e.forEach(function(l){var d=0,s=l.target,f=s.fromRect,u=M(s),k=s.prevFromRect,N=s.prevToRect,y=l.rect,E=ye(s,!0);E&&(u.top-=E.f,u.left-=E.e),s.toRect=u,s.thisAnimationDuration&&Ke(k,u)&&!Ke(f,u)&&(y.top-u.top)/(y.left-u.left)===(f.top-u.top)/(f.left-u.left)&&(d=Yn(y,k,N,o.options)),Ke(u,f)||(s.prevFromRect=f,s.prevToRect=u,d||(d=o.options.animation),o.animate(s,y,u,d)),d&&(r=!0,a=Math.max(a,d),clearTimeout(s.animationResetTimer),s.animationResetTimer=setTimeout(function(){s.animationTime=0,s.prevFromRect=null,s.fromRect=null,s.prevToRect=null,s.thisAnimationDuration=null},d),s.thisAnimationDuration=d)}),clearTimeout(n),r?n=setTimeout(function(){typeof t=="function"&&t()},a):typeof t=="function"&&t(),e=[]},animate:function(t,o,r,a){if(a){h(t,"transition",""),h(t,"transform","");var l=ye(this.el),d=l&&l.a,s=l&&l.d,f=(o.left-r.left)/(d||1),u=(o.top-r.top)/(s||1);t.animatingX=!!f,t.animatingY=!!u,h(t,"transform","translate3d("+f+"px,"+u+"px,0)"),this.forRepaintDummy=Xn(t),h(t,"transition","transform "+a+"ms"+(this.options.easing?" "+this.options.easing:"")),h(t,"transform","translate3d(0,0,0)"),typeof t.animated=="number"&&clearTimeout(t.animated),t.animated=setTimeout(function(){h(t,"transition",""),h(t,"transform",""),t.animated=!1,t.animatingX=!1,t.animatingY=!1},a)}}}}function Xn(e){return e.offsetWidth}function Yn(e,n,t,o){return Math.sqrt(Math.pow(n.top-e.top,2)+Math.pow(n.left-e.left,2))/Math.sqrt(Math.pow(n.top-t.top,2)+Math.pow(n.left-t.left,2))*o.animation}var ge=[],Je={initializeByDefault:!0},xe={mount:function(e){for(var n in Je)Je.hasOwnProperty(n)&&!(n in e)&&(e[n]=Je[n]);ge.forEach(function(t){if(t.pluginName===e.pluginName)throw"Sortable: Cannot mount plugin ".concat(e.pluginName," more than once")}),ge.push(e)},pluginEvent:function(e,n,t){var o=this;this.eventCanceled=!1,t.cancel=function(){o.eventCanceled=!0};var r=e+"Global";ge.forEach(function(a){n[a.pluginName]&&(n[a.pluginName][r]&&n[a.pluginName][r](te({sortable:n},t)),n.options[a.pluginName]&&n[a.pluginName][e]&&n[a.pluginName][e](te({sortable:n},t)))})},initializePlugins:function(e,n,t,o){ge.forEach(function(l){var d=l.pluginName;if(!(!e.options[d]&&!l.initializeByDefault)){var s=new l(e,n,e.options);s.sortable=e,s.options=e.options,e[d]=s,re(t,s.defaults)}});for(var r in e.options)if(e.options.hasOwnProperty(r)){var a=this.modifyOption(e,r,e.options[r]);typeof a<"u"&&(e.options[r]=a)}},getEventProperties:function(e,n){var t={};return ge.forEach(function(o){typeof o.eventProperties=="function"&&re(t,o.eventProperties.call(n[o.pluginName],e))}),t},modifyOption:function(e,n,t){var o;return ge.forEach(function(r){e[r.pluginName]&&r.optionListeners&&typeof r.optionListeners[n]=="function"&&(o=r.optionListeners[n].call(e[r.pluginName],t))}),o}};function Bn(e){var n=e.sortable,t=e.rootEl,o=e.name,r=e.targetEl,a=e.cloneEl,l=e.toEl,d=e.fromEl,s=e.oldIndex,f=e.newIndex,u=e.oldDraggableIndex,k=e.newDraggableIndex,N=e.originalEvent,y=e.putSortable,E=e.extraEventProperties;if(n=n||t&&t[q],!!n){var L,H=n.options,ne="on"+o.charAt(0).toUpperCase()+o.substr(1);window.CustomEvent&&!ie&&!Ae?L=new CustomEvent(o,{bubbles:!0,cancelable:!0}):(L=document.createEvent("Event"),L.initEvent(o,!0,!0)),L.to=l||t,L.from=d||t,L.item=r||t,L.clone=a,L.oldIndex=s,L.newIndex=f,L.oldDraggableIndex=u,L.newDraggableIndex=k,L.originalEvent=N,L.pullMode=y?y.lastPutMode:void 0;var yt=te(te({},E),xe.getEventProperties(o,n));for(var A in yt)L[A]=yt[A];t&&t.dispatchEvent(L),H[ne]&&H[ne].call(n,L)}}var kn=["evt"],G=function(e,n){var t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},o=t.evt,r=An(t,kn);xe.pluginEvent.bind(p)(e,n,te({dragEl:c,parentEl:I,ghostEl:g,rootEl:C,nextEl:pe,lastDownEl:Ye,cloneEl:O,cloneHidden:se,dragStarted:Ee,putSortable:X,activeSortable:p.active,originalEvent:o,oldIndex:be,oldDraggableIndex:Ce,newIndex:$,newDraggableIndex:le,hideGhostForTarget:Kt,unhideGhostForTarget:Jt,cloneNowHidden:function(){se=!0},cloneNowShown:function(){se=!1},dispatchSortableEvent:function(a){W({sortable:n,name:a,originalEvent:o})}},r))};function W(e){Bn(te({putSortable:X,cloneEl:O,targetEl:c,rootEl:C,oldIndex:be,oldDraggableIndex:Ce,newIndex:$,newDraggableIndex:le},e))}var c,I,g,C,pe,Ye,O,se,be,$,Ce,le,Pe,X,ve=!1,We=!1,Ge=[],de,J,Ze,Qe,xt,Nt,Ee,me,Oe,Ie=!1,Me=!1,Be,B,et=[],at=!1,je=[],Ue=typeof document<"u",Fe=kt,Pt=Ae||ie?"cssFloat":"float",Hn=Ue&&!Ht&&!kt&&"draggable"in document.createElement("div"),Vt=function(){if(Ue){if(ie)return!1;var e=document.createElement("x");return e.style.cssText="pointer-events:auto",e.style.pointerEvents==="auto"}}(),$t=function(e,n){var t=h(e),o=parseInt(t.width)-parseInt(t.paddingLeft)-parseInt(t.paddingRight)-parseInt(t.borderLeftWidth)-parseInt(t.borderRightWidth),r=we(e,0,n),a=we(e,1,n),l=r&&h(r),d=a&&h(a),s=l&&parseInt(l.marginLeft)+parseInt(l.marginRight)+M(r).width,f=d&&parseInt(d.marginLeft)+parseInt(d.marginRight)+M(a).width;if(t.display==="flex")return t.flexDirection==="column"||t.flexDirection==="column-reverse"?"vertical":"horizontal";if(t.display==="grid")return t.gridTemplateColumns.split(" ").length<=1?"vertical":"horizontal";if(r&&l.float&&l.float!=="none"){var u=l.float==="left"?"left":"right";return a&&(d.clear==="both"||d.clear===u)?"vertical":"horizontal"}return r&&(l.display==="block"||l.display==="flex"||l.display==="table"||l.display==="grid"||s>=o&&t[Pt]==="none"||a&&t[Pt]==="none"&&s+f>o)?"vertical":"horizontal"},Ln=function(e,n,t){var o=t?e.left:e.top,r=t?e.right:e.bottom,a=t?e.width:e.height,l=t?n.left:n.top,d=t?n.right:n.bottom,s=t?n.width:n.height;return o===l||r===d||o+a/2===l+s/2},Wn=function(e,n){var t;return Ge.some(function(o){var r=o[q].options.emptyInsertThreshold;if(!(!r||dt(o))){var a=M(o),l=e>=a.left-r&&e<=a.right+r,d=n>=a.top-r&&n<=a.bottom+r;if(l&&d)return t=o}}),t},qt=function(e){function n(r,a){return function(l,d,s,f){var u=l.options.group.name&&d.options.group.name&&l.options.group.name===d.options.group.name;if(r==null&&(a||u))return!0;if(r==null||r===!1)return!1;if(a&&r==="clone")return r;if(typeof r=="function")return n(r(l,d,s,f),a)(l,d,s,f);var k=(a?l:d).options.group.name;return r===!0||typeof r=="string"&&r===k||r.join&&r.indexOf(k)>-1}}var t={},o=e.group;(!o||Xe(o)!="object")&&(o={name:o}),t.name=o.name,t.checkPull=n(o.pull,!0),t.checkPut=n(o.put),t.revertClone=o.revertClone,e.group=t},Kt=function(){!Vt&&g&&h(g,"display","none")},Jt=function(){!Vt&&g&&h(g,"display","")};Ue&&!Ht&&document.addEventListener("click",function(e){if(We)return e.preventDefault(),e.stopPropagation&&e.stopPropagation(),e.stopImmediatePropagation&&e.stopImmediatePropagation(),We=!1,!1},!0);var he=function(e){if(c){e=e.touches?e.touches[0]:e;var n=Wn(e.clientX,e.clientY);if(n){var t={};for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.target=t.rootEl=n,t.preventDefault=void 0,t.stopPropagation=void 0,n[q]._onDragOver(t)}}},Gn=function(e){c&&c.parentNode[q]._isOutsideThisEl(e.target)};function p(e,n){if(!(e&&e.nodeType&&e.nodeType===1))throw"Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));this.el=e,this.options=n=re({},n),e[q]=this;var t={group:null,sort:!0,disabled:!1,store:null,handle:null,draggable:/^[uo]l$/i.test(e.nodeName)?">li":">*",swapThreshold:1,invertSwap:!1,invertedSwapThreshold:null,removeCloneOnHide:!0,direction:function(){return $t(e,this.options)},ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,preventOnFilter:!0,animation:0,easing:null,setData:function(a,l){a.setData("Text",l.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,delayOnTouchOnly:!1,touchStartThreshold:(Number.parseInt?Number:window).parseInt(window.devicePixelRatio,10)||1,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0},supportPointer:p.supportPointer!==!1&&"PointerEvent"in window&&!_e,emptyInsertThreshold:5};xe.initializePlugins(this,e,t);for(var o in t)!(o in n)&&(n[o]=t[o]);qt(n);for(var r in this)r.charAt(0)==="_"&&typeof this[r]=="function"&&(this[r]=this[r].bind(this));this.nativeDraggable=n.forceFallback?!1:Hn,this.nativeDraggable&&(this.options.touchStartThreshold=1),n.supportPointer?D(e,"pointerdown",this._onTapStart):(D(e,"mousedown",this._onTapStart),D(e,"touchstart",this._onTapStart)),this.nativeDraggable&&(D(e,"dragover",this),D(e,"dragenter",this)),Ge.push(this.el),n.store&&n.store.get&&this.sort(n.store.get(this)||[]),re(this,Rn())}p.prototype={constructor:p,_isOutsideThisEl:function(e){!this.el.contains(e)&&e!==this.el&&(me=null)},_getDirection:function(e,n){return typeof this.options.direction=="function"?this.options.direction.call(this,e,n,c):this.options.direction},_onTapStart:function(e){if(e.cancelable){var n=this,t=this.el,o=this.options,r=o.preventOnFilter,a=e.type,l=e.touches&&e.touches[0]||e.pointerType&&e.pointerType==="touch"&&e,d=(l||e).target,s=e.target.shadowRoot&&(e.path&&e.path[0]||e.composedPath&&e.composedPath()[0])||d,f=o.filter;if(Jn(t),!c&&!(/mousedown|pointerdown/.test(a)&&e.button!==0||o.disabled)&&!s.isContentEditable&&!(!this.nativeDraggable&&_e&&d&&d.tagName.toUpperCase()==="SELECT")&&(d=Z(d,o.draggable,t,!1),!(d&&d.animated)&&Ye!==d)){if(be=K(d),Ce=K(d,o.draggable),typeof f=="function"){if(f.call(this,e,d,this)){W({sortable:n,rootEl:s,name:"filter",targetEl:d,toEl:t,fromEl:t}),G("filter",n,{evt:e}),r&&e.cancelable&&e.preventDefault();return}}else if(f&&(f=f.split(",").some(function(u){if(u=Z(s,u.trim(),t,!1),u)return W({sortable:n,rootEl:u,name:"filter",targetEl:d,fromEl:t,toEl:t}),G("filter",n,{evt:e}),!0}),f)){r&&e.cancelable&&e.preventDefault();return}o.handle&&!Z(s,o.handle,t,!1)||this._prepareDragStart(e,l,d)}}},_prepareDragStart:function(e,n,t){var o=this,r=o.el,a=o.options,l=r.ownerDocument,d;if(t&&!c&&t.parentNode===r){var s=M(t);if(C=r,c=t,I=c.parentNode,pe=c.nextSibling,Ye=t,Pe=a.group,p.dragged=c,de={target:c,clientX:(n||e).clientX,clientY:(n||e).clientY},xt=de.clientX-s.left,Nt=de.clientY-s.top,this._lastX=(n||e).clientX,this._lastY=(n||e).clientY,c.style["will-change"]="all",d=function(){if(G("delayEnded",o,{evt:e}),p.eventCanceled){o._onDrop();return}o._disableDelayedDragEvents(),!Ct&&o.nativeDraggable&&(c.draggable=!0),o._triggerDragStart(e,n),W({sortable:o,name:"choose",originalEvent:e}),V(c,a.chosenClass,!0)},a.ignore.split(",").forEach(function(f){Wt(c,f.trim(),tt)}),D(l,"dragover",he),D(l,"mousemove",he),D(l,"touchmove",he),D(l,"mouseup",o._onDrop),D(l,"touchend",o._onDrop),D(l,"touchcancel",o._onDrop),Ct&&this.nativeDraggable&&(this.options.touchStartThreshold=4,c.draggable=!0),G("delayStart",this,{evt:e}),a.delay&&(!a.delayOnTouchOnly||n)&&(!this.nativeDraggable||!(Ae||ie))){if(p.eventCanceled){this._onDrop();return}D(l,"mouseup",o._disableDelayedDrag),D(l,"touchend",o._disableDelayedDrag),D(l,"touchcancel",o._disableDelayedDrag),D(l,"mousemove",o._delayedDragTouchMoveHandler),D(l,"touchmove",o._delayedDragTouchMoveHandler),a.supportPointer&&D(l,"pointermove",o._delayedDragTouchMoveHandler),o._dragStartTimer=setTimeout(d,a.delay)}else d()}},_delayedDragTouchMoveHandler:function(e){var n=e.touches?e.touches[0]:e;Math.max(Math.abs(n.clientX-this._lastX),Math.abs(n.clientY-this._lastY))>=Math.floor(this.options.touchStartThreshold/(this.nativeDraggable&&window.devicePixelRatio||1))&&this._disableDelayedDrag()},_disableDelayedDrag:function(){c&&tt(c),clearTimeout(this._dragStartTimer),this._disableDelayedDragEvents()},_disableDelayedDragEvents:function(){var e=this.el.ownerDocument;S(e,"mouseup",this._disableDelayedDrag),S(e,"touchend",this._disableDelayedDrag),S(e,"touchcancel",this._disableDelayedDrag),S(e,"mousemove",this._delayedDragTouchMoveHandler),S(e,"touchmove",this._delayedDragTouchMoveHandler),S(e,"pointermove",this._delayedDragTouchMoveHandler)},_triggerDragStart:function(e,n){n=n||e.pointerType=="touch"&&e,!this.nativeDraggable||n?this.options.supportPointer?D(document,"pointermove",this._onTouchMove):n?D(document,"touchmove",this._onTouchMove):D(document,"mousemove",this._onTouchMove):(D(c,"dragend",this),D(C,"dragstart",this._onDragStart));try{document.selection?ke(function(){document.selection.empty()}):window.getSelection().removeAllRanges()}catch{}},_dragStarted:function(e,n){if(ve=!1,C&&c){G("dragStarted",this,{evt:n}),this.nativeDraggable&&D(document,"dragover",Gn);var t=this.options;!e&&V(c,t.dragClass,!1),V(c,t.ghostClass,!0),p.active=this,e&&this._appendGhost(),W({sortable:this,name:"start",originalEvent:n})}else this._nulling()},_emulateDragOver:function(){if(J){this._lastX=J.clientX,this._lastY=J.clientY,Kt();for(var e=document.elementFromPoint(J.clientX,J.clientY),n=e;e&&e.shadowRoot&&(e=e.shadowRoot.elementFromPoint(J.clientX,J.clientY),e!==n);)n=e;if(c.parentNode[q]._isOutsideThisEl(e),n)do{if(n[q]){var t=void 0;if(t=n[q]._onDragOver({clientX:J.clientX,clientY:J.clientY,target:e,rootEl:n}),t&&!this.options.dragoverBubble)break}e=n}while(n=n.parentNode);Jt()}},_onTouchMove:function(e){if(de){var n=this.options,t=n.fallbackTolerance,o=n.fallbackOffset,r=e.touches?e.touches[0]:e,a=g&&ye(g,!0),l=g&&a&&a.a,d=g&&a&&a.d,s=Fe&&B&&At(B),f=(r.clientX-de.clientX+o.x)/(l||1)+(s?s[0]-et[0]:0)/(l||1),u=(r.clientY-de.clientY+o.y)/(d||1)+(s?s[1]-et[1]:0)/(d||1);if(!p.active&&!ve){if(t&&Math.max(Math.abs(r.clientX-this._lastX),Math.abs(r.clientY-this._lastY))<t)return;this._onDragStart(e,!0)}if(g){a?(a.e+=f-(Ze||0),a.f+=u-(Qe||0)):a={a:1,b:0,c:0,d:1,e:f,f:u};var k="matrix(".concat(a.a,",").concat(a.b,",").concat(a.c,",").concat(a.d,",").concat(a.e,",").concat(a.f,")");h(g,"webkitTransform",k),h(g,"mozTransform",k),h(g,"msTransform",k),h(g,"transform",k),Ze=f,Qe=u,J=r}e.cancelable&&e.preventDefault()}},_appendGhost:function(){if(!g){var e=this.options.fallbackOnBody?document.body:C,n=M(c,!0,Fe,!0,e),t=this.options;if(Fe){for(B=e;h(B,"position")==="static"&&h(B,"transform")==="none"&&B!==document;)B=B.parentNode;B!==document.body&&B!==document.documentElement?(B===document&&(B=ee()),n.top+=B.scrollTop,n.left+=B.scrollLeft):B=ee(),et=At(B)}g=c.cloneNode(!0),V(g,t.ghostClass,!1),V(g,t.fallbackClass,!0),V(g,t.dragClass,!0),h(g,"transition",""),h(g,"transform",""),h(g,"box-sizing","border-box"),h(g,"margin",0),h(g,"top",n.top),h(g,"left",n.left),h(g,"width",n.width),h(g,"height",n.height),h(g,"opacity","0.8"),h(g,"position",Fe?"absolute":"fixed"),h(g,"zIndex","100000"),h(g,"pointerEvents","none"),p.ghost=g,e.appendChild(g),h(g,"transform-origin",xt/parseInt(g.style.width)*100+"% "+Nt/parseInt(g.style.height)*100+"%")}},_onDragStart:function(e,n){var t=this,o=e.dataTransfer,r=t.options;if(G("dragStart",this,{evt:e}),p.eventCanceled){this._onDrop();return}G("setupClone",this),p.eventCanceled||(O=zt(c),O.removeAttribute("id"),O.draggable=!1,O.style["will-change"]="",this._hideClone(),V(O,this.options.chosenClass,!1),p.clone=O),t.cloneId=ke(function(){G("clone",t),!p.eventCanceled&&(t.options.removeCloneOnHide||C.insertBefore(O,c),t._hideClone(),W({sortable:t,name:"clone"}))}),!n&&V(c,r.dragClass,!0),n?(We=!0,t._loopId=setInterval(t._emulateDragOver,50)):(S(document,"mouseup",t._onDrop),S(document,"touchend",t._onDrop),S(document,"touchcancel",t._onDrop),o&&(o.effectAllowed="move",r.setData&&r.setData.call(t,o,c)),D(document,"drop",t),h(c,"transform","translateZ(0)")),ve=!0,t._dragStartId=ke(t._dragStarted.bind(t,n,e)),D(document,"selectstart",t),Ee=!0,_e&&h(document.body,"user-select","none")},_onDragOver:function(e){var n=this.el,t=e.target,o,r,a,l=this.options,d=l.group,s=p.active,f=Pe===d,u=l.sort,k=X||s,N,y=this,E=!1;if(at)return;function L(U,gt){G(U,y,te({evt:e,isOwner:f,axis:N?"vertical":"horizontal",revert:a,dragRect:o,targetRect:r,canSort:u,fromSortable:k,target:t,completed:ne,onMove:function(x,ft){return Re(C,n,c,o,x,M(x),e,ft)},changed:yt},gt))}function H(){L("dragOverAnimationCapture"),y.captureAnimationState(),y!==k&&k.captureAnimationState()}function ne(U){return L("dragOverCompleted",{insertion:U}),U&&(f?s._hideClone():s._showClone(y),y!==k&&(V(c,X?X.options.ghostClass:s.options.ghostClass,!1),V(c,l.ghostClass,!0)),X!==y&&y!==p.active?X=y:y===p.active&&X&&(X=null),k===y&&(y._ignoreWhileAnimating=t),y.animateAll(function(){L("dragOverAnimationComplete"),y._ignoreWhileAnimating=null}),y!==k&&(k.animateAll(),k._ignoreWhileAnimating=null)),(t===c&&!c.animated||t===n&&!t.animated)&&(me=null),!l.dragoverBubble&&!e.rootEl&&t!==document&&(c.parentNode[q]._isOutsideThisEl(e.target),!U&&he(e)),!l.dragoverBubble&&e.stopPropagation&&e.stopPropagation(),E=!0}function yt(){$=K(c),le=K(c,l.draggable),W({sortable:y,name:"change",toEl:n,newIndex:$,newDraggableIndex:le,originalEvent:e})}if(e.preventDefault!==void 0&&e.cancelable&&e.preventDefault(),t=Z(t,l.draggable,n,!0),L("dragOver"),p.eventCanceled)return E;if(c.contains(e.target)||t.animated&&t.animatingX&&t.animatingY||y._ignoreWhileAnimating===t)return ne(!1);if(We=!1,s&&!l.disabled&&(f?u||(a=I!==C):X===this||(this.lastPutMode=Pe.checkPull(this,s,c,e))&&d.checkPut(this,s,c,e))){if(N=this._getDirection(e,t)==="vertical",o=M(c),L("dragOverValid"),p.eventCanceled)return E;if(a)return I=C,H(),this._hideClone(),L("revert"),p.eventCanceled||(pe?C.insertBefore(c,pe):C.appendChild(c)),ne(!0);var A=dt(n,l.draggable);if(!A||Vn(e,N,this)&&!A.animated){if(A===c)return ne(!1);if(A&&n===e.target&&(t=A),t&&(r=M(t)),Re(C,n,c,o,t,r,e,!!t)!==!1)return H(),A&&A.nextSibling?n.insertBefore(c,A.nextSibling):n.appendChild(c),I=n,yt(),ne(!0)}else if(A&&Un(e,N,this)){var ae=we(n,0,l,!0);if(ae===c)return ne(!1);if(t=ae,r=M(t),Re(C,n,c,o,t,r,e,!1)!==!1)return H(),n.insertBefore(c,ae),I=n,yt(),ne(!0)}else if(t.parentNode===n){r=M(t);var R=0,$e,v=c.parentNode!==n,b=!Ln(c.animated&&c.toRect||o,t.animated&&t.toRect||r,N),m=N?"top":"left",ce=It(t,"top","top")||It(c,"top","top"),Y=ce?ce.scrollTop:void 0;me!==t&&($e=r[m],Ie=!1,Me=!b&&l.invertSwap||v),R=$n(e,t,r,N,b?1:l.swapThreshold,l.invertedSwapThreshold==null?l.swapThreshold:l.invertedSwapThreshold,Me,me===t);var i;if(R!==0){var w=K(c);do w-=R,i=I.children[w];while(i&&(h(i,"display")==="none"||i===g))}if(R===0||i===t)return ne(!1);me=t,Oe=R;var z=t.nextElementSibling,_=!1;_=R===1;var j=Re(C,n,c,o,t,r,e,_);if(j!==!1)return(j===1||j===-1)&&(_=j===1),at=!0,setTimeout(zn,30),H(),_&&!z?n.appendChild(c):t.parentNode.insertBefore(c,_?z:t),ce&&jt(ce,0,Y-ce.scrollTop),I=c.parentNode,$e!==void 0&&!Me&&(Be=Math.abs($e-M(t)[m])),yt(),ne(!0)}if(n.contains(c))return ne(!1)}return!1},_ignoreWhileAnimating:null,_offMoveEvents:function(){S(document,"mousemove",this._onTouchMove),S(document,"touchmove",this._onTouchMove),S(document,"pointermove",this._onTouchMove),S(document,"dragover",he),S(document,"mousemove",he),S(document,"touchmove",he)},_offUpEvents:function(){var e=this.el.ownerDocument;S(e,"mouseup",this._onDrop),S(e,"touchend",this._onDrop),S(e,"pointerup",this._onDrop),S(e,"touchcancel",this._onDrop),S(document,"selectstart",this)},_onDrop:function(e){var n=this.el,t=this.options;if($=K(c),le=K(c,t.draggable),G("drop",this,{evt:e}),I=c&&c.parentNode,$=K(c),le=K(c,t.draggable),p.eventCanceled){this._nulling();return}ve=!1,Me=!1,Ie=!1,clearInterval(this._loopId),clearTimeout(this._dragStartTimer),lt(this.cloneId),lt(this._dragStartId),this.nativeDraggable&&(S(document,"drop",this),S(n,"dragstart",this._onDragStart)),this._offMoveEvents(),this._offUpEvents(),_e&&h(document.body,"user-select",""),h(c,"transform",""),e&&(Ee&&(e.cancelable&&e.preventDefault(),!t.dropBubble&&e.stopPropagation()),g&&g.parentNode&&g.parentNode.removeChild(g),(C===I||X&&X.lastPutMode!=="clone")&&O&&O.parentNode&&O.parentNode.removeChild(O),c&&(this.nativeDraggable&&S(c,"dragend",this),tt(c),c.style["will-change"]="",Ee&&!ve&&V(c,X?X.options.ghostClass:this.options.ghostClass,!1),V(c,this.options.chosenClass,!1),W({sortable:this,name:"unchoose",toEl:I,newIndex:null,newDraggableIndex:null,originalEvent:e}),C!==I?($>=0&&(W({rootEl:I,name:"add",toEl:I,fromEl:C,originalEvent:e}),W({sortable:this,name:"remove",toEl:I,originalEvent:e}),W({rootEl:I,name:"sort",toEl:I,fromEl:C,originalEvent:e}),W({sortable:this,name:"sort",toEl:I,originalEvent:e})),X&&X.save()):$!==be&&$>=0&&(W({sortable:this,name:"update",toEl:I,originalEvent:e}),W({sortable:this,name:"sort",toEl:I,originalEvent:e})),p.active&&(($==null||$===-1)&&($=be,le=Ce),W({sortable:this,name:"end",toEl:I,originalEvent:e}),this.save()))),this._nulling()},_nulling:function(){G("nulling",this),C=c=I=g=pe=O=Ye=se=de=J=Ee=$=le=be=Ce=me=Oe=X=Pe=p.dragged=p.ghost=p.clone=p.active=null,je.forEach(function(e){e.checked=!0}),je.length=Ze=Qe=0},handleEvent:function(e){switch(e.type){case"drop":case"dragend":this._onDrop(e);break;case"dragenter":case"dragover":c&&(this._onDragOver(e),jn(e));break;case"selectstart":e.preventDefault();break}},toArray:function(){for(var e=[],n,t=this.el.children,o=0,r=t.length,a=this.options;o<r;o++)n=t[o],Z(n,a.draggable,this.el,!1)&&e.push(n.getAttribute(a.dataIdAttr)||Kn(n));return e},sort:function(e,n){var t={},o=this.el;this.toArray().forEach(function(r,a){var l=o.children[a];Z(l,this.options.draggable,o,!1)&&(t[r]=l)},this),n&&this.captureAnimationState(),e.forEach(function(r){t[r]&&(o.removeChild(t[r]),o.appendChild(t[r]))}),n&&this.animateAll()},save:function(){var e=this.options.store;e&&e.set&&e.set(this)},closest:function(e,n){return Z(e,n||this.options.draggable,this.el,!1)},option:function(e,n){var t=this.options;if(n===void 0)return t[e];var o=xe.modifyOption(this,e,n);typeof o<"u"?t[e]=o:t[e]=n,e==="group"&&qt(t)},destroy:function(){G("destroy",this);var e=this.el;e[q]=null,S(e,"mousedown",this._onTapStart),S(e,"touchstart",this._onTapStart),S(e,"pointerdown",this._onTapStart),this.nativeDraggable&&(S(e,"dragover",this),S(e,"dragenter",this)),Array.prototype.forEach.call(e.querySelectorAll("[draggable]"),function(n){n.removeAttribute("draggable")}),this._onDrop(),this._disableDelayedDragEvents(),Ge.splice(Ge.indexOf(this.el),1),this.el=e=null},_hideClone:function(){if(!se){if(G("hideClone",this),p.eventCanceled)return;h(O,"display","none"),this.options.removeCloneOnHide&&O.parentNode&&O.parentNode.removeChild(O),se=!0}},_showClone:function(e){if(e.lastPutMode!=="clone"){this._hideClone();return}if(se){if(G("showClone",this),p.eventCanceled)return;c.parentNode==C&&!this.options.group.revertClone?C.insertBefore(O,c):pe?C.insertBefore(O,pe):C.appendChild(O),this.options.group.revertClone&&this.animate(c,O),h(O,"display",""),se=!1}}};function jn(e){e.dataTransfer&&(e.dataTransfer.dropEffect="move"),e.cancelable&&e.preventDefault()}function Re(e,n,t,o,r,a,l,d){var s,f=e[q],u=f.options.onMove,k;return window.CustomEvent&&!ie&&!Ae?s=new CustomEvent("move",{bubbles:!0,cancelable:!0}):(s=document.createEvent("Event"),s.initEvent("move",!0,!0)),s.to=n,s.from=e,s.dragged=t,s.draggedRect=o,s.related=r||n,s.relatedRect=a||M(n),s.willInsertAfter=d,s.originalEvent=l,e.dispatchEvent(s),u&&(k=u.call(f,s,l)),k}function tt(e){e.draggable=!1}function zn(){at=!1}function Un(e,n,t){var o=M(we(t.el,0,t.options,!0)),r=Ut(t.el,t.options,g),a=10;return n?e.clientX<r.left-a||e.clientY<o.top&&e.clientX<o.right:e.clientY<r.top-a||e.clientY<o.bottom&&e.clientX<o.left}function Vn(e,n,t){var o=M(dt(t.el,t.options.draggable)),r=Ut(t.el,t.options,g),a=10;return n?e.clientX>r.right+a||e.clientY>o.bottom&&e.clientX>o.left:e.clientY>r.bottom+a||e.clientX>o.right&&e.clientY>o.top}function $n(e,n,t,o,r,a,l,d){var s=o?e.clientY:e.clientX,f=o?t.height:t.width,u=o?t.top:t.left,k=o?t.bottom:t.right,N=!1;if(!l){if(d&&Be<f*r){if(!Ie&&(Oe===1?s>u+f*a/2:s<k-f*a/2)&&(Ie=!0),Ie)N=!0;else if(Oe===1?s<u+Be:s>k-Be)return-Oe}else if(s>u+f*(1-r)/2&&s<k-f*(1-r)/2)return qn(n)}return N=N||l,N&&(s<u+f*a/2||s>k-f*a/2)?s>u+f/2?1:-1:0}function qn(e){return K(c)<K(e)?1:-1}function Kn(e){for(var n=e.tagName+e.className+e.src+e.href+e.textContent,t=n.length,o=0;t--;)o+=n.charCodeAt(t);return o.toString(36)}function Jn(e){je.length=0;for(var n=e.getElementsByTagName("input"),t=n.length;t--;){var o=n[t];o.checked&&je.push(o)}}function ke(e){return setTimeout(e,0)}function lt(e){return clearTimeout(e)}Ue&&D(document,"touchmove",function(e){(p.active||ve)&&e.cancelable&&e.preventDefault()});p.utils={on:D,off:S,css:h,find:Wt,is:function(e,n){return!!Z(e,n,e,!1)},extend:Mn,throttle:Gt,closest:Z,toggleClass:V,clone:zt,index:K,nextTick:ke,cancelNextTick:lt,detectDirection:$t,getChild:we};p.get=function(e){return e[q]};p.mount=function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];n[0].constructor===Array&&(n=n[0]),n.forEach(function(o){if(!o.prototype||!o.prototype.constructor)throw"Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(o));o.utils&&(p.utils=te(te({},p.utils),o.utils)),xe.mount(o)})};p.create=function(e,n){return new p(e,n)};p.version=xn;var P=[],Se,st,ut=!1,nt,ot,ze,De;function Zn(){function e(){this.defaults={scroll:!0,forceAutoScrollFallback:!1,scrollSensitivity:30,scrollSpeed:10,bubbleScroll:!0};for(var n in this)n.charAt(0)==="_"&&typeof this[n]=="function"&&(this[n]=this[n].bind(this))}return e.prototype={dragStarted:function(n){var t=n.originalEvent;this.sortable.nativeDraggable?D(document,"dragover",this._handleAutoScroll):this.options.supportPointer?D(document,"pointermove",this._handleFallbackAutoScroll):t.touches?D(document,"touchmove",this._handleFallbackAutoScroll):D(document,"mousemove",this._handleFallbackAutoScroll)},dragOverCompleted:function(n){var t=n.originalEvent;!this.options.dragOverBubble&&!t.rootEl&&this._handleAutoScroll(t)},drop:function(){this.sortable.nativeDraggable?S(document,"dragover",this._handleAutoScroll):(S(document,"pointermove",this._handleFallbackAutoScroll),S(document,"touchmove",this._handleFallbackAutoScroll),S(document,"mousemove",this._handleFallbackAutoScroll)),Mt(),He(),Fn()},nulling:function(){ze=st=Se=ut=De=nt=ot=null,P.length=0},_handleFallbackAutoScroll:function(n){this._handleAutoScroll(n,!0)},_handleAutoScroll:function(n,t){var o=this,r=(n.touches?n.touches[0]:n).clientX,a=(n.touches?n.touches[0]:n).clientY,l=document.elementFromPoint(r,a);if(ze=n,t||this.options.forceAutoScrollFallback||Ae||ie||_e){rt(n,this.options,l,t);var d=ue(l,!0);ut&&(!De||r!==nt||a!==ot)&&(De&&Mt(),De=setInterval(function(){var s=ue(document.elementFromPoint(r,a),!0);s!==d&&(d=s,He()),rt(n,o.options,s,t)},10),nt=r,ot=a)}else{if(!this.options.bubbleScroll||ue(l,!0)===ee()){He();return}rt(n,this.options,ue(l,!1),!1)}}},re(e,{pluginName:"scroll",initializeByDefault:!0})}function He(){P.forEach(function(e){clearInterval(e.pid)}),P=[]}function Mt(){clearInterval(De)}var rt=Gt(function(e,n,t,o){if(n.scroll){var r=(e.touches?e.touches[0]:e).clientX,a=(e.touches?e.touches[0]:e).clientY,l=n.scrollSensitivity,d=n.scrollSpeed,s=ee(),f=!1,u;st!==t&&(st=t,He(),Se=n.scroll,u=n.scrollFn,Se===!0&&(Se=ue(t,!0)));var k=0,N=Se;do{var y=N,E=M(y),L=E.top,H=E.bottom,ne=E.left,yt=E.right,A=E.width,ae=E.height,R=void 0,$e=void 0,v=y.scrollWidth,b=y.scrollHeight,m=h(y),ce=y.scrollLeft,Y=y.scrollTop;y===s?(R=A<v&&(m.overflowX==="auto"||m.overflowX==="scroll"||m.overflowX==="visible"),$e=ae<b&&(m.overflowY==="auto"||m.overflowY==="scroll"||m.overflowY==="visible")):(R=A<v&&(m.overflowX==="auto"||m.overflowX==="scroll"),$e=ae<b&&(m.overflowY==="auto"||m.overflowY==="scroll"));var i=R&&(Math.abs(yt-r)<=l&&ce+A<v)-(Math.abs(ne-r)<=l&&!!ce),w=$e&&(Math.abs(H-a)<=l&&Y+ae<b)-(Math.abs(L-a)<=l&&!!Y);if(!P[k])for(var z=0;z<=k;z++)P[z]||(P[z]={});(P[k].vx!=i||P[k].vy!=w||P[k].el!==y)&&(P[k].el=y,P[k].vx=i,P[k].vy=w,clearInterval(P[k].pid),(i!=0||w!=0)&&(f=!0,P[k].pid=setInterval((function(){o&&this.layer===0&&p.active._onTouchMove(ze);var _=P[this.layer].vy?P[this.layer].vy*d:0,j=P[this.layer].vx?P[this.layer].vx*d:0;typeof u=="function"&&u.call(p.dragged.parentNode[q],j,_,e,ze,P[this.layer].el)!=="continue"||jt(P[this.layer].el,j,_)}).bind({layer:k}),24))),k++}while(n.bubbleScroll&&N!==s&&(N=ue(N,!1)));ut=f}},30),Zt=function(e){var n=e.originalEvent,t=e.putSortable,o=e.dragEl,r=e.activeSortable,a=e.dispatchSortableEvent,l=e.hideGhostForTarget,d=e.unhideGhostForTarget;if(n){var s=t||r;l();var f=n.changedTouches&&n.changedTouches.length?n.changedTouches[0]:n,u=document.elementFromPoint(f.clientX,f.clientY);d(),s&&!s.el.contains(u)&&(a("spill"),this.onSpill({dragEl:o,putSortable:t}))}};function ht(){}ht.prototype={startIndex:null,dragStart:function(e){var n=e.oldDraggableIndex;this.startIndex=n},onSpill:function(e){var n=e.dragEl,t=e.putSortable;this.sortable.captureAnimationState(),t&&t.captureAnimationState();var o=we(this.sortable.el,this.startIndex,this.options);o?this.sortable.el.insertBefore(n,o):this.sortable.el.appendChild(n),this.sortable.animateAll(),t&&t.animateAll()},drop:Zt};re(ht,{pluginName:"revertOnSpill"});function pt(){}pt.prototype={onSpill:function(e){var n=e.dragEl,t=e.putSortable,o=t||this.sortable;o.captureAnimationState(),n.parentNode&&n.parentNode.removeChild(n),o.animateAll()},drop:Zt};re(pt,{pluginName:"removeOnSpill"});p.mount(new Zn);p.mount(pt,ht);function Qn(e){return e==null?e:JSON.parse(JSON.stringify(e))}function eo(e){getCurrentInstance()&&onUnmounted(e)}function to(e){getCurrentInstance()?onMounted(e):nextTick(e)}let Qt=null,en=null;function Ft(e=null,n=null){Qt=e,en=n}function no(){return{data:Qt,clonedData:en}}const Rt=Symbol("cloneElement");function tn(...e){var n,t;const o=(n=getCurrentInstance())==null?void 0:n.proxy;let r=null;const a=e[0];let[,l,d]=e;Array.isArray(unref(l))||(d=l,l=null);let s=null;const{immediate:f=!0,clone:u=Qn,customUpdate:k}=(t=unref(d))!=null?t:{};function N(b){var m;const{from:ce,oldIndex:Y,item:i}=b;r=Array.from(ce.childNodes);const w=unref((m=unref(l))==null?void 0:m[Y]),z=u(w);Ft(w,z),i[Rt]=z}function y(b){const m=b.item[Rt];if(!yn(m)){if(qe(b.item),isRef(l)){const ce=[...unref(l)];l.value=St(ce,b.newDraggableIndex,m);return}St(unref(l),b.newDraggableIndex,m)}}function E(b){const{from:m,item:ce,oldIndex:Y,oldDraggableIndex:i,pullMode:w,clone:z}=b;if(Dt(m,ce,Y),w==="clone"){qe(z);return}if(isRef(l)){const _=[...unref(l)];l.value=Et(_,i);return}Et(unref(l),i)}function L(b){if(k){k(b);return}const{from:m,item:ce,oldIndex:Y,oldDraggableIndex:i,newDraggableIndex:w}=b;if(qe(ce),Dt(m,ce,Y),isRef(l)){const z=[...unref(l)];l.value=wt(z,i,w);return}wt(unref(l),i,w)}function H(b){const{newIndex:m,oldIndex:ce,from:Y,to:i}=b;let w=null;const z=m===ce&&Y===i;try{if(z){let _=null;r==null||r.some((j,U)=>{if(_&&(r==null?void 0:r.length)!==i.childNodes.length)return Y.insertBefore(_,j.nextSibling),!0;const gt=i.childNodes[U];_=i==null?void 0:i.replaceChild(j,gt)})}}catch(_){w=_}finally{r=null}nextTick(()=>{if(Ft(),w)throw w})}const ne={onUpdate:L,onStart:N,onAdd:y,onRemove:E,onEnd:H};function yt(b){const m=unref(a);return b||(b=wn(m)?En(m,o==null?void 0:o.$el):m),b&&!_n(b)&&(b=b.$el),b||mn("Root element not found"),b}function A(){var b;const m=(b=unref(d))!=null?b:{},{immediate:ce,clone:Y}=m,i=Ve(m,["immediate","clone"]);return _t(i,(w,z)=>{Tn(w)&&(i[w]=(_,...j)=>{const U=no();return Cn(_,U),z(_,...j)})}),Dn(l===null?{}:ne,i)}const ae=b=>{b=yt(b),s&&R.destroy(),s=new p(b,A())};watch(()=>d,()=>{s&&_t(A(),(b,m)=>{s==null||s.option(b,m)})},{deep:!0});const R={option:(b,m)=>s==null?void 0:s.option(b,m),destroy:()=>{s==null||s.destroy(),s=null},save:()=>s==null?void 0:s.save(),toArray:()=>s==null?void 0:s.toArray(),closest:(...b)=>s==null?void 0:s.closest(...b)},$e=()=>R==null?void 0:R.option("disabled",!0),v=()=>R==null?void 0:R.option("disabled",!1);return to(()=>{f&&ae()}),eo(R.destroy),fe({start:ae,pause:$e,resume:v},R)}const ct=["update","start","add","remove","choose","unchoose","end","sort","filter","clone","move","change"],oo=["clone","animation","ghostClass","group","sort","disabled","store","handle","draggable","swapThreshold","invertSwap","invertedSwapThreshold","removeCloneOnHide","direction","chosenClass","dragClass","ignore","filter","preventOnFilter","easing","setData","dropBubble","dragoverBubble","dataIdAttr","delay","delayOnTouchOnly","touchStartThreshold","forceFallback","fallbackClass","fallbackOnBody","fallbackTolerance","fallbackOffset","supportPointer","emptyInsertThreshold","scroll","forceAutoScrollFallback","scrollSensitivity","scrollSpeed","bubbleScroll","modelValue","tag","target","customUpdate",...ct.map(e=>`on${e.replace(/^\S/,n=>n.toUpperCase())}`)],lo=defineComponent({name:"VueDraggable",model:{prop:"modelValue",event:"update:modelValue"},props:oo,emits:["update:modelValue",...ct],setup(e,{slots:n,emit:t,expose:o,attrs:r}){const a=ct.reduce((u,k)=>{const N=`on${k.replace(/^\S/,y=>y.toUpperCase())}`;return u[N]=(...y)=>t(k,...y),u},{}),l=computed(()=>{const u=toRefs(e),{modelValue:k}=u,N=Ve(u,["modelValue"]),y=Object.entries(N).reduce((E,[L,H])=>{const ne=unref(H);return ne!==void 0&&(E[L]=ne),E},{});return fe(fe({},a),bn(fe(fe({},r),y)))}),d=computed({get:()=>e.modelValue,set:u=>t("update:modelValue",u)}),s=ref(),f=reactive(tn(e.target||s,d,l));return o(f),()=>{var u;return h$1(e.tag||"div",{ref:s},(u=n==null?void 0:n.default)==null?void 0:u.call(n,f))}}}),_hoisted_1$b=["innerHTML"],_hoisted_2$a={class:"flex items-start gap-2"},_hoisted_3$a=["src"],_hoisted_4$a=["innerHTML"],_hoisted_5$a={class:"w-8 h-8 rounded-full bg-sky-100 text-sky-600 font-bold flex items-center justify-center"},_hoisted_6$a=["innerHTML"],_hoisted_7$9={key:0,class:"mt-5 p-4 text-sm text-gray-600 border-t border-gray-200"},_hoisted_8$9=["innerHTML"],_sfc_main$c=defineComponent({__name:"Ordering",props:{question:{},modelValue:{},examStore:{}},setup(e){const n=e,{testMode:t,answers:o}=n.examStore,r=Array.isArray(n.question.correct_answer)?n.question.correct_answer:(n.question.correct_answer||"").split(","),a=ref(Object.entries(n.question.options).map(([u,k])=>({id:u,choice:k.choice})));watch(a,u=>{t.value==="exam"&&(o[n.question.id]=u.map(k=>k.id).join(","))},{deep:!0});const l=computed(()=>{const u=o[n.question.id];return u?u.split(","):[]}),d=computed(()=>t.value==="review"?!0:t.value==="tutor"?!!l.value.length:!1),s=(u,k)=>{if(t.value==="exam")return"";const N=r.indexOf(u),y=l.value.indexOf(u);return y===-1?"bg-rose-50 border-rose-200":y===N?"bg-teal-50 border-teal-200":"bg-amber-50 border-amber-200"},f=ref(null);return onMounted(()=>{const u=document.getElementById("exhibits");u&&(u.innerHTML="",f.value=createApp(_sfc_main$k,{tabs:n.question.tabs}),f.value.mount(u))}),onUnmounted(()=>{f.value&&(f.value.unmount(),f.value=null)}),(u,k)=>(openBlock(),createElementBlock("div",{class:normalizeClass([u.question.tabs&&["nclex","cat"].includes(u.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[u.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold text-gray-950 dark:text-white",innerHTML:u.question.intro},null,8,_hoisted_1$b)):createCommentVNode("",!0),u.question.tabs&&["nclex","cat"].includes(u.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:u.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$a,[createBaseVNode("img",{src:unref(qn_arrow),class:"h-7 shrink-0"},null,8,_hoisted_3$a),createBaseVNode("div",{class:"mb-2 font-bold text-gray-950 leading-relaxed dark:text-white",innerHTML:u.question.question},null,8,_hoisted_4$a)]),createVNode(unref(lo),{modelValue:a.value,"onUpdate:modelValue":k[0]||(k[0]=N=>a.value=N),"item-key":"id",disabled:unref(t)!=="exam",class:"space-y-3"},{item:withCtx(({element:N,index:y})=>[createBaseVNode("div",{class:normalizeClass(["p-3 bg-white border rounded-xl shadow-sm flex items-center gap-3 transition-colors",s(N.id,y)])},[createBaseVNode("div",_hoisted_5$a,toDisplayString(String.fromCharCode(65+y)),1),createBaseVNode("div",{class:"flex-1 text-gray-800",innerHTML:N.choice},null,8,_hoisted_6$a)],2)]),_:1},8,["modelValue","disabled"]),d.value?(openBlock(),createElementBlock("div",_hoisted_7$9,[k[1]||(k[1]=createBaseVNode("div",{class:"font-semibold mb-2"},"Explanation:",-1)),createBaseVNode("div",{innerHTML:u.question.solution},null,8,_hoisted_8$9)])):createCommentVNode("",!0)],2))}}),_hoisted_1$a=["innerHTML"],_hoisted_2$9={class:"rounded-xl bg-gray-50 p-4 md:p-6"},_hoisted_3$9={class:"flex items-start gap-2"},_hoisted_4$9=["src"],_hoisted_5$9=["innerHTML"],_hoisted_6$9={class:"bowtie-board"},_hoisted_7$8={class:"bowtie-layout flex justify-between items-center"},_hoisted_8$8={class:"bow-column"},_hoisted_9$8={class:"slot-title"},_hoisted_10$7={class:"slot-stack"},_hoisted_11$5={class:"bow-column center-column"},_hoisted_12$4={class:"slot-title"},_hoisted_13$3={class:"bow-column"},_hoisted_14$1={class:"slot-title"},_hoisted_15$1={class:"slot-stack"},_hoisted_16$1={class:"mt-5 grid gap-4 md:grid-cols-3"},_hoisted_17$1={class:"pool-panel"},_hoisted_18$1={class:"pool-title"},_hoisted_19$1={class:"pool-panel"},_hoisted_20$1={class:"pool-title"},_hoisted_21={class:"pool-panel"},_hoisted_22={class:"pool-title"},_hoisted_23={key:0,class:"mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm"},_hoisted_24={class:"space-y-1"},_hoisted_25={key:1,class:"mt-4 p-4 text-center"},_sfc_main$b=defineComponent({__name:"BowTie",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=inject("showSolution",null),l=ref(!1),d=ref(!1),s=ref([]),f=ref([]),u=ref([]),k=ref([]),N=ref({correctId:null,items:[]}),y=ref([]);function E(T,Q){if(T==null)return Q;if(typeof T!="string")return T;try{return JSON.parse(T)}catch{return Q}}function L(T){if(Array.isArray(T))return T.map(Q=>String(Q));if(typeof T=="string"){const Q=E(T,T);return Array.isArray(Q)?Q.map(F=>String(F)):T?[T]:[]}return[]}const H=computed(()=>{var F,Yt;const T=E((Yt=(F=t.question.options)==null?void 0:F.dynamicColumns)==null?void 0:Yt.choice,[]),Q=Array.isArray(T)?T.reduce((nn,ln)=>({...nn,...ln}),{}):{};return{actions:Q.column1||"Action to take",potential:Q.column2||"Potential condition",parameters:Q.column3||"Parameter to monitor"}});function ne(T,Q,F,Yt){var sn,on;const nn=E((on=(sn=t.question.options)==null?void 0:sn[T])==null?void 0:on.choice,{});return(Array.isArray(nn==null?void 0:nn[Q])?nn[Q]:[]).filter(an=>(an==null?void 0:an.markAs)&&(an==null?void 0:an.text)).map(an=>({id:`${Yt}:${an.markAs}`,text:an.text,mark:an.markAs,group:F}))}function yt(){s.value=ne("finalActionsToTake","actionsToTake","action","action"),f.value=ne("finalPotentialConditionsData","potentialConditions","potential","potential"),u.value=ne("finalParametersToMonitorData","parametersToMonitor","parameter","parameter");const T=E(t.question.correct_answer,{}),Q=L(T.actionsAnswers),F=L(T.potentialAnswers),Yt=L(T.paramerAnswers??T.parameterAnswers);k.value=Array.from({length:Math.max(2,Q.length||2)},(nn,ln)=>({correctId:Q[ln]?`action:${Q[ln]}`:null,items:[]})),N.value={correctId:F[0]?`potential:${F[0]}`:null,items:[]},y.value=Array.from({length:Math.max(2,Yt.length||2)},(nn,ln)=>({correctId:Yt[ln]?`parameter:${Yt[ln]}`:null,items:[]}))}function A(){return t.modelValue?typeof t.modelValue=="string"?E(t.modelValue,{}):typeof t.modelValue=="object"?t.modelValue:null:null}function ae(){const T=A();if(!T)return;const Q=L(T.actionsAnswers).map(on=>`action:${on}`),F=L(T.potentialAnswers).map(on=>`potential:${on}`),Yt=L(T.paramerAnswers??T.parameterAnswers).map(on=>`parameter:${on}`),nn=new Map(s.value.map(on=>[on.id,on])),ln=new Map(f.value.map(on=>[on.id,on])),sn=new Map(u.value.map(on=>[on.id,on]));Q.forEach((on,an)=>{k.value[an]&&nn.has(on)&&(k.value[an].items=[nn.get(on)])}),F[0]&&ln.has(F[0])&&(N.value.items=[ln.get(F[0])]),Yt.forEach((on,an)=>{y.value[an]&&sn.has(on)&&(y.value[an].items=[sn.get(on)])}),s.value=s.value.filter(on=>!Q.includes(on.id)),f.value=f.value.filter(on=>!F.includes(on.id)),u.value=u.value.filter(on=>!Yt.includes(on.id))}function R(T,Q){T.items=T.items.filter(F=>F.group===Q).slice(0,1)}function $e(T){R(k.value[T],"action")}function v(){R(N.value,"potential")}function b(T){R(y.value[T],"parameter")}function m(T){return T==="action"?k.value:T==="parameter"?y.value:[N.value]}function ce(T){return m(T).map(Q=>Q.correctId).filter(Q=>!!Q)}function Y(T){return m(T).map(Q=>{var F;return((F=Q.items[0])==null?void 0:F.id)||null}).filter(Q=>!!Q)}function i(T,Q){var sn;if(!l.value)return"none";const F=((sn=T.items[0])==null?void 0:sn.id)||null;if(Q==="potential")return!F&&T.correctId?"missed":!F&&!T.correctId?"none":F===T.correctId?"correct":"incorrect";const Yt=ce(Q),nn=Y(Q);return F?Yt.includes(F)?"correct":"incorrect":nn.filter(on=>Yt.includes(on)).length<Yt.length?"missed":"none"}function w(T,Q){const F=T==="action"?k.value[Q]:T==="potential"?N.value:y.value[Q];if(!F)return"";switch(i(F,T)){case"correct":return"border-teal-500 bg-teal-50";case"incorrect":return"border-rose-500 bg-rose-50";case"missed":return"border-amber-500 bg-amber-50";default:return""}}function z(T,Q){const F=T==="action"?k.value[Q]:T==="potential"?N.value:y.value[Q];if(!F)return"";const Yt=i(F,T);return Yt==="correct"?"border-teal-400 bg-teal-100":Yt==="incorrect"?"border-rose-400 bg-rose-100":""}const _=T=>T.replace(/<[^>]*>/g,"").trim(),j=computed(()=>{const T=[...s.value,...f.value,...u.value,...k.value.flatMap(F=>F.items),...N.value.items,...y.value.flatMap(F=>F.items)],Q=new Map;return T.forEach(F=>{Q.has(F.id)||Q.set(F.id,F)}),Array.from(Q.values())});function U(T){if(!T)return"none";const Q=j.value.find(F=>F.id===T);return Q?_(Q.text)||Q.mark||T:T.split(":")[1]||T}const gt=computed(()=>{const T=[];return k.value.forEach((Q,F)=>{T.push({key:`action-${F}`,status:i(Q,"action"),label:`${H.value.actions} ${F+1}: ${x(i(Q,"action"),Q,"action")}`})}),T.push({key:"potential-0",status:i(N.value,"potential"),label:`${H.value.potential}: ${x(i(N.value,"potential"),N.value,"potential")}`}),y.value.forEach((Q,F)=>{T.push({key:`parameter-${F}`,status:i(Q,"parameter"),label:`${H.value.parameters} ${F+1}: ${x(i(Q,"parameter"),Q,"parameter")}`})}),T});function x(T,Q,F){var Yt,nn;if(T==="correct")return"Correct";if(T==="incorrect"){const ln=_(((Yt=Q.items[0])==null?void 0:Yt.text)||"")||((nn=Q.items[0])==null?void 0:nn.mark)||"none",sn=F==="potential"?U(Q.correctId):ce(F).map(on=>U(on)).join(", ");return`Incorrect (selected "${ln}", correct is "${sn}")`}return T==="missed"?`Not answered (correct is "${F==="potential"?U(Q.correctId):ce(F).map(sn=>U(sn)).join(", ")}")`:"Not answered"}function ft(T){return T==="correct"?"pi-check text-teal-600":T==="incorrect"?"pi-times text-rose-600":T==="missed"?"pi-exclamation-triangle text-amber-600":"pi-circle text-gray-400"}function it(T){return T==="correct"?"text-teal-700 font-semibold":T==="incorrect"?"text-rose-700 font-semibold":T==="missed"?"text-amber-700 font-semibold":"text-gray-500"}function Xt(){l.value=!0,d.value=!1,a&&a({flag:!0,value:!0})}watchEffect(()=>{switch(t.question.id,r){case"review":l.value=!0,d.value=!1;break;case"exam":l.value=!1,d.value=!1;break;case"tutor":l.value=!1,d.value=!0;break;default:l.value=!1,d.value=!1}});const cn=computed(()=>{var T;return{actionsAnswers:k.value.map(Q=>{var F;return((F=Q.items[0])==null?void 0:F.mark)||null}),potentialAnswers:[((T=N.value.items[0])==null?void 0:T.mark)||null],paramerAnswers:y.value.map(Q=>{var F;return((F=Q.items[0])==null?void 0:F.mark)||null})}});return watch(()=>[t.question.id,t.question.options,t.question.correct_answer],()=>{yt(),ae()},{immediate:!0,deep:!0}),watch(cn,T=>o("update:modelValue",T),{deep:!0}),onUnmounted(()=>{a&&a({flag:!0,value:!1})}),(T,Q)=>(openBlock(),createElementBlock("div",{class:normalizeClass([T.question.tabs&&["nclex","cat"].includes(T.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[T.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold text-gray-950 dark:text-white",innerHTML:T.question.intro},null,8,_hoisted_1$a)):createCommentVNode("",!0),T.question.tabs&&["nclex","cat"].includes(T.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:T.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$9,[createBaseVNode("div",_hoisted_3$9,[createBaseVNode("img",{src:unref(qn_arrow),class:"h-7 shrink-0"},null,8,_hoisted_4$9),createBaseVNode("div",{class:"mb-2 font-bold text-gray-950 leading-relaxed dark:text-white",innerHTML:T.question.question},null,8,_hoisted_5$9)]),createBaseVNode("div",_hoisted_6$9,[Q[4]||(Q[4]=createStaticVNode('<svg class="bowtie-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" data-v-decf420e><defs data-v-decf420e><marker id="bowtieDot" markerWidth="4" markerHeight="4" refX="2" refY="2" data-v-decf420e><circle cx="2" cy="2" r="1.6" fill="#94a3b8" data-v-decf420e></circle></marker></defs><path d="M 22 28 C 35 28, 42 40, 50 50" data-v-decf420e></path><path d="M 22 72 C 35 72, 42 60, 50 50" data-v-decf420e></path><path d="M 50 50 C 58 40, 65 28, 78 28" data-v-decf420e></path><path d="M 50 50 C 58 60, 65 72, 78 72" data-v-decf420e></path><circle cx="50" cy="50" r="1.8" class="center-dot" data-v-decf420e></circle><circle cx="22" cy="28" r="1.4" class="edge-dot" data-v-decf420e></circle><circle cx="22" cy="72" r="1.4" class="edge-dot" data-v-decf420e></circle><circle cx="78" cy="28" r="1.4" class="edge-dot" data-v-decf420e></circle><circle cx="78" cy="72" r="1.4" class="edge-dot" data-v-decf420e></circle></svg>',1)),createBaseVNode("div",_hoisted_7$8,[createBaseVNode("div",_hoisted_8$8,[createBaseVNode("h4",_hoisted_9$8,toDisplayString(H.value.actions),1),createBaseVNode("div",_hoisted_10$7,[(openBlock(!0),createElementBlock(Fragment,null,renderList(k.value,(F,Yt)=>(openBlock(),createElementBlock("div",{key:"a-"+Yt,class:"slot-wrap"},[createVNode(unref(lo),{modelValue:F.items,"onUpdate:modelValue":nn=>F.items=nn,group:"bow-action","item-key":"id",onAdd:nn=>$e(Yt),disabled:unref(r)==="review",class:normalizeClass(["slot-box action-slot",w("action",Yt)])},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(F.items,nn=>(openBlock(),createElementBlock("div",{key:nn.id,class:normalizeClass(["drag-item",z("action",Yt)])},toDisplayString(nn.text),3))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onAdd","disabled","class"])]))),128))])]),createBaseVNode("div",_hoisted_11$5,[createBaseVNode("h4",_hoisted_12$4,toDisplayString(H.value.potential),1),createVNode(unref(lo),{modelValue:N.value.items,"onUpdate:modelValue":Q[0]||(Q[0]=F=>N.value.items=F),group:"bow-potential","item-key":"id",onAdd:v,disabled:unref(r)==="review",class:normalizeClass(["hazard-box min-w-[150px]",w("potential",0)])},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(N.value.items,F=>(openBlock(),createElementBlock("div",{key:F.id,class:normalizeClass(["drag-item",z("potential",0)])},toDisplayString(F.text),3))),128))]),_:1},8,["modelValue","disabled","class"])]),createBaseVNode("div",_hoisted_13$3,[createBaseVNode("h4",_hoisted_14$1,toDisplayString(H.value.parameters),1),createBaseVNode("div",_hoisted_15$1,[(openBlock(!0),createElementBlock(Fragment,null,renderList(y.value,(F,Yt)=>(openBlock(),createElementBlock("div",{key:"p-"+Yt,class:"slot-wrap"},[createVNode(unref(lo),{modelValue:F.items,"onUpdate:modelValue":nn=>F.items=nn,group:"bow-parameter","item-key":"id",onAdd:nn=>b(Yt),disabled:unref(r)==="review",class:normalizeClass(["slot-box parameter-slot",w("parameter",Yt)])},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(F.items,nn=>(openBlock(),createElementBlock("div",{key:nn.id,class:normalizeClass(["drag-item",z("parameter",Yt)])},toDisplayString(nn.text),3))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onAdd","disabled","class"])]))),128))])])])]),createBaseVNode("div",_hoisted_16$1,[createBaseVNode("section",_hoisted_17$1,[createBaseVNode("h5",_hoisted_18$1,toDisplayString(H.value.actions),1),createVNode(unref(lo),{modelValue:s.value,"onUpdate:modelValue":Q[1]||(Q[1]=F=>s.value=F),group:"bow-action","item-key":"id",disabled:unref(r)==="review",class:"pool-box min-h-[84px]"},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(s.value,F=>(openBlock(),createElementBlock("div",{key:F.id,class:"pool-item"},toDisplayString(F.text),1))),128))]),_:1},8,["modelValue","disabled"])]),createBaseVNode("section",_hoisted_19$1,[createBaseVNode("h5",_hoisted_20$1,toDisplayString(H.value.potential),1),createVNode(unref(lo),{modelValue:f.value,"onUpdate:modelValue":Q[2]||(Q[2]=F=>f.value=F),group:"bow-potential","item-key":"id",disabled:unref(r)==="review",class:"pool-box min-h-[84px]"},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(f.value,F=>(openBlock(),createElementBlock("div",{key:F.id,class:"pool-item"},toDisplayString(F.text),1))),128))]),_:1},8,["modelValue","disabled"])]),createBaseVNode("section",_hoisted_21,[createBaseVNode("h5",_hoisted_22,toDisplayString(H.value.parameters),1),createVNode(unref(lo),{modelValue:u.value,"onUpdate:modelValue":Q[3]||(Q[3]=F=>u.value=F),group:"bow-parameter","item-key":"id",disabled:unref(r)==="review",class:"pool-box min-h-[84px]"},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(u.value,F=>(openBlock(),createElementBlock("div",{key:F.id,class:"pool-item"},toDisplayString(F.text),1))),128))]),_:1},8,["modelValue","disabled"])])]),l.value?(openBlock(),createElementBlock("div",_hoisted_23,[Q[5]||(Q[5]=createBaseVNode("h5",{class:"font-semibold text-slate-700 mb-2"},"Feedback",-1)),createBaseVNode("div",_hoisted_24,[(openBlock(!0),createElementBlock(Fragment,null,renderList(gt.value,F=>(openBlock(),createElementBlock("div",{key:F.key,class:"flex items-center gap-2"},[createBaseVNode("i",{class:normalizeClass(`pi ${ft(F.status)}`)},null,2),createBaseVNode("span",{class:normalizeClass(it(F.status))},toDisplayString(F.label),3)]))),128))])])):createCommentVNode("",!0),d.value?(openBlock(),createElementBlock("div",_hoisted_25,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",onClick:Xt}," Submit ")])):createCommentVNode("",!0)])],2))}}),BowTie=_export_sfc(_sfc_main$b,[["__scopeId","data-v-decf420e"]]),_hoisted_1$9=["innerHTML"],_hoisted_2$8={class:"flex items-start gap-2"},_hoisted_3$8=["src"],_hoisted_4$8=["innerHTML"],_hoisted_5$8={class:"matrix-table border border-gray-200 w-full"},_hoisted_6$8={class:"bg-gray-100"},_hoisted_7$7=["innerHTML"],_hoisted_8$7={class:"p-2"},_hoisted_9$7=["checked","disabled","onChange"],_hoisted_10$6={key:0,class:"mt-4 text-center"},_sfc_main$a=defineComponent({__name:"MTX",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","submitted","update:showSolution"],setup(e,{emit:n}){const t=e,o=n,{testMode:r,answers:a,results:l}=t.examStore,d=computed(()=>{if(Array.isArray(t.question.correct_answer))return t.question.correct_answer;try{return JSON.parse(t.question.correct_answer||"{}")}catch{return{}}}),s=t.question.mtx_option||"{}",f=JSON.parse(s),u={};Object.keys(d.value).forEach(R=>{const $e=d.value[R];(Array.isArray($e.answers)?$e.answers:[]).forEach(b=>{var m;u[b]||(u[b]=((m=f[b])==null?void 0:m.option)||`Category ${b}`)})});const k=reactive({});Object.keys(u).forEach(R=>{k[R]={answers:[]}});function N(R,$e){var v;return(v=k[$e])==null?void 0:v.answers.includes(R)}function y(R,$e){const v=k[$e].answers,b=v.indexOf(R);b>-1?v.splice(b,1):v.push(R),o("update:modelValue",E())}function E(){const R=toRaw(k);try{if(typeof structuredClone=="function")return structuredClone(R)}catch{}return JSON.parse(JSON.stringify(R))}function L(R,$e){var v,b;return(b=(v=d.value[R])==null?void 0:v.answers)==null?void 0:b.includes($e)}function H(R,$e){if(!ne.value)return"";const v=L(R,$e),b=N(R,$e);return v&&b?"accent-teal-600":!v&&b?"accent-rose-600":v&&!b?"ring-2 ring-teal-600":""}const ne=ref(!1),yt=ref(!1);watchEffect(()=>{switch(r){case"review":ne.value=!0,yt.value=!1;break;case"exam":ne.value=!1,yt.value=!1;break;case"tutor":ne.value=!1,yt.value=!0;break;default:ne.value=!1,yt.value=!1}});const A=inject("showSolution");function ae(){ne.value=!0,A({flag:!0,value:!0}),yt.value=!1}return onUnmounted(()=>{A&&A({flag:!0,value:!1})}),(R,$e)=>(openBlock(),createElementBlock("div",{class:normalizeClass([R.question.tabs&&["nclex","cat"].includes(R.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[R.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold text-gray-950 dark:text-white",innerHTML:R.question.intro},null,8,_hoisted_1$9)):createCommentVNode("",!0),R.question.tabs&&["nclex","cat"].includes(R.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:R.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$8,[createBaseVNode("img",{src:unref(qn_arrow),class:"h-7 shrink-0"},null,8,_hoisted_3$8),createBaseVNode("div",{class:"mb-2 font-bold text-gray-950 leading-relaxed dark:text-white",innerHTML:R.question.question},null,8,_hoisted_4$8)]),createBaseVNode("table",_hoisted_5$8,[createBaseVNode("thead",_hoisted_6$8,[createBaseVNode("tr",null,[createBaseVNode("th",{class:"p-2 text-left",innerHTML:R.question.table_header},null,8,_hoisted_7$7),(openBlock(),createElementBlock(Fragment,null,renderList(u,(v,b)=>createBaseVNode("th",{key:b,class:"p-2 text-center"},toDisplayString(v),1)),64))])]),createBaseVNode("tbody",null,[(openBlock(!0),createElementBlock(Fragment,null,renderList(R.question.options,(v,b)=>(openBlock(),createElementBlock("tr",{key:b,class:"hover:bg-gray-50"},[createBaseVNode("td",_hoisted_8$7,toDisplayString(v.choice.choice),1),(openBlock(),createElementBlock(Fragment,null,renderList(u,(m,ce)=>createBaseVNode("td",{key:ce,class:"p-2 text-center"},[createBaseVNode("input",{type:"checkbox",checked:N(String(b),String(ce)),disabled:unref(r)==="review",onChange:Y=>y(String(b),String(ce)),class:normalizeClass(H(String(b),String(ce)))},null,42,_hoisted_9$7)])),64))]))),128))])]),yt.value?(openBlock(),createElementBlock("div",_hoisted_10$6,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",onClick:ae}," Submit ")])):createCommentVNode("",!0),renderSlot(R.$slots,"solution")])],2))}}),_hoisted_1$8=["innerHTML"],_hoisted_2$7={class:"flex items-start gap-2"},_hoisted_3$7=["src"],_hoisted_4$7=["innerHTML"],_hoisted_5$7={class:"grouping-table border border-gray-200 w-full mt-2"},_hoisted_6$7={class:"bg-gray-100"},_hoisted_7$6=["innerHTML"],_hoisted_8$6={class:"p-2"},_hoisted_9$6=["name","value","checked","disabled","onChange"],_hoisted_10$5={key:0,class:"text-red-600 mt-2"},_hoisted_11$4={key:1,class:"mt-4 text-center"},_sfc_main$9=defineComponent({__name:"MMC",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","submitted"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=computed(()=>{if(!t.question.correct_answer)return{};if(typeof t.question.correct_answer=="string")try{return JSON.parse(t.question.correct_answer)}catch{return{}}return t.question.correct_answer}),l=t.question.mtx_option||"{}";let d={};try{d=JSON.parse(l)}catch{d={}}const s={};Object.keys(a.value).forEach(A=>{var $e;const ae=($e=a.value)==null?void 0:$e[A];(Array.isArray(ae==null?void 0:ae.answers)?ae.answers:[]).forEach(v=>{var b;s[v]||(s[v]=((b=d[v])==null?void 0:b.option)||`Category ${v}`)})}),Object.keys(s).length||Object.keys(d||{}).forEach(A=>{var ae;s[A]=((ae=d[A])==null?void 0:ae.option)||`Category ${A}`});const f=reactive({});Object.keys(t.question.options).forEach(A=>f[A]=null),t.modelValue&&Object.assign(f,t.modelValue);function u(A,ae){f[A]=ae,o("update:modelValue",ne())}const k=ref(""),N=ref(!1),y=ref(!1);function E(A,ae){var R,$e,v;return(v=($e=(R=a.value)==null?void 0:R[A])==null?void 0:$e.answers)==null?void 0:v.includes(ae)}function L(A,ae){if(!N.value)return"";const R=E(A,ae),$e=f[A]===ae;return R&&$e?"accent-teal-600":!R&&$e?"accent-rose-600":R&&!$e?"ring-2 ring-teal-600":""}const H=inject("showSolution");function ne(){const A=toRaw(f);try{if(typeof structuredClone=="function")return structuredClone(A)}catch{}return JSON.parse(JSON.stringify(A))}function yt(){N.value=!0,y.value=!1,H&&H({flag:!0,value:!0}),o("submitted",{answer:ne()})}return watchEffect(()=>{switch(r){case"review":N.value=!0,y.value=!1;break;case"exam":N.value=!1,y.value=!1;break;case"tutor":N.value=!1,y.value=!0;break;default:N.value=!1,y.value=!1}}),onUnmounted(()=>{H&&H({flag:!0,value:!1})}),(A,ae)=>(openBlock(),createElementBlock("div",{class:normalizeClass([A.question.tabs&&["nclex","cat"].includes(A.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[A.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold text-gray-950 dark:text-white",innerHTML:A.question.intro},null,8,_hoisted_1$8)):createCommentVNode("",!0),A.question.tabs&&["nclex","cat"].includes(A.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:A.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$7,[createBaseVNode("img",{src:unref(qn_arrow),class:"h-7 shrink-0"},null,8,_hoisted_3$7),createBaseVNode("div",{class:"mb-2 font-bold text-gray-950 leading-relaxed dark:text-white",innerHTML:A.question.question},null,8,_hoisted_4$7)]),createBaseVNode("table",_hoisted_5$7,[createBaseVNode("thead",_hoisted_6$7,[createBaseVNode("tr",null,[createBaseVNode("th",{class:"p-2 text-left",innerHTML:A.question.table_header},null,8,_hoisted_7$6),(openBlock(),createElementBlock(Fragment,null,renderList(s,(R,$e)=>createBaseVNode("th",{key:$e,class:"p-2 text-center"},toDisplayString(R),1)),64))])]),createBaseVNode("tbody",null,[(openBlock(!0),createElementBlock(Fragment,null,renderList(A.question.options,(R,$e)=>(openBlock(),createElementBlock("tr",{key:$e,class:"hover:bg-gray-50"},[createBaseVNode("td",_hoisted_8$6,toDisplayString(R.choice.choice),1),(openBlock(),createElementBlock(Fragment,null,renderList(s,(v,b)=>createBaseVNode("td",{key:b,class:"p-2 text-center"},[createBaseVNode("input",{type:"radio",name:String($e),value:String(b),checked:f[String($e)]===String(b),disabled:unref(r)==="review",class:normalizeClass(L(String($e),String(b))),onChange:m=>u(String($e),String(b))},null,42,_hoisted_9$6)])),64))]))),128))])]),k.value?(openBlock(),createElementBlock("div",_hoisted_10$5,toDisplayString(k.value),1)):createCommentVNode("",!0),y.value?(openBlock(),createElementBlock("div",_hoisted_11$4,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",onClick:yt}," Submit ")])):createCommentVNode("",!0),renderSlot(A.$slots,"solution")])],2))}}),_hoisted_1$7=["innerHTML"],_hoisted_2$6={class:"rounded-xl bg-gray-50 p-4 md:p-6"},_hoisted_3$6={class:"flex items-start gap-2"},_hoisted_4$6=["src"],_hoisted_5$6=["innerHTML"],_hoisted_6$6={class:"mb-4"},_hoisted_7$5={key:0,class:"placeholder"},_hoisted_8$5={class:"mt-4 rounded-xl border border-gray-200 bg-white p-3"},_hoisted_9$5={key:0,class:"mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm"},_hoisted_10$4={class:"flex items-center gap-2"},_hoisted_11$3={key:1,class:"mt-4 text-center"},_hoisted_12$3=["disabled"],_hoisted_13$2=["innerHTML"],_sfc_main$8=defineComponent({__name:"DDC",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=inject("showSolution",null),l=ref(!1),d=ref(!1);function s(v,b){if(v==null)return b;if(typeof v!="string")return v;try{return JSON.parse(v)}catch{return b}}const f=ref([]),u=ref({correctId:null,items:[]});function k(){var ce;f.value=[];const v=t.question.options||[];f.value=v.filter(Y=>{var i,w;return((i=Y==null?void 0:Y.choice)==null?void 0:i.text)&&((w=Y==null?void 0:Y.choice)==null?void 0:w.markKey)}).map(Y=>({id:Y.choice.id||`opt-${Y.choice.markKey}`,text:Y.choice.text,mark:Y.choice.markKey,group:"ddc"}));const b=s(t.question.correct_answer,[]),m=((ce=b==null?void 0:b[0])==null?void 0:ce.answer)??null;u.value={correctId:m?`opt-${m}`:null,items:[]}}function N(){return t.modelValue?typeof t.modelValue=="string"?s(t.modelValue,{}):typeof t.modelValue=="object"?t.modelValue:null:null}function y(){const v=N();if(!(v!=null&&v.answer))return;const b=`opt-${v.answer}`,m=f.value.find(ce=>`opt-${ce.mark}`===b);m&&(u.value.items=[m],f.value=f.value.filter(ce=>ce.id!==m.id))}function E(){u.value.items=u.value.items.slice(0,1)}const L=computed(()=>{var v;return{answer:((v=u.value.items[0])==null?void 0:v.mark)||null}}),H=computed(()=>{var b;if(!l.value)return"none";const v=((b=u.value.items[0])==null?void 0:b.id)||null;return!v&&u.value.correctId?"missed":!v&&!u.value.correctId?"none":v===u.value.correctId?"correct":"incorrect"}),ne=computed(()=>H.value==="correct"?"border-teal-500 bg-teal-50":H.value==="incorrect"?"border-rose-500 bg-rose-50":H.value==="missed"?"border-amber-500 bg-amber-50":""),yt=computed(()=>H.value==="correct"?"border-teal-400 bg-teal-100":H.value==="incorrect"?"border-rose-400 bg-rose-100":""),A=computed(()=>{var v,b,m;if(H.value==="correct")return"Correct";if(H.value==="incorrect"){const ce=((v=u.value.items[0])==null?void 0:v.mark)||"none",Y=((b=u.value.correctId)==null?void 0:b.replace("opt-",""))||"none";return`Incorrect (selected "${ce}", correct is "${Y}")`}return H.value==="missed"?`Not answered (correct is "${((m=u.value.correctId)==null?void 0:m.replace("opt-",""))||"none"}")`:"Not answered"}),ae=computed(()=>H.value==="correct"?"pi-check text-teal-600":H.value==="incorrect"?"pi-times text-rose-600":H.value==="missed"?"pi-exclamation-triangle text-amber-600":"pi-circle text-gray-400"),R=computed(()=>H.value==="correct"?"text-teal-700 font-semibold":H.value==="incorrect"?"text-rose-700 font-semibold":H.value==="missed"?"text-amber-700 font-semibold":"text-gray-500");function $e(){u.value.items.length&&(l.value=!0,d.value=!1,a&&a({flag:!0,value:!0}))}return watchEffect(()=>{switch(t.question.id,r){case"review":l.value=!0,d.value=!1;break;case"exam":l.value=!1,d.value=!1;break;case"tutor":l.value=!1,d.value=!0;break;default:l.value=!1,d.value=!1}}),watch(()=>[t.question.id,t.question.options,t.question.correct_answer],()=>{k(),y()},{immediate:!0,deep:!0}),watch(L,v=>o("update:modelValue",v),{deep:!0}),onUnmounted(()=>{a&&a({flag:!0,value:!1})}),(v,b)=>(openBlock(),createElementBlock("div",{class:normalizeClass([v.question.tabs&&["nclex","cat"].includes(v.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[v.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold text-gray-950 dark:text-white",innerHTML:v.question.intro},null,8,_hoisted_1$7)):createCommentVNode("",!0),v.question.tabs&&["nclex","cat"].includes(v.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:v.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$6,[createBaseVNode("div",_hoisted_3$6,[createBaseVNode("img",{src:unref(qn_arrow),class:"h-7 shrink-0"},null,8,_hoisted_4$6),createBaseVNode("div",{class:"mb-2 font-bold text-gray-950 leading-relaxed dark:text-white",innerHTML:v.question.question},null,8,_hoisted_5$6)]),createBaseVNode("div",_hoisted_6$6,[b[2]||(b[2]=createBaseVNode("h4",{class:"mb-2 text-sm font-semibold text-gray-700"},"Select priority finding",-1)),createVNode(unref(lo),{modelValue:u.value.items,"onUpdate:modelValue":b[0]||(b[0]=m=>u.value.items=m),group:"ddc","item-key":"id",onAdd:E,disabled:unref(r)==="review",class:normalizeClass(["slot-box min-h-[56px] bg-gray-100",ne.value])},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(u.value.items,m=>(openBlock(),createElementBlock("div",{key:m.id,class:normalizeClass(["drag-item",yt.value])},toDisplayString(m.text),3))),128)),u.value.items.length?createCommentVNode("",!0):(openBlock(),createElementBlock("span",_hoisted_7$5,"Drop answer here"))]),_:1},8,["modelValue","disabled","class"])]),createBaseVNode("div",_hoisted_8$5,[createVNode(unref(lo),{modelValue:f.value,"onUpdate:modelValue":b[1]||(b[1]=m=>f.value=m),group:"ddc","item-key":"id",disabled:unref(r)==="review",class:"pool-box min-h-[80px]"},{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(f.value,m=>(openBlock(),createElementBlock("div",{key:m.id,class:"pool-item"},toDisplayString(m.text),1))),128))]),_:1},8,["modelValue","disabled"])]),l.value?(openBlock(),createElementBlock("div",_hoisted_9$5,[createBaseVNode("div",_hoisted_10$4,[createBaseVNode("i",{class:normalizeClass(`pi ${ae.value}`)},null,2),createBaseVNode("span",{class:normalizeClass(R.value)},toDisplayString(A.value),3)])])):createCommentVNode("",!0),d.value?(openBlock(),createElementBlock("div",_hoisted_11$3,[createBaseVNode("button",{class:normalizeClass(["px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",u.value.items.length?"":"opacity-50 cursor-not-allowed"]),disabled:!u.value.items.length,onClick:$e}," Submit ",10,_hoisted_12$3)])):createCommentVNode("",!0),l.value&&v.question.solution?(openBlock(),createElementBlock("div",{key:2,class:"mt-4 p-3 rounded bg-teal-50 text-sm prose",innerHTML:v.question.solution},null,8,_hoisted_13$2)):createCommentVNode("",!0)])],2))}}),DDC=_export_sfc(_sfc_main$8,[["__scopeId","data-v-5d3bfa75"]]),_hoisted_1$6=["innerHTML"],_hoisted_2$5={class:"rounded-xl bg-gray-50 p-4 md:p-6"},_hoisted_3$5={class:"flex items-start gap-2"},_hoisted_4$5=["src"],_hoisted_5$5=["innerHTML"],_hoisted_6$5={key:0,class:"mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm"},_hoisted_7$4={class:"space-y-1"},_hoisted_8$4={key:1,class:"mt-4 text-center"},_hoisted_9$4=["disabled"],_hoisted_10$3={key:0,class:"mt-2 text-xs text-gray-500"},_sfc_main$7=defineComponent({__name:"DRDCLOZE",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=ref(null),l=ref({}),d=ref(!1);function s(i,w){if(i==null)return w;if(typeof i!="string")return i;try{return JSON.parse(i)}catch{return w}}function f(){var i;l.value={},(i=t.question.options)==null||i.forEach(w=>{l.value[w.choice.id]=null})}const u=computed(()=>(t.question.options||[]).map(i=>{var w;return String(((w=i==null?void 0:i.choice)==null?void 0:w.id)||"")}).filter(Boolean));function k(i){return i.replace(/<[^>]*>/g,"").trim()}function N(){const i={},w=t.question.correct_answer,z=s(w,w);return Array.isArray(z)?(z.forEach((_,j)=>{if(_&&typeof _=="object"){const x=String(_.id??_.choice_id??u.value[j]??""),ft=String(_.answer??_.value??"").trim();x&&ft&&(i[x]=ft);return}const U=u.value[j],gt=String(_??"").trim();U&&gt&&(i[U]=gt)}),i):(z&&typeof z=="object"&&Object.entries(z).forEach(([_,j])=>{if(j&&typeof j=="object"){const gt=String(j.id??_??""),x=String(j.answer??j.value??"").trim();gt&&x&&(i[gt]=x);return}const U=String(j??"").trim();_&&U&&(i[String(_)]=U)}),i)}const y=computed(()=>N());function E(i,w){var j,U;if(!w)return"none";const z=(t.question.options||[]).find(gt=>{var x;return String((x=gt==null?void 0:gt.choice)==null?void 0:x.id)===i}),_=(U=(j=z==null?void 0:z.choice)==null?void 0:j.options)==null?void 0:U[w];return _&&k(String(_))||w}function L(i){const w=l.value[i],z=y.value[i];return!w&&z?"missed":!w&&!z?"none":w===z?"correct":"incorrect"}const H=computed(()=>r==="review"?!0:r==="tutor"?d.value:!1),ne=computed(()=>u.value.map((i,w)=>{const z=L(i),_=E(i,l.value[i]),j=E(i,y.value[i]);let U=`Blank ${w+1}: Not answered`;return z==="correct"?U=`Blank ${w+1}: Correct`:z==="incorrect"?U=`Blank ${w+1}: Incorrect (selected "${_}", correct is "${j}")`:z==="missed"&&(U=`Blank ${w+1}: Not answered (correct is "${j}")`),{id:i,status:z,label:U}}));function yt(){if(!t.modelValue)return;let i=t.modelValue;typeof i=="string"&&(i=s(i,{})),Object.keys(i||{}).forEach(w=>{w in l.value&&(l.value[w]=i[w])})}async function A(){var w;if(await nextTick(),!a.value)return;const i=a.value;(w=t.question.options)==null||w.forEach(z=>{const _=z.choice.id,j=i.querySelector(`#${_}`);if(!j)return;const U=document.createElement("select");U.className="inline-block border border-gray-300 p-1 rounded mx-1 text-sm align-middle",U.disabled=r==="review"||r==="tutor"&&d.value;const gt=document.createElement("option");gt.value="",gt.textContent="-- Select --",gt.disabled=!0,gt.selected=!l.value[_],U.appendChild(gt),Object.entries(z.choice.options).forEach(([x,ft])=>{const it=document.createElement("option");it.value=x,it.textContent=ft,l.value[_]===x&&(it.selected=!0),U.appendChild(it)}),U.addEventListener("change",x=>{l.value[_]=x.target.value,R()}),j.replaceWith(U)})}function ae(){if(!a.value)return;const i=r==="review"||r==="tutor"&&d.value;a.value.querySelectorAll("select").forEach(w=>{w.disabled=i})}function R(){a.value&&a.value.querySelectorAll("select").forEach(i=>{const w=i,z=w.name,_=L(z),j=y.value[z],U=l.value[z],gt="inline-block border p-1 rounded mx-1 text-sm align-middle";if(w.style.opacity="1",w.style.fontWeight="500",w.style.color="#111827",w.style.backgroundColor="#ffffff",w.style.borderColor="#d1d5db",w.style.webkitTextFillColor="#111827",Array.from(w.options).forEach((x,ft)=>{const it=x;it.style.fontWeight="400",it.style.color="#111827",it.style.backgroundColor="#ffffff",ft===0&&(it.style.color="#6b7280"),H.value&&it.value&&(j&&it.value===j&&(it.style.color="#047857",it.style.backgroundColor="#ecfdf5",it.style.fontWeight="600"),U&&it.value===U&&U!==j&&(it.style.color="#be123c",it.style.backgroundColor="#fff1f2",it.style.fontWeight="600"))}),!H.value){w.className=`${gt} border-gray-300`;return}if(_==="correct"){w.className=`${gt} border-teal-500 bg-teal-50 text-teal-800`,w.style.color="#047857",w.style.backgroundColor="#ecfdf5",w.style.borderColor="#10b981",w.style.webkitTextFillColor="#047857";return}if(_==="incorrect"){w.className=`${gt} border-rose-500 bg-rose-50 text-rose-800`,w.style.color="#be123c",w.style.backgroundColor="#fff1f2",w.style.borderColor="#f43f5e",w.style.webkitTextFillColor="#be123c";return}if(_==="missed"){w.className=`${gt} border-amber-500 bg-amber-50 text-amber-800`,w.style.color="#b45309",w.style.backgroundColor="#fffbeb",w.style.borderColor="#f59e0b",w.style.webkitTextFillColor="#b45309";return}w.className=`${gt} border-gray-300`})}computed(()=>l.value);const $e=computed(()=>{const i=Object.values(l.value||{});return i.length?i.every(w=>!!w):!1}),v=computed(()=>r==="tutor"&&!d.value),b=inject("showSolution",null);function m(){$e.value&&(d.value=!0,ae(),R(),b&&b({flag:!0,value:!0}))}watch(()=>[t.question.id,t.question.options],async()=>{d.value=!1,f(),yt(),await A(),ae(),R()},{immediate:!0,deep:!0}),watch(l,i=>o("update:modelValue",i),{deep:!0}),watchEffect(()=>{r!=="tutor"&&(d.value=!1),ae(),R()}),watch(()=>[l.value,H.value],()=>R(),{deep:!0});function ce(i){return i==="correct"?"pi-check text-teal-600":i==="incorrect"?"pi-times text-rose-600":i==="missed"?"pi-exclamation-triangle text-amber-600":"pi-circle text-gray-400"}function Y(i){return i==="correct"?"text-teal-700 font-semibold":i==="incorrect"?"text-rose-700 font-semibold":i==="missed"?"text-amber-700 font-semibold":"text-gray-500"}return onUnmounted(()=>{b&&b({flag:!0,value:!1})}),(i,w)=>(openBlock(),createElementBlock("div",{class:normalizeClass([i.question.tabs&&["nclex","cat"].includes(i.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[i.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold text-gray-950 dark:text-white",innerHTML:i.question.intro},null,8,_hoisted_1$6)):createCommentVNode("",!0),i.question.tabs&&["nclex","cat"].includes(i.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:i.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_2$5,[createBaseVNode("div",_hoisted_3$5,[createBaseVNode("img",{src:unref(qn_arrow),class:"h-7 shrink-0"},null,8,_hoisted_4$5),createBaseVNode("div",{ref_key:"questionContainer",ref:a,class:"prose max-w-none mb-2 font-bold text-gray-950 leading-relaxed dark:prose-invert dark:text-white",innerHTML:i.question.question},null,8,_hoisted_5$5)]),H.value?(openBlock(),createElementBlock("div",_hoisted_6$5,[w[0]||(w[0]=createBaseVNode("h5",{class:"font-semibold text-slate-700 mb-2"},"Feedback",-1)),createBaseVNode("div",_hoisted_7$4,[(openBlock(!0),createElementBlock(Fragment,null,renderList(ne.value,z=>(openBlock(),createElementBlock("div",{key:z.id,class:"flex items-center gap-2"},[createBaseVNode("i",{class:normalizeClass(`pi ${ce(z.status)}`)},null,2),createBaseVNode("span",{class:normalizeClass(Y(z.status))},toDisplayString(z.label),3)]))),128))])])):createCommentVNode("",!0),v.value?(openBlock(),createElementBlock("div",_hoisted_8$4,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",disabled:!$e.value,onClick:m}," Submit ",8,_hoisted_9$4),$e.value?createCommentVNode("",!0):(openBlock(),createElementBlock("div",_hoisted_10$3," Complete all blanks to submit. "))])):createCommentVNode("",!0),renderSlot(i.$slots,"solution",{},void 0,!0)])],2))}}),DRDCLOZE=_export_sfc(_sfc_main$7,[["__scopeId","data-v-6ecb59a2"]]),_hoisted_1$5=["innerHTML"],_hoisted_2$4={class:"flex items-start gap-2"},_hoisted_3$4=["src"],_hoisted_4$4=["innerHTML"],_hoisted_5$4={class:"text-sm text-gray-500 mb-3 italic"},_hoisted_6$4={key:0},_hoisted_7$3=["value","checked","onChange","disabled"],_hoisted_8$3=["innerHTML"],_hoisted_9$3=["innerHTML"],_hoisted_10$2={class:"text-lg font-normal"},_hoisted_11$2=["innerHTML"],_hoisted_12$2={key:0,class:"mt-4 p-4 text-center"},_sfc_main$6=defineComponent({__name:"MMN",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","update:showSolution"],setup(e,{emit:n}){const t=e,{testMode:o,answers:r,results:a}=t.examStore,l=n,d=computed({get:()=>t.modelValue,set:A=>l("update:modelValue",A)}),s=computed(()=>t.question.total_points),f=A=>{const ae=[...d.value],R=ae.indexOf(A);if(R!==-1)ae.splice(R,1);else{if(ae.length>=s.value)return;ae.push(A)}d.value=ae},u=A=>o==="review"?!0:d.value.includes(A)?!1:d.value.length>=s.value,k=ref(!1),N=ref(!1),y=computed(()=>{if(Array.isArray(t.question.correct_answer))return t.question.correct_answer;try{return JSON.parse(t.question.correct_answer||"[]")}catch{return[]}});watchEffect(()=>{switch(o){case"review":k.value=!0;break;case"exam":k.value=!1;break;case"tutor":k.value=!1,N.value=!0,t.examStore.answers[t.question.id]&&setTimeout(()=>{k.value=!0,H({flag:!0,value:!0})},y.value.length*1e4);break;default:k.value=!1}});const E=A=>y.value.includes(A),L=A=>{const ae=r[t.question.id]??[];return o==="review"?ae.includes(A)&&!y.value.includes(A):o==="tutor"?ae.includes(A)&&!E(A):!1},H=inject("showSolution"),ne=()=>{k.value=!0,H({flag:!0,value:!0}),N.value=!1},yt=ref(null);return onMounted(()=>{const A=document.getElementById("exhibits");A&&(A.innerHTML="",yt.value=createApp(_sfc_main$k,{tabs:t.question.tabs}),yt.value.mount(A))}),onUnmounted(()=>{H({flag:!0,value:!1}),yt.value&&(yt.value.unmount(),yt.value=null)}),(A,ae)=>(openBlock(),createElementBlock("div",{class:normalizeClass([A.question.tabs&&["nclex","cat"].includes(A.examStore.storeName)?"grid gap-4 md:grid-cols-2":""])},[createBaseVNode("div",null,[A.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold text-gray-950 dark:text-white",innerHTML:A.question.intro},null,8,_hoisted_1$5)):createCommentVNode("",!0),A.question.tabs&&["nclex","cat"].includes(A.examStore.storeName)?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:A.question.tabs},null,8,["tabs"])):createCommentVNode("",!0)]),createBaseVNode("div",null,[createBaseVNode("div",_hoisted_2$4,[createBaseVNode("img",{src:unref(qn_arrow),class:"h-7 shrink-0"},null,8,_hoisted_3$4),createBaseVNode("div",{class:"mb-2 font-bold text-gray-950 leading-relaxed dark:text-white",innerHTML:A.question.question},null,8,_hoisted_4$4)]),createBaseVNode("div",_hoisted_5$4,[createTextVNode(" Select "+toDisplayString(s.value)+" option",1),s.value>1?(openBlock(),createElementBlock("span",_hoisted_6$4,"s")):createCommentVNode("",!0),ae[0]||(ae[0]=createTextVNode(". "))]),(openBlock(!0),createElementBlock(Fragment,null,renderList(A.question.options,(R,$e)=>(openBlock(),createElementBlock("div",{key:$e,class:"mb-2 ms-2 md:ms-8"},[R.choice!=null&&R.choice!=""&&R.choice!="None"?(openBlock(),createElementBlock("label",{key:0,class:normalizeClass(["flex items-start gap-2",{"text-teal-600 font-semibold":E(String($e))&&k.value,"text-rose-600 font-semibold":L(String($e))&&k.value}])},[createBaseVNode("input",{type:"checkbox",class:"checkbox checkbox-sm mt-1 cursor-pointer border-gray-600 text-gray-700 dark:text-slate-100 dark:border-white",value:String($e),checked:d.value.includes(String($e)),onChange:v=>f(String($e)),disabled:u(String($e))},null,40,_hoisted_7$3),createBaseVNode("div",null,[createBaseVNode("span",{innerHTML:$e,class:"font-semibold"},null,8,_hoisted_8$3),ae[1]||(ae[1]=createTextVNode(". ")),createBaseVNode("span",{innerHTML:R.choice},null,8,_hoisted_9$3),ae[2]||(ae[2]=createTextVNode()),createBaseVNode("span",_hoisted_10$2,toDisplayString(E(String($e))&&k.value?"✓":L(String($e))&&k.value?"✗":""),1),k.value&&R.reason?(openBlock(),createElementBlock("div",{key:0,class:normalizeClass({"bg-teal-100/90 text-teal-800 p-0.5 rounded":E(String($e)),"bg-rose-100/90 text-rose-800 p-0.5 rounded":L(String($e))}),innerHTML:R.reason},null,10,_hoisted_11$2)):createCommentVNode("",!0)])],2)):createCommentVNode("",!0)]))),128)),N.value?(openBlock(),createElementBlock("div",_hoisted_12$2,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",onClick:ne}," Submit ")])):createCommentVNode("",!0),renderSlot(A.$slots,"solution")])],2))}}),_hoisted_1$4=["innerHTML"],_hoisted_2$3={class:"flex items-start gap-2"},_hoisted_3$3=["src"],_hoisted_4$3=["innerHTML"],_hoisted_5$3={class:"grouping-table border border-gray-200 w-full mt-2"},_hoisted_6$3={class:"bg-gray-100"},_hoisted_7$2=["innerHTML"],_hoisted_8$2={class:"p-2"},_hoisted_9$2={class:"font-semibold"},_hoisted_10$1=["innerHTML"],_hoisted_11$1=["checked","disabled","onChange"],_hoisted_12$1={key:2,class:"text-red-600 mt-2"},_hoisted_13$1={key:3,class:"mt-4 text-center"},_sfc_main$5=defineComponent({__name:"GRPCHCKBOX",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue","submitted"],setup(e,{emit:n}){const t=e,o=n,{testMode:r}=t.examStore,a=(x,ft)=>{if(x==null)return ft;if(typeof x!="string")return x;try{return JSON.parse(x)}catch{return ft}},l=x=>x&&typeof x=="object"?x:{},d=x=>x==null?[]:Array.isArray(x)?x.map(ft=>String(ft).trim()).filter(Boolean):typeof x=="string"?x.split(",").map(ft=>ft.trim()).filter(Boolean):[String(x)],s=computed(()=>a(t.question.correct_answer,{})),f=computed(()=>l(t.question.options)),u=computed(()=>Object.keys(f.value)),k=ref(null),N=computed(()=>{var x;return typeof((x=t.question)==null?void 0:x.question)=="string"&&t.question.question.includes('id="exhibits"')}),y=computed(()=>{var x;return!!((x=t.question)!=null&&x.tabs)&&!N.value}),E=computed(()=>{var ft,it,Xt;const x=((ft=t.question)==null?void 0:ft.match_options)??((it=t.question)==null?void 0:it.match_option)??((Xt=t.question)==null?void 0:Xt.mtx_option)??{};return a(x,{})}),L=computed(()=>{const x={};if(Object.keys(E.value||{}).sort().forEach(it=>{const Xt=E.value[it];if(typeof Xt=="string"){x[it]=Xt;return}x[it]=(Xt==null?void 0:Xt.option)||it}),Object.keys(x).length)return x;const ft=new Set;return Object.keys(s.value||{}).forEach(it=>{var cn,T;const Xt=(T=(cn=s.value)==null?void 0:cn[it])==null?void 0:T.answers;d(Xt).forEach(Q=>ft.add(Q))}),Array.from(ft).sort().forEach(it=>{x[it]=it}),x}),H=reactive({}),ne=x=>{var ft;return typeof x=="string"?x:typeof(x==null?void 0:x.choice)=="string"?x.choice:((ft=x==null?void 0:x.choice)==null?void 0:ft.choice)||""},yt=x=>{var it;const ft=(it=s.value)==null?void 0:it[x];return d(ft==null?void 0:ft.answers)},A=()=>{const x={};return u.value.forEach(ft=>{const it=H[ft]||[];x[ft]={answers:it.slice().sort().join(",")}}),x},ae=x=>{!x||typeof x!="object"||u.value.forEach(ft=>{const it=x==null?void 0:x[ft];if(it!=null){if(typeof it=="object"&&it!==null&&"answers"in it){H[ft]=d(it.answers);return}H[ft]=d(it)}})};watch(()=>{var x,ft,it,Xt,cn,T;return[(x=t.question)==null?void 0:x.id,(ft=t.question)==null?void 0:ft.options,(it=t.question)==null?void 0:it.correct_answer,(Xt=t.question)==null?void 0:Xt.match_option,(cn=t.question)==null?void 0:cn.match_options,(T=t.question)==null?void 0:T.mtx_option]},()=>{Object.keys(H).forEach(x=>delete H[x]),u.value.forEach(x=>{H[x]=[]}),ae(t.modelValue)},{immediate:!0,deep:!0}),watch(()=>t.modelValue,x=>{x&&ae(x)},{deep:!0});const $e=()=>{k.value&&(k.value.unmount(),k.value=null)},v=async()=>{var ft;if($e(),!((ft=t.question)!=null&&ft.tabs)||!N.value)return;await nextTick();const x=document.getElementById("exhibits");x&&(x.innerHTML="",k.value=createApp(_sfc_main$k,{tabs:t.question.tabs}),k.value.mount(x))};watch(()=>{var x,ft,it;return[(x=t.question)==null?void 0:x.id,(ft=t.question)==null?void 0:ft.tabs,(it=t.question)==null?void 0:it.question]},()=>{v()},{immediate:!0});const b=ref(""),m=()=>{o("update:modelValue",A())},ce=(x,ft)=>(H[x]||[]).includes(ft);function Y(x,ft){b.value="";const it=H[x]||[],Xt=it.indexOf(ft);Xt>-1?it.splice(Xt,1):it.push(ft),H[x]=it.slice(),m()}const i=ref(!1),w=ref(!1),z=(x,ft)=>yt(x).includes(ft),_=(x,ft)=>{if(!i.value)return"";const it=z(x,ft),Xt=ce(x,ft);return it&&Xt?"accent-teal-600":!it&&Xt?"accent-rose-600":it&&!Xt?"ring-2 ring-teal-600":""},j=inject("showSolution");function U(){const x=toRaw(A());try{if(typeof structuredClone=="function")return structuredClone(x)}catch{}return JSON.parse(JSON.stringify(x))}function gt(){if(u.value.filter(ft=>!(H[ft]||[]).length).length){b.value="Select at least one category for every row before submitting.";return}b.value="",i.value=!0,w.value=!1,j&&j({flag:!0,value:!0}),o("submitted",{answer:U()})}return watchEffect(()=>{switch(r){case"review":i.value=!0,w.value=!1;break;case"exam":i.value=!1,w.value=!1;break;case"tutor":i.value=!1,w.value=!0;break;default:i.value=!1,w.value=!1}}),onUnmounted(()=>{$e(),j&&j({flag:!0,value:!1})}),(x,ft)=>(openBlock(),createElementBlock("div",null,[x.question.intro?(openBlock(),createElementBlock("div",{key:0,class:"mb-2 font-bold text-gray-950 dark:text-white",innerHTML:x.question.intro},null,8,_hoisted_1$4)):createCommentVNode("",!0),y.value?(openBlock(),createBlock(_sfc_main$k,{key:1,tabs:x.question.tabs},null,8,["tabs"])):createCommentVNode("",!0),createBaseVNode("div",_hoisted_2$3,[createBaseVNode("img",{src:unref(qn_arrow),class:"h-7 shrink-0"},null,8,_hoisted_3$3),createBaseVNode("div",{class:"mb-2 font-bold text-gray-950 leading-relaxed dark:text-white",innerHTML:x.question.question},null,8,_hoisted_4$3)]),createBaseVNode("table",_hoisted_5$3,[createBaseVNode("thead",_hoisted_6$3,[createBaseVNode("tr",null,[createBaseVNode("th",{class:"p-2 text-left",innerHTML:x.question.table_header||"Finding"},null,8,_hoisted_7$2),(openBlock(!0),createElementBlock(Fragment,null,renderList(L.value,(it,Xt)=>(openBlock(),createElementBlock("th",{key:Xt,class:"p-2 text-center"},toDisplayString(it),1))),128))])]),createBaseVNode("tbody",null,[(openBlock(!0),createElementBlock(Fragment,null,renderList(f.value,(it,Xt)=>(openBlock(),createElementBlock("tr",{key:Xt,class:"hover:bg-gray-50"},[createBaseVNode("td",_hoisted_8$2,[createBaseVNode("span",_hoisted_9$2,toDisplayString(Xt)+".",1),createBaseVNode("span",{innerHTML:ne(it)},null,8,_hoisted_10$1)]),(openBlock(!0),createElementBlock(Fragment,null,renderList(L.value,(cn,T)=>(openBlock(),createElementBlock("td",{key:T,class:"p-2 text-center"},[createBaseVNode("input",{type:"checkbox",checked:ce(String(Xt),String(T)),disabled:unref(r)==="review",class:normalizeClass(_(String(Xt),String(T))),onChange:Q=>Y(String(Xt),String(T))},null,42,_hoisted_11$1)]))),128))]))),128))])]),b.value?(openBlock(),createElementBlock("div",_hoisted_12$1,toDisplayString(b.value),1)):createCommentVNode("",!0),w.value?(openBlock(),createElementBlock("div",_hoisted_13$1,[createBaseVNode("button",{class:"px-6 py-2 text-white rounded-sm bg-sky-500/95 border-0 cursor-pointer",onClick:gt}," Submit ")])):createCommentVNode("",!0),renderSlot(x.$slots,"solution")]))}}),_sfc_main$4=defineComponent({__name:"QuestionRenderer",props:{question:{},modelValue:{},examStore:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,o=n,r=computed({get:()=>t.modelValue,set:l=>o("update:modelValue",l)}),a=computed(()=>{var l,d;switch((d=(l=t.question)==null?void 0:l.question_type)==null?void 0:d.code){case"MMA":return _sfc_main$j;case"DRD":return _sfc_main$i;case"MSA":return _sfc_main$g;case"FIB":return _sfc_main$h;case"GRP":return _sfc_main$e;case"GRPCHCKBOX":return _sfc_main$5;case"HL":return Highlight;case"ORD":return _sfc_main$c;case"BOW":return BowTie;case"MTX":return _sfc_main$a;case"MMC":return _sfc_main$9;case"DDC":return DDC;case"DRDCLOZE":return DRDCLOZE;case"MMN":return _sfc_main$6;default:return _sfc_main$f}});return(l,d)=>(openBlock(),createBlock(resolveDynamicComponent(a.value),{question:l.question,examStore:l.examStore,modelValue:r.value,"onUpdate:modelValue":d[0]||(d[0]=s=>r.value=s)},createSlots({_:2},[renderList(l.$slots,(s,f)=>({name:f,fn:withCtx(u=>[renderSlot(l.$slots,f,normalizeProps(guardReactiveProps(u)),void 0,!0)])}))]),1032,["question","examStore","modelValue"]))}}),QuestionRenderer=_export_sfc(_sfc_main$4,[["__scopeId","data-v-fa4da289"]]),_hoisted_1$3={id:"calculator_id",class:"modal"},_hoisted_2$2={class:"modal-box bg-transparent shadow-none"},_hoisted_3$2={class:"flex flex-col items-center font-mono"},_hoisted_4$2={class:"p-4 space-y-2 shadow-md w-64 select-none bg-sky-950 rounded-2xl"},_hoisted_5$2={class:"text-lg font-bold text-center"},_hoisted_6$2={class:"grid grid-cols-4 gap-2 mt-2 text-center"},_sfc_main$3=defineComponent({__name:"Calculator",setup(__props){const expression=ref(""),error=ref(!1),result=computed(()=>{try{const safeExpr=expression.value.replace(/[^-()\d/*+.]/g,""),res=eval(safeExpr);return error.value=!1,isNaN(res)?"-":res}catch(e){return error.value=!0,"-"}}),append=e=>{expression.value+=e},calculate=()=>{error.value||(expression.value=result.value.toString())},clear=()=>{expression.value=""},backspace=()=>{expression.value=expression.value.slice(0,-1)};return(e,n)=>(openBlock(),createElementBlock("dialog",_hoisted_1$3,[createBaseVNode("div",_hoisted_2$2,[n[20]||(n[20]=createBaseVNode("form",{method:"dialog"},[createBaseVNode("button",{class:"btn btn-sm btn-circle btn-ghost absolute right-1 top-1"},[createBaseVNode("i",{class:"pi pi-times text-white"})])],-1)),createBaseVNode("div",_hoisted_3$2,[createBaseVNode("div",_hoisted_4$2,[withDirectives(createBaseVNode("input",{"onUpdate:modelValue":n[0]||(n[0]=t=>expression.value=t),type:"text",class:"p-2 border bg-blue-100 text-blue-900 rounded w-full text-right",placeholder:"0",readonly:""},null,512),[[vModelText,expression.value]]),createBaseVNode("p",_hoisted_5$2,toDisplayString(result.value),1),createBaseVNode("div",_hoisted_6$2,[createBaseVNode("button",{class:"btn",onClick:n[1]||(n[1]=t=>append("7"))},"7"),createBaseVNode("button",{class:"btn",onClick:n[2]||(n[2]=t=>append("8"))},"8"),createBaseVNode("button",{class:"btn",onClick:n[3]||(n[3]=t=>append("9"))},"9"),createBaseVNode("button",{class:"btn btn-error",onClick:n[4]||(n[4]=t=>backspace())},n[19]||(n[19]=[createBaseVNode("i",{class:"pi pi-backspace text-white"},"Del",-1)])),createBaseVNode("button",{class:"btn",onClick:n[5]||(n[5]=t=>append("4"))},"4"),createBaseVNode("button",{class:"btn",onClick:n[6]||(n[6]=t=>append("5"))},"5"),createBaseVNode("button",{class:"btn",onClick:n[7]||(n[7]=t=>append("6"))},"6"),createBaseVNode("button",{class:"btn",onClick:n[8]||(n[8]=t=>append("*"))},"×"),createBaseVNode("button",{class:"btn",onClick:n[9]||(n[9]=t=>append("1"))},"1"),createBaseVNode("button",{class:"btn",onClick:n[10]||(n[10]=t=>append("2"))},"2"),createBaseVNode("button",{class:"btn",onClick:n[11]||(n[11]=t=>append("3"))},"3"),createBaseVNode("button",{class:"btn",onClick:n[12]||(n[12]=t=>append("-"))},"−"),createBaseVNode("button",{class:"btn",onClick:n[13]||(n[13]=t=>append("0"))},"0"),createBaseVNode("button",{class:"btn",onClick:n[14]||(n[14]=t=>append("."))},"."),createBaseVNode("button",{class:"btn",onClick:n[15]||(n[15]=t=>append("/"))},"/"),createBaseVNode("button",{class:"btn",onClick:n[16]||(n[16]=t=>append("+"))},"+"),createBaseVNode("button",{class:"btn col-span-2 btn-success",onClick:n[17]||(n[17]=t=>calculate())},"="),createBaseVNode("button",{class:"btn col-span-2 btn-warning",onClick:n[18]||(n[18]=t=>clear())},"C")])])])])]))}});var quillCSS=`
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
`,classes={root:"p-editor-container",toolbar:"p-editor-toolbar",content:"p-editor-content"},EditorStyle=BaseStyle.extend({name:"editor",css:quillCSS,classes}),script$1={name:"BaseEditor",extends:script$2,props:{modelValue:String,placeholder:String,readonly:Boolean,formats:Array,editorStyle:null,modules:null},style:EditorStyle,provide:function e(){return{$parentInstance:this}},beforeMount:function e(){var n;EditorStyle.loadStyle({nonce:(n=this.$primevue)===null||n===void 0||(n=n.config)===null||n===void 0||(n=n.csp)===null||n===void 0?void 0:n.nonce})}};function _typeof(e){"@babel/helpers - typeof";return _typeof=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},_typeof(e)}function ownKeys(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function _objectSpread(e){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?ownKeys(Object(t),!0).forEach(function(o){_defineProperty(e,o,t[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach(function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(t,o))})}return e}function _defineProperty(e,n,t){return n=_toPropertyKey(n),n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function _toPropertyKey(e){var n=_toPrimitive(e,"string");return _typeof(n)=="symbol"?n:String(n)}function _toPrimitive(e,n){if(_typeof(e)!="object"||!e)return e;var t=e[Symbol.toPrimitive];if(t!==void 0){var o=t.call(e,n);if(_typeof(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(e)}var QuillJS=function(){try{return window.Quill}catch{return null}}(),script={name:"Editor",extends:script$1,inheritAttrs:!1,emits:["update:modelValue","text-change","selection-change","load"],data:function e(){return{reRenderColorKey:0}},quill:null,watch:{modelValue:function e(n,t){n!==t&&this.quill&&!this.quill.hasFocus()&&(this.reRenderColorKey++,this.renderValue(n))},readonly:function e(){this.handleReadOnlyChange()}},mounted:function e(){var n=this,t={modules:_objectSpread({toolbar:this.$refs.toolbarElement},this.modules),readOnly:this.readonly,theme:"snow",formats:this.formats,placeholder:this.placeholder};QuillJS?(this.quill=new QuillJS(this.$refs.editorElement,t),this.initQuill(),this.handleLoad()):__vitePreload(()=>import("./quill-B7ULj2qj.js"),[]).then(function(o){o&&DomHandler.isExist(n.$refs.editorElement)&&(o.default?n.quill=new o.default(n.$refs.editorElement,t):n.quill=new o(n.$refs.editorElement,t),n.initQuill())}).then(function(){n.handleLoad()})},beforeUnmount:function e(){this.quill=null},methods:{renderValue:function e(n){this.quill&&(n?this.quill.setContents(this.quill.clipboard.convert(n)):this.quill.setText(""))},initQuill:function e(){var n=this;this.renderValue(this.modelValue),this.quill.on("text-change",function(t,o,r){if(r==="user"){var a=n.$refs.editorElement.children[0].innerHTML,l=n.quill.getText().trim();a==="<p><br></p>"&&(a=""),n.$emit("update:modelValue",a),n.$emit("text-change",{htmlValue:a,textValue:l,delta:t,source:r,instance:n.quill})}}),this.quill.on("selection-change",function(t,o,r){var a=n.$refs.editorElement.children[0].innerHTML,l=n.quill.getText().trim();n.$emit("selection-change",{htmlValue:a,textValue:l,range:t,oldRange:o,source:r,instance:n.quill})})},handleLoad:function e(){this.quill&&this.quill.getModule("toolbar")&&this.$emit("load",{instance:this.quill})},handleReadOnlyChange:function e(){this.quill&&this.quill.enable(!this.readonly)}}};function render(e,n,t,o,r,a){return openBlock(),createElementBlock("div",mergeProps({class:e.cx("root")},e.ptmi("root")),[createBaseVNode("div",mergeProps({ref:"toolbarElement",class:e.cx("toolbar")},e.ptm("toolbar")),[renderSlot(e.$slots,"toolbar",{},function(){return[createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("select",mergeProps({class:"ql-header",defaultValue:"0"},e.ptm("header")),[createBaseVNode("option",mergeProps({value:"1"},e.ptm("option")),"Heading",16),createBaseVNode("option",mergeProps({value:"2"},e.ptm("option")),"Subheading",16),createBaseVNode("option",mergeProps({value:"0"},e.ptm("option")),"Normal",16)],16),createBaseVNode("select",mergeProps({class:"ql-font"},e.ptm("font")),[createBaseVNode("option",normalizeProps(guardReactiveProps(e.ptm("option"))),null,16),createBaseVNode("option",mergeProps({value:"serif"},e.ptm("option")),null,16),createBaseVNode("option",mergeProps({value:"monospace"},e.ptm("option")),null,16)],16)],16),createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("button",mergeProps({class:"ql-bold",type:"button"},e.ptm("bold")),null,16),createBaseVNode("button",mergeProps({class:"ql-italic",type:"button"},e.ptm("italic")),null,16),createBaseVNode("button",mergeProps({class:"ql-underline",type:"button"},e.ptm("underline")),null,16)],16),(openBlock(),createElementBlock("span",mergeProps({key:r.reRenderColorKey,class:"ql-formats"},e.ptm("formats")),[createBaseVNode("select",mergeProps({class:"ql-color"},e.ptm("color")),null,16),createBaseVNode("select",mergeProps({class:"ql-background"},e.ptm("background")),null,16)],16)),createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("button",mergeProps({class:"ql-list",value:"ordered",type:"button"},e.ptm("list")),null,16),createBaseVNode("button",mergeProps({class:"ql-list",value:"bullet",type:"button"},e.ptm("list")),null,16),createBaseVNode("select",mergeProps({class:"ql-align"},e.ptm("select")),[createBaseVNode("option",mergeProps({defaultValue:""},e.ptm("option")),null,16),createBaseVNode("option",mergeProps({value:"center"},e.ptm("option")),null,16),createBaseVNode("option",mergeProps({value:"right"},e.ptm("option")),null,16),createBaseVNode("option",mergeProps({value:"justify"},e.ptm("option")),null,16)],16)],16),createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("button",mergeProps({class:"ql-link",type:"button"},e.ptm("link")),null,16),createBaseVNode("button",mergeProps({class:"ql-image",type:"button"},e.ptm("image")),null,16),createBaseVNode("button",mergeProps({class:"ql-code-block",type:"button"},e.ptm("codeBlock")),null,16)],16),createBaseVNode("span",mergeProps({class:"ql-formats"},e.ptm("formats")),[createBaseVNode("button",mergeProps({class:"ql-clean",type:"button"},e.ptm("clean")),null,16)],16)]})],16),createBaseVNode("div",mergeProps({ref:"editorElement",class:e.cx("content"),style:e.editorStyle},e.ptm("content")),null,16)],16)}script.render=render;const _hoisted_1$2={class:"card"},_sfc_main$2=defineComponent({__name:"ExamNotes",props:{modelValue:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=n;return(o,r)=>(openBlock(),createElementBlock("div",_hoisted_1$2,[createVNode(unref(script),{modelValue:o.modelValue,"onUpdate:modelValue":r[0]||(r[0]=a=>t("update:modelValue",a)),editorStyle:"height: 320px",class:"w-full"},null,8,["modelValue"])]))}}),_hoisted_1$1={key:0,class:"fixed inset-0 z-[80] bg-slate-950/55 backdrop-blur-[1px] flex items-center justify-center p-4"},_hoisted_2$1={class:"w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl"},_hoisted_3$1={class:"flex items-start justify-between gap-2"},_hoisted_4$1={class:"mt-1 text-xs text-slate-500"},_hoisted_5$1={class:"mt-4 space-y-3"},_hoisted_6$1={class:"block text-sm"},_hoisted_7$1={class:"block text-sm"},_hoisted_8$1={class:"mt-4 flex items-center justify-end gap-2"},_hoisted_9$1=["disabled"],_sfc_main$1=defineComponent({__name:"ExamFeedbackModal",props:{sourceProduct:{},examMode:{},questionId:{},examId:{}},setup(e){const n=e,t=useRoute(),o=ref(!1),r=ref(!1),a=ref("technical_issue"),l=ref(""),d=ref(""),s=ref("success"),f=computed(()=>{const E=Number(n.questionId);return Number.isFinite(E)&&E>0?E:null}),u=computed(()=>{const E=Number(n.examId);return Number.isFinite(E)&&E>0?E:null}),k=computed(()=>[`Product: ${n.sourceProduct.toUpperCase()}`,n.examMode?`Mode: ${String(n.examMode).toUpperCase()}`:null,u.value?`Exam ID: ${u.value}`:null,f.value?`Question ID: ${f.value}`:"Question ID: n/a"].filter(Boolean).join(" | ")),N=()=>{o.value=!1},y=async()=>{var E,L;if(!(l.value.trim().length<5||r.value)){r.value=!0,d.value="";try{await axios.post("/exam-feedback",{source_product:n.sourceProduct,exam_mode:n.examMode??null,exam_id:u.value,question_id:f.value,issue_type:a.value,message:l.value.trim(),route:t.fullPath,metadata:{current_path:t.fullPath,user_agent:typeof navigator<"u"?navigator.userAgent:null}}),s.value="success",d.value="Thanks. Your report was sent to our team.",l.value="",setTimeout(()=>{N(),d.value=""},900)}catch(H){s.value="error",d.value=((L=(E=H==null?void 0:H.response)==null?void 0:E.data)==null?void 0:L.message)||"Unable to send report. Please try again."}finally{r.value=!1}}};return(E,L)=>(openBlock(),createElementBlock(Fragment,null,[createBaseVNode("button",{type:"button",class:"inline-flex items-center gap-1 cursor-pointer",onClick:L[0]||(L[0]=H=>o.value=!0)},L[3]||(L[3]=[createBaseVNode("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"size-6"},[createBaseVNode("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"})],-1),createBaseVNode("span",{class:"hidden 2xl:block"},"Report",-1)])),o.value?(openBlock(),createElementBlock("div",_hoisted_1$1,[createBaseVNode("div",_hoisted_2$1,[createBaseVNode("div",_hoisted_3$1,[createBaseVNode("div",null,[L[4]||(L[4]=createBaseVNode("h3",{class:"text-lg font-semibold"},"Report Question or Issue",-1)),createBaseVNode("p",_hoisted_4$1,toDisplayString(k.value),1)]),createBaseVNode("button",{type:"button",class:"text-slate-400 hover:text-slate-600",onClick:N},L[5]||(L[5]=[createBaseVNode("i",{class:"pi pi-times"},null,-1)]))]),createBaseVNode("div",_hoisted_5$1,[createBaseVNode("label",_hoisted_6$1,[L[7]||(L[7]=createBaseVNode("span",{class:"mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"},"Issue Type",-1)),withDirectives(createBaseVNode("select",{"onUpdate:modelValue":L[1]||(L[1]=H=>a.value=H),class:"w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500"},L[6]||(L[6]=[createBaseVNode("option",{value:"technical_issue"},"Technical issue",-1),createBaseVNode("option",{value:"content_error"},"Question/content error",-1),createBaseVNode("option",{value:"answer_issue"},"Answer/rationale concern",-1),createBaseVNode("option",{value:"other"},"Other",-1)]),512),[[vModelSelect,a.value]])]),createBaseVNode("label",_hoisted_7$1,[L[8]||(L[8]=createBaseVNode("span",{class:"mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"},"Details",-1)),withDirectives(createBaseVNode("textarea",{"onUpdate:modelValue":L[2]||(L[2]=H=>l.value=H),rows:"5",maxlength:"3000",placeholder:"Tell us what happened, what looked wrong, and what you expected.",class:"w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"},null,512),[[vModelText,l.value]])]),d.value?(openBlock(),createElementBlock("p",{key:0,class:normalizeClass(["text-xs rounded-lg px-3 py-2",s.value==="success"?"bg-emerald-100 text-emerald-700":"bg-rose-100 text-rose-700"])},toDisplayString(d.value),3)):createCommentVNode("",!0)]),createBaseVNode("div",_hoisted_8$1,[createBaseVNode("button",{type:"button",class:"rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100",onClick:N}," Cancel "),createBaseVNode("button",{type:"button",class:"rounded-full bg-sky-500/95 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60",disabled:r.value||l.value.trim().length<5,onClick:y},toDisplayString(r.value?"Sending...":"Send Report"),9,_hoisted_9$1)])])])):createCommentVNode("",!0)],64))}}),_hoisted_1=["aria-busy"],_hoisted_2={class:"border-b bg-sky-800 px-4 py-3 text-white"},_hoisted_3={class:"mt-3 flex flex-wrap items-center justify-between gap-2"},_hoisted_4={key:0,class:"inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100 ring-1 ring-white/15",for:"customSwitch1"},_hoisted_5={key:1,class:"inline-flex items-center gap-2 rounded-full bg-teal-400/15 px-3 py-1.5 text-xs font-semibold text-teal-100 ring-1 ring-teal-300/30"},_hoisted_6={key:2,class:"inline-flex items-center gap-2 rounded-full bg-sky-400/15 px-3 py-1.5 text-xs font-semibold text-sky-100 ring-1 ring-sky-300/30"},_hoisted_7=["innerHTML"],_hoisted_8={key:0,class:"flex h-full min-h-64 flex-col items-center justify-center text-center text-slate-500 dark:text-slate-300"},_hoisted_9={key:0,class:"mt-1 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400"},_hoisted_10={key:1,class:"mt-1 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400"},_hoisted_11={key:1,class:"flex justify-start"},_hoisted_12={key:2,class:"flex justify-start"},_hoisted_13={class:"max-w-[86%] rounded-2xl rounded-tl-sm border border-dashed border-teal-300 bg-white px-4 py-3 text-slate-800 shadow-sm dark:border-teal-500/60 dark:bg-slate-800 dark:text-slate-100"},_hoisted_14=["innerHTML"],_hoisted_15={class:"border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950"},_hoisted_16={key:0,class:"space-y-3"},_hoisted_17={class:"rounded-2xl border border-sky-100 bg-sky-50 p-3 text-slate-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-slate-100"},_hoisted_18={class:"mt-3 grid grid-cols-2 gap-2"},_hoisted_19=["disabled"],_hoisted_20=["disabled"],_sfc_main={__name:"AiChat",props:{question:{type:[Object,String],default:null},solution:{type:String,default:""},chatOpened:{type:Boolean,default:!0}},emits:["update:chatOpened","close"],setup(e,{emit:n}){const t=e,o=n,r=useAuthStore(),a=ref([]),l=ref(""),d=ref(""),s=ref(!1),f=ref(!1),u=ref(!1),k=ref(null),N=ref(""),y=ref(""),E=computed(()=>{var i;const Y=typeof t.question=="string"?t.question:(i=t.question)==null?void 0:i.question;return typeof Y=="string"?Y.trim():""}),L=computed(()=>t.question?typeof t.question=="string"?{question:t.question,solution:t.solution||void 0}:t.question:null);let H=null;const ne=computed(()=>f.value&&u.value),yt=computed(()=>r.is_authenticated),A=Y=>String(Y??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),ae=Y=>A(Y).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>"),R=async()=>{await nextTick(),k.value&&(k.value.scrollTop=k.value.scrollHeight)},$e=()=>{H&&(H.abort(),H=null),f.value=!1,u.value=!1},v=()=>{l.value!==""&&(a.value.push({id:`${Date.now()}-assistant`,role:"assistant",content:l.value}),l.value="")},b=()=>{const Y=t.question&&typeof t.question=="object"&&t.question.id?t.question.id:null;return Y==null||String(Y).trim()===""?null:String(Y)},m=async(Y=null,i={})=>{var it;if(!t.chatOpened)return 0;const{showUserMessage:w=!0,clearInput:z=!0,showErrorMessage:_=!0,allowGuest:j=!1}=i;Y&&typeof Y=="object"&&"preventDefault"in Y&&(Y=null);const U=String(Y??d.value??"").trim();if(!U||f.value)return!1;if(!yt.value&&!j)return d.value="",await R(),!1;$e(),w&&a.value.push({id:`${Date.now()}-user`,role:"user",content:U});const gt={message:U,deep_reasoning:s.value},x=b();x!==null&&(gt.question_id=x);const ft="/api/ai/incident-assistant";z&&Y===null&&(d.value=""),l.value="",f.value=!0,u.value=!0,H=new AbortController;try{const Xt={"Content-Type":"application/json",Accept:"text/event-stream"},cn=(it=r.user)==null?void 0:it.token;cn&&(Xt.Authorization=`Bearer ${cn}`);const T=await fetch(ft,{method:"POST",credentials:"include",headers:Xt,body:JSON.stringify(gt),signal:H.signal});if(!T.ok||!T.body){let nn="";try{nn=(await T.text()).trim()}catch{nn=""}const ln=nn?` - ${nn.slice(0,300)}`:"";throw new Error(`Stream request failed: ${T.status}${ln}`)}const Q=T.body.getReader(),F=new TextDecoder("utf-8");let Yt="";for(;;){const{done:nn,value:ln}=await Q.read();if(nn)break;for(Yt+=F.decode(ln,{stream:!0});;){const sn=Yt.indexOf(`

`);if(sn===-1)break;const on=Yt.slice(0,sn);Yt=Yt.slice(sn+2);const an=on.split(`
`),un=[];for(const fn of an){const hn=fn.endsWith("\r")?fn.slice(0,-1):fn;if(!hn.startsWith("data:"))continue;let dn=hn.slice(5);dn.startsWith(" ")&&(dn=dn.slice(1)),un.push(dn)}if(un.length===0)continue;const pn=un.join(`
`);if(pn==="[DONE]")return v(),H=null,f.value=!1,u.value=!1,await R(),!0;pn.trim()!==""&&(u.value=!1),l.value+=pn,await R()}}return v(),H=null,f.value=!1,u.value=!1,await R(),!0}catch(Xt){return(Xt==null?void 0:Xt.name)!=="AbortError"&&(console.error("Stream error",Xt),!l.value&&_?a.value.push({id:`${Date.now()}-error`,role:"assistant",content:"Unable to respond right now. Try again later."}):v()),H=null,f.value=!1,u.value=!1,await R(),!1}},ce=()=>{$e(),d.value="",o("update:chatOpened",!1),o("close")};return watch(()=>[L.value,t.chatOpened],async([Y,i])=>{if(!i||!Y||typeof Y!="object")return;const w=JSON.stringify(Y);if(!w||w==="{}"||w===N.value||w===y.value)return;const z=f.value;await m(w,{showUserMessage:!1,clearInput:!1,showErrorMessage:!1,allowGuest:!0})?(N.value=w,y.value=""):z?y.value=w:y.value=""},{immediate:!0,deep:!0}),watch(()=>f.value,async Y=>{if(Y||!y.value)return;if(y.value===N.value){y.value="";return}const i=y.value;await m(i,{showUserMessage:!1,clearInput:!1,showErrorMessage:!1,allowGuest:!0})&&(N.value=i),y.value=""}),onBeforeUnmount(()=>{$e()}),(Y,i)=>{const w=resolveComponent("router-link");return t.chatOpened?(openBlock(),createElementBlock("section",{key:0,class:"fixed left-3 right-3 bottom-3 z-50 mx-auto flex h-[min(78vh,680px)] w-auto max-w-xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 dark:border-sky-800 dark:bg-slate-950 dark:shadow-black/30 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[520px]",role:"dialog","aria-label":"Nursedive AI Assistant","aria-busy":f.value},[createBaseVNode("header",_hoisted_2,[createBaseVNode("div",{class:"flex items-start justify-between gap-3"},[i[5]||(i[5]=createStaticVNode('<div class="flex min-w-0 items-center gap-3"><a href="/" class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-white/30" aria-label="Nursedive home"><img src="https://www.nursedive.com/images/favicon.png" class="h-7 w-7 object-contain" alt="Nursedive"></a><div class="min-w-0"><h2 class="truncate text-base font-semibold leading-5">Nursedive AI Assistant</h2></div></div>',1)),createBaseVNode("button",{type:"button",onClick:ce,class:"grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-300","aria-label":"Close chat"},i[4]||(i[4]=[createBaseVNode("i",{class:"pi pi-times text-sm"},null,-1)]))]),createBaseVNode("div",_hoisted_3,[f.value?createCommentVNode("",!0):(openBlock(),createElementBlock("label",_hoisted_4,[i[6]||(i[6]=createBaseVNode("span",null,"Deep Think",-1)),withDirectives(createBaseVNode("input",{id:"customSwitch1","onUpdate:modelValue":i[0]||(i[0]=z=>s.value=z),type:"checkbox",class:"peer sr-only"},null,512),[[vModelCheckbox,s.value]]),i[7]||(i[7]=createBaseVNode("span",{class:"relative h-5 w-9 rounded-full bg-white/25 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-teal-400 peer-checked:after:translate-x-4","aria-hidden":"true"},null,-1))])),i[10]||(i[10]=createBaseVNode("p",{class:"text-xs text-slate-200"}," AI can make mistakes. Please verify important information. ",-1)),ne.value?(openBlock(),createElementBlock("span",_hoisted_5,i[8]||(i[8]=[createBaseVNode("span",{class:"h-3 w-3 animate-spin rounded-full border-2 border-teal-100/40 border-t-teal-100","aria-hidden":"true"},null,-1),createTextVNode(" Thinking... ")]))):f.value?(openBlock(),createElementBlock("span",_hoisted_6,i[9]||(i[9]=[createBaseVNode("span",{class:"h-2 w-2 rounded-full bg-sky-200"},null,-1),createTextVNode(" Responding... ")]))):createCommentVNode("",!0)])]),createBaseVNode("div",{ref_key:"chatContainer",ref:k,class:"flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-900/95 sm:p-5"},[(openBlock(!0),createElementBlock(Fragment,null,renderList(a.value,z=>(openBlock(),createElementBlock("div",{key:z.id,class:normalizeClass(["flex w-full",z.role==="user"?"justify-end":"justify-start"])},[createBaseVNode("div",{class:normalizeClass(["max-w-[86%] px-4 py-3 shadow-sm ring-1",z.role==="user"?"rounded-2xl rounded-tr-sm bg-teal-600 text-white ring-teal-500/40":"rounded-2xl rounded-tl-sm bg-white text-slate-800 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700"])},[createBaseVNode("div",{class:normalizeClass(["mb-1 flex items-center gap-2 text-[11px] font-semibold tracking-wide",z.role==="user"?"text-teal-50":"text-slate-500 dark:text-slate-300"])},[createBaseVNode("span",{class:normalizeClass(["h-1.5 w-1.5 rounded-full",z.role==="user"?"bg-white/80":"bg-teal-500"])},null,2),createTextVNode(" "+toDisplayString(z.role==="user"?"You":"Nursedive AI"),1)],2),createBaseVNode("div",{class:"whitespace-pre-wrap break-words text-sm leading-relaxed [&_strong]:font-semibold",innerHTML:ae(z.content)},null,8,_hoisted_7)],2)],2))),128)),a.value.length===0&&!E.value?(openBlock(),createElementBlock("div",_hoisted_8,[i[11]||(i[11]=createBaseVNode("div",{class:"grid h-14 w-14 place-items-center rounded-2xl bg-white text-teal-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"},[createBaseVNode("i",{class:"pi pi-comments text-xl"})],-1)),i[12]||(i[12]=createBaseVNode("p",{class:"mt-3 text-sm font-medium text-slate-700 dark:text-slate-100"},"Start a chat with Nursedive AI tutor",-1)),yt.value?(openBlock(),createElementBlock("p",_hoisted_9," Ask about rationales, topics, or study strategy. ")):(openBlock(),createElementBlock("p",_hoisted_10," Open a question for an automatic explanation. Sign in to ask follow-up questions. "))])):createCommentVNode("",!0),u.value?(openBlock(),createElementBlock("div",_hoisted_11,i[13]||(i[13]=[createStaticVNode('<div class="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"><div class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"> AI Tutor </div><div class="flex items-center gap-1.5 py-1" aria-label="Loading response"><span class="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.3s]"></span><span class="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.15s]"></span><span class="h-2 w-2 animate-bounce rounded-full bg-teal-500"></span></div></div>',1)]))):createCommentVNode("",!0),l.value?(openBlock(),createElementBlock("div",_hoisted_12,[createBaseVNode("div",_hoisted_13,[i[14]||(i[14]=createBaseVNode("div",{class:"mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"},[createBaseVNode("span",{class:"h-1.5 w-1.5 rounded-full bg-teal-500"}),createTextVNode(" AI Tutor ")],-1)),createBaseVNode("div",{class:"whitespace-pre-wrap break-words text-sm leading-relaxed [&_strong]:font-semibold",innerHTML:ae(l.value)},null,8,_hoisted_14)])])):createCommentVNode("",!0)],512),createBaseVNode("footer",_hoisted_15,[yt.value?(openBlock(),createElementBlock("form",{key:1,onSubmit:i[3]||(i[3]=withModifiers(z=>m(),["prevent"])),class:"flex items-center gap-2 rounded-[1.5rem] bg-slate-100 p-2 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"},[withDirectives(createBaseVNode("input",{"onUpdate:modelValue":i[2]||(i[2]=z=>d.value=z),type:"text",class:"min-h-11 flex-1 rounded-full border-0 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white dark:placeholder:text-slate-500",placeholder:"Type your message",disabled:f.value},null,8,_hoisted_19),[[vModelText,d.value,void 0,{trim:!0}]]),createBaseVNode("button",{class:"grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-600 text-white shadow-sm shadow-teal-900/20 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:focus:ring-offset-slate-950",type:"submit",disabled:f.value||!d.value.trim(),"aria-label":"Send message"},i[19]||(i[19]=[createBaseVNode("i",{class:"pi pi-arrow-up text-sm"},null,-1)]),8,_hoisted_20)],32)):(openBlock(),createElementBlock("div",_hoisted_16,[createBaseVNode("div",_hoisted_17,[i[17]||(i[17]=createStaticVNode('<div class="flex items-start gap-3"><span class="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-sky-700 ring-1 ring-sky-100 dark:bg-slate-900 dark:text-sky-300 dark:ring-sky-900/80"><i class="pi pi-lock text-sm"></i></span><div class="min-w-0 flex-1"><p class="text-sm font-semibold">Sign in to keep chatting</p><p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400"> Guests can view the automatic question solution. Create an account or sign in to ask follow-up questions. </p></div></div>',1)),createBaseVNode("div",_hoisted_18,[createVNode(w,{to:"/register",class:"inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"},{default:withCtx(()=>i[15]||(i[15]=[createBaseVNode("i",{class:"pi pi-user-plus text-[11px]"},null,-1),createBaseVNode("span",null,"Create Account",-1)])),_:1,__:[15]}),createVNode(w,{to:"/login",class:"inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"},{default:withCtx(()=>i[16]||(i[16]=[createBaseVNode("i",{class:"pi pi-sign-in text-[11px]"},null,-1),createBaseVNode("span",null,"Sign In",-1)])),_:1,__:[16]})])]),createBaseVNode("form",{onSubmit:i[1]||(i[1]=withModifiers(()=>{},["prevent"])),class:"flex items-center gap-2 rounded-[1.5rem] bg-slate-100 p-2 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"},i[18]||(i[18]=[createBaseVNode("input",{type:"text",class:"min-h-11 flex-1 rounded-full border-0 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white dark:placeholder:text-slate-500",placeholder:"Sign in to ask follow-up questions",disabled:""},null,-1),createBaseVNode("button",{class:"grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-300 text-slate-500 shadow-none disabled:cursor-not-allowed dark:bg-slate-800 dark:text-slate-500",type:"submit",disabled:"","aria-label":"Sign in to send messages"},[createBaseVNode("i",{class:"pi pi-arrow-up text-sm"})],-1)]),32)]))])],8,_hoisted_1)):createCommentVNode("",!0)}}};export{QuestionRenderer as Q,_sfc_main$1 as _,_sfc_main$3 as a,_sfc_main$2 as b,_sfc_main as c};
