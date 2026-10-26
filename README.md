<div align="center">

# 🇩🇪 Deutsch A1 — Learn & Practise

**A free, offline-capable web app for practising beginner German (A1).**
Phrases · Verb conjugation · Sentence & question patterns · Numbers · Alphabet & pronunciation · Articles · Dictionary · Flashcards · Audio quizzes

![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3_RTL-7952B3?logo=bootstrap&logoColor=white)
![Bootstrap Icons](https://img.shields.io/badge/Bootstrap_Icons-1.13-7952B3?logo=bootstrap&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-offline-5A0FC8?logo=pwa&logoColor=white)
![No build](https://img.shields.io/badge/build-none-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## English

A static, no-backend web app for learners of German at level **A1**. The interface is in **Persian (RTL)** and uses **Bootstrap 5.3** and **Bootstrap Icons**; pronunciation uses your browser's built-in text-to-speech (`de-DE`). Everything runs in the browser — there is no account, no tracking and no server.

### Features

| Area | What you get |
|---|---|
| 💬 **Phrases & words** | Everyday phrases and vocabulary grouped by topic in collapsible sections, each with audio; optional "hide translation" self-test mode |
| 🔢 **Numbers** | 0–100 plus compound numbers (`einundzwanzig`, `fünfundzwanzig` …) with audio |
| 🔤 **Alphabet & sounds** | Letter names, sound combinations (ß, ä, eu, ei, au, äu, tsch, ö, ü, r, s, ch), and capitalisation rules |
| ✏️ **Verbs & sentences** | Conjugation tables with Persian meaning for every row (regular, irregular, `möchten`, verbs with a stem ending in t/d); verb position 2, W-questions, yes/no questions, formal vs. informal |
| 🏷️ **Articles** | der / das / die with colour coding, indefinite and negation articles (ein / kein), question-and-answer patterns, helpful endings, and a browsable noun list |
| 📖 **Dictionary** | Offline German↔Persian search, noun articles, personal word list (saved in your browser) |
| 🃏 **Flashcards** | Two-sided cards with spaced repetition (Leitner boxes), decks, direction switch |
| 🎯 **Quiz** | 14 modes (translation, articles, conjugation, listening, spelling by typing, sentence building, numbers, letters, capitalisation, ordering, mixed), 10 questions per round, results with mistakes review |
| 🎨 **Design** | Bold "Studio" look, light & dark themes, bottom bar on phones, sidebar on desktop |
| 📲 **PWA** | Installable, works offline after the first visit |
| ⌨️ **Shortcuts** | Flashcards: `Space` flip, `1` / `2` answer · Quiz: `1`–`4` choose, `Enter` next |

### Quick start

No build step and no dependencies. Because service workers need `http(s)`, serve the folder with any static server:

```bash
git clone https://github.com/<your-username>/deutsch-a1.git
cd deutsch-a1
python3 -m http.server 8080     # or: npx serve .
```

Open `http://localhost:8080`.

### Deploy

Any static host works (GitHub Pages, Netlify, Cloudflare Pages, …). For GitHub Pages: **Settings ▸ Pages ▸ Deploy from a branch ▸ `main` / root**. All paths are relative, so project sub-paths are fine.

### Project structure

```
deutsch-a1/
├─ index.html              # entry page
├─ manifest.webmanifest    # PWA manifest
├─ sw.js                   # service worker (offline cache) — bump CACHE when files change
├─ css/app.css             # design layer on top of Bootstrap
├─ js/
│  ├─ data.js              # phrases, verbs, numbers, letters, sounds, sentence patterns
│  ├─ dict.js              # dictionary words (WORDS) and vocabulary groups (BOARD)
│  └─ app.js               # views, quiz, flashcards, speech, theme
├─ icons/                  # PWA icons (built from Bootstrap Icons)
└─ assets/vendor/          # Bootstrap, Bootstrap Icons, font (self-hosted for offline use)
```

### Adding content

All content lives in `js/data.js` and `js/dict.js`.

```js
// js/data.js — a phrase is [German, Persian]
["Wie bitte?", "ببخشید؟ / چی گفتید؟"]

// a verb is [infinitive, stem, Persian]; irregular verbs add an array of 6 forms
["spielen", "spiel", "بازی کردن"]
["sein", "", "بودن", ["bin", "bist", "ist", "sind", "seid", "sind"]]

// js/dict.js — a word is [type, German, Persian]; type: m/f/n = der/die/das, v = verb, o = other
['m', 'Hund', 'سگ']
```

Persian conjugation meanings go in `VFA`. After editing, bump `CACHE` in `sw.js` so installed copies update.

### Speech (pronunciation)

Audio comes from the device's text-to-speech engine, so quality depends on the installed German voice (Android: *Text-to-speech* settings · iOS: *Spoken Content ▸ Voices* · Windows: *Speech* settings). If you hear nothing, install a German voice first.

### Privacy

No analytics, no cookies, no network requests apart from loading the app itself. Progress (flashcards, quiz records, saved words, theme) is stored only in your browser's `localStorage`.

### Contributing

Issues and pull requests are welcome — typo fixes, better translations, new vocabulary, accessibility improvements. Content is edited in `js/data.js` / `js/dict.js`; please keep entries at A1 level and mention where new material comes from.

### Disclaimer

This is an independent learning aid. It is not affiliated with, endorsed by, or a replacement for any textbook, publisher or language school. Translations and examples are study aids and may contain mistakes — please verify with your teacher or a dictionary.

### Credits & licence

- Code: [MIT](LICENSE)
- [Bootstrap](https://getbootstrap.com/) and [Bootstrap Icons](https://icons.getbootstrap.com/) — MIT
- [Baloo Bhaijaan 2](https://fonts.google.com/specimen/Baloo+Bhaijaan+2) (via `@fontsource`) — SIL OFL 1.1

(Licence texts are included in `assets/vendor/`.)

---

## فارسی

وب‌اپ رایگان و بدون سرور برای تمرین و مرور **آلمانی سطح A1**؛ کاملاً داخل مرورگر اجرا می‌شود (بدون حساب کاربری و بدون ردیابی) و بعد از اولین بازدید آفلاین هم کار می‌کند.

### امکانات

- **عبارت‌ها و کلمه‌ها:** عبارت‌ها و واژگان به‌تفکیک موضوع (گروه‌های بازشونده) با پخش صدا و حالت «پنهان‌کردن ترجمه» برای خودآزمایی
- **اعداد:** ۰ تا ۱۰۰ و اعداد ترکیبی با تلفظ
- **الفبا و تلفظ:** نام حرف‌ها، ترکیب حروف (ß، ä، eu، ei، au، äu، tsch، ö، ü، r، s، ch) و قاعده‌ی حروف بزرگ
- **فعل و جمله:** جدول صرف با معنی فارسی هر ردیف (باقاعده، بی‌قاعده، möchten، ریشه‌ی t/d)؛ جایگاه ۲ فعل، سؤال با W، سؤال بله/خیر، رسمی و غیررسمی
- **آرتیکل:** der / das / die با رنگ ثابت، حرف نامعین، نشانه‌های کمکی و لیست اسم‌ها
- **دیکشنری:** جستجوی آفلاین آلمانی↔فارسی و لیست کلمه‌های شخصی
- **فلش‌کارت:** مرور فاصله‌دار (Leitner)، دسته‌بندی و تغییر جهت
- **آزمون:** ۱۴ حالت (ترجمه، آرتیکل، صرف، شنیدن، املا، جمله‌سازی، اعداد، حروف، ترتیب و ...) با نتیجه و مرور اشتباه‌ها
- **دیزاین:** حالت روشن و تیره؛ نوار پایین روی گوشی و سایدبار روی کامپیوتر
- **PWA:** قابل نصب روی گوشی و کامپیوتر

### اجرا و انتشار

```bash
git clone https://github.com/<your-username>/deutsch-a1.git
cd deutsch-a1
python3 -m http.server 8080
```

برای انتشار روی GitHub Pages: **Settings ▸ Pages ▸ Deploy from a branch ▸ `main` / root**. همه‌ی مسیرها نسبی‌اند.

### اضافه‌کردن محتوا

محتوا در `js/data.js` و `js/dict.js` است (نمونه‌ها در بخش انگلیسی بالا). بعد از هر تغییر، عدد `CACHE` را در `sw.js` بالا ببر.

### تلفظ

صدا از موتور گفتار خود دستگاه می‌آید؛ اگر چیزی نشنیدی، صدای آلمانی (Deutsch) را در تنظیمات گفتار دستگاه نصب کن.

### حریم خصوصی

هیچ داده‌ای به جایی ارسال نمی‌شود. پیشرفت (فلش‌کارت، رکورد آزمون، کلمه‌های ذخیره‌شده، تم) فقط در `localStorage` مرورگر خودت می‌ماند.

### مشارکت

Issue و Pull Request خوش‌آمد است: اصلاح غلط، ترجمه‌ی بهتر، واژگان جدید یا بهبود دسترس‌پذیری. لطفاً مطالب را در سطح A1 نگه دار.

### سلب مسئولیت

این پروژه یک ابزار کمک‌آموزشی مستقل است و وابسته به هیچ کتاب، ناشر یا آموزشگاهی نیست و جایگزین آن‌ها نمی‌شود. ترجمه‌ها و مثال‌ها ممکن است اشتباه داشته باشند؛ لطفاً با معلم یا دیکشنری تطبیق بده.

### مجوز

کد با مجوز [MIT](LICENSE) منتشر شده است. Bootstrap و Bootstrap Icons (MIT) و فونت Baloo Bhaijaan 2 (SIL OFL 1.1) متعلق به سازندگانشان هستند.
