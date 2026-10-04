const s="embossed.storage",o="embossed.draft";function i(t){try{return localStorage.getItem(t)}catch{return null}}function n(t,e){try{e===null?localStorage.removeItem(t):localStorage.setItem(t,e)}catch{}}const c=()=>{const t=i(s);return t==="keep"||t==="skip"?t:null};function l(t){n(s,t),t==="skip"&&n(o,null)}function u(t){c()==="keep"&&n(o,JSON.stringify(t))}function d(){if(c()!=="keep")return null;try{return JSON.parse(i(o)??"null")}catch{return null}}function f(){n(o,null),n(s,null)}function p(t="./"){if(c())return;const e=document.createElement("section");e.className="consent",e.setAttribute("aria-label","Storage choice"),e.innerHTML=`
    <p>Embossed uses no tracking or advertising cookies. Can we keep your unfinished card in this browser so it is still here when you come back?
      <a href="${t}legal/cookies.html">Cookie policy</a></p>
    <div class="consent-actions">
      <button type="button" class="btn btn-quiet" data-choice="skip">Don't keep it</button>
      <button type="button" class="btn btn-quiet" data-choice="keep">Keep my draft</button>
    </div>`,e.addEventListener("click",r=>{const a=r.target.closest("[data-choice]");a&&(l(a.dataset.choice),e.classList.add("is-leaving"),setTimeout(()=>e.remove(),260),document.dispatchEvent(new CustomEvent("storagechoice")))}),document.body.append(e)}export{p as c,f,d as l,u as s};
