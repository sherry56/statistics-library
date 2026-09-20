const rosterEntries = [
  ['00000001', '示例甲', 'TEST-01'],
  ['00000002', '示例乙', 'TEST-01'],
  ['00000003', 'Example Student', 'TEST-02']
];
const normalizeId = value => String(value ?? '').replace(/\s+/g, '');
const normalizeName = value => String(value ?? '').trim().replace(/\s+/g, ' ').toLocaleUpperCase();
const byId = new Map(rosterEntries.map(([studentId, name, section]) => [studentId, { studentId, name, section }]));
const LibraryRoster = {
  size: rosterEntries.length,
  entries: rosterEntries.map(([studentId, name, section]) => ({ studentId, name, section })),
  match(studentId, name) {
    const entry = byId.get(normalizeId(studentId));
    return entry && normalizeName(entry.name) === normalizeName(name) ? entry : null;
  }
};
