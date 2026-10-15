<div align="center">

# 🇩🇪 Deutsch A1 — تمرین کلاس آلمانی

**وب‌اپ تمرین زبان آلمانی (سطح A1) بر پایه‌ی درس‌های کلاس و کتاب *Starten wir***
عبارت‌ها · صرف فعل · اعداد · الفبا · تلفظ · آزمون صوتی

![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3_RTL-7952B3?logo=bootstrap&logoColor=white)
![Bootstrap Icons](https://img.shields.io/badge/Bootstrap_Icons-1.13-7952B3?logo=bootstrap&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-offline-5A0FC8?logo=pwa&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-green)

[**🔗 دمو (GitHub Pages)**](https://m1chtv.github.io/deutsch-a1/) ·
[گزارش مشکل](https://github.com/m1chtv/deutsch-a1/issues) ·
[پروفایل من](https://github.com/m1chtv)

</div>

---

## English summary

A mobile-first, offline-capable (PWA) web app for practising beginner German (A1) based on class notes and the *Starten wir* course book. Built with **Bootstrap 5.3 (RTL)**, **Bootstrap Icons** and vanilla JavaScript — no build step, no framework, no backend. Pronunciation uses the browser's built-in Web Speech API (`de-DE`). The UI is in Persian (RTL).

---

## ✨ امکانات

| بخش | توضیح |
|---|---|
| 💬 **عبارت‌ها** | معرفی (رسمی/غیررسمی)، عبارت‌های کلاس، اجازه گرفتن، استاد و معلم، وسایل کلاس (با der/die/das)، متضادها و املا؛ کنار هر مورد دکمه‌ی پخش صدا |
| 🔢 **اعداد** | ۰ تا ۱۰۰ همراه با قاعده‌ی اعداد بالای ۲۰ (`einundzwanzig`) |
| 🔤 **الفبا** | حروف A–Z و Ä Ö Ü ß؛ هر حرف با یک کلمه خوانده می‌شود (`A wie Apfel`) تا تلفظ درست شنیده شود |
| ✏️ **صرف فعل** | فرمول «ریشه + پایانه» و جدول صرف ۷ فعل: kommen, lernen, kaufen, trinken, heißen, hören, schreiben |
| 🗣️ **تلفظ** | ß ä eu ei au äu tsch ö ü r s با توضیح فارسی و مثال‌های صوتی |
| 🎯 **آزمون** | ۶ حالت چهارگزینه‌ای: معنی عبارت، صرف فعل، شنیدن جمله، اعداد، شنیدن عدد، حروف — با نوار پیشرفت، امتیاز و رکورد پشت‌سرهم (ذخیره در مرورگر) |
| 🐢 **تلفظ آهسته** | یک کلید سراسری که همه‌ی صداها را کندتر می‌کند |
| 🙈 **پنهان‌کردن ترجمه** | برای خودآزمایی؛ روی هر ترجمه‌ی تار بزن تا نمایان شود |
| 🌗 **حالت روشن/تیره** | با ذخیره‌ی انتخاب، پیش‌فرض بر اساس تنظیمات سیستم |
| 📲 **PWA** | قابل نصب روی صفحه‌ی اصلی و کار کردن بدون اینترنت |

## 🧰 تکنولوژی‌ها

- [Bootstrap 5.3](https://getbootstrap.com/) (نسخه‌ی RTL) — چیدمان و کامپوننت‌ها
- [Bootstrap Icons](https://icons.getbootstrap.com/) — همه‌ی آیکون‌ها (رابط کاربری و آیکون اپ)
- [Baloo Bhaijaan 2](https://fonts.google.com/specimen/Baloo+Bhaijaan+2) — فونت (از طریق `@fontsource`، به‌صورت محلی)
- Web Speech API — تلفظ آلمانی (`de-DE`)
- Service Worker + Web App Manifest — PWA
- بدون فریم‌ورک و بدون مرحله‌ی build؛ فقط HTML + CSS + JS

## 📁 ساختار پروژه

```
deutsch-a1/
├─ index.html              # صفحه‌ی اصلی
├─ manifest.webmanifest    # تنظیمات PWA
├─ sw.js                   # Service Worker (کش برای حالت آفلاین)
├─ css/app.css             # استایل‌های سفارشی روی Bootstrap
├─ js/
│  ├─ data.js              # ← محتوای درس‌ها (عبارت‌ها، افعال، اعداد، حروف، تلفظ)
│  └─ app.js               # منطق برنامه (نمایش، آزمون، صدا، تم)
├─ icons/                  # آیکون‌های PWA (ساخته‌شده از Bootstrap Icons)
└─ assets/vendor/          # Bootstrap، Bootstrap Icons و فونت (محلی، برای آفلاین)
```

## 🚀 اجرا روی کامپیوتر

نیازی به نصب چیزی نیست. چون Service Worker و PWA فقط روی `http(s)` کار می‌کنند، پوشه را با یک سرور ساده باز کن:

```bash
git clone https://github.com/m1chtv/deutsch-a1.git
cd deutsch-a1

# یکی از این‌ها:
python3 -m http.server 8080
# یا
npx serve .
```

سپس `http://localhost:8080` را در مرورگر باز کن.

## 🌐 انتشار روی GitHub Pages

1. ریپازیتوری را با نام `deutsch-a1` بساز و فایل‌ها را push کن.
2. در **Settings ▸ Pages** گزینه‌ی **Deploy from a branch** را انتخاب کن، شاخه‌ی `main` و پوشه‌ی `/ (root)` را بزن و ذخیره کن.
3. بعد از چند دقیقه اپ روی `https://m1chtv.github.io/deutsch-a1/` در دسترس است.

> اگر نام ریپازیتوری را عوض کردی، لینک دمو و بج‌های بالای همین README را هم اصلاح کن.
> همه‌ی مسیرها نسبی هستند، پس زیرمسیر GitHub Pages مشکلی ایجاد نمی‌کند.

## 📲 نصب به‌عنوان اپ (PWA)

- **Android / Chrome:** دکمه‌ی «نصب اپ» بالای صفحه، یا منو ⋮ ◂ *Install app*.
- **iPhone / Safari:** دکمه‌ی Share ◂ *Add to Home Screen*.
- **کامپیوتر / Chrome یا Edge:** آیکون نصب در نوار آدرس.

بعد از اولین بازدید، همه‌ی فایل‌ها (به‌همراه فونت و آیکون‌ها) کش می‌شوند و اپ بدون اینترنت هم کار می‌کند.

## ➕ اضافه‌کردن درس جدید

همه‌ی محتوا در `js/data.js` است و نیازی به دست‌زدن به کد برنامه نیست.

**عبارت جدید** — به آرایه‌ی `P` یک گروه یا یک آیتم `[آلمانی, فارسی]` اضافه کن:

```js
["🏫 عبارت‌های کلاس", [
  ["Alles klar!", "همه‌چیز روشن است!"],
  ["Wie bitte?", "ببخشید؟ (چی گفتید؟)"]   // ← جدید
]],
```

**فعل جدید** — به آرایه‌ی `V` یک آیتم `[مصدر, ریشه, معنی]` اضافه کن (فعل‌های باقاعده خودکار صرف می‌شوند):

```js
["spielen", "spiel", "بازی کردن"],
```

**عدد، حرف و تلفظ** هم به همین شکل در `NUMS`، `ALPH` و `S` هستند.

> آیکون هر گروه از `GROUP_ICONS` در `js/app.js` می‌آید؛ نام آیکون‌ها را از [icons.getbootstrap.com](https://icons.getbootstrap.com/) بردار.
> بعد از هر تغییر، عدد `CACHE` را در `sw.js` بالا ببر تا کاربران نسخه‌ی جدید را بگیرند.

## 🔊 درباره‌ی تلفظ

تلفظ با موتور گفتار خود مرورگر/گوشی ساخته می‌شود (بدون ارسال داده به سرور). کیفیت آن به صدای آلمانی نصب‌شده روی دستگاه بستگی دارد:

- **Android:** تنظیمات ◂ Text-to-speech ◂ زبان *Deutsch* را نصب کن.
- **iOS:** تنظیمات ◂ Accessibility ◂ Spoken Content ◂ Voices ◂ German.
- **Windows:** تنظیمات ◂ Time & Language ◂ Speech ◂ افزودن صدای آلمانی.

اگر صدایی شنیده نشد، ابتدا همین مورد را بررسی کن.

## 🗺️ نقشه‌ی راه

- [ ] جمله‌سازی (مرتب‌کردن کلمه‌های به‌هم‌ریخته)
- [ ] مرور فاصله‌دار (Spaced repetition) برای کلمه‌های ضعیف
- [ ] حرف تعریف رنگی (der/die/das)
- [ ] ضمایر و فعل `sein`، `Woher kommst du?`
- [ ] روزهای هفته، ماه‌ها، رنگ‌ها و ساعت
- [ ] تمرین املا و ضبط صدا

## 🤝 مشارکت

Pull Request و Issue خوش‌آمد است. برای اضافه‌کردن محتوای جدید فقط `js/data.js` را ویرایش کن و در توضیح PR بنویس از کدام درس/صفحه‌ی کتاب آمده است.

## 📄 مجوز و منابع

- کد این پروژه تحت مجوز [MIT](LICENSE) منتشر شده است.
- Bootstrap و Bootstrap Icons: مجوز MIT — Baloo Bhaijaan 2: مجوز SIL OFL 1.1 (متن مجوزها در `assets/vendor/`).
- این پروژه رسمی نیست و هیچ ارتباطی با ناشر کتاب *Starten wir* ندارد؛ فقط یادداشت‌های شخصی کلاس برای تمرین است. برای یادگیری کامل، از کتاب اصلی و معلم کلاس استفاده کن.

<div align="center">

ساخته‌شده با ❤️ توسط [**@m1chtv**](https://github.com/m1chtv)

</div>
