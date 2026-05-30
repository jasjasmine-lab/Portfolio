# Wellbore Geology Prediction 项目页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `portfolio/` 下新增最后一个项目 **Wellbore Geology Prediction** 的静态图文展示页（中英双语、与全站语言同步），并在 `portfolio/index.html` 导航页新增入口。

**Architecture:** 沿用现有项目页模板（RoboTRAC/PicGuard/Breast US）：HTML + 共享主题 CSS（`roboTRAC.css`）+ 项目自定义 CSS + i18n 字典（`*.i18n.js`）+ 行为脚本（`*.js`，主题/语言/scrollspy）。语言状态统一使用 `localStorage.portfolio_lang`，与全站同步。

**Tech Stack:** 原生 HTML/CSS/JS；静态资源为 PNG；本地预览用 `python3 -m http.server`。

---

## File Structure（新增/修改）

**Create**
- `portfolio/projects/wellbore-geo/index.html`：项目主展示页（双语 + 返回导航按钮 + 主题/语言切换）
- `portfolio/projects/wellbore-geo/wellbore.css`：项目专属样式（figure grid / gallery / caption 等）
- `portfolio/projects/wellbore-geo/wellbore.i18n.js`：中英文字典（meta/nav/hero/section/kpi/captions/insights/sources）
- `portfolio/projects/wellbore-geo/wellbore.js`：页面交互（i18n 渲染、theme、lang sync、scrollspy）
- `portfolio/assets/wellbore-geo/figures/`：6 张 PNG（从素材包复制，保持命名简洁）
- （可选）`portfolio/raw/wellbore-geo/`：归档原始 MD/JSON（不在页面中出现 “AeroRidge” 字样）

**Modify**
- `portfolio/index.html`：新增一个项目卡片（Wellbore Geology Prediction）并加入中英文案与 chips
- （可选）`portfolio/index.md`：若仍用于备份首页，同步新增一条项目链接

---

## Task 1：整理素材并放入 assets/raw

**Files:**
- Create dirs: `portfolio/assets/wellbore-geo/figures/`
- Create dirs (optional): `portfolio/raw/wellbore-geo/`

- [ ] **Step 1：创建目标目录**

Run:
```bash
mkdir -p portfolio/assets/wellbore-geo/figures
mkdir -p portfolio/raw/wellbore-geo
```

- [ ] **Step 2：复制 6 张可视化 PNG 到 assets**

Source（来自上传包解压目录）：
- `viz_01_model_comparison.png`
- `viz_02_hc_ensemble.png`
- `viz_03_per_well.png`
- `viz_04_best_worst.png`
- `viz_05_importance.png`
- `viz_06_correlation.png`

Target（建议重命名，避免暴露内部版本名）：
- `model_comparison.png`
- `hc_ensemble.png`
- `per_well_rmse.png`
- `best_worst.png`
- `feature_importance.png`
- `correlation.png`

Run:
```bash
cp "<extracted>/viz_01_model_comparison.png" portfolio/assets/wellbore-geo/figures/model_comparison.png
cp "<extracted>/viz_02_hc_ensemble.png"      portfolio/assets/wellbore-geo/figures/hc_ensemble.png
cp "<extracted>/viz_03_per_well.png"         portfolio/assets/wellbore-geo/figures/per_well_rmse.png
cp "<extracted>/viz_04_best_worst.png"       portfolio/assets/wellbore-geo/figures/best_worst.png
cp "<extracted>/viz_05_importance.png"       portfolio/assets/wellbore-geo/figures/feature_importance.png
cp "<extracted>/viz_06_correlation.png"      portfolio/assets/wellbore-geo/figures/correlation.png
```

- [ ] **Step 3（可选）：归档原始 MD/JSON 到 raw**

将原始文件放入 `raw/wellbore-geo/`，便于以后追溯，但不在页面文案中出现 “AeroRidge”：
```bash
cp "<extracted>/AeroRidge_V34_Report.md" portfolio/raw/wellbore-geo/method_report.md
cp "<extracted>/aeroridge_v34_viz_data.json" portfolio/raw/wellbore-geo/viz_data.json
```

---

## Task 2：实现项目主展示页（HTML/CSS/i18n/JS）

**Files:**
- Create: `portfolio/projects/wellbore-geo/index.html`
- Create: `portfolio/projects/wellbore-geo/wellbore.css`
- Create: `portfolio/projects/wellbore-geo/wellbore.i18n.js`
- Create: `portfolio/projects/wellbore-geo/wellbore.js`

- [ ] **Step 1：从现有项目页模板拷贝骨架**
选择 `portfolio/projects/picguard/index.html` 或 `portfolio/projects/breast-us/index.html` 作为基底：
要点：
1. 顶部导航含：`← 导航`、section links、`themeBtn`、`langBtn`
2. `langBtn` 与全站同步 `portfolio_lang`
3. 全文使用 `data-i18n`（以及 list/links 的渲染方式）

- [ ] **Step 2：定义该项目的“对外名称”与“技术代号”**
对外名称（固定）：
- `Wellbore Geology Prediction`

技术代号（替代 “AeroRidge V34”，允许出现于页面 subtitle/内部，但不得出现 “AeroRidge”）：
- 采用一个基于方法特点的命名（例如：强调 *multi-method matching + GBDT + hill-climb + postproc*）

- [ ] **Step 3：填充内容（双语）**
内容来源：`method_report.md`（重命名后）与 `viz_data.json` 的 meta/timeline/per_model_rmse。
页面内容最小集合：
1. Problem（输入/输出）
2. Pipeline（Feature Eng → GBDT → Hill Climb → PostProc）
3. Metrics（LB 10.217 / OOF 10.4024 / wells 773 / features 222）
4. Key Insights（报告第 4 节 5 条要点）

- [ ] **Step 4：Results 区插入 6 张 PNG（来自 assets/wellbore-geo/figures）**
并提供简短图注（中英）。

- [ ] **Step 5：实现 `wellbore.js` 语言/主题同步**
要求：
1. 主题沿用 `site_theme`
2. 语言统一使用：
   - 读：`portfolio_lang`
   - 写：`portfolio_lang`
   - 支持 URL `?lang=en|zh`（若存在则覆盖并写回）

- [ ] **Step 6：避免敏感/不想出现的词**
全站 grep 确认项目页与导航页不出现：
- `AeroRidge`
- `aeroridge`

---

## Task 3：接入导航页（index.html）

**Files:**
- Modify: `portfolio/index.html`

- [ ] **Step 1：新增项目卡片**
位置：作为最后一个项目（最后一张卡）。

卡片要素：
- 标题：`Wellbore Geology Prediction`
- 描述：一行概括（双语）
- Chips：如 `GBDT` / `Ensemble` / `Time-series`（或等价中文）
- 打开链接：`./projects/wellbore-geo/index.html`

- [ ] **Step 2：补齐导航页 i18n 字典**
在 `zh` 与 `en` 字典中新增：
- `desc_wellbore`
- `chip_wb_xxx`（若使用 data-t）

---

## Task 4：本地验收与回归检查

- [ ] **Step 1：启动本地预览**
Run:
```bash
cd portfolio
python3 -m http.server 8022
```

- [ ] **Step 2：检查点**
1. 导航页出现新卡片，可正常打开项目页
2. 在任意页切换语言后，打开另一个页语言保持一致（全局同步）
3. Light mode 无灰雾背景（沿用现有全局样式）
4. 页面中不出现 “AeroRidge / aeroridge”

---

## Self-Review（执行前）
- 确认文件路径都在 `workspace/portfolio/` 下
- 全站 `grep -i aeroridge` 应为 0
- `portfolio_lang` 全站一致；旧 key 不再写入

