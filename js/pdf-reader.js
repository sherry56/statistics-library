// PDF.js is lazy-loaded only when a PDF is opened over HTTP.
const PdfReader = (() => {
  function mount(body, item) {
    let task, pdf, renderTask, observer, disposed = false, page = 1, zoom = 1, revision = 0;
    const vendor = new URL('assets/vendor/pdfjs/', location.href).href;
    body.innerHTML = `<div class="pptx-viewer"><div class="pdf-stage" tabindex="0" aria-label="PDF 页面"><canvas aria-label="${escapeHTML(item.title)}原版页面"></canvas><p class="pdf-status" role="status">正在加载 PDF…</p><p class="sr-only" data-pdf-text></p></div><nav class="pptx-controls" aria-label="PDF 阅读工具"><button class="viewer-btn" data-pdf-prev aria-label="上一页" disabled>←</button><label class="pptx-page">第 <input aria-label="当前页码" type="number" min="1" step="1" value="1" disabled /> <span data-pdf-total> / — 页</span></label><button class="viewer-btn" data-pdf-next aria-label="下一页" disabled>→</button><button class="viewer-btn" data-pdf-out aria-label="缩小">−</button><button class="viewer-btn" data-pdf-fit aria-label="适合窗口">适合</button><button class="viewer-btn" data-pdf-in aria-label="放大">＋</button></nav></div>`;
    const stage = body.querySelector('.pdf-stage'), canvas = body.querySelector('canvas'), status = body.querySelector('.pdf-status'), input = body.querySelector('input');
    const prev = body.querySelector('[data-pdf-prev]'), next = body.querySelector('[data-pdf-next]');
    async function render() {
      if (!pdf || disposed) return;
      const version = ++revision;
      const priorRender = renderTask; priorRender?.cancel();
      if (priorRender) { try { await priorRender.promise; } catch {} }
      try {
        const sheet = await pdf.getPage(page);
        if (disposed || version !== revision) return;
        const base = sheet.getViewport({scale:1});
        const fit = Math.min(Math.max(stage.clientWidth - 32, 100)/base.width, Math.max(stage.clientHeight - 32,100)/base.height);
        const viewport = sheet.getViewport({scale:fit * zoom});
        const density = Math.min(devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * density); canvas.height = Math.floor(viewport.height * density);
        canvas.style.width = `${viewport.width}px`; canvas.style.height = `${viewport.height}px`;
        canvas.setAttribute('aria-label', `${item.title} 第 ${page} 页`);
        input.value = page; input.max = pdf.numPages; input.disabled = false;
        prev.disabled = page <= 1; next.disabled = page >= pdf.numPages;
        body.querySelector('[data-pdf-total]').textContent = `/ ${pdf.numPages} 页`;
        status.hidden = true;
        renderTask = sheet.render({canvasContext:canvas.getContext('2d'), viewport, transform:[density,0,0,density,0,0]});
        await renderTask.promise;
        if (disposed || version !== revision) return;
        const text = await sheet.getTextContent();
        if (!disposed && version === revision) body.querySelector('[data-pdf-text]').textContent = text.items.map(part=>part.str).join(' ');
      } catch (error) {
        if (disposed || version !== revision || error.name === 'RenderingCancelledException') return;
        status.hidden = false; status.textContent = '这一页未能加载，可以使用“单独打开”查看原文件。';
      }
    }
    const setPage = value => { if (pdf) { page = Math.min(pdf.numPages,Math.max(1,Math.trunc(Number(value))||1)); render(); } };
    const scale = delta => { zoom = Math.min(3,Math.max(.6,zoom+delta)); render(); };
    prev.addEventListener('click',()=>setPage(page-1)); next.addEventListener('click',()=>setPage(page+1));
    input.addEventListener('change',()=>setPage(input.value));
    input.addEventListener('keydown',event=>{ if(event.key==='Enter') {setPage(input.value);stage.focus();} });
    body.querySelector('[data-pdf-in]').addEventListener('click',()=>scale(.2));
    body.querySelector('[data-pdf-out]').addEventListener('click',()=>scale(-.2));
    body.querySelector('[data-pdf-fit]').addEventListener('click',()=>{zoom=1;render();});
    stage.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();setPage(page+(event.key==='ArrowLeft'?-1:1));}});
    (async()=>{
      try {
        const lib = await import(`${vendor}pdf.mjs`);
        if(disposed)return;
        lib.GlobalWorkerOptions.workerSrc = `${vendor}pdf.worker.mjs`;
        task = lib.getDocument({url:encodeURI(item.path),cMapUrl:`${vendor}cmaps/`,cMapPacked:true,standardFontDataUrl:`${vendor}standard_fonts/`,wasmUrl:`${vendor}wasm/`});
        pdf = await task.promise;
        if(disposed)return;
        await render();
        observer = new ResizeObserver(()=>render()); observer.observe(stage);
      } catch { if(!disposed){status.hidden=false;status.textContent='PDF 暂时无法加载，请使用“单独打开”查看原文件。';} }
    })();
    return () => {disposed=true; revision++; observer?.disconnect(); renderTask?.cancel(); task?.destroy().catch(()=>{});};
  }
  return {mount};
})();
