/* Breast US dual-task page bilingual copy (CN/EN) */
window.BREASTUS_I18N = {
  zh: {
    meta: {
      title: "乳腺超声｜跨域分类+分割的双主干解耦学习",
      description:
        "Breast US：BUSBRA→BUSI 跨域设置下，分类+分割（含边缘头）的双主干解耦网络展示页（中英双语）",
    },
    nav: {
      overview: "概览",
      results: "结果",
      method: "方法",
      sources: "材料",
      theme_light: "亮色",
      theme_dark: "暗色",
      lang: "EN",
    },
    hero: {
      title: "Breast US Dual-Task",
      subtitle: "Cross-domain classification + segmentation (mask + edge)",
      tagline:
        "在 BUSBRA→BUSI 的跨域设置下，用“冻结分类 ViT + 权重复制的分割 ViT-UNet”实现解耦学习与更稳健的跨域分割。",
    },
    kpi: {
      k1_label: "跨域设置",
      k1_value: "BUSBRA → BUSI",
      k2_label: "分类 AUC",
      k2_value: "0.9038",
      k3_label: "分割 Dice / IoU",
      k3_value: "0.6902 / 0.5986",
      k4_label: "可训练参数",
      k4_value: "34.6M",
      k5_label: "推理策略",
      k5_value: "5-fold ensemble",
    },
    section: {
      overview_title: "概览",
      value:
        "价值：乳腺超声 CAD 常见的跨域性能退化，很大程度来自设备差异与任务冲突（分类追求全局不变性，分割需要精确定位）。实验表明，若直接用 UNet 在源域做分割训练，模型容易吸收设备相关纹理/噪声模式而发生域过拟合，跨域到目标域时分割性能会显著崩塌。本项目采用冻结的 ViT 分类分支保持域不变语义表征，同时将该分支在超声域学到的 ViT 权重复制到分割编码器并接 UNet 解码器，以“域内知识迁移”增强跨域分割的可用性；并辅以边缘头提升边界表达与可解释性。",
      highlights: "要点",
      highlights_items: [
        "双主干解耦：分类分支为 ViT-B/16（完全冻结）；分割分支为 ViT-B/16 编码器 + UNet 解码器（仅微调 ViT 后 4 层）。",
        "权重复制迁移：将分类分支在超声域训练得到的 ViT 权重复制到分割编码器初始化，避免从 ImageNet 冷启动。",
        "域过拟合风险：直接训练 UNet 分割容易过拟合源域设备特征，导致跨域分割性能极差；权重复制能显著缓解这一问题。",
        "双输出（mask + edge）：UNet 解码器逐级上采样恢复空间细节，同时预测掩膜与边缘概率图。",
        "跨域评估：BUSBRA 训练、BUSI 独立测试；5 折交叉验证与概率平均集成推理。",
      ],
      results_title: "结果展示",
      figures_title: "关键图",
      gallery_title: "可视化与分析",
      method_title: "方法细节",
      sources_title: "材料与链接",
      sources_items: [
        { label: "报告（PDF）", href: "./report.html" },
      ],
    },
  },
  en: {
    meta: {
      title: "Breast US | Dual-backbone decoupled learning",
      description:
        "Breast ultrasound cross-domain dual-task (classification + segmentation with edge head) bilingual project page.",
    },
    nav: {
      overview: "Overview",
      results: "Results",
      method: "Method",
      sources: "Sources",
      theme_light: "Light",
      theme_dark: "Dark",
      lang: "中文",
    },
    hero: {
      title: "Breast US Dual-Task",
      subtitle: "Cross-domain classification + segmentation (mask + edge)",
      tagline:
        "In a BUSBRA→BUSI setting, a frozen ViT classifier and a weight-copied ViT-UNet segmenter enable decoupled learning and stronger cross-domain segmentation.",
    },
    kpi: {
      k1_label: "Setting",
      k1_value: "BUSBRA → BUSI",
      k2_label: "Classification AUC",
      k2_value: "0.9038",
      k3_label: "Segmentation Dice / IoU",
      k3_value: "0.6902 / 0.5986",
      k4_label: "Trainable params",
      k4_value: "34.6M",
      k5_label: "Inference",
      k5_value: "5-fold ensemble",
    },
    section: {
      overview_title: "Overview",
      value:
        "Value: cross-domain degradation in breast ultrasound CAD is often driven by device shift and task conflict (classification favors global invariance, while segmentation requires precise localization). Experiments show that training a UNet segmenter directly on the source domain can overfit device-specific textures/noise patterns, leading to severe cross-domain failure. We keep a frozen ViT classification branch for domain-invariant semantics, and copy its ultrasound-trained ViT weights to initialize the segmentation encoder with a UNet decoder—leveraging in-domain knowledge transfer for stronger cross-domain segmentation. An auxiliary edge head further stabilizes boundary modeling and interpretability.",
      highlights: "Key points",
      highlights_items: [
        "Decoupled dual-backbone: ViT-B/16 classifier (fully frozen); ViT-B/16 encoder + UNet decoder for segmentation (fine-tune last 4 ViT blocks).",
        "Weight-copy transfer: initialize the segmentation ViT encoder by copying the classifier’s ultrasound-trained ViT weights, instead of ImageNet-only warm start.",
        "Domain overfitting: a directly trained UNet segmenter tends to overfit the source domain and performs poorly cross-domain; weight-copy transfer mitigates this failure mode.",
        "Dual outputs (mask + edge): a 4-stage UNet decoder restores spatial details and predicts both lesion mask and edge probability map.",
        "Cross-domain protocol: trained on BUSBRA and evaluated on BUSI with 5-fold CV and probability-averaged ensemble inference.",
      ],
      results_title: "Results",
      figures_title: "Key figures",
      gallery_title: "Qualitative & analysis",
      method_title: "Method details",
      sources_title: "Materials",
      sources_items: [
        { label: "Report (PDF)", href: "./report.html" },
      ],
    },
  },
};
