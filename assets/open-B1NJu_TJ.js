import{t as R}from"./toast-CpZVAI23.js";import{k as H,d as N,a as U,C as z,l as L,b as V,i as W,j as X}from"./share-ftNVQ8RS.js";const o=t=>document.querySelector(t),G=window.matchMedia("(prefers-reduced-motion: reduce)").matches,f=t=>new Promise(e=>setTimeout(e,G?0:t)),E=o("#scene"),b=o("#stage"),i=o("#env-wrap"),w=o("#hint"),C=o("#after");function J(t){const e=t.trim();return e?(e.includes(",")?e.slice(e.lastIndexOf(",")+1):e).trim().replace(/[.!]+$/,""):""}function F(t,e){return`<svg viewBox="0 0 80 80" aria-hidden="true">
    <defs>
      <radialGradient id="${e}g" cx="0.38" cy="0.32" r="0.75">
        <stop offset="0" stop-color="var(--seal-hi)"/><stop offset="0.55" stop-color="var(--seal)"/><stop offset="1" stop-color="var(--seal-lo)"/>
      </radialGradient>
      <filter id="${e}f" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="5" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="5"/>
      </filter>
    </defs>
    <g filter="url(#${e}f)">
      <circle cx="40" cy="40" r="35" fill="url(#${e}g)"/>
      <circle cx="27" cy="69" r="7" fill="var(--seal-lo)"/>
      <circle cx="66" cy="58" r="6" fill="var(--seal)"/>
    </g>
    <circle cx="40" cy="40" r="24.5" fill="none" stroke="var(--seal-lo)" stroke-width="2.2" opacity="0.8"/>
    <circle cx="40" cy="40" r="23.2" fill="none" stroke="var(--seal-hi)" stroke-width="0.8" opacity="0.55"/>
    <text x="40.8" y="49.6" text-anchor="middle" font-family="'Bodoni Moda', serif" font-size="26" font-style="italic" fill="var(--seal-lo)">${L(t)}</text>
    <text x="40" y="48.8" text-anchor="middle" font-family="'Bodoni Moda', serif" font-size="26" font-style="italic" fill="var(--seal-hi)" opacity="0.55">${L(t)}</text>
    <ellipse cx="30" cy="25" rx="10" ry="5" fill="#fff" opacity="0.22" transform="rotate(-30 30 25)"/>
  </svg>`}function x(t,e){const n=parseInt(t.slice(1),16),y=c=>Math.max(0,Math.min(255,Math.round(c+e*255)));return`#${[n>>16&255,n>>8&255,n&255].map(c=>y(c).toString(16).padStart(2,"0")).join("")}`}async function K(){const t=location.hash.slice(1),e=t?await H(t,N.map(s=>s.id)):null;if(!e){o("#broken").hidden=!1,document.body.classList.remove("opening");return}const n=U(e.d),y={cover:e.c,message:e.m,hand:e.h,to:e.t,from:e.f},c=J(e.f);o("#scene-title").textContent=e.t?`A card for ${e.t}`:"A card for you",document.title=e.t?`A card for ${e.t}`:"A card for you";const M=new URLSearchParams({d:n.id});c&&M.set("to",c),o("#reply").href=`./?${M}`,new z(b,{toggleOnClick:!0,idleSway:!0,onToggle:s=>{w.textContent=s?"":"Tap the card to open it",s&&C.hidden&&(C.hidden=!1,requestAnimationFrame(()=>C.classList.add("is-on")))}}).render(n,y);const r=n.envelope;i.style.setProperty("--body",r.body),i.style.setProperty("--body-lo",x(r.body,-.05)),i.style.setProperty("--body-lo2",x(r.body,-.09)),i.style.setProperty("--liner",r.liner),i.style.setProperty("--seal",r.seal),i.style.setProperty("--seal-hi",x(r.seal,.16)),i.style.setProperty("--seal-lo",x(r.seal,-.16)),i.style.setProperty("--ink",r.ink);const S=(c[0]??"E").toUpperCase(),B=e.t.trim();i.innerHTML=`
    <div class="envelope" id="envelope">
      <div class="env-back"></div>
      <div class="env-slot"><div class="env-card"><img alt="" id="env-img" /></div></div>
      <svg class="env-pocket" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="0,0 54,57 0,100" fill="var(--body-lo)"/>
        <polygon points="100,0 46,57 100,100" fill="var(--body-lo2)"/>
        <polygon points="0,100 50,50 100,100" fill="var(--body)"/>
        <polyline points="0,100 50,50 100,100" fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="0.4" vector-effect="non-scaling-stroke"/>
      </svg>
      <p class="env-to hand-${e.h}">${L(B?`For ${B}`:"For you")}</p>
      <div class="env-flap" id="flap"><div class="flap-front"></div><div class="flap-back"></div></div>
      <button type="button" class="env-seal" id="seal" aria-label="Break the wax seal and open the envelope">
        <span class="seal-ring" aria-hidden="true"></span>
        <span class="seal-half seal-l">${F(S,"sl")}</span>
        <span class="seal-half seal-r">${F(S,"sr")}</span>
      </button>
    </div>`,i.hidden=!1;const a=o("#envelope"),g=o("#env-img");g.src=await V(n,y.cover);const{w:v,h:$,bleed:k}=n;let u=0,p=0;function T(){const s=E.getBoundingClientRect(),l=s.height-150,d=s.width;p=Math.min(l*.94/1.86,d*.78/v*$,520),u=p/$*v;const m=u*1.08,P=p*1.06;a.style.setProperty("--ew",`${m}px`),a.style.setProperty("--eh",`${P}px`),a.style.setProperty("--cw",`${u}px`),a.style.setProperty("--ch",`${p}px`),a.style.setProperty("--rise",`${p*.84}px`),g.style.width=`${u*(v+2*k)/v}px`,g.style.left=`${-u*k/v}px`,g.style.top=`${-p*k/$}px`}T();const q=new ResizeObserver(T);q.observe(E),w.textContent="Tap the wax seal to open your envelope",document.body.classList.add("is-ready");const h=o("#seal"),I=async()=>{h.disabled=!0,z.requestMotion(),w.textContent="",a.classList.add("is-breaking"),await f(420),a.classList.add("is-flap-open"),await f(380),a.classList.add("is-flap-behind"),await f(420),a.classList.add("is-rising"),await f(1150),q.disconnect();const l=b.querySelector(".cv-book").getBoundingClientRect(),d=a.querySelector(".env-card"),m=d.getBoundingClientRect();a.classList.add("is-leaving");const P=l.width/m.width;d.style.transformOrigin="0 0",d.style.transition=G?"none":"transform 0.75s cubic-bezier(0.22, 0.7, 0.12, 1)";const A=getComputedStyle(d).transform,O=new DOMMatrix(A==="none"?void 0:A),j=l.left-m.left,D=l.top-m.top;d.style.transform=`translate(${O.e+j}px, ${O.f+D}px) scale(${P})`,await f(760),document.body.classList.add("is-revealed"),b.inert=!1,await f(260),i.hidden=!0,w.textContent="Tap the card to open it",b.querySelector(".cv")?.focus({preventScroll:!0})};h.addEventListener("click",I),a.addEventListener("click",s=>{!h.disabled&&s.target!==h&&!h.contains(s.target)&&I()}),o("#save").addEventListener("click",async s=>{const l=s.currentTarget;l.disabled=!0;try{await W(await X(n,y)),R("Image saved")}catch{R("Could not make the image. Try again.")}finally{l.disabled=!1}})}K();
