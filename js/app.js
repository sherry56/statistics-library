'use strict';
const $ = selector => document.querySelector(selector);
const categories = {
  '课件': '按章节整理的课堂课件',
  '题库': '章节练习、综合题与错题解析',
  '复习大纲': '考点、讲义与专题总结',
  '教材': '课程教材与配套学习指导'
};
// Current release scope: only courseware and textbooks are open. Keep this
// allow-list in one place so cards, search, recent updates, and actions agree.
const openCategories = new Set(['课件', '教材']);
const isCategoryOpen = category => openCategories.has(category);
const openResources = () => resources.filter(item => isCategoryOpen(item.category));
const isResourceOpen = item => !!item && isCategoryOpen(item.category);
let activeCategory = '';
let activeChapter = '';
let activeResource = null;
let modalTrigger = null;
let readerTrigger = null;
const modal = $('#downloadModal');
const reader = $('#readerDialog');
function showToast(message) {
  $('#toast').textContent = message;
  $('#toast').hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { $('#toast').hidden = true; }, 3500);
}
function fileAvailable(item) {
  if (!isResourceOpen(item)) {
    showToast(`${LibraryCore.label(item?.category || '') || '该分类'}暂未开放，后续会逐步开放。`);
    return false;
  }
  if (item.available !== false) return true;
  showToast('这份教材的登记路径暂不可用，请联系助教更新文件。');
  return false;
}
function syncScrollLock() { document.body.classList.toggle('overflow-hidden', modal.open || reader.open); }
function renderHome() {
  $('#collections').innerHTML = Object.entries(categories).map(([category, description]) => {
    const isOpen = isCategoryOpen(category);
    const count = resources.filter(item => item.category === category).length;
    const content = `<div class="flex items-center justify-between"><span class="flex items-center gap-3"><span>${icon('folder', UI.categoryIcon[category] || 'text-muted')}</span><h3 class="text-base font-medium">${LibraryCore.label(category)}</h3></span>${isOpen ? `<span class="text-xs text-muted">${count} 份</span>` : '<span class="rounded-full bg-soft px-2 py-1 text-[10px] text-muted">暂未开放</span>'}</div>
      <div class="mt-4 flex items-end justify-between gap-3"><p class="text-xs leading-6 text-muted">${description}</p>${isOpen ? '<span class="text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand" aria-hidden="true">→</span>' : '<span class="text-xs text-muted" aria-hidden="true">稍后开放</span>'}</div>`;
    return isOpen
      ? `<a href="#category=${encodeURIComponent(category)}" class="group category-card w-[min(78vw,18rem)] shrink-0 snap-start rounded-card border border-line bg-surface p-5 transition-colors hover:border-brand/40 hover:shadow-hover lg:min-w-0 lg:flex-1 lg:w-auto">${content}</a>`
      : `<div class="category-card w-[min(78vw,18rem)] shrink-0 snap-start rounded-card border border-line bg-soft/60 p-5 opacity-75 lg:min-w-0 lg:flex-1 lg:w-auto" aria-disabled="true" title="${LibraryCore.label(category)}暂未开放">${content}</div>`;
  }).join('');
  const recentItems = LibraryCore.recent(openResources());
  $('#recentList').innerHTML = recentItems.map(item => resourceRow(item, { recent: true })).join('');
  $('#recentList').hidden = !recentItems.length;
  $('#recentEmpty').hidden = !!recentItems.length;
}
function renderGlobal(updateURL = true) {
  const query = $('#globalSearch').value.trim();
  const searching = !!query;
  $('#globalResults').hidden = !searching;
  $('#homeBrowse').hidden = searching;
  const items = searching ? LibraryCore.filter(openResources(), { query }) : [];
  $('#globalGrid').innerHTML = items.map(item => resourceRow(item)).join('');
  $('#globalCount').textContent = `全部分类 · ${items.length} 份`;
  $('#globalGrid').hidden = !items.length;
  $('#globalEmpty').hidden = !!items.length;
  if (updateURL) history.replaceState(null, '', searching ? `#search=${encodeURIComponent(query)}` : '#home');
}
function renderChapters() {
  const chapters = LibraryCore.chapters(openResources(), activeCategory);
  $('#chapterFilters').hidden = !chapters.length;
  $('#chapterFilters').innerHTML = ['', ...chapters].map(chapter => `<button type="button" data-chapter="${chapter}" aria-pressed="${chapter === activeChapter}" class="${UI.pill} ${chapter === activeChapter ? UI.active : UI.inactive}">${chapter || '全部'}</button>`).join('');
}
function renderResources() {
  const items = LibraryCore.filter(openResources(), { category: activeCategory, query: $('#searchInput').value, chapter: activeChapter, sort: $('#sortSelect').value });
  $('#resourceGrid').innerHTML = items.map(item => resourceRow(item)).join('');
  $('#resultCount').textContent = `共 ${items.length} 份`;
  $('#resourceGrid').hidden = !items.length;
  $('#emptyState').hidden = !!items.length;
}
function route() {
  const state = LibraryCore.parseRoute(location.hash, categories);
  const blockedCategory = state.category && !isCategoryOpen(state.category) ? state.category : '';
  activeCategory = blockedCategory ? '' : state.category;
  activeChapter = '';
  $('#homeView').hidden = !!activeCategory;
  $('#categoryDetail').hidden = !activeCategory;
  $('#searchInput').value = '';
  $('#sortSelect').value = 'recommended';
  if (activeCategory) {
    $('#breadcrumbCategory').textContent = LibraryCore.label(activeCategory);
    $('#sectionTitle').textContent = LibraryCore.label(activeCategory);
    $('#sectionDescription').textContent = categories[activeCategory];
    $('#categoryTabs').innerHTML = Object.keys(categories).map(category => isCategoryOpen(category)
      ? `<a href="#category=${encodeURIComponent(category)}" ${category === activeCategory ? 'aria-current="page"' : ''} class="${UI.pill} ${category === activeCategory ? UI.active : UI.inactive}">${LibraryCore.label(category)}</a>`
      : `<span class="${UI.pill} border-line bg-soft text-muted opacity-60" aria-disabled="true" title="${LibraryCore.label(category)}暂未开放">${LibraryCore.label(category)} · 未开放</span>`).join('');
    renderChapters(); renderResources();
  } else {
    $('#globalSearch').value = state.query;
    renderGlobal(false);
    if (blockedCategory) {
      history.replaceState(null, '', '#home');
      showToast(`${LibraryCore.label(blockedCategory)}暂未开放，后续会逐步开放。`);
    }
  }
  document.title = `${activeCategory ? LibraryCore.label(activeCategory) + ' · ' : ''}《统计学》资料库 · Huibara Lab`;
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function focusGlobal() {
  if (activeCategory) { location.hash = 'home'; window.addEventListener('hashchange', () => $('#globalSearch').focus(), { once: true }); }
  else { $('#globalSearch').focus(); $('#globalSearch').select(); }
}
function openModal(index, trigger) {
  activeResource = resources[index];
  if (!activeResource || !fileAvailable(activeResource)) return;
  modalTrigger = trigger;
  $('#selectedFileMark').textContent = activeResource.format;
  $('#selectedFileName').textContent = activeResource.title;
  $('#selectedFileMeta').textContent = LibraryCore.label(activeResource.category);
  $('#studentId').value = '';
  $('#studentName').value = '';
  $('#studentId').removeAttribute('aria-invalid');
  $('#studentName').removeAttribute('aria-invalid');
  $('#fieldMessage').textContent = '学号和姓名需与课程名单一致。';
  $('#fieldMessage').classList.remove('text-file-pdf');
  modal.showModal(); syncScrollLock(); $('#studentId').focus();
}
async function verifyRoster(studentId, studentName) {
  try {
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, studentName })
    });
    if (response.status === 404 && typeof LibraryRoster !== 'undefined') return !!LibraryRoster.match(studentId, studentName);
    if (response.status === 401 || response.status === 400) return false;
    if (!response.ok) return null;
    const result = await response.json();
    return result.ok === true;
  } catch {
    if (typeof LibraryRoster !== 'undefined') return !!LibraryRoster.match(studentId, studentName);
    return null;
  }
}
modal.addEventListener('close', () => { syncScrollLock(); modalTrigger?.focus(); });
$('#modalClose').addEventListener('click', () => modal.close());
$('#cancelButton').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => {
  const box = modal.getBoundingClientRect();
  if (event.target === modal && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) modal.close();
});
$('#verifyForm').addEventListener('submit', async event => {
  event.preventDefault();
  const studentId = $('#studentId').value.trim();
  const studentName = $('#studentName').value.trim();
  $('#studentId').removeAttribute('aria-invalid');
  $('#studentName').removeAttribute('aria-invalid');
  if (!/^\d{8}$/.test(studentId)) {
    $('#fieldMessage').textContent = '请输入 8 位数字学号。';
    $('#fieldMessage').classList.add('text-file-pdf');
    $('#studentId').setAttribute('aria-invalid', 'true'); $('#studentId').focus(); return;
  }
  if (!studentName) {
    $('#fieldMessage').textContent = '请输入名单中的姓名。';
    $('#fieldMessage').classList.add('text-file-pdf');
    $('#studentName').setAttribute('aria-invalid', 'true'); $('#studentName').focus(); return;
  }
  const rosterMatch = await verifyRoster(studentId, studentName);
  if (rosterMatch === null) {
    $('#fieldMessage').textContent = '验证服务暂不可用，请稍后再试。';
    $('#fieldMessage').classList.add('text-file-pdf');
    return;
  }
  if (!rosterMatch) {
    $('#fieldMessage').textContent = '学号或姓名不匹配，请核对后重试。';
    $('#fieldMessage').classList.add('text-file-pdf');
    $('#studentId').setAttribute('aria-invalid', 'true'); $('#studentName').setAttribute('aria-invalid', 'true'); $('#studentId').focus(); return;
  }
  // Static prototype: a production deployment should move this match to a server.
  const link = document.createElement('a');
  link.href = encodeURI(activeResource.path); link.download = '';
  document.body.append(link); link.click(); link.remove();
  modal.close(); showToast(`名单匹配成功，已发起下载：${activeResource.title}`);
});
document.addEventListener('click', event => {
  const read = event.target.closest('[data-read]');
  if (read) { const index = Number(read.dataset.read); if (fileAvailable(resources[index])) { readerTrigger = read; LibraryReader.open(resources[index]); syncScrollLock(); } return; }
  const download = event.target.closest('[data-download]');
  if (download) { openModal(Number(download.dataset.download), download); return; }
  const keyword = event.target.closest('[data-keyword]');
  if (keyword) { $('#globalSearch').value = keyword.dataset.keyword; renderGlobal(); $('#globalSearch').focus(); }
  const chapter = event.target.closest('[data-chapter]');
  if (chapter) { activeChapter = chapter.dataset.chapter; renderChapters(); renderResources(); $('#chapterFilters').querySelector(`[data-chapter="${activeChapter}"]`).focus(); }
});
$('#readerDownload').addEventListener('click', () => {
  const item = LibraryReader.current(); reader.close(); openModal(resources.indexOf(item), readerTrigger);
});
reader.addEventListener('close', () => { syncScrollLock(); if (!modal.open) readerTrigger?.focus(); });
$('#globalSearch').addEventListener('input', () => renderGlobal());
$('#clearGlobal').addEventListener('click', () => { $('#globalSearch').value = ''; renderGlobal(); $('#globalSearch').focus(); });
$('#openGlobalSearch').addEventListener('click', focusGlobal);
$('#searchInput').addEventListener('input', renderResources);
$('#sortSelect').addEventListener('change', renderResources);
$('#resetFilters').addEventListener('click', () => { activeChapter = ''; $('#searchInput').value = ''; renderChapters(); renderResources(); $('#searchInput').focus(); });
document.addEventListener('keydown', event => {
  if (modal.open || reader.open || event.isComposing) return;
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); focusGlobal(); return; }
  if (event.key === '/' && !event.target.closest('input,textarea,select,[contenteditable="true"]')) {
    event.preventDefault(); (activeCategory ? $('#searchInput') : $('#globalSearch')).focus();
  }
});
window.addEventListener('hashchange', route);
renderHome(); route();
