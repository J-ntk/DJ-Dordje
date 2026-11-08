/* DJ Dordje — interactions */
(function () {
  'use strict';
  var WA_NUMBER = '306942770701'; // WhatsApp number that receives booking requests
  var doc = document.documentElement;
  var body = document.body;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.add('js');

  /* ---------- Side A / Side B ---------- */
  var SIDES = { a: { cls: 'side-a', label: 'Side A', name: 'Свадьба' }, b: { cls: 'side-b', label: 'Side B', name: 'Вечеринка' } };
  function readStored() { try { return localStorage.getItem('dd-side'); } catch (e) { return null; } }
  function store(s) { try { localStorage.setItem('dd-side', s); } catch (e) {} }
  function fromUrl() {
    var q = new URLSearchParams(location.search).get('side') || location.hash.replace('#', '');
    if (/^(a|wedding|svadba)$/i.test(q)) return 'a';
    if (/^(b|party|vecherinka)$/i.test(q)) return 'b';
    return null;
  }
  var current = null;

  function apply(s) {
    current = s;
    body.classList.remove('side-a', 'side-b');
    body.classList.add(SIDES[s].cls);
    document.querySelectorAll('[data-side-btn]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-side-btn') === s ? 'true' : 'false');
    });
    var sel = document.getElementById('f-type');
    if (sel && !sel.dataset.touched) sel.value = s === 'a' ? 'Свадьба' : 'Вечеринка / день рождения';
    store(s);
  }

  function switchTo(s, withWipe) {
    if (s === current) return;
    if (!withWipe || reduce || !current) { apply(s); return; }
    var w = document.createElement('div');
    w.className = 'wipe';
    w.setAttribute('aria-hidden', 'true');
    w.innerHTML = '<small>● ' + SIDES[s].label + '</small><strong>' + SIDES[s].name + '</strong>';
    body.appendChild(w);
    setTimeout(function () { apply(s); }, 520);
    setTimeout(function () { w.remove(); }, 1120);
  }

  document.querySelectorAll('[data-side-btn]').forEach(function (b) {
    b.addEventListener('click', function () { switchTo(b.getAttribute('data-side-btn'), true); });
  });

  var start = fromUrl() || readStored();
  if (start) { apply(start); }
  else {
    apply('a');
    body.classList.add('choosing');
    var first = document.querySelector('.choice');
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 50);
  }
  document.querySelectorAll('[data-choose]').forEach(function (b) {
    b.addEventListener('click', function () {
      apply(b.getAttribute('data-choose'));
      body.classList.remove('choosing');
      window.scrollTo(0, 0);
      restartLetters();
    });
  });

  function restartLetters() {
    document.querySelectorAll('.hero .letter').forEach(function (l) {
      l.style.animation = 'none'; void l.offsetWidth; l.style.animation = '';
    });
  }

  /* ---------- Hero video ---------- */
  var hv = document.querySelector('.hero-vid');
  if (hv) {
    hv.muted = true;
    if (reduce) { hv.removeAttribute('autoplay'); hv.pause(); }
    else { var p = hv.play(); if (p && p.catch) p.catch(function () {}); }
  }

  /* ---------- BPM marquee: speed follows scroll ---------- */
  var mq = document.querySelector('.mq-track');
  if (mq && !reduce) {
    var x = 0, vel = 0, lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY; vel += Math.abs(y - lastY); lastY = y;
    }, { passive: true });
    (function tick() {
      var party = current === 'b';
      var speed = (party ? 1.4 : 0.5) + Math.min(vel, 300) * (party ? 0.07 : 0.03);
      vel *= 0.9; x -= speed;
      var half = mq.scrollWidth / 2;
      if (half > 0 && -x >= half) x += half;
      mq.style.transform = 'translateX(' + x + 'px)';
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- Reveal, photos to colour, CDJ counters ---------- */
  function flick(el) {
    if (reduce) return;
    var fin = el.getAttribute('data-n'), i = 0;
    var iv = setInterval(function () {
      el.textContent = String(10 + Math.floor(Math.random() * 89));
      if (++i > 10) { clearInterval(iv); el.textContent = fin; }
    }, 45);
  }
  // Headings start fully clipped (zero visible area), so we watch their parent block instead.
  var targets = [];
  document.querySelectorAll('.ph, .count').forEach(function (el) { targets.push({ watch: el, el: el }); });
  document.querySelectorAll('.reveal').forEach(function (el) { targets.push({ watch: el.parentElement, el: el }); });
  if ('IntersectionObserver' in window) {
    var map = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        (map.get(e.target) || []).forEach(function (el) {
          el.classList.add('is-in');
          if (el.classList.contains('count')) flick(el);
        });
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    targets.forEach(function (t) {
      if (!map.has(t.watch)) map.set(t.watch, []);
      map.get(t.watch).push(t.el);
      io.observe(t.watch);
    });
  } else {
    targets.forEach(function (t) { t.el.classList.add('is-in'); });
  }

  /* ---------- Tracklist (prices) ---------- */
  var waveHtml = '';
  for (var i = 0; i < 72; i++) {
    var h = 18 + Math.round(Math.abs(Math.sin(i * 0.55) * 52 + Math.sin(i * 1.7) * 26));
    waveHtml += '<i style="height:' + Math.min(h, 100) + '%"></i>';
  }
  document.querySelectorAll('.wave-bars').forEach(function (w) { w.innerHTML = waveHtml; });
  var tracks = document.querySelectorAll('.track');
  tracks.forEach(function (t) {
    var btn = t.querySelector('.track-btn');
    btn.addEventListener('click', function () {
      var open = t.classList.contains('open');
      tracks.forEach(function (o) { o.classList.remove('open'); o.querySelector('.track-btn').setAttribute('aria-expanded', 'false'); });
      if (!open) { t.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ---------- Booking form → WhatsApp + beat drop ---------- */
  var sel = document.getElementById('f-type');
  if (sel) sel.addEventListener('change', function () { sel.dataset.touched = '1'; });
  var form = document.getElementById('book-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var d = new FormData(form);
      var date = d.get('date') ? new Date(d.get('date')).toLocaleDateString('ru-RU') : '—';
      var msg = 'Привет, Дордже! Хочу забронировать дату.\n' +
        'Имя: ' + (d.get('name') || '—') + '\n' +
        'Праздник: ' + (d.get('type') || '—') + '\n' +
        'Дата: ' + date + '\n' +
        'Гостей: ' + (d.get('guests') || '—') + '\n' +
        'Контакт: ' + (d.get('contact') || '—');
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
      if (!reduce) {
        var f = document.createElement('div'); f.className = 'flash'; f.setAttribute('aria-hidden', 'true');
        body.appendChild(f); setTimeout(function () { f.remove(); }, 700);
        body.classList.add('shake'); setTimeout(function () { body.classList.remove('shake'); }, 460);
      }
      document.getElementById('form-box').classList.add('done');
      var link = document.getElementById('wa-link'); if (link) link.href = url;
      setTimeout(function () { window.open(url, '_blank', 'noopener'); }, reduce ? 0 : 450);
    });
    var again = document.getElementById('form-again');
    if (again) again.addEventListener('click', function () { document.getElementById('form-box').classList.remove('done'); form.reset(); });
  }

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
