// Independent reader lifecycle: changing catalog/search UI does not reset a reader.
const LibraryReader = (() => {
  const dialog = document.querySelector('#readerDialog');
  const body = document.querySelector('#readerBody');
  let currentItem = null;
  let movePage = null;
  let disposePdf = null;

  function fileName(item) {
    const raw = item.path.split('/').pop() || '';
    try { return decodeURIComponent(raw); } catch { return raw; }
  }

  function previewItem(item) {
    if (item.format !== 'PPTX') return item;
    return {
      ...item,
      format: 'PDF',
      path: `resources/previews/pptx/${fileName(item).replace(/\.pptx$/i, '.pdf')}`
    };
  }

  function open(item) {
    disposePdf?.(); disposePdf = null;
    currentItem = item; movePage = null; body.replaceChildren();
    const isPptx = item.format === 'PPTX';
    const source = previewItem(item);
    const original = document.querySelector('#readerOriginal');
    const browserReadable = ['PDF', 'HTML', 'PNG'].includes(source.format);

    document.querySelector('#readerTitle').textContent = item.title;
    document.querySelector('#readerLabel').textContent = isPptx ? 'PPTX · PDF 预览' : `${item.format} ${item.format === 'PDF' ? '在线阅读' : '阅读'}`;
    original.hidden = !browserReadable;
    original.textContent = isPptx ? '单独打开 PDF' : '单独打开';
    original.href = encodeURI(source.path);

    if ((isPptx || item.format === 'PDF') && location.protocol !== 'file:') {
      document.querySelector('#readerNote').textContent = isPptx ? '原版 PDF · 支持翻页与缩放，下载保留原始 PPTX' : '原版 PDF · 支持翻页与缩放';
      dialog.showModal();
      disposePdf = PdfReader.mount(body, source);
      return;
    }

    document.querySelector('#readerNote').textContent = browserReadable ? '原文件阅读' : '阅读副本 · 下载可获取原文件';
    const frame = document.createElement('iframe');
    frame.title = `${item.title} 在线阅读`;
    frame.src = encodeURI(browserReadable ? source.path : `resources/readers/${fileName(item)}.html`);
    body.append(frame);
    dialog.showModal();
  }

  dialog.addEventListener('keydown', event => {
    if (!movePage || event.target.matches('input,textarea,select') || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      movePage(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });

  dialog.addEventListener('close', () => {
    disposePdf?.(); disposePdf = null;
    dialog.classList.remove('reader-expanded');
    movePage = null;
    if (document.fullscreenElement && dialog.contains(document.fullscreenElement)) document.exitFullscreen().catch(() => {});
    body.replaceChildren();
  });

  document.querySelector('#readerClose').addEventListener('click', () => dialog.close());
  return { open, current: () => currentItem };
})();
