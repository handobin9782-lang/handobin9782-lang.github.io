/* Image compressor & converter — 100% client side, no upload. */
(function () {
  var I = JSON.parse(document.getElementById('i18n').textContent);
  var drop = document.getElementById('drop');
  var input = document.getElementById('file');
  var fmtSel = document.getElementById('format');
  var quality = document.getElementById('quality');
  var qualityVal = document.getElementById('qualityVal');
  var maxW = document.getElementById('maxw');
  var results = document.getElementById('results');
  var summary = document.getElementById('summary');
  var btnAll = document.getElementById('dlAll');
  var btnClear = document.getElementById('clear');
  var status = document.getElementById('status');
  var files = [];
  var outputs = [];
  var runId = 0;
  var runTimer = null;

  function bytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(n < 10240 ? 1 : 0) + ' KB';
    return (n / 1048576).toFixed(2) + ' MB';
  }
  function extOf(mime) {
    return mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
  }
  function baseName(name) {
    var i = name.lastIndexOf('.');
    return i > 0 ? name.slice(0, i) : name;
  }
  function toBlob(canvas, mime, q) {
    return new Promise(function (res, rej) {
      canvas.toBlob(function (b) { b ? res(b) : rej(new Error('encode')); }, mime, q);
    });
  }
  function loadImage(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { res({ img: img, url: url }); };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error('decode')); };
      img.src = url;
    });
  }

  function resetView() {
    outputs.forEach(function (o) {
      if (o.outUrl) URL.revokeObjectURL(o.outUrl);
      if (o.thumbUrl) URL.revokeObjectURL(o.thumbUrl);
    });
    outputs = [];
    results.replaceChildren();
    summary.textContent = '';
    status.textContent = '';
    btnAll.disabled = true;
  }

  async function compressOne(file) {
    var loaded = await loadImage(file);
    var img = loaded.img;
    var ow = img.naturalWidth || img.width;
    var oh = img.naturalHeight || img.height;
    var limit = parseInt(maxW.value, 10);
    var scale = 1;
    if (limit > 0 && ow > limit) scale = limit / ow;
    var nw = Math.max(1, Math.round(ow * scale));
    var nh = Math.max(1, Math.round(oh * scale));
    var canvas = document.createElement('canvas');
    canvas.width = nw; canvas.height = nh;
    var ctx = canvas.getContext('2d');
    var chosen = fmtSel.value;
    var mime = chosen === 'keep' ? (file.type || 'image/jpeg') : chosen;
    if (mime === 'image/jpeg' || mime === 'image/jpg') {
      mime = 'image/jpeg';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, nw, nh);
    }
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, nw, nh);
    var q = mime === 'image/png' ? undefined : parseFloat(quality.value);
    var blob = await toBlob(canvas, mime, q);
    URL.revokeObjectURL(loaded.url);
    return { file: file, blob: blob, mime: mime, ow: ow, oh: oh, nw: nw, nh: nh };
  }

  function buildItem(o, sink) {
    var li = document.createElement('div');
    li.className = 'result';
    var img = document.createElement('img');
    var thumbUrl = URL.createObjectURL(o.blob);
    img.src = thumbUrl;
    img.alt = '';
    img.loading = 'lazy';

    var info = document.createElement('div');
    info.className = 'info';
    var nm = document.createElement('div');
    nm.className = 'nm';
    nm.textContent = baseName(o.file.name) + '.' + extOf(o.mime);
    var meta = document.createElement('div');
    meta.className = 'meta';
    var pct = o.file.size > 0 ? Math.round((1 - o.blob.size / o.file.size) * 100) : 0;
    var dims = ' · ' + o.nw + '×' + o.nh;
    meta.textContent = bytes(o.file.size) + ' → ' + bytes(o.blob.size) + dims;
    info.appendChild(nm);
    info.appendChild(meta);

    var save = document.createElement('div');
    save.className = pct >= 0 ? 'save' : 'fail';
    save.textContent = pct >= 0 ? pct + '% ' + I.smaller : Math.abs(pct) + '% ' + I.larger;

    var a = document.createElement('a');
    a.className = 'btn sm ghost';
    a.textContent = I.download;
    var outUrl = URL.createObjectURL(o.blob);
    a.href = outUrl;
    a.download = baseName(o.file.name) + '.' + extOf(o.mime);

    li.appendChild(img);
    li.appendChild(info);
    li.appendChild(save);
    li.appendChild(a);
    sink.push({ outUrl: outUrl, thumbUrl: thumbUrl, name: a.download });
    return li;
  }

  function buildFail(file) {
    var li = document.createElement('div');
    li.className = 'result fail';
    li.textContent = file.name + ' — ' + I.failed;
    return li;
  }

  async function run() {
    if (!files.length) return;
    var my = ++runId;
    resetView();
    status.textContent = I.processing + ' (0/' + files.length + ')';
    var nodes = [], sink = [], before = 0, after = 0, done = 0;

    for (var i = 0; i < files.length; i++) {
      try {
        var o = await compressOne(files[i]);
        if (my !== runId) { sink.forEach(revoke); return; }
        nodes.push(buildItem(o, sink));
        before += o.file.size;
        after += o.blob.size;
      } catch (e) {
        nodes.push(buildFail(files[i]));
      }
      done++;
      if (my !== runId) { sink.forEach(revoke); return; }
      status.textContent = I.processing + ' (' + done + '/' + files.length + ')';
    }

    if (my !== runId) { sink.forEach(revoke); return; }
    results.replaceChildren.apply(results, nodes);
    outputs = sink;
    status.textContent = '';
    if (before > 0) {
      var saved = Math.round((1 - after / before) * 100);
      summary.textContent = I.total + ': ' + bytes(before) + ' → ' + bytes(after) + ' (' +
        (saved >= 0 ? saved + '% ' + I.smaller : Math.abs(saved) + '% ' + I.larger) + ')';
    }
    btnAll.disabled = outputs.length === 0;
  }

  function revoke(o) {
    if (o.outUrl) URL.revokeObjectURL(o.outUrl);
    if (o.thumbUrl) URL.revokeObjectURL(o.thumbUrl);
  }

  function schedule() {
    clearTimeout(runTimer);
    runTimer = setTimeout(run, 150);
  }

  function addFiles(list) {
    var added = 0;
    for (var i = 0; i < list.length; i++) {
      var f = list[i];
      if (!f || (f.type && f.type.indexOf('image/') !== 0)) continue;
      files.push(f);
      added++;
    }
    if (added) schedule();
  }

  drop.addEventListener('click', function () { input.click(); });
  drop.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
  });
  input.addEventListener('change', function () { addFiles(input.files); input.value = ''; });
  ['dragenter', 'dragover'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); });
  });
  drop.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
  });
  [fmtSel, quality, maxW].forEach(function (el) {
    ['input', 'change'].forEach(function (ev) {
      el.addEventListener(ev, function () { if (files.length) schedule(); });
    });
  });
  quality.addEventListener('input', function () { qualityVal.textContent = Math.round(quality.value * 100) + '%'; });
  qualityVal.textContent = Math.round(quality.value * 100) + '%';
  btnAll.addEventListener('click', function () {
    outputs.forEach(function (o, idx) {
      setTimeout(function () {
        var a = document.createElement('a');
        a.href = o.outUrl; a.download = o.name;
        document.body.appendChild(a); a.click(); a.remove();
      }, idx * 250);
    });
  });
  btnClear.addEventListener('click', function () {
    files = [];
    runId++;
    resetView();
  });
})();
