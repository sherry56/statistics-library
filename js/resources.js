// Every downloadable/readable source lives under ./resources so this folder can be
// copied to GitHub and published without depending on its parent directory.
// updatedAt is the date this resource was published or refreshed in the site catalog.
const resources = [
  {
    "title": "第一章总论",
    "category": "课件",
    "format": "PPTX",
    "path": "resources/courseware/第一章总论.pptx",
    "desc": "统计学导论、数据类型与基本概念。",
    "tags": [
      "第1章",
      "课堂课件"
    ],
    "hot": true,
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "第二章统计数据搜集",
    "category": "课件",
    "format": "PPTX",
    "path": "resources/courseware/第二章统计数据搜集.pptx",
    "desc": "统计数据的描述与图表展示。",
    "tags": [
      "第2章",
      "课堂课件"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "第三章数据特征",
    "category": "课件",
    "format": "PPTX",
    "path": "resources/courseware/第三章数据特征.pptx",
    "desc": "集中趋势与离散程度的度量。",
    "tags": [
      "第3章",
      "课堂课件"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "第四章时间序列分析",
    "category": "课件",
    "format": "PPTX",
    "path": "resources/courseware/第四章时间序列分析.pptx",
    "desc": "概率基础与随机变量。",
    "tags": [
      "第4章",
      "课堂课件"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "第五章统计指数",
    "category": "课件",
    "format": "PPTX",
    "path": "resources/courseware/第五章统计指数.pptx",
    "desc": "综合指数、平均指数与指数体系。",
    "tags": [
      "第5章",
      "统计指数"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "第六章统计量与抽样分布",
    "category": "课件",
    "format": "PPTX",
    "path": "resources/courseware/第六章统计量与抽样分布.pptx",
    "desc": "抽样方法、统计量及常用抽样分布。",
    "tags": [
      "第6章",
      "抽样分布"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "第七章参数估计",
    "category": "课件",
    "format": "PPTX",
    "path": "resources/courseware/第七章参数估计.pptx",
    "desc": "点估计、区间估计与样本量确定。",
    "tags": [
      "第7章",
      "参数估计"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "第八章假设检验",
    "category": "课件",
    "format": "PPTX",
    "path": "resources/courseware/第八章假设检验.pptx",
    "desc": "检验思想、两类错误与常见检验方法。",
    "tags": [
      "第8章",
      "假设检验"
    ],
    "hot": true,
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "第九章相关与回归分析",
    "category": "课件",
    "format": "PPTX",
    "path": "resources/courseware/第九章相关与回归分析.pptx",
    "desc": "相关系数、一元线性回归及显著性检验。",
    "tags": [
      "第9章",
      "回归分析"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "数苑 · 第一章",
    "category": "题库",
    "format": "PDF",
    "path": "resources/question-bank/数苑-第一章.pdf",
    "desc": "第一章配套练习题与巩固训练。",
    "tags": [
      "第1章",
      "章节练习"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "数苑 · 第二章",
    "category": "题库",
    "format": "PDF",
    "path": "resources/question-bank/数苑-第二章.pdf",
    "desc": "第二章配套练习题与巩固训练。",
    "tags": [
      "第2章",
      "章节练习"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "数苑 · 第三章",
    "category": "题库",
    "format": "PDF",
    "path": "resources/question-bank/数苑-第三章.pdf",
    "desc": "第三章配套练习题与巩固训练。",
    "tags": [
      "第3章",
      "章节练习"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "数苑 · 第四章",
    "category": "题库",
    "format": "PDF",
    "path": "resources/question-bank/数苑-第四章.pdf",
    "desc": "第四章配套练习题与巩固训练。",
    "tags": [
      "第4章",
      "章节练习"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "数苑 · 第五章",
    "category": "题库",
    "format": "PDF",
    "path": "resources/question-bank/数苑-第五章.pdf",
    "desc": "第五章配套练习题与巩固训练。",
    "tags": [
      "第5章",
      "章节练习"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "数苑 · 第六章",
    "category": "题库",
    "format": "PDF",
    "path": "resources/question-bank/数苑-第六章.pdf",
    "desc": "第六章配套练习题与巩固训练。",
    "tags": [
      "第6章",
      "章节练习"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "数苑 · 第七章",
    "category": "题库",
    "format": "PDF",
    "path": "resources/question-bank/数苑-第七章.pdf",
    "desc": "第七章配套练习题与巩固训练。",
    "tags": [
      "第7章",
      "章节练习"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "数苑 · 第八章",
    "category": "题库",
    "format": "PDF",
    "path": "resources/question-bank/数苑-第八章.pdf",
    "desc": "第八章配套练习题与巩固训练。",
    "tags": [
      "第8章",
      "章节练习"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "数苑 · 第九章",
    "category": "题库",
    "format": "PDF",
    "path": "resources/question-bank/数苑-第九章.pdf",
    "desc": "第九章配套练习题与巩固训练。",
    "tags": [
      "第9章",
      "章节练习"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "数苑 · 期末练习",
    "category": "题库",
    "format": "PDF",
    "path": "resources/question-bank/数苑-期末练习.pdf",
    "desc": "覆盖全课程知识点的综合练习卷。",
    "tags": [
      "期末",
      "综合练习"
    ],
    "hot": true,
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "数苑 · 期末练习 2",
    "category": "题库",
    "format": "PDF",
    "path": "resources/question-bank/数苑-期末练习2.pdf",
    "desc": "第二套期末综合练习与自测资料。",
    "tags": [
      "期末",
      "综合练习"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "数苑练习题高错题修正与解析",
    "category": "题库",
    "format": "PDF",
    "path": "resources/question-bank/数苑练习题高错题修正与解析.pdf",
    "desc": "集中修正高频错题，并补充解题步骤。",
    "tags": [
      "错题",
      "详细解析"
    ],
    "hot": true,
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "统计学考试复习大纲 · 标注版",
    "category": "复习大纲",
    "format": "PDF",
    "path": "resources/review/统计学考试复习大纲-标注版.pdf",
    "desc": "按重要程度标注考点，适合考前快速查漏补缺。",
    "tags": [
      "考试重点",
      "标注版"
    ],
    "hot": true,
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "考试复习资料",
    "category": "复习大纲",
    "format": "PDF",
    "path": "resources/review/考试复习.pdf",
    "desc": "期末考试复习内容汇总。",
    "tags": [
      "期末",
      "复习"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "统计学讲义",
    "category": "复习大纲",
    "format": "PDF",
    "path": "resources/review/统计学讲义.pdf",
    "desc": "课程核心概念、公式与例题汇总讲义。",
    "tags": [
      "讲义",
      "公式"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "统计学知识 1—3 章",
    "category": "复习大纲",
    "format": "PDF",
    "path": "resources/review/统计学基础知识点-html演示/统计学重点知识点1-3章.pdf",
    "desc": "统计学第 1—3 章知识点的 PDF 汇总，可在线阅读或下载。",
    "tags": [
      "知识点",
      "1—3章",
      "PDF"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "重难点与易混淆点梳理",
    "category": "复习大纲",
    "format": "PDF",
    "path": "resources/review/统计学重难点与易混淆点-html演示/统计学重难点与易混淆点梳理.pdf",
    "desc": "重难点、相似概念与易错位置的 PDF 梳理，可在线阅读或下载。",
    "tags": [
      "重难点",
      "PDF"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "时间序列分析与指数分析 · 在线演示",
    "category": "复习大纲",
   "format": "HTML",
   "path": "resources/review/时间序列分析与指数分析-三页预览/index.html",
    "available": false,
    "desc": "时间序列与指数分析重点内容的三页演示。",
    "tags": [
      "在线阅读",
      "时间序列"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "时间序列分析与指数分析重点总结",
    "category": "复习大纲",
    "format": "PDF",
    "path": "resources/review/时间序列分析与指数分析重点总结.pdf",
    "desc": "集中梳理两部分的公式、方法与典型题型。",
    "tags": [
      "时间序列",
      "指数分析"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
   "title": "统计学前三部分 45 分钟讲授提纲",
   "category": "复习大纲",
   "format": "MD",
   "path": "resources/review/统计学前三部分45分钟讲授提纲.md",
    "available": false,
    "desc": "面向集中辅导的精简讲授顺序与重点提示。",
    "tags": [
      "讲授提纲",
      "速览"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
   "title": "统计学重难点与易混淆点梳理 · 源稿",
   "category": "复习大纲",
   "format": "MD",
   "path": "resources/review/统计学重难点与易混淆点梳理.md",
    "available": false,
    "desc": "重难点梳理的 Markdown 源稿。",
    "tags": [
      "源文件",
      "重难点"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
   "title": "统计学知识导图",
   "category": "复习大纲",
   "format": "XMIND",
   "path": "resources/review/统计学.xmind",
    "available": false,
    "desc": "课程知识体系与章节关系思维导图。",
    "tags": [
      "思维导图",
      "知识框架"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "《统计学》第 3 版学习指导及能力提升训练",
    "category": "教材",
    "format": "PDF",
    "path": "resources/textbooks/《统计学》第3版学习指导及能力提升训练.pdf",
    "desc": "课程配套学习指导与能力提升训练 PDF。",
    "tags": [
      "教材",
      "PDF",
      "指导书"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
  {
    "title": "《统计学》第 3 版配套教材",
    "category": "教材",
    "format": "PDF",
    "path": "resources/textbooks/14549528 (向蓉美，王青华主编, 向蓉美,王青华主编, 向蓉美, 王青华) (z-library.sk, 1lib.sk, z-lib.sk).pdf",
    "available": false,
    "desc": "向蓉美、王青华主编的课程配套教材。",
    "tags": [
      "教材",
      "PDF"
    ],
    "updatedAt": "2026-09-20T00:00:00+08:00",
    "updatedSource": "site-update"
  },
];
