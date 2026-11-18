/* Merge PDFs locally with pdf-lib. Nothing leaves the browser. */
(function () {
  var I = JSON.parse(document.getElementById('i18n').textContent);
  var $ = function (id) { return document.getElementById(id); };
  var drop = $('drop'), input = $('file'), list = $('list'), totalEl = $('total');
  var mergeBtn = $('merge'), clearBtn = $('clear'), status = $('status'), out = $('out');
  var items = [];
  var busy = false;

  function bytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(0) + ' KB';
    return (n / 1048576).toFixed(1) + ' MB';
  }
  function unit(arr, n) { return n === 1 ? arr[0] : arr[1]; }
  function count(n, u) { return I.countFmt.replace('{n}', n).replace('{u}', u); }
  function render() {
    list.innerHTML = '';
    items.forEach(function (it, i) {
      var li = document.createElement('li');
      var nm = document.createElement('div');
      nm.className = 'fname';
      nm.textContent = it.name;
      var meta = document.createElement('div');
      meta.className = 'fmeta';
      meta.textContent = it.pages != null ? count(it.pages, unit(I.pagesUnit, it.pages)) : bytes(it.size);
      li.appendChild(nm); li.appendChild(meta);

      var up = document.createElement('button');
      up.className = 'iconbtn'; up.type = 'button'; up.textContent = '↑';
      up.title = I.up; up.setAttribute('aria-label', I.up);
      up.disabled = i === 0;
      up.addEventListener('click', function () { move(i, -1); });

      var down = document.createElement('button');
      down.className = 'iconbtn'; down.type = 'button'; down.textContent = '↓';
      down.title = I.down; down.setAttribute('aria-label', I.down);
      down.disabled = i === items.length - 1;
      down.addEventListener('click', function () { move(i, 1); });

      var rm = document.createElement('button');
      rm.className = 'iconbtn'; rm.type = 'button'; rm.textContent = '✕';
      rm.title = I.remove; rm.setAttribute('aria-label', I.remove);
      rm.addEventListener('click', function () { items.splice(i, 1); render(); });

      li.appendChild(up); li.appendChild(down); li.appendChild(rm);
      list.appendChild(li);
    });
    var pages = items.reduce(function (s, it) { return s + (it.pages || 0); }, 0);
    totalEl.textContent = items.length
      ? I.total.replace('{f}', count(items.length, unit(I.filesUnit, items.length)))
              .replace('{p}', count(pages, unit(I.pagesUnit, pages)))
      : I.empty;
    mergeBtn.disabled = items.length < 1 || busy;
    clearBtn.disabled = items.length === 0 || busy;
  }
  function move(i, dir) {
    var j = i + dir;
    if (j < 0 || j >= items.length) return;
    var t = items[i]; items[i] = items[j]; items[j] = t;
    render();
  }

  async function addFiles(fileList) {
    var added = 0;
    for (var i = 0; i < fileList.length; i++) {
      var f = fileList[i];
      if (!f) continue;
      var isPdf = f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
      if (!isPdf) { status.textContent = I.errType; continue; }
      try {
        var buf = new Uint8Array(await f.arrayBuffer());
        var doc = await PDFLib.PDFDocument.load(buf, { ignoreEncryption: false });
        items.push({ name: f.name, size: f.size, bytes: buf, pages: doc.getPageCount() });
        added++;
      } catch (e) {
        status.textContent = I.errLoad.replace('{n}', f.name);
      }
    }
    if (added) status.textContent = '';
    render();
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

  mergeBtn.addEventListener('click', async function () {
    if (!items.length || busy) return;
    if (typeof PDFLib === 'undefined') { status.textContent = I.errLib; return; }
    busy = true; mergeBtn.disabled = true;
    status.textContent = I.merging;
    try {
      var merged = await PDFLib.PDFDocument.create();
      for (var i = 0; i < items.length; i++) {
        var src = await PDFLib.PDFDocument.load(items[i].bytes, { ignoreEncryption: true });
        var pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach(function (p) { merged.addPage(p); });
      }
      var data = await merged.save();
      var blob = new Blob([data], { type: 'application/pdf' });
      var url = URL.createObjectURL(blob);
      out.innerHTML = '';
      var a = document.createElement('a');
      a.className = 'btn';
      a.href = url;
      a.download = I.filename || 'merged.pdf';
      a.textContent = I.download;
      out.appendChild(a);
      var p = document.createElement('p');
      p.className = 'muted';
      p.textContent = I.done.replace('{n}', merged.getPageCount()).replace('{s}', bytes(blob.size));
      out.appendChild(p);
      status.textContent = '';
    } catch (e) {
      status.textContent = I.errMerge;
    }
    busy = false;
    mergeBtn.disabled = items.length < 1;
    clearBtn.disabled = items.length === 0;
  });

  clearBtn.addEventListener('click', function () {
    items = [];
    out.innerHTML = '';
    status.textContent = '';
    render();
  });

  render();
})();
