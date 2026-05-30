import pandas as pd
import numpy as np
import lightgbm as lgb
from sentence_transformers import SentenceTransformer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os
import argparse
import warnings

warnings.filterwarnings('ignore')

class PatentMultiPredictor:
    def __init__(self, model_path=None, device='cpu'):
        self.device = device
        self.model = None
        self.bge_model = None
        self.class_names = ['低转化', '中转化', '偏高转化', '高转化']
        
        if model_path and os.path.exists(model_path):
            self.load_model(model_path)
            
    def load_bge(self):
        if self.bge_model is None:
            print("Loading BGE model...")
            # Auto-download if not found locally
            self.bge_model = SentenceTransformer('BAAI/bge-large-zh-v1.5', device=self.device)
            
    def feature_engineering(self, df):
        print("Processing statistical features...")
        # Text Length
        df['title_len'] = df['title'].fillna('').astype(str).apply(len)
        df['abstract_len'] = df['abstract'].fillna('').astype(str).apply(len)
        if 'claim' in df.columns:
            df['claim_len'] = df['claim'].fillna('').astype(str).apply(len)
        elif '权利要求' in df.columns:
            df['claim_len'] = df['权利要求'].fillna('').astype(str).apply(len)
        else:
            df['claim_len'] = 0
            
        # Missing counts
        df['missing_cnt'] = df.isnull().sum(axis=1)
        
        # IPC Count
        if 'IPC主分类' in df.columns:
            df['ipc_count'] = df['IPC主分类'].fillna('').astype(str).apply(lambda x: len(x.split(';')) if x else 0)
        else:
            df['ipc_count'] = 0
            
        # Patent Age
        if '申请日' in df.columns:
            df['app_year'] = pd.to_datetime(df['申请日'], errors='coerce').dt.year
            df['patent_age'] = 2025 - df['app_year'].fillna(2020)
        else:
            df['patent_age'] = 0
            
        # Categorical Encoding
        cat_features = ['IPC主分类', 'CPC', '专利类型', '国民经济行业(主)', '新兴产业(主)', '申请人类型']
        num_features = ['title_len', 'abstract_len', 'claim_len', 'missing_cnt', 'ipc_count', 'patent_age']
        
        X_feat = pd.DataFrame(index=df.index)
        for col in cat_features:
            if col in df.columns:
                X_feat[col] = df[col].astype('category').cat.codes
            else:
                X_feat[col] = -1
                
        for col in num_features:
            X_feat[col] = df[col].fillna(0)
            
        # BGE Embeddings
        self.load_bge()
        print("Generating embeddings...")
        texts = (df['title'].fillna('').astype(str) + " " + df['abstract'].fillna('').astype(str)).tolist()
        embs = self.bge_model.encode(texts, show_progress_bar=True, batch_size=32, normalize_embeddings=True)
        X_emb = pd.DataFrame(embs, columns=[f'emb_{i}' for i in range(embs.shape[1])], index=df.index)
        
        return pd.concat([X_feat, X_emb], axis=1)

    def train(self, data_path, target_col='转化潜力', save_path='patent_multi_model.pkl'):
        print(f"Loading data from {data_path}...")
        df = pd.read_excel(data_path, engine='openpyxl')
        
        # Define Target (0=Low, 1=Med, 2=HighMid, 3=High)
        def get_label(row):
            pot = str(row[target_col])
            if pot == '中转化': return 1
            elif pot == '偏高转化': return 2
            elif pot == '高转化': return 3
            else: return 0 # Includes Low and NaN

        df['target_idx'] = df.apply(get_label, axis=1)
        y = df['target_idx'].values
        
        X = self.feature_engineering(df)
        
        print("Splitting data...")
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
        
        print("Training LightGBM (4-Class)...")
        dtrain = lgb.Dataset(X_train, label=y_train)
        dtest = lgb.Dataset(X_test, label=y_test, reference=dtrain)
        
        params = {
            'objective': 'multiclass',
            'num_class': 4,
            'metric': 'multi_logloss',
            'verbosity': -1,
            'boosting_type': 'gbdt',
            'class_weight': 'balanced',
            'learning_rate': 0.03,
            'num_leaves': 31,
            'seed': 42
        }
        
        if self.device == 'cuda':
            params.update({'device': 'gpu', 'gpu_platform_id': 0, 'gpu_device_id': 0})
            
        self.model = lgb.train(
            params,
            dtrain,
            num_boost_round=1000,
            valid_sets=[dtrain, dtest],
            valid_names=['train', 'valid'],
            callbacks=[lgb.early_stopping(100), lgb.log_evaluation(100)]
        )
        
        # Evaluation
        y_pred_prob = self.model.predict(X_test)
        y_pred = np.argmax(y_pred_prob, axis=1)
        
        print("\nEvaluation:")
        print(f"Accuracy: {accuracy_score(y_test, y_pred):.4%}")
        print(classification_report(y_test, y_pred, target_names=self.class_names, digits=4))
        
        print(f"Saving model to {save_path}...")
        joblib.dump(self.model, save_path)
        
    def predict(self, data_path, output_path='predictions.xlsx'):
        if self.model is None:
            raise ValueError("Model not loaded or trained.")
            
        print(f"Loading data for inference from {data_path}...")
        df = pd.read_excel(data_path, engine='openpyxl')
        X = self.feature_engineering(df)
        
        print("Predicting...")
        probs = self.model.predict(X) # [n, 4]
        preds = np.argmax(probs, axis=1)
        
        # Add results
        df['pred_label'] = [self.class_names[p] for p in preds]
        df['prob_low'] = probs[:, 0]
        df['prob_med'] = probs[:, 1]
        df['prob_high_mid'] = probs[:, 2]
        df['prob_high'] = probs[:, 3]
        
        # Add 'Screening Score' (Prob NOT Low)
        df['screening_score'] = probs[:, 1] + probs[:, 2] + probs[:, 3]
        
        df.to_excel(output_path, index=False)
        print(f"Predictions saved to {output_path}")

    def load_model(self, path):
        print(f"Loading model from {path}...")
        self.model = joblib.load(path)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Patent Conversion Multi-Class Predictor")
    parser.add_argument('--mode', type=str, choices=['train', 'predict'], required=True, help='Mode: train or predict')
    parser.add_argument('--input', type=str, required=True, help='Input Excel file path')
    parser.add_argument('--output', type=str, default='multi_predictions.xlsx', help='Output file path (for predict mode)')
    parser.add_argument('--model', type=str, default='patent_multi_model.pkl', help='Model file path')
    parser.add_argument('--device', type=str, default='cpu', choices=['cpu', 'cuda'], help='Device for embeddings')
    
    args = parser.parse_args()
    
    predictor = PatentMultiPredictor(device=args.device)
    
    if args.mode == 'train':
        predictor.train(args.input, save_path=args.model)
    else:
        predictor.load_model(args.model)
        predictor.predict(args.input, output_path=args.output)
