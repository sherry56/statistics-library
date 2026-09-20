const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const core = require('../js/library-core');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(JSON.stringify(vm.runInNewContext(fs.readFileSync(path.join(root, 'js/resources.js'), 'utf8') + ';resources')));
const localRosterPath = path.join(root, 'resources/roster.js');
const rosterPath = fs.existsSync(localRosterPath) ? localRosterPath : path.join(root, 'tests/fixtures/roster.sample.js');
const roster = vm.runInNewContext(fs.readFileSync(rosterPath, 'utf8') + ';LibraryRoster');
test('Catalog categories and total', () => {
  assert.equal(data.length, 33);
  assert.deepEqual(['课件','题库','复习大纲','教材'].map(category => core.filter(data,{category}).length), [9,12,10,2]);
  assert.equal(core.filter(data,{category:'课程安排'}).length, 0);
  assert.deepEqual(data.filter(item => item.category === '课件').map(item => item.title), ['第一章总论','第二章统计数据搜集','第三章数据特征','第四章时间序列分析','第五章统计指数','第六章统计量与抽样分布','第七章参数估计','第八章假设检验','第九章相关与回归分析']);
});
test('Global search covers every field and supports multiple terms', () => {
  assert.equal(core.filter(data,{query:'pptx'}).length, 9);
  assert.equal(core.filter(data,{query:'教材'}).length, 2);
  assert.equal(core.filter(data,{query:'复习资料'}).length, 10);
  assert.equal(core.filter(data,{query:'课程安排'}).length, 0);
  assert.equal(core.filter(data,{query:'两类错误'})[0].title, '第八章假设检验');
  assert.equal(core.filter(data,{query:'第8章 PDF'}).length, 1);
  assert.equal(core.filter(data,{query:'不存在的资料'}).length, 0);
});
test('Local query and chapter intersect without affecting input order', () => {
  const original = JSON.stringify(data);
  assert.equal(core.filter(data,{category:'题库',chapter:'第8章',query:'分析'}).length, 0);
  assert.equal(core.filter(data,{category:'课件',chapter:'第8章',query:'PDF'}).length, 0);
  assert.equal(core.chapters(data,'课件').length, 9);
  assert.deepEqual(core.chapters(data,'复习大纲'), []);
  core.filter(data,{sort:'name'}); core.filter(data,{sort:'type'}); core.recent(data);
  assert.equal(JSON.stringify(data), original);
});
test('Recent excludes missing/invalid dates and sorts chronologically', () => {
  const samples = [{title:'old',updatedAt:'2026-01-01'},{title:'unknown'},{title:'invalid',updatedAt:'x'},{title:'new',updatedAt:'2026-09-17'}];
  assert.deepEqual(core.recent(samples).map(x=>x.title), ['new','old']);
  const recent = core.recent(data);
  assert.equal(recent.length, 5);
  assert.ok(recent.every((x,i) => !i || core.timestamp(recent[i-1]) >= core.timestamp(x)));
});
test('Routes support Chinese, search, malformed hashes and back-compatible home', () => {
  const cats = {'课件':'','复习大纲':''};
  assert.equal(core.parseRoute('#category=' + encodeURIComponent('课件'),cats).category,'课件');
  assert.equal(core.parseRoute('#search=' + encodeURIComponent('第8章 PDF'),cats).query,'第8章 PDF');
  for (const hash of ['#home','#top','#category=%zz','#category=unknown']) assert.equal(core.parseRoute(hash,cats).category,'');
});
test('Legacy name validation helper remains available', () => {
  assert.ok(core.validName('测试同学')); assert.ok(!core.validName('张')); assert.ok(!core.validName('张123')); assert.ok(!core.validName('  '));
});
test('Roster requires a matching student ID and name', () => {
  if (roster.size === 122) {
    assert.equal(new Set(roster.entries.map(item => item.studentId)).size, 122);
    assert.equal(roster.match('42319027', '马彩燕').section, 'BST200-04');
    assert.equal(roster.match('42450042', '张馨宇').section, 'BST200-08');
    assert.equal(roster.match('52500117', ' khanh   tung tran ' ).section, 'BST200-08');
    assert.equal(roster.match('42319027', '张三'), null);
    assert.equal(roster.match('12345678', '马彩燕'), null);
  } else {
    assert.equal(roster.size, 3);
    assert.equal(roster.match('00000001', '示例甲').section, 'TEST-01');
    assert.equal(roster.match('00000003', ' example   student ').section, 'TEST-02');
    assert.equal(roster.match('00000001', '示例乙'), null);
  }
});
