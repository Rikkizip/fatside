(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();"serviceWorker"in navigator&&navigator.serviceWorker.register("/fatside/sw.js");let t={screen:"splash",handicap:null,previousHandicap:null,rounds:[],courses:[],showAddForm:!1,hasCompletedOnboarding:!1};function f(){const e=localStorage.getItem("fatside");if(e){const a=JSON.parse(e);t.handicap=a.handicap,t.previousHandicap=a.previousHandicap,t.rounds=a.rounds||[],t.courses=a.courses||[],t.hasCompletedOnboarding=a.hasCompletedOnboarding||!1}}function u(){localStorage.setItem("fatside",JSON.stringify({handicap:t.handicap,previousHandicap:t.previousHandicap,rounds:t.rounds,courses:t.courses,hasCompletedOnboarding:t.hasCompletedOnboarding}))}function m(e){if(e.length===0)return null;const n=e.slice(0,20).map(r=>r.differential).sort((r,c)=>r-c);let s;n.length<=3?s=1:n.length<=5?s=2:n.length<=8?s=3:n.length<=11?s=4:n.length<=14?s=5:n.length<=16?s=6:n.length<=18?s=7:s=8;const l=n.slice(0,s).reduce((r,c)=>r+c,0)/s*.96;return Math.round(l*10)/10}function v(e,a,n){return Math.round((e-a)*113/n*10)/10}function p(){return t.rounds.length>0?m(t.rounds):t.handicap}function g(){const e=p();return e===null||t.previousHandicap===null||t.rounds.length<1?null:Math.round((e-t.previousHandicap)*10)/10}function h(e){const a=new Date(e);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][a.getMonth()]} ${a.getDate()}`}function b(e){return t.rounds.filter(a=>a.course===e).length}function d(){const e=document.getElementById("app");switch(t.screen){case"splash":e.innerHTML=y(),setTimeout(()=>{t.screen=t.hasCompletedOnboarding?"home":"onboarding",d()},1e3);break;case"onboarding":e.innerHTML=I();break;case"home":e.innerHTML=$();break;case"settings":e.innerHTML=w();break}}function y(){return`
    <div class="splash">
      <div class="splash-logo">Fatside</div>
    </div>
  `}function I(){return`
    <header>
      <div class="logo">Fatside</div>
    </header>
    <div class="onboarding-content">
      <div class="onboarding-question">What's your handicap index?</div>
      <div class="onboarding-row">
        <input type="text" class="onboarding-input" id="handicapInput" placeholder="12.4" inputmode="decimal">
        <button class="onboarding-btn" data-action="submitHandicap">Start</button>
      </div>
      <div class="onboarding-skip" data-action="skipOnboarding">I don't have one yet</div>
    </div>
  `}function $(){const e=p(),a=g(),n=t.rounds.length>0;let s="";if(a!==null&&a!==0){const i=a<0?"↓":"↑",o=Math.abs(a);s=`<div class="handicap-trend">${i} ${o} since last round</div>`}else n&&(s=`<div class="handicap-trend">Based on ${t.rounds.length} round${t.rounds.length>1?"s":""}</div>`);return`
    <header>
      <div class="logo">Fatside</div>
      <button class="btn-text" data-action="goTo" data-params="settings">Settings</button>
    </header>

    <section class="handicap-section">
      <div class="handicap-label">Handicap Index</div>
      <div class="handicap-row">
        <div class="handicap-number${e===null?" empty":""}">${e!==null?e:"—"}</div>
        ${s}
      </div>
    </section>

    <section class="rounds-section">
      ${n?A():S()}
    </section>
  `}function A(){return t.showAddForm?`
      <div class="rounds-header">
        <div class="rounds-label">Add Round</div>
        <button class="btn-cancel" data-action="toggleAddForm">Cancel</button>
      </div>
      <div class="list">
        ${F()}
      </div>
    `:`
    <div class="rounds-header">
      <div class="rounds-label">Recent Rounds</div>
      <button class="btn" data-action="toggleAddForm">+ Add</button>
    </div>
    <div class="list">
      ${t.rounds.map(e=>`
        <div class="list-item">
          <div class="list-item-title">${e.course}</div>
          <div class="list-item-value">+${e.differential}</div>
          <div class="list-item-meta">${h(e.date)} · Par ${e.par}</div>
          <div class="list-item-meta-right">${e.score}</div>
        </div>
      `).join("")}
    </div>
  `}function F(){const e=new Date().toISOString().split("T")[0],a=t.courses.length>0,n=t.rounds.length>0?t.rounds[0]:null,s=n?n.course:"",i=n?n.rating:"",o=n?n.slope:"",l=n?n.par:"";return`
    <div class="add-form">
      <div class="form-row">
        <div class="form-field">
          <label class="form-label">Course</label>
          <input type="text" class="form-input" id="courseInput" placeholder="Course name" value="${s}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-field small">
          <label class="form-label">Rating</label>
          <input type="text" class="form-input" id="ratingInput" placeholder="72.3" inputmode="decimal" value="${i}">
        </div>
        <div class="form-field small">
          <label class="form-label">Slope</label>
          <input type="text" class="form-input" id="slopeInput" placeholder="131" inputmode="numeric" value="${o}">
        </div>
        <div class="form-field small">
          <label class="form-label">Par</label>
          <input type="text" class="form-input" id="parInput" placeholder="72" inputmode="numeric" value="${l}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-field small">
          <label class="form-label">Score</label>
          <input type="text" class="form-input" id="scoreInput" placeholder="84" inputmode="numeric">
        </div>
        <div class="form-field">
          <label class="form-label">Date</label>
          <input type="date" class="form-input" id="dateInput" value="${e}">
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-save" data-action="saveRound">Save Round</button>
      </div>
    </div>
    ${a?O():""}
  `}function O(){return t.courses.map(e=>{const a=b(e.name);return`
      <div class="course-item" data-action="selectCourse" data-params="${e.name}|${e.rating}|${e.slope}|${e.par}">
        <div class="course-name">${e.name}</div>
        <div class="course-rating">${e.rating} / ${e.slope}</div>
        <div class="course-meta">Par ${e.par} · ${a} round${a!==1?"s":""} played</div>
      </div>
    `}).join("")}function S(){const e=new Date().toISOString().split("T")[0];return t.showAddForm?`
      <div class="rounds-header">
        <div class="rounds-label">Add Round</div>
        <button class="btn-cancel" data-action="toggleAddForm">Cancel</button>
      </div>
      <div class="list">
        <div class="add-form">
          <div class="form-row">
            <div class="form-field">
              <label class="form-label">Course</label>
              <input type="text" class="form-input" id="courseInput" placeholder="Course name">
            </div>
          </div>
          <div class="form-row">
            <div class="form-field small">
              <label class="form-label">Rating</label>
              <input type="text" class="form-input" id="ratingInput" placeholder="72.3" inputmode="decimal">
            </div>
            <div class="form-field small">
              <label class="form-label">Slope</label>
              <input type="text" class="form-input" id="slopeInput" placeholder="131" inputmode="numeric">
            </div>
            <div class="form-field small">
              <label class="form-label">Par</label>
              <input type="text" class="form-input" id="parInput" placeholder="72" inputmode="numeric">
            </div>
          </div>
          <div class="form-row">
            <div class="form-field small">
              <label class="form-label">Score</label>
              <input type="text" class="form-input" id="scoreInput" placeholder="84" inputmode="numeric">
            </div>
            <div class="form-field">
              <label class="form-label">Date</label>
              <input type="date" class="form-input" id="dateInput" value="${e}">
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-save" data-action="saveRound">Save Round</button>
          </div>
        </div>
      </div>
    `:`
    <div class="empty-state">
      <div class="empty-message">Add your first round to ${t.handicap!==null?"start tracking your handicap":"calculate your handicap index"}.</div>
      <button class="btn btn-primary" data-action="toggleAddForm">+ Add Round</button>
    </div>
  `}function w(){return`
    <header>
      <div class="logo">Settings</div>
      <button class="btn-text" data-action="goTo" data-params="home">Done</button>
    </header>

    <section class="section">
      <div class="list">
        <div class="list-item" data-action="exportData">
          <span class="list-item-label">Export Data</span>
        </div>
        <div class="list-item danger" data-action="deleteAllData">
          <span class="list-item-label">Delete All Data</span>
        </div>
      </div>
    </section>

    <div class="footer">
      <div class="version">Fatside v1.0</div>
    </div>
  `}function C(e){t.screen=e,t.showAddForm=!1,d()}function x(){const e=document.getElementById("handicapInput"),a=parseFloat(e.value);isNaN(a)||(t.handicap=a,t.previousHandicap=a),t.hasCompletedOnboarding=!0,u(),t.screen="home",d()}function D(){t.handicap=null,t.previousHandicap=null,t.hasCompletedOnboarding=!0,u(),t.screen="home",d()}function H(){t.showAddForm=!t.showAddForm,d()}function R(e,a,n,s){document.getElementById("courseInput").value=e,document.getElementById("ratingInput").value=a,document.getElementById("slopeInput").value=n,document.getElementById("parInput").value=s,document.getElementById("scoreInput").focus()}function E(){const e=document.getElementById("courseInput").value,a=parseFloat(document.getElementById("ratingInput").value),n=parseInt(document.getElementById("slopeInput").value),s=parseInt(document.getElementById("parInput").value),i=parseInt(document.getElementById("scoreInput").value),o=document.getElementById("dateInput").value;if(!e||isNaN(a)||isNaN(n)||isNaN(s)||isNaN(i)||!o){alert("Please fill in all fields");return}t.previousHandicap=p();const l=v(i,a,n);t.rounds.unshift({course:e,rating:a,slope:n,par:s,score:i,date:o,differential:l}),t.courses.find(c=>c.name===e)||t.courses.push({name:e,rating:a,slope:n,par:s}),t.handicap=m(t.rounds),t.showAddForm=!1,u(),d()}function N(){const e=JSON.stringify({handicap:t.handicap,rounds:t.rounds,courses:t.courses},null,2),a=new Blob([e],{type:"application/json"}),n=URL.createObjectURL(a),s=document.createElement("a");s.href=n,s.download="fatside-data.json",s.click()}function B(){confirm("Delete all your data? This cannot be undone.")&&(localStorage.removeItem("fatside"),t={screen:"onboarding",handicap:null,previousHandicap:null,rounds:[],courses:[],showAddForm:!1,hasCompletedOnboarding:!1},d())}document.addEventListener("click",function(e){var a=e.target.closest("[data-action]");if(a){var n=a.dataset.action,s=a.dataset.params;if(n==="goTo")C(s);else if(n==="submitHandicap")x();else if(n==="skipOnboarding")D();else if(n==="toggleAddForm")H();else if(n==="selectCourse"){var i=s.split("|");R(i[0],parseFloat(i[1]),parseInt(i[2]),parseInt(i[3]))}else n==="saveRound"?E():n==="exportData"?N():n==="deleteAllData"&&B()}});f();d();
