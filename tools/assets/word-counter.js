/* Live word / character / byte counter. */
(function () {
  var I = JSON.parse(document.getElementById('i18n').textContent);
  var $ = function (id) { return document.getElementById(id); };
  var ta = $('text');
  var seg = null;
  try { seg = new Intl.Segmenter(I.lang, { granularity: 'word' }); } catch (e) { seg = null; }
  var STOP = {};
  (I.stopwords || []).forEach(function (w) { STOP[w] = 1; });

  function isSpace(ch) { return /\s/.test(ch); }
  function charCount(s) { return Array.from(s).length; }
  function noSpaceCount(s) { return Array.from(s.replace(/\s/g, '')).length; }

  function tokens(s) {
    var out = [];
    if (seg) {
      Array.from(seg.segment(s)).forEach(function (part) {
        if (part.isWordLike) out.push(part.segment.toLowerCase());
      });
    } else {
      var m = s.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu);
      out = m || [];
    }
    return out;
  }

  function sentences(s) {
    if (!s.trim()) return 0;
    var parts = s.split(/[.!?。！？…]+/);
    var n = 0;
    for (var i = 0; i < parts.length; i++) if (parts[i].trim().length > 0) n++;
    return n;
  }
  function paragraphs(s) {
    if (!s.trim()) return 0;
    var parts = s.split(/\n+/);
    var n = 0;
    for (var i = 0; i < parts.length; i++) if (parts[i].trim().length > 0) n++;
    return n;
  }
  function fmtTime(minutes) {
    if (minutes <= 0) return I.timeFmt.replace('{m}', '0').replace('{s}', '0');
    var total = Math.round(minutes * 60);
    var m = Math.floor(total / 60), s = total % 60;
    return I.timeFmt.replace('{m}', String(m)).replace('{s}', String(s));
  }
  function num(n) { return new Intl.NumberFormat(I.locale).format(n); }

  function update() {
    var text = ta.value;
    var chars = charCount(text);
    var toks = tokens(text);
    var words = toks.length;
    var readMin = I.mode === 'chars' ? chars / 500 : words / 200;
    var speakMin = I.mode === 'chars' ? chars / 350 : words / 130;

    $('cChars').textContent = num(chars);
    $('cCharsNoSpace').textContent = num(noSpaceCount(text));
    $('cWords').textContent = num(words);
    $('cSentences').textContent = num(sentences(text));
    $('cParagraphs').textContent = num(paragraphs(text));
    $('cBytes').textContent = num(new TextEncoder().encode(text).length);
    $('cRead').textContent = fmtTime(readMin);
    $('cSpeak').textContent = fmtTime(speakMin);

    // unique words (all tokens), then frequency without stop words
    var uniq = {};
    toks.forEach(function (w) { uniq[w] = 1; });
    var freq = {}, total = 0;
    toks.forEach(function (w) {
      if (STOP[w]) return;
      if (I.mode !== 'chars' && w.length < 2) return;
      freq[w] = (freq[w] || 0) + 1;
      total++;
    });
    var keys = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a] || a.localeCompare(b); });
    $('cUnique').textContent = num(Object.keys(uniq).length);
    var box = $('density');
    box.innerHTML = '';
    if (!keys.length) {
      box.innerHTML = '<p class="muted">' + I.densityEmpty + '</p>';
      return;
    }
    keys.slice(0, 6).forEach(function (w) {
      var pct = total ? (freq[w] / total) * 100 : 0;
      var row = document.createElement('div');
      row.className = 'wordrow';
      var left = document.createElement('div');
      left.className = 'w';
      left.innerHTML = '<span>' + w.replace(/[<>&]/g, '') + '</span> <span class="muted">· ' + pct.toFixed(1) + '%</span>' +
        '<div class="bar-track" style="margin-top:4px"><div class="bar-fill" style="width:' + Math.min(100, pct * 6) + '%"></div></div>';
      var right = document.createElement('div');
      right.className = 'c';
      right.textContent = num(freq[w]);
      row.appendChild(left); row.appendChild(right);
      box.appendChild(row);
    });
  }

  ta.addEventListener('input', update);
  var sample = I.sample || '';
  window.__loadSample = function () { ta.value = sample; update(); };
  var sb = $('sampleBtn');
  if (sb) sb.addEventListener('click', function () { ta.value = sample; update(); ta.focus(); });
  var cb = $('clearBtn');
  if (cb) cb.addEventListener('click', function () { ta.value = ''; update(); ta.focus(); });
  update();
})();
