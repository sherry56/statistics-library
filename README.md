# 《统计学》资料库

助教为课程同学整理的轻量静态资料柜。Vanilla HTML / JavaScript + Tailwind CSS，无应用框架、无路由库。

## 运行

编译产物、阅读器依赖和课程资料都已放在本项目内，直接打开 `index.html` 可浏览分类、搜索和 PPTX。完整 PDF 阅读建议使用本地 HTTP 预览：

```powershell
cd 'E:\C博士\课程\统计学辅导\统计学资料库-html原型'
npm run preview
```

打开终端输出的 `http://127.0.0.1:8766/`。该服务只绑定本机，根目录就是当前项目目录；项目不再依赖上一级辅导资料目录，复制到 GitHub 或 GitHub Pages 后仍使用同一套相对路径。它仅供本地预览，不是生产服务器。

需要重新安装或开发时：

```powershell
npm ci
npm run build
npm test
npm run audit
```

`npm run watch` 持续编译样式。修改 HTML/JS 后刷新浏览器。发布静态文件无需在浏览器中运行 Tailwind，也不依赖 CDN。

## 文件与职责

| 文件 | 内容 |
| --- | --- |
| `index.html` | 导航、小 Hero、教材封面、搜索、分类、最近更新、详情、原生 dialog、页脚 |
| `js/resources.js` | 35 条资料资源及项目内相对路径，新增已确认的修改时间和可用性标记 |
| `js/library-core.js` | 全局/局部搜索、排序、章节筛选、最近更新、hash 解析的纯函数 |
| `js/app.js` | DOM 事件、路由、下载演示、Toast、焦点和快捷键 |
| `js/ui.js` | 复用的按钮、标签、格式颜色和长条资源行模板 |
| `js/reader.js` | PPTX 对应 PDF 预览、iframe 阅读器与生命周期 |
| `js/pdf-reader.js` | 按需加载的原版 PDF 渲染、翻页、缩放和释放资源 |
| `styles/huibara-theme.css` | 可供 Huibara Lab 主站复用的 design tokens |
| `styles/input.css` | Tailwind 入口、扫描范围和极少量浏览器兼容规则 |
| `styles/reader.css` | Viewer 布局、iframe 尺寸、全屏与 dialog 状态的原生 CSS |
| `assets/library.css` | Tailwind 编译产物，不手工修改 |
| `assets/vendor/pdfjs/` | 本地 PDF.js、worker、字体、CMap、WASM、许可证 |
| `resources/` | 项目自包含的课件、题库、复习资料、教材、封面图片和 PPTX PDF 预览 |
| `resources/courseware/` | 9 份章节 PPTX，下载使用原始文件 |
| `resources/question-bank/` | 章节题库、期末练习和错题解析 PDF |
| `resources/review/` | 复习 PDF 与网页演示（网页演示目录保持其内部 CSS/图片） |
| `resources/textbooks/` | 可用的 EPUB 教材资源 |
| `resources/previews/pptx/` | 9 份 PPTX 对应的原版 PDF 在线预览 |
| `resources/readers/` | 非浏览器原生格式的离线阅读副本 |
| `functions/api/verify.js` | Cloudflare Pages 服务端名单验证接口；名单本体不进入公开仓库 |
| `scripts/` | 编译依赖复制、本地静态服务、资料/选择器/样式审计 |
| `tests/core.test.cjs` | 六项搜索、筛选、排序、路由和校验回归测试 |

旧页面内联 CSS 和根目录旧 `library.css` 已清理；本次按请求移除了数苑第三至九章试卷分析 PDF，其余原始资料与阅读副本保留。所有当前实际使用的资源已迁入 `resources/`，不再从项目外部读取。

## 首页与查找

首页顺序：64px sticky 导航 → 小标题与两本教材 → 课程考核方式与联系方式 → 全局搜索 → 4 个分类 → 最近 5 条更新 → 使用说明 → 页脚。

搜索匹配 title、category、format、desc、tags，忽略英文大小写并支持空格分隔多关键词（所有关键词均需命中）。“复习资料”是 UI 别名，数据里的分类仍是“复习大纲”。首页搜索所有资源，分类搜索只作用于当前分类，并与章节筛选取交集。

`Ctrl/Cmd + K` 聚焦全局搜索；`/` 聚焦当前页面搜索框，输入框内不劫持 `/`；阅读或下载弹窗打开时不触发搜索快捷键。保留 `#home` / `#category=...`，增加可分享的 `#search=...`。搜索通过 replaceState 更新，避免每输入一个字增加一条历史。

课件、题库根据 tags 中的“第N章”自动生成筛选。其他类别不显示章节。资源行保持一行一份，窄屏操作按钮换到下一行。分类卡片桌面端四等分保持单行，较窄屏幕保持单行并允许横向触控滚动。

## 最近更新

`updatedAt` 来自本次核对时原文件的实际 `mtime`，并用 `updatedSource: "file-mtime"` 标明来源；它不是网站上传日期。30 个存在的文件有确认日期，缺失文件不补造日期。`LibraryCore.recent()` 排除缺失/无效日期，按时间倒序取 5 条。当前文件日期主要在 2026 年 5–6 月，因此不使用虚构的 9 月更新或 NEW 标签。后续新增资料时在数据文件中填写有依据的 ISO 时间即可。

## Tailwind 与视觉复用

使用 Tailwind 4.3.3 CLI 与 lockfile 固定依赖。入口通过 `@source` 显式扫描首页与 JS 模板。动态状态使用 `js/ui.js` 内完整 utility 字符串，不拼接 `bg-${color}`，避免漏编译。具体配置方式参考 [Tailwind CLI 文档](https://tailwindcss.com/docs/installation/tailwind-cli) 和 [Theme 文档](https://tailwindcss.com/docs/theme)。

`huibara-theme.css` 使用 Warm Gray + Ink Green 主题，统一 canvas / surface / soft / ink / muted / line / brand 颜色，并扩展低饱和 Terracotta / Slate Blue / Ochre 辅助色，仅用于文件类型、分类图标、keyword chips 和少量 badge；页面背景、卡片与正文仍保持中性色。系统字体、72rem 容器、46rem 搜索宽度、8/10/12px 圆角、轻 hover/弹窗阴影及 4px spacing 基准也集中在 tokens 中。主题使用 `@theme static`，因此阅读器等原生 CSS 也能读取同一套 token。

未来主站如使用 Tailwind v4，可在全局入口 `@import "tailwindcss"` 后导入该 theme；复用 `bg-canvas`、`text-ink`、`border-line`、`rounded-card` 等类及 `js/ui.js` 模板模式。如果主站尚未使用 Tailwind，可先映射同名 CSS 变量，逐步迁移。此次未更改主站工程。

UI patterns：Primary = `UI.button + UI.primary`；Secondary = `UI.button + UI.secondary`；Ghost = `UI.button + UI.ghost`。分类卡、资源行、输入框、章节 pill、modal、section heading 均使用相同 tokens。只为独立 Viewer、全屏状态及浏览器 `[hidden]` / dialog 行为保留手写 CSS。

## 阅读与下载的实际边界

- PPTX 在线阅读使用 `resources/previews/pptx/` 中由 PowerPoint 原生导出的 PDF，保留原版图表、文字、公式；下载仍然指向 `resources/courseware/` 中的原始 PPTX。PDF 阅读支持页码、前后翻页、左右键、缩放，文件内容不上传到第三方。
- HTTP 下 PDF 使用本地 PDF.js 读取原始 PDF，避免内置浏览器 PDF 插件空白；文件内容不上传到第三方。`file://` 直接打开时保留原生 iframe PDF 回退，其效果取决于浏览器。
- HTML 使用原文件 iframe；Markdown、XLSX、EPUB、XMIND 保留现有 HTML 阅读副本。下载始终指向原始文件。
- 原生 dialog 提供 Escape、Tab 焦点约束、关闭后焦点返回；PPTX 的 PDF 预览与原始 PPTX 下载保持分离。
- 下载验证现在要求输入 8 位学号和名单中的姓名，名单来自 `教师页面.pdf`（BST200-04）与 `教师页面2.pdf`（BST200-08），共 122 名去重学生；公开部署时名单通过 Cloudflare Pages Secret `ROSTER_JSON` 提供给 `functions/api/verify.js`，不进入公开 GitHub 仓库。
- 本地名单文件 `resources/roster.js` 已加入 `.gitignore`，仅用于本地核对；公开 Pages 部署使用服务端接口验证。静态资源 URL 本身仍属于公开站点资源，若需要强制阻止绕过下载，还应把文件移至 R2 并由服务端签发短时下载链接。

## 已知原有资料问题

“《统计学》第 3 版配套教材”登记的 `resources/textbooks/14549528 ... .pdf` 当前不存在。该条保留在列表，点击阅读/下载会提示联系助教更新文件，并排除在最近更新之外。确认教材文件后可放入该目录并移除 `available: false`。
学习指导 EPUB 已保留在公开 GitHub 仓库，但因 Cloudflare Pages 单文件大小限制，Pages 部署目录不上传该文件；目录中的阅读副本仍可在线打开，下载路径指向 GitHub 原文件。
另外，`时间序列分析与指数分析 · 在线演示` 的源目录当前不存在，已标记为不可用并排除在最近更新之外。
另外，统计学前三部分讲授提纲、重难点源稿和知识导图的原始文件当前也不存在，均已标记为不可用并排除在最近更新之外。

页脚域名已纠正为 `statistics.huibara.cn`；发布前需要将 `ROSTER_JSON` 写入 Cloudflare Pages Secret，并绑定自定义域名。

## 验证

`npm test`：6 项通过。`npm run audit`：35 条记录、30 个有效原文件、5 个明确标注的缺失文件、9 个 PPTX PDF 预览、静态 DOM selector、动态 Tailwind 类和“无项目外资源路径”检查均通过。

浏览器检查覆盖搜索、快捷关键词、分类、局部查询、章节交集、空态、排序，PPTX 对应 PDF 的原版显示/翻页/缩放/键盘，PDF 原版显示/翻页/缩放，HTML 与 Markdown 阅读，XLSX/EPUB 的 iframe 路径，下载错误提示、成功下载事件及 Toast。Ctrl+K、/、Escape 实测正常；Cmd+K 保留同一事件逻辑，未在 macOS 实测。

响应式实测：375px 单列、768px 两列、1280px 三列，页面没有横向溢出；375px 下载弹窗内容宽度 342px，无内部横向溢出。正式 `index.html` 入口加载正常，两本封面加载成功，控制台无错误。当前内置浏览器未进入系统原生全屏，已验证 375px 视口下 dialog 铺满视口的回退状态；系统全屏仍需在支持的浏览器验证。没有逐份通读所有 35 个 catalog 记录，也没有验证尚不存在的真实名单后端。
