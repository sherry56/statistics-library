// Complete utility strings keep Tailwind's static scanner reliable (no bg-${color}).
const UI = {
  button: 'inline-flex min-h-10 items-center justify-center gap-2 rounded-control px-4 py-2 text-xs font-medium transition-colors disabled:opacity-40',
  primary: 'border border-brand bg-brand text-white hover:bg-brand-hover',
  secondary: 'border border-line bg-surface text-ink hover:bg-soft',
  ghost: 'text-muted hover:bg-soft hover:text-ink',
  pill: 'shrink-0 rounded-full border px-3 py-2 text-xs transition-colors',
  active: 'border-brand bg-brand-soft text-brand',
  inactive: 'border-line bg-surface text-muted hover:bg-soft hover:text-ink',
  format: {
    PDF: 'bg-terracotta-soft text-terracotta',
    PPTX: 'bg-ochre-soft text-ochre',
    XLSX: 'bg-slate-blue-soft text-slate-blue',
    EPUB: 'bg-slate-blue-soft text-slate-blue',
    PNG: 'bg-ochre-soft text-ochre',
    HTML: 'bg-brand-soft text-brand'
  },
  categoryIcon: {
    '课件': 'text-slate-blue',
    '题库': 'text-terracotta',
    '复习大纲': 'text-ochre',
    '教材': 'text-brand'
  }
};
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const icon = (name, color = 'text-current') => `<svg class="size-4 shrink-0 ${color}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${{
  folder: '<path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M3 9h18"/>',
  read: '<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
  download: '<path d="M12 3v12m-4-4 4 4 4-4M5 20h14"/>'
}[name]}</svg>`;
function resourceRow(item, { recent = false } = {}) {
  const index = resources.indexOf(item);
  const date = new Date(item.updatedAt);
  const dateLabel = recent ? date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', timeZone: 'Asia/Shanghai' }).replace('/', '-') : '';
  return `<article class="resource-row grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-line p-4 last:border-b-0 hover:bg-canvas sm:p-5 md:grid-cols-[3rem_minmax(0,1fr)_auto]">
    ${recent ? `<time class="self-start pt-1 text-xs tabular-nums text-muted" datetime="${escapeHTML(item.updatedAt)}" title="${escapeHTML(date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }))}">${dateLabel}</time>` : `<span class="flex h-10 items-center justify-center rounded-control text-[10px] font-semibold ${UI.format[item.format] || 'bg-soft text-muted'}">${escapeHTML(item.format)}</span>`}
    <div class="min-w-0"><div class="flex flex-wrap items-center gap-2"><h3 class="break-words text-sm font-medium leading-6">${escapeHTML(item.title)}</h3>${item.hot && !recent ? '<span class="rounded-full border border-ochre/30 bg-ochre-soft px-2 text-[10px] font-normal leading-5 text-ochre">推荐</span>' : ''}</div>
    <p class="mt-1 text-xs leading-5 text-muted">${escapeHTML([recent ? item.format : '', LibraryCore.label(item.category), ...item.tags.filter(tag => tag !== '考试重点')].filter(Boolean).join(' · '))}</p></div>
    <div class="col-start-2 flex flex-wrap gap-2 md:col-start-auto"><button class="${UI.button} ${UI.secondary}" data-read="${index}" aria-label="在线阅读：${escapeHTML(item.title)}">${icon('read')}在线阅读</button><button class="${UI.button} ${UI.ghost}" data-download="${index}" aria-label="下载：${escapeHTML(item.title)}">${icon('download')}下载</button></div>
  </article>`;
}
