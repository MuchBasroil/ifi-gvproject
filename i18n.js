(function () {
  var KEY = 'ifi-lang';
  var saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
  var lang = saved || ((navigator.language || 'id').toLowerCase().indexOf('id') === 0 ? 'id' : 'en');
  window.IFI_LANG = lang;
  window.ifiSetLang = function (l) { try { localStorage.setItem(KEY, l); } catch (e) {} location.reload(); };
  document.documentElement.lang = lang;
  if (lang !== 'en') return;
  var D = null, norm = function (s) { return s.replace(/\s+/g, ' ').trim(); };
  var ATTR = ['placeholder', 'aria-label', 'alt', 'title'];
  function dict() {
    if (D) return D; var src = window.IFI_EN; if (!src) return null; D = {};
    for (var k in src) D[norm(k)] = src[k]; return D;
  }
  function tr(s) {
    var d = dict(); if (!d) return null; var n = norm(s); if (!n) return null;
    if (d[n] != null) return d[n];
    return null;
  }
  function doText(node) {
    var v = node.nodeValue; if (!v || !/[A-Za-z]/.test(v)) return;
    var t = tr(v); if (t != null && t !== norm(v)) { node.nodeValue = v.replace(norm(v), t); if (node.parentElement) queueFit(node.parentElement); }
  }
  function doEl(el) {
    for (var i = 0; i < ATTR.length; i++) { var a = el.getAttribute && el.getAttribute(ATTR[i]); if (a) { var t = tr(a); if (t != null) el.setAttribute(ATTR[i], t); } }
  }
  function walk(root) {
    if (!dict()) return;
    if (root.nodeType === 3) return doText(root);
    if (root.nodeType !== 1) return;
    if (/^(SCRIPT|STYLE|TEXTAREA)$/.test(root.tagName)) return;
    if (!document.body.contains(root)) return;
    doEl(root);
    var w = document.createTreeWalker(root, 5, null), n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) { var p = n.parentNode; if (p && /^(SCRIPT|STYLE)$/.test(p.tagName)) continue; doText(n); } else doEl(n); }
  }
  var fitQ = new Set(), fitT = 0;
  function queueFit(el) { fitQ.add(el); clearTimeout(fitT); fitT = setTimeout(runFit, 80); }
  function over(el) { return el.scrollWidth > el.clientWidth + 1; }
  function sticks(el) {
    if (over(el)) return true;
    var p = el.parentElement; if (!p) return false;
    var r = el.getBoundingClientRect(), pr = p.getBoundingClientRect();
    return r.right > pr.right + 1 || r.left < pr.left - 1;
  }
  function runFit() {
    var els = Array.from(fitQ); fitQ.clear();
    els.forEach(function (el) {
      if (!document.body.contains(el) || !el.clientWidth || !sticks(el)) return;
      if (el.dataset.ifiFs == null) el.dataset.ifiFs = parseFloat(getComputedStyle(el).fontSize);
      var base = +el.dataset.ifiFs, s = base;
      while (sticks(el) && s > base * 0.7) { s -= Math.max(1, base * 0.05); el.style.fontSize = s + 'px'; }
    });
  }
  window.addEventListener('resize', function () { document.querySelectorAll('[data-ifi-fs]').forEach(function (el) { el.style.fontSize = ''; queueFit(el); }); });
  var busy = false;
  var mo = new MutationObserver(function (list) {
    if (busy) return; busy = true;
    for (var i = 0; i < list.length; i++) {
      var r = list[i];
      if (r.type === 'characterData') doText(r.target);
      else if (r.type === 'attributes') doEl(r.target);
      else for (var j = 0; j < r.addedNodes.length; j++) walk(r.addedNodes[j]);
    }
    busy = false;
  });
  function load(src) { return new Promise(function (r) { var s = document.createElement('script'); s.src = src; s.onload = s.onerror = r; document.head.appendChild(s); }); }
  function start() { Promise.all([window.IFI_EN_1 ? 0 : load('i18n-en-1.js'), load('i18n-en-2.js')]).then(function () { D = null; walk(document.body); }); mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR }); }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
