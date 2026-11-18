/* Compound growth with optional dividend reinvestment (DRIP). */
(function () {
  var I = JSON.parse(document.getElementById('i18n').textContent);
  var $ = function (id) { return document.getElementById(id); };
  var initialEl = $('initial'), monthlyEl = $('monthly'), yearsEl = $('years');
  var retEl = $('ret'), yldEl = $('yld'), dripEl = $('drip'), curEl = $('currency');
  var tbody = $('tblBody'), table = $('tableBlock'), chart = $('chart');

  // currency options
  I.currencies.forEach(function (c) {
    var o = document.createElement('option');
    o.value = c.v; o.textContent = c.label;
    if (c.v === I.currency) o.selected = true;
    curEl.appendChild(o);
  });

  function num(el, def) {
    var v = parseFloat(el.value);
    return isFinite(v) ? v : def;
  }
  function money(v) {
    try {
      return new Intl.NumberFormat(I.locale, {
        style: 'currency', currency: curEl.value, maximumFractionDigits: 0
      }).format(v);
    } catch (e) {
      return Math.round(v).toLocaleString(I.locale);
    }
  }
  function plain(v) { return new Intl.NumberFormat(I.locale, { maximumFractionDigits: 0 }).format(v); }

  function calc() {
    var initial = Math.max(0, num(initialEl, 0));
    var monthly = Math.max(0, num(monthlyEl, 0));
    var years = Math.min(60, Math.max(1, Math.round(num(yearsEl, 20))));
    var r = Math.max(-0.9, Math.min(1.5, num(retEl, 7) / 100));
    var d = Math.max(0, Math.min(1, num(yldEl, 2) / 100));
    var drip = dripEl.checked;
    var rm = Math.pow(1 + r, 1 / 12) - 1;
    var dm = Math.pow(1 + d, 1 / 12) - 1;

    var bal = initial, cash = 0, invested = initial, cumDiv = 0;
    var rows = [];
    for (var y = 1; y <= years; y++) {
      var yearDiv = 0;
      for (var m = 0; m < 12; m++) {
        bal *= 1 + rm;
        var div = bal * dm;
        yearDiv += div;
        if (drip) bal += div; else cash += div;
        bal += monthly;
        invested += monthly;
      }
      cumDiv += yearDiv;
      rows.push({ y: y, invested: invested, divYear: yearDiv, cumDiv: cumDiv, bal: bal, cash: cash });
    }

    var last = rows[rows.length - 1];
    var finalBalance = last.bal;
    var wealth = finalBalance + last.cash;
    var gain = wealth - invested;
    var pct = invested > 0 ? (gain / invested) * 100 : 0;

    $('oFinal').textContent = money(finalBalance);
    $('oInvested').textContent = money(invested);
    $('oDividends').textContent = money(cumDiv);
    $('oReturn').textContent = (pct >= 0 ? '+' : '') + pct.toFixed(0) + '%';
    $('oWealth').textContent = money(wealth);
    $('oGain').textContent = money(gain);
    $('cashCard').style.display = drip ? 'none' : '';
    $('oCash').textContent = money(last.cash);
    $('wealthCard').style.display = drip ? 'none' : '';

    // table
    var html = '';
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      html += '<tr><td>' + row.y + '</td><td>' + plain(row.invested) + '</td><td>' + plain(Math.round(row.divYear)) +
        '</td><td>' + plain(Math.round(row.cumDiv)) + '</td><td>' + plain(Math.round(row.cash)) +
        '</td><td><b>' + plain(Math.round(row.bal)) + '</b></td></tr>';
    }
    tbody.innerHTML = html;
    table.style.display = '';

    draw(rows, initial);
  }

  function draw(rows, initial) {
    var dpr = window.devicePixelRatio || 1;
    var w = chart.clientWidth || 640, h = 260;
    chart.width = w * dpr; chart.height = h * dpr;
    chart.style.height = h + 'px';
    var ctx = chart.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var padL = 6, padR = 6, padT = 14, padB = 22;
    var maxV = 0;
    rows.forEach(function (r) { maxV = Math.max(maxV, r.bal, r.invested); });
    maxV = maxV * 1.05 || 1;
    var iw = w - padL - padR, ih = h - padT - padB;
    function X(i) { return padL + (rows.length === 1 ? iw / 2 : (i * iw) / (rows.length - 1)); }
    function Y(v) { return padT + ih - (v / maxV) * ih; }

    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    for (var g = 0; g <= 4; g++) {
      var yy = padT + (ih * g) / 4;
      ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(w - padR, yy); ctx.stroke();
    }
    // balance area
    var grad = ctx.createLinearGradient(0, padT, 0, padT + ih);
    grad.addColorStop(0, 'rgba(56,211,153,0.30)');
    grad.addColorStop(1, 'rgba(56,211,153,0.02)');
    ctx.beginPath();
    ctx.moveTo(X(0), Y(rows[0].bal));
    rows.forEach(function (r, i) { ctx.lineTo(X(i), Y(r.bal)); });
    ctx.lineTo(X(rows.length - 1), padT + ih);
    ctx.lineTo(X(0), padT + ih);
    ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

    // balance line
    ctx.beginPath();
    rows.forEach(function (r, i) { i ? ctx.lineTo(X(i), Y(r.bal)) : ctx.moveTo(X(i), Y(r.bal)); });
    ctx.strokeStyle = '#38d399'; ctx.lineWidth = 2.2; ctx.lineJoin = 'round'; ctx.stroke();

    // invested line
    ctx.beginPath();
    rows.forEach(function (r, i) { i ? ctx.lineTo(X(i), Y(r.invested)) : ctx.moveTo(X(i), Y(r.invested)); });
    ctx.strokeStyle = 'rgba(147,161,198,0.85)'; ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);

    // x labels
    ctx.fillStyle = 'rgba(147,161,198,0.9)';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    var step = Math.max(1, Math.ceil(rows.length / 8));
    rows.forEach(function (r, i) {
      if (i % step === 0 || i === rows.length - 1) ctx.fillText(String(r.y), X(i), h - 6);
    });
  }

  [initialEl, monthlyEl, yearsEl, retEl, yldEl].forEach(function (el) {
    el.addEventListener('input', calc);
    el.addEventListener('change', calc);
  });
  dripEl.addEventListener('change', calc);
  curEl.addEventListener('change', calc);
  window.addEventListener('resize', function () { calc(); });
  calc();
})();
