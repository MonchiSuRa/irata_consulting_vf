/* IRATA Consulting — main.js (vanilla, sin dependencias) */
(function () {
  'use strict';
  var C = Object.assign({ email: '', whatsapp: '', linkedin: '', instagram: '', formEndpoint: '' }, window.IRATA_CONFIG || {});
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Config: contacto visible ---------- */
  $$('[data-email]').forEach(function (el) { el.textContent = C.email; if (el.tagName === 'A') el.href = 'mailto:' + C.email; });
  var mailCh = $('#ch-mail'); if (mailCh) mailCh.href = 'mailto:' + C.email;
  var wa = $('#ch-wa'), li = $('#ch-in');
  if (C.whatsapp && wa) { wa.href = 'https://wa.me/' + C.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent('Hola IRATA, quiero conversar sobre mi negocio.'); wa.hidden = false; }
  if (C.linkedin && li) { li.href = C.linkedin; li.hidden = false; }
  ['linkedin', 'instagram'].forEach(function (k) { if (C[k]) { var li2 = $('[data-social="' + k + '"]'); if (li2) { li2.hidden = false; $('a', li2).href = C[k]; } } });

  /* ---------- Menú móvil ---------- */
  var burger = $('#burger'), drawer = $('#drawer');
  function toggleMenu(open) {
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    drawer.classList.toggle('open', open); document.body.classList.toggle('menu-open', open); document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { toggleMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1060) toggleMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var t = e.target; t.classList.add('in'); io.unobserve(t); t.addEventListener('transitionend', function done(ev) { if (ev.target !== t || ev.propertyName !== 'transform') return; t.removeEventListener('transitionend', done); t.classList.remove('rv', 'in'); }); } }); }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* ---------- Pestañas de servicios ---------- */
  var tabs = $$('.tab'), panels = $$('.panel');
  function selectTab(area, focus, scroll) {
    tabs.forEach(function (t) {
      var on = t.dataset.area === area; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach(function (p) {
      var on = p.id === 'p-' + area; p.classList.toggle('on', on);
      if (on) { p.classList.remove('in'); void p.offsetWidth; p.classList.add('in'); if (scroll && window.innerWidth <= 1060) setTimeout(function () { p.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }); }, 30); }
    });
  }
  /* móvil: enlace para volver a la lista de síntomas */
  var tabsBox = $('.tabs'); if (tabsBox) { tabsBox.id = 'sintomas'; panels.forEach(function (p) { var a = document.createElement('a'); a.className = 'back-tabs'; a.href = '#sintomas'; a.innerHTML = '<svg class="i"><use href="#i-arrow"/></svg> Elegir otro síntoma'; p.appendChild(a); }); }
  var qs = new URLSearchParams(location.search);
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t.dataset.area, false, true); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = (i + 1) % tabs.length;
      else if (k === 'ArrowUp' || k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') n = 0; else if (k === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); selectTab(tabs[n].dataset.area, true); }
    });
  });

  if (tabs.length && qs.get('s') && $('#t-' + qs.get('s'))) selectTab(qs.get('s'));

  /* ---------- Entre páginas: el diagnóstico viaja al formulario ---------- */
  function store(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { } }
  function recall(k, del) { try { var v = sessionStorage.getItem(k); if (del) sessionStorage.removeItem(k); return v; } catch (e) { return null; } }
  var form = $('#contact-form');
  function prefill(area, msg) {
    if (area) { var r = $('#a-' + area); if (r) r.checked = true; }
    if (msg) { var t = $('#f-reto'); if (t && !t.value) t.value = msg; }
  }
  if (form) prefill(qs.get('area'), recall('irata_diag', false));

  /* ---------- Mini tablero (datos de ejemplo) ---------- */
  var M = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'];
  var V = {
    ventas: {
      kpis: [['Ventas', '+60%', 'up'], ['Utilidad', '−23%', 'down'], ['Margen', '22% → 11%', 'down']],
      insight: 'Las ventas suben, la utilidad se achica. Vender más no siempre es ganar más: aquí se va la plata.',
      type: 'line', min: 60, unit: 'Índice (Ene = 100)', series: [{ n: 'Ventas', c: '#0B6BF0', d: [100, 108, 115, 124, 133, 141, 150, 160] }, { n: 'Utilidad', c: '#8B35F0', d: [100, 105, 100, 95, 91, 86, 82, 77] }]
    },
    clientes: {
      kpis: [['Clientes nuevos', '55', 'up'], ['Recurrentes', '13', 'down'], ['Recompra', '≈19%', 'down']],
      insight: 'Captas bien, pero casi nadie repite. El tesoro está en fidelizar y recuperar a los que se fueron.',
      type: 'bars', series: [{ n: 'Nuevos', c: '#12C4F0', d: [40, 44, 43, 48, 50, 52, 51, 55] }, { n: 'Recurrentes', c: '#8B35F0', d: [12, 12, 13, 12, 13, 13, 14, 13] }]
    },
    tiempo: {
      kpis: [['Tareas mejorables', '86%', 'down'], ['Lo importante', '14%', 'up'], ['Recuperable', 'sí']],
      insight: 'Casi todo el tiempo se va en cosas que un buen proceso o una automatización resuelven.',
      type: 'hbars', rows: [['Reportes a mano', 30], ['Responder lo mismo', 22], ['Buscar información', 18], ['Corregir errores', 16], ['Lo importante', 14]]
    }
  };
  var kpisEl = $('#kpis'), chartEl = $('#chart'), insEl = $('#insight');
  var hasDash = !!(kpisEl && chartEl && insEl);
  function CW() { return window.innerWidth < 520 ? 380 : 560; }
  var curView = 'ventas', narrow = CW() === 380;
  function lineChart(s) {
    var W = CW(), H = 250, pl = 34, pr = 14, pt = 16, pb = 30, all = [], i;
    s.series.forEach(function (x) { all = all.concat(x.d); });
    var max = Math.ceil(Math.max.apply(null, all) / 20) * 20, mn = s.min || 0, n = M.length;
    function X(i) { return pl + i * (W - pl - pr) / (n - 1); } function Y(v) { return H - pb - (v - mn) / (max - mn) * (H - pt - pb); }
    var g = '<text x="' + pl + '" y="12" style="fill:#555B7E">' + (s.unit || '') + '</text>';
    for (i = 0; i <= 4; i++) { var yv = mn + (max - mn) / 4 * i; g += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(yv) + '" y2="' + Y(yv) + '" stroke="rgba(5,11,31,.12)" stroke-dasharray="3 5"/><text x="' + (pl - 8) + '" y="' + (Y(yv) + 4) + '" text-anchor="end">' + Math.round(yv) + '</text>'; }
    M.forEach(function (m, i) { g += '<text x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + m + '</text>'; });
    s.series.forEach(function (x) {
      var d = x.d.map(function (v, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1); }).join(' ');
      g += '<path class="ln" d="' + d + '" stroke="' + x.c + '" style="--len:900"/>';
      x.d.forEach(function (v, i) { if (i === n - 1) g += '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="6" fill="' + x.c + '" stroke="#050B1F" stroke-width="2"/>'; });
    });
    return wrap(W, H, g + legend(s.series, W));
  }
  function barChart(s) {
    var W = CW(), H = 250, pl = 34, pr = 14, pt = 16, pb = 30, n = M.length, all = s.series[0].d.concat(s.series[1].d), max = Math.ceil(Math.max.apply(null, all) / 20) * 20, g = '', i;
    function Y(v) { return H - pb - v / max * (H - pt - pb); }
    for (i = 0; i <= 4; i++) { var yv = max / 4 * i; g += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(yv) + '" y2="' + Y(yv) + '" stroke="rgba(5,11,31,.12)" stroke-dasharray="3 5"/><text x="' + (pl - 8) + '" y="' + (Y(yv) + 4) + '" text-anchor="end">' + Math.round(yv) + '</text>'; }
    var gw = (W - pl - pr) / n, bw = gw * .3;
    M.forEach(function (m, k) {
      var cx = pl + gw * k + gw / 2;
      s.series.forEach(function (x, j) { var h = H - pb - Y(x.d[k]); g += '<rect class="bar" style="animation-delay:' + (k * .05 + j * .03) + 's" x="' + (cx - bw - 1 + j * (bw + 2)) + '" y="' + Y(x.d[k]) + '" width="' + bw + '" height="' + h + '" rx="4" fill="' + x.c + '" stroke="#050B1F" stroke-width="1.5"/>'; });
      g += '<text x="' + cx + '" y="' + (H - 8) + '" text-anchor="middle">' + m + '</text>';
    });
    return wrap(W, H, g + legend(s.series, W));
  }
  function hChart(v) {
    var W = CW(), H = 250, g = '', cols = ['#8B35F0', '#0B6BF0', '#12C4F0', '#FFB38A', '#D5F45B'], bh = 30, gap = 14, lx = 150, mx = 36;
    v.rows.forEach(function (r, i) {
      var y = 12 + i * (bh + gap), w = (W - lx - mx) * r[1] / 30;
      g += '<text x="' + (lx - 12) + '" y="' + (y + bh / 2 + 4) + '" text-anchor="end" style="fill:#050B1F;font-weight:700;font-size:12px">' + r[0] + '</text><rect class="hbar" style="animation-delay:' + i * .08 + 's" x="' + lx + '" y="' + y + '" width="' + w + '" height="' + bh + '" rx="8" fill="' + cols[i] + '" stroke="#050B1F" stroke-width="2"/><text x="' + (lx + w + 8) + '" y="' + (y + bh / 2 + 4) + '" style="fill:#050B1F;font-weight:800;font-size:12px">' + r[1] + '%</text>';
    });
    return wrap(W, H, g);
  }
  function legend(ss, W) { var x = W - 14, g = '<g class="lg">'; ss.slice().reverse().forEach(function (s) { var w = s.n.length * 7 + 22; x -= w; g += '<circle cx="' + (x + 5) + '" cy="10" r="5" fill="' + s.c + '" stroke="#050B1F" stroke-width="1.5"/><text x="' + (x + 15) + '" y="14">' + s.n + '</text>'; }); return g + '</g>'; }
  function wrap(W, H, inner) { return '<svg class="cht" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">' + inner + '</svg>'; }
  function renderView(k) {
    var v = V[k]; curView = k;
    kpisEl.innerHTML = v.kpis.map(function (x) { return '<div class="kpi ' + (x[2] || '') + '"><small>' + x[0] + '</small><b>' + x[1] + '</b></div>'; }).join('');
    chartEl.innerHTML = v.type === 'line' ? lineChart(v) : v.type === 'bars' ? barChart(v) : hChart(v);
    chartEl.setAttribute('aria-label', 'Gráfico de ejemplo: ' + $('.dash-tabs [data-view="' + k + '"]').textContent);
    insEl.textContent = v.insight;
  }
  var dtabs = hasDash ? $$('.dash-tabs button') : [];
  dtabs.forEach(function (b, i) {
    b.addEventListener('click', function () { dtabs.forEach(function (x) { x.setAttribute('aria-selected', x === b); x.tabIndex = x === b ? 0 : -1; }); renderView(b.dataset.view); });
    b.addEventListener('keydown', function (e) { var n = null; if (e.key === 'ArrowRight') n = (i + 1) % dtabs.length; if (e.key === 'ArrowLeft') n = (i - 1 + dtabs.length) % dtabs.length; if (n !== null) { e.preventDefault(); dtabs[n].focus(); dtabs[n].click(); } });
  });
  if (hasDash) { renderView('ventas'); window.addEventListener('resize', function () { var n = CW() === 380; if (n !== narrow) { narrow = n; renderView(curView); } }); }

  /* ---------- Autodiagnóstico ---------- */
  var QS = {
    marcha: [
      { t: 'Sé cuánto gano de verdad cada mes (utilidad), no solo cuánto vendo.', a: 'orden' },
      { t: 'Si me ausento una semana, el negocio sigue sin llamarme cada hora.', a: 'procesos' },
      { t: 'Tengo claro qué productos o servicios me dejan más margen.', a: 'ventas' },
      { t: 'Mis procesos clave están escritos, o se hacen igual sin importar quién los haga.', a: 'procesos' },
      { t: 'Mi base de clientes está ordenada y sé cuáles vuelven y cuáles no.', a: 'clientes' },
      { t: 'Reviso unos pocos indicadores cada semana y decido con ellos.', a: 'datos' },
      { t: 'Mis herramientas (caja o POS, Excel, redes, facturación) se hablan entre sí; casi no copio y pego.', a: 'tecnologia' }
    ],
    arranque: [
      { t: 'Puedo explicar en una frase qué vendo, a quién y por qué me elegirían.', a: 'plan' },
      { t: 'Sé cuánto tengo que vender cada mes para cubrir mis costos.', a: 'plan' },
      { t: 'He hablado con posibles clientes para confirmar que pagarían por mi propuesta.', a: 'mercado' },
      { t: 'Conozco a mi competencia y sé en qué me diferencio de ella.', a: 'mercado' },
      { t: 'Tengo metas y pasos concretos para los próximos 90 días.', a: 'planificacion' },
      { t: 'Llevo un control básico de lo que entra y lo que sale, aunque sea en una hoja.', a: 'planificacion' },
      { t: 'Tengo a alguien con experiencia a quien consultar mis decisiones importantes.', a: 'asesoria' }
    ]
  };
  var AL = { orden: 'Orden y estrategia', procesos: 'Procesos y eficiencia', ventas: 'Ventas y rentabilidad', datos: 'Datos e indicadores', clientes: 'Clientes y relacionamiento', tecnologia: 'Tecnología y automatización', plan: 'Plan de negocios', mercado: 'Estudio de mercado', planificacion: 'Planificación', asesoria: 'Asesoría y acompañamiento' };
  var OPT = [['Sí, tal cual', 2], ['A medias', 1], ['Todavía no', 0]];
  var BANDS = {
    marcha: [
      { max: 4, tag: 'Modo supervivencia', h: 'Tu negocio funciona porque tú empujas.', p: 'Es muy normal en esta etapa, y es justo el mejor momento para ordenar antes de crecer. Un diagnóstico te daría claridad rápida sobre por dónde empezar.' },
      { max: 9, tag: 'En construcción', h: 'Buenas bases, varios huecos.', p: 'Hay cosas que ya funcionan y otras que se te escapan. Cerrar esos huecos suele ahorrar tiempo y plata más rápido de lo que parece.' },
      { max: 14, tag: 'Casi listo para escalar', h: 'Vas bien. Falta afinar.', p: 'Con un par de ajustes quedas preparado para el siguiente salto con control: más sedes, más equipo o más canales.' }
    ],
    arranque: [
      { max: 4, tag: 'Idea en etapa semilla', h: 'Tienes la ilusión. Falta aterrizar la ruta.', p: 'Es el mejor momento para validar con calma antes de gastar: un plan claro y una conversación con el mercado te ahorran meses de prueba y error.' },
      { max: 9, tag: 'Despegando', h: 'Vas armando las piezas.', p: 'Ya tienes parte del camino. Conectar plan, mercado y números te dará la seguridad para dar el siguiente paso sin improvisar.' },
      { max: 14, tag: 'Listo para lanzar', h: 'Tu base está sólida. Toca ejecutar con foco.', p: 'Lo esencial está claro. Un acompañamiento puntual te ayuda a priorizar y a medir desde el primer día.' }
    ]
  };
  var quiz = $('#quiz'), qi = 0, ans = [], track = 'marcha', Q = QS.marcha;
  function setTrack(t) { track = t; Q = QS[t]; }
  function qStart(t) {
    ans = [];
    if (t === 'arranque' || t === 'marcha') { setTrack(t); qi = 0; qRender(); } else { qi = -1; qRender(); }
  }
  function qProfile() {
    quiz.innerHTML = '<div class="q-top"><span>Antes de empezar</span></div>' +
      '<p class="q-text">¿En qué momento está tu negocio?</p><div class="q-opts">' +
      '<button class="q-opt" data-track="arranque"><kbd>1</kbd>Estoy arrancando: tengo la idea o apenas empiezo</button>' +
      '<button class="q-opt" data-track="marcha"><kbd>2</kbd>Ya vendo y estoy en marcha: quiero ordenar y crecer</button></div>';
    $$('.q-opt', quiz).forEach(function (b) { b.addEventListener('click', function () { qStart(b.dataset.track); }); });
  }
  function qRender() {
    if (qi < 0) return qProfile();
    if (qi >= Q.length) return qResult();
    var pct = Math.round(qi / Q.length * 100);
    quiz.innerHTML = '<div class="q-top"><span>' + (qi + 1) + ' / ' + Q.length + '</span><div class="q-bar"><i style="width:' + pct + '%"></i></div></div>' +
      '<p class="q-text">' + Q[qi].t + '</p><div class="q-opts">' + OPT.map(function (o, j) { return '<button class="q-opt" data-v="' + o[1] + '"><kbd>' + (j + 1) + '</kbd>' + o[0] + '</button>'; }).join('') + '</div>' +
      '<button class="q-back">← Volver</button>';
    requestAnimationFrame(function () { var bar = $('.q-bar i', quiz); if (bar) bar.style.width = Math.round((qi + .001) / Q.length * 100) + '%'; });
    $$('.q-opt', quiz).forEach(function (b) { b.addEventListener('click', function () { ans[qi] = +b.dataset.v; qi++; qRender(); }); });
    var back = $('.q-back', quiz); back.addEventListener('click', function () { qi = qi - 1; qRender(); });
  }
  function qResult() {
    var bands = BANDS[track], start = track === 'arranque';
    var score = ans.reduce(function (a, b) { return a + b; }, 0), band = bands.filter(function (b) { return score <= b.max; })[0];
    var agg = {}, order = [];
    Q.forEach(function (q, i) { if (!agg[q.a]) { agg[q.a] = { s: 0, n: 0 }; order.push(q.a); } agg[q.a].s += ans[i]; agg[q.a].n += 2; });
    var weak = order.reduce(function (m, k) { return agg[k].s / agg[k].n < agg[m].s / agg[m].n ? k : m; }, order[0]);
    var weakTxt = '';
    if (agg[weak].s !== agg[weak].n) {
      weakTxt = start
        ? '<p class="res-weak">Tu punto más flojo: <b>' + AL[weak] + '</b>. Es donde más te ayudaría una asesoría de arranque. <a href="servicios.html?s=arranque#servicios" data-weak="arranque">Ver qué hacemos con eso →</a></p>'
        : '<p class="res-weak">Tu punto más flojo: <b>' + AL[weak] + '</b>. <a href="servicios.html?s=' + weak + '#servicios" data-weak="' + weak + '">Ver qué hacemos con eso →</a></p>';
    }
    var cta = start
      ? '<a class="btn btn--ink" href="contacto.html?area=arranque" id="q-cta">Quiero arrancar con orden <svg class="i"><use href="#i-arrow"/></svg></a>'
      : '<a class="btn btn--ink" href="contacto.html?area=orden" id="q-cta">Quiero un Business Check <svg class="i"><use href="#i-arrow"/></svg></a>';
    quiz.innerHTML = '<div class="res"><div class="res-score">' + score + '<small>/ ' + (Q.length * 2) + '</small></div><span class="res-tag">' + band.tag + '</span><h3>' + band.h + '</h3><p>' + band.p + '</p>' +
      '<div class="res-meter" role="img" aria-label="' + score + ' de ' + (Q.length * 2) + '"><i></i></div>' + weakTxt +
      '<div class="res-cta">' + cta + '<button class="btn" id="q-redo" type="button">Repetir</button></div>' +
      '<p class="fine">Puntuación orientativa, no es una auditoría. Sirve para abrir la conversación.</p></div>';
    requestAnimationFrame(function () { setTimeout(function () { var m = $('.res-meter i', quiz); if (m) m.style.width = Math.round(score / (Q.length * 2) * 100) + '%'; }, 60); });
    var msg = 'Hice el autodiagnóstico de IRATA' + (start ? ' (emprendedor en arranque)' : '') + ': ' + score + '/' + (Q.length * 2) + ' (' + band.tag + '). Mi punto más flojo: ' + AL[weak] + '.';
    $('#q-cta').addEventListener('click', function () { store('irata_diag', msg); });
    $('#q-redo').addEventListener('click', function () { qStart(); });
    var wl = $('[data-weak]', quiz); if (wl) wl.addEventListener('click', function () { store('irata_diag', msg); });
  }
  if (quiz) document.addEventListener('keydown', function (e) {
    if (!quiz.contains(document.activeElement) && document.activeElement !== document.body) return;
    var b = $$('.q-opt', quiz)[+e.key - 1]; var r = quiz.getBoundingClientRect();
    if (b && r.top < innerHeight && r.bottom > 0 && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '')) b.click();
  });
  if (quiz) qStart(qs.get('perfil') === 'arranque' ? 'arranque' : undefined);

  /* ---------- Formularios ---------- */
  function say(el, type, html) { el.className = 'msg show ' + type; el.innerHTML = html; }
  function submitData(subject, fields, msgEl, btn, done) {
    if (C.formEndpoint) {
      btn.disabled = true;
      var fd = new FormData(); Object.keys(fields).forEach(function (k) { fd.append(k, fields[k]); }); fd.append('_subject', subject);
      fetch(C.formEndpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw 0; say(msgEl, 'ok', '¡Listo! Recibimos tu mensaje. Te respondemos en 24 a 48 horas hábiles.'); done(); })
        .catch(function () { say(msgEl, 'err', 'No pudimos enviarlo. Escríbenos a <a href="mailto:' + C.email + '">' + C.email + '</a>.'); })
        .then(function () { btn.disabled = false; });
    } else {
      var body = Object.keys(fields).filter(function (k) { return fields[k]; }).map(function (k) { return k + ': ' + fields[k]; }).join('\n');
      window.location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      say(msgEl, 'ok', 'Se abrió tu app de correo con el mensaje listo. Si no pasó nada, escríbenos a <a href="mailto:' + C.email + '">' + C.email + '</a>.');
    }
  }
  function flag(el, bad) { el.setAttribute('aria-invalid', bad ? 'true' : 'false'); return bad; }
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault(); var f = form.elements, msg = $('#form-msg'), bad = false;
    if (f.website.value) return; // honeypot
    bad = flag(f.nombre, !f.nombre.value.trim()) | flag(f.contacto, !f.contacto.value.trim()) | flag(f.reto, !f.reto.value.trim());
    if (bad) { say(msg, 'err', 'Faltan campos obligatorios (nombre, contacto y tu reto).'); (form.querySelector('[aria-invalid="true"]') || {}).focus && form.querySelector('[aria-invalid="true"]').focus(); return; }
    if (!$('#f-consent').checked) { say(msg, 'err', 'Marca la casilla de consentimiento para poder responderte.'); return; }
    var area = (form.querySelector('input[name="area"]:checked') || {}).value || '';
    submitData('Nuevo contacto desde la web — ' + f.nombre.value.trim(), { Nombre: f.nombre.value.trim(), Negocio: f.negocio.value.trim(), Contacto: f.contacto.value.trim(), Sector: f.sector.value, 'Área de interés': area, Reto: f.reto.value.trim() }, msg, form.querySelector('button[type=submit]'), function () { form.reset(); recall('irata_diag', true); });
  });
  var nf = $('#news-form');
  if (nf) nf.addEventListener('submit', function (e) {
    e.preventDefault(); var msg = $('.msg', nf), em = nf.elements.email;
    if (nf.elements.website.value) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value.trim())) { say(msg, 'err', 'Revisa tu correo, parece incompleto.'); em.focus(); return; }
    submitData('Suscripción a recursos IRATA', { Correo: em.value.trim() }, msg, nf.querySelector('button'), function () { nf.reset(); });
  });
  if (form) form.addEventListener('input', function (e) { if (e.target.getAttribute && e.target.getAttribute('aria-invalid') === 'true') e.target.setAttribute('aria-invalid', 'false'); });
})();
