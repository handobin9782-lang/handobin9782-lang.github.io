/* 데일리 킷 — 만 나이 · D-Day · 날짜 계산기 (브라우저 전용) */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var WD = ['일', '월', '화', '수', '목', '금', '토'];
  var RATS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
  var DAY = 86400000;

  function today() {
    var d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() };
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function iso(p) { return p ? p.y + '-' + pad(p.m) + '-' + pad(p.d) : ''; }

  function parse(v) {
    if (!v) return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (!m) return null;
    return { y: +m[1], m: +m[2], d: +m[3] };
  }

  function utc(p) { return Date.UTC(p.y, p.m - 1, p.d); }

  function addDays(p, n) {
    var t = new Date(utc(p) + n * DAY);
    return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
  }

  function weekday(p) { return WD[new Date(utc(p)).getUTCDay()]; }

  function diffDays(a, b) { return Math.round((utc(b) - utc(a)) / DAY); }

  function fmt(p) {
    return p.y + '년 ' + p.m + '월 ' + p.d + '일 (' + weekday(p) + ')';
  }

  function num(n) { return n.toLocaleString('ko-KR'); }

  function fullAge(birth, ref) {
    var age = ref.y - birth.y;
    if (ref.m < birth.m || (ref.m === birth.m && ref.d < birth.d)) age--;
    return age;
  }

  function nextBirthday(birth, ref) {
    var cand = { y: ref.y, m: birth.m, d: birth.d };
    // 2월 29일생은 평년에 3월 1일로 계산된다.
    if (diffDays(ref, cand) < 0) cand = { y: ref.y + 1, m: birth.m, d: birth.d };
    return cand;
  }

  function zodiac(birth) {
    var md = birth.m * 100 + birth.d;
    var signs = [
      [120, '염소자리'], [219, '물병자리'], [321, '물고기자리'], [420, '양자리'],
      [521, '황소자리'], [622, '쌍둥이자리'], [723, '게자리'], [823, '사자자리'],
      [923, '처녀자리'], [1023, '천칭자리'], [1122, '전갈자리'], [1222, '사수자리'], [1232, '염소자리']
    ];
    for (var i = 0; i < signs.length; i++) {
      if (md < signs[i][0]) return signs[i][1];
    }
    return '염소자리';
  }

  function rat(birth) {
    var i = ((birth.y - 1900) % 12 + 12) % 12;
    return RATS[i] + '띠';
  }

  function setText(id, v) { var el = $(id); if (el) el.textContent = v; }
  function setHTML(id, v) { var el = $(id); if (el) el.innerHTML = v; }

  /* ---------- 1. 만 나이 ---------- */
  function calcAge() {
    var birth = parse($('age-birth').value);
    var ref = parse($('age-ref').value) || today();
    setText('age-ref-label', '');

    if (!birth) {
      setHTML('age-main', '생년월일을 입력해 주세요<small>입력하는 즉시 계산됩니다</small>');
      ['age-year', 'age-birthday', 'age-days', 'age-slot'].forEach(function (id) { setText(id, '—'); });
      return;
    }

    var age = fullAge(birth, ref);
    var nb = nextBirthday(birth, ref);
    var left = diffDays(ref, nb);

    setHTML('age-main', '만 ' + age + '세 <small>기준일 ' + fmt(ref) + '</small>');
    setText('age-year', (ref.y - birth.y) + '세');
    if (left === 0) {
      setText('age-birthday', 'D-Day 🎉');
      setText('age-birthday-date', '오늘이 생일입니다. 축하합니다!');
    } else {
      setText('age-birthday', 'D-' + left);
      setText('age-birthday-date', fmt(nb) + '까지 ' + num(left) + '일');
    }
    setText('age-days', num(diffDays(birth, ref)) + '일');
    setText('age-slot', weekday(birth) + '요일 · ' + rat(birth) + ' · ' + zodiac(birth));
    setText('age-born', fmt(birth) + ' 출생');
  }

  /* ---------- 2. D-Day ---------- */
  function calcDday() {
    var base = parse($('dd-base').value) || today();
    var target = parse($('dd-target').value);
    var label = $('dd-label').value.trim();

    if (!target) {
      setHTML('dd-main', '목표일을 골라 주세요<small>기념일·마감일까지 남은 날을 셉니다</small>');
      setText('dd-days', '—'); setText('dd-weeks', '—'); setText('dd-weekday', '—');
      return;
    }

    var n = diffDays(base, target);
    var head = label ? label + ' · ' : '';
    if (n === 0) setHTML('dd-main', head + 'D-Day <small>바로 오늘입니다</small>');
    else if (n > 0) setHTML('dd-main', head + 'D-' + num(n) + ' <small>' + fmt(target) + '까지 ' + num(n) + '일 남음</small>');
    else setHTML('dd-main', head + 'D+' + num(-n) + ' <small>' + fmt(target) + '에서 ' + num(-n) + '일 지남</small>');

    setText('dd-days', num(Math.abs(n)) + '일');
    var w = Math.floor(Math.abs(n) / 7), r = Math.abs(n) % 7;
    setText('dd-weeks', w + '주' + (r ? ' ' + r + '일' : ''));
    setText('dd-weekday', weekday(target) + '요일');
  }

  /* ---------- 3. 날짜 더하기 ---------- */
  function calcOffset() {
    var base = parse($('off-base').value) || today();
    var n = parseInt($('off-days').value, 10);
    if (isNaN(n)) {
      setHTML('off-main', '일수를 입력해 주세요<small>100일, 1000일처럼 더하거나 뺍니다</small>');
      setText('off-weekday', '—'); setText('off-today', '—');
      return;
    }
    var res = addDays(base, n);
    setHTML('off-main', fmt(res) + '<small>' + (n >= 0 ? base.y + '년 ' + base.m + '월 ' + base.d + '일에서 ' + num(n) + '일 뒤' : base.y + '년 ' + base.m + '월 ' + base.d + '일에서 ' + num(-n) + '일 전') + '</small>');
    setText('off-weekday', weekday(res) + '요일');
    var fromToday = diffDays(today(), res);
    setText('off-today', fromToday === 0 ? '오늘' : (fromToday > 0 ? '오늘부터 D-' + num(fromToday) : '오늘부터 D+' + num(-fromToday)));
  }

  /* ---------- 4. 두 날짜 사이 ---------- */
  function calcBetween() {
    var a = parse($('bt-start').value);
    var b = parse($('bt-end').value);
    if (!a || !b) {
      setHTML('bt-main', '두 날짜를 골라 주세요<small>시작일과 종료일 사이의 일수</small>');
      setText('bt-diff', '—'); setText('bt-week', '—'); setText('bt-incl', '—');
      return;
    }
    var n = diffDays(a, b);
    if (n < 0) {
      setHTML('bt-main', '종료일이 시작일보다 빠릅니다<small>두 날짜를 바꿔 보세요</small>');
      setText('bt-diff', num(n) + '일'); setText('bt-week', '—'); setText('bt-incl', '—');
      return;
    }
    setHTML('bt-main', num(n) + '일 <small>' + fmt(a) + ' → ' + fmt(b) + '</small>');
    setText('bt-diff', num(n) + '일');
    setText('bt-week', Math.floor(n / 7) + '주' + (n % 7 ? ' ' + (n % 7) + '일' : ''));
    setText('bt-incl', num(n + 1) + '일');
  }

  /* 초기화 */
  function init() {
    var t = iso(today());
    $('age-ref').value = t;
    $('dd-base').value = t;
    $('off-base').value = t;
    $('bt-end').value = t;

    ['age-birth', 'age-ref'].forEach(function (id) { $(id).addEventListener('input', calcAge); $(id).addEventListener('change', calcAge); });
    ['dd-base', 'dd-target', 'dd-label'].forEach(function (id) { $(id).addEventListener('input', calcDday); $(id).addEventListener('change', calcDday); });
    ['off-base', 'off-days'].forEach(function (id) { $(id).addEventListener('input', calcOffset); $(id).addEventListener('change', calcOffset); });
    ['bt-start', 'bt-end'].forEach(function (id) { $(id).addEventListener('input', calcBetween); $(id).addEventListener('change', calcBetween); });

    Array.prototype.forEach.call(document.querySelectorAll('[data-offset]'), function (btn) {
      btn.addEventListener('click', function () {
        if (!$('off-base').value) $('off-base').value = iso(today());
        $('off-days').value = btn.getAttribute('data-offset');
        calcOffset();
      });
    });

    var t2 = $('off-today-btn');
    if (t2) t2.addEventListener('click', function () { $('off-base').value = iso(today()); calcOffset(); });

    calcAge(); calcDday(); calcOffset(); calcBetween();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
