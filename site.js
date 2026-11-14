// ===== הגדרות האתר: לעדכן כאן =====
const SITE = {
  whatsapp: '972507199885',
  whatsappText: 'היי מאיה, הגעתי מהאתר ואשמח לשמוע פרטים על הליווי',
  instagram: 'https://www.instagram.com/mayagranat/',
  formEndpoint: 'https://formsubmit.co/ajax/gmaya80@gmail.com',  // גיבוי: כל ליד מגיע גם למייל דרך FormSubmit
  makeWebhook: 'https://hook.eu1.make.com/tvmapi53b5b9otbt1tut06kntcp1khq5'  // כתובת ה-Webhook מ-Make: הליד נכנס ללוח "טופס יצירת לידים" במאנדיי
};
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

// טופס לידים: נשלח למאנדיי (דרך Make) ולמייל. אם שניהם נכשלים – עובר לוואטסאפ כדי שאף ליד לא ילך לאיבוד
const form = document.getElementById('leadForm');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  if (d._honey) return;
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true; btn.textContent = 'שולחת...';
  const done = () => {
    [...form.children].forEach(c => { if (c.id !== 'thanks') c.style.display = 'none'; });
    document.getElementById('thanks').style.display = 'block';
  };
  const viaWhatsapp = () => {
    window.location.href = waUrl('היי מאיה, השארתי פרטים באתר:\nשם: ' + d.name + '\nטלפון: ' + d.phone + '\nגיל: ' + d.age + '\nמטרה: ' + d.goal);
    done();
  };
  const pageName = (document.body.className.match(/page-(\w+)/) || [])[1] === 'index' ? 'דף הבית' : document.title.split('|')[0].trim();
  const utm = getUtm();
  const jobs = [];
  if (SITE.makeWebhook) jobs.push(fetch(SITE.makeWebhook, {
    method: 'POST', mode: 'no-cors',
    body: new URLSearchParams({
      name: d.name, phone: intlPhone(d.phone), age: d.age, goal: d.goal, page: pageName,
      notes: 'גיל: ' + d.age + ' | מטרה: ' + d.goal + ' | עמוד: ' + pageName,
      source: 'אתר', utm_source: utm.utm_source || '', utm_medium: utm.utm_medium || '',
      utm_campaign: utm.utm_campaign || '', utm_content: utm.utm_content || ''
    })
  }));
  if (SITE.formEndpoint) jobs.push(fetch(SITE.formEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    body: JSON.stringify({
      'שם': d.name, 'טלפון': d.phone, 'גיל': d.age, 'מטרה': d.goal, 'עמוד': location.pathname,
      _subject: 'ליד חדש מהאתר: ' + d.name, _template: 'table', _captcha: 'false'
    })
  }).then(r => { if (!r.ok) throw new Error('mail'); }));
  if (!jobs.length) return viaWhatsapp();
  Promise.allSettled(jobs).then(rs => rs.some(r => r.status === 'fulfilled') ? done() : viaWhatsapp());
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
