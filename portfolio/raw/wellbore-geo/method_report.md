# WGP - Method Report
# Rogii Wellbore Geology Prediction Competition
# LB Score: 10.217 (RMSE)

## 1. Problem Description
Predict True Vertical Thickness (TVT) for horizontal well evaluation segments,
given known TVT values at the beginning of each well and corresponding type-well data.

Input: Horizontal well GR log + Type-well (GR, TVT) + Known segment TVT
Output: TVT at each evaluation point in the horizontal well

## 2. Method Overview: WGP

Pipeline: Feature Engineering -> GBDT Training -> Hill Climbing Ensemble -> Post-Processing

### 2.1 Feature Engineering (225 features from 6 matching methods)

#### Method 1: Dynamic Time Warping (DTW) - 27 features
- Multi-scale DTW alignment between HW GR and TW GR
- Stochastic DTW with random radius sampling (100 realizations)
- Features: alignment delta, path cost, spread, slope
- Standalone RMSE: 15.78

#### Method 2: Beam Search - 13 features
- Greedy search for optimal GR matching path
- Multiple beam widths (consensus, smooth, median variants)
- Features: beam_cons_d, beam_sm5_d, beam_med_d, beam_std_d
- Standalone RMSE: 18.45

#### Method 3: Multi-scale NCC - 11 features
- Normalized Cross-Correlation at window sizes 8, 15, 25
- Ensemble of scales with trust-weighted averaging
- Features: sc8_d, sc15_d, sc25_d, sc_ens_d, sc_cons_d
- Standalone RMSE: 18.13

#### Method 4: Particle Filter - 21 features
- Monte Carlo particle filter with Bayesian state update
- Uses ANCC (Above Nearest Common Curve) as observation model
- Features: pf_ancc_delta, pf_z_delta, pf_rmse
- Standalone RMSE: 18.13

#### Method 5: Formation Plane KNN - 32 features
- K-Nearest Neighbors on formation plane (spatial interpolation)
- Uses nearby wells' formation depth as reference
- Features: form_mean_d, form_std_d, form_n_neighbors

#### Method 6: Dense ANCC KNN - 11 features
- Dense interpolation of ANCC values using KNN
- Features: tvt_densew_d, tvt_dense_d, dense_rmse, dense_bias
- Standalone RMSE: 20.13

#### Additional Features
- GR signal processing: energy, envelope, derivatives (1st/2nd order)
- Positional: md_since, frac, dz, dxy, dzdmd
- Known segment statistics: length, TVT range, TVT std, slope
- Lead-lag features at multiple offsets

### 2.2 GBDT Models (9 models from 3 families)

LightGBM (3 configs):
  - lightgbm-1: OOF RMSE = 10.62
  - lightgbm-2: OOF RMSE = 10.78
  - lightgbm-3: OOF RMSE = 10.85

CatBoost (3 configs):
  - catboost-1: OOF RMSE = 10.55
  - catboost-2: OOF RMSE = 10.47 (BEST single model)
  - catboost-3: OOF RMSE = 10.68

XGBoost (3 configs):
  - xgboost-1: OOF RMSE = 10.72
  - xgboost-2: OOF RMSE = 10.69
  - xgboost-3: OOF RMSE = 10.81

All models use 5-fold GroupKFold (grouped by well ID)

### 2.3 Hill Climbing Ensemble
- Iterative forward selection of best model combinations
- Final weights: CatBoost-2 (66.67%) + LightGBM-1 (33.33%)
- HC OOF RMSE: 10.40

### 2.4 Post-Processing (Optuna-optimized)
Parameters:
  - alpha = 1.065 (global scaling)
  - tau = 90 (MD decay time constant)
  - w_pf = 0.065 (particle filter blend weight)

Formula:
  pred_delta_corrected = alpha * (HC_delta * (1 - w_pf) + PF_delta * w_pf)
                         * (1 - exp(-md_since / tau))

Followed by Savitzky-Golay smoothing (window=17, poly=3) per well

## 3. Score Progression

| Version | Method | OOF RMSE | LB RMSE | Improvement |
|---------|--------|----------|---------|-------------|
| V52 | CatBoost single | - | 12.361 | baseline |
| V64a | 3xCatBoost + HC | 11.156 | 10.896 | -1.465 |
| WGP | LGB+CB + 6 methods + HC + PP | 10.402 | 10.217 | -0.679 |
| **Total** | | | | **-2.144** |

## 4. Key Insights

1. Diversity beats accuracy: 6 different matching methods with low correlation
   provide more value than optimizing any single method.

2. DTW is the best standalone method (RMSE 15.78) but GBDT learns when to
   trust each method, achieving 10.40 (34% better).

3. Post-processing with Optuna provides additional 0.3-0.5 improvement by
   correcting systematic biases.

4. GroupKFold by well is critical - random split causes severe overfitting
   due to high within-well correlation.

5. The gap between OOF (10.40) and LB (10.22) suggests test set may have
   slightly easier wells or the PP generalizes well.

## 5. File Structure

viz_data.json  - Visualization data
  - meta: project metadata and scores
  - timeline: score progression
  - model_performance: per-model RMSE, HC weights, correlation matrix
  - per_well_stats: RMSE per well (773 wells)
  - error_analysis: error distribution histogram and statistics
  - feature_importance: top 30 features from CatBoost-2
  - scatter_data: 50K sampled actual vs predicted points
  - methods: description of each matching method
  - post_processing: PP parameters

training_pipeline.py         - Complete training pipeline
kaggle_inference.py          - Kaggle inference kernel
submission.csv               - Final submission (LB 10.217)
