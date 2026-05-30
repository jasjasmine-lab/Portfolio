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
      k5_value: "≈ 0.88",
    },
    section: {
      overview_title: "摘要与亮点",
      highlights: "亮点",
      highlights_items: [
        "构建并清洗全球专利语料与监管批准数据，建立“专利↔产品”匹配与转化标签体系。",
        "融合结构化统计特征与文本语义特征（BGE embedding），兼顾可解释与可泛化。",
        "采用 LightGBM 多分类分级预测，并通过类别不平衡策略提升“高潜力（Q1）”识别能力。",
        "提供可复现命令行工具：输出分级标签与 screening_score（非低转化概率）用于快速筛选。",
      ],
      results_title: "结果",
      table1_title: "Table 1｜转化强度分层统计",
      table3_title: "Table 3｜预测性能",
      method_title: "方法细节",
      reproducibility_title: "复现与使用",
      sources_title: "材料与链接",
      sources_items: [
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
      k5_value: "≈ 0.88",
    },
    section: {
      overview_title: "Summary & Highlights",
      highlights: "Highlights",
      highlights_items: [
        "Built a global patent corpus and curated regulatory approvals; established patent↔product matching and translation labels.",
        "Combined structured statistical features with semantic text embeddings (BGE) for both interpretability and generalization.",
        "Used LightGBM multi-class grading with class balancing to improve identification of high-potential patents (Q1).",
        "Delivered a reproducible CLI: predicted grade + screening_score (probability of being any translated class) for practical filtering.",
      ],
      results_title: "Results",
      table1_title: "Table 1 | Translation intensity stratification",
      table3_title: "Table 3 | Predictive performance",
      method_title: "Method details",
      reproducibility_title: "Reproducibility",
      sources_title: "Materials",
      sources_items: [
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
