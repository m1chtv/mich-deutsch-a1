/* Deutsch A1 – class practice app | github.com/m1chtv
   Vanilla JS + Bootstrap 5 (RTL) + Bootstrap Icons.  Content lives in js/data.js and js/dict.js */
'use strict';

/* ================= helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const ico = (n, c = '') => `<i class="bi bi-${n} ${c}" aria-hidden="true"></i>`;
const shuffle = a => [...a].sort(() => Math.random() - 0.5);
const pick = (a, k) => shuffle(a).slice(0, k);
const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};
const ART = { m: ['der', 'primary'], f: ['die', 'danger'], n: ['das', 'success'] };
const capHi = s => attr(s).replace(/[A-ZÄÖÜ]/g, m => `<b class="text-brand">${m}</b>`);
const badge = t => (ART[t] ? `<span class="badge text-bg-${ART[t][1]} me-1">${ART[t][0]}</span>` : '');

/* ================= state ================= */
const TABS = [ // id, icon, short label, long label (desktop sidebar)
  ['phrases', 'chat-dots', 'عبارت‌ها', 'عبارت‌ها و کلمه‌ها'], ['numbers', '123', 'اعداد', 'اعداد'],
  ['alphabet', 'alphabet-uppercase', 'الفبا', 'الفبا و تلفظ'], ['verbs', 'pencil-square', 'فعل و جمله', 'فعل و ساختار جمله'],
  ['artikel', 'tags', 'آرتیکل', 'حرف تعریف (Artikel)'], ['dict', 'book-half', 'دیکشنری', 'دیکشنری و فلش‌کارت'],
  ['quiz', 'bullseye', 'آزمون', 'آزمون'],
];
const GROUP_ICONS = ['person-badge', 'easel2', 'arrow-left-right', 'hand-index-thumb', 'mortarboard-fill', 'backpack2', 'spellcheck', 'sunrise', 'question-circle', 'translate'];
const ui = {
  tab: 'phrases', verb: 0, slow: store.get('slow', false), hide: store.get('hide', false),
  psub: 'sent', vsub: 'conj', asub: 'letters', art: 'm', dfilter: 'all', dq: '', fdeck: 'all', fdir: 'de', fcur: null, fprev: null, fflip: false, fconfirm: false,
};

const seg = (items, cur, name) => `<div class="seg">${items.map(([id, label, icon]) =>
  `<button class="${id === cur ? 'on' : ''}" data-${name}="${id}">${ico(icon)} ${label}</button>`).join('')}</div>`;
const PAGE_DESC = {
  phrases: 'جمله‌های کلاس و کلمه‌های تابلو، به‌تفکیک موضوع', numbers: 'اعداد ۰ تا ۱۰۰ با تلفظ', alphabet: 'حروف، تلفظ ترکیب‌ها و حروف بزرگ',
  verbs: 'صرف فعل‌ها و ساختار جمله و سؤال', artikel: 'der / die / das و نشانه‌هایی برای یادگیری', dict: 'جستجو، فلش‌کارت و کلمه‌های شخصی', quiz: '۱۴ حالت تمرین، هر دور ۱۰ سؤال',
};
const pageHead = id => { const t = TABS.find(x => x[0] === id); return `<div class="page-head"><span class="pi">${ico(t[1])}</span><div><h1>${t[3]}</h1><p>${PAGE_DESC[id]}</p></div></div>`; };

/* ================= speech ================= */
function speak(text, slow = false) {
  if (!('speechSynthesis' in window)) return;
  const clean = String(text).replace(/\([^)]*\)/g, '').replace('≠', ', Gegenteil von, ').replace(' / ', ', ').replace(/_+/g, ' ').replace(/→/g, ', ');
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = 'de-DE';
  u.rate = (slow || ui.slow) ? 0.6 : 0.88;
  const voice = speechSynthesis.getVoices().find(v => v.lang && v.lang.startsWith('de'));
  if (voice) u.voice = voice;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
const sayBtn = (text, cls = 'btn-warning rounded-circle', slow = false) =>
  `<button class="btn ${cls} say-btn" data-say="${attr(text)}"${slow ? ' data-slow="1"' : ''} aria-label="پخش صدا">${ico('volume-up-fill')}</button>`;
const entryDisp = e => (ART[e.t] ? ART[e.t][0] + ' ' : '') + e.de;

/* ================= views ================= */
const grid = (cls, html) => `<div class="row ${cls} g-2">${html}</div>`;
const entryCard = (de, fa, t = '') => `
  <div class="col"><div class="entry">
    <div class="grow"><div class="de" lang="de" dir="ltr">${badge(t)}${attr(de)}</div>
      <div class="fa text-body-secondary ${ui.hide ? 'blur-text' : ''}">${attr(fa)}</div></div>
    ${sayBtn(ART[t] ? ART[t][0] + ' ' + de : de)}
  </div></div>`;
const section = (icon, title, body) => `<h2 class="section-title">${ico(icon)} ${title}</h2>${body}`;

const views = {
  phrases: () => {
    const groups = ui.psub === 'sent'
      ? P.map((g, i) => ({ icon: GROUP_ICONS[i] || 'dot', title: g[0].replace(/^\S+\s/, ''), items: g[1].map(x => entryCard(x[0], x[1])) }))
      : BOARD.map(g => ({ icon: g[1], title: g[0], items: g[2].map(([t, de, fa]) => entryCard(de, fa, t)) }));
    return `${seg([['sent', 'جمله‌ها و عبارت‌ها', 'chat-dots'], ['words', 'کلمه‌های تابلو', 'journal-text']], ui.psub, 'psub')}
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <span class="small text-body-secondary">${groups.length} موضوع · ${groups.reduce((n, g) => n + g.items.length, 0)} مورد</span>
        <span class="d-flex gap-2"><button class="btn btn-sm btn-outline-secondary" data-expand="1">${ico('arrows-expand')} باز کردن همه</button>
          <button class="btn btn-sm btn-outline-secondary" data-expand="0">${ico('arrows-collapse')} بستن همه</button></span></div>
      ${groups.map((g, i) => `<details class="grp" ${i === 0 ? 'open' : ''}>
        <summary><span class="grp-ico">${ico(g.icon)}</span><span class="grp-t">${g.title}</span><span class="badge rounded-pill text-bg-secondary">${g.items.length}</span>${ico('chevron-down', 'grp-chev')}</summary>
        <div class="grp-body">${grid('row-cols-1 row-cols-lg-2', g.items.join(''))}</div></details>`).join('')}`;
  },

  numbers: () => `
    <div class="alert alert-secondary small rounded-4">اعداد ۰ تا ۱۰۰. بالای ۲۰: <b>واحد + und + دهگان</b> (21 = einundzwanzig، 35 = fünfunddreißig)</div>
    ${grid('row-cols-3 row-cols-md-4 row-cols-lg-6', NUMS.map(n => `
      <div class="col"><button class="tile" data-say="${n[1]}" data-slow="1"><b>${n[0]}</b><span dir="ltr">${n[1]}</span></button></div>`).join(''))}`,

  letters: () => `
    <div class="alert alert-secondary small rounded-4">روی هر حرف بزن تا فقط نام همان حرف خوانده شود.</div>
    ${grid('row-cols-3 row-cols-md-5 row-cols-lg-6', ALPH.map(a => `
      <div class="col"><button class="tile" data-say="${LETTER_SAY[a[0]]}" data-slow="1">
        <b>${a[0] === 'ß' ? 'ß' : a[0] + a[0].toLowerCase()}</b><span>${a[1]} · ${a[2]}</span></button></div>`).join(''))}`,

  conj: () => {
    const v = V[ui.verb], pv = VFA[v[0]], irr = !!v[3];
    const rows = PR.map((p, i) => {
      const f = form(v, i);
      let html;
      if (irr) {
        const diff = !v[1] || f !== v[1] + EN[i];
        html = `<b class="${diff ? 'text-brand' : ''}">${f}</b>${diff && v[1] && (i === 1 || i === 2) ? ' <span class="text-warning">★</span>' : ''}`;
      } else {
        const cut = f.startsWith(v[1]) ? v[1].length : f.length - 1;
        html = `<span class="text-body-secondary">${f.slice(0, cut)}</span><b class="text-brand">${f.slice(cut)}</b>`;
      }
      return `<div class="conj">
        <div class="conj-p"><span class="de" dir="ltr">${PRO_FA[i][0]}</span><span class="fa">${PRO_FA[i][1]}</span></div>
        <div class="conj-f de" dir="ltr">${html}</div>
        ${sayBtn(PRO_DE[i] + ' ' + f, 'btn-warning btn-sm rounded-circle')}
        <div class="conj-m">${PRO_SHORT[i]} ${pv[i]}</div></div>`;
    }).join('');
    const ends = PRO_FA.map((p, i) => `<tr><td class="de" dir="ltr">${p[0]}</td><td>${p[1]}</td><td dir="ltr" class="text-brand fw-bold">-${EN[i]}</td></tr>`).join('');
    const chip = ([x, i]) => `<button class="btn btn-sm rounded-pill ${i === ui.verb ? 'btn-brand' : 'btn-outline-secondary'}" data-verb="${i}">${x[0]}</button>`;
    const all = V.map((x, i) => [x, i]);
    const side = irr ? `
        <h2 class="h6" dir="ltr">${ico('info-circle', 'text-brand')} Unregelmäßige Verben</h2>
        <p class="mb-1" dir="ltr">Es gibt in zweiten und dritten Person singular Unterschied.</p>
        <p class="small text-body-secondary">(du و er / es / sie) — علامت ★ یعنی همین‌جا تفاوت هست.</p>
        ${IRR_NOTE[v[0]] ? `<p class="mb-2"><span class="badge text-bg-warning" dir="ltr">${IRR_NOTE[v[0]]}</span> <span class="small text-body-secondary">تغییر حرف در du و er / es / sie</span></p>` : ''}
        <p class="mb-0" dir="ltr"><b>Tipp:</b> Sie müssen nur es auswendig lernen.</p>`
      : `
        <h2 class="h6">${ico('person-lines-fill', 'text-brand')} ضمیر شخصی و پایانه (Personalpronomen)</h2>
        <p class="small text-body-secondary mb-2">فرمول: <b>ریشه فعل (Verbstamm) + پایانه مناسب (Endung)</b></p>
        <table class="table table-sm align-middle mb-0"><tbody>${ends}</tbody></table>`;
    return `
      <div class="row g-2 mb-3">
        <div class="col-md-6"><div class="rule"><div class="d-flex align-items-center gap-2 mb-1"><span class="badge rounded-pill text-bg-secondary">1</span><b dir="ltr">regelmäßige Verben</b><span class="badge text-bg-success">95%</span></div>
          <div class="small text-body-secondary">مثل <b dir="ltr">wohnen</b>: ریشه + پایانه</div></div></div>
        <div class="col-md-6"><div class="rule"><div class="d-flex align-items-center gap-2 mb-1"><span class="badge rounded-pill text-bg-secondary">2</span><b dir="ltr">unregelmäßige Verben</b><span class="badge text-bg-warning">5%</span></div>
          <div class="small text-body-secondary">در شخص دوم و سوم مفرد (du و er / es / sie) تفاوت وجود دارد</div></div></div>
      </div>
      <div class="small text-body-secondary mb-1" dir="ltr">regelmäßige Verben</div>
      <div class="d-flex flex-wrap gap-2 mb-3" dir="ltr">${all.filter(([x]) => !x[3]).map(chip).join('')}</div>
      <div class="small text-body-secondary mb-1" dir="ltr">unregelmäßige Verben</div>
      <div class="d-flex flex-wrap gap-2 mb-3" dir="ltr">${all.filter(([x]) => x[3]).map(chip).join('')}</div>
      <div class="row g-3">
        <div class="col-lg-5"><div class="card rounded-4 h-100"><div class="card-body">${side}</div></div></div>
        <div class="col-lg-7"><div class="card rounded-4 h-100"><div class="card-body">
          <p class="mb-1"><b class="de" dir="ltr">${v[0]}</b> <span class="text-body-secondary">= ${v[2]}</span> ${irr ? '<span class="badge text-bg-warning">بی‌قاعده</span>' : ''}</p>
          ${rows}
          ${v[0] === 'heißen' ? '<div class="alert alert-warning small py-2 mt-2 mb-0">نکته: du heißt (نه heißst) — چون ß و s کنار هم می‌آیند، یکی حذف می‌شود.</div>' : ''}
          <button class="btn btn-brand mt-3" data-slow="1" data-say="${attr(PR.map((p, i) => PRO_DE[i] + ' ' + form(v, i)).join(', '))}">${ico('play-fill')} همه را آهسته بخوان</button>
        </div></div></div>
      </div>`;
  },

  verbs: () => `${seg([['conj', 'صرف فعل', 'pencil-square'], ['satz', 'جمله و سؤال', 'diagram-3']], ui.vsub, 'vsub')}${views[ui.vsub]()}`,

  satz: () => {
    const tok = ([t, r, p]) => `<span class="tk ${r ? 'tk-' + r : ''}"><b dir="ltr">${attr(t)}</b>${p ? `<i>${p}</i>` : ''}</span>`;
    const line = (toks, fa) => `<div class="d-flex align-items-center gap-2 mb-2"><div class="flex-grow-1"><div dir="ltr">${toks.map(tok).join('')}</div>
      ${fa ? `<div class="fa text-body-secondary px-1">${attr(fa)}</div>` : ''}</div>${sayBtn(toks.map(t => t[0]).join(' '), 'btn-warning btn-sm rounded-circle')}</div>`;
    const pair = e => `<div class="mb-3 pb-2 border-bottom">${line(e.q, e.faQ)}${line(e.a, e.faA)}</div>`;
    const formula = parts => `<div dir="ltr" class="mb-3">${parts.map(tok).join('<span class="mx-1">+</span>')}<span class="tk">.....?</span></div>`;
    const head = (n, t) => `<div class="d-flex align-items-center gap-2 mb-2"><span class="badge rounded-pill text-bg-secondary">${n}</span><b class="fs-6" dir="ltr">${t}</b></div>`;
    return `
      <div class="card rounded-4 mb-3"><div class="card-body">
        <h2 class="h5 mb-1" dir="ltr">Wie kann man einen Satz oder Frage bilden?</h2>
        <p class="small text-body-secondary mb-0">چطور می‌شود یک جمله یا سؤال ساخت؟</p></div></div>
      <div class="card rounded-4 mb-3"><div class="card-body">
        <p class="mb-1" dir="ltr"><b>Tipp:</b> Im Deutsch steht Verb immer an Position <span class="tk tk-v">2</span></p>
        <p class="small text-body-secondary">نکته: در آلمانی فعل همیشه در جایگاه ۲ قرار دارد.</p>
        <div class="small text-body-secondary mb-2" dir="ltr">z.B.</div>${SATZ.stmt.map(e => line(e.q, e.fa)).join('')}</div></div>
      ${section('question-circle', 'Fragen', '')}
      <div class="card rounded-4 mb-3"><div class="card-body">${head(1, 'W-Frage')}
        ${formula([['W-Frage', 'w', 1], ['Verb', 'v', 2], ['Subjekt', 's', 3]])}
        <div class="small text-body-secondary mb-2" dir="ltr">z.B.</div>${SATZ.w.map(pair).join('')}</div></div>
      <div class="card rounded-4 mb-3"><div class="card-body">${head(2, 'Ja oder Nein-Frage')}
        ${formula([['Verb', 'v', 1], ['Subjekt', 's', 2]])}
        ${SATZ.yn.map(pair).join('')}</div></div>
      ${section('people', 'formell / informell', '')}
      <div class="card rounded-4 mb-3"><div class="card-body">${SATZ.pairs.map(p => `
        <div class="mb-3 pb-2 border-bottom"><div class="row g-2">
          <div class="col-md-6"><span class="badge text-bg-secondary mb-1">formell</span>${line(p.formal)}</div>
          <div class="col-md-6"><span class="badge text-bg-secondary mb-1">informell</span>${line(p.informal)}</div></div>
          <div class="fa text-body-secondary mb-2">${p.fa}</div>
          ${p.a.map(x => `<div class="d-flex align-items-center gap-2 mb-1"><div class="flex-grow-1"><div class="de" dir="ltr" style="font-size:1rem">${attr(x[0])}</div>
            <div class="fa text-body-secondary">${attr(x[1])}</div></div>${sayBtn(x[0], 'btn-warning btn-sm rounded-circle')}</div>`).join('')}</div>`).join('')}</div></div>`;
  },

  soundsPage: () => `
    <div class="alert alert-secondary small rounded-4">روی کلمه‌ها بزن تا تلفظ را بشنوی.</div>
    ${grid('row-cols-1 row-cols-lg-2', S.map(s => `
      <div class="col"><div class="card rounded-4 h-100"><div class="card-body">
        <div class="d-flex align-items-center gap-3 mb-2"><span class="display-6 fw-bold text-brand" dir="ltr">${s[0]}</span><span>${s[1]}</span></div>
        <div class="d-flex flex-wrap gap-2" dir="ltr">${s[2].split(', ').map(w =>
          `<button class="btn btn-sm btn-outline-secondary rounded-pill" data-say="${w}" data-slow="1">${ico('volume-up-fill')} ${w}</button>`).join('')}</div>
      </div></div></div>`).join(''))}`,

  alphabet: () => `${seg([['letters', 'حروف', 'alphabet-uppercase'], ['soundsPage', 'ترکیب حروف و تلفظ', 'mic-fill'], ['caps', 'حروف بزرگ', 'type']], ui.asub, 'asub')}${views[ui.asub]()}`,

  caps: () => `
    <div class="card rounded-4 mb-3"><div class="card-body">
      <h2 class="h6 mb-1" dir="ltr">${ico('type', 'text-brand')} Wann müssen wir den ersten Buchstaben großschreiben?</h2>
      <p class="small text-body-secondary mb-0">کی باید حرف اول را بزرگ بنویسیم؟ در ۳ حالت (Im 3 Situationen):</p></div></div>
    ${grid('row-cols-1 row-cols-lg-3', CAPS.map((c, i) => `
      <div class="col"><div class="card rounded-4 h-100"><div class="card-body">
        <div class="d-flex align-items-center gap-2 mb-1"><span class="badge rounded-pill text-bg-danger">${i + 1}</span><b>${c.title}</b></div>
        <p class="small text-body-secondary">${c.fa}</p>
        ${c.ex.map(x => `<div class="d-flex align-items-center gap-2 mb-2"><div class="de flex-grow-1" dir="ltr">${capHi(x)}</div>${sayBtn(x, 'btn-warning btn-sm rounded-circle')}</div>`).join('')}
      </div></div></div>`).join(''))}
    <div class="alert alert-secondary small rounded-4 mt-3">sagen = گفتن · buchstabieren = هجی کردن (حرف‌به‌حرف گفتن). مثلاً: «Wie schreibt man das؟» ◂ «Buchstabieren Sie bitte!»</div>
    <button class="btn btn-brand rounded-pill" data-qgo="caps">${ico('bullseye')} تمرین حروف بزرگ</button>`,

  artikel: () => {
    const GN = { m: ['مذکر', 'maskulin', 'ein', 'ein Tisch'], n: ['خنثی', 'neutrum', 'ein', 'ein Fenster'], f: ['مؤنث', 'feminin', 'eine', 'eine Tür'] };
    const rowsOf = g => ARTIKEL[g].map(([de, fa]) => `<div class="d-flex align-items-center gap-2 mb-2">
        <div class="flex-grow-1"><div class="de" dir="ltr" style="font-size:1.05rem">${attr(de)}</div>
          <div class="fa text-body-secondary ${ui.hide ? 'blur-text' : ''}">${attr(fa)}</div></div>${sayBtn(de, 'btn-warning btn-sm rounded-circle')}</div>`).join('');
    const saved = new Set(store.get('saved', []));
    const nouns = dictEntries().filter(e => e.t === ui.art).sort((a, b) => normDe(a.de).localeCompare(normDe(b.de)));
    return `
      <div class="card rounded-4 mb-3"><div class="card-body d-flex align-items-start gap-2"><div class="flex-grow-1">
        <h2 class="h6 mb-1" dir="ltr">Alle Nomen haben Artikel im Deutsch.</h2>
        <p class="small text-body-secondary mb-2">همه‌ی اسم‌ها در آلمانی یک حرف تعریف (Artikel) دارند:
          <b class="text-primary">der</b> · <b class="text-brand">die</b> · <b class="text-success">das</b></p>
        <p class="mb-0" dir="ltr"><b>Tipp:</b> Sie müssen nur auswendig lernen.</p>
        <p class="small text-body-secondary mb-0">نکته: فقط باید حفظ کنی؛ هر اسم را همیشه همراه artikelش یاد بگیر.</p></div>
        ${sayBtn('Alle Nomen haben Artikel im Deutsch. Tipp: Sie müssen nur auswendig lernen.')}</div></div>
      ${grid('row-cols-1 row-cols-md-3', ['m', 'n', 'f'].map(g => `
        <div class="col"><div class="card rounded-4 h-100"><div class="card-body">
          <div class="d-flex align-items-center gap-2 mb-1"><span class="badge fs-5 text-bg-${ART[g][1]}">${ART[g][0]}</span><b>${GN[g][0]}</b><span class="text-body-secondary small" dir="ltr">${GN[g][1]}</span></div>
          <p class="small text-body-secondary">نامعین: <b dir="ltr">${GN[g][3]}</b></p>${rowsOf(g)}</div></div></div>`).join(''))}
      <div class="card rounded-4 mt-3"><div class="card-body"><h2 class="h6">جدول خلاصه</h2>
        <table class="table table-sm align-middle text-center mb-0"><thead><tr><th>جنس</th><th>معین</th><th>نامعین</th><th>جمع (همه)</th></tr></thead><tbody>
          ${['m', 'n', 'f'].map(g => `<tr><td>${GN[g][0]}</td><td><span class="badge text-bg-${ART[g][1]}">${ART[g][0]}</span></td><td dir="ltr">${GN[g][2]}</td><td><span class="badge text-bg-danger">die</span></td></tr>`).join('')}
        </tbody></table></div></div>
      <h2 class="section-title">${ico('lightbulb')} نشانه‌هایی که کمک می‌کنند (قاعده‌ی کلی؛ استثنا دارد)</h2>
      ${grid('row-cols-1 row-cols-lg-3', ART_TIPS.map(t => `<div class="col"><div class="entry"><span class="badge fs-6 text-bg-${t[1]}">${t[0]}</span>
        <div class="grow"><div class="fw-bold" dir="ltr">${t[2]}</div><div class="small text-body-secondary" dir="ltr">${t[3]}</div></div></div></div>`).join(''))}
      <h2 class="section-title">${ico('collection')} همه‌ی اسم‌های دیکشنری</h2>
      <div class="d-flex flex-wrap gap-2 mb-2">${['m', 'n', 'f'].map(g =>
        `<button class="btn btn-sm rounded-pill ${ui.art === g ? 'btn-' + ART[g][1] : 'btn-outline-' + ART[g][1]}" data-artf="${g}">${ART[g][0]}</button>`).join('')}</div>
      <div class="small text-body-secondary mb-2">${nouns.length} اسم</div>
      ${grid('row-cols-1 row-cols-lg-2', nouns.map(e => dictRow(e, saved.has(e.key))).join(''))}
      <button class="btn btn-brand rounded-pill mt-3" data-qgo="artikel">${ico('bullseye')} تمرین der / die / das</button>`;
  },

  dict: () => `
    ${['add', 'cards'].includes(ui.dfilter) ? '' : `<div class="input-group mb-2 shadow-sm rounded-4 overflow-hidden">
      <span class="input-group-text border-0">${ico('search')}</span>
      <input id="dq" type="search" class="form-control border-0" placeholder="جستجو: آلمانی یا فارسی…" autocomplete="off" autocapitalize="off" value="${attr(ui.dq)}"></div>`}
    ${seg([['all', 'همه', 'book-half'], ['cards', 'فلش‌کارت', 'stack'], ['saved', 'ذخیره‌شده', 'star-fill'], ['add', 'کلمه‌ی من', 'plus-circle']], ui.dfilter, 'dfilter')}
    <div id="dres"></div>`,

  quiz: () => '<div id="qroot"></div>',
};

/* ================= dictionary ================= */
const TYPE_LABEL = { v: 'فعل', p: 'عبارت', z: 'عدد', u: 'کلمه‌ی من' };
const normDe = s => s.toLowerCase().replace(/ß/g, 'ss').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/[.,!?]/g, '');
const normFa = s => s.replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[۰-۹]/g, d => d.charCodeAt(0) - 0x6F0)
  .replace(/[٠-٩]/g, d => d.charCodeAt(0) - 0x660).replace(/[\u200c\u064b-\u065f.,!?؟،()]/g, '').toLowerCase();

function dictEntries() {
  const seen = new Set(), out = [];
  const add = e => {
    e.key = e.t + ':' + e.de;
    const k = normDe(e.de);
    if (e.t !== 'u' && seen.has(k)) return;
    seen.add(k); out.push(e);
  };
  WORDS.forEach(([t, de, fa]) => add({ t, de, fa }));
  BOARD.forEach(g => g[2].forEach(([t, de, fa]) => add({ t, de, fa })));
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
  return `<div class="col"><div class="entry">
    <div class="grow">
      <div class="de" lang="de" dir="ltr">${badge(e.t)}${attr(e.de)}</div>
      <div class="fa text-body-secondary">${attr(e.fa)}
        ${TYPE_LABEL[e.t] ? `<span class="badge rounded-pill bg-secondary-subtle text-secondary-emphasis">${TYPE_LABEL[e.t]}</span>` : ''}</div>
    </div>
    ${e.verb !== undefined ? `<button class="btn btn-sm btn-outline-secondary rounded-pill" data-goverb="${e.verb}">صرف</button>` : ''}
    ${e.t === 'u' ? `<button class="btn btn-link text-brand p-1" data-delword="${attr(e.key)}" aria-label="حذف">${ico('trash3')}</button>` : ''}
    <button class="btn btn-link text-warning fs-5 p-1" data-star="${attr(e.key)}" aria-label="ذخیره">${ico(saved ? 'star-fill' : 'star')}</button>
    ${sayBtn(entryDisp(e))}
  </div></div>`;
}

function renderDict() {
  const box = $('#dres');
  if (!box) return;
  if (ui.dfilter === 'cards') return renderCards();
  const saved = new Set(store.get('saved', []));
  const all = dictEntries();
  const rows = list => grid('row-cols-1 row-cols-lg-2', list.map(e => dictRow(e, saved.has(e.key))).join(''));
  if (ui.dfilter === 'add') {
    const mine = all.filter(e => e.t === 'u');
    box.innerHTML = `
      <div class="card rounded-4 mb-3 narrow"><div class="card-body">
        <label class="form-label small">کلمه‌ی آلمانی</label>
        <input id="nw-de" class="form-control mb-2" dir="ltr" lang="de" autocapitalize="off" placeholder="z.B. der Hund">
        <label class="form-label small">معنی فارسی</label>
        <input id="nw-fa" class="form-control mb-3" placeholder="مثلاً: سگ">
        <button class="btn btn-brand w-100" data-addword>${ico('plus-lg')} افزودن به دیکشنری</button>
      </div></div>
      ${mine.length ? section('person-badge', `کلمه‌های من (${mine.length})`, rows(mine)) : ''}`;
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

/* ================= flashcards (Leitner boxes) ================= */
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
       <button class="btn btn-outline-danger flex-fill py-3" data-fans="0">${ico('x-lg')} هنوز نه <kbd class="d-none d-lg-inline">1</kbd></button>
       <button class="btn btn-success flex-fill py-3" data-fans="1">${ico('check-lg')} بلدم <kbd class="d-none d-lg-inline">2</kbd></button></div>`
  : `<button class="btn btn-brand w-100 mt-3 py-3" data-flip>${ico('arrow-repeat')} نمایش جواب <kbd class="d-none d-lg-inline">Space</kbd></button>`;

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
  box.innerHTML = `<div class="narrow">
    <div class="d-flex flex-wrap gap-2 mb-3">${DECKS.map(d =>
      `<button class="btn btn-sm rounded-pill ${ui.fdeck === d[0] ? 'btn-secondary' : 'btn-outline-secondary'}" data-fdeck="${d[0]}">${d[1]}</button>`).join('')}</div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <button class="btn btn-sm btn-outline-secondary rounded-pill" data-fdir>${ico('arrow-left-right')} ${ui.fdir === 'de' ? 'آلمانی ← فارسی' : 'فارسی ← آلمانی'}</button>
      <button class="btn btn-sm btn-link ${ui.fconfirm ? 'text-brand' : 'text-body-secondary'}" data-freset>${ico('trash3')} ${ui.fconfirm ? 'مطمئنی؟ دوباره بزن' : 'پاک‌کردن پیشرفت'}</button></div>
    <div class="d-flex flex-wrap gap-1 small mb-2">
      <span class="badge text-bg-secondary">جدید ${st.fresh}</span><span class="badge text-bg-warning">در حال یادگیری ${st.learn}</span>
      <span class="badge text-bg-success">بلد ${st.known}</span><span class="badge text-bg-danger me-auto">نوبت مرور ${st.due}</span></div>
    <div class="progress mb-3" style="height:6px"><div class="progress-bar bg-success" style="width:${pct}%"></div></div>
    ${body}</div>`;
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

/* ================= quiz ================= */
const ROUND = 10;
const MODES = [
  { id: 'vocab', title: 'کلمه‌ها', desc: 'آلمانی ← فارسی', icon: 'translate' },
  { id: 'vocab2', title: 'ترجمه به آلمانی', desc: 'فارسی ← آلمانی', icon: 'arrow-left-right' },
  { id: 'artikel', title: 'der / die / das', desc: 'حرف تعریف اسم', icon: 'tags' },
  { id: 'verb', title: 'صرف فعل', desc: 'جای خالی', icon: 'pencil-square' },
  { id: 'verbfa', title: 'فعل از روی فارسی', desc: '«من می‌آیم» ← ich komme', icon: 'chat-left-text' },
  { id: 'listen', title: 'شنیدن', desc: 'بشنو و انتخاب کن', icon: 'headphones' },
  { id: 'spell', title: 'املا', desc: 'بشنو و بنویس', icon: 'keyboard' },
  { id: 'order', title: 'جمله‌سازی', desc: 'کلمه‌ها را مرتب کن', icon: 'text-paragraph' },
  { id: 'num', title: 'اعداد', desc: 'رقم ← کلمه', icon: '123' },
  { id: 'numl', title: 'شنیدن عدد', desc: 'بشنو و رقم را بزن', icon: 'ear-fill' },
  { id: 'let', title: 'حروف', desc: 'نام حرف را بشنو', icon: 'alphabet-uppercase' },
  { id: 'caps', title: 'حروف بزرگ', desc: 'کدام درست نوشته شده؟', icon: 'type' },
  { id: 'seq', title: 'ترتیب', desc: 'سلام‌ها و اعداد', icon: 'list-ol' },
  { id: 'mix', title: 'ترکیبی', desc: 'همه‌چیز با هم', icon: 'shuffle' },
];
const MODE = Object.fromEntries(MODES.map(m => [m.id, m]));
const quiz = { stage: 'home', mode: null, list: [], i: 0, score: 0, streak: 0, bestStreak: 0, wrong: [], cur: null, built: [], retry: false };

const mc = o => ({ kind: 'mc', ...o, opts: o.fixed || shuffle([...new Set([o.ans, ...o.wrong])]) });

function make(mode) {
  if (mode === 'mix') mode = pick(MODES.filter(m => m.id !== 'mix').map(m => m.id), 1)[0];
  const E = dictEntries().filter(e => e.t !== 'z');
  const W = E.filter(e => e.t !== 'p');
  const others = (list, c, f) => pick(list.filter(x => x !== c && f(x) !== f(c)), 3).map(f);
  switch (mode) {
    case 'vocab': { const c = pick(E, 1)[0];
      return mc({ mode, q: entryDisp(c), say: entryDisp(c), after: entryDisp(c), ans: c.fa, wrong: others(E, c, x => x.fa), optRtl: true }); }
    case 'vocab2': { const c = pick(E, 1)[0];
      return mc({ mode, q: c.fa, qRtl: true, after: entryDisp(c), ans: entryDisp(c), wrong: others(E, c, entryDisp) }); }
    case 'artikel': { const c = pick(E.filter(e => ART[e.t]), 1)[0];
      return mc({ mode, q: c.de, say: entryDisp(c), hint: c.fa, after: entryDisp(c), ans: ART[c.t][0], fixed: ['der', 'die', 'das'], wrong: [] }); }
    case 'verb': { const v = pick(V, 1)[0], i = Math.floor(Math.random() * 6), ans = form(v, i);
      const forms = [...new Set(v[3] ? [...v[3], v[1] ? v[1] + EN[i] : ''] : EN.map(e => v[1] + e))].filter(x => x && x !== ans);
      return mc({ mode, q: `${PRO_DE[i]} ___ (${v[0]})`, hint: `${PRO_SHORT[i]} ${VFA[v[0]][i]}`, after: `${PRO_DE[i]} ${ans}`, ans, wrong: pick(forms, 3) }); }
    case 'verbfa': { const v = pick(V, 1)[0], i = Math.floor(Math.random() * 6);
      const ans = `${PRO_DE[i]} ${form(v, i)}`;
      return mc({ mode, q: `${PRO_SHORT[i]} ${VFA[v[0]][i]}`, qRtl: true, after: ans, ans,
        wrong: pick([0, 1, 2, 3, 4, 5].filter(j => j !== i && form(v, j) !== form(v, i)), 3).map(j => `${PRO_DE[j]} ${form(v, j)}`) }); }
    case 'listen': { const c = pick(E, 1)[0];
      return mc({ mode, q: null, say: entryDisp(c), after: entryDisp(c), ans: entryDisp(c), wrong: others(E, c, entryDisp) }); }
    case 'spell': { const c = pick(W.filter(e => /^[A-Za-zÄÖÜäöüß]+$/.test(e.de)), 1)[0];
      return { kind: 'type', mode, q: null, say: c.de, hint: c.fa, after: entryDisp(c), ans: c.de }; }
    case 'order': { const S2 = P.flatMap(g => g[1]).filter(x => !/[≠/]/.test(x[0]) && x[0].split(' ').length >= 3 && x[0].split(' ').length <= 7);
      const c = pick(S2, 1)[0], tokens = c[0].split(' ');
      return { kind: 'order', mode, q: c[1], qRtl: true, tokens: shuffle(tokens), ans: c[0], after: c[0] }; }
    case 'caps': {
      if (Math.random() < 0.5) {
        const c = pick(E.filter(e => ART[e.t]), 1)[0], ok = `${ART[c.t][0]} ${c.de}`;
        return mc({ mode, q: 'کدام درست نوشته شده؟', qRtl: true, after: ok, ans: ok, wrong: [`${ART[c.t][0]} ${c.de.toLowerCase()}`] });
      }
      const s = pick(CAPS[2].ex, 1)[0];
      return mc({ mode, q: 'کدام درست نوشته شده؟', qRtl: true, after: s, ans: s, wrong: [s.toLowerCase(), s.charAt(0).toLowerCase() + s.slice(1)] });
    }
    case 'seq': {
      let seq, q;
      if (Math.random() < 0.5) {
        const day = ['Guten Morgen', 'Guten Tag', 'Guten Abend', 'Gute Nacht'], len = 3 + Math.floor(Math.random() * 2);
        const st = Math.floor(Math.random() * (day.length - len + 1));
        seq = day.slice(st, st + len); q = 'سلام‌ها را به ترتیب روز مرتب کن';
      } else {
        const st = Math.floor(Math.random() * 17);
        seq = NUMS.slice(st, st + 4).map(n => n[1]); q = 'اعداد را به ترتیب (از کوچک به بزرگ) مرتب کن';
      }
      return { kind: 'order', mode, q, qRtl: true, tokens: shuffle(seq), sep: ' → ', ans: seq.join(' → '), after: seq.join(', ') };
    }
    case 'num': { const c = pick(NUMS, 1)[0];
      return mc({ mode, q: String(c[0]), after: c[1], ans: c[1], wrong: others(NUMS, c, x => x[1]) }); }
    case 'numl': { const c = pick(NUMS, 1)[0];
      return mc({ mode, q: null, say: c[1], after: c[1], ans: String(c[0]), wrong: others(NUMS, c, x => String(x[0])) }); }
    default: { const c = pick(ALPH, 1)[0];
      return mc({ mode, q: null, say: LETTER_SAY[c[0]], after: LETTER_SAY[c[0]], ans: c[0], wrong: others(ALPH, c, x => x[0]) }); }
  }
}

function startQuiz(mode, list) {
  Object.assign(quiz, { stage: 'play', mode, i: 0, score: 0, streak: 0, bestStreak: 0, wrong: [], retry: !!list });
  if (!list) {
    list = [];
    for (let tries = 0; list.length < ROUND && tries < 80; tries++) {
      const q = make(mode), id = q.mode + (q.q ?? '') + (q.say ?? '') + q.ans;
      if (!list.some(x => x.id === id)) list.push({ ...q, id });
    }
  } else list = list.map(q => ({ ...q, done: false, opts: q.kind === 'mc' && !q.fixed ? shuffle(q.opts) : q.opts }));
  quiz.list = list; quiz.cur = list[0]; quiz.built = [];
  renderQuiz();
}

function renderQuiz() {
  const root = $('#qroot');
  if (!root) return;
  if (quiz.stage === 'play') return renderQ();
  if (quiz.stage === 'result') return renderResult();
  const best = store.get('qbest', {});
  root.innerHTML = `<div class="alert alert-secondary small rounded-4">هر دور ${ROUND} سؤال دارد. یک حالت را انتخاب کن.</div>
    ${grid('row-cols-2 row-cols-md-3 row-cols-lg-4', MODES.map(m => `<div class="col"><button class="mode-card" data-qstart="${m.id}">
      ${ico(m.icon)}<b>${m.title}</b><span>${m.desc}</span>${best[m.id] != null ? `<small class="badge text-bg-success mt-1">بهترین ${best[m.id]}٪</small>` : ''}</button></div>`).join(''))}`;
}

function renderQ() {
  const q = quiz.cur, n = quiz.list.length;
  const prompt = `<div class="qtitle" dir="${q.qRtl ? 'rtl' : 'ltr'}" lang="${q.qRtl ? 'fa' : 'de'}">${q.q ?? ico('volume-up-fill', 'text-brand')}</div>
    ${q.hint ? `<p class="text-center text-body-secondary small">${q.kind === 'type' ? 'معنی: ' : ''}${attr(q.hint)}</p>` : ''}
    ${q.say ? `<div class="text-center mb-3"><button class="btn btn-brand rounded-pill" data-say="${attr(q.say)}">${ico('volume-up-fill')} پخش دوباره</button>
      <button class="btn btn-outline-secondary rounded-pill" data-say="${attr(q.say)}" data-slow="1">${ico('hourglass-split')} آهسته</button></div>` : ''}`;
  let body;
  if (q.kind === 'type') {
    body = `<input id="sp-in" class="form-control form-control-lg text-center" dir="ltr" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="…">
      <div class="d-flex justify-content-center gap-2 my-2">${['ä', 'ö', 'ü', 'ß'].map(c => `<button class="btn btn-outline-secondary" data-ins="${c}">${c}</button>`).join('')}</div>
      <button class="btn btn-brand w-100 py-2" data-check>${ico('check-lg')} بررسی</button>`;
  } else if (q.kind === 'order') {
    body = `<div id="order"></div>`;
  } else {
    body = `<div class="opts" id="opts">${q.opts.map((o, i) =>
      `<button class="btn btn-outline-secondary opt py-3 fw-semibold" data-opt="${attr(o)}" ${q.optRtl ? '' : 'dir="ltr"'}><kbd>${i + 1}</kbd>${o}</button>`).join('')}</div>`;
  }
  $('#qroot').innerHTML = `<div class="narrow">
    <div class="d-flex align-items-center gap-2 mb-3">
      <button class="btn btn-sm btn-outline-secondary rounded-pill" data-qhome aria-label="خروج">${ico('x-lg')}</button>
      <div class="progress flex-grow-1" style="height:8px"><div class="progress-bar bg-danger" style="width:${quiz.i / n * 100}%"></div></div>
      <span class="small text-body-secondary">${quiz.i + 1}/${n}</span><span class="small">${ico('fire', 'text-brand')} ${quiz.streak}</span></div>
    <div class="card rounded-4"><div class="card-body p-4">
      <div class="small text-body-secondary text-center">${ico(MODE[q.mode].icon)} ${MODE[q.mode].title}</div>
      ${prompt}${body}<div id="fb"></div></div></div></div>`;
  if (q.kind === 'order') renderOrder();
  if (q.kind === 'type') $('#sp-in').focus({ preventScroll: true });
  if (q.say) setTimeout(() => speak(q.say), 250);
}

function renderOrder() {
  const q = quiz.cur;
  const free = q.tokens.map((t, i) => [t, i]).filter(([, i]) => !quiz.built.includes(i));
  $('#order').innerHTML = `
    <div class="order-box" dir="ltr">${quiz.built.map((i, p) => `<button class="chip-w" data-obuilt="${p}" ${q.done ? 'disabled' : ''}>${attr(q.tokens[i])}</button>`).join('')}</div>
    <div class="text-center mb-3" dir="ltr">${free.map(([t, i]) => `<button class="chip-w" data-otok="${i}" ${q.done ? 'disabled' : ''}>${attr(t)}</button>`).join('')}</div>
    <div class="d-flex gap-2"><button class="btn btn-outline-secondary" data-oclear ${q.done ? 'disabled' : ''}>${ico('arrow-counterclockwise')}</button>
      <button class="btn btn-brand flex-grow-1 py-2" data-check ${q.done ? 'disabled' : ''}>${ico('check-lg')} بررسی</button></div>`;
}

const foldDe = s => normDe(s).replace(/\s+/g, ' ').trim();
function finishQ(ok, btn) {
  const q = quiz.cur;
  if (!q || q.done) return;
  q.done = true;
  if (ok) { quiz.score++; quiz.streak++; quiz.bestStreak = Math.max(quiz.bestStreak, quiz.streak); } else { quiz.streak = 0; quiz.wrong.push(q); }
  if (q.kind === 'mc') {
    document.querySelectorAll('#opts .opt').forEach(b => {
      b.disabled = true;
      if (b.dataset.opt === q.ans) { b.classList.remove('btn-outline-secondary'); b.classList.add('btn-success'); }
      else if (b === btn) { b.classList.remove('btn-outline-secondary'); b.classList.add('btn-danger'); }
      else b.classList.add('opacity-50');
    });
  } else if (q.kind === 'type') { $('#sp-in').disabled = true; } else renderOrder();
  const last = quiz.i === quiz.list.length - 1;
  $('#fb').innerHTML = `<div class="alert alert-${ok ? 'success' : 'danger'} mt-3 py-2 text-center">${
    ok ? ico('emoji-smile-fill') + ' آفرین!' : `جواب درست: <b dir="ltr" class="d-inline-block">${attr(q.kind === 'mc' && q.mode === 'artikel' ? entryDispFromQ(q) : q.ans)}</b>`}</div>
    <button class="btn btn-brand w-100 py-2" data-qnext>${last ? 'نمایش نتیجه' : 'سؤال بعدی'} ${ico('arrow-left')} <kbd class="d-none d-lg-inline">Enter</kbd></button>`;
  speak(q.after || q.say || q.ans);
}
const entryDispFromQ = q => q.after || q.ans;

function checkAnswer() {
  const q = quiz.cur;
  if (!q || q.done) return;
  if (q.kind === 'type') {
    const v = $('#sp-in').value.trim();
    if (v) finishQ(foldDe(v) === foldDe(q.ans));
  } else if (q.kind === 'order') {
    if (quiz.built.length) finishQ(quiz.built.map(i => q.tokens[i]).join(q.sep || ' ') === q.ans);
  }
}
function nextQ() {
  if (!quiz.cur || !quiz.cur.done) return;
  quiz.i++;
  quiz.built = [];
  if (quiz.i >= quiz.list.length) { quiz.stage = 'result'; return renderQuiz(); }
  quiz.cur = quiz.list[quiz.i];
  renderQ();
}

function renderResult() {
  const n = quiz.list.length, pct = Math.round(quiz.score / n * 100);
  if (!quiz.retry) {
    const best = store.get('qbest', {});
    if (best[quiz.mode] == null || pct > best[quiz.mode]) { best[quiz.mode] = pct; store.set('qbest', best); }
  }
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
  const msg = pct >= 90 ? 'عالی بود!' : pct >= 70 ? 'خیلی خوب!' : pct >= 40 ? 'بد نیست، ادامه بده' : 'دوباره تلاش کن، می‌شود!';
  $('#qroot').innerHTML = `<div class="narrow"><div class="card rounded-4 text-center"><div class="card-body p-4">
    <div class="fs-1 text-warning mb-1">${[0, 1, 2].map(i => ico(i < stars ? 'star-fill' : 'star')).join('')}</div>
    <div class="display-4 fw-bold text-brand">${pct}٪</div>
    <p class="fw-bold mb-1">${msg}</p>
    <p class="text-body-secondary small">${quiz.score} از ${n} درست · بیشترین پشت‌سرهم ${quiz.bestStreak}</p>
    ${quiz.wrong.length ? `<div class="text-start text-body mt-3"><h2 class="h6 text-center">${ico('x-circle-fill', 'text-danger')} اشتباه‌ها</h2>
      <ul class="list-group list-group-flush">${quiz.wrong.map(q => `<li class="list-group-item bg-transparent d-flex justify-content-between gap-2">
        <span dir="${q.qRtl ? 'rtl' : 'ltr'}">${q.q ? attr(q.q) : ico('volume-up-fill')}</span><b dir="ltr">${attr(q.ans)}</b></li>`).join('')}</ul></div>` : ''}
    <div class="d-flex flex-wrap gap-2 justify-content-center mt-4">
      ${quiz.wrong.length ? `<button class="btn btn-outline-danger rounded-pill" data-qretry>${ico('arrow-clockwise')} تکرار اشتباه‌ها</button>` : ''}
      <button class="btn btn-brand rounded-pill" data-qagain>${ico('lightning-charge-fill')} دور جدید</button>
      <button class="btn btn-outline-secondary rounded-pill" data-qhome>${ico('house-door')} منوی آزمون</button></div>
  </div></div></div>`;
}

/* ================= render + tabs ================= */
function renderTabs() {
  $('#tabbar').innerHTML = `
    <div class="side-brand"><b>${ico('translate', 'text-brand')} Deutsch A1</b><small>تمرین کلاس آلمانی</small></div>
    <ul class="nav nav-justified px-2">${TABS.map(t => `
      <li class="nav-item"><button class="nav-link ${t[0] === ui.tab ? 'active' : ''}" data-tab="${t[0]}">${ico(t[1])}<span class="short">${t[2]}</span><span class="long">${t[3]}</span></button></li>`).join('')}</ul>
    <div class="side-foot"><a class="link-secondary" href="https://github.com/m1chtv" target="_blank" rel="noopener">${ico('github')} github.com/m1chtv</a></div>`;
}
function updateHero() {
  const box = $('#hero-stats');
  if (!box) return;
  const E = dictEntries().filter(e => e.t !== 'z'), L = store.get('leitner', {}), now = Date.now();
  const due = E.filter(e => !L[e.key] || L[e.key].due <= now).length;
  const qb = Object.values(store.get('qbest', {}));
  box.innerHTML = `<span class="stat">${ico('book-half')} ${E.length} کلمه و عبارت</span>
    <span class="stat">${ico('stack')} ${due} کارت آماده‌ی مرور</span>
    ${qb.length ? `<span class="stat">${ico('trophy-fill')} بهترین آزمون ${Math.max(...qb)}٪</span>` : ''}`;
}
function render(scroll = true) {
  const view = $('#view');
  view.innerHTML = pageHead(ui.tab) + views[ui.tab]();
  view.classList.remove('fade-in'); void view.offsetWidth; view.classList.add('fade-in');
  if (ui.tab === 'quiz') renderQuiz();
  if (ui.tab === 'dict') renderDict();
  renderTabs();
  updateHero();
  if (scroll) window.scrollTo(0, 0);
}

/* ================= events (delegated) ================= */
document.addEventListener('click', e => {
  const t = e.target, on = s => t.closest(s);
  let el;
  if ((el = on('[data-say]'))) return speak(el.dataset.say, el.dataset.slow === '1');
  if ((el = on('[data-tab]'))) { ui.tab = el.dataset.tab; return render(); }
  if ((el = on('[data-verb]'))) { ui.verb = +el.dataset.verb; return render(false); }
  if ((el = on('[data-psub]'))) { ui.psub = el.dataset.psub; return render(false); }
  if ((el = on('[data-expand]'))) { document.querySelectorAll('.grp').forEach(d => { d.open = el.dataset.expand === '1'; }); return; }
  if ((el = on('[data-vsub]'))) { ui.vsub = el.dataset.vsub; return render(false); }
  if ((el = on('[data-asub]'))) { ui.asub = el.dataset.asub; return render(false); }
  if ((el = on('[data-artf]'))) { ui.art = el.dataset.artf; return render(false); }
  if ((el = on('[data-qgo]'))) { ui.tab = 'quiz'; quiz.stage = 'home'; render(); return startQuiz(el.dataset.qgo); }
  if ((el = on('[data-dfilter]'))) { ui.dfilter = el.dataset.dfilter; return render(false); }
  if ((el = on('[data-star]'))) { toggleSaved(el.dataset.star); return renderDict(); }
  if ((el = on('[data-goverb]'))) { ui.verb = +el.dataset.goverb; ui.tab = 'verbs'; return render(); }
  if (on('[data-addword]')) return addWord();
  if ((el = on('[data-delword]'))) return delWord(el.dataset.delword);
  /* flashcards */
  if ((el = on('[data-fdeck]'))) { ui.fdeck = el.dataset.fdeck; ui.fcur = null; ui.fconfirm = false; return renderCards(); }
  if (on('[data-fdir]')) { ui.fdir = ui.fdir === 'de' ? 'fa' : 'de'; ui.fflip = false; ui.fconfirm = false; return renderCards(); }
  if (on('[data-freset]')) {
    if (ui.fconfirm) { store.set('leitner', {}); ui.fconfirm = false; ui.fcur = null; } else ui.fconfirm = true;
    return renderCards();
  }
  if (on('[data-flip]')) return flipCard();
  if ((el = on('[data-fans]'))) return answerCard(el.dataset.fans === '1');
  if (on('[data-fall]')) {
    const L = store.get('leitner', {});
    deckEntries().forEach(x => { if (L[x.key]) L[x.key].due = 0; });
    store.set('leitner', L); ui.fcur = null; return renderCards();
  }
  /* quiz */
  if ((el = on('[data-qstart]'))) return startQuiz(el.dataset.qstart);
  if (on('[data-qhome]')) { quiz.stage = 'home'; return renderQuiz(); }
  if (on('[data-qagain]')) return startQuiz(quiz.mode);
  if (on('[data-qretry]')) return startQuiz(quiz.mode, quiz.wrong);
  if (on('[data-qnext]')) return nextQ();
  if ((el = on('[data-opt]'))) return finishQ(el.dataset.opt === quiz.cur.ans, el);
  if (on('[data-check]')) return checkAnswer();
  if ((el = on('[data-ins]'))) { const i = $('#sp-in'); if (i && !i.disabled) { i.value += el.dataset.ins; i.focus(); } return; }
  if ((el = on('[data-otok]'))) { if (!quiz.cur.done) { quiz.built.push(+el.dataset.otok); renderOrder(); } return; }
  if ((el = on('[data-obuilt]'))) { if (!quiz.cur.done) { quiz.built.splice(+el.dataset.obuilt, 1); renderOrder(); } return; }
  if (on('[data-oclear]')) { quiz.built = []; return renderOrder(); }
  if (on('.blur-text')) on('.blur-text').classList.remove('blur-text');
});
document.addEventListener('input', e => { if (e.target.id === 'dq') { ui.dq = e.target.value; renderDict(); } });
document.addEventListener('keydown', e => {
  if (e.target.matches && e.target.matches('input, textarea')) {
    if (e.key === 'Enter' && e.target.id === 'sp-in') { e.preventDefault(); quiz.cur && quiz.cur.done ? nextQ() : checkAnswer(); }
    return;
  }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (ui.tab === 'dict' && ui.dfilter === 'cards') {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); document.activeElement.blur(); flipCard(); }
    else if (ui.fflip && (e.key === '1' || e.key === '2')) answerCard(e.key === '2');
  } else if (ui.tab === 'quiz' && quiz.stage === 'play' && quiz.cur) {
    if (quiz.cur.done) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.activeElement.blur(); nextQ(); } }
    else if (quiz.cur.kind === 'mc' && /^[1-9]$/.test(e.key)) { const b = document.querySelectorAll('#opts .opt')[+e.key - 1]; if (b) b.click(); }
    else if (quiz.cur.kind === 'order' && e.key === 'Enter') checkAnswer();
  }
});

/* ================= toggles, theme, PWA ================= */
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
let deferredPrompt;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; $('#btn-install').classList.remove('d-none'); });
$('#btn-install').onclick = () => deferredPrompt && deferredPrompt.prompt();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));
}

/* ================= start ================= */
if ('speechSynthesis' in window) speechSynthesis.getVoices();
syncToggles(); syncTheme(); render(false);
