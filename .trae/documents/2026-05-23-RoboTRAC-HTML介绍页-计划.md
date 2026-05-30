# RoboTRAC 中英双语 HTML 介绍页（嵌入作品集）实施计划

## Summary（目标概述）
基于你提供的 RoboTRAC 原始材料（代码包 README/requirements/脚本 + 论文 PDF），在现有 `portfolio/` 作品集目录中新增一个**中英双语、单页滚动型**的 RoboTRAC **HTML 项目介绍页**，包含「摘要+亮点+结果+方法细节」，并从作品集首页提供入口链接。页面将采用高质感的前端视觉方案（遵循 frontend-design 的“明确审美方向 + 精细排版 + 适度动效”原则），无需依赖 Figma 设计稿。

---

## Current State Analysis（现状与输入材料）

### 现有作品集结构（已存在）
- `portfolio/index.md`：作品集首页（包含 RoboTRAC 的 Markdown 链接）
- `portfolio/projects/roboTRAC.md`：RoboTRAC 的 Markdown 占位页（含材料缺口提示）
- `portfolio/projects/_template.md`：项目页模板

### 你本次上传的 RoboTRAC 材料
- `README.md`：4 类模型定义、训练/预测命令、输入输出字段、weighted metrics（Accuracy/F1/AUC）
- `patent_multi_predictor.py`：特征工程细节（结构化统计特征 + BGE embedding）、LightGBM 多分类训练参数、输出字段（含 screening_score）
- `requirements.txt`：依赖版本下限
- `LANGLH-D-26-00568.pdf`：论文（包含 Methods/Results、Table 1/3、Fig.1 等可用于“方法与结果”的权威来源）

### 关键内容口径（本计划固定的写作来源）
- **论文口径**：用于「研究动机、方法流程、核心结果（表格数字）、洞察」等需要严谨引用的部分。
- **代码包口径**：用于「可复现与使用（CLI/字段/输出解释）、工程实现细节、demo 指标」等。
- 若两者存在差异（例如论文提到 PCA，而脚本未体现），页面中以“Paper version / Demo package version”明确标注，避免被误解为不一致。

---

## Assumptions & Decisions（关键假设与已决策）
1. **语言**：中英双语同页切换（CN/EN toggle），而非两份 HTML。
2. **嵌入方式**：把 HTML 放在 `portfolio/projects/roboTRAC/` 下，并在 `portfolio/index.md` 增加指向该 HTML 的入口（保留原 `roboTRAC.md` 作为备份/材料页）。
3. **页面模块范围**：本次只做「摘要+亮点+结果+方法细节」；“消融/错误分析”不在本页主结构内（后续有材料可再扩展）。
4. **Figma**：由于你没有现成 Figma 设计稿，本次不走 Figma MCP 的设计还原流程；但页面将按可迁移思路组织（便于你未来补做 Figma 时对齐）。
5. **外部依赖**：默认页面**不依赖前端框架**（纯 HTML/CSS/少量 JS），尽量离线可打开；字体优先使用系统中文字体栈（避免加载外部字体导致不可用）。

---

## Proposed Changes（拟做改动：文件级别清单与实现要点）

> 所有新增/修改均发生在你当前作品集目录 `portfolio/` 内。

### A. 新增 RoboTRAC HTML 页面（主交付物）
1. **新增** `portfolio/projects/roboTRAC/index.html`
   - 单页长文结构 + 顶部锚点导航（Overview / Results / Method / Reproducibility）
   - CN/EN 切换按钮（同页切换文案）
   - KPI 指标卡（来自论文 Table 3 + README 的 weighted metrics，分别标注来源）
   - Results 区：
     - Table 3（优先用 HTML table，移动端可横向滚动）
     - Table 1（同上，或放为可折叠）
   - Method 区：
     - 特征工程：结构化统计特征、类别字段编码、BGE embedding（来源：脚本 + 论文）
     - 模型：LightGBM multiclass + class_weight balanced（来源：脚本）
     - 输出解释：pred_label / prob_* / screening_score（来源：README+脚本）
   - Reproducibility 区：
     - requirements 摘要
     - train/predict 命令与输入字段要求（来自 README）
2. **新增** `portfolio/projects/roboTRAC/roboTRAC.css`
   - 明确审美方向：偏“研究海报/期刊附录”风格（严谨、信息密度高，但排版有呼吸感）
   - 使用 CSS variables 管理色彩/间距/圆角/阴影
   - 响应式：移动端单列，表格横向滚动容器
   - 轻量动效：首屏渐入、导航 hover、section 标题进入（避免花哨）
3. **新增** `portfolio/projects/roboTRAC/roboTRAC.i18n.js`
   - `const i18n = { zh: {...}, en: {...} }`
   - 将所有可见文案（标题、段落、表头、按钮）键值化，减少遗漏
4. **新增** `portfolio/projects/roboTRAC/roboTRAC.js`
   - 语言切换：`localStorage` 保存 + 支持 `?lang=en`
   - Scrollspy：滚动时高亮当前 section，提升阅读体验
   - Copy-to-clipboard：复制命令（train/predict）的小按钮（可选）

### B. 新增资产目录（支持页面展示）
1. **新增目录** `portfolio/assets/roboTRAC/figures/`
   - 从论文 PDF 导出的关键图：优先 Fig.1（protocol/流程图）
2. **新增目录** `portfolio/assets/roboTRAC/tables/`（可选）
   - 若最终决定用图片展示表格，则放 Table 1/3 的裁剪图
3. **新增目录** `portfolio/assets/roboTRAC/screens/`
   - 从简历截图裁剪出的 RoboTRAC 一段（作为“证据/旁证”可折叠展示，可选）

### C. 归档原始材料（便于你长期维护与复查）
1. **新增目录** `portfolio/raw/roboTRAC/`
   - 复制你的 PDF、README、requirements、脚本到此（原始材料归档，不影响公开展示）

### D. 更新作品集导航（让 HTML 成为主入口）
1. **修改** `portfolio/index.md`
   - 将 RoboTRAC 的链接从 `projects/roboTRAC.md` 调整为 `projects/roboTRAC/index.html`
   - 可附加一个“（Markdown 备份）”链接指向原 md
2. **修改（可选）** `portfolio/projects/roboTRAC.md`
   - 顶部新增一行“HTML 版本入口”，并保留现有材料清单内容

---

## Content Extraction Plan（从材料中抽取页面内容的方法）

### 1) 从 README / 脚本抽取（结构化、可复现）
- 从 README 抽：任务定义、训练/预测命令、输入列、输出列含义、weighted metrics（Accuracy/F1/AUC）
- 从脚本抽：
  - 统计特征：title_len/abstract_len/claim_len/missing_cnt/ipc_count/patent_age
  - 类别字段：IPC主分类、CPC、专利类型、行业、新兴产业、申请人类型（cat codes）
  - 文本向量：SentenceTransformer `BAAI/bge-large-zh-v1.5`，title+abstract 拼接
  - 模型：LightGBM multiclass，`class_weight='balanced'`，关键训练参数与 early stopping
  - 输出解释：prob_* 与 screening_score

### 2) 从论文 PDF 抽取（严谨叙事与权威结果）
> PDF 无法直接用 Read 解析，需要在执行阶段用命令行工具抽取文本/图片。

- 抽文（用于摘要/方法/结果段落）：
  - 使用 `pdftotext -layout` 定位 Abstract、Methods、Results、Interpretation 等段落
  - 产出：一份中英文案对照（英文源自论文，中文为忠实改写）
- 抽表（用于结果区）：
  - Table 3：优先手动转成 HTML table（并双人/双遍校验数字一致性）
  - Table 1：同上；若信息密度过高，可放在 `<details>` 折叠中
- 抽图（用于方法区视觉辅助）：
  - 优先 Fig.1（整体流程/协议图）
  - 通过 `pdftoppm` 或 `pdfimages` 导出到 `portfolio/assets/roboTRAC/figures/`

---

## Verification（完成后的验收与自检步骤）
1. **链接正确性**
   - 从 `portfolio/index.md` 点击 RoboTRAC 入口能打开 HTML
   - HTML 内所有图片/资源路径为相对路径且可加载
2. **双语切换**
   - CN/EN 切换后：标题、段落、表头、按钮、提示均切换
   - 刷新页面语言保持（localStorage 或 URL 参数）
3. **阅读体验**
   - 移动端：表格可横向滚动、图片不溢出、行宽与行高舒适
   - 锚点导航可用：点击跳转、滚动高亮
4. **内容一致性（最重要）**
   - 论文表格数字与页面一致（Table 3/1 逐项核对）
   - README 的 weighted metrics 若展示，必须标注“demo package 指标”（避免与论文数字混淆）

---

## Implementation Notes（执行阶段的工具使用约束）
执行时将：
- 仅用少量 JS（i18n + scrollspy），不引入前端框架或构建工具
- PDF 抽取使用系统工具（`pdftotext` / `pdftoppm` / `pdfimages`）或等价方案
- 所有最终交付文件写入你作品集目录中，确保你可以直接打开/部署

