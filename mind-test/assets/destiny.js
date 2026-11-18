/* ══════════════════════════════════════════════════════════
   觀相 · 四柱 · 姓名 — engine (100% 브라우저 내 연산)
   ══════════════════════════════════════════════════════════ */
(function (g) {
  'use strict';
  var D = g.DESTINY_DATA;
  var E = D.ELEM, EO = D.ELEM_ORDER;
  var Destiny = {};

  /* ── 유틸 ─────────────────────────────────────────── */
  function hash(str) {
    var h = 2166136261;
    str = String(str);
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function prng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function picker(seed) {
    var r = prng(seed);
    return function (arr) { return arr[Math.floor(r() * arr.length) % arr.length]; };
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lastJong(word) {
    var s = String(word).replace(/[\s,."'”’)\]]+$/, '');
    var code = s.charCodeAt(s.length - 1);
    if (!(code >= 0xAC00 && code <= 0xD7A3)) return -1;
    return (code - 0xAC00) % 28;
  }
  /* 조사: 받침 있으면 a, 없으면 b */
  function josa(word, a, b) { var j = lastJong(word); return j > 0 ? a : (j === 0 ? b : b); }
  function josaRo(word) { var j = lastJong(word); return (j > 0 && j !== 8) ? '으로' : '로'; }
  function r1(v) { return Math.round(v * 10) / 10; }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* ── 60갑자 / 사주 ─────────────────────────────────── */
  function jdn(y, m, d) {
    var a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
    return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
  }
  function pillear(idx) {
    idx = ((idx % 60) + 60) % 60;
    var st = D.STEMS[idx % 10], br = D.BRANCHES[idx % 12];
    return {
      idx: idx, stem: st, branch: br,
      han: st.han + br.han, ko: st.ko + br.ko,
      name: st.ko + br.ko, label: st.han + br.han
    };
  }
  function dayPillar(y, m, d) { return pillear((jdn(y, m, d) - 11) % 60); }

  function solYearForPillar(y, m, d) {
    /* 입춘(2/4) 이전이면 전년도 간지 */
    return (m < 2 || (m === 2 && d < 4)) ? y - 1 : y;
  }
  function yearPillar(y, m, d) {
    var sy = solYearForPillar(y, m, d);
    return pillear(sy - 1984);
  }
  function monthBranchIndex(m, d) {
    /* 절입일 기준 월지: 인월(2/4)부터 */
    var idx = -1;
    for (var i = 0; i < D.JEOLGI.length; i++) {
      var j = D.JEOLGI[i];
      if (m === j.m) { idx = (d >= j.d) ? j.b : ((j.b + 11) % 12); break; }
    }
    if (idx < 0) idx = 0;
    return idx;
  }
  function monthPillar(y, m, d) {
    var yp = yearPillar(y, m, d);
    var bi = monthBranchIndex(m, d);
    /* 월간: 년간에 따라 인월 천간 결정 */
    var base = ((yp.stem.i % 5) * 2 + 2) % 10;
    /* 인월(2)에서 몇 달 지났는지 */
    var diff = ((bi - 2) % 12 + 12) % 12;
    var stem = (base + diff) % 10;
    var idx = ((6 * stem - 5 * bi) % 60 + 60) % 60;
    return pillear(idx);
  }

  function sajuOf(y, m, d) {
    var yp = yearPillar(y, m, d), mp = monthPillar(y, m, d), dp = dayPillar(y, m, d);
    var counts = { mok: 0, hwa: 0, to: 0, geum: 0, su: 0 };
    [yp, mp, dp].forEach(function (p) { counts[p.stem.elem]++; counts[p.branch.elem]++; });
    var sorted = EO.slice().sort(function (a, b) { return counts[b] - counts[a]; });
    var total = 6;
    var lack = EO.filter(function (k) { return counts[k] === 0; });
    var weakest = sorted[sorted.length - 1];
    var yin = 0, yang = 0;
    [yp, mp, dp].forEach(function (p) { if (p.stem.yy === '양') yang++; else yin++; });
    return {
      y: y, m: m, d: d,
      dateText: y + '년 ' + m + '월 ' + d + '일',
      year: yp, month: mp, day: dp,
      yearStem: yp.stem, yearBranch: yp.branch,
      monthStem: mp.stem, monthBranch: mp.branch,
      dayStem: dp.stem, dayBranch: dp.branch,
      pillars: [yp, mp, dp],
      counts: counts, total: total,
      dominant: sorted[0], second: sorted[1], weakest: weakest, lack: lack,
      yin: yin, yang: yang,
      zodiac: yp.branch.animal + '띠',
      label: yp.name + '년 · ' + mp.name + '월 · ' + dp.name + '일',
      pct: EO.reduce(function (o, k) { o[k] = Math.round(counts[k] / total * 100); return o; }, {})
    };
  }

  function elemRel(a, b) { /* a → b 방향 */
    if (a === b) return 'same';
    if (D.SAENG[a] === b) return 'give';      /* a생b */
    if (D.SAENG[b] === a) return 'take';      /* b생a */
    if (D.GEUK[a] === b) return 'control';    /* a극b */
    return 'controlled';                      /* b극a */
  }
  function relWord(rel) {
    return { same: '비화', give: '상생', take: '상생', control: '상극', controlled: '상극' }[rel] || '비화';
  }

  /* 천간합·충 / 지지 합·충·형·파·해 */
  var STEM_HAP = [[0, 5], [1, 6], [2, 7], [3, 8], [4, 9]];
  var STEM_CHUNG = [[0, 6], [1, 7], [2, 8], [3, 9]];
  var BR_YUKHAP = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
  var BR_SAMHAP = [[2, 6, 10], [5, 9, 1], [8, 0, 4], [11, 3, 7]];
  var BR_CHUNG = [[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]];
  var BR_HYEONG = [[2, 5], [5, 8], [8, 11], [11, 2], [0, 3], [1, 7], [7, 10], [10, 1], [4, 4], [6, 6], [9, 9], [0, 0]];
  var BR_PA = [[0, 9], [1, 8], [2, 7], [3, 6], [4, 11], [5, 10]];
  var BR_HAE = [[0, 11], [1, 10], [2, 9], [3, 8], [4, 7], [5, 6]];
  function hasPair(list, a, b) {
    return list.some(function (p) { return (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a); });
  }
  function hasTriple(list, a, b) {
    return list.some(function (p) { return p.indexOf(a) >= 0 && p.indexOf(b) >= 0 && a !== b; });
  }
  function pillarLink(a, b) {
    var out = { score: 0, tags: [] };
    if (hasPair(STEM_HAP, a.stem.i, b.stem.i)) { out.score += 10; out.tags.push('천간합'); }
    if (hasPair(STEM_CHUNG, a.stem.i, b.stem.i)) { out.score -= 6; out.tags.push('천간충'); }
    if (hasPair(BR_YUKHAP, a.branch.i, b.branch.i)) { out.score += 8; out.tags.push('지지육합'); }
    if (hasTriple(BR_SAMHAP, a.branch.i, b.branch.i)) { out.score += 7; out.tags.push('지지삼합'); }
    if (hasPair(BR_CHUNG, a.branch.i, b.branch.i)) { out.score -= 8; out.tags.push('지지충'); }
    if (hasPair(BR_HYEONG, a.branch.i, b.branch.i) && a.branch.i !== b.branch.i) { out.score -= 5; out.tags.push('지지형'); }
    if (hasPair(BR_PA, a.branch.i, b.branch.i)) { out.score -= 3; out.tags.push('지지파'); }
    if (hasPair(BR_HAE, a.branch.i, b.branch.i)) { out.score -= 3; out.tags.push('지지해'); }
    return out;
  }

  /* ── 이름 ─────────────────────────────────────────── */
  function hangulPart(ch) {
    var code = ch.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) return null;
    var idx = code - 0xAC00;
    var cho = Math.floor(idx / 588), jung = Math.floor((idx % 588) / 28), jong = idx % 28;
    return { cho: D.CHO[cho], jung: D.JUNG[jung], jong: D.JONG[jong] };
  }
  function isHanja(ch) { return /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(ch); }

  var hanjaTable = null;
  function ensureHanja() {
    if (hanjaTable || !g.fetch) return Promise.resolve(null);
    hanjaTable = {};
    return fetch('assets/hanja.json?v=20261118b').then(function (r) { return r.json(); }).then(function (j) {
      hanjaTable = j; return j;
    }).catch(function () { return null; });
  }
  function hanjaStroke(ch) {
    if (!hanjaTable) return 0;
    return hanjaTable[ch] || 0;
  }

  function suri(n) {
    n = Math.abs(Math.round(n));
    if (n === 0) return D.SURIE[81];
    var k = ((n - 1) % 81) + 1;
    return D.SURIE[k] ? Object.assign({ n: k }, D.SURIE[k]) : { n: k, g: '반', k: '무명격', t: '길흉이 반반' };
  }

  function analyzeName(name, hanja, saju) {
    var chars = String(name || '').replace(/\s+/g, '').split('').filter(Boolean);
    var syl = chars.map(function (ch) {
      var p = hangulPart(ch);
      if (!p) return { ch: ch, ok: false, elem: 'to', strokes: 0, cho: '', jung: '', jong: '' };
      var st = (D.CHO_STROKE[p.cho] || 0) + (D.JUNG_STROKE[p.jung] || 0) + (D.JONG_STROKE[p.jong] || 0);
      return {
        ch: ch, ok: true, cho: p.cho, jung: p.jung, jong: p.jong,
        elem: D.CHO_ELEM[p.cho], strokes: st
      };
    });
    var hchars = String(hanja || '').replace(/\s+/g, '').split('').filter(isHanja);
    var useHanja = hchars.length >= 2;
    /* 한자 획수 배열 — 성1 + 이름 n */
    var hStrokes = useHanja ? hchars.map(function (c) { return hanjaStroke(c) || 0; }) : [];
    var validHanja = useHanja && hStrokes.every(function (s) { return s > 0; });
    var base = validHanja ? hStrokes : syl.map(function (s) { return s.strokes; });

    /* 사격(四格) */
    var n = base.length;
    var won, hyeong, i, jeong;
    if (n >= 3) {
      var rest = base.slice(1);
      won = rest.reduce(function (a, b) { return a + b; }, 0);
      hyeong = base[0] + rest[0];
      i = base[0] + rest[rest.length - 1];
      jeong = base.reduce(function (a, b) { return a + b; }, 0);
    } else if (n === 2) {
      won = base[1]; hyeong = base[0] + base[1]; i = base[0] + base[1]; jeong = base[0] + base[1];
    } else if (n === 1) {
      won = base[0]; hyeong = base[0]; i = base[0]; jeong = base[0];
    } else {
      won = hyeong = i = jeong = 0;
    }
    var sagyeok = [
      { key: 'won', han: '元格', ko: '원격', life: '초년운(1~20대)', v: won, s: suri(won) },
      { key: 'hyeong', han: '亨格', ko: '형격', life: '중년운(20~40대)', v: hyeong, s: suri(hyeong) },
      { key: 'i', han: '利格', ko: '이격', life: '장년·말년운', v: i, s: suri(i) },
      { key: 'jeong', han: '貞格', ko: '정격', life: '총운(일생)', v: jeong, s: suri(jeong) }
    ];

    /* 음오행 흐름 */
    var flow = syl.map(function (s) { return s.elem; });
    var trans = [];
    for (var k = 0; k + 1 < flow.length; k++) {
      trans.push({ a: flow[k], b: flow[k + 1], rel: elemRel(flow[k], flow[k + 1]) });
    }
    var geuk = trans.filter(function (t) { return t.rel === 'control' || t.rel === 'controlled'; }).length;
    var saeng = trans.filter(function (t) { return t.rel === 'give' || t.rel === 'take'; }).length;

    var score = 50;
    sagyeok.forEach(function (s) { score += s.s.g === '길' ? 9 : (s.s.g === '흉' ? -7 : 1); });
    score += saeng * 4 - geuk * 5;
    score = clamp(score, 8, 96);

    return {
      name: chars.join(''), hanja: hchars.join(''), useHanja: validHanja, hasHanjaInput: hchars.length > 0,
      syllables: syl, flow: flow, trans: trans, geuk: geuk, saeng: saeng,
      soundStrokes: syl.map(function (s) { return s.strokes; }),
      soundTotal: syl.reduce(function (a, s) { return a + s.strokes; }, 0),
      hanjaStrokes: hStrokes,
      baseStrokes: base, baseKind: validHanja ? 'hanja' : 'sound',
      sagyeok: sagyeok, score: score,
      firstElem: flow[0] || (saju ? saju.dominant : 'to'),
      lastElem: flow[flow.length - 1] || (saju ? saju.dominant : 'to'),
      geukPairs: trans.filter(function (t) { return t.rel === 'control' || t.rel === 'controlled'; })
    };
  }

  /* ── 관상 ─────────────────────────────────────────── */
  function medianOf(lum, W, H) {
    var arr = [], step = Math.max(1, Math.round(Math.sqrt(W * H / 4000)));
    for (var y = 0; y < H; y += step) for (var x = 0; x < W; x += step) arr.push(lum[y * W + x]);
    arr.sort(function (a, b) { return a - b; });
    return arr[Math.floor(arr.length / 2)] || 128;
  }

  /* 어두운 덩어리(눈 후보) 찾기 */
  function darkBlobs(lum, W, H, thr) {
    var seen = new Uint8Array(W * H), blobs = [];
    var stack = [];
    var minA = Math.max(8, Math.round(W * H * 0.00035));
    var maxA = Math.round(W * H * 0.03);
    for (var i = 0; i < W * H; i++) {
      if (seen[i] || lum[i] >= thr) continue;
      stack.length = 0; stack.push(i); seen[i] = 1;
      var area = 0, sx = 0, sy = 0, x0 = W, x1 = 0, y0 = H, y1 = 0;
      while (stack.length) {
        var p = stack.pop(), px = p % W, py = (p - px) / W;
        area++; sx += px; sy += py;
        if (px < x0) x0 = px; if (px > x1) x1 = px;
        if (py < y0) y0 = py; if (py > y1) y1 = py;
        var nb = [p - 1, p + 1, p - W, p + W];
        for (var k = 0; k < 4; k++) {
          var q = nb[k];
          if (q < 0 || q >= W * H) continue;
          var qx = q % W;
          if ((k === 0 && qx !== px - 1) || (k === 1 && qx !== px + 1)) continue;
          if (!seen[q] && lum[q] < thr) { seen[q] = 1; stack.push(q); }
        }
      }
      if (area < minA || area > maxA) continue;
      var bw = x1 - x0 + 1, bh = y1 - y0 + 1;
      if (bw > W * 0.3 || bh > H * 0.16) continue;
      if (bw < 3 || bh < 2) continue;
      var fill = area / (bw * bh);
      if (fill < 0.28) continue;
      blobs.push({ x: sx / area, y: sy / area, w: bw, h: bh, area: area, fill: fill });
      if (blobs.length > 260) break;
    }
    return blobs;
  }

  function skinRatioInBox(skin, W, H, x0, y0, w, h, step) {
    x0 = Math.max(0, Math.round(x0)); y0 = Math.max(0, Math.round(y0));
    var x1 = Math.min(W - 1, Math.round(x0 + w)), y1 = Math.min(H - 1, Math.round(y0 + h));
    var c = 0, s = 0;
    step = step || 2;
    for (var y = y0; y <= y1; y += step) for (var x = x0; x <= x1; x += step) {
      c++; if (skin[y * W + x]) s++;
    }
    return c ? s / c : 0;
  }
  function skinAroundBlob(skin, W, H, b) {
    var x0 = b.x - b.w * 0.75, y0 = b.y - b.h * 0.9;
    return skinRatioInBox(skin, W, H, x0, y0, b.w * 1.5, b.h * 1.8, 1);
  }

  function edgeMeanInBox(edge, W, H, x0, y0, w, h, step) {
    x0 = Math.max(0, Math.round(x0)); y0 = Math.max(0, Math.round(y0));
    var x1 = Math.min(W - 1, Math.round(x0 + w)), y1 = Math.min(H - 1, Math.round(y0 + h));
    var c = 0, s = 0; step = step || 2;
    for (var y = y0; y <= y1; y += step) for (var x = x0; x <= x1; x += step) { c++; s += edge[y * W + x]; }
    return c ? s / c : 0;
  }

  function findEyePair(lum, skin, edge, edgeMean, W, H) {
    var med = medianOf(lum, W, H);
    var thr = Math.max(24, med * 0.66);
    var blobs = darkBlobs(lum, W, H, thr).filter(function (b) {
      var asp = b.w / b.h;
      return b.y > H * 0.08 && b.y < H * 0.62 && asp > 1.1 && asp < 5 && skinAroundBlob(skin, W, H, b) > 0.30;
    });
    if (blobs.length < 2) return null;
    var best = null, bestScore = -1e9;
    for (var i = 0; i < blobs.length; i++) {
      for (var j = i + 1; j < blobs.length; j++) {
        var a = blobs[i], b = blobs[j];
        var dy = Math.abs(a.y - b.y), dx = Math.abs(a.x - b.x);
        if (dx < W * 0.07 || dx > W * 0.33) continue;
        if (dy > H * 0.045) continue;
        var ar = Math.max(a.area, b.area) / Math.max(1, Math.min(a.area, b.area));
        if (ar > 2.8) continue;
        var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        if (my < H * 0.12 || my > H * 0.62) continue;
        var fw = dx / 0.40, fh = fw * 1.34;
        if (fw < W * 0.16 || fw > W * 0.78) continue;
        var bx = mx - fw / 2, by = my - fh * 0.40;
        if (bx < 0 || bx + fw > W || by < -fh * 0.02 || by + fh > H) continue;
        var sr = skinRatioInBox(skin, W, H, bx, by, fw, fh, 3);
        if (sr < 0.32) continue;
        var ed = edgeMeanInBox(edge, W, H, bx, by, fw, fh, 2);
        if (ed < edgeMean * 1.05) continue;
        var midDark = 0, midN = 0;
        for (var xm = Math.round(mx - dx * 0.12); xm <= Math.round(mx + dx * 0.12); xm++) {
          for (var ym = Math.round(my - H * 0.02); ym <= Math.round(my + H * 0.02); ym++) {
            if (xm < 0 || xm >= W || ym < 0 || ym >= H) continue;
            midN++; if (lum[ym * W + xm] < thr) midDark++;
          }
        }
        var midPen = midN ? (midDark / midN) : 0;
        var score = sr * 2.2 - Math.abs(mx - W * 0.5) / W * 2.2 - Math.abs(my - H * 0.42) / H * 1.4
          - Math.abs(dx / W - 0.21) * 4.2 - midPen * 1.4 + (ed / edgeMean) * 0.45;
        if (score > bestScore) { bestScore = score; best = { a: a, b: b, mx: mx, my: my, d: dx, sr: sr, ed: ed }; }
      }
    }
    return best;
  }

  function skinBlobBox(skin, W, H) {
    var seen = new Uint8Array(W * H), stack = [];
    var best = null;
    var step = 1;
    for (var i = 0; i < W * H; i += step) {
      if (seen[i] || !skin[i]) continue;
      stack.length = 0; stack.push(i); seen[i] = 1;
      var area = 0, x0 = W, x1 = 0, y0 = H, y1 = 0;
      while (stack.length) {
        var p = stack.pop(), px = p % W, py = (p - px) / W;
        area++;
        if (px < x0) x0 = px; if (px > x1) x1 = px;
        if (py < y0) y0 = py; if (py > y1) y1 = py;
        var nb = [p - 1, p + 1, p - W, p + W];
        for (var k = 0; k < 4; k++) {
          var q = nb[k];
          if (q < 0 || q >= W * H) continue;
          var qx = q % W;
          if ((k === 0 && qx !== px - 1) || (k === 1 && qx !== px + 1)) continue;
          if (!seen[q] && skin[q]) { seen[q] = 1; stack.push(q); }
        }
      }
      if (area < W * H * 0.02) continue;
      var bw = x1 - x0 + 1, bh = y1 - y0 + 1;
      var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      var centerPull = 1 - (Math.abs(cx - W / 2) / W + Math.abs(cy - H * 0.42) / H);
      var score = area + centerPull * W * H * 0.4;
      if (!best || score > best.score) best = { score: score, x0: x0, y0: y0, bw: bw, bh: bh, area: area };
    }
    return best;
  }

  function findFaceBox(lum, skin, edge, edgeMean, W, H) {
    var eyes = findEyePair(lum, skin, edge, edgeMean, W, H);
    if (eyes) {
      var fw = eyes.d / 0.40;
      var fh = fw * 1.34;
      var x0 = eyes.mx - fw / 2;
      var y0 = eyes.my - fh * 0.40;
      x0 = clamp(x0, 0, W - fw);
      y0 = clamp(y0, 0, H - fh);
      if (y0 + fh > H) fh = H - y0;
      return { x: Math.round(x0), y: Math.round(y0), w: Math.round(fw), h: Math.round(fh), method: 'eyes' };
    }
    var sb = skinBlobBox(skin, W, H);
    if (sb) {
      var w2 = Math.min(sb.bw, W * 0.72);
      var h2 = Math.min(sb.bh, w2 * 1.45);
      var x2 = clamp(sb.x0 + (sb.bw - w2) / 2, 0, W - w2);
      var y2 = clamp(sb.y0, 0, H - h2);
      if (skinRatioInBox(skin, W, H, x2, y2, w2, h2, 3) > 0.2) {
        return { x: Math.round(x2), y: Math.round(y2), w: Math.round(w2), h: Math.round(h2), method: 'skin' };
      }
    }
    var w3 = W * 0.56, h3 = Math.min(H * 0.8, w3 * 1.34);
    var boxC = { x: Math.round((W - w3) / 2), y: Math.round(H * 0.07), w: Math.round(w3), h: Math.round(h3), method: 'center' };
    if (skinRatioInBox(skin, W, H, boxC.x, boxC.y, boxC.w, boxC.h, 3) < 0.12) return null;
    return boxC;
  }

  function analyzeFaceImage(img) {
    var MAX = 320;
    var w0 = img.naturalWidth || img.width, h0 = img.naturalHeight || img.height;
    var s = Math.min(1, MAX / Math.max(w0, h0));
    var W = Math.max(24, Math.round(w0 * s)), H = Math.max(24, Math.round(h0 * s));
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var cx = cv.getContext('2d');
    cx.drawImage(img, 0, 0, W, H);
    var data;
    try { data = cx.getImageData(0, 0, W, H).data; } catch (e) { return null; }
    var n = W * H;
    var lum = new Float32Array(n), skin = new Uint8Array(n), red = new Float32Array(n);
    var skinCount = 0, sumR = 0, sumG = 0, sumB = 0;
    for (var i = 0; i < n; i++) {
      var r = data[i * 4], gg = data[i * 4 + 1], b = data[i * 4 + 2];
      lum[i] = 0.299 * r + 0.587 * gg + 0.114 * b;
      var cb = 128 - 0.168736 * r - 0.331264 * gg + 0.5 * b;
      var cr = 128 + 0.5 * r - 0.418688 * gg - 0.081312 * b;
      var mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
      var isSkin = (r > 60 && gg > 30 && b > 15 && r > gg && r > b && (r - mn) > 12 && (mx - mn) > 12 &&
        cb > 70 && cb < 140 && cr > 128 && cr < 190);
      if (isSkin) { skin[i] = 1; skinCount++; sumR += r; sumG += gg; sumB += b; }
      red[i] = r - (gg + b) / 2;
    }
    if (skinCount < n * 0.015) return null;

    /* 엣지맵 (얼굴 검증·기운 계측에 함께 사용) */
    var edge = new Float32Array(W * H), edgeSum = 0;
    for (var y4 = 1; y4 < H - 1; y4++) for (var x4 = 1; x4 < W - 1; x4++) {
      var gx = lum[y4 * W + x4 + 1] - lum[y4 * W + x4 - 1];
      var gy = lum[(y4 + 1) * W + x4] - lum[(y4 - 1) * W + x4];
      var m = Math.sqrt(gx * gx + gy * gy);
      edge[y4 * W + x4] = m; edgeSum += m;
    }
    var edgeMean = edgeSum / (W * H) || 1;

    /* ── 얼굴 박스 찾기 ──
       1) 눈 쌍 검출(사진 중심·크기·엣지 밀도 검증) 2) 스킨 블롭 3) 중앙 추정 */
    var box = findFaceBox(lum, skin, edge, edgeMean, W, H);
    if (!box) return null;
    var bx0 = box.x, by0 = box.y, fw = box.w, fh = box.h;
    var bx1 = Math.min(W - 1, bx0 + fw - 1);

    var faceRatio = fw / fh;

    /* 대칭도 */
    var symSum = 0, symN = 0;
    for (var yy = by0; yy < by0 + fh; yy++) {
      for (var xx = bx0; xx < bx0 + Math.floor(fw / 2); xx++) {
        var mx2 = bx1 - (xx - bx0);
        if (skin[yy * W + xx] && skin[yy * W + mx2]) { symSum += Math.abs(lum[yy * W + xx] - lum[yy * W + mx2]); symN++; }
      }
    }
    var symmetry = symN > 40 ? clamp(100 - (symSum / symN) * 1.15, 30, 98) : 62;

    /* 밝기·혈색 */
    var bSum = 0, redSum = 0, bN = 0;
    for (var y3 = by0; y3 < by0 + fh; y3++) for (var x3 = bx0; x3 <= bx1; x3++) {
      if (skin[y3 * W + x3]) { bSum += lum[y3 * W + x3]; redSum += red[y3 * W + x3]; bN++; }
    }
    var brightness = bN ? bSum / bN : 128;
    var redness = bN ? redSum / bN : 20;

    function bandStats(y0, y1) {
      var e = 0, c = 0, sk = 0, r0 = 0;
      for (var y5 = Math.max(by0, Math.round(y0)); y5 < Math.min(by0 + fh, Math.round(y1)); y5++) {
        for (var x5 = bx0; x5 <= bx1; x5++) {
          e += edge[y5 * W + x5]; c++;
          if (skin[y5 * W + x5]) { sk++; r0 += red[y5 * W + x5]; }
        }
      }
      return { edge: c ? e / c : 0, skin: c ? sk / c : 0, red: sk ? r0 / sk : 0, y0: y0, y1: y1 };
    }

    /* 랜드마크: 눈썹·눈 / 입 추정 */
    function darkProfile(y0, y1) {
      /* 행별 어두운 픽셀 비율 */
      var rows = [];
      for (var y6 = Math.max(by0, Math.round(y0)); y6 < Math.min(by0 + fh, Math.round(y1)); y6++) {
        var d = 0, c = 0;
        for (var x6 = bx0; x6 <= bx1; x6++) { if (lum[y6 * W + x6] < brightness * 0.72) d++; c++; }
        rows.push({ y: y6, r: c ? d / c : 0 });
      }
      return rows;
    }
    function peakY(rows) {
      var best = rows[0] || { y: by0, r: 0 };
      rows.forEach(function (r) { if (r.r > best.r) best = r; });
      return best;
    }
    var upperRows = darkProfile(by0 + fh * 0.16, by0 + fh * 0.46);
    var lowerRows = darkProfile(by0 + fh * 0.6, by0 + fh * 0.9);
    var eyePeak = peakY(upperRows), mouthPeak = peakY(lowerRows);
    var eyeY = eyePeak.r > 0.02 ? eyePeak.y : by0 + fh * 0.42;
    var mouthY = mouthPeak.r > 0.02 ? mouthPeak.y : by0 + fh * 0.72;

    /* 눈 상세: 눈 라인 근처 어두운 픽셀의 좌우 무게중심 */
    var eyeTop = Math.max(by0, Math.round(eyeY - fh * 0.045)), eyeBot = Math.min(by0 + fh, Math.round(eyeY + fh * 0.055));
    var lx = 0, ln = 0, rx = 0, rn = 0, darkTot = 0, area = 0;
    for (var y7 = eyeTop; y7 < eyeBot; y7++) {
      for (var x7 = bx0; x7 <= bx1; x7++) {
        area++;
        if (lum[y7 * W + x7] < brightness * 0.66) {
          darkTot++;
          if (x7 < bx0 + fw / 2) { lx += x7; ln++; } else { rx += x7; rn++; }
        }
      }
    }
    var eyeSize = area ? darkTot / area : 0;
    var eyeSpace = (ln && rn) ? Math.abs((rx / rn) - (lx / ln)) / fw : 0.33;

    /* 코: 눈~입 사이 중앙 밝은 능선 */
    var noseBandY0 = Math.round(eyeY + fh * 0.05), noseBandY1 = Math.round(mouthY - fh * 0.03);
    var ridgeW = [], ridgeC = [];
    for (var y8 = Math.max(by0, noseBandY0); y8 < Math.min(by0 + fh, noseBandY1); y8++) {
      var cxx = Math.round(bx0 + fw / 2), wWide = 0, cs = 0, vel = 0;
      for (var dx = -Math.round(fw * 0.12); dx <= Math.round(fw * 0.12); dx++) {
        var px = cxx + dx;
        if (px < bx0 || px > bx1) continue;
        var lv = lum[y8 * W + px];
        vel += Math.abs(lv - lum[y8 * W + clamp(px + Math.round(fw * 0.2), bx0, bx1)]);
        if (lv > brightness * 1.02) wWide++;
        cs++;
      }
      ridgeW.push(wWide / Math.max(1, cs));
      ridgeC.push(cs ? vel / cs : 0);
    }
    var noseWidth = ridgeW.length ? ridgeW.reduce(function (a, b) { return a + b; }, 0) / ridgeW.length : 0.4;
    var noseContrast = ridgeC.length ? ridgeC.reduce(function (a, b) { return a + b; }, 0) / ridgeC.length : 0;

    /* 입: 입 라인 근처 붉은/어두운 픽셀 폭 */
    var mTop = Math.max(by0, Math.round(mouthY - fh * 0.05)), mBot = Math.min(by0 + fh, Math.round(mouthY + fh * 0.045));
    var mMin = W, mMax = 0, mMass = 0;
    for (var y9 = mTop; y9 < mBot; y9++) {
      for (var x9 = bx0; x9 <= bx1; x9++) {
        var ixx = y9 * W + x9;
        if (skin[ixx] && (red[ixx] > redness + 8 || lum[ixx] < brightness * 0.72)) {
          mMass++;
          if (x9 < mMin) mMin = x9;
          if (x9 > mMax) mMax = x9;
        }
      }
    }
    var mouthWidth = (mMax > mMin) ? (mMax - mMin + 1) / fw : 0.3;
    var lipDensity = mMass / Math.max(1, (mBot - mTop) * fw);

    /* 턱 폭 / 귀 */
    function rowWidth(y10) {
      var a = -1, b = -1;
      for (var x10 = bx0; x10 <= bx1; x10++) if (skin[Math.round(y10) * W + x10]) { if (a < 0) a = x10; b = x10; }
      return a < 0 ? 0 : (b - a + 1);
    }
    var wEye = rowWidth(eyeY), wMid = rowWidth(by0 + fh * 0.55), wJaw = rowWidth(by0 + fh * 0.88), wMax = 0;
    for (var yy2 = by0; yy2 < by0 + fh; yy2 += 2) wMax = Math.max(wMax, rowWidth(yy2));
    var jawRatio = wMax ? wJaw / wMax : 0.7;
    var earRatio = wMid ? wEye / wMid : 1;

    /* 삼정: 눈썹선·코끝·턱으로 구획 */
    var browY = Math.max(by0 + fh * 0.12, eyeY - fh * 0.12);
    var noseTipY = Math.min(by0 + fh * 0.95, mouthY - fh * 0.02);
    var sangH = browY - by0, jungH = noseTipY - browY, haH = (by0 + fh) - noseTipY;
    var sumH = Math.max(1, sangH + jungH + haH);
    var samjeong = {
      sang: Math.round(sangH / sumH * 100),
      jung: Math.round(jungH / sumH * 100),
      ha: Math.round(haH / sumH * 100)
    };
    /* 표준 삼정 비율(33:33:34) 대비 편차로 기운 보정 */
    var sang = bandStats(by0, browY), jung = bandStats(browY, noseTipY), ha = bandStats(noseTipY, by0 + fh);
    var strength = { sang: sang.edge + sang.skin * 12, jung: jung.edge + jung.skin * 12, ha: ha.edge + ha.skin * 12 };
    var maxStr = Math.max(strength.sang, strength.jung, strength.ha, 0.001);
    var energy = {
      sang: Math.round(strength.sang / maxStr * 100),
      jung: Math.round(strength.jung / maxStr * 100),
      ha: Math.round(strength.ha / maxStr * 100)
    };

    var metrics = {
      faceRatio: r1(faceRatio), symmetry: Math.round(symmetry),
      brightness: Math.round(clamp(brightness / 255 * 100, 0, 100)),
      redness: Math.round(clamp((redness - 8) / 35 * 100, 0, 100)),
      eyeSize: r1(eyeSize), eyeSpace: r1(eyeSpace),
      noseWidth: r1(noseWidth), noseContrast: r1(noseContrast),
      mouthWidth: r1(mouthWidth), lipDensity: r1(lipDensity),
      jawRatio: r1(jawRatio), earRatio: r1(earRatio),
      edgeMean: r1(edgeMean), energy: energy
    };

    /* 동물상 분류 */
    var vec = {
      ratio: clamp(faceRatio, 0.55, 1.05),
      eyeSpace: clamp(eyeSpace, 0.2, 0.5),
      eyeSize: clamp(eyeSize * 2.2, 0.05, 0.6),
      mouth: clamp(mouthWidth, 0.15, 0.55),
      jaw: clamp(jawRatio, 0.4, 1.0),
      brow: clamp(sang.edge / (edgeMean * 1.4 + 0.001), 0.1, 1.0)
    };
    var tol = { ratio: 0.22, eyeSpace: 0.16, eyeSize: 0.22, mouth: 0.16, jaw: 0.28, brow: 0.5 };
    var wts = { ratio: 0.2, eyeSpace: 0.12, eyeSize: 0.16, mouth: 0.12, jaw: 0.24, brow: 0.16 };
    var scores = {};
    Object.keys(D.ANIMALS).forEach(function (k) {
      var t = D.ANIMALS[k].face, acc = 0;
      Object.keys(t).forEach(function (f) {
        acc += wts[f] * Math.min(1, Math.abs(vec[f] - t[f]) / tol[f]);
      });
      scores[k] = Math.round(clamp(100 - acc * 100, 18, 96));
    });
    var imgHash = hash(Array.prototype.slice.call(data, 0, 4096).join(','));
    var jitter = prng(imgHash);
    Object.keys(scores).forEach(function (k) { scores[k] = clamp(scores[k] + Math.round(jitter() * 4 - 2), 18, 96); });
    var animalKey = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; })[0];

    return {
      hasPhoto: true, rect: { x: bx0 / W, y: by0 / H, w: fw / W, h: fh / H },
      px: { x: bx0, y: by0, w: fw, h: fh, W: W, H: H },
      marks: {
        brow: clamp((browY - by0) / fh, 0.05, 0.5),
        eye: clamp((eyeY - by0) / fh, 0.1, 0.6),
        nose: clamp((noseTipY - by0) / fh, 0.4, 0.9),
        mouth: clamp((mouthY - by0) / fh, 0.55, 0.95)
      },
      metrics: metrics, samjeong: samjeong, energy: energy,
      method: box.method, box: box,
      scores: scores, animalKey: animalKey, seed: imgHash
    };
  }

  /* 오관 판정 */
  function ogwanOf(face) {
    var m = face.metrics;
    function lv(v, lo, hi) { return v < lo ? 'weak' : (v > hi ? 'strong' : 'mid'); }
    return {
      brow: { key: 'brow', level: lv(m.energy.sang, 70, 92), v: m.energy.sang + '%' },
      eye: { key: 'eye', level: lv(m.eyeSize, 0.055, 0.11), v: Math.round(m.eyeSpace * 100) + '% 간격' },
      nose: { key: 'nose', level: lv(m.noseContrast, 12, 26), v: Math.round(m.noseWidth * 100) + '% 폭' },
      mouth: { key: 'mouth', level: lv(m.mouthWidth, 0.24, 0.34), v: Math.round(m.mouthWidth * 100) + '% 폭' },
      ear: { key: 'ear', level: lv(m.earRatio, 0.86, 0.97), v: m.earRatio.toFixed(2) }
    };
  }

  /* 사진 없이 사주·이름으로 동물상 추정 */
  function estimateAnimal(saju, nm, seedStr) {
    var want = [saju.dominant, nm && nm.firstElem || saju.dominant];
    var cands = Object.keys(D.ANIMALS).filter(function (k) { return D.ANIMALS[k].elem === want[0]; });
    if (!cands.length) cands = Object.keys(D.ANIMALS);
    var h = hash(seedStr || (saju.label + (nm ? nm.name : '')));
    return cands[h % cands.length];
  }

  /* ── 관상 × 사주 × 이름 엮기 ──────────────────────── */
  var SJ_PHRASE = {
    sang: {
      mok: '판을 먼저 그리고 앞장서서 사람을 끌고 가는 쪽',
      hwa: '아이디어를 밝혀 사람을 모으고 분위기를 만드는 쪽',
      to: '자리를 잡아두고 오래 굴리는 쪽',
      geum: '선을 긋고 정확하게 시작하는 쪽',
      su: '흐름을 읽고 남들보다 한발 먼저 움직이는 쪽'
    },
    jung: {
      mok: '벌려놓은 일을 끝까지 밀어붙이는 쪽',
      hwa: '결정적인 순간에 불을 붙이는 쪽',
      to: '한번 잡은 것을 쉽게 놓지 않는 쪽',
      geum: '필요한 순간에 정확히 자르는 쪽',
      su: '정면으로 부딪히지 않고 돌아서 이기는 쪽'
    },
    ha: {
      mok: '끝에 가서 새로운 판을 하나 더 여는 쪽',
      hwa: '말년에 사람과 재물을 밝히는 쪽',
      to: '끝까지 챙기고 마무리하는 쪽',
      geum: '남기는 것을 정확히 남기고 정리하는 쪽',
      su: '사람과 인연을 오래 흘려보내며 챙기는 쪽'
    }
  };

  function weaveNarrative(p) {
    var face = p.face, sj, og, dom = E[p.saju.dominant];
    if (face) {
      var sm = face.samjeong;
      sj = sm.sang >= sm.jung && sm.sang >= sm.ha ? 'sang' : (sm.jung >= sm.ha ? 'jung' : 'ha');
      var ogw = ogwanOf(face), best = 'eye', bv = -1;
      Object.keys(ogw).forEach(function (k) {
        var lv = ogw[k].level === 'strong' ? 2 : (ogw[k].level === 'mid' ? 1 : 0);
        if (lv > bv) { bv = lv; best = k; }
      });
      og = best;
    } else {
      var dse = p.saju.dayStem.elem;
      sj = dse === 'mok' || dse === 'hwa' ? 'sang' : (dse === 'to' || dse === 'geum' ? 'jung' : 'ha');
      og = 'eye';
    }
    var sjInfo = D.SAMJEONG[sj], ogInfo = D.OGWAN[og];
    var nmEl = E[p.nm.firstElem];
    var dayEl = E[p.saju.dayStem.elem];
    var out = [];
    out.push((face ? sjInfo.ko + '(' + sjInfo.part + ')' : '사주 ' + p.saju.dayStem.han + ' ' + dayEl.ko + ' 기운') +
      '이 실한데, ' + p.saju.day.name + '(' + p.saju.dayStem.read + ') 일주에 이름의 ' + nmEl.han + '(' + nmEl.ko + ') 기운이 ' +
      (elemRel(dayEl.key, nmEl.key) === 'same' ? '그대로 겹칩니다' : (relWord(elemRel(dayEl.key, nmEl.key)) === '상생' ? '서로 밀어줍니다' : '한 번 부딪힙니다')) +
      '. 그래서 이 사람은 ' + SJ_PHRASE[sj][dom.key] + '.');
    if (face) {
      out.push('관상으로 보면 ' + ogInfo.ko + '(' + ogInfo.part + ')이 ' +
        ({ strong: '살아 있어', mid: '무난하게 자리해', weak: '조금 얇아' }[ogwanOf(face)[og].level]) +
        ' ' + ogInfo[ogwanOf(face)[og].level] + ' 이름의 ' + nmEl.ko + ' 기운이 ' +
        (p.nm.geuk > 0 ? '중간에 한 번 끊기니, 그 지점에서 말실수가 나옵니다.' : '끝까지 이어지니, 말과 행동이 크게 어긋나지 않습니다.'));
    } else {
      out.push('사진을 올리면 이 ' + dayEl.ko + ' 기운이 얼굴의 어느 자리(상정·중정·하정)에 실려 있는지까지 짚어 드립니다. 지금은 사주와 이름만으로 본 풀이입니다.');
    }
    return out;
  }

  /* ── 운세(오늘·올해) ──────────────────────────────── */
  function fateAgainst(mySaju, other) {
    var rel = elemRel(other.stem.elem, mySaju.dayStem.elem);
    var s = 50;
    s += { give: 18, take: 8, same: 6, control: -16, controlled: -6 }[rel];
    var link = pillarLink(mySaju.day, other);
    s += link.score;
    return { score: clamp(Math.round(s), 5, 98), rel: rel, link: link };
  }
  function todayFate(saju) {
    var now = new Date();
    var tp = dayPillar(now.getFullYear(), now.getMonth() + 1, now.getDate());
    var f = fateAgainst(saju, tp);
    return { pillar: tp, score: f.score, rel: f.rel, link: f.link, dateText: now.getFullYear() + '.' + pad2(now.getMonth() + 1) + '.' + pad2(now.getDate()) };
  }
  function yearFate(saju) {
    var now = new Date();
    var yp = yearPillar(now.getFullYear(), now.getMonth() + 1, now.getDate());
    var f = fateAgainst(saju, yp);
    return { pillar: yp, score: f.score, rel: f.rel, link: f.link, year: now.getFullYear(), text: now.getFullYear() };
  }

  /* ── 프로필 ───────────────────────────────────────── */
  function buildProfile(inp) {
    var parts = String(inp.birth || '').split('-').map(Number);
    var y = parts[0], m = parts[1], d = parts[2];
    var saju = sajuOf(y, m, d);
    var nm = analyzeName(inp.name, inp.hanja, saju);
    var face = inp.face || null;
    var animalKey = face ? face.animalKey : estimateAnimal(saju, nm, inp.name + inp.birth);
    var animal = D.ANIMALS[animalKey];
    var tf = todayFate(saju), yf = yearFate(saju);
    var p = {
      name: inp.name, hanja: inp.hanja || '', birth: inp.birth,
      y: y, m: m, d: d,
      saju: saju, nm: nm, face: face,
      animal: animal, animalKey: animalKey, estimated: !face,
      today: tf, year: yf,
      seed: hash((inp.name || '') + '|' + inp.birth + '|' + (inp.hanja || '')),
      id: hash((inp.name || '') + inp.birth).toString(36).slice(0, 6)
    };
    p.narrative = weaveNarrative(p);
    p.avoid = buildAvoid(p);
    p.keep = buildKeep(p);
    return p;
  }

  /* ⚠️ 피해야 할 것 / 🍀 곁에 두어야 할 것 */
  function buildAvoid(p) {
    var pk = picker(p.seed + 11);
    var el = E[p.saju.dominant], weak = E[p.saju.weakest];
    var an = p.animal;
    var _p = p.saju.lack.length ? E[p.saju.lack[0]].avoid[0] : weak.avoid[0];
    var _a = pk(el.avoid);
    var out = [];
    out.push({ t: el.ko + ' 기운의 ' + el.weak.split(',')[0].trim(), d: el.avoid[0] });
    out.push({ t: an.name + '의 그늘 — ' + an.guard.split('.')[0], d: an.avoid[0] + ' / ' + an.avoid[1] });
    out.push({ t: (p.saju.lack.length ? E[p.saju.lack[0]].ko + ' 기운이 비어 있는 자리' : weak.ko + ' 기운이 얇은 자리'),
      d: (p.saju.lack.length ? E[p.saju.lack[0]] : weak).weak + ' — 이 기운이 약해서 무리하게 흉내 내면 오히려 새어 나갑니다. ' +
        _p + josa(_p, '을', '를') + ' 자주 한다면 그게 신호입니다.' });
    if (p.nm.geuk > 0) {
      out.push({ t: '이름 소리의 상극 — ' + p.nm.geukPairs.map(function (x) { return E[x.a].han + '→' + E[x.b].han; }).join(', '),
        d: '말이 앞뒤에서 끊기는 소리입니다. 계약·약속을 말로만 하지 말고 반드시 글로 남기세요. 특히 ' + E[p.nm.geukPairs[0].b].ko + ' 기운이 필요한 자리에서 말실수가 납니다.' });
    } else {
      out.push({ t: '정격 ' + p.nm.sagyeok[3].v + '수 ' + p.nm.sagyeok[3].s.k + '의 그림자', d: p.nm.sagyeok[3].s.t + ' — 이 수가 흉으로 기울 때는 ' + pk([el.avoid[2], an.avoid[0], weak.avoid[1]]) + '이 그 신호입니다.' });
    }
    out.push({ t: '오늘 밤 하지 말 것', d: p.today.score < 50 ? '오늘(' + p.today.pillar.name + '일)은 ' + E[p.today.pillar.stem.elem].ko + ' 기운이 내 일주를 누르는 날입니다. 큰 결정·계약·고백은 내일로 미루세요.' : '오늘은 ' + p.today.pillar.name + '일, ' + E[p.today.pillar.stem.elem].ko + ' 기운이 내 편입니다. 대신 ' + _a + josa(_a, '은', '는') + ' 참으세요.' });
    return out;
  }
  function buildKeep(p) {
    var el = E[p.saju.dominant], lack = p.saju.lack.length ? E[p.saju.lack[0]] : E[p.saju.weakest];
    var an = p.animal;
    var out = [];
    out.push({ t: el.ko + ' 기운 살리기', d: el.keep.join(' · ') + '. ' + el.lucky.item + josa(el.lucky.item, '을', '를') + ' 곁에 두면 좋습니다.' });
    out.push({ t: an.name + '의 무기 — ' + an.charm, d: an.keep.join(' / ') });
    out.push({ t: '비어 있는 ' + lack.ko + '(' + lack.han + ') 채우기', d: lack.lucky.color + ' 계열 옷·소품, ' + lack.lucky.dir + ' 방향, ' + lack.lucky.num + ' 숫자를 의식적으로 쓰세요. ' + lack.lucky.item + '도 좋습니다.' });
    out.push({ t: '이름의 ' + p.nm.sagyeok[3].s.k + ' 살리기', d: p.nm.sagyeok[3].s.g === '길' ? '정격 ' + p.nm.sagyeok[3].v + '수가 ' + p.nm.sagyeok[3].s.k + '으로 길합니다. ' + p.nm.sagyeok[3].s.t + ' — 이름을 소리 내어 부르는 자리(모임·발표)에서 운이 열립니다.' : '정격 ' + p.nm.sagyeok[3].v + '수가 ' + p.nm.sagyeok[3].s.k + '입니다. ' + p.nm.sagyeok[3].s.t + ' — 이름을 크게 드러내기보다 ' + lack.ko + ' 기운의 공간(조용한 자리)에서 힘을 모으세요.' });
    out.push({ t: '오늘의 행운', d: '오늘은 ' + p.today.pillar.name + '일. ' + p.today.pillar.stem.han + ' ' + E[p.today.pillar.stem.elem].ko + ' 기운이 도는 날이라 ' + p.today.pillar.stem.han + ' 기운의 ' + E[p.today.pillar.stem.elem].lucky.color + ' 계열이 잘 맞습니다.' });
    return out;
  }

  /* ── 6대 관계 ─────────────────────────────────────── */
  var ACTION = {
    mok: { noun: '추진', deed: '일을 벌이고 사람을 끌고 가는', neg: '밀어붙이는' },
    hwa: { noun: '열정', deed: '분위기를 띄우고 감정을 그대로 내보이는', neg: '불태우는' },
    to: { noun: '중심', deed: '자리를 잡고 사람을 품는', neg: '붙잡는' },
    geum: { noun: '결단', deed: '선을 긋고 정확히 자르는', neg: '자르는' },
    su: { noun: '눈치', deed: '흐름을 읽고 돌아가는', neg: '흘리는' }
  };
  var COMMON_ACT = {
    'hwa|mok': '가까운 산이나 바다로 당일치기 다녀오기',
    'hwa|to': '집에서 같이 요리해 먹고 영화 한 편',
    'geum|to': '가계부·일정표를 같이 정리하고 운동 가기',
    'geum|su': '사우나·수영하고 밤 산책하기',
    'mok|su': '새로 배우는 클래스를 같이 등록하기',
    'hwa|geum': '전시·공연 보고 맛집 가기',
    'mok|to': '텃밭·화분 같이 가꾸기',
    'geum|mok': '러닝이나 등산처럼 목표를 정해 기록하기',
    'hwa|su': '물놀이·온천 여행',
    'su|to': '집에서 보드게임·독서 모임',
    'mok|tok': '', 'hwa|hwa': '맛집 투어와 노래방', 'mok|mok': '같이 배우고 같이 기록하기',
    'geum|geum': '같이 운동하고 서로 기록 경쟁하기', 'su|su': '밤 산책과 여행 계획 짜기',
    'to|to': '집 정리·인테리어 같이 하기'
  };
  function commonAct(a, b) {
    var k = [a, b].sort().join('|');
    return COMMON_ACT[k] || COMMON_ACT[k.split('|').reverse().join('|')] || (ACTION[a].noun + '와 ' + ACTION[b].noun + '을 섞은 활동');
  }

  function gradeOf(score) {
    if (score >= 90) return { label: '천생연분', tone: 'best' };
    if (score >= 80) return { label: '찰떡궁합', tone: 'good' };
    if (score >= 70) return { label: '좋은 인연', tone: 'good' };
    if (score >= 58) return { label: '무던한 사이', tone: 'mid' };
    if (score >= 46) return { label: '노력이 필요한 사이', tone: 'warn' };
    return { label: '상극 — 거리 두기', tone: 'bad' };
  }

  function animalMatch(a, b) {
    if (a === b) return 4;
    var k = [a, b].sort().join('|');
    return D.ANIMAL_MATCH[k] !== undefined ? D.ANIMAL_MATCH[k] : 0;
  }

  function relation(A, B, relType) {
    var ea = A.saju.dominant, eb = B.saju.dominant;
    var elRel = elemRel(ea, eb);
    var link = pillarLink(A.saju.day, B.saju.day);
    var am = animalMatch(A.animalKey, B.animalKey);
    var nmRel = elemRel(A.nm.firstElem, B.nm.firstElem);
    var samA = A.face ? A.face.samjeong : (A.samjeongGuess || { sang: 33, jung: 33, ha: 34 });
    var samB = B.face ? B.face.samjeong : (B.samjeongGuess || { sang: 33, jung: 33, ha: 34 });
    var samDiff = (Math.abs(samA.sang - samB.sang) + Math.abs(samA.jung - samB.jung) + Math.abs(samA.ha - samB.ha)) / 3;

    var score = 52;
    score += { give: 13, take: 13, same: 9, control: -13, controlled: -8 }[elRel];
    score += link.score;
    score += am * 0.9;
    score += (A.saju.dayStem.yy !== B.saju.dayStem.yy) ? 3 : -1;
    score += nmRel === 'give' || nmRel === 'take' ? 4 : (nmRel === 'control' || nmRel === 'controlled' ? -4 : 1);
    score += clamp(6 - samDiff * 0.18, 0, 6);
    score = clamp(Math.round(score), 10, 98);
    var grade = gradeOf(score);

    var pk = picker(hash(A.name + B.name + A.birth + B.birth));
    var nA = A.name, nB = B.name;
    var cA = E[ea], cB = E[eb];
    var cards = [];

    /* 1. 성격 케미 */
    var sameLines = [], clashLines = [], innerLines = [];
    var relText = {
      same: cA.ko + ' 기운끼리 만나 결이 같습니다. 말이 통하고 취향도 비슷해서, 처음 만난 날부터 오래 알던 사이처럼 느껴집니다',
      give: cA.ko + ' 기운이 ' + cB.ko + ' 기운을 살리는 상생입니다. ' + nA + '이 밀어주면 ' + nB + '이 커지고, ' + nB + '이 채워지면 ' + nA + '이 편해집니다',
      take: cB.ko + ' 기운이 ' + cA.ko + ' 기운을 살리는 상생입니다. ' + nB + '의 자리가 ' + nA + '을 편하게 만들어 줍니다',
      control: cA.ko + ' 기운이 ' + cB.ko + ' 기운을 누르는 상극입니다. ' + nA + '은 정리하려 하고 ' + nB + '은 자리를 지키려 해서, 같은 일을 두고도 속도가 다릅니다',
      controlled: cB.ko + ' 기운이 ' + cA.ko + ' 기운을 누르는 상극입니다. ' + nB + '의 방식이 ' + nA + '에게는 답답하게 들어옵니다'
    }[elRel];
    sameLines.push(nA + '은 ' + A.saju.dayStem.read + ' — ' + A.saju.dayStem.trait.split('.')[0] + '.');
    sameLines.push(nB + '은 ' + B.saju.dayStem.read + ' — ' + B.saju.dayStem.trait.split('.')[0] + '.');
    sameLines.push(relText + '.');
    if (am >= 5) sameLines.push('얼굴부터 ' + A.animal.name + '과 ' + B.animal.name + '이라, 서로의 표정을 읽는 속도가 비슷합니다.');
    else if (am <= -4) sameLines.push('다만 ' + A.animal.name + '과 ' + B.animal.name + '은 겉으로 보이는 온도가 달라서, 처음엔 서로를 오해하기 쉽습니다.');

    clashLines.push(clashOf(ea, eb, nA, nB, pk));
    if (link.tags.indexOf('천간충') >= 0) clashLines.push('일간끼리 ' + A.saju.dayStem.han + '·' + B.saju.dayStem.han + ' 천간충입니다. 말의 온도가 다르고, 한 번 어긋나면 같은 말을 두 번 해야 합니다.');
    if (link.tags.indexOf('지지충') >= 0) clashLines.push('일지 ' + A.saju.day.branch.han + '·' + B.saju.day.branch.han + '이 충합니다. 생활 리듬과 고집이 정면으로 부딪히는 자리가 있습니다.');
    if (link.tags.indexOf('지지육합') >= 0 || link.tags.indexOf('천간합') >= 0) clashLines.push('그래도 ' + (link.tags.join('·')) + '이 있어서, 크게 틀어져도 결국 다시 붙는 사이입니다.');
    clashLines.push(A.animal.guard.split('.')[0] + ' — ' + nA + '의 이 습관이 ' + nB + '에게는 ' + (eb === 'geum' ? '무책임하게' : '무심하게') + ' 보입니다.');

    innerLines.push(nA + '은 ' + nB + '에게 ' + ({ cat: '“난 괜찮아”', dog: '“너는 어떻게 생각해?”', fox: '“그건 좀 아닌 것 같은데”', bear: '“그냥 내가 할게”', rabbit: '“아무것도 아니야”', wolf: '“알아서 할게”', tiger: '“내가 맞잖아”', dino: '“나중에 하자”' }[A.animalKey] || '“괜찮아”') + '라고 말하지만,');
    innerLines.push('속으로는 ' + ({ cat: '네가 먼저 다가와 주길 기다리고', dog: '네가 나를 똑같이 좋아하는지 확인하고 싶고', fox: '네가 나를 어떻게 보는지 계산하고', bear: '네가 내 자리를 지켜주길 바라고', rabbit: '혹시 네가 나를 귀찮아하는 건 아닌지 걱정하고', wolf: '네가 나를 믿고 있는지 시험하고', tiger: '네가 나를 인정하는지 보고', dino: '네가 알아서 이해해 주길 바라고' }[A.animalKey] || '네가 알아주길 바라고') + ' 있습니다.');
    innerLines.push('그래서 ' + nB + '이 이걸 눈치채면 관계가 확 가까워지고, 못 채우면 ' + nA + '만 조용히 멀어집니다.');

    cards.push({
      id: 'chemi', icon: '🧠', title: '성격 케미', sub: '닮은 점 · 부딪히는 점 · 속마음',
      score: score, badge: grade.label,
      summary: relText + '.',
      blocks: [
        { h: '닮은 점', lines: sameLines },
        { h: '부딪히는 점', lines: clashLines },
        { h: '속마음', lines: innerLines }
      ]
    });

    /* 2. 취미·일상 */
    var dailyLines = [
      nA + '은 ' + cA.hobby[pk([0, 1, 2])] + ', ' + nB + '은 ' + cB.hobby[pk([0, 1, 2])] + ' 쪽입니다.',
      '둘이 같이 하면 좋은 것은 ' + commonAct(ea, eb) + '입니다.',
      '여행은 ' + (cA.travel === cB.travel ? '스타일이 거의 같아서 계획을 반으로 나눠도 됩니다.' : nA + '은 ' + cA.travel + ', ' + nB + '은 ' + cB.travel + ' — 한 번씩 번갈아 맡으면 서로 불만이 적습니다.')
    ];
    cards.push({
      id: 'daily', icon: '🎨', title: '취미 · 일상', sub: '같이 하면 대박인 것',
      score: clamp(Math.round(score * 0.7 + 20 + am), 10, 98),
      badge: am >= 5 ? '취향이 맞음' : (am <= -4 ? '취향이 다름' : '무난'),
      summary: '같이 ' + commonAct(ea, eb) + ' — 이게 이 조합의 최고 효율입니다.',
      blocks: [
        { h: '같이 하면 대박', lines: [
          commonAct(ea, eb) + ' — ' + nA + '의 ' + ACTION[ea].noun + '과 ' + nB + '의 ' + ACTION[eb].noun + '이 서로를 막지 않는 조합입니다.',
          cA.hobby[0] + ' ( ' + nA + ' 단독으로도 좋지만, 같이 하면 ' + nB + '이 더 오래 갑니다 )',
          cB.hobby[1] + ' ( ' + nB + '의 충전 루틴, ' + nA + '은 여기에 끼어들면 안 됩니다 )'
        ] },
        { h: '여행 스타일', lines: dailyLines.slice(2) },
        { h: '생활 리듬', lines: [
          (ea === 'su' || eb === 'su') && (ea === 'mok' || eb === 'mok') ? '한 명은 아침형, 한 명은 밤형입니다. 연락 시간대를 정해두지 않으면 서운함이 쌓입니다.' : '생활 리듬은 크게 어긋나지 않습니다. 다만 ' + (ea === 'hwa' || eb === 'hwa' ? '저녁 약속이 길어지면 다음 날 아침이 무너집니다.' : '주말 계획을 당일에 정하면 한 명이 지칩니다.'),
          '같이 사는 경우라면 ' + (ea === 'to' || eb === 'to' ? '물건 자리를 정해두는 것' : '각자만의 공간을 하나씩 남겨두는 것') + '이 갈등을 절반으로 줄입니다.'
        ] }
      ]
    });

    /* 3. 관계별 풀이 */
    var pos = [
      { key: '연인·부부', icon: '💞', base: score + (A.saju.dayStem.yy !== B.saju.dayStem.yy ? 5 : -3) + (link.tags.indexOf('지지육합') >= 0 ? 5 : 0) },
      { key: '찐친', icon: '🤝', base: score + am + (elRel === 'same' ? 5 : 0) },
      { key: '직장 동료', icon: '💼', base: score + (ea === 'geum' || eb === 'geum' ? 4 : 0) + (ea === 'to' || eb === 'to' ? 3 : 0) - (link.score < 0 ? 4 : 0) },
      { key: '가족', icon: '🏠', base: score + (ea === 'to' || eb === 'to' ? 6 : 0) + (samDiff < 8 ? 3 : 0) }
    ].map(function (o) {
      var s = clamp(Math.round(o.base), 10, 98);
      var gr = gradeOf(s);
      return { key: o.key, icon: o.icon, score: s, grade: gr.label, tone: gr.tone, line: posLine(o.key, ea, eb, nA, nB, s, pk) };
    });
    var posSorted = pos.slice().sort(function (a, b) { return b.score - a.score; });
    cards.push({
      id: 'positions', icon: '💞', title: '관계별 풀이', sub: '연인 · 친구 · 직장 · 가족',
      score: score, badge: posSorted[0].key + '가 최고',
      summary: '이 조합은 ' + posSorted[0].key + ' 포지션에서 가장 잘 맞고, ' + posSorted[posSorted.length - 1].key + ' 포지션에서는 서로의 속도를 맞춰야 합니다.',
      positions: pos
    });

    /* 4. 재물·일 */
    var biz = 0, reasons = [];
    if (ea === 'geum' || eb === 'geum') { biz += 2; reasons.push('금(金) 기운이 있어 수입과 지출을 숫자로 정리하는 사람이 한 명은 있습니다.'); }
    if (ea === 'to' || eb === 'to') { biz += 2; reasons.push('토(土) 기운이 받쳐줘서 한번 모은 것을 쉽게 흘리지 않습니다.'); }
    if (elRel === 'control' || elRel === 'controlled') { biz -= 3; reasons.push('상극 구조라 돈을 쓰는 기준이 다릅니다. 한 명은 “투자”, 한 명은 “저축”이라고 하면 반드시 문서로 정해야 합니다.'); }
    if (elRel === 'give' || elRel === 'take') { biz += 3; reasons.push('상생 구조라 한 사람이 벌고 한 사람이 굴리는 역할로 나뉘면 시너지가 납니다.'); }
    if (link.tags.indexOf('지지충') >= 0) { biz -= 2; reasons.push('일지가 충해 동업 계약에서 손해 배상 조항이 문제가 될 수 있습니다.'); }
    if (link.tags.indexOf('천간합') >= 0) { biz += 2; reasons.push('천간합이라 함께 판을 만들면 신뢰가 빨리 붙습니다.'); }
    if (am >= 5) { biz += 1; reasons.push('동물상 궁합이 좋아 서로의 빈틈을 자연스레 메웁니다.'); }
    if (A.nm.sagyeok[3].s.g === '길' && B.nm.sagyeok[3].s.g === '길') { biz += 1; reasons.push('두 사람 모두 정격 수리가 길해서 돈이 들어오는 문이 막히지 않습니다.'); }
    biz = clamp(biz, -10, 10);
    var bizScore = clamp(Math.round(50 + biz * 4.6), 5, 98);
    cards.push({
      id: 'money', icon: '💰', title: '재물 · 일', sub: '같이 일하면 + / -',
      score: bizScore, badge: biz > 0 ? '+' + biz + ' 이득' : (biz < 0 ? biz + ' 손실' : '본전'),
      signed: biz,
      summary: biz > 0
        ? '같이 일하거나 투자하면 ' + (biz >= 6 ? '확실히 플러스' : '완만한 플러스') + '입니다. 다만 돈 관리 역할은 반드시 나누세요.'
        : (biz < 0 ? '같이 돈을 만지면 마이너스가 날 수 있는 조합입니다. 동업·공동투자는 피하는 게 좋습니다.' : '같이 일해도 본전입니다. 이익보다 관계 유지가 목적일 때만 하세요.'),
      moneyRoles: [
        { who: nA, role: cA.moneyRole, desc: cA.moneyStyle },
        { who: nB, role: cB.moneyRole, desc: cB.moneyStyle }
      ],
      reasons: reasons.slice(0, 4)
    });

    /* 5. 피해야 할 것 */
    var avoid = [
      avoidLine(1, ea, eb, nA, nB, pk),
      { t: '말실수 — ' + pickOne(pk, ['결론부터 말하기', '농담으로 약점 찌르기', '과거 일 다시 꺼내기', '사람 많은 자리에서 지적하기']),
        d: nA + '은 ' + cA.neg + ' 방식으로 말하고, ' + nB + '은 ' + ACTION[eb].noun + '으로 받아들입니다. 같은 말도 ' + nB + '에게는 ' + (eb === 'geum' ? '심사' : '무시') + '로 들립니다.' },
      { t: '금전 — ' + pickOne(pk, ['공동 계좌', '돈 빌려주기', '동업 지분', '비용 나눠 내기']),
        d: biz < 0 ? '이 조합은 돈이 얽히면 관계가 먼저 상합니다. ' + (elRel === 'control' || elRel === 'controlled' ? '상극 구조라 지출 기준이 정반대입니다.' : '한쪽이 손해를 참는 구조가 됩니다.') + ' 큰돈은 절대 섞지 마세요.' : '돈이 얽혀도 크게 틀어지진 않지만, 정산 규칙을 처음에 정하지 않으면 그때부터 감정이 붙습니다.' },
      { t: '태도 — ' + (A.animal.guard.split('.')[0]),
        d: nA + '의 ' + A.animal.name + ' 기질이 ' + nB + '에게는 ' + (am <= -4 ? '가장 거슬리는 지점' : '가끔 서운한 지점') + '입니다. ' + A.animal.avoid[0] + '를 피하세요.' },
      { t: '타이밍 — ' + (link.tags.indexOf('지지충') >= 0 ? '충한 날의 대화' : '피곤한 밤의 대화'),
        d: (link.tags.indexOf('지지충') >= 0 ? '일지가 충하는 조합은 밤늦게, 피곤한 상태에서 중요한 말을 꺼내면 반드시 커집니다. 오전에 만나 이야기하세요.' : '이 조합은 감정이 늦게 올라오는 대신 한 번 올라오면 오래갑니다. 피곤할 때 결론을 내지 마세요.') }
    ];
    cards.push({
      id: 'avoid', icon: '🚫', title: '이 관계에서 피해야 할 것', sub: '절대 건드리면 안 되는 지뢰',
      score: 100 - score, badge: '주의', negative: true,
      summary: nA + '과 ' + nB + ' 사이에서 가장 위험한 것은 ' + (elRel === 'control' || elRel === 'controlled' ? '속도 차이를 무시한 결정' : '서운함을 말하지 않는 것') + '입니다.',
      items: avoid
    });

    /* 6. 곁에 두어야 할 것 */
    var keepEl = E[elRel === 'control' || elRel === 'controlled' ? (ea === 'su' ? 'mok' : (D.SAENG[eb] || 'su')) : (elRel === 'same' ? ea : eb)];
    var keep = [
      { t: '관계를 살리는 한 가지 — ' + (elRel === 'give' || elRel === 'take' ? '역할 나누기' : (elRel === 'same' ? '한 명이 결정하고 한 명이 기록하기' : '먼저 물어보기')),
        d: elRel === 'give' || elRel === 'take' ? nA + '이 ' + ACTION[ea].deed + ' 몫을 맡고, ' + nB + '이 마무리 몫을 맡으면 힘이 겹치지 않습니다.' : (elRel === 'same' ? '같은 기운이라 둘 다 결정하려 하면 정면충돌합니다. 한 명이 결정하면 다른 한 명이 기록하세요.' : '상극은 “네 방식은 틀렸다”가 아니라 “네 방식은 왜 그래?”로 물으면 절반이 풀립니다.') },
      { t: '행운 행동', d: keepEl.lucky.dir + ' 방향으로 함께 걷기, ' + keepEl.lucky.color + ' 계열 소품 맞추기. ' + keepEl.lucky.num + '이 들어간 날짜에 약속을 잡으면 잘 풀립니다.' },
      { t: '고마움 표현 — ' + nA + '에게는 ' + (A.animalKey === 'cat' || A.animalKey === 'wolf' ? '말보다 조용한 인정' : (A.animalKey === 'dog' || A.animalKey === 'rabbit' ? '구체적인 칭찬' : '함께한 시간을 언급하기')) + ', ' + nB + '에게는 ' + (B.animalKey === 'cat' || B.animalKey === 'wolf' ? '말보다 조용한 인정' : (B.animalKey === 'dog' || B.animalKey === 'rabbit' ? '구체적인 칭찬' : '함께한 시간을 언급하기')) + '이 잘 먹힙니다.' },
      { t: '이 관계의 행운 아이템', d: (keepEl.lucky.item) + ' — ' + keepEl.nature + ' 기운이 ' + E[ea].ko + '와 ' + E[eb].ko + ' 사이를 이어줍니다. ' + (A.nm.geuk > 0 || B.nm.geuk > 0 ? '두 이름 중 하나에 상극 소리가 있어 특히 필요합니다.' : '두 이름의 소리가 모두 이어져 있어 잘 맞습니다.') }
    ];
    cards.push({
      id: 'keep', icon: '✨', title: '이 관계에서 곁에 두어야 할 것', sub: '관계를 살리는 비결',
      score: score + 4, badge: '행운', positive: true,
      summary: '이 관계의 열쇠는 ' + keepEl.ko + ' 기운입니다. ' + keepEl.lucky.item + '을 곁에 두고, ' + keepEl.lucky.color + ' 계열을 맞춰 보세요.',
      items: keep
    });

    return {
      score: score, grade: grade, cards: cards,
      relType: relType || '친구',
      headline: relationHeadline(A, B, score, elRel),
      link: link, elRel: elRel,
      best: posSorted[0], worst: posSorted[posSorted.length - 1]
    };
  }

  function clashOf(ea, eb, nA, nB, pk) {
    var map = {
      control: nA + '의 ' + E[ea].neg + ' 힘이 ' + nB + '의 자리를 자꾸 ' + E[eb].ko + ' 쪽에서 흔듭니다. 같은 일을 두고도 “먼저 하자”와 “정해두고 하자”로 갈립니다.',
      controlled: nB + '의 ' + E[eb].neg + ' 힘이 ' + nA + '의 방향을 자꾸 꺾습니다. ' + nA + '은 답답하고 ' + nB + '은 재촉한다고 느낍니다.'
    };
    if (map[elemRel(ea, eb)]) return map[elemRel(ea, eb)];
    if (elemRel(ea, eb) === 'same') return '같은 기운이라 장점도 단점도 똑같이 겹칩니다. 둘 다 결정을 미루면 아무것도 정해지지 않고, 둘 다 서두르면 크게 넘어집니다.';
    return '한쪽이 밀어주고 한쪽이 받는 구조라 부딪힘은 적지만, 받는 쪽이 “나는 항상 맞춰주는 사람”이라고 느끼면 그때 갈등이 시작됩니다.';
  }

  function pickOne(pk, arr) { return arr[Math.floor(pk([0.11, 0.37, 0.63, 0.89]) * arr.length) % arr.length]; }

  function avoidLine(n, ea, eb, nA, nB, pk) {
    var pairs = {
      control: nA + '이 ' + nB + '의 일을 정리해주려 들면 관계가 상합니다',
      controlled: nB + '의 기준에 ' + nA + '이 자꾸 맞추다 지칩니다',
      same: '둘 다 같은 방식이라 실수를 두 번 반복합니다',
      give: nA + '이 계속 주기만 하다 지칩니다',
      take: nB + '이 계속 주기만 하다 지칩니다'
    };
    return { t: '태도 — ' + (pairs[elemRel(ea, eb)] || '한쪽만 맞추기'), d: '특히 ' + nB + '이 지쳤을 때 ' + nA + '이 같은 말을 반복하면 그대로 선이 그어집니다. 한 번 물러서서 “네가 원하는 게 뭐야?”를 먼저 물으세요.' };
  }

  function posLine(key, ea, eb, nA, nB, s, pk) {
    var good = s >= 70;
    var t = {
      '연인·부부': good ? nA + '의 ' + E[ea].kw[0] + '과 ' + nB + '의 ' + E[eb].kw[1] + '이 서로를 채워서, 같이 있을 때 둘 다 조금씩 나아집니다.' : '감정의 온도가 달라서, 애정 표현 방식부터 맞춰야 합니다.',
      '찐친': good ? '말이 통하고 취향이 겹칩니다. 오래 봐도 서로의 결이 흐트러지지 않는 사이입니다.' : '가끔은 서로의 영역을 침범합니다. 그때 “요즘 왜 그래?”보다 “바빠?”가 낫습니다.',
      '직장 동료': good ? nA + '이 판을 벌리고 ' + nB + '이 마무리하면 일이 깔끔하게 끝납니다.' : '업무 분장이 흐리면 책임이 한쪽으로 몰립니다. 역할을 문서로 남기세요.',
      '가족': good ? '오래 봐도 편한 사이입니다. 말없이 챙기는 방식이 통해서 크게 틀어지지 않습니다.' : '가까워서 서운함을 말하지 않고 넘깁니다. 그게 오래 쌓이면 한 번에 터집니다.'
    };
    return t[key] || '';
  }

  function relationHeadline(A, B, score, elRel) {
    var g = gradeOf(score);
    var t = {
      same: '같은 결의 두 사람 — 편한 만큼 서로를 자극하지는 못합니다',
      give: '한 사람이 밀고 한 사람이 커지는 사이',
      take: '한 사람이 채워주고 한 사람이 편해지는 사이',
      control: '정반대라서 자극적이고, 그래서 부딪히는 사이',
      controlled: '한쪽이 눌리고 한쪽이 답답해하는 사이'
    }[elRel];
    return g.label + ' · ' + t;
  }

  /* ── 공유 링크 인코딩 ─────────────────────────────── */
  function b64u(str) {
    var b = g.btoa(unescape(encodeURIComponent(str)));
    return b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function unb64u(s) {
    s = String(s).replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return decodeURIComponent(escape(g.atob(s)));
  }
  function encodeProfile(p) {
    var o = {
      v: 1, n: p.name, h: p.hanja || '', b: p.birth.replace(/-/g, ''),
      a: p.animalKey, e: p.saju.dominant
    };
    if (p.face) o.s = [p.face.samjeong.sang, p.face.samjeong.jung, p.face.samjeong.ha];
    return b64u(JSON.stringify(o));
  }
  function decodeProfile(code) {
    try {
      var o = JSON.parse(unb64u(code));
      if (!o || !o.n || !o.b || o.b.length !== 8) return null;
      var birth = o.b.slice(0, 4) + '-' + o.b.slice(4, 6) + '-' + o.b.slice(6, 8);
      var p = buildProfile({ name: o.n, hanja: o.h || '', birth: birth, face: null });
      if (o.a && D.ANIMALS[o.a]) { p.animalKey = o.a; p.animal = D.ANIMALS[o.a]; p.estimated = false; p.fromLink = true; }
      if (o.s && o.s.length === 3) { p.samjeongGuess = { sang: o.s[0], jung: o.s[1], ha: o.s[2] }; p.fromLink = true; }
      p.linkElement = o.e || p.saju.dominant;
      return p;
    } catch (e) { return null; }
  }

  /* ── 내보내기 ─────────────────────────────────────── */
  Destiny.hash = hash;
  Destiny.picker = picker;
  Destiny.clamp = clamp;
  Destiny.jdn = jdn;
  Destiny.pillar = pillear;
  Destiny.dayPillar = dayPillar;
  Destiny.yearPillar = yearPillar;
  Destiny.monthPillar = monthPillar;
  Destiny.sajuOf = sajuOf;
  Destiny.elemRel = elemRel;
  Destiny.relWord = relWord;
  Destiny.pillarLink = pillarLink;
  Destiny.analyzeName = analyzeName;
  Destiny.analyzeFaceImage = analyzeFaceImage;
  Destiny.ogwanOf = ogwanOf;
  Destiny.estimateAnimal = estimateAnimal;
  Destiny.buildProfile = buildProfile;
  Destiny.todayFate = todayFate;
  Destiny.yearFate = yearFate;
  Destiny.relation = relation;
  Destiny.gradeOf = gradeOf;
  Destiny.encodeProfile = encodeProfile;
  Destiny.decodeProfile = decodeProfile;
  Destiny.ensureHanja = ensureHanja;
  Destiny.hanjaStroke = function (c) { return hanjaStroke(c); };
  Destiny.suriOf = suri;
  Destiny.ogwanText = function (k, lv) { return D.OGWAN[k][lv]; };
  Destiny.samjeongText = function (k, lv) { return D.SAMJEONG[k][lv]; };
  Destiny.ANIMALS = D.ANIMALS;
  Destiny.ELEM = E;
  Destiny.ELEM_ORDER = EO;
  Destiny.SAMJEONG = D.SAMJEONG;
  Destiny.OGWAN = D.OGWAN;
  Destiny.HANJA_MEAN = D.HANJA_MEAN;
  Destiny.SAENG = D.SAENG;
  Destiny.GEUK = D.GEUK;

  g.Destiny = Destiny;
})(window);
