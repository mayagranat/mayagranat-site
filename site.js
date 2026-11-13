// ===== הגדרות האתר: לעדכן כאן =====
const SITE = {
  whatsapp: '972507199885',
  whatsappText: 'היי מאיה, הגעתי מהאתר ואשמח לשמוע פרטים על הליווי',
  instagram: 'https://www.instagram.com/mayagranat/',
  formEndpoint: 'https://formsubmit.co/ajax/gmaya80@gmail.com'  // לידים נשלחים למייל דרך FormSubmit
};
// ===================================
const waUrl = (text) => 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(text || SITE.whatsappText);
document.querySelectorAll('.wa-link').forEach(a => a.href = waUrl(a.dataset.wa));
document.querySelectorAll('.ig-link').forEach(a => a.href = SITE.instagram);
const yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

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

// טופס לידים: נשלח למייל, ואם השליחה נכשלת – עובר לוואטסאפ כדי שאף ליד לא ילך לאיבוד
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
    window.location.href = waUrl('היי מאיה, השארתי פרטים באתר:\nשם: ' + d.name + '\nטלפון: ' + d.phone + '\nמטרה: ' + d.goal);
    done();
  };
  if (!SITE.formEndpoint) return viaWhatsapp();
  fetch(SITE.formEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    body: JSON.stringify({
      'שם': d.name, 'טלפון': d.phone, 'מטרה': d.goal, 'עמוד': location.pathname,
      _subject: 'ליד חדש מהאתר: ' + d.name, _template: 'table', _captcha: 'false'
    })
  }).then(r => r.ok ? done() : viaWhatsapp()).catch(viaWhatsapp);
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
