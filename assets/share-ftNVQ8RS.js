var Ut=Object.defineProperty;var qt=(s,t,e)=>t in s?Ut(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var y=(s,t,e)=>qt(s,typeof t!="symbol"?t+"":t,e);function G(s){let t=s>>>0;const e=()=>{t=t+1831565813>>>0;let o=t;return o=Math.imul(o^o>>>15,o|1),o^=o+Math.imul(o^o>>>7,o|61),((o^o>>>14)>>>0)/4294967296};return{next:e,range:(o,r)=>o+(r-o)*e(),pick:o=>o[Math.floor(e()*o.length)]}}const g=s=>Math.round(s*100)/100;function A(s,t=1){const e=s.length;let o=`M${g(s[0][0])},${g(s[0][1])}`;for(let r=0;r<e;r++){const i=s[(r-1+e)%e],n=s[r],a=s[(r+1)%e],l=s[(r+2)%e],d=[n[0]+(a[0]-i[0])/6*t,n[1]+(a[1]-i[1])/6*t],h=[a[0]-(l[0]-n[0])/6*t,a[1]-(l[1]-n[1])/6*t];o+=` C${g(d[0])},${g(d[1])} ${g(h[0])},${g(h[1])} ${g(a[0])},${g(a[1])}`}return o+"Z"}function x(s){let t=`M${g(s[0][0])},${g(s[0][1])}`;for(let e=0;e<s.length-1;e++){const o=s[Math.max(e-1,0)],r=s[e],i=s[e+1],n=s[Math.min(e+2,s.length-1)];t+=` C${g(r[0]+(i[0]-o[0])/6)},${g(r[1]+(i[1]-o[1])/6)} ${g(i[0]-(n[0]-r[0])/6)},${g(i[1]-(n[1]-r[1])/6)} ${g(i[0])},${g(i[1])}`}return t}function q([s,t],e,[o,r]=[0,0]){const i=Math.cos(e),n=Math.sin(e);return[o+(s-o)*i-(t-r)*n,r+(s-o)*n+(t-r)*i]}function R(s,t,e,o=-Math.PI/2,r=5,i=.47){const n=[];for(let a=0;a<r*2;a++){const l=a%2?e*i:e,d=o+a*Math.PI/r;n.push([s+Math.cos(d)*l,t+Math.sin(d)*l])}return A(n,.22)}function yt(s,t,e){const o=e*.16;return`M${g(s)},${g(t-e)} Q${g(s+o)},${g(t-o)} ${g(s+e)},${g(t)} Q${g(s+o)},${g(t+o)} ${g(s)},${g(t+e)} Q${g(s-o)},${g(t+o)} ${g(s-e)},${g(t)} Q${g(s-o)},${g(t-o)} ${g(s)},${g(t-e)}Z`}function zt(s,t,e=.62,o=0,r=0){const i=t/2;return[[0,0],[i*.35,-s*.12],[i*.95+o*.3,-s*e*.82],[i*.8+o,-s*.93],[o*.6+(r?i*.18:0),-s+(r?s*.06:0)],[-i*.55+o*.4,-s*.95],[-i*.95+o*.1,-s*e*.8],[-i*.35,-s*.12]]}function j(s,t,e,o,r=1){return s.map(([i,n])=>{const[a,l]=q([i*r,n*r],o);return[a+t,l+e]})}function Ht(s,t,e,o,r){const n=[],a=[];let l=0;for(let d=0;d<=14;d++){const h=t+(e-t)*d/14;l+=r.range(-1.4,1.4);const f=o*r.range(.72,1.12);n.push([s+l-f/2+r.range(-1.2,1.2),h]),a.push([s+l+f/2+r.range(-1.2,1.2),h])}return A([...n,...a.reverse()],.6)}function W(s,t,e,o,r,i=10,n=.16){const a=[];for(let l=0;l<i;l++){const d=l/i*Math.PI*2,h=1+r.range(-n,n);a.push([s+Math.cos(d)*e*h,t+Math.sin(d)*o*h])}return A(a)}function z(s,t,e,o,r){const i=[[0,0],[o*.5,-e*.3],[o*.42,-e*.7],[0,-e],[-o*.42,-e*.68],[-o*.5,-e*.28]];return A(j(i,s,t,r),.9)}const Tt=s=>s.replace(/[<>&"']/g,t=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"})[t]),Wt=(s,t=.9,e=.85,o=7)=>`
<filter id="${s}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="${t}" numOctaves="3" seed="${o}" result="n"/>
  <feDiffuseLighting in="n" surfaceScale="${e}" diffuseConstant="1.16" lighting-color="#fff" result="l">
    <feDistantLight azimuth="235" elevation="58"/>
  </feDiffuseLighting>
  <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="${o+3}" result="m"/>
  <feColorMatrix in="m" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -0.9 0.5" result="mottle"/>
  <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="1.1" k2="0" k3="0" k4="0" result="t"/>
  <feComposite in="mottle" in2="t" operator="arithmetic" k2="0.07" k3="1" result="t2"/>
  <feComposite in="t2" in2="SourceAlpha" operator="in"/>
</filter>`,Zt=(s,t=3,e=3.2)=>`
<filter id="${s}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.03 0.05" numOctaves="3" seed="${t}" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="${e}" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.06 0.11" numOctaves="3" seed="${t+6}" result="c"/>
  <feDiffuseLighting in="c" surfaceScale="1.6" diffuseConstant="1.08" lighting-color="#fff" result="dl">
    <feDistantLight azimuth="225" elevation="48"/>
  </feDiffuseLighting>
  <feComposite in="d" in2="dl" operator="arithmetic" k1="1.22" result="shaded"/>
  <feSpecularLighting in="c" surfaceScale="1.9" specularConstant="0.95" specularExponent="20" lighting-color="#fff4d2" result="s">
    <feDistantLight azimuth="225" elevation="40"/>
  </feSpecularLighting>
  <feComposite in="s" in2="d" operator="in" result="si"/>
  <feComposite in="shaded" in2="si" operator="arithmetic" k2="1" k3="0.6" result="lit"/>
  <feComposite in="lit" in2="d" operator="in"/>
</filter>`,Xt=(s,t=4)=>`
<filter id="${s}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="${t}" result="g"/>
  <feDisplacementMap in="SourceGraphic" in2="g" scale="2.2" xChannelSelector="R" yChannelSelector="B" result="d"/>
  <feTurbulence type="fractalNoise" baseFrequency="1.7" numOctaves="1" seed="${t+2}" result="n1"/>
  <feColorMatrix in="n1" type="matrix" values="0 0 0 0 1  0 0 0 0 0.97  0 0 0 0 0.86  9 0 0 0 -5.6" result="bright"/>
  <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="${t+9}" result="n2"/>
  <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  7 0 0 0 -3.9" result="dark"/>
  <feComposite in="dark" in2="d" operator="in" result="darkIn"/>
  <feComposite in="bright" in2="d" operator="in" result="brightIn"/>
  <feTurbulence type="turbulence" baseFrequency="0.5" numOctaves="1" seed="${t+5}" result="b"/>
  <feSpecularLighting in="b" surfaceScale="1.4" specularConstant="0.6" specularExponent="26" lighting-color="#fff6dc" result="sp">
    <feDistantLight azimuth="225" elevation="45"/>
  </feSpecularLighting>
  <feComposite in="sp" in2="d" operator="in" result="spIn"/>
  <feMerge>
    <feMergeNode in="d"/>
    <feMergeNode in="darkIn"/>
    <feMergeNode in="spIn"/>
    <feMergeNode in="brightIn"/>
  </feMerge>
</filter>`,Yt=(s,t="#b23a5c",e=2,o=.42)=>`
<filter id="${s}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="${e}" result="n"/>
  <feColorMatrix in="n" type="saturate" values="0" result="g"/>
  <feComponentTransfer in="g" result="gm">
    <feFuncR type="linear" slope="0.42" intercept="0.74"/>
    <feFuncG type="linear" slope="0.42" intercept="0.74"/>
    <feFuncB type="linear" slope="0.42" intercept="0.74"/>
  </feComponentTransfer>
  <feBlend in="SourceGraphic" in2="gm" mode="multiply" result="m"/>
  <feComposite in="m" in2="SourceAlpha" operator="in" result="body"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="ab"/>
  <feComposite in="SourceAlpha" in2="ab" operator="arithmetic" k2="1" k3="-1" result="ring"/>
  <feFlood flood-color="${t}" flood-opacity="${o}"/>
  <feComposite in2="ring" operator="in" result="pool"/>
  <feMerge><feMergeNode in="body"/><feMergeNode in="pool"/></feMerge>
</filter>`,Qt=(s,t=1)=>`
<filter id="${s}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
  <feGaussianBlur in="SourceAlpha" stdDeviation="${1.1*t}"/>
  <feOffset dx="${.6*t}" dy="${1.4*t}" result="c"/>
  <feFlood flood-color="#2b1d12" flood-opacity="0.32"/>
  <feComposite in2="c" operator="in" result="contact"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="${4.5*t}"/>
  <feOffset dx="${2.5*t}" dy="${6*t}" result="cast"/>
  <feFlood flood-color="#2b1d12" flood-opacity="0.22"/>
  <feComposite in2="cast" operator="in" result="castC"/>
  <feMerge><feMergeNode in="castC"/><feMergeNode in="contact"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>`,_t=(s,t=1.6,e=.85,o=.3)=>`
<filter id="${s}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
  <feOffset in="SourceAlpha" dx="${t}" dy="${t}" result="o1"/>
  <feComposite in="SourceAlpha" in2="o1" operator="out" result="e1"/>
  <feGaussianBlur in="e1" stdDeviation="${t*.55}" result="b1"/>
  <feFlood flood-color="#fff" flood-opacity="${e}"/>
  <feComposite in2="b1" operator="in" result="hi"/>
  <feOffset in="SourceAlpha" dx="${-t}" dy="${-t}" result="o2"/>
  <feComposite in="SourceAlpha" in2="o2" operator="out" result="e2"/>
  <feGaussianBlur in="e2" stdDeviation="${t*.55}" result="b2"/>
  <feFlood flood-color="#000" flood-opacity="${o}"/>
  <feComposite in2="b2" operator="in" result="sh"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="${t}"/>
  <feOffset dx="${t*.7}" dy="${t}" result="c"/>
  <feComposite in="c" in2="SourceAlpha" operator="out" result="co"/>
  <feFlood flood-color="#000" flood-opacity="${o*.55}"/>
  <feComposite in2="co" operator="in" result="cast"/>
  <feMerge><feMergeNode in="cast"/><feMergeNode in="SourceGraphic"/><feMergeNode in="sh"/><feMergeNode in="hi"/></feMerge>
</filter>`,Kt=(s,t=1.4,e=.7,o=.34)=>`
<filter id="${s}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
  <feOffset in="SourceAlpha" dx="${t}" dy="${t}" result="o1"/>
  <feComposite in="SourceAlpha" in2="o1" operator="out" result="e1"/>
  <feGaussianBlur in="e1" stdDeviation="${t*.6}" result="b1"/>
  <feFlood flood-color="#000" flood-opacity="${o}"/>
  <feComposite in2="b1" operator="in" result="sh"/>
  <feOffset in="SourceAlpha" dx="${-t}" dy="${-t}" result="o2"/>
  <feComposite in="SourceAlpha" in2="o2" operator="out" result="e2"/>
  <feGaussianBlur in="e2" stdDeviation="${t*.6}" result="b2"/>
  <feFlood flood-color="#fff" flood-opacity="${e}"/>
  <feComposite in2="b2" operator="in" result="hi"/>
  <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="sh"/><feMergeNode in="hi"/></feMerge>
</filter>`,Jt=(s,t="gold")=>{const e={gold:["#7d5a1c","#d9b25a","#a97b26","#f3d98d","#b98a32","#ecd08a","#8c661f"],rose:["#8a4d45","#e3a796","#b06e61","#f6cfc2","#c08274","#f0bfb0","#93574c"],silver:["#6f747c","#d9dde3","#9aa0a8","#f5f7fa","#a9afb7","#e6e9ee","#7b8189"]}[t];return`<linearGradient id="${s}" x1="0" y1="0" x2="1" y2="1">${e.map((o,r)=>`<stop offset="${(r/(e.length-1)).toFixed(3)}" stop-color="${o}"/>`).join("")}</linearGradient>`};function b(s,t){const e=[];return t.paper&&e.push(Wt(`${s}-paper`,t.paper.grain,t.paper.relief,t.paper.seed)),t.gold&&e.push(Jt(`${s}-gold`,t.gold)),t.leaf&&e.push(Zt(`${s}-leaf`)),t.glitter!==void 0&&e.push(Xt(`${s}-gl`,t.glitter)),t.wc&&e.push(Yt(`${s}-wc`,t.wc)),t.lift&&e.push(Qt(`${s}-lift`,t.lift)),t.emboss&&e.push(_t(`${s}-emb`,t.emboss.depth,t.emboss.light,t.emboss.dark)),t.deboss&&e.push(Kt(`${s}-deb`,t.deboss.depth,t.deboss.light,t.deboss.dark)),`<defs>${e.join("")}</defs>`}const pt=(s,t,e)=>`<clipPath id="${s}-card"><rect x="0" y="0" width="${t}" height="${e}"/></clipPath>`,vt=(s,t,e,o)=>`<rect x="0" y="0" width="${t}" height="${e}" fill="${o}" filter="url(#${s}-paper)"/>`;function Et(s,t,e){const o=s.trim().split(/\s+/).filter(Boolean),r=[];let i="";for(const n of o){const a=i?`${i} ${n}`:n;a.length>t&&i?(r.push(i),i=n):i=a}if(i&&r.push(i),r.length>e){const n=r.slice(0,e-1);return n.push(r.slice(e-1).join(" ")),n}return r}const P=520,B=520;function Vt(s,t,e,o){const r=[];for(let i=0;i<=12;i++){const n=-20+i*(P+40)/12;r.push([n,s+Math.sin(i/12*Math.PI*e+o)*t+Math.sin(i*1.7+o)*t*.25])}return`${x(r)} L${P+20},${B+20} L-20,${B+20}Z`}function wt(s,t,e){const o=(i,n)=>`${(s+i*e).toFixed(1)},${(t+n*e).toFixed(1)}`,r=(i,n)=>`M${o(i,-46)} L${o(i+4,-46)} L${o(i+3.2+n,0)} L${o(i+.6+n,0)}Z`;return[`M${o(-2,-50)} C${o(4,-64)} ${o(36,-66)} ${o(50,-56)} C${o(54,-48)} ${o(46,-40)} ${o(38,-42)} L${o(6,-42)} C${o(0,-42)} ${o(-4,-46)} ${o(-2,-50)}Z`,r(2,-2),r(9,1),r(36,1),r(42,3),`M${o(-1,-50)} L${o(9,-57)} L${o(-6,-112)} L${o(-13,-110)}Z`,`M${o(-13,-108)} C${o(-16,-116)} ${o(-6,-118)} ${o(-4,-113)} L${o(-20,-103)} C${o(-24,-103)} ${o(-24,-107)} ${o(-21,-108)}Z`,`M${o(-9,-116)} L${o(-8,-122)} L${o(-6.6,-122)} L${o(-7,-115)}Z`,`M${o(49,-55)} L${o(55,-30)} L${o(53,-30)} L${o(47,-52)}Z`].join(" ")}function Rt(s,t,e,o){const r=G(o),i=x([[s,t],[s+4*e,t-60*e],[s+2*e,t-110*e]]),n=[x([[s+2*e,t-100*e],[s-40*e,t-140*e],[s-78*e,t-158*e]]),x([[s+3*e,t-100*e],[s+44*e,t-138*e],[s+86*e,t-160*e]]),x([[s+2*e,t-108*e],[s+6*e,t-140*e],[s-4*e,t-166*e]])],a=[W(s,t-170*e,120*e,20*e,r,12,.12),W(s-70*e,t-160*e,60*e,14*e,r,10,.15),W(s+74*e,t-162*e,66*e,15*e,r,10,.15),W(s+6*e,t-186*e,80*e,13*e,r,10,.15)];return{trunk:i,branches:n,canopy:a}}const te={id:"acacia",name:"Acacia dusk",blurb:"Layered paper savannah, gold leaf sun, giraffes at sunset",w:P,h:B,bleed:30,defaultMessage:"However far apart we are, we still share the same sunset.",hand:"caveat",inside:"#3a2238",insert:"#fbf6ee",ink:"#2d1b2c",envelope:{body:"#ecc7b2",liner:"#3a2238",seal:"#b4486c",ink:"#3a2238"},cover({uid:s}){const t=`${s}a`,e=G(17),o=[];for(let f=0;f<11;f++)o.push(yt(e.range(30,300),e.range(26,150),e.range(3,7.5)));const r='<circle cx="352" cy="232" r="64"/>',i=[[262,150,1],[286,136,.8],[300,162,.7]].map(([f,u,c])=>`<path d="M${f-9*c},${u-3*c} Q${f-4*c},${u-6*c} ${f},${u} Q${f+4*c},${u-6*c} ${f+9*c},${u-3*c}"/>`).join(""),n={depth:0,art:`${b(t,{paper:{relief:.7},gold:"gold",leaf:!0,glitter:12})}
        <defs>
          <linearGradient id="${t}-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#f4b56c"/><stop offset="0.5" stop-color="#ec8460"/><stop offset="1" stop-color="#bb4d69"/>
          </linearGradient>
        </defs>
        <rect width="${P}" height="${B}" fill="url(#${t}-sky)" filter="url(#${t}-paper)"/>
        <g fill="url(#${t}-gold)" filter="url(#${t}-leaf)">${r}</g>
        <g fill="#fdf1dc" filter="url(#${t}-gl)">${o.map(f=>`<path d="${f}"/>`).join("")}</g>
        <g fill="none" stroke="#5a2b47" stroke-width="2.2" stroke-linecap="round">${i}</g>`,sheen:r,sheenTone:"#fff2c4",glitter:o.map(f=>`<path d="${f}"/>`).join("")},a=(f,u,c,p,$,v,S,m="",w=.8)=>{const k=`${s}${f}`;return{depth:u,art:`${b(k,{paper:{relief:.6,seed:u},lift:w})}<defs>${pt(k,P,B)}</defs>
          <g clip-path="url(#${k}-card)"><g filter="url(#${k}-lift)">
            <g fill="${S}" filter="url(#${k}-paper)"><path d="${Vt(c,p,$,v)}"/>${m}</g>
          </g></g>`}},l=Rt(150,470,1,5),d=`<path d="${l.trunk}" fill="none" stroke="#2b1730" stroke-width="11" stroke-linecap="round"/>
      ${l.branches.map(f=>`<path d="${f}" fill="none" stroke="#2b1730" stroke-width="6.5" stroke-linecap="round"/>`).join("")}
      ${l.canopy.map(f=>`<path d="${f}"/>`).join("")}`,h=Array.from({length:18},(f,u)=>{const c=20+u*29+u*37%11,p=452+Math.sin(u)*5;return`<path d="M${c},${p+8} q-3,-14 -7,-18 M${c},${p+8} q1,-16 3,-22 M${c},${p+8} q4,-12 9,-15" fill="none" stroke="#2b1730" stroke-width="1.8" stroke-linecap="round"/>`}).join("");return[n,a("b",7,352,16,2.2,.4,"#d77273"),a("c",15,404,14,1.6,2.2,"#8f3d62",`<path d="${wt(372,400,.95)}"/><path d="${wt(424,404,.72)}"/>`,1),{...a("d",27,452,9,1.3,1.1,"#2b1730",`${d}${h}`,1.4)}]},insideLeft({uid:s}){const t=`${s}i`,e=G(44),o=[];for(let i=0;i<16;i++){const n=e.range(40,P-40),a=e.range(40,B-40);o.push(i%3?yt(n,a,e.range(3,7)):R(n,a,e.range(4,7)))}const r='<path d="M150,140 a46,46 0 1,0 52,58 a38,38 0 1,1 -52,-58Z"/>';return[{depth:0,art:`${b(t,{paper:{relief:.5}})}<rect width="${P}" height="${B}" fill="${this.inside}" filter="url(#${t}-paper)"/>`},{depth:3,art:`${b(`${t}s`,{gold:"silver",glitter:3})}
          <g fill="url(#${t}s-gold)" filter="url(#${t}s-gl)">${o.map(i=>`<path d="${i}"/>`).join("")}${r}</g>`,glitter:o.map(i=>`<path d="${i}"/>`).join("")+r,sheen:r,sheenTone:"#ffffff"}]},accent({uid:s}){return`${b(`${s}x`,{gold:"gold",leaf:!0})}
      <circle cx="30" cy="30" r="12" fill="url(#${s}x-gold)" filter="url(#${s}x-leaf)"/>`}},ee={throat:"#f4bb3a",mid:"#fde6e4",body:"#f6a7b8",edge:"#e0628a",vein:"#c94672"};function tt(s,t,e,o,r,i,n=!0){const a=`${s}-fg${Math.round(t)}x${Math.round(e)}`,l=[],d=[],h=[];for(let p=0;p<5;p++){const $=r+p*Math.PI*2/5,v=[t+Math.cos($-Math.PI/2)*o*.04,e+Math.sin($-Math.PI/2)*o*.04],S=j(zt(o,o*.66,.72,o*.2),v[0],v[1],$+.16);l.push(A(S,.95));const m=[[o*.02,-o*.12],[o*.1,-o*.42],[o*.17,-o*.68],[o*.19,-o*.8]];d.push(x(j(m,v[0],v[1],$+.16)));const[w,k]=j([[-o*.36,-o*.55],[o*.4,-o*.62]],v[0],v[1],$+.16);h.push(`<linearGradient id="${a}t${p}" gradientUnits="userSpaceOnUse" x1="${w[0].toFixed(1)}" y1="${w[1].toFixed(1)}" x2="${k[0].toFixed(1)}" y2="${k[1].toFixed(1)}">
      <stop offset="0" stop-color="${i.vein}" stop-opacity="0.28"/>
      <stop offset="0.45" stop-color="${i.vein}" stop-opacity="0"/>
      <stop offset="0.7" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0.32"/>
    </linearGradient>`)}const f=`
  <defs>
    <radialGradient id="${a}" gradientUnits="userSpaceOnUse" cx="${t}" cy="${e}" r="${o}">
      <stop offset="0" stop-color="${i.throat}"/>
      <stop offset="0.17" stop-color="${i.throat}" stop-opacity="0.9"/>
      <stop offset="0.36" stop-color="${i.mid}"/>
      <stop offset="0.72" stop-color="${i.body}"/>
      <stop offset="1" stop-color="${i.edge}"/>
    </radialGradient>
    ${h.join("")}
  </defs>
  <g filter="url(#${s}-wc)">
    ${l.map((p,$)=>`<path d="${p}" fill="url(#${a})" stroke="${i.vein}" stroke-opacity="0.18" stroke-width="${(o/40).toFixed(2)}"/><path d="${p}" fill="url(#${a}t${$})"/>`).join("")}
  </g>
  <g fill="none" stroke="${i.vein}" stroke-opacity="0.38" stroke-width="${(o/70).toFixed(2)}" stroke-linecap="round">
    ${d.map(p=>`<path d="${p}"/>`).join("")}
  </g>
  ${n?`<g fill="none" stroke="url(#${s}-gold)" stroke-width="${(o/60).toFixed(2)}" stroke-linejoin="round">${l.map(p=>`<path d="${p}"/>`).join("")}</g>`:""}
  <circle cx="${t}" cy="${e}" r="${(o*.07).toFixed(1)}" fill="${i.throat}" opacity="0.9"/>`,u=l.map(p=>`<path d="${p}" fill="none" stroke-width="${(o/45).toFixed(2)}"/>`).join(""),c=l.map(p=>`<path d="${p}"/>`).join("");return{art:f,outline:u,silhouette:c}}function oe(s,t){const e=[[0,0]],o=.74,r=9,i=t.range(0,3);for(let n=0;n<=r;n++){const a=-o+2*o*n/r,l=(.78+.2*Math.cos(a*1.6))*(1+.045*Math.sin(n*1.3+i))+t.range(-.015,.015);e.push([Math.sin(a)*s*l,-Math.cos(a)*s*l])}return e}function Z(s,t,e,o,r,i){const n=G(i),a=`${s}-hb${i}`,l=[];for(let m=0;m<5;m++){const w=r+m*Math.PI*2/5+n.range(-.08,.08);l.push(A(j(oe(o*n.range(.92,1.04),n),t,e,w),.9))}const d=r+n.range(-.6,.6),h=q([t,e-o*.78],d,[t,e]),f=q([t+o*.08,e-o*.4],d,[t,e]),u=x([[t,e],f,h]),c=[];for(let m=0;m<9;m++){const w=m/9*Math.PI*2;c.push(`<circle cx="${(h[0]+Math.cos(w)*o*.07).toFixed(1)}" cy="${(h[1]+Math.sin(w)*o*.07).toFixed(1)}" r="${(o*.035).toFixed(1)}"/>`)}const p=l.map((m,w)=>{const k=r+w*Math.PI*2/5,ot=q([t,e-o*.7],k,[t,e]),st=q([t+o*.05,e-o*.35],k,[t,e]);return`<path d="${x([[t,e],st,ot])}"/>`}).join(""),$=`
  <defs>
    <radialGradient id="${a}" gradientUnits="userSpaceOnUse" cx="${t}" cy="${e}" r="${o}">
      <stop offset="0" stop-color="#8e1240"/>
      <stop offset="0.2" stop-color="#c22a5e"/>
      <stop offset="0.48" stop-color="#f287a6"/>
      <stop offset="0.86" stop-color="#f9c3d2"/>
      <stop offset="1" stop-color="#f3a1b9"/>
    </radialGradient>
  </defs>
  <g filter="url(#${s}-wc)">${l.map(m=>`<path d="${m}" fill="url(#${a})"/>`).join("")}</g>
  <g fill="none" stroke="#a3204f" stroke-opacity="0.3" stroke-width="${(o/55).toFixed(2)}" stroke-linecap="round">${p}</g>
  <path d="${u}" fill="none" stroke="#e9a33a" stroke-width="${(o/16).toFixed(1)}" stroke-linecap="round"/>`,v=l.map(m=>`<path d="${m}" fill="none" stroke-width="${(o/22).toFixed(1)}"/>`).join(""),S=`
    <g fill="none" stroke="#f8c1d0" stroke-width="${(o/22).toFixed(1)}" stroke-linejoin="round" filter="url(#${s}-gl)">
      ${l.map(m=>`<path d="${m}"/>`).join("")}
    </g>
    <g fill="#f2c45c" filter="url(#${s}-gl)">${c.join("")}</g>`;return{art:$,outline:l.map(m=>`<path d="${m}" fill="none" stroke-width="${(o/40).toFixed(2)}"/>`).join(""),silhouette:l.map(m=>`<path d="${m}"/>`).join(""),glitter:v+`<g>${c.join("")}</g>`,glitterArt:S}}function at(s,t,e,o){const r=A(j([[0,0],[e*.24,-e*.3],[e*.16,-e*.78],[0,-e],[-e*.16,-e*.76],[-e*.24,-e*.28]],s,t,o)),i=A(j([[0,e*.08],[e*.28,-e*.1],[e*.14,-e*.38],[e*.05,-e*.2],[-e*.06,-e*.42],[-e*.16,-e*.18],[-e*.28,-e*.1]],s,t,o));return{body:r,calyx:i}}const N=520,O=520,se="#f1e3c1",kt="#3c6f6b";function xt(s,t,e){const o=G(s),r=[];let i=0;for(;r.length<t&&i++<500;){const n=o.range(40,N-40),a=o.range(40,O-40),l=o.range(11,21);e.some(([d,h,f])=>Math.hypot(d-n,h-a)<f+l)||r.some(d=>Math.hypot(d.x-n,d.y-a)<d.s+l+22)||r.push({x:n,y:a,s:l,a:o.range(-.5,.5)})}return r}const re={id:"frangipani",name:"Frangipani",blurb:"Gold leaf stripes, glitter stars, raised frangipani",w:N,h:O,bleed:96,defaultMessage:"You make ordinary days feel like a garden in full bloom.",hand:"caveat",inside:"#ead9b3",insert:"#fbf7ef",ink:"#2b2622",envelope:{body:"#efe2c3",liner:"#d9b25a",seal:"#b23a5c",ink:"#3a2c22"},cover({uid:s}){const t=G(11),e=[];for(let c=0;c<10;c++)e.push(Ht(30+c*51+t.range(-6,6),-4,O+4,t.range(13,21),t));const o=`${s}a`,r={depth:0,art:`${b(o,{paper:{},gold:"gold",leaf:!0})}
        <defs>${pt(o,N,O)}</defs>
        ${vt(o,N,O,se)}
        <g clip-path="url(#${o}-card)" fill="url(#${o}-gold)" filter="url(#${o}-leaf)">
          ${e.map(c=>`<path d="${c}"/>`).join("")}
        </g>`,sheen:`<g clip-path="url(#${o}-card)">${e.map(c=>`<path d="${c}"/>`).join("")}</g>`,sheenTone:"#fff4cc"},i=[[420,104,128,.35],[104,418,138,-.5]],n=xt(5,15,i.map(([c,p,$])=>[c,p,$*.92])),a=`${s}b`,l=n.map(c=>R(c.x,c.y,c.s,-Math.PI/2+c.a)),d={depth:7,art:`${b(a,{gold:"gold",glitter:4,lift:.5})}
        <g filter="url(#${a}-lift)">
          <g fill="${kt}" stroke="${kt}" stroke-width="7" stroke-linejoin="round">${l.map(c=>`<path d="${c}"/>`).join("")}</g>
          <g fill="url(#${a}-gold)" filter="url(#${a}-gl)">${l.map(c=>`<path d="${c}"/>`).join("")}</g>
        </g>`,glitter:l.map(c=>`<path d="${c}"/>`).join("")},h=`${s}c`,f=i.map(([c,p,$,v])=>tt(h,c,p,$,v,ee)),u={depth:26,overhang:!0,art:`${b(h,{gold:"gold",wc:"#c94672",lift:1.4})}
        <g filter="url(#${h}-lift)">${f.map(c=>`<g>${c.art}</g>`).join("")}</g>`,sheen:f.map(c=>c.outline).join(""),sheenTone:"#fff1d6"};return[r,d,u]},insideLeft({uid:s}){const t=`${s}i`,o=xt(21,6,[[N/2,O/2,40]]).map(r=>R(r.x,r.y,r.s*1.1,-Math.PI/2+r.a));return[{depth:0,art:`${b(t,{paper:{relief:.55}})}${vt(t,N,O,this.inside)}`},{depth:3,art:`${b(`${t}s`,{gold:"gold",glitter:8,lift:.4})}
          <g fill="url(#${t}s-gold)" filter="url(#${t}s-gl)">${o.map(r=>`<path d="${r}"/>`).join("")}</g>`,glitter:o.map(r=>`<path d="${r}"/>`).join("")}]},accent({uid:s}){return`${b(`${s}x`,{gold:"gold",glitter:2})}
      <path d="${R(30,30,13)}" fill="url(#${s}x-gold)" filter="url(#${s}x-gl)"/>`}},X=460,Y=600,ie="#b5132f",ne=s=>`
<filter id="${s}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="4" seed="31" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.02  0 0 0 0 0.1  0 0 0 -2.2 1.25" result="dark"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="8" result="g"/>
  <feDiffuseLighting in="g" surfaceScale="1" diffuseConstant="1.14" lighting-color="#fff" result="l">
    <feDistantLight azimuth="235" elevation="58"/>
  </feDiffuseLighting>
  <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="1.1" result="t"/>
  <feComposite in="dark" in2="t" operator="atop" result="w"/>
  <feComposite in="w" in2="SourceAlpha" operator="in"/>
</filter>`,ae=[[236,690],[244,560],[232,430],[250,300],[262,170],[252,40]],le=[[[240,470],[190,420],[150,345]],[[248,340],[300,300],[352,255]],[[258,210],[210,170],[130,128]],[[244,560],[300,520],[352,405]],[[238,600],[180,600],[160,560]]],ce=[[238,520,62,30,.9],[246,395,58,28,-.95],[256,250,54,26,1],[254,120,50,24,-.8],[300,520,46,22,-1.4],[190,420,44,22,1.5]],fe={id:"hibiscus",name:"Hibiscus",blurb:"Painted red card, glitter edged hibiscus that spill off the edge",w:X,h:Y,bleed:90,defaultMessage:"Some people feel like sunshine. You are one of them.",hand:"caveat",inside:"#efe9e7",insert:"#fbf8f4",ink:"#3b1d22",envelope:{body:"#f4ece9",liner:"#b5132f",seal:"#8e1240",ink:"#5a1626"},cover({uid:s}){const t=`${s}a`,e={depth:0,art:`<defs>${ne(`${t}-wash`)}</defs>
        <rect width="${X}" height="${Y}" fill="${ie}" filter="url(#${t}-wash)"/>`},o=`${s}b`,r=x(ae),i=le.map(c=>x(c)),n=ce.map(([c,p,$,v,S])=>z(c,p,$,v,S)),a={depth:12,overhang:!0,art:`${b(o,{lift:.8,glitter:14})}
        <defs>
          <linearGradient id="${o}-lf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#4fae55"/><stop offset="1" stop-color="#1f6b31"/>
          </linearGradient>
        </defs>
        <g filter="url(#${o}-lift)" stroke-linecap="round" fill="none">
          <path d="${r}" stroke="#1d6a30" stroke-width="15"/>
          <path d="${r}" stroke="#3c9a47" stroke-width="10"/>
          ${i.map(c=>`<path d="${c}" stroke="#1d6a30" stroke-width="9"/><path d="${c}" stroke="#3c9a47" stroke-width="5.5"/>`).join("")}
          <g fill="url(#${o}-lf)" stroke="#9fd38f" stroke-width="1.6">
            ${n.map(c=>`<path d="${c}"/>`).join("")}
          </g>
        </g>`},l=`${s}c`,h=[[128,112,84,.2],[404,236,88,-.3],[86,366,92,.6],[372,430,76,.1],[150,574,86,-.4]].map(([c,p,$,v],S)=>Z(l,c,p,$,v,40+S)),f=[at(300,300,54,.5),at(352,520,50,-.2),at(262,40,46,.1)],u={depth:26,overhang:!0,art:`${b(l,{wc:"#8e1240",lift:1.4,glitter:6})}
        <g filter="url(#${l}-lift)">
          ${f.map(c=>`<path d="${c.body}" fill="#e2577f" stroke="#f6b3c6" stroke-width="2.5"/><path d="${c.calyx}" fill="#2f8a3f" stroke="#1d6a30" stroke-width="1.2"/>`).join("")}
          ${h.map(c=>`<g>${c.art}${c.glitterArt}</g>`).join("")}
        </g>`,glitter:h.map(c=>c.glitter).join("")};return[e,a,u]},insideLeft({uid:s}){const t=`${s}i`,e=Z(t,220,210,92,.3,77),o=Z(t,120,420,56,-.4,78);return[{depth:0,art:`${b(t,{paper:{relief:.5}})}<rect width="${X}" height="${Y}" fill="${this.inside}" filter="url(#${t}-paper)"/>`},{depth:2,art:`${b(`${t}g`,{glitter:18})}${pt(`${t}g`,X,Y)}
          <g fill="none" stroke="#b5132f" stroke-width="5" stroke-linejoin="round" filter="url(#${t}g-gl)">${e.silhouette}${o.silhouette}</g>
          <g fill="none" stroke="#e27a96" stroke-width="2" stroke-linejoin="round">${e.silhouette}${o.silhouette}</g>`,glitter:`<g fill="none" stroke-width="5">${e.silhouette}${o.silhouette}</g>`}]},accent({uid:s}){return`<g fill="none" stroke="#c22a5e" stroke-width="2" stroke-linejoin="round">${Z(`${s}x`,30,32,22,.2,90).silhouette}</g>`}},M=440,C=600,Q="#1c1a19",_="#e2a52b",lt="#15888a",K="#f6eedd",L=34,Ot=[[0,46],[26,32],[34,6],[24,-22],[6,-40],[-10,-52],[-5,-38],[-7,-22],[-22,-4],[-30,20],[-22,40]],F=(s,t,e,o)=>A(j(Ot,s,t,o,e/50),1);function de(s,t,e,o,r,i){const n=[],a=j(Ot,s,t,o,e/50*1.16);for(let l=0;l<r;l++){const d=l/r*a.length,h=Math.floor(d)%a.length,f=(h+1)%a.length,u=d-Math.floor(d),c=a[h][0]+(a[f][0]-a[h][0])*u,p=a[h][1]+(a[f][1]-a[h][1])*u;n.push(`<circle cx="${c.toFixed(1)}" cy="${p.toFixed(1)}" r="${i}"/>`)}return n.join("")}function he(){const s=[],t=[],e=L/2,o=(r,i,n,a,l)=>{const d=Math.hypot(n-r,a-i),h=Math.round(d/l);for(let f=0;f<=h;f++){const u=r+(n-r)*f/h,c=i+(a-i)*f/h;f%2===0?s.push(`M${u},${c-9} L${u+7},${c} L${u},${c+9} L${u-7},${c}Z`):t.push(`<circle cx="${u.toFixed(1)}" cy="${c.toFixed(1)}" r="3"/>`)}};return o(e,e,M-e,e,20),o(M-e,e,M-e,C-e,20),o(M-e,C-e,e,C-e,20),o(e,C-e,e,e,20),{diamonds:s.join(" "),dots:t.join("")}}function pe(s){const t=Et(s,22,2),e=t.length>1||t[0].length>16?19:23,o=474;return t.map((r,i)=>`<text x="${M/2}" y="${o+(i-(t.length-1)/2)*(e+6)+e*.35}" text-anchor="middle" font-family="Marcellus, serif" font-size="${e}" letter-spacing="${(e*.12).toFixed(1)}">${Tt(r.toUpperCase())}</text>`).join("")}const ue={id:"kanga",name:"Kanga",blurb:"A kanga print with its saying in foil, korosho pressed in gold",w:M,h:C,bleed:30,coverText:{default:"Mapenzi ni kikohozi",max:40,label:"The kanga saying"},defaultMessage:"Some things cannot be hidden. The way I feel about you is one of them.",hand:"caveat",inside:"#e9efe9",insert:"#fbf8f1",ink:"#1c2a2a",envelope:{body:"#f1e7d2",liner:lt,seal:"#b8862a",ink:"#1c2a2a"},cover({uid:s,cover:t}){const e=`${s}a`,o=he(),r=F(222,248,118,.32),i=F(222,248,72,.32),n=[F(104,130,46,-.5),F(340,364,46,2.6),F(348,112,34,.9),F(96,370,34,-2.2)],a=pe(t||" "),l=`<rect x="${L}" y="${L}" width="${M-L*2}" height="${C-L*2}"/>`,d=`<rect x="64" y="440" width="${M-128}" height="68" rx="3"/>`;return[{depth:0,art:`${b(e,{paper:{relief:.7,seed:41},gold:"gold",emboss:{depth:1.2,light:.55,dark:.35},deboss:{depth:1}})}
          <g filter="url(#${e}-paper)">
            <rect width="${M}" height="${C}" fill="${Q}"/>
            <g fill="${lt}">${l}</g>
            <g fill="${K}"><path d="${r}"/></g>
            <g fill="${_}"><path d="${i}"/></g>
            <g fill="${Q}">${de(222,248,118,.32,34,3.6)}</g>
            <g fill="${Q}"><circle cx="222" cy="262" r="14"/></g>
            <g fill="${K}">${n.map(h=>`<path d="${h}"/>`).join("")}</g>
            <g fill="${K}">${d}</g>
          </g>
          <g filter="url(#${e}-emb)"><path d="${o.diamonds}" fill="${_}"/><g fill="${K}">${o.dots}</g></g>
          <g fill="none" stroke="${_}" stroke-width="2"><rect x="${L+5}" y="${L+5}" width="${M-L*2-10}" height="${C-L*2-10}"/></g>
          <g fill="none" stroke="url(#${e}-gold)" stroke-width="2.6"><path d="${r}"/>${n.map(h=>`<path d="${h}"/>`).join("")}<path d="${i}"/></g>
          <g filter="url(#${e}-deb)" fill="${Q}">${a}</g>`,sheen:`<g fill="none" stroke-width="3"><path d="${r}"/>${n.map(h=>`<path d="${h}"/>`).join("")}<path d="${i}"/></g><path d="${o.diamonds}"/>`,sheenTone:"#fff0c2"}]},insideLeft({uid:s}){const t=`${s}i`,e=[];for(let o=70;o<C;o+=120)for(let r=70;r<M;r+=110){const i=Math.round(o/120)%2*55;e.push(`<path d="${F(r+i-20,o,22,(r+o)%7*.4)}"/>`)}return[{depth:0,art:`${b(t,{paper:{relief:.5},deboss:{depth:1,light:.8,dark:.22}})}
          <rect width="${M}" height="${C}" fill="${this.inside}" filter="url(#${t}-paper)"/>
          <g filter="url(#${t}-deb)" fill="${this.inside}">${e.join("")}</g>`}]},accent(){return`<path d="${F(30,32,18,.3)}" fill="${lt}"/><path d="${F(30,32,10,.3)}" fill="${_}"/>`}},I=440,H=600,Mt="#f5f2ec",ct={throat:"#efb447",mid:"#fdf0ec",body:"#f4b8c3",edge:"#df7d96",vein:"#c75a7a"},St=[[212,178,112,.1],[326,282,72,-.6],[110,290,64,.8]],$e=x([[210,186],[226,300],[218,392]]),ge=[x([[224,300],[276,290],[326,282]]),x([[220,330],[166,318],[110,290]])],me=[z(220,384,84,30,2.6),z(222,372,76,28,-2.5),z(228,322,60,22,2.2),z(214,336,54,20,-2.1)];function be(s){const t=Et(s.toUpperCase(),16,2),e=t.some(r=>r.length>13)?24:29,o=H-104-(t.length-1)*(e+10);return t.map((r,i)=>`<text x="${I/2}" y="${o+i*(e+12)}" text-anchor="middle" font-family="Marcellus, serif" font-size="${e}" letter-spacing="${(e*.22).toFixed(1)}">${Tt(r)}</text>`).join("")}const ye={id:"letterpress",name:"Letterpress",blurb:"Cotton card, painted frangipani spray, gold foil words pressed in",w:I,h:H,bleed:40,coverText:{default:"Happy birthday",max:32,label:"Words on the cover"},defaultMessage:"For all the quiet ways you make life lovely.",hand:"pinyon",inside:"#ebe7e1",insert:"#fbf9f5",ink:"#33302c",envelope:{body:"#f2efe9",liner:"#e2c27c",seal:"#9c7a3c",ink:"#3a352f"},cover({uid:s,cover:t}){const e=`${s}a`,o=St.map(([n,a,l,d])=>tt(e,n,a,l,d,ct,!1)),r=be(t||" "),i=`<rect x="22" y="22" width="${I-44}" height="${H-44}" rx="2" fill="none" stroke="#000" stroke-width="2.2"/>`;return[{depth:0,art:`${b(e,{paper:{grain:.75,relief:1.1,seed:19},gold:"gold",wc:"#c75a7a",deboss:{depth:1.3},leaf:!0})}
          <rect width="${I}" height="${H}" fill="${Mt}" filter="url(#${e}-paper)"/>
          <g filter="url(#${e}-deb)">${i.replace('stroke="#000"',`stroke="${Mt}"`)}</g>
          <g opacity="0.92">
            <g fill="none" stroke="#6f8f5a" stroke-width="3.2" stroke-linecap="round">
              <path d="${$e}"/>${ge.map(n=>`<path d="${n}"/>`).join("")}
            </g>
            <g fill="#8fae78" opacity="0.85">${me.map(n=>`<path d="${n}"/>`).join("")}</g>
            ${o.map(n=>n.art).join("")}
          </g>
          <g fill="none" stroke="url(#${e}-gold)" stroke-width="1.3">${o.map(n=>n.silhouette).join("")}</g>
          <g filter="url(#${e}-deb)"><g fill="#d9b25a">${r}</g></g>
          <g fill="url(#${e}-gold)">${r}</g>`,sheen:`<g>${r}</g><g fill="none" stroke-width="1.6">${o.map(n=>n.silhouette).join("")}</g>`,sheenTone:"#fff3cf"}]},insideLeft({uid:s}){const t=`${s}i`,e=St.map(([o,r,i,n])=>tt(t,I-o,r,i,-n,ct,!1));return[{depth:0,art:`${b(t,{paper:{grain:.75,relief:.6,seed:23},emboss:{depth:1.1,light:.75,dark:.18}})}
          <rect width="${I}" height="${H}" fill="${this.inside}" filter="url(#${t}-paper)"/>
          <g filter="url(#${t}-emb)"><g fill="none" stroke="${this.inside}" stroke-width="2.4">${e.map(o=>o.silhouette).join("")}</g></g>
          <g fill="none" stroke="#d08aa0" stroke-opacity="0.5" stroke-width="1">${e.map(o=>o.silhouette).join("")}</g>`}]},accent({uid:s}){const t=tt(`${s}x`,30,32,20,.2,ct,!1);return`${b(`${s}x`,{wc:"#c75a7a"})}${t.art}`}},Ct=[re,fe,ye,te,ue],Ae=s=>Ct.find(t=>t.id===s)??Ct[0];let J=null;function ve(){if(J)return J;const s=160,t=document.createElement("canvas");t.width=t.height=s;const e=t.getContext("2d");if(!e)return"";let o=1337;const r=()=>(o=o*16807%2147483647,o/2147483647);for(let i=0;i<70;i++){const n=r()*s,a=r()*s,l=.5+r()*1.3,d=.35+r()*.65,h=e.createRadialGradient(n,a,0,n,a,l*2.4);h.addColorStop(0,`rgba(255,255,255,${d})`),h.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=h,e.beginPath(),e.arc(n,a,l*2.4,0,Math.PI*2),e.fill()}e.strokeStyle="rgba(255,255,255,0.9)",e.lineCap="round";for(let i=0;i<6;i++){const n=r()*s,a=r()*s,l=3+r()*4;e.lineWidth=.8,e.beginPath(),e.moveTo(n-l,a),e.lineTo(n+l,a),e.moveTo(n,a-l),e.lineTo(n,a+l),e.stroke()}return J=t.toDataURL("image/png"),J}const Ft="http://www.w3.org/2000/svg";let we=0;const Lt=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;class Te{constructor(t,e={}){y(this,"root");y(this,"tilt");y(this,"book");y(this,"design");y(this,"content");y(this,"overlays",[]);y(this,"msgEl");y(this,"toEl");y(this,"fromEl");y(this,"insertEl");y(this,"isOpen",!1);y(this,"raf",0);y(this,"target",{rx:0,ry:0});y(this,"cur",{rx:0,ry:0});y(this,"lastInput",0);y(this,"gyroBase",null);y(this,"resizeObs");y(this,"disposers",[]);if(this.host=t,this.opts=e,this.root=document.createElement("div"),this.root.className="cv",this.root.innerHTML=`
      <div class="cv-tilt">
        <div class="cv-book">
          <div class="cv-page cv-right"></div>
          <div class="cv-cover">
            <div class="cv-face cv-front"></div>
            <div class="cv-face cv-back"></div>
          </div>
        </div>
      </div>`,this.tilt=this.root.querySelector(".cv-tilt"),this.book=this.root.querySelector(".cv-book"),t.appendChild(this.root),e.toggleOnClick){this.root.tabIndex=0,this.root.setAttribute("role","button");const a=()=>this.setOpen(!this.isOpen,!0);this.root.addEventListener("click",a),this.root.addEventListener("keydown",l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),a())})}const o=a=>{if(a.pointerType==="touch")return;const l=this.root.getBoundingClientRect(),d=(a.clientX-l.left)/l.width*2-1,h=(a.clientY-l.top)/l.height*2-1;this.aim(Math.max(-1,Math.min(1,d)),Math.max(-1,Math.min(1,h)))},r=()=>{this.target={rx:0,ry:0}},i=a=>{const l=a.touches[0];if(!l)return;const d=this.root.getBoundingClientRect();this.aim((l.clientX-d.left)/d.width*2-1,(l.clientY-d.top)/d.height*2-1)},n=a=>{if(a.beta==null||a.gamma==null)return;this.gyroBase||(this.gyroBase={b:a.beta,g:a.gamma}),this.gyroBase.b+=(a.beta-this.gyroBase.b)*.004,this.gyroBase.g+=(a.gamma-this.gyroBase.g)*.004;const l=Math.max(-1,Math.min(1,(a.gamma-this.gyroBase.g)/22)),d=Math.max(-1,Math.min(1,(a.beta-this.gyroBase.b)/22));this.aim(l,d)};window.addEventListener("pointermove",o,{passive:!0}),document.addEventListener("pointerleave",r),this.root.addEventListener("touchmove",i,{passive:!0}),window.addEventListener("deviceorientation",n),this.disposers.push(()=>window.removeEventListener("pointermove",o),()=>document.removeEventListener("pointerleave",r),()=>window.removeEventListener("deviceorientation",n)),this.resizeObs=new ResizeObserver(()=>this.fit()),this.resizeObs.observe(t),this.loop=this.loop.bind(this),this.raf=requestAnimationFrame(this.loop)}static async requestMotion(){const t=window.DeviceOrientationEvent;if(t&&typeof t.requestPermission=="function")try{return await t.requestPermission()==="granted"}catch{return!1}return"DeviceOrientationEvent"in window}get open(){return this.isOpen}render(t,e){this.design=t,this.content=e;const o=`c${++we}`,{w:r,h:i}=t;this.root.style.setProperty("--w",String(r)),this.root.style.setProperty("--h",String(i)),this.root.style.setProperty("--b",String(t.bleed)),this.root.dataset.design=t.id,this.overlays=[];const n=this.root.querySelector(".cv-front"),a=this.root.querySelector(".cv-back"),l=this.root.querySelector(".cv-right"),d=t.cover({uid:o,cover:e.cover});n.replaceChildren(this.edge(),...d.map((p,$)=>this.layer(p,`${o}f${$}`,$===0)));const h=d.filter(p=>p.overhang).map(p=>this.silhouette(p)),f=t.insideLeft({uid:`${o}L`,cover:e.cover});a.replaceChildren(...h,this.edge(),...f.map((p,$)=>this.layer(p,`${o}b${$}`,$===0)));const u=`${o}rp`;l.innerHTML="",l.append(this.edge());const c=this.layer({depth:0,art:`<defs><filter id="${u}" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="12" result="n"/>
          <feDiffuseLighting in="n" surfaceScale="0.6" diffuseConstant="1.15" lighting-color="#fff" result="l"><feDistantLight azimuth="235" elevation="58"/></feDiffuseLighting>
          <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="1.1"/>
          <feComposite in2="SourceAlpha" operator="in"/></filter></defs>
          <rect width="${r}" height="${i}" fill="${t.inside}" filter="url(#${u})"/>
          <rect x="${r*.055}" y="${i*.045}" width="${r*.89}" height="${i*.91}" fill="${t.insert}" filter="url(#${u})"/>`},`${o}r`,!0);l.append(c),this.insertEl=document.createElement("div"),this.insertEl.className="cv-insert",this.insertEl.style.color=t.ink,this.insertEl.innerHTML=`
      <div class="cv-to"></div>
      <div class="cv-msg"></div>
      <div class="cv-from"></div>
      <svg class="cv-accent" viewBox="0 0 60 60" aria-hidden="true">${t.accent({uid:`${o}x`,cover:e.cover})}</svg>`,l.append(this.insertEl),this.msgEl=this.insertEl.querySelector(".cv-msg"),this.toEl=this.insertEl.querySelector(".cv-to"),this.fromEl=this.insertEl.querySelector(".cv-from"),this.setWords(e),this.label(),this.fit()}setWords(t){this.content=t,this.insertEl.className=`cv-insert hand-${t.hand}`,this.msgEl.textContent=t.message,this.toEl.textContent=t.to?`${t.to},`:"",this.fromEl.textContent=t.from;const e=t.message.length,o=e<40?1.12:e<80?1:e<140?.86:e<220?.74:e<320?.64:.56;this.insertEl.style.setProperty("--msg",String(o))}setCover(t){this.design&&(this.render(this.design,{...this.content,cover:t}),this.isOpen&&this.book.classList.add("is-open"))}setOpen(t,e=!1){t!==this.isOpen&&(this.isOpen=t,this.book.classList.toggle("is-open",t),this.fit(),this.label(),e&&this.opts.onToggle?.(t))}destroy(){cancelAnimationFrame(this.raf),this.resizeObs.disconnect(),this.disposers.forEach(t=>t()),this.root.remove()}label(){!this.opts.toggleOnClick||!this.design||(this.root.setAttribute("aria-label",this.isOpen?`${this.design.name} card, open. ${this.content.to?`${this.content.to}, `:""}${this.content.message.replace(/[.!?]*\s*$/,".")} ${this.content.from}. Press to close.`:`${this.design.name} card, closed. Press to open.`),this.root.setAttribute("aria-pressed",String(this.isOpen)))}aim(t,e){this.lastInput=performance.now();const o=Lt()?.3:1;this.target={rx:-e*11*o,ry:t*15*o}}fit(){if(!this.design)return;const{w:t,h:e,bleed:o}=this.design,r=this.host.getBoundingClientRect(),i=this.opts.fill??(r.width<520?.9:.82),n=r.width,a=r.height,l=o*.55,d=Math.min(n*i/(t+l*2),a*i/(e+l*1.2)),h=n<a*.95;let f=1,u=0;this.isOpen&&(h?(f=Math.min(n*.84/t,a*i/e)/d,u=0):(f=Math.min(n*.9/(t*2),a*i/e)/d,u=t*d*f/2)),this.root.style.setProperty("--s",d.toFixed(4)),this.book.style.setProperty("--zoom",f.toFixed(4)),this.book.style.setProperty("--tx",`${u.toFixed(1)}px`)}loop(t){this.raf=requestAnimationFrame(this.loop);const e=this.opts.idleSway&&!Lt()&&t-this.lastInput>2600,o=e?{rx:Math.sin(t*55e-5)*4.5,ry:Math.sin(t*8e-4)*9}:this.target,r=e?.04:.09,i=o.rx-this.cur.rx,n=o.ry-this.cur.ry;if(Math.abs(i)<.005&&Math.abs(n)<.005)return;this.cur.rx+=i*r,this.cur.ry+=n*r;const{rx:a,ry:l}=this.cur;this.tilt.style.transform=`rotateX(${a.toFixed(2)}deg) rotateY(${l.toFixed(2)}deg)`;const d=l/15,h=-a/11;if(this.root.style.setProperty("--mx",d.toFixed(3)),this.root.style.setProperty("--my",h.toFixed(3)),!this.design)return;const{w:f,h:u}=this.design,c=(d*f*.75).toFixed(1),p=(h*u*.55).toFixed(1);for(const $ of this.overlays)$.sheen?.setAttribute("gradientTransform",`translate(${c} ${p})`),$.patterns[0]?.setAttribute("patternTransform",`translate(${(d*46).toFixed(1)} ${(h*46).toFixed(1)})`),$.patterns[1]?.setAttribute("patternTransform",`translate(${(-d*38+70).toFixed(1)} ${(-h*31+40).toFixed(1)}) rotate(37)`)}edge(){const t=document.createElement("div");return t.className="cv-sheet",t}svg(t,e){const{w:o,h:r,bleed:i}=this.design,n=document.createElementNS(Ft,"svg");return n.setAttribute("class",t),n.setAttribute("viewBox",`${-i} ${-i} ${o+2*i} ${r+2*i}`),n.setAttribute("aria-hidden","true"),n.setAttribute("focusable","false"),n.innerHTML=e,n}layer(t,e,o){const r=document.createElement("div");r.className="cv-layer",r.style.setProperty("--z",String(t.depth)),r.append(this.svg("cv-art",t.art));const i={patterns:[]};if(t.sheen){const n=t.sheenTone??"#ffffff",{w:a,h:l}=this.design,d=this.svg("cv-sheen",`<defs><linearGradient id="${e}-sh" gradientUnits="userSpaceOnUse" x1="${-a*.1}" y1="${-l*.2}" x2="${a*1.1}" y2="${l*1.2}">
          <stop offset="0" stop-color="${n}" stop-opacity="0"/>
          <stop offset="0.4" stop-color="${n}" stop-opacity="0"/>
          <stop offset="0.48" stop-color="${n}" stop-opacity="0.85"/>
          <stop offset="0.52" stop-color="${n}" stop-opacity="0.9"/>
          <stop offset="0.6" stop-color="${n}" stop-opacity="0"/>
          <stop offset="1" stop-color="${n}" stop-opacity="0"/>
        </linearGradient></defs>
        <g fill="url(#${e}-sh)" stroke="url(#${e}-sh)" stroke-width="0">${t.sheen}</g>`);i.sheen=d.querySelector("linearGradient"),r.append(d)}if(t.glitter){const n=ve(),a=this.svg("cv-glitter",`<defs>
          <pattern id="${e}-p1" patternUnits="userSpaceOnUse" width="80" height="80"><image href="${n}" width="80" height="80"/></pattern>
          <pattern id="${e}-p2" patternUnits="userSpaceOnUse" width="64" height="64"><image href="${n}" width="64" height="64"/></pattern>
        </defs>
        <g fill="url(#${e}-p1)" stroke="url(#${e}-p1)" stroke-width="0">${t.glitter}</g>
        <g fill="url(#${e}-p2)" stroke="url(#${e}-p2)" stroke-width="0">${t.glitter}</g>`);i.patterns=Array.from(a.querySelectorAll("pattern")),r.append(a)}if(o){const n=document.createElement("div");n.className="cv-glare",r.append(n)}return(i.sheen||i.patterns.length)&&this.overlays.push(i),r}silhouette(t){const{w:e,h:o,bleed:r}=this.design,i=`<svg xmlns="${Ft}" viewBox="${-r} ${-r} ${e+2*r} ${o+2*r}">${t.art}</svg>`,n=`url("data:image/svg+xml,${encodeURIComponent(i)}")`,a=document.createElement("div");return a.className="cv-sil",a.style.background=this.design.inside,a.style.setProperty("mask-image",n),a.style.setProperty("-webkit-mask-image",n),a}}const V={c:40,m:400,t:40,f:60},ke=["caveat","pinyon","bodoni"];function jt(s){let t="";for(let e=0;e<s.length;e++)t+=String.fromCharCode(s[e]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function xe(s){const t=s.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((s.length+3)%4),e=atob(t),o=new Uint8Array(e.length);for(let r=0;r<e.length;r++)o[r]=e.charCodeAt(r);return o}const Pt=()=>typeof CompressionStream<"u"&&typeof DecompressionStream<"u";async function Bt(s,t){const e=new Blob([s]).stream().pipeThrough(t);return new Uint8Array(await new Response(e).arrayBuffer())}function Me(s,t){const e=(i,n)=>typeof i=="string"?i.slice(0,n):"",o=typeof s.d=="string"&&t.includes(s.d)?s.d:t[0],r=ke.includes(s.h)?s.h:"caveat";return{d:o,h:r,c:e(s.c,V.c),m:e(s.m,V.m),t:e(s.t,V.t),f:e(s.f,V.f)}}async function Ee(s){const t=new TextEncoder().encode(JSON.stringify(s));if(Pt())try{return"z"+jt(await Bt(t,new CompressionStream("deflate-raw")))}catch{}return"j"+jt(t)}async function Oe(s,t){try{const e=s[0];let o=xe(s.slice(1));if(e==="z"){if(!Pt())return null;o=await Bt(o,new DecompressionStream("deflate-raw"))}else if(e!=="j")return null;const r=JSON.parse(new TextDecoder().decode(o));return!r||typeof r!="object"?null:Me(r,t)}catch{return null}}function Pe(s,t=location.href){const e=new URL("open.html",t);return e.search="",e.hash=s,e.toString()}const Se=""+new URL("marcellus-latin-400-normal-86dSXJnk.woff2",import.meta.url).href,Nt="http://www.w3.org/2000/svg";let dt=0,At=null;function It(){return At??(At=fetch(Se).then(s=>s.blob()).then(s=>new Promise(t=>{const e=new FileReader;e.onload=()=>t(String(e.result)),e.readAsDataURL(s)})).then(s=>`@font-face{font-family:Marcellus;src:url(${s}) format('woff2');}`).catch(()=>"")),At}function ht(s,t,e=""){const{w:o,h:r,bleed:i}=s,n=`${-i} ${-i} ${o+2*i} ${r+2*i}`,a=t.map(l=>`<svg x="${-i}" y="${-i}" width="${o+2*i}" height="${r+2*i}" viewBox="${n}">${l.art}</svg>`).join("");return`<svg xmlns="${Nt}" viewBox="${n}" width="${o+2*i}" height="${r+2*i}">${e?`<style>${e}</style>`:""}${a}</svg>`}const et=s=>`data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;async function Be(s,t){const e=s.cover({uid:`t${++dt}`,cover:t}),o=s.coverText?await It():"";return et(ht(s,e,o))}function ft(s){return new Promise((t,e)=>{const o=new Image;o.onload=()=>t(o),o.onerror=e,o.src=s})}const Ce={caveat:{css:s=>`500 ${s}px Caveat`,scale:1},pinyon:{css:s=>`400 ${s}px "Pinyon Script"`,scale:.86},bodoni:{css:s=>`italic 400 ${s}px "Bodoni Moda"`,scale:.72}};function Fe(s,t,e){const o=[];for(const r of t.split(`
`)){let i="";for(const n of r.split(/\s+/)){const a=i?`${i} ${n}`:n;s.measureText(a).width>e&&i?(o.push(i),i=n):i=a}o.push(i)}return o}async function Ne(s,t){const{w:o,h:r,bleed:i}=s,n=56,a=64,l=i+n+o+a+o+n+i,d=r+2*i+2*n,h=document.createElement("canvas");h.width=l*2,h.height=d*2;const f=h.getContext("2d");f.scale(2,2),f.fillStyle="#ffffff",f.fillRect(0,0,l,d);const u=n+i,c=u+o+a,p=n+i,$=Ce[t.hand];await Promise.all([document.fonts.load($.css(40)),document.fonts.load('400 20px "Hanken Grotesk"')]);const v=s.coverText?await It():"",S=ht(s,s.cover({uid:`x${++dt}`,cover:t.cover}),v),m=ht(s,[{depth:0,art:`<rect width="${o}" height="${r}" fill="${s.inside}"/>
        <rect x="${o*.055}" y="${r*.045}" width="${o*.89}" height="${r*.91}" fill="${s.insert}"/>`}]),w=`<svg xmlns="${Nt}" viewBox="0 0 60 60" width="120" height="120">${s.accent({uid:`a${dt}`,cover:t.cover})}</svg>`,[k,ot,st]=await Promise.all([ft(et(S)),ft(et(m)),ft(et(w))]),ut=U=>{f.save(),f.shadowColor="rgba(40,30,20,0.26)",f.shadowBlur=34,f.shadowOffsetY=16,f.fillStyle="#ffffff",f.fillRect(U,p,o,r),f.restore()};ut(c),f.drawImage(ot,c-i,p-i,o+2*i,r+2*i),ut(u),f.drawImage(k,u-i,p-i,o+2*i,r+2*i);const $t=c+o*.055,rt=o*.89,it=rt*.1,D=t.message.length,nt=40*(D<40?1.12:D<80?1:D<140?.86:D<220?.74:D<320?.64:.56)*$.scale,E=32*$.scale;f.fillStyle=s.ink,f.textBaseline="alphabetic",f.font=$.css(nt);const gt=Fe(f,t.message,rt-it*2),mt=nt*1.24,Gt=(t.to?E*1.4:0)+gt.length*mt+(t.from?E*1.6:0)+60;let T=p+r/2-Gt/2;t.to&&(f.font=$.css(E),f.textAlign="left",T+=E,f.fillText(`${t.to},`,$t+it,T),T+=E*.4),f.font=$.css(nt),f.textAlign="center";for(const U of gt)T+=mt,f.fillText(U,c+o/2,T);return t.from&&(f.font=$.css(E),f.textAlign="right",T+=E*1.6,f.fillText(t.from,$t+rt-it,T)),f.drawImage(st,c+o/2-23,T+14,46,46),f.font='400 13px "Hanken Grotesk", sans-serif',f.textAlign="right",f.fillStyle="#9a948b",f.fillText("Pressed with Embossed",l-24,d-20),new Promise((U,Dt)=>h.toBlob(bt=>bt?U(bt):Dt(new Error("Could not draw the card")),"image/png"))}function Ie(s,t){return`${t.trim()?`${t.trim()}, I pressed a card for you.`:"I pressed a card for you."} Open it here: ${s}`}function Ge(s){return`https://wa.me/?text=${encodeURIComponent(s)}`}const De=()=>typeof navigator.share=="function";async function Ue(s,t){try{return await navigator.share({title:"A card for you",text:t,url:s}),"shared"}catch(e){return e?.name==="AbortError"?"cancelled":"failed"}}async function qe(s){try{return await navigator.clipboard.writeText(s),!0}catch{const t=document.createElement("textarea");t.value=s,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.append(t),t.select();const e=document.execCommand("copy");return t.remove(),e}}async function ze(s,t="embossed-card.png"){const e=new File([s],t,{type:"image/png"}),o=navigator;if(window.matchMedia("(pointer: coarse)").matches&&o.canShare?.({files:[e]}))try{await navigator.share({files:[e],title:"A card for you"});return}catch(a){if(a?.name==="AbortError")return}const i=URL.createObjectURL(s),n=document.createElement("a");n.href=i,n.download=t,document.body.append(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(i),4e3)}export{Te as C,V as L,Ae as a,Be as b,Me as c,Ct as d,Pe as e,Ee as f,De as g,qe as h,ze as i,Ne as j,Oe as k,Tt as l,Ue as n,Ie as s,Ge as w};
