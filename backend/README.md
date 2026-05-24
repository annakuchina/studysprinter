# StudyAI — Python FastAPI Backend

REST API that takes user notes and returns AI-generated summaries, flashcards, and quizzes using OpenAI.

## Stack
- **Python 3.10+**
- **FastAPI** — modern async web framework
- **OpenAI API** — gpt-4o-mini for cost-efficient generation
- **Pydantic** — request/response validation
- **Uvicorn** — ASGI server

## Setup

### 1. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Add your OpenAI API key
Edit `.env`:
```
OPENAI_API_KEY=sk-proj-your-key-here
```

### 4. Run
```bash
uvicorn main:app --reload
```

API runs at **http://localhost:8000**
Interactive docs at **http://localhost:8000/docs**

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| POST | `/generate` | Generate study set from notes |

### POST /generate

Request:
```json
{
  "notes": "Your study notes here..."
}
```

Response:
```json
{
  "summary": "AI-generated summary...",
  "flashcards": [
    { "q": "Question?", "a": "Answer" }
  ],
  "quiz": [
    {
      "q": "Question?",
      "options": ["A", "B", "C", "D"],
      "correct": 0
    }
  ]
}
```

## Interview Talking Points
- "I used FastAPI's Pydantic models to validate both request and response shapes"
- "The `response_format: json_object` parameter guarantees valid JSON from OpenAI"
- "CORS middleware restricts API access to the frontend origin only"
- "The virtual environment isolates dependencies per project"
