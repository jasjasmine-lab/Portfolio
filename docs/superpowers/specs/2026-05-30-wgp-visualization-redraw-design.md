# WGP（Wellbore Geology Prediction）项目页改造：去代号 + 基于 JSON 重绘可视化（设计稿）

**日期**：2026-05-30  
**范围**：`portfolio/projects/wellbore-geo/` 及其资源（`portfolio/assets/wellbore-geo/`、`portfolio/raw/wellbore-geo/`）

## 1. 目标

1) **移除技术代号**：页面中不出现“技术代号 / Codename / StrataAlign V34”。如必须引用方案名，统一使用 **WGP**。  
2) **移除数据与附件板块**：删除 wellbore 项目页的 Data/附件 section 及导航入口。  
3) **可视化结果全部重绘**：不再使用上传包中现成 PNG；改为基于 `raw/wellbore-geo/viz_data.json` 重新绘制并替换 `assets/wellbore-geo/figures/` 下对应图片（允许调整图的布局/风格/信息量，但仍保持“6张核心图”的叙事结构）。  
4) **风格一致**：字体/颜色/浅色纯白底与现有项目页一致，支持深浅主题；不引入灰雾背景；中英双语与全站 `portfolio_lang` 同步不变。

## 2. 非目标（明确不做）

- 不做 dashboard 重交互图表（仍为静态 PNG 展示）。  
- 不新增 Data/附件 的下载入口（即便 raw 文件仍保留）。  

## 3. 页面结构变更

### 3.1 删除项
- 顶部导航：移除 `Data` 菜单项与 `#data` section。  
- KPI：移除 “技术代号 / Codename” 这一格（以及 meta.method 的展示）。  
- 文案：移除 “StrataAlign V34” 字样；方法标题改为 “方法（WGP）/ Method (WGP)”。  

### 3.2 保留项
- Hero、Overview、Method、Results 四段结构保持；语言/主题切换逻辑保持。  

## 4. 可视化重绘（6 张）

**数据源**：`portfolio/raw/wellbore-geo/viz_data.json`

**输出路径**（保持现有文件名，便于替换）：`portfolio/assets/wellbore-geo/figures/`
- `model-comparison.png`：来自 `model_performance.per_model_rmse`（条形图）
- `hc-ensemble.png`：来自 `model_performance.hc_weights`（条形图）
- `per-well.png`：来自 `per_well_stats.wells[].rmse`（分布图：hist + KDE 或箱线/小提琴，择优）
- `best-worst.png`：来自 `per_well_stats.best5 / worst5`（水平条形图 + 标注）
- `feature-importance.png`：来自 `feature_importance[0..29]`（Top 30 barh）
- `feature-correlation.png`：来自 `model_performance.correlation_matrix`（heatmap）

**风格约束**：
- 统一字体：沿用站点 `--sans` 字体栈（导出 PNG 时使用系统可用字体，优先 DejaVu Sans）。  
- 背景：浅色白底；配色与站点 accent（蓝/青）协调；标题与轴标签清晰。  
- 画布：推荐 1600px 宽（或等效 dpi），保证网页内缩放仍清晰。  

## 5. 代号清理策略

- 项目页/JS/i18n：将 “StrataAlign V34” 统一替换为 “WGP”（必要处可使用 “WGP V34” 表示版本）。  
- raw 数据：
  - `viz_data.json`：`meta.method` 与 `timeline[].version` 中的代号清理为 WGP（不出现 StrataAlign/AeroRidge）。  
  - `method_report.md`：仅作为归档可保留，但也做同样代号清理（不出现 StrataAlign/AeroRidge）。  

## 6. 验收标准

1) 全站 grep（忽略大小写）：
   - `AeroRidge|StrataAlign|codename|技术代号` 均为 0（至少在 `portfolio/` 范围内）。  
2) wellbore 页面：
   - 导航中无 Data；页面无 Data section。  
   - KPI 区不再出现代号字段。  
   - 6 张图均为新绘制版本（与 JSON 数据一致，风格统一）。  
3) 中英切换/主题切换不回归：仍使用 `portfolio_lang` 与 `site_theme`。  

