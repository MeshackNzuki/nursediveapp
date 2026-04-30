function m(o){o=Number(o);const t=Math.floor(o/3600),r=Math.floor(o%3600/60),h=Math.floor(o%60);return[t>0?t+"h":"",r>0?r+"m":"",h>0?h+"s":""].join(" ").trim()}export{m as s};
