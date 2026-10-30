# Veritas AI - Bi-LSTM Fake News Detection Backend (FastAPI)

Production-ready RESTful backend powered by FastAPI, SQLAlchemy, and a pre-trained Bidirectional Long Short-Term Memory (Bi-LSTM) deep learning model for real-time news veracity classification.

---

## 1. Prerequisites

- Python 3.10+
- Virtualenv or Conda
- TensorFlow 2.15+ or PyTorch (depending on model file format)

---

## 2. Installation & Setup

```bash
# 1. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Environment configuration
cp .env.example .env
```

---

## 3. Configuration Variables (`.env`)

```ini
MODEL_PATH="models/bilstm_fake_news.keras"
VOCAB_PATH="models/tokenizer_vocab.json"
DATABASE_URL="sqlite:///./veritas_fakenews.db" # Or postgresql://user:pass@localhost:5432/fakenews
JWT_SECRET="your-super-secure-jwt-secret-key-32-chars-min"
PORT=8000
```

---

## 4. Launching the Backend Server

```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive OpenAPI / Swagger Documentation will be accessible at:
- `http://localhost:8000/docs`
- Redoc: `http://localhost:8000/redoc`

---

## 5. Model Loading Lifecycle

- The pre-trained Bi-LSTM model is loaded **once** into memory during the FastAPI `lifespan` startup event, preventing costly disk re-reads per inference request.
- Uses exact vocabulary index mapping and text-cleaning pipelines:
  - Sequence truncation & padding (`max_len=128`, `padding='post'`).
  - Bidirectional forward and backward LSTM layer hidden state evaluation.
  - Sigmoid decision classification layer with configurable threshold (default `0.50`).
