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
  ['verbs', 'pencil-square', 'صرف'], ['sounds', 'mic-fill', 'تلفظ'], ['dict', 'book-half', 'دیکشنری'], ['quiz', 'bullseye', 'آزمون'],
];
const GROUP_ICONS = ['person-badge', 'easel2', 'arrow-left-right', 'hand-index-thumb', 'mortarboard-fill', 'backpack2', 'spellcheck'];
const QM = [
  ['phrase', 'معنی عبارت', 'chat-dots'], ['verb', 'صرف فعل', 'pencil-square'], ['listen', 'شنیدن جمله', 'headphones'],
  ['num', 'اعداد', '123'], ['numl', 'شنیدن عدد', 'ear-fill'], ['let', 'حروف', 'alphabet-uppercase'],
];
const ui = { tab: 'phrases', verb: 0, dfilter: 'all', dq: '', fdeck: 'all', fdir: 'de', fcur: null, fprev: null, fflip: false, fconfirm: false, slow: store.get('slow', false), hide: store.get('hide', false) };
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

  dict: () => `
    ${['add', 'cards'].includes(ui.dfilter) ? '' : `<div class="input-group mb-2 shadow-sm rounded-4 overflow-hidden">
      <span class="input-group-text border-0">${ico('search')}</span>
      <input id="dq" type="search" class="form-control border-0" placeholder="جستجو: آلمانی یا فارسی…"
             autocomplete="off" autocapitalize="off" value="${attr(ui.dq)}"></div>`}
    <div class="d-flex flex-wrap gap-2 mb-3">${[['all', 'همه', 'book-half'], ['cards', 'فلش‌کارت', 'stack'], ['saved', 'ذخیره‌شده', 'star-fill'], ['add', 'کلمه‌ی من', 'plus-circle']].map(f =>
      `<button class="btn btn-sm rounded-pill ${ui.dfilter === f[0] ? 'btn-danger' : 'btn-outline-secondary'}" data-dfilter="${f[0]}">${ico(f[2])} ${f[1]}</button>`).join('')}</div>
    <div id="dres"></div>`,

  quiz: () => `
    <div class="d-flex flex-wrap gap-2 mb-3">${QM.map(m =>
      `<button class="btn btn-sm rounded-pill ${m[0] === quiz.mode ? 'btn-danger' : 'btn-outline-secondary'}" data-qmode="${m[0]}">${ico(m[2])} ${m[1]}</button>`).join('')}</div>
    <div class="card border-0 shadow-sm rounded-4"><div class="card-body" id="qa"></div></div>`,
};

/* ---------- dictionary ---------- */
const ART = { m: ['der', 'primary'], f: ['die', 'danger'], n: ['das', 'success'] };
const TYPE_LABEL = { v: 'فعل', p: 'عبارت', z: 'عدد', u: 'کلمه‌ی من' };
const normDe = s => s.toLowerCase().replace(/ß/g, 'ss').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/[.,!?]/g, '');
const normFa = s => s.replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[۰-۹]/g, d => d.charCodeAt(0) - 0x6F0)
  .replace(/[٠-٩]/g, d => d.charCodeAt(0) - 0x660).replace(/[\u200c\u064b-\u065f.,!?؟،()]/g, '').toLowerCase();
const entryDisp = e => (ART[e.t] ? ART[e.t][0] + ' ' : '') + e.de;

function dictEntries() {
  const seen = new Set(), out = [];
  const add = e => {
    e.key = e.t + ':' + e.de;
    const k = normDe(e.de);
    if (e.t !== 'u' && seen.has(k)) return;
    seen.add(k); out.push(e);
  };
  WORDS.forEach(([t, de, fa]) => add({ t, de, fa }));
  V.forEach(v => add({ t: 'v', de: v[0], fa: v[2] }));
  P.forEach(g => g[1].forEach(x => {
    if (x[0].includes('≠') || x[0].includes('/') || /^(der|die|das)\s/.test(x[0])) return;
    add({ t: 'p', de: x[0], fa: x[1] });
  }));
  NUMS.forEach(n => add({ t: 'z', de: n[1], fa: String(n[0]) }));
  store.get('mywords', []).forEach(w => add({ t: 'u', de: w.de, fa: w.fa }));
  out.forEach(e => { if (e.t === 'v') { const i = V.findIndex(v => v[0] === e.de); if (i >= 0) e.verb = i; } });
  return out;
}

function dictRow(e, saved) {
  const a = ART[e.t];
  return `<div class="list-group-item d-flex align-items-center gap-1 py-3 border-0 border-bottom">
    <div class="flex-grow-1">
      <div class="de" lang="de" dir="ltr">${a ? `<span class="badge text-bg-${a[1]} me-1">${a[0]}</span>` : ''}${attr(e.de)}</div>
      <div class="fa text-body-secondary">${attr(e.fa)}
        ${TYPE_LABEL[e.t] ? `<span class="badge rounded-pill bg-secondary-subtle text-secondary-emphasis">${TYPE_LABEL[e.t]}</span>` : ''}</div>
    </div>
    ${e.verb !== undefined ? `<button class="btn btn-sm btn-outline-secondary rounded-pill" data-goverb="${e.verb}">صرف</button>` : ''}
    ${e.t === 'u' ? `<button class="btn btn-link text-danger p-1" data-delword="${attr(e.key)}" aria-label="حذف">${ico('trash3')}</button>` : ''}
    <button class="btn btn-link text-warning fs-5 p-1" data-star="${attr(e.key)}" aria-label="ذخیره">${ico(saved ? 'star-fill' : 'star')}</button>
    ${sayBtn(entryDisp(e))}
  </div>`;
}

function renderDict() {
  const box = $('#dres');
  if (!box) return;
  if (ui.dfilter === 'cards') return renderCards();
  const saved = new Set(store.get('saved', []));
  const all = dictEntries();
  const rows = list => `<div class="list-group shadow-sm rounded-4">${list.map(e => dictRow(e, saved.has(e.key))).join('')}</div>`;
  if (ui.dfilter === 'add') {
    const mine = all.filter(e => e.t === 'u');
    box.innerHTML = `
      <div class="card border-0 shadow-sm rounded-4 mb-3"><div class="card-body">
        <label class="form-label small">کلمه‌ی آلمانی</label>
        <input id="nw-de" class="form-control mb-2" dir="ltr" lang="de" autocapitalize="off" placeholder="z.B. der Hund">
        <label class="form-label small">معنی فارسی</label>
        <input id="nw-fa" class="form-control mb-3" placeholder="مثلاً: سگ">
        <button class="btn btn-danger w-100" data-addword>${ico('plus-lg')} افزودن به دیکشنری</button>
      </div></div>
      ${mine.length ? `<h2 class="section-title">${ico('person-badge')} کلمه‌های من (${mine.length})</h2>${rows(mine)}` : ''}`;
    return;
  }
  let list = ui.dfilter === 'saved' ? all.filter(e => saved.has(e.key)) : all;
  const q = ui.dq.trim();
  if (q) {
    const qd = normDe(q), qf = normFa(q);
    const score = e => {
      const dw = normDe(e.de), dd = normDe(entryDisp(e)), f = normFa(e.fa);
      if (dw === qd || f === qf) return 0;
      if (dw.startsWith(qd) || f.startsWith(qf)) return 1;
      return dd.includes(qd) || f.includes(qf) ? 2 : 9;
    };
    list = list.map(e => [score(e), e]).filter(x => x[0] < 9).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  } else {
    list = [...list].sort((a, b) => normDe(a.de).localeCompare(normDe(b.de)));
  }
  box.innerHTML = list.length
    ? `<div class="small text-body-secondary mb-2">${list.length} مورد</div>${rows(list.slice(0, 300))}`
    : `<div class="text-center text-body-secondary py-5">${ico('search', 'fs-1 d-block mb-2')}${ui.dfilter === 'saved' ? 'هنوز چیزی ذخیره نکرده‌ای (⭐)' : 'چیزی پیدا نشد'}</div>`;
}
function toggleSaved(key) {
  const s = new Set(store.get('saved', []));
  s.has(key) ? s.delete(key) : s.add(key);
  store.set('saved', [...s]);
}
function addWord() {
  const de = $('#nw-de').value.trim(), fa = $('#nw-fa').value.trim();
  if (!de || !fa) return;
  store.set('mywords', [...store.get('mywords', []), { de, fa }]);
  renderDict();
}
function delWord(key) {
  store.set('mywords', store.get('mywords', []).filter(w => 'u:' + w.de !== key));
  renderDict();
}

/* ---------- flashcards (Leitner boxes, saved in localStorage) ---------- */
const BOX_DAYS = [0, 1, 2, 4, 8, 16];
const DECKS = [['all', 'همه'], ['saved', 'ذخیره‌شده'], ['n', 'اسم‌ها'], ['v', 'فعل‌ها'], ['p', 'عبارت‌ها'], ['z', 'عددها'], ['u', 'کلمه‌های من']];
function deckEntries() {
  const saved = new Set(store.get('saved', []));
  const test = { all: e => e.t !== 'z', saved: e => saved.has(e.key), n: e => !!ART[e.t], v: e => e.t === 'v',
    p: e => e.t === 'p', z: e => e.t === 'z', u: e => e.t === 'u' }[ui.fdeck];
  return dictEntries().filter(test);
}
function nextCard(deck, prev) {
  const L = store.get('leitner', {}), now = Date.now();
  const rec = e => L[e.key] || { box: 0, due: 0 };
  let due = deck.filter(e => rec(e).due <= now);
  if (due.length > 1) due = due.filter(e => e.key !== prev);
  if (!due.length) return null;
  const low = Math.min(...due.map(e => rec(e).box));
  const pool = due.filter(e => rec(e).box === low);
  return pool[Math.floor(Math.random() * pool.length)];
}
const cardFace = (e, side) => side === 'de'
  ? `<div class="de" lang="de" dir="ltr">${ART[e.t] ? `<span class="badge text-bg-${ART[e.t][1]} me-2 fs-6">${ART[e.t][0]}</span>` : ''}${attr(e.de)}</div>${sayBtn(entryDisp(e))}`
  : `<div class="display-6 fw-bold">${attr(e.fa)}</div>`;
const cardControls = () => ui.fflip
  ? `<div class="d-flex gap-2 mt-3">
       <button class="btn btn-outline-danger flex-fill py-3" data-fans="0">${ico('x-lg')} هنوز نه</button>
       <button class="btn btn-success flex-fill py-3" data-fans="1">${ico('check-lg')} بلدم</button></div>`
  : `<button class="btn btn-danger w-100 mt-3 py-3" data-flip>${ico('arrow-repeat')} نمایش جواب</button>`;

function renderCards() {
  const box = $('#dres');
  const deck = deckEntries(), L = store.get('leitner', {}), now = Date.now();
  const st = { fresh: 0, learn: 0, known: 0, due: 0 };
  deck.forEach(e => {
    const r = L[e.key];
    if (!r) { st.fresh++; st.due++; } else { r.box >= 4 ? st.known++ : st.learn++; if (r.due <= now) st.due++; }
  });
  let e = ui.fcur && deck.find(x => x.key === ui.fcur);
  const isNew = !e;
  if (!e) { e = nextCard(deck, ui.fprev); ui.fcur = e ? e.key : null; ui.fflip = false; }
  const pct = deck.length ? Math.round(st.known / deck.length * 100) : 0;
  let body;
  if (!deck.length) {
    body = `<div class="text-center text-body-secondary py-5">${ico('stack', 'fs-1 d-block mb-2')}${
      ui.fdeck === 'saved' ? 'هنوز کلمه‌ای را ⭐ نکرده‌ای' : ui.fdeck === 'u' ? 'هنوز کلمه‌ی شخصی اضافه نکرده‌ای' : 'کارتی وجود ندارد'}</div>`;
  } else if (!e) {
    const next = Math.min(...deck.map(x => (L[x.key] || { due: 0 }).due)) - now;
    body = `<div class="text-center py-4">${ico('trophy-fill', 'fs-1 d-block mb-2 text-warning')}
      <p class="fw-bold mb-1">همه‌ی کارت‌های این دسته مرور شد!</p>
      <p class="small text-body-secondary">مرور بعدی: ${next >= 864e5 ? Math.ceil(next / 864e5) + ' روز دیگر' : Math.max(1, Math.ceil(next / 36e5)) + ' ساعت دیگر'}</p>
      <button class="btn btn-outline-danger rounded-pill" data-fall>${ico('arrow-repeat')} مرور دوباره‌ی همه</button></div>`;
  } else {
    body = `<div class="flip ${ui.fflip ? 'on' : ''}" data-flip><div class="flip-inner">
        <div class="face">${cardFace(e, ui.fdir)}<small class="text-body-secondary">${ui.fdir === 'de' ? 'آلمانی' : 'فارسی'}</small></div>
        <div class="face back">${cardFace(e, ui.fdir === 'de' ? 'fa' : 'de')}</div></div></div>
      <div id="fctl">${cardControls()}</div>`;
  }
  box.innerHTML = `
    <div class="d-flex flex-wrap gap-2 mb-3">${DECKS.map(d =>
      `<button class="btn btn-sm rounded-pill ${ui.fdeck === d[0] ? 'btn-secondary' : 'btn-outline-secondary'}" data-fdeck="${d[0]}">${d[1]}</button>`).join('')}</div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <button class="btn btn-sm btn-outline-secondary rounded-pill" data-fdir>${ico('arrow-left-right')} ${ui.fdir === 'de' ? 'آلمانی ← فارسی' : 'فارسی ← آلمانی'}</button>
      <button class="btn btn-sm btn-link ${ui.fconfirm ? 'text-danger' : 'text-body-secondary'}" data-freset>${ico('trash3')} ${ui.fconfirm ? 'مطمئنی؟ دوباره بزن' : 'پاک‌کردن پیشرفت'}</button></div>
    <div class="d-flex flex-wrap gap-1 small mb-2">
      <span class="badge text-bg-secondary">جدید ${st.fresh}</span><span class="badge text-bg-warning">در حال یادگیری ${st.learn}</span>
      <span class="badge text-bg-success">بلد ${st.known}</span><span class="badge text-bg-danger me-auto">نوبت مرور ${st.due}</span></div>
    <div class="progress mb-3" style="height:6px"><div class="progress-bar bg-success" style="width:${pct}%"></div></div>
    ${body}`;
  if (e && isNew && ui.fdir === 'de') setTimeout(() => speak(entryDisp(e)), 250);
}
function flipCard() {
  const el = $('.flip');
  if (!el) return;
  ui.fflip = !ui.fflip;
  el.classList.toggle('on', ui.fflip);
  $('#fctl').innerHTML = cardControls();
  const e = dictEntries().find(x => x.key === ui.fcur);
  if (e && ui.fflip && ui.fdir === 'fa') speak(entryDisp(e));
}
function answerCard(ok) {
  if (!ui.fcur) return;
  const L = store.get('leitner', {});
  const r = L[ui.fcur] || { box: 0 };
  r.box = ok ? Math.min(5, r.box + 1) : 1;
  r.due = Date.now() + (ok ? BOX_DAYS[r.box] * 864e5 : 0);
  L[ui.fcur] = r;
  store.set('leitner', L);
  ui.fprev = ui.fcur; ui.fcur = null; ui.fflip = false; ui.fconfirm = false;
  renderCards();
}

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
  if (ui.tab === 'dict') renderDict();
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
  const df = t.closest('[data-dfilter]');
  if (df) { ui.dfilter = df.dataset.dfilter; return render(false); }
  const star = t.closest('[data-star]');
  if (star) { toggleSaved(star.dataset.star); return renderDict(); }
  const gov = t.closest('[data-goverb]');
  if (gov) { ui.verb = +gov.dataset.goverb; ui.tab = 'verbs'; return render(); }
  if (t.closest('[data-addword]')) return addWord();
  const dw = t.closest('[data-delword]');
  if (dw) return delWord(dw.dataset.delword);
  const fd = t.closest('[data-fdeck]');
  if (fd) { ui.fdeck = fd.dataset.fdeck; ui.fcur = null; ui.fconfirm = false; return renderCards(); }
  if (t.closest('[data-fdir]')) { ui.fdir = ui.fdir === 'de' ? 'fa' : 'de'; ui.fflip = false; ui.fconfirm = false; return renderCards(); }
  if (t.closest('[data-freset]')) {
    if (ui.fconfirm) { store.set('leitner', {}); ui.fconfirm = false; ui.fcur = null; } else ui.fconfirm = true;
    return renderCards();
  }
  if (t.closest('[data-flip]')) return flipCard();
  const fans = t.closest('[data-fans]');
  if (fans) return answerCard(fans.dataset.fans === '1');
  if (t.closest('[data-fall]')) {
    const L = store.get('leitner', {});
    deckEntries().forEach(e => { if (L[e.key]) L[e.key].due = 0; });
    store.set('leitner', L); ui.fcur = null; return renderCards();
  }
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

document.addEventListener('input', e => {
  if (e.target.id === 'dq') { ui.dq = e.target.value; renderDict(); }
});

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
