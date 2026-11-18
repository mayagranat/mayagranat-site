// ===== הגדרות האתר: לעדכן כאן =====
const SITE = {
  whatsapp: '972533232021',  // וואטסאפ של המכירות: כל הפניות מהאתר מגיעות לכאן
  whatsappText: 'היי, הגעתי מהאתר של מאיה ואשמח לשמוע פרטים על הליווי',
  instagram: 'https://www.instagram.com/mayagranat/',
  formEndpoint: 'https://formsubmit.co/ajax/gmaya80@gmail.com',  // גיבוי: כל ליד מגיע גם למייל דרך FormSubmit
  makeWebhook: 'https://hook.eu1.make.com/tvmapi53b5b9otbt1tut06kntcp1khq5',  // כתובת ה-Webhook מ-Make: הליד נכנס ללוח "טופס יצירת לידים" במאנדיי
  googleTag: 'GTM-WKRMDTJ3',  // תג Google (מחובר ל-Google Analytics)
  ga4: '',        // לא בשימוש כרגע: מזהה G- ישיר, אם יוחלף בעתיד
  metaPixel: '1450653853171171'   // מזהה הפיקסל של מטא, למשל '1234567890123456'. ריק = כבוי
};

// ===== מדידה: Google Analytics + Meta Pixel (נטענים רק אם הוגדר מזהה) =====
if (SITE.googleTag) {
  const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtm.js?id=' + SITE.googleTag; document.head.appendChild(s);
  window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
} else if (SITE.ga4) {
  const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + SITE.ga4; document.head.appendChild(s);
  window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date()); gtag('config', SITE.ga4);
}
if (SITE.metaPixel) {
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', SITE.metaPixel); fbq('track', 'PageView');
}
// אירוע מדידה: שם לגוגל, ושם סטנדרטי של מטא (Lead / Contact) או אירוע מותאם
const track = (gaName, metaName, params) => {
  try { if (window.gtag) gtag('event', gaName, params || {}); } catch (e) {}
  try { if (window.fbq && metaName) fbq(['Lead', 'Contact'].includes(metaName) ? 'track' : 'trackCustom', metaName, params || {}); } catch (e) {}
};
// לחיצות על וואטסאפ וטלפון, מכל מקום באתר (כולל המחשבון)
document.addEventListener('click', e => {
  const a = e.target.closest('a'); if (!a) return;
  const page = (document.body.className.match(/page-(\w+)/) || [])[1];
  if (/wa\.me/.test(a.href)) track('contact_whatsapp', 'Contact', {page, method: 'whatsapp'});
  else if (a.href.startsWith('tel:')) track('contact_phone', 'Contact', {page, method: 'phone'});
});
// ===================================
const waUrl = (text) => 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(text || SITE.whatsappText);
document.querySelectorAll('.wa-link').forEach(a => a.href = waUrl(a.dataset.wa));
document.querySelectorAll('.ig-link').forEach(a => a.href = SITE.instagram);
const yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

// כל עמוד נפתח מלמעלה (חוץ מקישור לאזור מסוים, למשל #contact)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const toTop = () => { if (!location.hash) { window.scrollTo(0, 0); try { document.body.scrollIntoView({block: 'start'}); } catch (e) {} } };
toTop(); window.addEventListener('load', toTop);

// תפריט: עמוד פעיל + המבורגר
const page = (document.body.className.match(/page-(\w+)/) || [])[1];
document.querySelectorAll('#nav a[data-p]').forEach(a => { if (a.dataset.p === page) a.classList.add('active'); });
const nav = document.getElementById('nav');
document.querySelector('.burger').addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// כותרת כהה בגלילה
const hdr = document.getElementById('hdr');
const onScroll = () => hdr.classList.toggle('solid', window.scrollY > 60);
onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

// אנימציית הופעה
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// שמירת UTM מהקישור שהגולשת הגיעה ממנו (למשל מקמפיין), כדי שיגיע עם הליד
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
try {
  const q = new URLSearchParams(location.search);
  if (UTM_KEYS.some(k => q.get(k))) sessionStorage.setItem('utm', JSON.stringify(Object.fromEntries(UTM_KEYS.map(k => [k, q.get(k) || '']))));
} catch (e) {}
const getUtm = () => { try { return JSON.parse(sessionStorage.getItem('utm')) || {}; } catch (e) { return {}; } };
const intlPhone = p => { const d = String(p || '').replace(/\D/g, ''); return d.startsWith('972') ? d : d.startsWith('0') ? '972' + d.slice(1) : d; };

// טופסי לידים (בכל עמוד, כולל המחשבון): נשלחים למאנדיי דרך Make ולמייל.
// אם שניהם נכשלים – עוברים לוואטסאפ כדי שאף ליד לא ילך לאיבוד.
const PAGE_NAMES = {index: 'דף הבית', tracks: 'מסלולים', results: 'לפני ואחרי', reviews: 'חוות דעת', about: 'מי אני', recipes: 'מתכונים', calculator: 'מחשבון'};
document.addEventListener('submit', e => {
  const form = e.target.closest('form.lead-form'); if (!form) return;
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const d = Object.fromEntries(new FormData(form));
  if (d._honey) return;
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'שולחת...';
  const pageKey = (document.body.className.match(/page-(\w+)/) || [])[1];
  const pageName = d.page || PAGE_NAMES[pageKey] || document.title.split('|')[0].trim();
  const notes = d.notes || ('גיל: ' + (d.age || '-') + ' | מטרה: ' + (d.goal || '-') + ' | עמוד: ' + pageName);
  const done = () => {
    track('generate_lead', 'Lead', {goal: d.goal, page: pageName});
    form.classList.add('sent');
    [...form.children].forEach(c => { if (!c.classList.contains('thanks')) c.style.display = 'none'; });
    const t = form.querySelector('.thanks'); if (t) t.style.display = 'block';
  };
  const viaWhatsapp = () => {
    window.location.href = waUrl('היי, השארתי פרטים באתר של מאיה:\nשם: ' + d.name + '\nטלפון: ' + d.phone + (d.age ? '\nגיל: ' + d.age : '') + (d.goal ? '\nמטרה: ' + d.goal : '') + (d.notes ? '\n' + d.notes : ''));
    done();
  };
  const utm = getUtm();
  const jobs = [];
  if (SITE.makeWebhook) jobs.push(fetch(SITE.makeWebhook, {
    method: 'POST', mode: 'no-cors', keepalive: true,
    body: new URLSearchParams({
      name: d.name, phone: intlPhone(d.phone), age: d.age || '', goal: d.goal || '', page: pageName, notes,
      source: 'אתר', utm_source: utm.utm_source || '', utm_medium: utm.utm_medium || '',
      utm_campaign: utm.utm_campaign || '', utm_content: utm.utm_content || ''
    })
  }));
  if (SITE.formEndpoint) jobs.push(fetch(SITE.formEndpoint, {
    method: 'POST', keepalive: true,
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    body: JSON.stringify({
      'שם': d.name, 'טלפון': d.phone, 'גיל': d.age || '', 'מטרה': d.goal || '', 'עמוד': pageName, 'פרטים': notes,
      _subject: 'ליד חדש מהאתר (' + pageName + '): ' + d.name, _template: 'table', _captcha: 'false'
    })
  }).then(r => { if (!r.ok) throw new Error('mail'); }));
  if (!jobs.length) return viaWhatsapp();
  // מציגים "תודה" ברגע שאחד הערוצים קיבל את הליד, בלי לחכות למייל (שלפעמים איטי).
  // אם אחרי 6 שניות אף אחד עוד לא ענה – מציגים "תודה" בכל זאת (הבקשות ממשיכות ברקע).
  let finished = false;
  const finish = ok => { if (finished) return; finished = true; ok ? done() : viaWhatsapp(); };
  jobs.forEach(j => j.then(() => finish(true), () => {}));
  Promise.allSettled(jobs).then(rs => { if (!rs.some(r => r.status === 'fulfilled')) finish(false); });
  setTimeout(() => finish(true), 6000);
});

// סינון (מתכונים)
document.querySelectorAll('.chips').forEach(group => {
  group.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    group.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    const f = b.dataset.f;
    document.querySelectorAll(group.dataset.target + ' [data-cat]').forEach(el => el.hidden = !(f === 'all' || el.dataset.cat === f));
  });
});
