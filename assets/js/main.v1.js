/* Мини-экскаватор Брест: меню, подбор задачи, схема, заявка */
var WA_BASE = 'https://wa.me/375336758787';
var DIMS = window.__DIMS__ || {};

document.addEventListener('DOMContentLoaded', function () {
  initDrawer();
  initTasks();
  initForm();
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

function initDrawer() {
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  if (!burger || !drawer) return;
  var last = null;
  function open() {
    last = document.activeElement;
    drawer.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    var b = document.getElementById('drawer-close');
    if (b) b.focus({ preventScroll: true });
  }
  function close() {
    drawer.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    if (last) last.focus({ preventScroll: true });
  }
  burger.addEventListener('click', function () { drawer.hidden ? open() : close(); });
  var cb = document.getElementById('drawer-close');
  if (cb) cb.addEventListener('click', close);
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a')) { close(); return; }
    if (!e.target.closest('.drawer__inner')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (drawer.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    var items = drawer.querySelectorAll('a, button');
    if (!items.length) return;
    var f = items[0], l = items[items.length - 1];
    if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
    else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 960 && !drawer.hidden) close();
  });
}

function initTasks() {
  var chips = document.querySelectorAll('[data-task]');
  var hole = document.getElementById('cut-hole');
  var wLine = document.getElementById('cut-w-line');
  var wText = document.getElementById('cut-w-text');
  var dLine = document.getElementById('cut-d-line');
  if (!chips.length || !hole) return;
  var DATA = window.__TASKDATA__ || {};

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-on'); c.setAttribute('aria-selected', 'false'); });
      chip.classList.add('is-on');
      chip.setAttribute('aria-selected', 'true');
      var id = chip.getAttribute('data-task');
      var d = DATA[id];
      if (!d) return;
      var w = Math.round(d.w * 1.9);
      var dep = d.d;
      var x = 280 - w / 2;
      hole.setAttribute('x', x);
      hole.setAttribute('width', w);
      hole.setAttribute('height', dep + 30);
      wLine.setAttribute('d', 'M' + x + ' ' + (46 + dep + 34) + ' H' + (x + w));
      wText.setAttribute('x', x + w / 2);
      wText.setAttribute('y', 46 + dep + 54);
      wText.textContent = d.size;
      dLine.setAttribute('d', 'M' + (x + w + 22) + ' 46 V' + (46 + dep));
      dLine.style.display = '';
      document.getElementById('tc-title').textContent = d.title;
      document.getElementById('tc-desc').textContent = d.desc;
      document.getElementById('tc-tool').textContent = d.tool;
      document.getElementById('tc-size').textContent = d.size;
    });
  });
}

function initForm() {
  var form = document.getElementById('lead-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('f-name');
    var phone = document.getElementById('f-phone');
    var bad = false;
    [name, phone].forEach(function (el) {
      if (!el.value.trim()) { el.style.borderColor = '#A9572A'; bad = true; }
      else el.style.borderColor = '';
    });
    if (bad) return;
    var text = [
      'Заявка с сайта: аренда мини-экскаватора (Брест)',
      'Имя: ' + name.value.trim(),
      'Телефон: ' + phone.value.trim(),
      'Задача: ' + document.getElementById('f-what').value,
      'Адрес и объём: ' + (document.getElementById('f-note').value.trim() || 'не указано')
    ].join('\n');
    var ok = document.getElementById('form-ok');
    ok.classList.add('is-on');
    ok.innerHTML = 'Заявка собрана. Открываю WhatsApp — останется нажать «Отправить».';
    window.open(WA_BASE + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    form.reset();
  });
}
