/* 데일리 킷 — 단위 · 평수 변환기 (브라우저 전용) */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  function fmt(v) {
    if (!isFinite(v)) return '';
    if (v === 0) return '0';
    var a = Math.abs(v);
    if (a >= 1e12 || a < 1e-6) return v.toExponential(4);
    var s = Number(v.toPrecision(8));
    return String(s);
  }

  function parseNum(s) {
    if (typeof s !== 'string') return NaN;
    s = s.replace(/[,\s]/g, '').replace(/[^\d.eE+\-]/g, '');
    if (!s) return NaN;
    var n = Number(s);
    return isFinite(n) ? n : NaN;
  }

  /* 선형 단위 그룹: factor = 기준 단위로 바꾸는 배수 */
  var GROUPS = {
    area: [
      { id: 'area-m2', f: 1 },
      { id: 'area-pyeong', f: 3.3057851239669422 },
      { id: 'area-ft2', f: 0.09290304 }
    ],
    length: [
      { id: 'len-mm', f: 0.001 },
      { id: 'len-cm', f: 0.01 },
      { id: 'len-m', f: 1 },
      { id: 'len-km', f: 1000 },
      { id: 'len-in', f: 0.0254 },
      { id: 'len-ft', f: 0.3048 },
      { id: 'len-yd', f: 0.9144 },
      { id: 'len-mile', f: 1609.344 }
    ],
    weight: [
      { id: 'wt-mg', f: 0.000001 },
      { id: 'wt-g', f: 0.001 },
      { id: 'wt-kg', f: 1 },
      { id: 'wt-t', f: 1000 },
      { id: 'wt-oz', f: 0.028349523125 },
      { id: 'wt-lb', f: 0.45359237 }
    ]
  };

  function bind(units) {
    units.forEach(function (u) {
      var el = $(u.id);
      if (!el) return;
      el.addEventListener('input', function () {
        var v = parseNum(el.value);
        if (!el.value.trim()) {
          units.forEach(function (o) { if (o.id !== u.id) $(o.id).value = ''; });
          return;
        }
        if (isNaN(v)) return;
        var base = v * u.f;
        units.forEach(function (o) {
          if (o.id === u.id) return;
          $(o.id).value = fmt(base / o.f);
        });
      });
    });
  }

  /* 온도 */
  function toC(v, unit) {
    if (unit === 'c') return v;
    if (unit === 'f') return (v - 32) * 5 / 9;
    return v - 273.15;
  }
  function fromC(c, unit) {
    if (unit === 'c') return c;
    if (unit === 'f') return c * 9 / 5 + 32;
    return c + 273.15;
  }

  function bindTemp() {
    var map = { 'temp-c': 'c', 'temp-f': 'f', 'temp-k': 'k' };
    Object.keys(map).forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener('input', function () {
        if (!el.value.trim()) {
          Object.keys(map).forEach(function (o) { if (o !== id) $(o).value = ''; });
          return;
        }
        var v = parseNum(el.value);
        if (isNaN(v)) return;
        var c = toC(v, map[id]);
        Object.keys(map).forEach(function (o) {
          if (o === id) return;
          $(o).value = fmt(fromC(c, map[o]));
        });
      });
    });
  }

  /* 초기 예시: 84㎡ = 25.41평 */
  function init() {
    bind(GROUPS.area);
    bind(GROUPS.length);
    bind(GROUPS.weight);
    bindTemp();

    var m2 = $('area-m2');
    if (m2 && !m2.value) {
      m2.value = '84';
      m2.dispatchEvent(new Event('input'));
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
