/* ══════════════════════════════════════════════════════════
   觀相 · 四柱 · 姓名 — app (UI)
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.__errs = [];
  window.addEventListener('error', function (e) { window.__errs.push(String(e.message)); });

  var DST = window.Destiny, DATA = window.DESTINY_DATA;
  var E = DATA.ELEM, EO = DATA.ELEM_ORDER;
  var $ = function (id) { return document.getElementById(id); };
  var S = {
    me: null, partner: null, from: null, mode: 'self',
    relType: '친구', photo: null, photoNote: '', relation: null, cardUrl: null
  };
  var SOUND_KEY = 'gs_sound_v1';

  /* ── 사운드(잔잔한 로파이 패드) ─────────────────── */
  var Sound = (function () {
    var ctx = null, master = null, arpBus = null;
    var arpTimer = null, padTimer = null, padOscs = [], chordIdx = 0, step = 0;
    var enabled = true, started = false;
    /* 동양풍 5음계(D 단조 펜타토닉 계열) — 낮고 느리게 */
    var CHORDS = [
      [146.83, 174.61, 220.00, 261.63],
      [130.81, 164.81, 196.00, 246.94],
      [110.00, 146.83, 174.61, 220.00],
      [123.47, 146.83, 185.00, 220.00]
    ];
    var ARP = [
      [440.00, 523.25, 659.25, 523.25, 440.00, 392.00],
      [392.00, 440.00, 523.25, 659.25, 523.25, 440.00],
      [329.63, 440.00, 523.25, 440.00, 329.63, 293.66],
      [369.99, 440.00, 554.37, 440.00, 369.99, 329.63]
    ];
    try { if (localStorage.getItem(SOUND_KEY) === '0') enabled = false; } catch (e) {}
    function supported() { return !!(window.AudioContext || window.webkitAudioContext); }
    function ensure() {
      if (!supported()) return null;
      if (!ctx) {
        try {
          var AC = window.AudioContext || window.webkitAudioContext;
          ctx = new AC();
          master = ctx.createGain();
          master.gain.value = 0.0001;
          master.connect(ctx.destination);
        } catch (e) { ctx = null; return null; }
      }
      if (ctx.state === 'suspended' && ctx.resume) { try { ctx.resume(); } catch (e) {} }
      return ctx;
    }
    function tone(freq, dur, type, vol, delay, slideTo) {
      if (!ctx || !master) return;
      try {
        var t0 = ctx.currentTime + (delay || 0);
        var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 1600;
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, t0);
        if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.06, dur * 0.35));
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g); g.connect(lp); lp.connect(master);
        o.start(t0); o.stop(t0 + dur + 0.05);
      } catch (e) {}
    }
    function epNote(freq, vol, dur, delay) {
      if (!ctx || !master) return;
      try {
        var t0 = ctx.currentTime + (delay || 0);
        var car = ctx.createOscillator(), mod = ctx.createOscillator();
        var modGain = ctx.createGain(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 2000; lp.Q.value = 0.4;
        car.type = 'sine'; car.frequency.setValueAtTime(freq, t0);
        mod.type = 'sine'; mod.frequency.setValueAtTime(freq * 2, t0);
        modGain.gain.setValueAtTime(freq * 0.5, t0);
        modGain.gain.exponentialRampToValueAtTime(freq * 0.03, t0 + dur * 0.6);
        mod.connect(modGain); modGain.connect(car.frequency);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol, t0 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        car.connect(g); g.connect(lp); lp.connect(arpBus || master);
        car.start(t0); mod.start(t0);
        car.stop(t0 + dur + 0.08); mod.stop(t0 + dur + 0.08);
      } catch (e) {}
    }
    function arpStep() {
      if (!ctx) return;
      var notes = ARP[chordIdx % ARP.length];
      epNote(notes[step % notes.length], 0.024, 2.8, 0);
      step++;
    }
    function startPad() {
      if (!ctx) return;
      try {
        var padGain = ctx.createGain(); padGain.gain.value = 0.02;
        var padLp = ctx.createBiquadFilter(); padLp.type = 'lowpass'; padLp.frequency.value = 560; padLp.Q.value = 0.6;
        padLp.connect(padGain); padGain.connect(master);
        arpBus = ctx.createBiquadFilter(); arpBus.type = 'lowpass'; arpBus.frequency.value = 1900; arpBus.Q.value = 0.5;
        arpBus.connect(master);
        CHORDS[0].forEach(function (f, i) {
          var o = ctx.createOscillator(), g2 = ctx.createGain();
          o.type = i === 0 ? 'sine' : 'triangle';
          o.frequency.value = f;
          g2.gain.value = i === 0 ? 1 : 0.45;
          o.connect(g2); g2.connect(padLp); o.start(); padOscs.push(o);
        });
        padTimer = setInterval(function () {
          if (!ctx) return;
          chordIdx = (chordIdx + 1) % CHORDS.length;
          var ch = CHORDS[chordIdx];
          padOscs.forEach(function (o, i) { try { o.frequency.setTargetAtTime(ch[i], ctx.currentTime, 1.6); } catch (e) {} });
        }, 11000);
        arpTimer = setInterval(arpStep, 1350);
        arpStep();
      } catch (e) {}
    }
    function start() {
      if (!ensure()) return;
      if (started) { try { master.gain.setTargetAtTime(0.48, ctx.currentTime, 0.4); } catch (e) {} return; }
      started = true;
      try { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0.48, ctx.currentTime, 1.2); } catch (e) {}
      startPad();
    }
    function stop() {
      if (arpTimer) { clearInterval(arpTimer); arpTimer = null; }
      if (padTimer) { clearInterval(padTimer); padTimer = null; }
      padOscs.forEach(function (o) { try { o.stop(); } catch (e) {} });
      padOscs = [];
      if (ctx && master) { try { master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.5); } catch (e) {} }
      started = false;
    }
    return {
      isOn: function () { return enabled; },
      setEnabled: function (v) {
        enabled = !!v;
        try { localStorage.setItem(SOUND_KEY, enabled ? '1' : '0'); } catch (e) {}
        if (enabled) start(); else stop();
        return enabled;
      },
      unlock: function () { if (enabled) start(); },
      click: function () {
        if (!enabled || !ctx) return;
        tone(520, 0.16, 'sine', 0.024, 0, 620);
      },
      reveal: function () {
        if (!enabled || !ctx) return;
        [392.00, 523.25, 587.33, 783.99].forEach(function (f, i) { epNote(f, 0.04, 2.2, i * 0.18); });
        epNote(196.00, 0.03, 3.4, 0.2);
      }
    };
  })();
  function paintSound() {
    var on = Sound.isOn();
    $('soundIcon').textContent = on ? '🔊' : '🔇';
    $('btnSound').setAttribute('aria-pressed', on ? 'true' : 'false');
    var t = $('btnSound').querySelector('.sound-txt');
    if (t) t.textContent = on ? '배경음' : '꺼짐';
  }

  /* ── 공통 ─────────────────────────────────────── */
  var toastTimer;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 2600);
  }
  function show(id) {
    ['screen-intro', 'screen-form', 'screen-scan', 'screen-result'].forEach(function (k) {
      var el = $(k); if (el) el.classList.toggle('is-on', k === id);
    });
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function attr(s) { return esc(s).replace(/`/g, '&#96;'); }
  function dateText(b) {
    var p = b.split('-');
    return p[0] + '.' + p[1] + '.' + p[2];
  }
  function lastJong(word) {
    var s = String(word).replace(/[\s,.\"'”’)\]]+$/, '');
    var code = s.charCodeAt(s.length - 1);
    if (!(code >= 0xAC00 && code <= 0xD7A3)) return -1;
    return (code - 0xAC00) % 28;
  }
  function josaKo(word, a, b) { var j = lastJong(word); return j > 0 ? a : b; }
  function roJosa(word) { var j = lastJong(word); return (j > 0 && j !== 8) ? '으로' : '로'; }
  function elemChips(counts) {
    return EO.map(function (k) {
      return '<span class="pill" style="border-color:' + E[k].color + '44"><b style="color:' + E[k].color + '">' + E[k].han + '</b> ' + counts[k] + '</span>';
    }).join('');
  }
  function lvLabel(lv) { return { strong: '강', mid: '보통', weak: '약' }[lv] || ''; }
  function wordOf(v, th, a, b, c) { return v < th[0] ? a : (v > th[1] ? c : b); }

  /* ── 부팅 ─────────────────────────────────────── */
  function boot() {
    paintSound();
    bindEvents();
    if (DST && DST.ensureHanja) DST.ensureHanja().then(parseFrom, parseFrom);
    else parseFrom();
  }

  function parseFrom() {
    var q = new URLSearchParams(location.search);
    var code = q.get('from');
    if (!code) return;
    var p = DST.decodeProfile(code);
    if (!p) { toast('링크 정보를 읽지 못했어요. 그냥 내 정보로 볼 수 있어요.'); return; }
    S.from = p;
    var b = $('inviteBanner');
    b.hidden = false;
    $('inviteTitle').textContent = p.name + ' 님의 링크로 들어오셨어요';
    $('inviteSub').textContent = p.name + ' 님(' + p.animal.name + '·' + p.saju.day.name + '일주)과의 6가지 관계를 볼 수 있습니다.';
    $('btnStart').textContent = '내 정보 넣고 답하기';
    $('formStep').textContent = '第一 · 내 정보 (초대 응답)';
    $('formSub').textContent = p.name + '님에게 내 풀이를 보여주고, 두 사람의 6가지 관계를 함께 봅니다.';
  }

  /* ── 이벤트 ───────────────────────────────────── */
  function bindEvents() {
    $('btnSound').addEventListener('click', function () {
      var on = Sound.setEnabled(!Sound.isOn());
      paintSound();
      toast(on ? '배경음을 켰습니다' : '배경음을 껐습니다');
    });
    $('btnStart').addEventListener('click', function () {
      Sound.unlock(); Sound.click();
      enterForm('self');
    });
    $('btnHowto').addEventListener('click', function () {
      var el = $('howto');
      el.hidden = !el.hidden;
      if (!el.hidden) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    $('btnPhoto').addEventListener('click', function () { $('fPhoto').click(); });
    $('btnCamera').addEventListener('click', function () { $('fCamera').click(); });
    $('fPhoto').addEventListener('change', function (e) { onPickPhoto(e.target.files[0]); });
    $('fCamera').addEventListener('change', function (e) { onPickPhoto(e.target.files[0]); });
    $('btnPhotoDel').addEventListener('click', function () { clearPhoto(); });

    $('relChips').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      Array.prototype.forEach.call($('relChips').children, function (c) { c.classList.toggle('is-on', c === b); });
      S.relType = b.dataset.rel;
      Sound.click();
    });

    $('destinyForm').addEventListener('submit', function (e) {
      e.preventDefault();
      submitForm();
    });

    $('btnSheetSave').addEventListener('click', function () {
      if (S.cardUrl) {
        var a = document.createElement('a');
        a.href = S.cardUrl;
        a.download = (S.lastCardName || 'gwansang-card') + '.png';
        document.body.appendChild(a); a.click(); a.remove();
        toast('이미지를 저장했어요');
      }
    });
    $('sheet').addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) $('sheet').hidden = true;
    });

    /* ── 한자 고르기 ── */
    $('btnHanjaPick').addEventListener('click', function () { hjOpen(); });
    $('hanjaSheet').addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-hj-close')) hjClose();
    });
    $('hjSlots').addEventListener('click', function (e) {
      var b = e.target.closest('.hj-slot'); if (!b) return;
      HJ.slot = Number(b.getAttribute('data-slot')) || 0;
      $('hjSearch').value = '';
      hjPaintSlots(); hjPaintGrid(); hjPaintCount();
      Sound.click();
    });
    $('hjGrid').addEventListener('click', function (e) {
      var b = e.target.closest('.hj-cell'); if (!b) return;
      HJ.picks[HJ.slot] = b.getAttribute('data-hj');
      var next = HJ.picks.indexOf('');
      if (next >= 0) HJ.slot = next;
      $('hjSearch').value = '';
      hjPaintSlots(); hjPaintGrid(); hjPaintCount();
      Sound.click();
    });
    $('hjSearch').addEventListener('input', function () { hjPaintGrid(); hjPaintCount(); });
    $('hjClear').addEventListener('click', function () {
      HJ.picks = HJ.picks.map(function () { return ''; });
      HJ.slot = 0; $('hjSearch').value = '';
      hjPaintSlots(); hjPaintGrid(); hjPaintCount();
      Sound.click();
    });
    $('hjApply').addEventListener('click', function () { hjApply(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('hanjaSheet').hidden) hjClose();
    });
  }

  /* ── 한자 고르기 (핸드폰에서 한자를 칠 수 없는 문제 해결) ── */
  var HJ = { data: null, promise: null, failed: false, slot: 0, picks: [], name: '' };

  function hjSyllables() {
    return String($('fName').value || '').replace(/\s+/g, '').split('').filter(function (c) { return /[가-힣]/.test(c); });
  }
  function hjLoad() {
    if (HJ.data) return Promise.resolve(HJ.data);
    if (!HJ.promise) {
      HJ.promise = fetch('assets/hanja-names.json?v=20261120a').then(function (r) { return r.json(); }).then(function (j) {
        HJ.data = j; return j;
      }).catch(function () { HJ.failed = true; return null; });
    }
    return HJ.promise;
  }
  function hjChar(item) { var i = item.indexOf('|'); return i < 0 ? item : item.slice(0, i); }
  function hjMeaning(item) { var i = item.indexOf('|'); return i < 0 ? '' : item.slice(i + 1); }
  function hjOpen() {
    var syls = hjSyllables();
    if (!syls.length) { toast('이름을 먼저 넣어주세요'); $('fName').focus(); return; }
    HJ.name = syls.join('');
    var set = ($('fHanja').value || '').match(/[\u4E00-\u9FFF\u3400-\u4DBF]/g) || [];
    HJ.picks = syls.map(function (_, i) { return set[i] || ''; });
    HJ.slot = Math.max(0, HJ.picks.indexOf(''));
    $('hjSearch').value = '';
    $('hanjaSheet').hidden = false;
    document.body.style.overflow = 'hidden';
    hjPaintSlots(); hjPaintGrid(); hjPaintCount();
    hjLoad().then(function () { hjPaintGrid(); hjPaintCount(); });
    Sound.click();
  }
  function hjClose() {
    $('hanjaSheet').hidden = true;
    document.body.style.overflow = '';
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }
  function hjPaintSlots() {
    var syls = HJ.name.split('');
    $('hjSlots').innerHTML = syls.map(function (s, i) {
      var p = HJ.picks[i] || '';
      return '<button type="button" class="hj-slot' + (i === HJ.slot ? ' is-on' : '') + (p ? ' is-set' : '') + '" data-slot="' + i + '">' +
        '<i>' + esc(s) + '</i><b>' + (p ? esc(p) : '?') + '</b></button>';
    }).join('');
  }
  function hjCandidates() {
    var data = HJ.data || {};
    var q = ($('hjSearch').value || '').replace(/\s+/g, '');
    if (!q) {
      var read = HJ.name.charAt(HJ.slot);
      return { label: read + ' 음 한자', items: data[read] || [] };
    }
    if (/^[가-힣]{1,2}$/.test(q) && data[q]) return { label: q + ' 음 한자', items: data[q] };
    var out = [];
    Object.keys(data).forEach(function (read) {
      data[read].forEach(function (it) {
        if (out.length >= 160) return;
        if (hjMeaning(it).indexOf(q) >= 0 || hjChar(it).indexOf(q) >= 0) out.push(it);
      });
    });
    return { label: '“' + q + '”로 찾은 한자', items: out };
  }
  function hjPaintGrid() {
    var box = $('hjGrid');
    if (HJ.failed) { box.innerHTML = '<p class="hj-empty">한자 목록을 불러오지 못했어요. 한글만으로도 풀이됩니다.</p>'; return; }
    if (!HJ.data) { box.innerHTML = '<p class="hj-empty">한자 목록을 불러오는 중…</p>'; return; }
    var c = hjCandidates();
    if (!c.items.length) {
      box.innerHTML = '<p class="hj-empty">해당하는 한자가 없어요. ' + (($('hjSearch').value || '') ? '다른 말로 찾아보세요.' : '한자를 직접 넣거나 한글만으로 풀이하세요.') + '</p>';
      return;
    }
    box.innerHTML = c.items.map(function (it) {
      var ch = hjChar(it), m = hjMeaning(it);
      return '<button type="button" class="hj-cell' + (HJ.picks[HJ.slot] === ch ? ' is-on' : '') + '" data-hj="' + attr(ch) + '">' +
        '<b>' + esc(ch) + '</b><span>' + esc(m || ' ' ) + '</span></button>';
    }).join('');
  }
  function hjPaintCount() {
    var n = HJ.picks.filter(Boolean).length;
    var tail = ' · 고른 글자 ' + n + '/' + HJ.picks.length;
    if (HJ.failed) { $('hjCount').textContent = '한자 목록을 불러오지 못했어요' + tail; return; }
    if (!HJ.data) { $('hjCount').textContent = '한자 목록 불러오는 중…' + tail; return; }
    var c = hjCandidates();
    $('hjCount').textContent = c.label + ' · ' + c.items.length + '자' + tail;
  }
  function hjApply() {
    if (HJ.picks.filter(Boolean).length !== HJ.picks.length) {
      toast('이름 ' + HJ.picks.length + '글자 모두 한자를 골라주세요');
      return;
    }
    $('fHanja').value = HJ.picks.join('');
    hjClose();
    toast('한자를 넣었어요 · 풀이 시작을 누르면 원획으로 계산합니다');
    Sound.click();
  }

  /* ── 인트로 → 입력 ────────────────────────────── */
  function enterForm(mode) {
    S.mode = mode;
    var relField = $('relField');
    if (mode === 'partner') {
      $('formStep').textContent = '第二 · 상대방 정보';
      $('formTitle').textContent = '상대방 정보를 적어주세요';
      $('formSub').textContent = (S.me ? S.me.name : '나') + ' 님과의 6가지 관계를 보려면 상대방 정보가 필요합니다.';
      relField.hidden = false;
      $('btnAnalyze').textContent = '6가지 관계 보기';
    } else {
      $('formStep').textContent = S.from ? '第一 · 내 정보 (초대 응답)' : '第一 · 내 정보';
      $('formTitle').textContent = '내 정보를 적어주세요';
      $('formSub').textContent = S.from
        ? S.from.name + ' 님에게 내 풀이를 보여주고, 두 사람의 6가지 관계를 함께 봅니다.'
        : '사진은 선택입니다. 이름과 생년월일만으로도 풀이가 나옵니다.';
      relField.hidden = !S.from;
      $('btnAnalyze').textContent = '풀이 시작';
    }
    clearPhoto();
    if (mode === 'partner') {
      $('fName').value = ''; $('fHanja').value = ''; $('fBirth').value = '';
    }
    if (S.me && mode === 'self') {
      $('fName').value = S.me.name;
      $('fHanja').value = S.me.hanja || '';
      $('fBirth').value = S.me.birth;
    }
    $('formErr').hidden = true;
    show('screen-form');
  }

  /* ── 사진 ─────────────────────────────────────── */
  function onPickPhoto(file) {
    if (!file) return;
    if (!/^image\//.test(file.type)) { toast('이미지 파일만 올릴 수 있어요'); return; }
    if (file.size > 12 * 1024 * 1024) { toast('12MB 이하 사진을 써주세요'); return; }
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        S.photo = { img: img, dataUrl: reader.result };
        $('photoImg').src = reader.result;
        $('photoPrev').hidden = false;
        toast('사진을 올렸어요 · 기기 안에서만 분석합니다');
      };
      img.onerror = function () { toast('사진을 읽지 못했어요'); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  function clearPhoto() {
    S.photo = null;
    $('photoPrev').hidden = true;
    $('photoImg').removeAttribute('src');
    $('fPhoto').value = '';
    $('fCamera').value = '';
  }

  /* ── 제출 ─────────────────────────────────────── */
  function submitForm() {
    var name = ($('fName').value || '').replace(/\s+/g, '');
    var hanjaRaw = ($('fHanja').value || '').replace(/\s+/g, '');
    var birth = $('fBirth').value;
    var err = $('formErr');
    if (!name) return fail('이름을 넣어주세요.');
    if (!/^[가-힣]{1,6}$/.test(name)) return fail('한글 이름만 넣어주세요. (예: 정주용)');
    if (!birth) return fail('생년월일을 골라주세요.');
    var y = Number(birth.slice(0, 4));
    if (y < 1930 || y > 2030) return fail('1930~2030년 사이로 넣어주세요.');

    /* 한자 칸은 막지 않습니다 — 한글이 섞여 있어도 그대로 진행하고 소리 획수로 풀이합니다 */
    var hanjaChars = hanjaRaw.match(/[\u4E00-\u9FFF\u3400-\u4DBF]/g) || [];
    var hanja = hanjaChars.slice(0, 6).join('');
    if (hanjaRaw && !hanja) {
      $('fHanja').value = '';
      toast('한자 대신 한글 소리 획수로 풀이합니다');
    } else if (hanja && hanja.length !== name.length) {
      toast('한자 ' + hanja.length + '자·이름 ' + name.length + '자가 달라 소리 획수로 봅니다');
    }
    err.hidden = true;

    var payload = { name: name, hanja: hanja, birth: birth, photo: S.photo };
    var mode = S.mode;

    show('screen-scan');
    Sound.unlock();
    runScan(!!S.photo).then(function () {
      return DST.ensureHanja().then(function () { return analyze(payload); });
    }).then(function (p) {
      if (!p) return;
      if (mode === 'partner') {
        S.partner = p;
        S.relation = DST.relation(S.me, p, S.relType);
        renderResult(p, { role: 'partner' });
        renderRelations(S.relation, S.me, p, { focus: true });
        show('screen-result');
        Sound.reveal();
        setTimeout(function () {
          var el = document.querySelector('.rel-head');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 700);
      } else {
        S.me = p;
        renderResult(p, { role: 'me' });
        $('relationsRoot').innerHTML = '';
        if (S.from) {
          S.relation = DST.relation(p, S.from, S.relType);
          renderRelations(S.relation, p, S.from, { focus: true });
        }
        show('screen-result');
        Sound.reveal();
        if (S.from) {
          setTimeout(function () {
            var el = document.querySelector('.rel-head');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 900);
        }
      }
      window.scrollTo(0, 0);
    }).catch(function (e) {
      window.__errs.push(String(e && e.message));
      show('screen-form');
      fail('풀이 중 문제가 생겼어요. 사진을 빼고 다시 시도해 주세요.');
    });
  }
  function fail(msg) {
    var err = $('formErr');
    err.textContent = msg;
    err.hidden = false;
    err.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function analyze(payload) {
    return new Promise(function (resolve) {
      var face = null, note = '';
      if (payload.photo) {
        try {
          face = DST.analyzeFaceImage(payload.photo.img);
          if (!face) note = '사진에서 얼굴을 확인하지 못해 사주·이름으로 풀이했습니다.';
        } catch (e) {
          window.__errs.push('face:' + e.message);
          note = '사진 분석이 어려워 사주·이름으로 풀이했습니다.';
        }
      }
      var p = DST.buildProfile({ name: payload.name, hanja: payload.hanja, birth: payload.birth, face: face });
      p.faceNote = note;
      p.photoUrl = payload.photo ? payload.photo.dataUrl : null;
      resolve(p);
    });
  }

  /* ── 스캔 애니메이션 ──────────────────────────── */
  function runScan(hasPhoto) {
    return new Promise(function (resolve) {
      var cv = $('scanCanvas'), ctx = cv.getContext('2d');
      var items = Array.prototype.slice.call($('scanSteps').children);
      var prog = $('scanProgress'), note = $('scanNote');
      var W = cv.width, H = cv.height;
      var t = 0, raf = null;
      var notes = ['얼굴의 비율을 재는 중…', '천간과 지지를 세우는 중…', '획수와 음오행을 맞추는 중…', '세 가지를 한 줄로 엮는 중…'];
      function draw() {
        t += 1;
        ctx.clearRect(0, 0, W, H);
        /* 배경 원 */
        var g2 = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W / 2);
        g2.addColorStop(0, 'rgba(217,185,111,.16)');
        g2.addColorStop(1, 'rgba(20,17,12,0)');
        ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = 'rgba(217,185,111,.35)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(W / 2, H / 2, W * 0.38, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(W / 2, H / 2, W * 0.30, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([3, 7]);
        ctx.beginPath(); ctx.arc(W / 2, H / 2, W * 0.45, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        /* 얼굴 실루엣 */
        ctx.strokeStyle = 'rgba(240,222,180,.55)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(W / 2, H * 0.5, W * 0.19, H * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
        /* 삼정 라인 */
        [0.30, 0.58].forEach(function (k, i) {
          ctx.strokeStyle = 'rgba(217,185,111,' + (0.5 + 0.2 * Math.sin(t / 12 + i)) + ')';
          ctx.beginPath(); ctx.moveTo(W * 0.29, H * k); ctx.lineTo(W * 0.71, H * k); ctx.stroke();
        });
        /* 스캔 점 */
        for (var i2 = 0; i2 < 26; i2++) {
          var a = (t / 90) + i2 * 0.24;
          var r = W * (0.30 + (i2 % 4) * 0.045);
          ctx.fillStyle = 'rgba(240,222,180,' + (0.25 + 0.6 * Math.abs(Math.sin(t / 22 + i2))) + ')';
          ctx.beginPath();
          ctx.arc(W / 2 + Math.cos(a) * r, H / 2 + Math.sin(a) * r * 0.98, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
        raf = requestAnimationFrame(draw);
      }
      draw();
      var steps = hasPhoto ? [0, 420, 460, 500] : [0, 380, 420, 460];
      var acc = 0, pct = 0;
      items.forEach(function (li, i) {
        acc += steps[i];
        (function (idx, delay) {
          setTimeout(function () {
            items.forEach(function (x, j) {
              x.classList.toggle('is-on', j === idx);
              x.classList.toggle('is-done', j < idx);
            });
            prog.style.width = Math.round((idx / items.length) * 100) + '%';
            note.textContent = notes[idx] || '';
          }, delay);
        })(i, acc);
      });
      var total = acc + 620;
      setTimeout(function () {
        items.forEach(function (x) { x.classList.remove('is-on'); x.classList.add('is-done'); });
        prog.style.width = '100%';
        note.textContent = '풀이가 나왔습니다';
      }, total - 260);
      setTimeout(function () {
        cancelAnimationFrame(raf);
        resolve();
      }, total);
    });
  }

  /* ══════════ 결과 렌더 ══════════ */
  function renderResult(p, opts) {
    opts = opts || {};
    var html = '';
    html += headBlock(p, opts);
    html += faceBlock(p);
    html += narrativeBlock(p);
    html += samjeongBlock(p);
    html += sajuBlock(p);
    html += nameBlock(p);
    html += fateBlock(p);
    html += gilBlock(p);
    html += actionsBlock(p, opts);
    $('resultBody').innerHTML = html;
    bindResult(p, opts);
    renderShop(p);
  }

  function headBlock(p, opts) {
    var roleTag = opts.role === 'partner' ? '<span class="pill red">상대방</span>' : '';
    var srcTag = p.fromLink ? '<span class="pill jade">링크로 받은 정보</span>' : (p.estimated ? '<span class="pill">사진 없이 사주 추정</span>' : '<span class="pill gold">사진 관상 반영</span>');
    return '' +
      '<div class="res-head">' +
      '<h2 class="res-name">' + esc(p.name) +
      (p.hanja ? ' <small>' + esc(p.hanja) + '</small>' : '') +
      '<small>' + dateText(p.birth) + ' (양력)</small></h2>' +
      '<div class="res-meta">' + roleTag +
      '<span class="pill gold">' + p.animal.emoji + ' ' + p.animal.name + '</span>' +
      '<span class="pill jade">' + p.saju.day.han + ' ' + p.saju.day.name + '일주</span>' +
      '<span class="pill">' + p.saju.zodiac + '</span>' +
      srcTag +
      '</div></div>';
  }

  function faceBlock(p) {
    if (p.face && p.photoUrl) {
      var r = p.face.rect, m = p.face.marks, sm = p.face.samjeong;
      var hud = '' +
        '<svg class="face-hud" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">' +
        '<rect x="' + (r.x * 1000) + '" y="' + (r.y * 1000) + '" width="' + (r.w * 1000) + '" height="' + (r.h * 1000) + '" fill="none" stroke="rgba(240,222,180,.85)" stroke-width="1.6" vector-effect="non-scaling-stroke"/>' +
        '<line x1="' + (r.x * 1000) + '" y1="' + ((r.y + r.h * m.brow) * 1000) + '" x2="' + ((r.x + r.w) * 1000) + '" y2="' + ((r.y + r.h * m.brow) * 1000) + '" stroke="rgba(240,222,180,.65)" stroke-width="1" stroke-dasharray="6 6" vector-effect="non-scaling-stroke"/>' +
        '<line x1="' + (r.x * 1000) + '" y1="' + ((r.y + r.h * m.nose) * 1000) + '" x2="' + ((r.x + r.w) * 1000) + '" y2="' + ((r.y + r.h * m.nose) * 1000) + '" stroke="rgba(240,222,180,.65)" stroke-width="1" stroke-dasharray="6 6" vector-effect="non-scaling-stroke"/>' +
        '<line x1="' + ((r.x + r.w / 2) * 1000) + '" y1="' + (r.y * 1000) + '" x2="' + ((r.x + r.w / 2) * 1000) + '" y2="' + ((r.y + r.h) * 1000) + '" stroke="rgba(240,222,180,.4)" stroke-width="1" vector-effect="non-scaling-stroke"/>' +
        '<circle cx="' + ((r.x + r.w / 2) * 1000) + '" cy="' + ((r.y + r.h * m.eye) * 1000) + '" r="3" fill="rgba(240,222,180,.9)"/>' +
        '<circle cx="' + ((r.x + r.w / 2) * 1000) + '" cy="' + ((r.y + r.h * m.mouth) * 1000) + '" r="3" fill="rgba(240,222,180,.9)"/>' +
        '</svg>' +
        '<span class="hud-tag" style="left:' + (r.x * 100 + 1.5) + '%;top:' + (r.y * 100 + 1.5) + '%">상정 ' + sm.sang + '%</span>' +
        '<span class="hud-tag" style="left:' + (r.x * 100 + 1.5) + '%;top:' + ((r.y + r.h * m.brow) * 100 + 1) + '%">중정 ' + sm.jung + '%</span>' +
        '<span class="hud-tag" style="left:' + (r.x * 100 + 1.5) + '%;top:' + ((r.y + r.h * m.nose) * 100 + 1) + '%">하정 ' + sm.ha + '%</span>';
      return '' +
        '<div class="face-card">' +
        '<img src="' + attr(p.photoUrl) + '" alt="관상 분석에 사용한 사진">' +
        hud +
        '<div class="face-badge"><span style="font-size:20px">' + p.animal.emoji + '</span><div><b>' + p.animal.name + '</b><br><span>' + p.animal.han + ' · 대칭도 ' + p.face.metrics.symmetry + '%</span></div></div>' +
        '</div>' +
        (p.faceNote ? '<p class="note-line">' + esc(p.faceNote) + '</p>' : '');
    }
    var dom = E[p.saju.dominant];
    return '' +
      '<div class="face-card">' +
      '<div class="face-sigil">' +
      '<div class="sigil-ring"><div class="sigil-han">' + dom.han + '</div></div>' +
      '<div class="face-sigil-badge" style="position:absolute;left:12px;bottom:12px;display:flex;gap:8px;align-items:center;background:rgba(20,17,12,.8);border:1px solid rgba(217,185,111,.5);border-radius:12px;padding:8px 12px;color:#fbf3de">' +
      '<span style="font-size:20px">' + p.animal.emoji + '</span><div><b style="font-family:var(--font-serif);font-size:15px">' + p.animal.name + '</b><br><span style="font-size:10.5px;color:#d9c9a4">사주 ' + dom.ko + ' 기운으로 추정</span></div></div>' +
      '<div class="sigil-note">사진을 올리면 얼굴 실측 관상으로 바뀝니다</div>' +
      '</div></div>' +
      '<button type="button" class="btn btn-ghost btn-sm btn-addphoto" style="margin-top:9px;width:100%">📷 사진 올려서 관상 정확도 높이기</button>' +
      (p.faceNote ? '<p class="note-line">' + esc(p.faceNote) + '</p>' : '');
  }

  function narrativeBlock(p) {
    return '' +
      '<div class="quote">' + p.narrative.map(function (t) { return esc(t); }).join('<br><br>') + '</div>' +
      '<div class="res-meta" style="margin-top:10px">' +
      '<span class="pill">' + p.saju.label + '</span>' +
      '<span class="pill">음 ' + p.saju.yin + ' · 양 ' + p.saju.yang + '</span>' +
      (p.nm.useHanja ? '<span class="pill gold">한자 원획 사격</span>' : '<span class="pill">소리 획수 참고</span>') +
      '</div>';
  }

  function samjeongBlock(p) {
    var sam = p.face ? p.face.samjeong : guessSamjeong(p);
    var energy = p.face ? p.face.energy : null;
    var rows = ['sang', 'jung', 'ha'].map(function (k) {
      var info = DATA.SAMJEONG[k];
      var pct = sam[k];
      var lv = energy ? (energy[k] >= 88 ? 'strong' : (energy[k] >= 70 ? 'mid' : 'weak')) : (pct >= 37 ? 'strong' : (pct >= 30 ? 'mid' : 'weak'));
      var color = k === 'sang' ? '#b0873c' : (k === 'jung' ? '#a5392a' : '#2c5b52');
      return '' +
        '<div class="tri-row">' +
        '<div class="tl2">' + info.han + '<i>' + info.part.split(' · ')[0] + '</i></div>' +
        '<div class="tri-track"><i style="width:' + pct + '%;background:' + color + '"></i></div>' +
        '<div class="tv">' + pct + '%</div>' +
        '</div>' +
        '<p class="tri-text"><b>' + info.ko + ' · ' + info.key + '</b> <span class="lv ' + lv + '">' + lvLabel(lv) + '</span><br>' + esc(info[lv]) + '</p>';
    }).join('');

    var og = p.face ? DST.ogwanOf(p.face) : null;
    var ogList = Object.keys(DATA.OGWAN).map(function (k) {
      var info = DATA.OGWAN[k];
      var lv = og ? og[k].level : 'mid';
      var detail = og ? '<span class="lv ' + lv + '">' + lvLabel(lv) + ' · ' + esc(og[k].v) + '</span>' : '';
      return '' +
        '<div class="ogwan-item">' +
        '<div class="oi-han">' + info.ko + '</div>' +
        '<div><strong>' + info.han + ' ' + info.part + ' — ' + info.key + detail + '</strong>' +
        '<p>' + esc(info[lv]) + '</p></div>' +
        '</div>';
    }).join('');

    return '' +
      '<section class="sec">' +
      '<div class="sec-h"><span class="h-han">相</span><h3>삼정·오관 관상학</h3><span class="h-sub">三停五觀</span></div>' +
      '<div class="sec-box">' +
      (p.face ? '<p class="sec-lede">얼굴을 <b>삼정(상·중·하)</b>과 <b>오관</b>으로 나눠 계측했습니다. 비율과 기운을 함께 봅니다.</p>'
        : '<p class="sec-lede">사진이 없어 <b>사주·이름으로 추정한 삼정</b>입니다. 사진을 올리면 실측값으로 바뀝니다.</p>') +
      '<div class="tri">' + rows + '</div>' +
      '<div class="ogawn-list">' + ogList + '</div>' +
      (p.face ? '<p class="note-line">측정값 — 대칭도 ' + p.face.metrics.symmetry + ' · 기색 ' + p.face.metrics.brightness + ' · 눈 ' + wordOf(p.face.metrics.eyeSpace, [0.33, 0.44], '좁은 편', '보통', '넓은 편') + ' · 입 ' + wordOf(p.face.metrics.mouthWidth, [0.26, 0.40], '작은 편', '보통', '큰 편') + ' · 턱 ' + wordOf(p.face.metrics.jawRatio, [0.70, 0.88], '갸름한 편', '보통', '넓은 편') + '</p>' : '') +
      '</div></section>';
  }

  function guessSamjeong(p) {
    /* 사진이 없을 때: 일간 오행으로 삼정 기운을 추정 */
    var k = p.saju.dayStem.elem;
    if (k === 'mok') return { sang: 37, jung: 32, ha: 31 };
    if (k === 'hwa') return { sang: 36, jung: 35, ha: 29 };
    if (k === 'to') return { sang: 30, jung: 34, ha: 36 };
    if (k === 'geum') return { sang: 32, jung: 38, ha: 30 };
    return { sang: 30, jung: 33, ha: 37 };
  }

  function sajuBlock(p) {
    var s = p.saju;
    var pls = [['년주', s.year], ['월주', s.month], ['일주', s.day]].map(function (o, i) {
      var pl = o[1];
      return '' +
        '<div class="pl' + (i === 2 ? ' is-day' : '') + '">' +
        '<div class="pl-k">' + o[0] + '</div>' +
        '<div class="pl-han">' + pl.stem.han + ' ' + pl.branch.han + '</div>' +
        '<div class="pl-ko">' + pl.name + '</div>' +
        '<div class="pl-el">' + E[pl.stem.elem].han + '·' + E[pl.branch.elem].han + '</div>' +
        '</div>';
    }).join('');

    var bars = EO.map(function (k) {
      var v = s.counts[k];
      return '<div class="el-bar"><span class="eb-han" style="color:' + E[k].color + '">' + E[k].han + '</span>' +
        '<span class="eb-track"><i style="width:' + (v / 6 * 100) + '%;background:' + E[k].color + '"></i></span>' +
        '<span class="eb-v">' + v + '개</span></div>';
    }).join('');

    var lackText = s.lack.length
      ? s.lack.map(function (k) { return E[k].han + '(' + E[k].ko + ')'; }).join('·') + ' 기운이 비어 있습니다. ' +
        E[s.lack[0]].lucky.color + ' 계열, ' + E[s.lack[0]].dir + ' 방향, ' + E[s.lack[0]].lucky.item + roJosa(E[s.lack[0]].lucky.item) + ' 채워 보세요.'
      : '다섯 기운이 모두 있습니다. ' + E[s.weakest].han + '(' + E[s.weakest].ko + ') 기운이 가장 얇으니 ' + E[s.weakest].lucky.item + josaKo(E[s.weakest].lucky.item, '을', '를') + ' 곁에 두면 좋습니다.';

    return '' +
      '<section class="sec">' +
      '<div class="sec-h"><span class="h-han">柱</span><h3>사주 삼주 (四柱)</h3><span class="h-sub">60甲子</span></div>' +
      '<div class="sec-box">' +
      '<div class="pillar-table">' + pls + '</div>' +
      '<div class="el-bars">' + bars + '</div>' +
      '<dl class="kv">' +
      '<div class="kv-row"><dt>일주</dt><dd><b>' + s.day.han + ' ' + s.day.name + '일주</b> — ' + esc(p.saju.dayStem.trait) + '</dd></div>' +
      '<div class="kv-row"><dt>띠</dt><dd>' + s.zodiac + ' (' + s.year.branch.han + ' ' + s.year.branch.animal + ')</dd></div>' +
      '<div class="kv-row"><dt>중심 기운</dt><dd>' + E[s.dominant].han + ' ' + E[s.dominant].ko + ' — ' + E[s.dominant].core + '. ' + esc(E[s.dominant].strength) + '이 강하고 ' + esc(E[s.dominant].weak) + '이 약점입니다.</dd></div>' +
      '<div class="kv-row"><dt>부족한 기운</dt><dd>' + esc(lackText) + '</dd></div>' +
      '<div class="kv-row"><dt>관상 연결</dt><dd>' + esc(p.saju.dayStem.face) + ' — 일간의 기질이 얼굴에 이렇게 드러납니다.</dd></div>' +
      '</dl>' +
      '<p class="note-line">년주는 입춘(2/4), 월주는 절입일 기준이라 경계일은 ±1일 차이가 날 수 있습니다.</p>' +
      '</div></section>';
  }

  function nameBlock(p) {
    var nm = p.nm;
    var flow = nm.syllables.map(function (sy, i) {
      var el = E[sy.elem];
      var out = '<div class="flow-item" style="border-color:' + el.color + '55"><b style="color:' + el.color + '">' + esc(sy.ch) + '</b><span>' + el.han + ' ' + el.ko + '</span></div>';
      if (i < nm.trans.length) {
        var t = nm.trans[i];
        var cls = t.rel === 'same' ? 'same' : (t.rel === 'give' || t.rel === 'take' ? 'saeng' : 'geuk');
        var mark = t.rel === 'same' ? '=' : (cls === 'saeng' ? '→' : '×');
        out += '<span class="flow-arrow ' + cls + '">' + mark + '</span>';
      }
      return out;
    }).join('');

    var sg = nm.sagyeok.map(function (s) {
      var cls = s.s.g === '길' ? 'g-good' : (s.s.g === '흉' ? 'g-bad' : 'g-half');
      return '<div class="sg ' + cls + '">' +
        '<div class="sg-k">' + s.han + '<i>' + s.ko + ' · ' + s.life + '</i></div>' +
        '<div class="sg-t">' + esc(s.s.k) + ' — ' + esc(s.s.t) + '</div>' +
        '<div class="sg-v">' + s.v + '수<b>' + s.s.g + '</b></div>' +
        '</div>';
    }).join('');

    var gil = nm.sagyeok.filter(function (s) { return s.s.g === '길'; }).length;
    var heung = nm.sagyeok.filter(function (s) { return s.s.g === '흉'; }).length;
    var verdict = '소리 흐름은 ' + nm.flow.map(function (k) { return E[k].ko; }).join(' → ') + '. ' +
      (nm.geuk ? '중간에 상극이 ' + nm.geuk + '번 끊깁니다 — 그 자리에서 말이 어긋나기 쉽습니다.' : '끊김 없이 이어져 이름을 부를수록 기운이 붙습니다.') +
      ' 사격 중 길이 ' + gil + '개, 흉이 ' + heung + '개. 총운 ' + nm.sagyeok[3].v + '수 ' + nm.sagyeok[3].s.k + '(' + nm.sagyeok[3].s.g + ')입니다.';

    var hanjaChips = '';
    if (nm.useHanja) {
      hanjaChips = '<div class="hanja-strokes">' + nm.syllables.map(function (sy, i) {
        var ch = nm.hanja[i] || '';
        var st = nm.hanjaStrokes[i] || 0;
        var mean = DATA.HANJA_MEAN[ch] || '';
        return '<div class="hs"><b>' + esc(ch) + '</b>' + st + '획' + (mean ? ' · ' + esc(mean) : '') + '</div>';
      }).join('') + '</div>';
    } else {
      hanjaChips = '<p class="note-line">한자를 넣지 않아도 괜찮습니다 — 지금은 한글 소리 획수(총 ' + nm.soundTotal + '획)로 본 참고값입니다. 한자를 알면 아래에서 골라 원획수로 다시 볼 수 있습니다.</p>' +
        (p === S.me ? '<button type="button" class="btn btn-ghost btn-sm btn-pickhanja">名 한자 골라서 다시 보기</button>' : '');
    }

    return '' +
      '<section class="sec">' +
      '<div class="sec-h"><span class="h-han">名</span><h3>이름풀이 (姓名)</h3><span class="h-sub">音五行 · 四格</span></div>' +
      '<div class="sec-box">' +
      '<div class="flow">' + flow + '</div>' +
      hanjaChips +
      '<div class="sagyeok">' + sg + '</div>' +
      '<p class="name-verdict">' + esc(verdict) + '</p>' +
      (nm.hanjaMismatch ? '<p class="note-line">한자 글자 수가 이름과 달라 소리 획수로 계산했습니다. 한자 고르기로 이름 글자 수에 맞춰 넣으면 원획수로 바뀝니다.</p>' : '') +
      (nm.hasHanjaInput && !nm.useHanja && !nm.hanjaMismatch ? '<p class="note-line">한자 일부를 획수로 확인하지 못해 소리 획수로 계산했습니다. 자전에 있는 한자로 다시 넣어주세요.</p>' : '') +
      (nm.useHanja ? '<p class="note-line">원획수 기준 — 물수변·심방변·초두머리·좌우부리 등 부수를 원래 글자 획수로 보정했습니다. 자전·유파에 따라 ±1 차이가 있을 수 있습니다.</p>' : '') +
      '</div></section>';
  }

  function fateBlock(p) {
    function card(o, label, unit) {
      var score = o.score;
      var tone = score >= 70 ? 'var(--jade)' : (score >= 50 ? '#b0873c' : 'var(--cinnabar)');
      return '<div class="fate">' +
        '<div class="f-k">' + label + '</div>' +
        '<div class="f-v" style="color:' + tone + '">' + o.pillar.name + unit + ' · ' + (score >= 70 ? '길(吉)' : (score >= 50 ? '무난' : '주의')) + '</div>' +
        '<div class="f-d">' + esc(fateText(p, o, label, unit)) + '</div>' +
        '<div class="f-bar"><i style="width:' + score + '%"></i></div>' +
        '</div>';
    }
    return '' +
      '<section class="sec">' +
      '<div class="sec-h"><span class="h-han">運</span><h3>오늘과 올해</h3><span class="h-sub">日辰 · 歲運</span></div>' +
      '<div class="fate-grid">' +
      card(p.today, '오늘 · ' + p.today.dateText, '일') +
      card(p.year, '올해 · ' + p.year.year, '년') +
      '</div></section>';
  }
  function fateText(p, o, label, unit) {
    var e = E[o.pillar.stem.elem];
    var rel = o.rel;
    var isToday = label.indexOf('오늘') === 0;
    var base = isToday
      ? '오늘은 ' + o.pillar.name + '일, ' + e.ko + '(' + e.han + ') 기운이 도는 날입니다. '
      : o.year + '년은 ' + o.pillar.name + '년, ' + e.ko + ' 기운의 해입니다. ';
    var relText = {
      give: '내 일주를 살려주는 기운이라 ' + (isToday ? '미뤄둔 일을 꺼내기 좋습니다.' : '새로 시작하는 일이 잘 풀립니다.'),
      take: '내가 그 기운을 살려주는 자리라 ' + (isToday ? '누군가를 도와주면 그게 나에게 돌아옵니다.' : '베푸는 자리에서 복이 쌓입니다.'),
      same: '같은 기운이 겹져 ' + (isToday ? '익숙한 일은 잘 되고 새로운 일은 미루는 게 좋습니다.' : '한 우물을 깊게 파는 해입니다.'),
      control: '내 기운을 누르는 날이라 ' + (isToday ? '큰 결정·계약·고백은 피하세요.' : '큰 지출과 보증을 조심하세요.'),
      controlled: '내가 그 기운을 누르는 자리라 ' + (isToday ? '말이 세게 나가기 쉽습니다. 한 번 더 듣고 말하세요.' : '사람과의 마찰이 생기기 쉬우니 말을 아끼세요.')
    }[rel];
    var linkTag = o.link && o.link.tags.length ? ' (' + o.link.tags.join('·') + ')' : '';
    return base + relText + linkTag;
  }

  function gilBlock(p) {
    function box(kind, p) {
      var items = kind === 'bad' ? p.avoid : p.keep;
      return '<div class="gil-box ' + kind + '">' +
        '<div class="gil-head"><span class="gb-icon">' + (kind === 'bad' ? '⚠️' : '🍀') + '</span>' +
        '<h4>' + (kind === 'bad' ? '피해야 할 것 (흉)' : '곁에 두어야 할 것 (길)') + '</h4>' +
        '<span class="gb-sub">' + (kind === 'bad' ? 'AVOID' : 'KEEP') + '</span></div>' +
        '<ul class="gil-list">' + items.map(function (it) {
          return '<li><b>' + esc(it.t) + '</b><span>' + esc(it.d) + '</span></li>';
        }).join('') + '</ul></div>';
    }
    return '<section class="sec">' +
      '<div class="sec-h"><span class="h-han">吉</span><h3>내게 붙는 것, 내게 붙지 않는 것</h3><span class="h-sub">吉凶</span></div>' +
      '<div class="two-col">' + box('bad', p) + box('good', p) + '</div></section>';
  }

  function actionsBlock(p, opts) {
    var isPartner = opts.role === 'partner';
    return '<div class="actions">' +
      '<button type="button" class="btn btn-primary btn-block" id="btnSaveCard">📸 9:16 스토리 카드 저장</button>' +
      (isPartner ? '' :
        '<div class="row">' +
        '<button type="button" class="btn btn-ghost" id="btnShare">🔗 내 링크 보내기</button>' +
        '<button type="button" class="btn btn-ghost" id="btnPartner">💞 상대방 입력 → 6가지 관계</button>' +
        '</div>') +
      (S.from && !isPartner ? '<p class="note-line">아래에 ' + esc(S.from.name) + ' 님과의 6가지 관계가 이어집니다.</p>' : '') +
      '<div class="share-box" id="shareBox" hidden></div>' +
      '<button type="button" class="btn btn-ghost btn-sm" id="btnRestart">처음부터 다시</button>' +
      '</div>';
  }

  function bindResult(p, opts) {
    var b1 = $('btnSaveCard');
    if (b1) b1.addEventListener('click', function () { saveCard(p); });
    var add = document.querySelector('.btn-addphoto');
    if (add) add.addEventListener('click', function () {
      enterForm('self');
      $('fName').value = p.name; $('fHanja').value = p.hanja || ''; $('fBirth').value = p.birth;
      $('formSub').textContent = '사진을 올리면 관상 삼정·오관이 실측값으로 바뀝니다.';
    });
    var pick = document.querySelector('.btn-pickhanja');
    if (pick) pick.addEventListener('click', function () {
      enterForm('self');
      $('fName').value = p.name; $('fHanja').value = p.hanja || ''; $('fBirth').value = p.birth;
      $('formSub').textContent = '한자를 고르면 원획 사격수리까지 함께 계산합니다. 몰라도 한글만으로 풀이됩니다.';
      hjOpen();
    });
    var bp = $('btnPartner');
    if (bp) bp.addEventListener('click', function () { Sound.click(); enterForm('partner'); });
    var bs = $('btnShare');
    if (bs) bs.addEventListener('click', function () { shareProfile(p); });
    var br = $('btnRestart');
    if (br) br.addEventListener('click', function () {
      S.me = null; S.partner = null; S.relation = null; S.from = null;
      $('relationsRoot').innerHTML = ''; $('shopBox').innerHTML = '';
      history.replaceState(null, '', location.pathname);
      $('inviteBanner').hidden = true;
      $('btnStart').textContent = '내 운명 보기';
      show('screen-intro');
    });
  }

  /* ── 공유 ─────────────────────────────────────── */
  function shareProfile(p) {
    var code = DST.encodeProfile(p);
    var url = location.origin + location.pathname + '?from=' + code;
    var box = $('shareBox');
    box.hidden = false;
    box.innerHTML = '<div class="share-url"><input id="shareUrl" readonly value="' + attr(url) + '"><button type="button" id="btnCopy">복사</button></div>' +
      '<p class="note-line">이 링크를 받은 사람은 ' + esc(p.name) + ' 님의 6가지 관계를 볼 수 있습니다. 링크에는 이름·생년월일·동물상·삼정 비율만 담기고 <b>사진은 담기지 않습니다</b>.</p>';
    $('btnCopy').addEventListener('click', function () { copyText(url); });
    if (navigator.share) {
      navigator.share({
        title: '관상철학관 — ' + p.name,
        text: p.name + ' 님의 관상·사주·이름풀이. 링크를 열면 나와의 6가지 관계를 볼 수 있어요.',
        url: url
      }).catch(function () {});
    } else {
      copyText(url);
    }
  }
  function copyText(txt) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { toast('링크를 복사했어요'); }).catch(function () { fallbackCopy(txt); });
    } else fallbackCopy(txt);
  }
  function fallbackCopy(txt) {
    var ta = document.createElement('textarea');
    ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast('링크를 복사했어요'); } catch (e) { toast('길게 눌러 복사해 주세요'); }
    ta.remove();
  }

  /* ══════════ 6대 관계 ══════════ */
  function renderRelations(rel, A, B, opts) {
    opts = opts || {};
    var g2 = rel.grade;
    var html = '' +
      '<div class="rel-head">' +
      '<p class="step-tag">第六 · 緣 — 六親</p>' +
      '<h2 class="rel-title">' + esc(A.name) + ' × ' + esc(B.name) + ' · 6가지 관계</h2>' +
      '<p class="rel-sub">카드를 누르면 자세한 풀이가 펼쳐집니다. ' + esc(rel.relType) + ' 포지션을 기준으로 봤습니다.</p>' +
      '<div class="rel-hero">' +
      '<div class="ring" style="--p:' + rel.score + '"><span>' + rel.score + '<i>점</i></span></div>' +
      '<div class="rh-body"><b>' + esc(rel.headline) + '</b>' +
      '<p>' + esc(relSummary(rel, A, B)) + '</p>' +
      '<div class="rh-tags">' +
      '<span class="pill gold">' + esc(g2.label) + '</span>' +
      '<span class="pill jade">' + E[rel.elRel === 'same' ? A.saju.dominant : B.saju.dominant].han + ' 기운 ' + relWordKo(rel.elRel) + '</span>' +
      (rel.link.tags.length ? '<span class="pill">' + rel.link.tags.join(' · ') + '</span>' : '') +
      '</div></div></div>' +
      '<div class="pair-line"><b>' + esc(A.name) + '</b><span class="vs">緣</span><b>' + esc(B.name) + '</b></div>' +
      '<div class="rel-grid" id="relGrid">' +
      rel.cards.map(function (c) {
        return '<button type="button" class="rel-card' + (c.negative ? ' neg' : (c.positive ? ' pos' : '')) + '" data-card="' + c.id + '">' +
          '<div class="rc-top"><span class="rc-icon">' + c.icon + '</span><span class="rc-title">' + c.title + '</span></div>' +
          '<p class="rc-sum">' + esc(c.summary) + '</p>' +
          '<div class="rc-foot"><span class="rc-badge">' + esc(c.badge) + '</span><span class="rc-more">자세히 ▾</span></div>' +
          '</button>';
      }).join('') +
      '</div>' +
      '<div class="rel-actions">' +
      '<button type="button" class="btn btn-primary btn-block" id="btnSaveRelCard">📸 6가지 관계 카드 저장</button>' +
      (A.name === (S.me && S.me.name) && !B.fromLink ?
        '<button type="button" class="btn btn-ghost" id="btnRelShare">🔗 이 조합 링크 보내기</button>' : '') +
      '<button type="button" class="btn btn-ghost btn-sm" id="btnRelRestart">다른 사람과 해보기</button>' +
      '</div>' +
      '</div>';
    $('relationsRoot').innerHTML = html;
    var grid = $('relGrid');
    var detail = document.createElement('div');
    detail.className = 'rel-detail';
    detail.hidden = true;
    var openId = null;
    grid.addEventListener('click', function (e) {
      var card = e.target.closest('.rel-card');
      if (!card) return;
      Sound.click();
      var id = card.dataset.card;
      if (openId === id) {
        detail.hidden = true; card.classList.remove('is-open'); openId = null; return;
      }
      Array.prototype.forEach.call(grid.querySelectorAll('.rel-card'), function (c) { c.classList.remove('is-open'); });
      card.classList.add('is-open');
      detail.innerHTML = detailHtml(rel.cards.filter(function (c) { return c.id === id; })[0], A, B, rel);
      detail.hidden = false;
      card.insertAdjacentElement('afterend', detail);
      openId = id;
    });
    var bsr = $('btnSaveRelCard');
    if (bsr) bsr.addEventListener('click', function () { saveRelationCard(rel, A, B); });
    var brs = $('btnRelShare');
    if (brs) brs.addEventListener('click', function () {
      var url = location.origin + location.pathname + '?from=' + DST.encodeProfile(A);
      copyText(url);
      toast('내 링크를 복사했어요 — 상대가 열면 같은 풀이가 나옵니다');
    });
    var brr = $('btnRelRestart');
    if (brr) brr.addEventListener('click', function () { enterForm('partner'); });
  }

  function relWordKo(rel) {
    return { same: '비화', give: '상생', take: '상생', control: '상극', controlled: '상극' }[rel] || '비화';
  }
  function relSummary(rel, A, B) {
    var c = rel.cards[0];
    return '성격 ' + c.score + '점 · 재물 ' + rel.cards[3].signed + ' · 최고 포지션은 ' + rel.best.key + ', 가장 조심할 포지션은 ' + rel.worst.key + '입니다.';
  }

  function detailHtml(card, A, B, rel) {
    var h = '<h4>' + card.icon + ' ' + card.title + '</h4><p class="rd-sub">' + esc(card.sub) + ' · ' + esc(card.badge) + (card.signed !== undefined ? ' (' + (card.signed > 0 ? '+' : '') + card.signed + ')' : '') + '</p>';
    if (card.blocks) {
      h += card.blocks.map(function (b) {
        return '<div class="rd-block"><h5>' + esc(b.h) + '</h5><ul>' + b.lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul></div>';
      }).join('');
    }
    if (card.positions) {
      h += '<div class="rd-block"><h5>' + esc('포지션별') + '</h5><div class="rd-pos">' + card.positions.map(function (o) {
        return '<div class="rd-pos-row"><div><div class="rp-k">' + o.icon + ' ' + esc(o.key) + '</div><div class="rp-l">' + esc(o.line) + '</div></div>' +
          '<span class="rp-v ' + o.tone + '">' + o.score + ' · ' + esc(o.grade) + '</span></div>';
      }).join('') + '</div></div>';
    }
    if (card.signed !== undefined) {
      var s = card.signed, w = Math.abs(s) / 10 * 50;
      h += '<div class="money-gauge">' +
        '<div class="mg-top"><span class="mg-num ' + (s >= 0 ? 'plus' : 'minus') + '">' + (s > 0 ? '+' : '') + s + '</span><span class="mg-lbl">같이 일할 때 재물 판정 (−10 ~ +10)</span></div>' +
        '<div class="mg-track"><i style="left:50%;width:1px;background:rgba(23,20,15,.35)"></i>' +
        (s >= 0 ? '<i class="plus" style="left:50%;width:' + w + '%"></i>' : '<i class="minus" style="right:50%;width:' + w + '%"></i>') +
        '</div><div class="mg-scale"><span>−10</span><span>0</span><span>+10</span></div></div>' +
        '<div class="money-roles">' + (card.moneyRoles || []).map(function (m) {
          return '<div class="mrol"><b>' + esc(m.who) + ' · ' + esc(m.role) + '형</b><span>' + esc(m.desc) + '</span></div>';
        }).join('') + '</div>';
    }
    if (card.reasons) {
      h += '<div class="rd-block"><h5>왜 그런가</h5><ul>' + card.reasons.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>';
    }
    if (card.items) {
      h += '<div class="rd-block"><h5>' + (card.negative ? '지뢰 목록' : '행운 목록') + '</h5><div class="rd-items">' +
        card.items.map(function (it) { return '<div class="rd-item"><b>' + esc(it.t) + '</b><span>' + esc(it.d) + '</span></div>'; }).join('') + '</div></div>';
    }
    return h;
  }

  /* ══════════ 개운템 ══════════ */
  var SHOP = [
    { el: 'su', name: '3D 암막 수면안대 (빅트리 프리미엄)', desc: '수(水) 기운 · 잠을 지키는 회복템', url: 'https://link.coupang.com/a/iL1KHZ3jC8' },
    { el: 'geum', name: '블루라이트 차단 안경 (베델루스 뿔테)', desc: '금(金) 기운 · 눈(감찰관)을 지키는', url: 'https://link.coupang.com/a/iL2Wt3Soay' },
    { el: 'geum', name: '고탄력 통기성 손목보호대 2P', desc: '금(金) 기운 · 몸의 균형', url: 'https://link.coupang.com/a/iL2YTn6Uoe' },
    { el: 'mok', name: '컬러 아크릴 미니 주사위 50개입', desc: '목(木) 기운 · 새로 시작하는 판', url: 'https://link.coupang.com/a/iL22LXSDG8' },
    { el: 'to', name: '거실 구름 실내화 슬리퍼', desc: '토(土) 기운 · 집의 중심', url: 'https://link.coupang.com/a/iL25RPizEO' },
    { el: 'geum', name: '펜텔 아인 점보 지우개 특대형 2개', desc: '금(金) 기운 · 정리하는 손', url: 'https://link.coupang.com/a/iL29DZgAmq' },
    { el: 'su', name: '굿나잇 이어플러그 프리미엄 15쌍', desc: '수(水) 기운 · 소리를 낮추는', url: 'https://link.coupang.com/a/iL3bUS7ttY' },
    { el: 'to', name: '컴퓨터용 사인펜 + 수정테이프 세트', desc: '토(土) 기운 · 기록하고 남기는', url: 'https://link.coupang.com/a/iL3efXwP6q' }
  ];
  function renderShop(p) {
    var box = $('shopBox');
    if (!box) return;
    var dom = p.saju.dominant;
    var lack = p.saju.lack[0] || p.saju.weakest;
    var pick = [];
    SHOP.forEach(function (it) { if (it.el === dom && pick.length < 2) pick.push(it); });
    SHOP.forEach(function (it) { if (it.el === lack && pick.length < 3 && pick.indexOf(it) < 0) pick.push(it); });
    if (pick.length < 3) {
      SHOP.forEach(function (it) { if (pick.indexOf(it) < 0 && pick.length < 3) pick.push(it); });
    }
    box.innerHTML = '<section class="shop">' +
      '<div class="shop-h"><h3>개운템 추천</h3><span class="h-sub">COUPANG PARTNERS</span></div>' +
      '<p class="shop-sub">' + esc(p.name) + ' 님의 ' + E[dom].han + '(' + E[dom].ko + ') 기운과 비어 있는 ' + E[lack].han + '(' + E[lack].ko + ') 기운에 맞춰 골랐습니다.</p>' +
      '<div class="shop-items">' + pick.map(function (it) {
        return '<a class="shop-item" href="' + attr(it.url) + '" target="_blank" rel="noopener sponsored">' +
          '<span class="si-el" style="color:' + E[it.el].color + '">' + E[it.el].han + '</span>' +
          '<span class="si-b"><b>' + esc(it.name) + '</b><span>' + esc(it.desc) + '</span></span>' +
          '<span class="si-go">보기 →</span></a>';
      }).join('') + '</div>' +
      (SHOP.every(function (it) { return it.el !== lack; }) ? '<p class="shop-note">' + E[lack].han + '(' + E[lack].ko + ') 기운은 ' + E[lack].lucky.color + ' 소품이나 ' + E[lack].lucky.item + '처럼 일상에서 채우는 게 좋습니다.</p>' : '') +
      '<p class="shop-note">※ 이 페이지는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 받을 수 있습니다. 개운템은 재미를 위한 제안이며 효능을 보장하지 않습니다.</p>' +
      '</section>';
  }

  /* ══════════ 9:16 카드 ══════════ */
  var CW = 1080, CH = 1920;
  var FONT_SERIF = '"Noto Serif KR","Apple SD Gothic Neo",Georgia,serif';
  var FONT_SANS = '"Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif';

  function rr(ctx, x, y, w, h, r) {
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function wrapText(ctx, text, maxW) {
    var words = String(text).split(' '), lines = [], line = '';
    for (var i = 0; i < words.length; i++) {
      var t = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = words[i]; }
      else line = t;
    }
    if (line) lines.push(line);
    return lines;
  }
  function fitFont(ctx, text, maxW, size, min, weight, family) {
    var s = size;
    while (s > min) {
      ctx.font = weight + ' ' + s + 'px ' + (family || FONT_SERIF);
      if (ctx.measureText(text).width <= maxW) break;
      s -= 2;
    }
    return s;
  }
  function drawHanjiBg(ctx) {
    ctx.fillStyle = '#f7f2e6'; ctx.fillRect(0, 0, CW, CH);
    ctx.strokeStyle = 'rgba(176,87,60,.05)'; ctx.lineWidth = 1;
    for (var x = 0; x < CW; x += 54) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
    for (var y = 0; y < CH; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }
    var g2 = ctx.createRadialGradient(CW / 2, 0, 60, CW / 2, 0, 1100);
    g2.addColorStop(0, 'rgba(255,250,236,.95)'); g2.addColorStop(1, 'rgba(247,242,230,0)');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, CW, CH);
    ctx.strokeStyle = 'rgba(176,135,60,.55)'; ctx.lineWidth = 3;
    ctx.strokeRect(46, 46, CW - 92, CH - 92);
    ctx.strokeStyle = 'rgba(176,135,60,.22)'; ctx.lineWidth = 1;
    ctx.strokeRect(58, 58, CW - 116, CH - 116);
  }
  function drawCard(p) {
    var cv = $('cardCanvas'), ctx = cv.getContext('2d');
    cv.width = CW; cv.height = CH;
    drawHanjiBg(ctx);
    var PAD = 96;

    /* 헤더 */
    ctx.fillStyle = '#a5392a'; rr(ctx, PAD, 98, 78, 78, 12); ctx.fill();
    ctx.fillStyle = '#fff2df'; ctx.textAlign = 'center';
    ctx.font = '700 44px ' + FONT_SERIF;
    ctx.fillText('觀', PAD + 39, 154);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#17140f'; ctx.font = '700 40px ' + FONT_SERIF;
    ctx.fillText('관상철학관', PAD + 98, 148);
    ctx.fillStyle = '#8a8172'; ctx.font = '600 22px ' + FONT_SANS;
    ctx.fillText('觀相 · 四柱 · 姓名', PAD + 98, 180);

    /* 이름 */
    var nmSize = fitFont(ctx, p.name, CW - PAD * 2, 92, 52, '900');
    ctx.font = '900 ' + nmSize + 'px ' + FONT_SERIF;
    ctx.fillStyle = '#17140f';
    ctx.fillText(p.name, PAD, 300);
    ctx.font = '600 27px ' + FONT_SANS; ctx.fillStyle = '#8a8172';
    ctx.fillText((p.hanja ? p.hanja + ' · ' : '') + dateText(p.birth) + ' 양력', PAD, 346);

    /* 사진 or 실 — 정사각 박스 */
    var boxW = 600, boxH = 600;
    var boxX = PAD + ((CW - PAD * 2) - boxW) / 2, boxY = 380;
    if (p.photoUrl && p.face && p._img) {
      ctx.save();
      rr(ctx, boxX, boxY, boxW, boxH, 24); ctx.clip();
      ctx.fillStyle = '#14110c'; ctx.fillRect(boxX, boxY, boxW, boxH);
      var im = p._img, fr = p.face.rect;
      var sw = im.naturalWidth * fr.w, sh = im.naturalHeight * fr.h;
      var sc = Math.max(boxW / sw, boxH / sh);
      var dw = sw * sc, dh = sh * sc;
      var dx = boxX + (boxW - dw) / 2, dy = boxY + (boxH - dh) / 2;
      ctx.drawImage(im, im.naturalWidth * fr.x, im.naturalHeight * fr.y, sw, sh, dx, dy, dw, dh);
      /* HUD */
      var mk = p.face.marks;
      ctx.strokeStyle = 'rgba(240,222,180,.75)'; ctx.lineWidth = 2;
      ctx.setLineDash([9, 9]);
      [mk.brow, mk.nose].forEach(function (k) {
        var ly = dy + dh * k;
        ctx.beginPath(); ctx.moveTo(boxX, ly); ctx.lineTo(boxX + boxW, ly); ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(217,185,111,.65)';
      ctx.strokeRect(dx + 2, dy + 2, dw - 4, dh - 4);
      ctx.restore();
      ctx.strokeStyle = 'rgba(176,135,60,.6)'; ctx.lineWidth = 2;
      rr(ctx, boxX, boxY, boxW, boxH, 24); ctx.stroke();
    } else {
      var dom0 = E[p.saju.dominant];
      ctx.save();
      rr(ctx, boxX, boxY, boxW, boxH, 24); ctx.clip();
      var gg = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
      gg.addColorStop(0, '#221d15'); gg.addColorStop(1, '#100e0a');
      ctx.fillStyle = gg; ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = 'rgba(217,185,111,.4)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(boxX + boxW / 2, boxY + boxH / 2, 190, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([6, 12]);
      ctx.beginPath(); ctx.arc(boxX + boxW / 2, boxY + boxH / 2, 232, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#d9b96f'; ctx.font = '900 180px ' + FONT_SERIF;
      ctx.fillText(dom0.han, boxX + boxW / 2, boxY + boxH / 2 + 62);
      ctx.fillStyle = 'rgba(240,222,180,.6)'; ctx.font = '600 22px ' + FONT_SANS;
      ctx.fillText('사주 ' + dom0.ko + ' 기운으로 추정한 상', boxX + boxW / 2, boxY + boxH - 52);
      ctx.textAlign = 'left';
      ctx.restore();
    }

    /* 배지 줄 */
    var y = 1020;
    var badges = [p.animal.emoji + ' ' + p.animal.name, p.saju.day.han + ' ' + p.saju.day.name + '일주', p.saju.zodiac];
    var bx = PAD;
    badges.forEach(function (t) {
      ctx.font = '700 25px ' + FONT_SANS;
      var w = ctx.measureText(t).width + 40;
      ctx.fillStyle = 'rgba(255,253,247,.95)';
      rr(ctx, bx, y - 29, w, 46, 23); ctx.fill();
      ctx.strokeStyle = 'rgba(176,135,60,.55)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = '#3b352b';
      ctx.fillText(t, bx + 20, y + 1);
      bx += w + 9;
    });

    /* 오행 */
    ctx.font = '700 23px ' + FONT_SANS; ctx.fillStyle = '#8a8172';
    ctx.fillText(EO.map(function (k) { return E[k].han + ' ' + p.saju.counts[k]; }).join('    '), PAD, 1062);

    /* 삼정 미니바 */
    var sm = p.face ? p.face.samjeong : guessSamjeong(p);
    var totalW = CW - PAD * 2, bh = 16;
    var cols = { sang: '#b0873c', jung: '#a5392a', ha: '#2c5b52' };
    var x0 = PAD;
    ['sang', 'jung', 'ha'].forEach(function (k) {
      var w = totalW * sm[k] / 100;
      ctx.fillStyle = cols[k];
      ctx.fillRect(x0, 1088, w, bh);
      x0 += w;
    });
    ctx.font = '600 20px ' + FONT_SANS; ctx.fillStyle = '#5c5346';
    ctx.fillText('상정 ' + sm.sang + '%   중정 ' + sm.jung + '%   하정 ' + sm.ha + '%', PAD, 1132);

    /* 총평 3줄 */
    var lineTxt = p.narrative && p.narrative[0] ? p.narrative[0] : '';
    ctx.font = '600 23px ' + FONT_SERIF; ctx.fillStyle = '#3b352b';
    var tlines = wrapText(ctx, lineTxt, totalW);
    var maxL = 3;
    if (tlines.length > maxL) { tlines = tlines.slice(0, maxL); tlines[maxL - 1] += ' …'; }
    var ny = 1170;
    tlines.forEach(function (ln) { ctx.fillText(ln, PAD, ny); ny += 30; });

    /* 피할 것 / 곁에 둘 것 */
    function box2(yy, title, sub, item, color, bg) {
      var H = 164;
      ctx.fillStyle = bg; rr(ctx, PAD, yy, totalW, H, 18); ctx.fill();
      ctx.strokeStyle = color + '55'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = color;
      ctx.font = '800 24px ' + FONT_SERIF;
      ctx.fillText(title, PAD + 24, yy + 40);
      ctx.font = '700 18px ' + FONT_SANS; ctx.fillStyle = 'rgba(138,129,114,.9)';
      ctx.textAlign = 'right';
      ctx.fillText(sub, PAD + totalW - 24, yy + 39);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#3b352b'; ctx.font = '700 22px ' + FONT_SERIF;
      var t1 = wrapText(ctx, item.t, totalW - 48);
      ctx.fillText(t1[0] + (t1.length > 1 ? ' …' : ''), PAD + 24, yy + 78);
      ctx.fillStyle = '#5c5346'; ctx.font = '500 20px ' + FONT_SANS;
      var t2 = wrapText(ctx, item.d, totalW - 48).slice(0, 2);
      t2.forEach(function (ln, i) { ctx.fillText(ln, PAD + 24, yy + 112 + i * 26); });
      return yy + H;
    }
    var yAfter = box2(1250, '⚠  피해야 할 것', '흉 · AVOID', p.avoid[0], '#a5392a', 'rgba(250,238,234,.92)');
    yAfter = box2(yAfter + 14, '🍀  곁에 둘 것', '길 · KEEP', p.keep[0], '#2c5b52', 'rgba(238,247,236,.92)');

    /* 오늘 */
    ctx.fillStyle = '#8a8172'; ctx.font = '700 21px ' + FONT_SANS;
    ctx.fillText('오늘 · ' + p.today.dateText + ' — ' + p.today.pillar.name + '일', PAD, yAfter + 44);
    ctx.fillStyle = '#3b352b'; ctx.font = '500 20px ' + FONT_SANS;
    var todayLine = p.today.score >= 70 ? '기운이 내 편입니다. 미뤄둔 일을 꺼내기 좋은 날.'
      : (p.today.score >= 50 ? '무난한 하루. 큰 결정보다 정리하기 좋은 날입니다.' : '내 기운을 누르는 날. 큰 계약·고백은 미루세요.');
    ctx.fillText(wrapText(ctx, todayLine, totalW)[0], PAD, yAfter + 74);

    /* 푸터 */
    ctx.fillStyle = '#17140f'; ctx.font = '700 26px ' + FONT_SANS;
    ctx.fillText('나도 관상·사주·이름풀이 보기', PAD, CH - 138);
    ctx.fillStyle = '#8a8172'; ctx.font = '500 21px ' + FONT_SANS;
    ctx.fillText('handobin9782-lang.github.io/mind-test', PAD, CH - 102);
    ctx.fillStyle = 'rgba(23,20,15,.4)'; ctx.font = '500 17px ' + FONT_SANS;
    ctx.fillText('재미로 보는 관상·사주·이름풀이 · 의료·투자 판단 근거 아님', PAD, CH - 68);
    ctx.fillStyle = '#a5392a'; ctx.fillRect(0, CH - 12, CW, 12);
  }

  function drawRelCard(rel, A, B) {
    var cv = $('cardCanvas'), ctx = cv.getContext('2d');
    cv.width = CW; cv.height = CH;
    drawHanjiBg(ctx);
    var PAD = 96;

    /* 헤더 */
    ctx.fillStyle = '#a5392a'; rr(ctx, PAD, 98, 78, 78, 12); ctx.fill();
    ctx.fillStyle = '#fff2df'; ctx.font = '700 44px ' + FONT_SERIF; ctx.textAlign = 'center';
    ctx.fillText('緣', PAD + 39, 154); ctx.textAlign = 'left';
    ctx.fillStyle = '#17140f'; ctx.font = '700 40px ' + FONT_SERIF;
    ctx.fillText('6가지 관계', PAD + 98, 148);
    ctx.fillStyle = '#8a8172'; ctx.font = '600 22px ' + FONT_SANS;
    ctx.fillText('六親 · 緣', PAD + 98, 180);

    /* 이름 */
    ctx.fillStyle = '#17140f';
    var nmS = fitFont(ctx, A.name + ' × ' + B.name, CW - PAD * 2, 76, 44, '900');
    ctx.font = '900 ' + nmS + 'px ' + FONT_SERIF;
    ctx.fillText(A.name + ' × ' + B.name, PAD, 300);
    ctx.font = '600 26px ' + FONT_SANS; ctx.fillStyle = '#5c5346';
    ctx.fillText(rel.grade.label + ' · ' + relWordKo(rel.elRel) + ' · ' + rel.relType, PAD, 344);

    /* 점수 링 + 총평 */
    var cx0 = PAD + 118, cy0 = 490, rad = 112;
    ctx.lineWidth = 18; ctx.strokeStyle = 'rgba(23,20,15,.1)';
    ctx.beginPath(); ctx.arc(cx0, cy0, rad, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#a5392a'; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(cx0, cy0, rad, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * rel.score / 100); ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#17140f'; ctx.font = '900 70px ' + FONT_SERIF;
    ctx.fillText(String(rel.score), cx0, cy0 + 20);
    ctx.font = '600 22px ' + FONT_SANS; ctx.fillStyle = '#8a8172';
    ctx.fillText('점', cx0, cy0 + 52);
    ctx.textAlign = 'left';
    var tx = cx0 + rad + 34, tw = CW - PAD - tx;
    ctx.fillStyle = '#3b352b'; ctx.font = '700 30px ' + FONT_SERIF;
    var hl = wrapText(ctx, rel.headline, tw);
    hl.slice(0, 3).forEach(function (ln, i) { ctx.fillText(ln, tx, cy0 - 44 + i * 38); });
    ctx.fillStyle = '#8a8172'; ctx.font = '500 21px ' + FONT_SANS;
    wrapText(ctx, '성격 ' + rel.cards[0].score + '점 · 재물 ' + (rel.cards[3].signed > 0 ? '+' : '') + rel.cards[3].signed + ' · 최고 포지션 ' + rel.best.key, tw)
      .slice(0, 2).forEach(function (ln, i) { ctx.fillText(ln, tx, cy0 + 46 + i * 28); });

    /* 6개 카드 */
    var top = 650, colW = (CW - PAD * 2 - 20) / 2, rowH = 300, gap = 18;
    rel.cards.forEach(function (c, i) {
      var col = i % 2, row = Math.floor(i / 2);
      var x = PAD + col * (colW + 20), yy = top + row * (rowH + gap);
      ctx.fillStyle = 'rgba(255,253,247,.96)';
      rr(ctx, x, yy, colW, rowH, 20); ctx.fill();
      ctx.strokeStyle = 'rgba(176,135,60,.45)'; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.fillStyle = '#17140f'; ctx.font = '700 29px ' + FONT_SERIF;
      var title = c.icon + ' ' + c.title;
      ctx.fillText(title, x + 24, yy + 54);
      ctx.fillStyle = '#5c5346'; ctx.font = '500 21px ' + FONT_SANS;
      wrapText(ctx, c.summary, colW - 48).slice(0, 5).forEach(function (ln, k) {
        ctx.fillText(ln, x + 24, yy + 96 + k * 29);
      });
      ctx.fillStyle = '#8a8172'; ctx.font = '700 19px ' + FONT_SANS;
      ctx.fillText(String(c.badge || '').slice(0, 20), x + 24, yy + rowH - 22);
    });

    /* 푸터 */
    ctx.fillStyle = '#17140f'; ctx.font = '700 26px ' + FONT_SANS;
    ctx.fillText('나도 6가지 관계 보기', PAD, CH - 138);
    ctx.fillStyle = '#8a8172'; ctx.font = '500 21px ' + FONT_SANS;
    ctx.fillText('handobin9782-lang.github.io/mind-test', PAD, CH - 102);
    ctx.fillStyle = 'rgba(23,20,15,.4)'; ctx.font = '500 17px ' + FONT_SANS;
    ctx.fillText('재미로 보는 궁합 · 의료·투자 판단 근거 아님', PAD, CH - 68);
    ctx.fillStyle = '#a5392a'; ctx.fillRect(0, CH - 12, CW, 12);
  }

  function loadImgEl(src) {
    return new Promise(function (res, rej) {
      var im = new Image();
      im.onload = function () { res(im); };
      im.onerror = rej;
      im.src = src;
    });
  }
  function canvasToBlob(cv) {
    return new Promise(function (res, rej) {
      if (cv.toBlob) cv.toBlob(function (b) { b ? res(b) : rej(new Error('blob')); }, 'image/png');
      else {
        try {
          var url = cv.toDataURL('image/png'), parts = url.split(','), bin = atob(parts[1]);
          var arr = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
          res(new Blob([arr], { type: 'image/png' }));
        } catch (e) { rej(e); }
      }
    });
  }
  function openSheet(blob, title, fname) {
    if (S.cardUrl) URL.revokeObjectURL(S.cardUrl);
    S.cardUrl = URL.createObjectURL(blob);
    S.lastCardName = fname;
    $('sheetTitle').textContent = title;
    $('sheetImg').innerHTML = '<img src="' + S.cardUrl + '" alt="' + attr(title) + '">';
    $('sheet').hidden = false;
  }
  function saveCard(p) {
    toast('카드를 만드는 중…');
    var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(function () {
      return p.photoUrl ? loadImgEl(p.photoUrl).catch(function () { return null; }) : Promise.resolve(null);
    }).then(function (im) {
      p._img = im;
      drawCard(p);
      return canvasToBlob($('cardCanvas'));
    }).then(function (blob) {
      openSheet(blob, p.name + ' 님의 관상·사주 카드', 'gwansang-' + p.name);
    }).catch(function (e) {
      window.__errs.push('card:' + (e && e.message));
      toast('카드를 만들지 못했어요. 다시 시도해 주세요.');
    });
  }
  function saveRelationCard(rel, A, B) {
    toast('카드를 만드는 중…');
    var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(function () {
      drawRelCard(rel, A, B);
      return canvasToBlob($('cardCanvas'));
    }).then(function (blob) {
      openSheet(blob, A.name + ' × ' + B.name + ' 6가지 관계', 'relation-' + A.name + '-' + B.name);
    }).catch(function (e) {
      window.__errs.push('relcard:' + (e && e.message));
      toast('카드를 만들지 못했어요.');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
