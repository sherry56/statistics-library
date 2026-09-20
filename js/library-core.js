(function (root) {
  'use strict';
  const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase().trim();
  const label = category => category === '复习大纲' ? '复习资料' : category;
  function filter(items, { category = '', query = '', chapter = '', sort = 'recommended' } = {}) {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const result = items.filter(item => {
      const text = normalize([item.title, item.category, label(item.category), item.format, item.desc, ...item.tags].join(' '));
      return (!category || item.category === category) && (!chapter || item.tags.includes(chapter)) && terms.every(term => text.includes(term));
    });
    if (sort === 'name') result.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
    if (sort === 'type') result.sort((a, b) => a.format.localeCompare(b.format) || a.title.localeCompare(b.title, 'zh-CN'));
    if (sort === 'updated') result.sort((a, b) => timestamp(b) - timestamp(a));
    return result;
  }
  function timestamp(item) { return Number.isFinite(Date.parse(item.updatedAt)) ? Date.parse(item.updatedAt) : 0; }
  function recent(items, limit = 5) { return items.filter(item => timestamp(item) > 0).sort((a, b) => timestamp(b) - timestamp(a)).slice(0, limit); }
  function chapters(items, category) {
    if (!['课件', '题库'].includes(category)) return [];
    return [...new Set(items.filter(item => item.category === category).flatMap(item => item.tags).filter(tag => /^第\d+章$/.test(tag)))].sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
  }
  function parseRoute(hash, categories) {
    try {
      if (hash.startsWith('#category=')) {
        const category = decodeURIComponent(hash.slice(10));
        if (Object.hasOwn(categories, category)) return { category, query: '' };
      }
      if (hash.startsWith('#search=')) return { category: '', query: decodeURIComponent(hash.slice(8)) };
    } catch { /* Broken shared hashes fall back to the usable home page. */ }
    return { category: '', query: '' };
  }
  const validName = value => value.trim().length >= 2 && !/\d/.test(value);
  const api = { filter, recent, chapters, parseRoute, label, validName, timestamp };
  if (typeof module !== 'undefined') module.exports = api;
  else root.LibraryCore = api;
})(globalThis);
