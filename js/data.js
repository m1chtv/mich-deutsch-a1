/* Deutsch A1 - class notes data | github.com/m1chtv
   Each phrase: [German, Persian]. Add new items here. */
const P=[
["📋 معرفی و احوال‌پرسی",[
["Guten Tag","روز بخیر (رسمی)"],["Hallo","سلام (غیررسمی)"],
["Wie heißen Sie?","اسم شما چیست؟ (رسمی)"],["Ich heiße Ali Ghasemi.","اسم من علی قاسمی است"],
["Wie heißt du?","اسمت چیه؟ (غیررسمی)"],["Ich bin Ali Ghasemi.","من علی قاسمی هستم"],
["Mein Name ist Ali Ghasemi.","نام من علی قاسمی است"],["Mein Vorname ist Ali.","نام کوچک من علی است"],
["Mein Nachname ist Ghasemi.","نام خانوادگی من قاسمی است"],["Danke","ممنون"],["Bitte","خواهش می‌کنم / لطفاً"]]],
["🏫 عبارت‌های کلاس",[
["Darf ich rausgehen?","اجازه هست بیرون بروم؟"],["Darf ich reinkommen?","اجازه هست بیایم تو؟"],
["Darf ich putzen?","اجازه هست (تخته را) پاک کنم؟"],["Sie können fotografieren.","می‌توانید عکس بگیرید"],
["Haben Sie Fragen?","سؤالی دارید؟"],["Gibt es Fragen?","سؤالی هست؟ (هم‌معنی قبلی)"],
["Ich hätte eine Frage.","من یک سؤال داشتم"],["Was bedeutet das?","این یعنی چه؟"],["Alles klar!","همه‌چیز روشن است!"]]],
["↔️ متضاد (≠)",[
["Ja ≠ Nein","بله ≠ نه"],["rausgehen ≠ reinkommen","بیرون رفتن ≠ داخل آمدن"],
["Frage ≠ Antwort","سؤال ≠ جواب"],["abwesend ≠ anwesend","غایب ≠ حاضر"]]],["🙋 اجازه گرفتن",[["Darf ich Wasser trinken?","اجازه هست آب بخورم؟"],["Darf ich eine Frage stellen?","اجازه هست سؤال بپرسم؟"],["Darf ich bitte rausgehen?","لطفاً اجازه هست بیرون بروم؟"],["Ja, bitte.","بله، بفرمایید."],["Nein, leider nicht.","نه، متأسفانه نه."],["Entschuldigung!","ببخشید!"],["Darf ich fragen?","اجازه هست بپرسم؟"],["Darf ich etwas fragen?","اجازه هست چیزی بپرسم؟"],["Ich habe eine Frage.","من یک سؤال دارم."],["Darf ich hereinkommen?","اجازه هست بیایم داخل؟"],["Darf ich herausgehen?","اجازه هست بروم بیرون؟"],["Darf ich mich setzen?","اجازه هست بنشینم؟"],["Darf ich das Fenster öffnen?","اجازه هست پنجره را باز کنم؟"],["Darf ich auf die Toilette gehen?","اجازه هست به دستشویی بروم؟"],["Darf ich fotografieren?","اجازه هست عکس بگیرم؟"],["Können Sie das bitte wiederholen?","لطفاً می‌توانید تکرار کنید؟"],["Langsamer, bitte.","آهسته‌تر لطفاً."],["Ich verstehe nicht.","نمی‌فهمم."]]],["👩‍🏫 استاد و معلم",[["der Lehrer / die Lehrerin","معلم (آقا / خانم)"],["der Professor / die Professorin","استاد (دانشگاه)"],["Herr Müller","آقای مولر (Herr + فامیلی)"],["Frau Müller","خانم مولر (Frau + فامیلی)"],["Guten Tag, Frau Müller!","روز بخیر، خانم مولر!"]]],["🪑 وسایل کلاس",[["der Tisch","میز"],["der Stuhl","صندلی"],["die Tafel","تخته"],["das Buch","کتاب"],["das Heft","دفتر"],["der Stift","خودکار / مداد"],["die Tür","در"],["das Fenster","پنجره"],["die Tasche","کیف"],["das Handy","موبایل"],["die Uhr","ساعت"]]],["🔤 املا",[["Wie schreibt man das?","این چطور نوشته می‌شود؟"],["Buchstabieren Sie bitte!","لطفاً هجی کنید!"]]]];
const V=[["kommen","komm","آمدن"],["lernen","lern","یاد گرفتن"],["kaufen","kauf","خریدن"],["trinken","trink","نوشیدن"],["heißen","heiß","نام داشتن"],["hören","hör","شنیدن"],["schreiben","schreib","نوشتن"]];
const PR=["ich","du","er/sie/es","wir","ihr","sie/Sie"],EN=["e","st","t","en","t","en"];
function form(v,i){if(v[0]==="heißen"&&i===1)return"heißt";return v[1]+EN[i]}
const S=[
["ß","مثل «س» (همان s)","heiß, Straße"],["ä","مثل «اِ» (e)","Bär, Käse"],
["eu","«اُی» (oy)","neu, Leute, Freund"],["ei","«آی» (ay)","frei, mein, nein"],["au","«آو» (aw)","Frau, Haus, auf"],
["äu","مثل eu: «اُی»","Häuser, Fräulein"],["tsch","«چ»","Deutsch, Tschüss"],
["ö","«اُ» با لب‌های گرد","schön, hören"],["ü","«اوی» (i با لب گرد)","Tür, müde"],
["r","در گلو، نرم؛ با هر حرف صدادار","Raum, Reihe, rund"],["s قبل از مصوت","مثل «ز»","Seite, Sonne, sammeln"]];
const NUMS=[[0,"null"],[1,"eins"],[2,"zwei"],[3,"drei"],[4,"vier"],[5,"fünf"],[6,"sechs"],[7,"sieben"],[8,"acht"],[9,"neun"],[10,"zehn"],[11,"elf"],[12,"zwölf"],[13,"dreizehn"],[14,"vierzehn"],[15,"fünfzehn"],[16,"sechzehn"],[17,"siebzehn"],[18,"achtzehn"],[19,"neunzehn"],[20,"zwanzig"],[30,"dreißig"],[40,"vierzig"],[50,"fünfzig"],[60,"sechzig"],[70,"siebzig"],[80,"achtzig"],[90,"neunzig"],[100,"hundert"],[21,"einundzwanzig"],[35,"fünfunddreißig"]];
const ALPH=[["A","a","آ"],["B","be","بِه"],["C","tse","تسِه"],["D","de","دِه"],["E","e","اِ"],["F","ef","اِف"],["G","ge","گِه"],["H","ha","هآ"],["I","i","ای"],["J","jot","یُت"],["K","ka","کآ"],["L","el","اِل"],["M","em","اِم"],["N","en","اِن"],["O","o","اُ"],["P","pe","پِه"],["Q","ku","کو"],["R","er","اِر"],["S","es","اِس"],["T","te","تِه"],["U","u","او"],["V","fau","فاو"],["W","we","وِه"],["X","ix","ایکس"],["Y","ypsilon","اوپسیلون"],["Z","tset","تسِت"],["Ä","ä","اِ"],["Ö","ö","اُ گرد"],["Ü","ü","اوی"],["ß","Eszett","اِس‌تسِت"]];
const ALW={A:'Apfel',B:'Ball',C:'Cola',D:'Dach',E:'Eis',F:'Fisch',G:'Gabel',H:'Haus',I:'Igel',J:'Jacke',K:'Katze',L:'Lampe',M:'Mutter',N:'Nase',O:'Orange',P:'Papier',Q:'Quelle',R:'Regen',S:'Sonne',T:'Tisch',U:'Uhr',V:'Vogel',W:'Wasser',X:'Xylophon',Y:'Ypsilon',Z:'Zebra','Ä':'Äpfel','Ö':'Öl','Ü':'Übung','ß':'Straße'};
const spL=a=>a[0]==='ß'?'scharfes S, wie in Straße':a[0]+' wie '+ALW[a[0]];
