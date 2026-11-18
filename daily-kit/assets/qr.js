/* 데일리 킷 — QR 코드 생성기 (브라우저 전용, 전송 없음) */
(function () {
  'use strict';

  if (typeof qrcode !== 'undefined' && qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs['UTF-8']) {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  }

  var $ = function (id) { return document.getElementById(id); };
  var canvas = $('qr-canvas');
  var ctx = canvas.getContext('2d');
  var box = $('qr-box');
  var emptyBox = $('qr-empty');
  var meta = $('qr-meta');
  var warn = $('qr-warn');
  var dlBtn = $('qr-download');
  var copyBtn = $('qr-copy');

  var mode = 'text';
  var lastText = '';

  /* 탭 */
  var tabs = document.querySelectorAll('.tabs button');
  Array.prototype.forEach.call(tabs, function (btn) {
    btn.addEventListener('click', function () {
      mode = btn.getAttribute('data-mode');
      Array.prototype.forEach.call(tabs, function (b) {
        b.setAttribute('aria-selected', String(b === btn));
      });
      Array.prototype.forEach.call(document.querySelectorAll('.panel'), function (p) {
        p.hidden = p.getAttribute('data-panel') !== mode;
      });
      render();
    });
  });

  function escWifi(s) {
    return String(s).replace(/([\\;,:"])/g, '\\$1');
  }

  function payload() {
    if (mode === 'wifi') {
      var ssid = $('wifi-ssid').value;
      if (!ssid) return '';
      var sec = $('wifi-sec').value;
      var pw = $('wifi-pw').value;
      var hidden = $('wifi-hidden').checked;
      var s = 'WIFI:T:' + sec + ';S:' + escWifi(ssid) + ';';
      if (sec !== 'nopass') s += 'P:' + escWifi(pw) + ';';
      if (hidden) s += 'H:true;';
      return s + ';';
    }
    return $('qr-text').value.trim();
  }

  function hexToRgb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function lum(hex) {
    var c = hexToRgb(hex).map(function (v) {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  function contrast(a, b) {
    var l1 = lum(a), l2 = lum(b);
    var hi = Math.max(l1, l2), lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  function setError(msg) {
    canvas.style.display = 'none';
    if (box) box.hidden = true;
    emptyBox.hidden = false;
    emptyBox.textContent = msg;
    meta.textContent = '';
    dlBtn.disabled = true;
    if (copyBtn) copyBtn.disabled = true;
    lastText = '';
  }

  function render() {
    var text = payload();
    var ec = $('qr-ec').value;
    var quiet = Math.max(0, Math.min(8, parseInt($('qr-quiet').value, 10) || 0));
    var target = parseInt($('qr-size').value, 10) || 512;
    var fg = $('qr-fg').value;
    var bg = $('qr-bg').value;

    warn.hidden = true;

    if (!text) {
      setError(mode === 'wifi' ? '와이파이 이름(SSID)을 입력하면 바로 만들어집니다.' : '주소나 글자를 입력하면 아래에 QR 코드가 나타납니다.');
      return;
    }

    var qr;
    try {
      qr = qrcode(0, ec);
      qr.addData(text, 'Byte');
      qr.make();
    } catch (e) {
      setError('내용이 너무 길어 QR 코드로 만들 수 없습니다. 글자를 줄이거나 오류 정정 수준을 낮춰 보세요(현재 ' + ec + ').');
      return;
    }

    var count = qr.getModuleCount();
    var total = count + quiet * 2;
    var px = Math.max(1, Math.floor(target / total));
    var dim = px * total;

    canvas.width = dim;
    canvas.height = dim;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, dim, dim);
    ctx.fillStyle = fg;
    for (var r = 0; r < count; r++) {
      for (var c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          ctx.fillRect((c + quiet) * px, (r + quiet) * px, px, px);
        }
      }
    }

    canvas.style.display = '';
    if (box) box.hidden = false;
    emptyBox.hidden = true;
    dlBtn.disabled = false;
    if (copyBtn) copyBtn.disabled = !(canvas.toBlob && window.ClipboardItem && navigator.clipboard && navigator.clipboard.write);

    var bytes = new TextEncoder().encode(text).length;
    var version = Math.round((count - 17) / 4);
    meta.textContent = '버전 ' + version + ' · ' + count + '×' + count + ' 모듈 · ' + dim + '×' + dim + 'px · ' + bytes + '바이트 · 오류 정정 ' + ec;
    lastText = text;

    if (contrast(fg, bg) < 3.5) {
      warn.hidden = false;
      warn.textContent = '⚠️ 전경색과 배경색 대비가 낮아 스캔이 안 될 수 있습니다. 밝은 배경에 어두운 색을 쓰세요.';
    }
  }

  var timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(render, 80);
  }

  ['qr-text', 'wifi-ssid', 'wifi-pw', 'wifi-sec', 'wifi-hidden', 'qr-ec', 'qr-quiet', 'qr-size', 'qr-fg', 'qr-bg'].forEach(function (id) {
    var el = $(id);
    if (!el) return;
    el.addEventListener('input', schedule);
    el.addEventListener('change', schedule);
  });

  /* 색상 프리셋 */
  Array.prototype.forEach.call(document.querySelectorAll('.presets button'), function (b) {
    b.addEventListener('click', function () {
      $('qr-fg').value = b.getAttribute('data-fg');
      $('qr-bg').value = b.getAttribute('data-bg');
      render();
    });
  });

  /* PNG 저장 */
  dlBtn.addEventListener('click', function () {
    if (!lastText) return;
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var name = 'qr-' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes()) + '.png';
    canvas.toBlob(function (blob) {
      if (!blob) return;
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    }, 'image/png');
  });

  /* 이미지 복사 */
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (!lastText || !canvas.toBlob) return;
      canvas.toBlob(function (blob) {
        if (!blob) return;
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(function () {
          var old = copyBtn.textContent;
          copyBtn.textContent = '복사됨 ✓';
          setTimeout(function () { copyBtn.textContent = old; }, 1600);
        }).catch(function () {
          var old = copyBtn.textContent;
          copyBtn.textContent = '복사 실패';
          setTimeout(function () { copyBtn.textContent = old; }, 1600);
        });
      }, 'image/png');
    });
  }

  render();
})();
