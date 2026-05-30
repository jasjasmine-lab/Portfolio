# WGP Redraw + Remove Codename Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `portfolio/projects/wellbore-geo/` 中移除技术代号（含 StrataAlign V34 / Codename / 技术代号），删除“数据与附件”板块，并基于 `portfolio/raw/wellbore-geo/viz_data.json` 重新绘制 6 张可视化 PNG 替换现有图片；必须时用 **WGP** 指代方案。

**Architecture:**  
页面层：HTML + i18n（`wellbore.i18n.js`）+ 行为脚本（`wellbore.js`）+ 样式（`wellbore.css`）。  
绘图层：新增一个离线脚本 `work/wgp_redraw.py` 读取 `viz_data.json`，用 Matplotlib 生成 6 张 PNG 写回 `portfolio/assets/wellbore-geo/figures/`。  
全站校验：`grep -i` 确保禁用词为 0；启动本地 server 手动抽查 2-3 个页面语言/主题同步不回归。

**Tech Stack:** Python 3 + matplotlib (+ numpy)；原生 HTML/CSS/JS。

---

## Files & Responsibilities

**Modify**
- `portfolio/projects/wellbore-geo/index.html`
  - 移除 `#data` section
  - 移除 KPI “codename/技术代号” 卡片
  - Results 区仍引用同名 6 张图片（文件名不变，直接替换 PNG 内容）
- `portfolio/projects/wellbore-geo/wellbore.i18n.js`
  - 删除 `nav.data`、`section.data_*`、`kpi.codename_label`
  - `section.method_title` 等文案不出现 StrataAlign，改为 `Method (WGP)` / `方法（WGP）`
  - `method.pipeline_code` 中把 codename/StrataAlign 全部替换为 WGP
- `portfolio/projects/wellbore-geo/wellbore.js`
  - `sectionIds` 中移除 `data`
  - `applyVizMeta()` 不再处理 `meta.method`（因为 KPI 移除）
- `portfolio/raw/wellbore-geo/viz_data.json`
  - 清理 `meta.method`、`timeline[].version` 中的 StrataAlign 等代号，统一写为 **WGP**（若需要保留版本号，用 `WGP V34`）
- `portfolio/raw/wellbore-geo/method_report.md`
  - 清理出现的 StrataAlign / codename 字样（若用户未来会打开 raw）

**Create (INTERMEDIATE, in work dir)**
- `work/wgp_redraw.py`：离线重绘脚本（不要放到 workspace/portfolio 里）

**Overwrite assets (FINAL OUTPUTS, in workspace)**
- `portfolio/assets/wellbore-geo/figures/model-comparison.png`
- `portfolio/assets/wellbore-geo/figures/hc-ensemble.png`
- `portfolio/assets/wellbore-geo/figures/per-well.png`
- `portfolio/assets/wellbore-geo/figures/best-worst.png`
- `portfolio/assets/wellbore-geo/figures/feature-importance.png`
- `portfolio/assets/wellbore-geo/figures/feature-correlation.png`

---

## Task 1: Remove “Data & attachments” and codename display from WGP page

**Files:**
- Modify: `portfolio/projects/wellbore-geo/index.html`
- Modify: `portfolio/projects/wellbore-geo/wellbore.js`

- [ ] **Step 1: Update HTML to remove `#data` nav + section + KPI codename card**

Edit:
1) `<nav>` remove `<a href="#data" ...>`
2) KPI remove the card with:
   - label: `data-i18n="kpi.codename_label"`
   - value: `data-field="method"`
3) Remove entire `<section id="data"> ... </section>`

- [ ] **Step 2: Update JS scrollspy section list**

Edit in `wellbore.js`:
```js
const sectionIds = ["overview", "results", "method"];
```

- [ ] **Step 3: Update JS viz meta application**

Edit in `applyVizMeta()` remove:
```js
else if (k === "method") ...
```
Since the KPI card no longer exists.

---

## Task 2: Remove codename wording in i18n copy

**Files:**
- Modify: `portfolio/projects/wellbore-geo/wellbore.i18n.js`

- [ ] **Step 1: Delete `nav.data` and `section.data_*`**
Remove keys:
- `nav.data`
- `section.data_title`, `section.data_lead`, `section.data_links`

- [ ] **Step 2: Delete `kpi.codename_label`**

- [ ] **Step 3: Replace StrataAlign/codename with WGP**
Edits:
- `section.method_title`: `"方法（WGP）"` / `"Method (WGP)"`
- `method.pipeline_code`: header改为：
  - `# WGP V34`（允许出现版本号）
  - 删除 `(codename)` 字样

---

## Task 3: Sanitize raw JSON/MD to remove legacy codenames

**Files:**
- Modify: `portfolio/raw/wellbore-geo/viz_data.json`
- Modify: `portfolio/raw/wellbore-geo/method_report.md`

- [ ] **Step 1: Update `viz_data.json`**
Rules:
- `meta.method`: set to `"WGP V34"` (or `"WGP"`)
- `timeline[].version`: replace any content containing `StrataAlign`/`AeroRidge` to `WGP` / `WGP V34`

- [ ] **Step 2: Update `method_report.md`**
Replace:
- `StrataAlign` → `WGP`
- `AeroRidge` → `WGP`
- `(codename)` / `codename` / `技术代号` → 删除或替换为 `WGP`

---

## Task 4: Redraw 6 figures from `viz_data.json` (offline)

**Files:**
- Create (intermediate): `work/wgp_redraw.py`
- Overwrite: `portfolio/assets/wellbore-geo/figures/*.png` (6 files)

- [ ] **Step 1: Ensure Python deps**

Run:
```bash
python3 -c "import matplotlib, numpy; print('ok')"
```

If missing:
```bash
pip install matplotlib numpy --break-system-packages
```

- [ ] **Step 2: Create `work/wgp_redraw.py`**

Script requirements:
1) Read JSON from:
   - `workspace/portfolio/raw/wellbore-geo/viz_data.json`
2) Write six PNGs to:
   - `workspace/portfolio/assets/wellbore-geo/figures/`
3) Style:
   - white background, clean grid (alpha low), large labels
   - use a consistent palette (accent blue `#0a6cf0` and teal `#00a6a6` as highlights)
4) Plots:
   - model-comparison: bar chart of `per_model_rmse` (exclude `HC_ensemble` or include as highlighted bar)
   - hc-ensemble: bar chart of `hc_weights` (percent labels)
   - per-well: histogram of wells rmse (bins ~40) + vertical line at mean/median
   - best-worst: two-panel horizontal bars for best5 and worst5 (rmse), annotate well_id
   - feature-importance: barh top 30 (`feature_importance` list)
   - feature-correlation: heatmap from correlation_matrix (models x models)

- [ ] **Step 3: Run redraw script**
Run:
```bash
python3 work/wgp_redraw.py
```
Expected:
- six files overwritten successfully with current timestamp

---

## Task 5: Verification (no regressions)

- [ ] **Step 1: grep for forbidden keywords**
Run:
```bash
python3 - <<'PY'
import subprocess, sys
cmd=["rg","-n","-i","StrataAlign|AeroRidge|codename|技术代号","/sessions/6a0fcd40f966955c11649d6e/workspace/portfolio"]
print(" ".join(cmd))
rc=subprocess.call(cmd)
sys.exit(rc)
PY
```
Expected: exit code **1** (rg returns 1 when no matches).

- [ ] **Step 2: Start local preview**
Run:
```bash
python3 -m http.server 8022 --directory /sessions/6a0fcd40f966955c11649d6e/workspace/portfolio
```
Manual checks:
1) WGP 页面无 Data/附件板块
2) KPI 无代号
3) 6 张图呈现正常（清晰、白底）
4) 任意页切换语言后打开 WGP，语言仍同步

---

## Self-Review (plan quality)
- 覆盖 spec：代号移除、Data 移除、JSON 重绘、验收 grep 均有对应任务
- 无占位符：所有步骤包含具体文件与命令
- 命名一致：全程用 WGP（必要时 WGP V34）

