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
  ['کشورها و شهر (Länder)', 'globe-europe-africa', [
    ['f', 'Türkei', 'ترکیه'], ['m', 'Iran', 'ایران'], ['m', 'Irak', 'عراق'], ['f', 'USA', 'آمریکا (ایالات متحده)'], ['f', 'Schweiz', 'سوئیس'], ['f', 'Hauptstadt', 'پایتخت']]],
  ['حرف تعریف (Artikel)', 'tags', [
    ['m', 'Artikel', 'حرف تعریف'], ['n', 'Nomen', 'اسم (دستور زبان)'], ['m', 'Tipp', 'نکته / توصیه'], ['o', 'maskulin', 'مذکر'], ['o', 'feminin', 'مؤنث'], ['n', 'Neutrum', 'خنثی'],
    ['o', 'alle', 'همه'], ['o', 'nur', 'فقط'], ['v', 'auswendig lernen', 'حفظ کردن'], ['m', 'Laptop', 'لپ‌تاپ'], ['n', 'Taxi', 'تاکسی'], ['f', 'Pizza', 'پیتزا']]],
  ['حروف بزرگ و املا', 'type', [
    ['v', 'buchstabieren', 'هجی کردن'], ['m', 'Buchstabe', 'حرف (الفبا)'], ['n', 'Alphabet', 'الفبا'], ['m', 'Anfang', 'آغاز / ابتدا'], ['m', 'Punkt', 'نقطه'],
    ['f', 'Situation', 'موقعیت'], ['v', 'müssen', 'باید / مجبور بودن'], ['o', 'erste', 'اولین'], ['o', 'nach', 'بعد از'], ['o', 'von', 'از'], ['o', 'am Anfang', 'در ابتدا']]],
  ['ترتیب و درست / غلط', 'list-ol', [
    ['f', 'Reihenfolge', 'ترتیب'], ['o', 'welche', 'کدام'], ['o', 'richtig', 'درست'], ['o', 'falsch', 'غلط'],
    ['m', 'Abend', 'عصر / غروب'], ['f', 'Nacht', 'شب'], ['v', 'konjugieren', 'صرف کردن']]],
  ['جلسه‌ی امروز: زبان، سکونت و جمله', 'translate', [
    ['o', 'Englisch', 'انگلیسی (زبان)'], ['o', 'Persisch', 'فارسی (زبان)'], ['o', 'ein bisschen', 'کمی'], ['o', 'sehr gut', 'خیلی خوب'],
    ['m', 'Iraner', 'ایرانی (مرد)'], ['f', 'Iranerin', 'ایرانی (زن)'], ['o', 'Berlin', 'برلین'], ['o', 'München', 'مونیخ'], ['o', 'Esfahan', 'اصفهان'],
    ['o', 'aus', 'از (مبدأ)'], ['o', 'in', 'در'], ['o', 'an', 'در / روی (an Position 2)'],
    ['v', 'helfen', 'کمک کردن'], ['v', 'fahren', 'رفتن با وسیله / رانندگی کردن'], ['v', 'bilden', 'ساختن / تشکیل دادن'], ['v', 'stehen', 'قرار داشتن / ایستادن'],
    ['o', 'man', 'آدم / فاعل کلی (مثل «می‌شود»)'], ['n', 'Subjekt', 'فاعل (نهاد جمله)'], ['f', 'Position', 'جایگاه'], ['m', 'Unterschied', 'تفاوت'],
    ['f', 'Person', 'شخص'], ['m', 'Singular', 'مفرد'], ['o', 'regelmäßige Verben', 'فعل‌های باقاعده'], ['o', 'unregelmäßige Verben', 'فعل‌های بی‌قاعده'],
    ['f', 'W-Frage', 'سؤال با کلمه‌ی پرسشی (W)'], ['f', 'Ja oder Nein-Frage', 'سؤال بله / خیر']]],
  ['زن و مرد، اینجا و آنجا', 'arrow-left-right', [
    ['f', 'Frau', 'زن / خانم'], ['m', 'Herr', 'آقا'], ['o', 'hier', 'اینجا'], ['o', 'dort', 'آنجا']]],
  ['خواستن، سن و تماس', 'telephone', [
    ['v', 'möchten', 'مایل بودن (مؤدبانه)'], ['v', 'studieren', 'درس خواندن (دانشگاه)'], ['v', 'joggen', 'دویدن (جاگینگ)'], ['v', 'lieben', 'دوست داشتن / عاشق بودن'],
    ['o', 'gern', 'با علاقه / با میل'], ['f', 'Handynummer', 'شماره‌ی موبایل'], ['f', 'E-Mailadresse', 'ایمیل (آدرس)'],
    ['o', 'Ihre', 'مال شما (رسمی)'], ['o', 'meine', 'مال من (برای اسم مؤنث)'], ['o', 'Jahre', 'سال‌ها (جمع Jahr)'], ['o', 'ätt (@)', 'علامت @ — خوانده می‌شود «ätt»']]],
  ['آرتیکل‌ها، حال و احوال', 'tags', [
    ['o', 'Definiter Artikel', 'حرف تعریف معین'], ['o', 'Indefiniter Artikel', 'حرف تعریف نامعین'], ['o', 'Negationsartikel', 'حرف تعریف نفی'], ['o', 'Possessivartikel', 'حرف تعریف ملکی'],
    ['o', 'ein', 'یک (مذکر و خنثی)'], ['o', 'kein', 'نه / هیچ (مذکر و خنثی)'], ['o', 'keine', 'نه / هیچ (مؤنث)'],
    ['o', 'denn', 'نشان‌دهنده‌ی تردید در سؤال'], ['o', 'doch', 'نشان‌دهنده‌ی تأکید'], ['m', 'Zweifel', 'تردید / شک'], ['f', 'Betonung', 'تأکید'],
    ['m', 'Mensch', 'انسان'], ['n', 'Bild', 'تصویر'], ['m', 'Kollege', 'همکار (آقا)'], ['f', 'Kollegin', 'همکار (خانم)'],
    ['o', 'toll', 'عالی'], ['o', 'naja', 'خب / نه چندان'], ['o', 'so lala', 'متوسط / نه چندان'], ['o', 'nicht so gut', 'زیاد خوب نیست']]],
];
