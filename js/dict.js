/* Dictionary starter words (A1).  Format: [type, German, Persian]
   type: m = der, f = die, n = das (nouns) · v = verb · o = other word
   Phrases, numbers and verbs from data.js are added to the dictionary automatically. */
const WORDS = [
  /* nouns */
  ['m', 'Mann', 'مرد'], ['f', 'Frau', 'زن / خانم'], ['n', 'Kind', 'کودک'], ['m', 'Freund', 'دوست (پسر)'], ['f', 'Freundin', 'دوست (دختر)'],
  ['m', 'Lehrer', 'معلم (آقا)'], ['f', 'Lehrerin', 'معلم (خانم)'], ['m', 'Student', 'دانشجو (آقا)'], ['f', 'Studentin', 'دانشجو (خانم)'],
  ['f', 'Familie', 'خانواده'], ['f', 'Mutter', 'مادر'], ['m', 'Vater', 'پدر'], ['m', 'Bruder', 'برادر'], ['f', 'Schwester', 'خواهر'],
  ['m', 'Sohn', 'پسر (فرزند)'], ['f', 'Tochter', 'دختر (فرزند)'], ['m', 'Name', 'نام'], ['f', 'Sprache', 'زبان'], ['n', 'Wort', 'کلمه'],
  ['m', 'Satz', 'جمله'], ['f', 'Zahl', 'عدد'], ['f', 'Frage', 'سؤال'], ['f', 'Antwort', 'جواب'], ['n', 'Problem', 'مشکل'],
  ['n', 'Haus', 'خانه'], ['f', 'Wohnung', 'آپارتمان'], ['f', 'Stadt', 'شهر'], ['n', 'Land', 'کشور'], ['f', 'Straße', 'خیابان'],
  ['n', 'Auto', 'ماشین'], ['m', 'Bus', 'اتوبوس'], ['m', 'Zug', 'قطار'], ['f', 'Schule', 'مدرسه'], ['m', 'Kurs', 'دوره / کلاس'],
  ['f', 'Hausaufgabe', 'تکلیف'], ['f', 'Arbeit', 'کار'], ['n', 'Geld', 'پول'],
  ['n', 'Wasser', 'آب'], ['n', 'Brot', 'نان'], ['m', 'Kaffee', 'قهوه'], ['m', 'Tee', 'چای'], ['f', 'Milch', 'شیر'], ['m', 'Apfel', 'سیب'], ['n', 'Essen', 'غذا'],
  ['m', 'Tag', 'روز'], ['f', 'Woche', 'هفته'], ['m', 'Monat', 'ماه'], ['n', 'Jahr', 'سال'], ['f', 'Zeit', 'زمان'],
  ['m', 'Hund', 'سگ'], ['f', 'Katze', 'گربه'],
  /* classroom */
  ['n', 'Buch', 'کتاب'], ['n', 'Heft', 'دفتر'], ['m', 'Stift', 'خودکار / مداد'], ['m', 'Tisch', 'میز'], ['m', 'Stuhl', 'صندلی'],
  ['f', 'Tafel', 'تخته'], ['f', 'Tür', 'در'], ['n', 'Fenster', 'پنجره'], ['f', 'Tasche', 'کیف'], ['n', 'Handy', 'موبایل'], ['f', 'Uhr', 'ساعت'],
  /* verbs */
  ['v', 'sein', 'بودن'], ['v', 'haben', 'داشتن'], ['v', 'machen', 'انجام دادن'], ['v', 'gehen', 'رفتن'], ['v', 'wohnen', 'ساکن بودن / زندگی کردن'],
  ['v', 'sprechen', 'صحبت کردن'], ['v', 'sagen', 'گفتن'], ['v', 'fragen', 'پرسیدن'], ['v', 'antworten', 'جواب دادن'], ['v', 'essen', 'خوردن'],
  ['v', 'arbeiten', 'کار کردن'], ['v', 'spielen', 'بازی کردن'], ['v', 'lesen', 'خواندن'], ['v', 'sehen', 'دیدن'], ['v', 'brauchen', 'نیاز داشتن'],
  ['v', 'verstehen', 'فهمیدن'], ['v', 'wiederholen', 'تکرار کردن'], ['v', 'öffnen', 'باز کردن'], ['v', 'schließen', 'بستن'],
  ['v', 'fotografieren', 'عکس گرفتن'], ['v', 'putzen', 'تمیز کردن / پاک کردن'], ['v', 'sitzen', 'نشسته بودن'],
  /* adjectives, adverbs, question words, others */
  ['o', 'gut', 'خوب'], ['o', 'schlecht', 'بد'], ['o', 'groß', 'بزرگ'], ['o', 'klein', 'کوچک'], ['o', 'neu', 'جدید'], ['o', 'alt', 'قدیمی / پیر'],
  ['o', 'schön', 'زیبا'], ['o', 'schnell', 'سریع'], ['o', 'langsam', 'آهسته'], ['o', 'heiß', 'داغ'], ['o', 'kalt', 'سرد'],
  ['o', 'ja', 'بله'], ['o', 'nein', 'نه'], ['o', 'vielleicht', 'شاید'], ['o', 'bitte', 'لطفاً / خواهش می‌کنم'], ['o', 'danke', 'ممنون'],
  ['o', 'Entschuldigung', 'ببخشید'], ['o', 'Tschüss', 'خداحافظ (غیررسمی)'], ['o', 'Auf Wiedersehen', 'خداحافظ (رسمی)'],
  ['o', 'Guten Morgen', 'صبح بخیر'], ['o', 'Guten Abend', 'عصر بخیر'], ['o', 'Gute Nacht', 'شب بخیر'],
  ['o', 'wie', 'چگونه'], ['o', 'was', 'چه چیزی'], ['o', 'wer', 'چه کسی'], ['o', 'wo', 'کجا'], ['o', 'woher', 'از کجا'], ['o', 'wohin', 'به کجا'],
  ['o', 'wann', 'کی'], ['o', 'warum', 'چرا'], ['o', 'hier', 'اینجا'], ['o', 'dort', 'آنجا'],
  ['o', 'heute', 'امروز'], ['o', 'morgen', 'فردا'], ['o', 'gestern', 'دیروز'], ['o', 'jetzt', 'حالا'], ['o', 'immer', 'همیشه'], ['o', 'nie', 'هرگز'],
  ['o', 'und', 'و'], ['o', 'oder', 'یا'], ['o', 'aber', 'اما'], ['o', 'sehr', 'خیلی'], ['o', 'auch', 'هم / همچنین'], ['o', 'nicht', 'نه (نفی)'],
];

/* ---- Every word that appeared on the whiteboard, grouped by lesson (not repeated from WORDS/phrases) ---- */
const BOARD = [
  ['معرفی (Vorstellung)', 'person-badge', [
    ['o', 'formell', 'رسمی'], ['o', 'informell', 'غیررسمی'], ['m', 'Vorname', 'نام کوچک'], ['m', 'Nachname', 'نام خانوادگی'],
    ['o', 'mein', 'من (مال من)'], ['o', 'bin', 'هستم (از sein)'], ['o', 'ist', 'است (از sein)']]],
  ['صرف فعل (Konjugation)', 'pencil-square', [
    ['f', 'Konjugation', 'صرف (فعل)'], ['n', 'Verb', 'فعل'], ['m', 'Verbstamm', 'ریشه‌ی فعل'], ['f', 'Endung', 'پایانه'], ['f', 'Formel', 'فرمول'],
    ['n', 'Personalpronomen', 'ضمیر شخصی'], ['o', 'ich', 'من'], ['o', 'du', 'تو'], ['o', 'er', 'او (مرد)'], ['o', 'sie', 'او (زن) / آن‌ها'], ['o', 'es', 'آن'],
    ['o', 'wir', 'ما'], ['o', 'ihr', 'شما (جمع، غیررسمی)'], ['o', 'Sie (formell)', 'شما (رسمی)']]],
  ['کلاس و معنی (Synonym / Gegenteil)', 'easel2', [
    ['n', 'Synonym', 'مترادف'], ['n', 'Gegenteil', 'متضاد'], ['o', 'darf', 'اجازه دارد (از dürfen)'], ['v', 'dürfen', 'اجازه داشتن'],
    ['v', 'rausgehen', 'بیرون رفتن'], ['v', 'reinkommen', 'داخل آمدن'], ['o', 'hätte', 'داشتم (شکل مؤدبانه‌ی haben)'], ['o', 'eine', 'یک (برای اسم مؤنث)'],
    ['v', 'bedeuten', 'معنی دادن / یعنی'], ['o', 'das', 'این / آن'], ['v', 'können', 'توانستن'], ['v', 'geben', 'دادن (es gibt = وجود دارد)'],
    ['o', 'es gibt', 'وجود دارد'], ['o', 'alles', 'همه‌چیز'], ['o', 'klar', 'روشن / واضح'], ['o', 'abwesend', 'غایب'], ['o', 'anwesend', 'حاضر']]],
  ['ترکیب حروف (Kombinationen)', 'mic-fill', [
    ['f', 'Kombination', 'ترکیب'], ['o', 'manche', 'بعضی'], ['o', 'im', 'در (in dem)'], ['o', 'Deutsch', 'آلمانی (زبان)'], ['m', 'Bär', 'خرس'],
    ['o', 'Leute', 'مردم'], ['o', 'frei', 'آزاد'], ['m', 'Raum', 'اتاق / فضا'], ['f', 'Reihe', 'ردیف'], ['o', 'rund', 'گرد'],
    ['f', 'Seite', 'صفحه / طرف'], ['f', 'Sonne', 'خورشید'], ['v', 'sammeln', 'جمع کردن'], ['o', 'Häuser', 'خانه‌ها (جمع Haus)']]],
];
