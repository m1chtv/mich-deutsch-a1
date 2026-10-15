/* Deutsch A1 – class practice app | github.com/m1chtv
   Vanilla JS + Bootstrap 5 (RTL) + Bootstrap Icons. Data lives in js/data.js */
'use strict';

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const ico = (n, c = '') => `<i class="bi bi-${n} ${c}" aria-hidden="true"></i>`;
const shuffle = a => [...a].sort(() => Math.random() - 0.5);
const pick = (a, k) => shuffle(a).slice(0, k);
const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

/* ---------- state ---------- */
const TABS = [
  ['phrases', 'chat-dots', 'عبارت‌ها'], ['numbers', '123', 'اعداد'], ['alphabet', 'alphabet-uppercase', 'الفبا'],
  ['verbs', 'pencil-square', 'صرف'], ['sounds', 'mic-fill', 'تلفظ'], ['quiz', 'bullseye', 'آزمون'],
];
const GROUP_ICONS = ['person-badge', 'easel2', 'arrow-left-right', 'hand-index-thumb', 'mortarboard-fill', 'backpack2', 'spellcheck'];
const QM = [
  ['phrase', 'معنی عبارت', 'chat-dots'], ['verb', 'صرف فعل', 'pencil-square'], ['listen', 'شنیدن جمله', 'headphones'],
  ['num', 'اعداد', '123'], ['numl', 'شنیدن عدد', 'ear-fill'], ['let', 'حروف', 'alphabet-uppercase'],
];
const ui = { tab: 'phrases', verb: 0, slow: store.get('slow', false), hide: store.get('hide', false) };
const quiz = { mode: 'phrase', score: 0, total: 0, streak: 0, best: store.get('best', 0), cur: null };

/* ---------- speech ---------- */
function speak(text, slow = false) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(String(text).replace('≠', ', Gegenteil von, ').replace(' / ', ', '));
  u.lang = 'de-DE';
  u.rate = (slow || ui.slow) ? 0.6 : 0.88;
  const voice = speechSynthesis.getVoices().find(v => v.lang && v.lang.startsWith('de'));
  if (voice) u.voice = voice;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
const sayBtn = (text, cls = 'btn-warning rounded-circle', slow = false) =>
  `<button class="btn ${cls} say-btn" data-say="${attr(text)}"${slow ? ' data-slow="1"' : ''} aria-label="پخش صدا">${ico('volume-up-fill')}</button>`;

/* ---------- views ---------- */
const views = {
  phrases: () => P.map((g, i) => `
    <h2 class="section-title">${ico(GROUP_ICONS[i] || 'dot')} ${g[0].replace(/^\S+\s/, '')}</h2>
    <div class="list-group shadow-sm rounded-4 mb-3">${g[1].map(x => `
      <div class="list-group-item d-flex align-items-center gap-3 py-3 border-0 border-bottom">
        <div class="flex-grow-1">
          <div class="de" lang="de" dir="ltr">${x[0]}</div>
          <div class="fa text-body-secondary ${ui.hide ? 'blur-text' : ''}">${x[1]}</div>
        </div>
        ${sayBtn(x[0])}
      </div>`).join('')}
    </div>`).join(''),

  numbers: () => `
    <div class="alert alert-secondary small rounded-4">اعداد ۰ تا ۱۰۰. بالای ۲۰: <b>واحد + und + دهگان</b>
      (21 = einundzwanzig، 35 = fünfunddreißig)</div>
    <div class="row row-cols-3 g-2">${NUMS.map(n => `
      <div class="col"><button class="tile" data-say="${n[1]}" data-slow="1"><b>${n[0]}</b><span dir="ltr">${n[1]}</span></button></div>`).join('')}
    </div>`,

  alphabet: () => `
    <div class="alert alert-secondary small rounded-4">هر حرف همراه یک کلمه خوانده می‌شود (مثل «A wie Apfel») تا تلفظش درست باشد.</div>
    <div class="row row-cols-3 g-2">${ALPH.map((a, i) => `
      <div class="col"><button class="tile" data-say="${attr(spL(a))}" data-slow="1">
        <b>${a[0] === 'ß' ? 'ß' : a[0] + a[0].toLowerCase()}</b><span>${a[1]} · ${a[2]}</span><small dir="ltr">${ALW[a[0]]}</small>
      </button></div>`).join('')}
    </div>`,

  verbs: () => {
    const v = V[ui.verb];
    const rows = PR.map((p, i) => {
      const f = form(v, i);
      const cut = f.startsWith(v[1]) ? v[1].length : f.length - 1;
      return `<tr><td class="text-body-secondary">${p}</td>
        <td class="fs-5"><span class="text-body-secondary">${f.slice(0, cut)}</span><b class="text-danger">${f.slice(cut)}</b></td>
        <td class="text-end">${sayBtn(p.split('/')[0] + ' ' + f, 'btn-warning btn-sm rounded-circle')}</td></tr>`;
    }).join('');
    return `
      <div class="alert alert-danger-subtle small rounded-4">فرمول: <b>ریشه فعل (Verbstamm) + پایانه مناسب (Endung)</b><br>
        ich→e · du→st · er/sie/es→t · wir→en · ihr→t · sie/Sie→en</div>
      <div class="d-flex flex-wrap gap-2 mb-3" dir="ltr">${V.map((x, i) =>
        `<button class="btn btn-sm rounded-pill ${i === ui.verb ? 'btn-danger' : 'btn-outline-secondary'}" data-verb="${i}">${x[0]}</button>`).join('')}</div>
      <div class="card border-0 shadow-sm rounded-4"><div class="card-body">
        <p class="text-body-secondary mb-2">${v[0]} = ${v[2]}</p>
        <table class="table align-middle mb-3" dir="ltr"><tbody>${rows}</tbody></table>
        ${v[0] === 'heißen' ? '<div class="alert alert-warning small py-2">نکته: du heißt (نه heißst) — چون ß و s کنار هم می‌آیند، یکی حذف می‌شود.</div>' : ''}
        <button class="btn btn-danger" data-slow="1" data-say="${attr(PR.map((p, i) => p.split('/')[0] + ' ' + form(v, i)).join(', '))}">
          ${ico('play-fill')} همه را آهسته بخوان</button>
      </div></div>`;
  },

  sounds: () => `
    <div class="alert alert-secondary small rounded-4">روی کلمه‌ها بزن تا تلفظ را بشنوی.</div>
    ${S.map(s => `
      <div class="card border-0 shadow-sm rounded-4 mb-2"><div class="card-body">
        <div class="d-flex align-items-center gap-3 mb-2">
          <span class="display-6 fw-bold text-danger" dir="ltr">${s[0]}</span><span>${s[1]}</span>
        </div>
        <div class="d-flex flex-wrap gap-2" dir="ltr">${s[2].split(', ').map(w =>
          `<button class="btn btn-sm btn-outline-secondary rounded-pill" data-say="${w}" data-slow="1">${ico('volume-up-fill')} ${w}</button>`).join('')}</div>
      </div></div>`).join('')}`,

  quiz: () => `
    <div class="d-flex flex-wrap gap-2 mb-3">${QM.map(m =>
      `<button class="btn btn-sm rounded-pill ${m[0] === quiz.mode ? 'btn-danger' : 'btn-outline-secondary'}" data-qmode="${m[0]}">${ico(m[2])} ${m[1]}</button>`).join('')}</div>
    <div class="card border-0 shadow-sm rounded-4"><div class="card-body" id="qa"></div></div>`,
};

/* ---------- quiz ---------- */
function buildQuestion(mode) {
  const all = P.flatMap(g => g[1]);
  const plain = all.filter(x => !x[0].includes('≠') && !x[0].includes('/'));
  const others = (list, c, i) => pick(list.filter(x => x !== c), 3).map(x => x[i]);
  switch (mode) {
    case 'phrase': {
      const c = pick(all, 1)[0];
      return { q: c[0], say: c[0], after: c[0], ans: c[1], opts: shuffle([c[1], ...others(all, c, 1)]), rtl: true };
    }
    case 'verb': {
      const v = pick(V, 1)[0], i = Math.floor(Math.random() * 6), ans = form(v, i);
      const forms = [...new Set(EN.map(e => v[1] + e))].filter(x => x !== ans);
      return { q: `${PR[i]} ___ (${v[0]})`, after: `${PR[i].split('/')[0]} ${ans}`, ans, opts: shuffle([ans, ...pick(forms, 3)]) };
    }
    case 'listen': {
      const c = pick(plain, 1)[0];
      return { q: null, say: c[0], ans: c[0], opts: shuffle([c[0], ...others(plain, c, 0)]) };
    }
    case 'num': {
      const c = pick(NUMS, 1)[0];
      return { q: String(c[0]), after: c[1], ans: c[1], opts: shuffle([c[1], ...others(NUMS, c, 1)]) };
    }
    case 'numl': {
      const c = pick(NUMS, 1)[0];
      return { q: null, say: c[1], ans: String(c[0]), opts: shuffle([String(c[0]), ...others(NUMS, c, 0).map(String)]) };
    }
    default: {
      const c = pick(ALPH, 1)[0];
      return { q: null, say: spL(c), ans: c[0], opts: shuffle([c[0], ...others(ALPH, c, 0)]) };
    }
  }
}

function nextQuestion() {
  const q = quiz.cur = buildQuestion(quiz.mode);
  const pct = quiz.total ? Math.round(quiz.score / quiz.total * 100) : 0;
  $('#qa').innerHTML = `
    <div class="progress mb-2" style="height:8px"><div class="progress-bar bg-danger" style="width:${pct}%"></div></div>
    <div class="d-flex justify-content-between small text-body-secondary mb-3">
      <span>${ico('check-circle-fill', 'text-success')} ${quiz.score} از ${quiz.total}</span>
      <span>${ico('fire', 'text-danger')} ${quiz.streak} · بهترین ${quiz.best}</span></div>
    <div class="display-5 fw-bold text-center my-3" lang="de" dir="ltr">${q.q ?? ico('volume-up-fill', 'text-danger')}</div>
    ${q.say ? `<div class="text-center mb-3">
      <button class="btn btn-danger rounded-pill" data-say="${attr(q.say)}">${ico('volume-up-fill')} پخش دوباره</button>
      <button class="btn btn-outline-secondary rounded-pill" data-say="${attr(q.say)}" data-slow="1">${ico('hourglass-split')} آهسته</button></div>` : ''}
    <div class="d-grid gap-2" id="opts">${q.opts.map(o =>
      `<button class="btn btn-outline-secondary opt py-3 fw-semibold" data-opt="${attr(o)}" ${q.rtl ? '' : 'dir="ltr"'}>${o}</button>`).join('')}</div>
    <div id="fb"></div>`;
  if (q.say) setTimeout(() => speak(q.say), 250);
}

function answer(btn) {
  const q = quiz.cur;
  if (!q || q.done) return;
  q.done = true;
  const ok = btn.dataset.opt === q.ans;
  quiz.total++;
  if (ok) { quiz.score++; quiz.streak++; quiz.best = Math.max(quiz.best, quiz.streak); store.set('best', quiz.best); }
  else quiz.streak = 0;
  document.querySelectorAll('#opts .opt').forEach(b => {
    b.disabled = true;
    if (b.dataset.opt === q.ans) { b.classList.remove('btn-outline-secondary'); b.classList.add('btn-success'); }
    else if (b === btn) { b.classList.remove('btn-outline-secondary'); b.classList.add('btn-danger'); }
    else b.classList.add('opacity-50');
  });
  $('#fb').innerHTML = `
    <div class="alert alert-${ok ? 'success' : 'danger'} mt-3 py-2">${ok ? ico('emoji-smile-fill') + ' آفرین!' : `جواب درست: <b dir="ltr">${q.ans}</b>`}</div>
    <button class="btn btn-danger w-100" data-next>${ico('arrow-left')} بعدی</button>`;
  speak(q.after || q.say || q.ans);
}

/* ---------- render ---------- */
function renderTabs() {
  $('#tabbar').innerHTML = `<ul class="nav nav-justified px-2">${TABS.map(t => `
    <li class="nav-item"><button class="nav-link ${t[0] === ui.tab ? 'active' : ''}" data-tab="${t[0]}">${ico(t[1])}<span>${t[2]}</span></button></li>`).join('')}</ul>`;
}
function render(scroll = true) {
  const view = $('#view');
  view.innerHTML = views[ui.tab]();
  view.classList.remove('fade-in'); void view.offsetWidth; view.classList.add('fade-in');
  if (ui.tab === 'quiz') nextQuestion();
  renderTabs();
  if (scroll) window.scrollTo(0, 0);
}

/* ---------- events (delegated) ---------- */
document.addEventListener('click', e => {
  const t = e.target;
  const say = t.closest('[data-say]');
  if (say) return speak(say.dataset.say, say.dataset.slow === '1');
  const tab = t.closest('[data-tab]');
  if (tab) { ui.tab = tab.dataset.tab; return render(); }
  const verb = t.closest('[data-verb]');
  if (verb) { ui.verb = +verb.dataset.verb; return render(false); }
  const qm = t.closest('[data-qmode]');
  if (qm) { quiz.mode = qm.dataset.qmode; quiz.score = quiz.total = quiz.streak = 0; return render(false); }
  const opt = t.closest('[data-opt]');
  if (opt) return answer(opt);
  if (t.closest('[data-next]')) return nextQuestion();
  if (t.closest('.blur-text')) t.closest('.blur-text').classList.remove('blur-text');
});

function syncToggles() {
  for (const [id, on] of [['btn-slow', ui.slow], ['btn-hide', ui.hide]]) {
    const b = $('#' + id); b.classList.toggle('active', on); b.setAttribute('aria-pressed', on);
  }
}
$('#btn-slow').onclick = () => { ui.slow = !ui.slow; store.set('slow', ui.slow); syncToggles(); };
$('#btn-hide').onclick = () => { ui.hide = !ui.hide; store.set('hide', ui.hide); syncToggles(); if (ui.tab === 'phrases') render(false); };

function syncTheme() {
  const dark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
  $('#btn-theme').innerHTML = dark ? `${ico('sun-fill')} <span>حالت روشن</span>` : `${ico('moon-stars-fill')} <span>حالت تیره</span>`;
}
$('#btn-theme').onclick = () => {
  const next = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-bs-theme', next);
  try { localStorage.setItem('theme', next); } catch { /* ignore */ }
  syncTheme();
};

/* ---------- PWA ---------- */
let deferredPrompt;
addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); deferredPrompt = e;
  $('#btn-install').classList.remove('d-none');
});
$('#btn-install').onclick = () => deferredPrompt && deferredPrompt.prompt();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));
}

/* ---------- start ---------- */
if ('speechSynthesis' in window) speechSynthesis.getVoices();
syncToggles(); syncTheme(); render(false);
