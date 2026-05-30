/* RoboTRAC bilingual copy (CN/EN) */
window.ROBOTRAC_I18N = {
  zh: {
    meta: {
      title: "RoboTRAC｜专利到临床转化潜力预测",
      description:
        "RoboTRAC：基于专利文本语义与结构化特征的临床转化潜力分级预测（中英双语项目页）",
    },
    nav: {
      overview: "概览",
      results: "结果",
      method: "方法",
      reproducibility: "复现",
      sources: "材料",
      theme_light: "亮色",
      theme_dark: "暗色",
      lang: "EN",
    },
    hero: {
      title: "RoboTRAC",
      subtitle: "Robotic Translational Assessment for Clinical Impact",
      tagline:
        "从专利到监管批准：预测手术机器人技术的临床转化概率与“高潜力”分级。",
    },
    kpi: {
      k1_label: "专利语料",
      k1_value: "39,629 件 / 102 个国家",
      k2_label: "监管记录",
      k2_value: "30,016 条（FDA + NMPA）",
      k3_label: "Q1 高潜力 AUC",
      k3_value: "0.839",
      k4_label: "Q1 高潜力 F1",
      k4_value: "0.611",
      k5_label: "加权 AUC",
      k5_value: "0.88",
    },
    section: {
      overview_title: "概览",
      value:
        "价值：专利阶段的信息往往早于临床与监管落地，研发决策缺少可量化的早期参考。RoboTRAC 将专利级特征映射到“转化/潜力分层”的预测输出，用于筛选更可能落地的技术方向，并为后续评估与资源分配提供依据。",
      highlights: "亮点",
      highlights_items: [
        "任务：从专利级特征预测“是否转化”，并给出 Q1–Q4 四级潜力分层。",
        "特征：结构化字段（IPC/CPC、专利类型、申请日等）+ 文本语义向量（BGE）。",
        "模型：LightGBM 四分类（class_weight=balanced），输出每一类概率。",
        "交付：CLI + Excel 输入输出；提供 pred_label、prob_* 与 screening_score 便于筛选。",
      ],
      results_title: "结果",
      table1_title: "Table 1｜转化强度分层统计",
      table3_title: "Table 3｜预测性能",
      method_title: "方法细节",
      reproducibility_title: "复现与使用",
      sources_title: "材料与链接",
      sources_items: [
        {
          label: "论文（Word）",
          href: "./paper.html",
        },
        {
          label: "README",
          href: "./readme.html",
        },
        {
          label: "源代码",
          href: "./code.html",
        },
        {
          label: "requirements",
          href: "./requirements.html",
        },
      ],
    },
    blocks: {
      fig1_caption: "Fig.1｜Protocol",
      features_title: "特征工程",
      features_list: [
        "文本：title + abstract 拼接后做 BGE embedding（BAAI/bge-large-zh-v1.5）",
        "统计：title_len / abstract_len / claim_len / missing_cnt / ipc_count / patent_age",
        "类别编码：IPC主分类、CPC、专利类型、行业、新兴产业、申请人类型（cat codes）",
      ],
      model_title: "模型与训练",
      model_list: [
        "LightGBM：objective=multiclass，num_class=4",
        "类别不平衡：class_weight='balanced'",
        "early stopping + log evaluation（训练集/验证集 80/20，seed=42）",
      ],
      io_title: "输入/输出字段",
      io_in: "输入 Excel 必含列：title、abstract、IPC主分类、转化潜力（训练时为 target）",
      io_out:
        "输出列：pred_label（低/中/偏高/高转化）、prob_*（各类概率）、screening_score（非低转化概率和）",
      cmd_train: "训练（train）",
      cmd_predict: "预测（predict）",
      copy: "复制",
      copied: "已复制",
    },
  },
  en: {
    meta: {
      title: "RoboTRAC | Patent-to-clinic translation prediction",
      description:
        "RoboTRAC: grading clinical translation potential from patents with structured + semantic features (bilingual project page).",
    },
    nav: {
      overview: "Overview",
      results: "Results",
      method: "Method",
      reproducibility: "Repro",
      sources: "Sources",
      theme_light: "Light",
      theme_dark: "Dark",
      lang: "中文",
    },
    hero: {
      title: "RoboTRAC",
      subtitle: "Robotic Translational Assessment for Clinical Impact",
      tagline:
        "From patents to regulatory clearance: estimating translation probability and graded clinical potential (Q1–Q4).",
    },
    kpi: {
      k1_label: "Patent corpus",
      k1_value: "39,629 patents / 102 countries",
      k2_label: "Regulatory records",
      k2_value: "30,016 (FDA + NMPA)",
      k3_label: "Q1 AUC",
      k3_value: "0.839",
      k4_label: "Q1 F1",
      k4_value: "0.611",
      k5_label: "Weighted AUC",
      k5_value: "0.88",
    },
    section: {
      overview_title: "Overview",
      value:
        "Value: decisions are often made at the patent stage, long before clinical adoption and regulatory clearance, yet early quantitative signals are limited. RoboTRAC turns patent-level features into translation and graded-potential predictions to support early screening and downstream evaluation and prioritization.",
      highlights: "Highlights",
      highlights_items: [
        "Task: predict translation (binary) and grade clinical potential into four ordered levels (Q1–Q4).",
        "Features: structured fields (IPC/CPC, patent type, application date, etc.) + semantic text embeddings (BGE).",
        "Model: LightGBM 4-class classifier (class_weight=balanced) with per-class probabilities.",
        "Deliverable: CLI + Excel I/O with pred_label, prob_* and screening_score for downstream filtering.",
      ],
      results_title: "Results",
      table1_title: "Table 1 | Translation intensity stratification",
      table3_title: "Table 3 | Predictive performance",
      method_title: "Method details",
      reproducibility_title: "Reproducibility",
      sources_title: "Materials",
      sources_items: [
        {
          label: "Paper (Word)",
          href: "./paper.html",
        },
        {
          label: "README",
          href: "./readme.html",
        },
        {
          label: "Source code",
          href: "./code.html",
        },
        {
          label: "requirements",
          href: "./requirements.html",
        },
      ],
    },
    blocks: {
      fig1_caption: "Fig.1 | Protocol",
      features_title: "Feature engineering",
      features_list: [
        "Text: BGE embedding (BAAI/bge-large-zh-v1.5) on concatenated title + abstract",
        "Stats: title_len / abstract_len / claim_len / missing_cnt / ipc_count / patent_age",
        "Categoricals: IPC main class, CPC, patent type, industry, emerging industry, applicant type (category codes)",
      ],
      model_title: "Model & training",
      model_list: [
        "LightGBM multiclass: objective=multiclass, num_class=4",
        "Class imbalance: class_weight='balanced'",
        "Early stopping + evaluation logging (80/20 split, seed=42)",
      ],
      io_title: "Input / output schema",
      io_in:
        "Input Excel columns: title, abstract, IPC主分类, 转化潜力 (target for training)",
      io_out:
        "Outputs: pred_label (4 grades), prob_* (per-class probabilities), screening_score (sum of non-low probabilities)",
      cmd_train: "Train",
      cmd_predict: "Predict",
      copy: "Copy",
      copied: "Copied",
    },
  },
};
