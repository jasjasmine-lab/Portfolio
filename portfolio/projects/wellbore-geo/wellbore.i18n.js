/* Wellbore Geology Prediction bilingual copy (CN/EN) */
window.WELLBORE_GEO_I18N = {
  zh: {
    meta: {
      title: "Wellbore Geology Prediction｜井眼地质预测",
      description: "Wellbore Geology Prediction：井眼地质（TVT）预测项目页（中英双语）",
    },
    nav: {
      overview: "概览",
      results: "结果",
      method: "方法",
      theme_light: "亮色",
      theme_dark: "暗色",
      lang: "EN",
    },
    hero: {
      title: "Wellbore Geology Prediction",
      subtitle: "Wellbore Geology ML",
      tagline:
        "基于水平井 GR 曲线、类型井参考曲线与已知段落标定，预测评估点处的 True Vertical Thickness（TVT），并给出模型对比与误差分析。",
    },
    kpi: {
      lb_label: "LB RMSE",
      oof_label: "OOF RMSE",
      wells_label: "井数",
      features_label: "特征数",
      train_label: "训练样本",
    },
    section: {
      overview_title: "概览",
      value:
        "目标：在井内强相关、井间差异显著的条件下，稳定预测 TVT 序列。核心思路是用多视角匹配特征捕捉“水平井—类型井”的形态对应关系，再用 GBDT 学习特征可信度，最后通过集成与后处理提升一致性与泛化。",
      highlights: "要点",
      highlights_items: [
        "输入：水平井 GR + 类型井（GR, TVT）+ 已知段 TVT。",
        "输出：每个评估点的 TVT 预测（序列回归）。",
        "特征：DTW / Beam Search / 多尺度 NCC / 粒子滤波等多种匹配视角 + 信号处理与位置统计。",
        "建模：LightGBM + CatBoost 训练多个模型，使用 Hill Climbing 进行权重集成。",
        "后处理：全局缩放 + 随深度衰减校正 + 平滑，减少系统性偏差与抖动。",
      ],
      results_title: "结果展示",
      results_lead: "下列图示来自同一套实验数据：模型对比、集成权重、按井误差分布、特征重要性与相关性分析。",
      method_title: "方法（WGP）",
      pipeline_title: "Pipeline",
    },
    figures: {
      model_comparison: "模型 RMSE 对比",
      hc_ensemble: "Hill Climbing 集成权重",
      per_well: "按井误差分布",
      best_worst: "最佳/最差井案例",
      feature_importance: "特征重要性 Top",
      feature_correlation: "模型相关性矩阵",
    },
    method: {
      pipeline_code:
        "# WGP\n" +
        "# Feature Engineering → GBDT Training → Hill Climbing Ensemble → Post-Processing\n" +
        "\n" +
        "1) Matching features: DTW / Beam Search / multi-scale NCC / Particle Filter\n" +
        "2) Signal & positional stats: derivatives, envelopes, offsets, segment stats\n" +
        "3) Models: LightGBM + CatBoost (GroupKFold by well)\n" +
        "4) Ensemble: hill-climbing to find robust weights\n" +
        "5) Post-proc: scale + depth-decay correction + smoothing per well",
    },
  },
  en: {
    meta: {
      title: "Wellbore Geology Prediction | Project Page",
      description: "Wellbore Geology Prediction: TVT prediction for wellbore geology (bilingual project page).",
    },
    nav: {
      overview: "Overview",
      results: "Results",
      method: "Method",
      theme_light: "Light",
      theme_dark: "Dark",
      lang: "中文",
    },
    hero: {
      title: "Wellbore Geology Prediction",
      subtitle: "Wellbore Geology ML",
      tagline:
        "Predict True Vertical Thickness (TVT) at evaluation points using horizontal-well GR logs, type-well references, and known segment labels—plus model comparison and error analysis.",
    },
    kpi: {
      lb_label: "LB RMSE",
      oof_label: "OOF RMSE",
      wells_label: "Wells",
      features_label: "Features",
      train_label: "Train samples",
    },
    section: {
      overview_title: "Overview",
      value:
        "Goal: predict a stable TVT sequence under strong within-well correlation and notable cross-well variability. The approach builds multi-view matching features to align horizontal wells with type wells, learns feature reliability with GBDT, then improves robustness via ensembling and post-processing.",
      highlights: "Key points",
      highlights_items: [
        "Input: horizontal-well GR + type-well (GR, TVT) + known segment TVT.",
        "Output: TVT prediction at each evaluation point (sequence regression).",
        "Features: DTW / Beam Search / multi-scale NCC / particle filter + signal & positional statistics.",
        "Modeling: multiple LightGBM & CatBoost models with GroupKFold by well; hill-climbing ensembling.",
        "Post-processing: global scaling + depth-decay correction + smoothing to reduce bias and jitter.",
      ],
      results_title: "Results",
      results_lead:
        "Figures below are derived from the same experiment set: model comparison, ensemble weights, per-well errors, and feature importance/correlation analyses.",
      method_title: "Method (WGP)",
      pipeline_title: "Pipeline",
    },
    figures: {
      model_comparison: "Model RMSE comparison",
      hc_ensemble: "Hill-climbing ensemble weights",
      per_well: "Per-well error distribution",
      best_worst: "Best vs worst wells",
      feature_importance: "Top feature importance",
      feature_correlation: "Model correlation matrix",
    },
    method: {
      pipeline_code:
        "# WGP\n" +
        "# Feature Engineering → GBDT Training → Hill Climbing Ensemble → Post-Processing\n" +
        "\n" +
        "1) Matching features: DTW / Beam Search / multi-scale NCC / Particle Filter\n" +
        "2) Signal & positional stats: derivatives, envelopes, offsets, segment stats\n" +
        "3) Models: LightGBM + CatBoost (GroupKFold by well)\n" +
        "4) Ensemble: hill-climbing to find robust weights\n" +
        "5) Post-proc: scale + depth-decay correction + smoothing per well",
    },
  },
};
