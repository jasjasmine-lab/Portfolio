# Patent Conversion Multi-Class Predictor

This package provides a **4-Class Classification Model** ("低/中/偏高/高转化") for patent conversion potential prediction.

It uses a **Single-Stage** architecture with **Enriched Features** (Semantic + Statistical) and **Class Balancing**, which has been proven to offer the best balance of accuracy, recall, and safety.

## Installation

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Training

To train the model on your full dataset (including non-converted patents):

```bash
python patent_multi_predictor.py --mode train --input path/to/data.xlsx --model my_model.pkl --device cuda
```

- **Input Data**: Must be an Excel file with columns: `title`, `abstract`, `IPC主分类`, and `转化潜力` (target).
- **Device**: Use `--device cuda` for GPU acceleration (highly recommended).

### Prediction

To predict conversion grades for new patents:

```bash
python patent_multi_predictor.py --mode predict --input path/to/new_data.xlsx --model my_model.pkl --output results.xlsx --device cuda
```

- **Output**: An Excel file containing:
    - `pred_label`: Predicted grade (低转化/中转化/偏高转化/高转化)
    - `prob_*`: Probability for each class
    - `screening_score`: Probability of being ANY converted class (useful for filtering)

## Model Performance (Weighted Metrics)

- **Accuracy**: ~85%
- **F1-Score**: ~0.81
- **AUC-ROC**: ~0.88
