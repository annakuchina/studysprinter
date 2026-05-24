from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from supabase import create_client, Client
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="StudyAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)


class NotesRequest(BaseModel):
    notes: str
    title: str = "Untitled Study Set"


class Flashcard(BaseModel):
    q: str
    a: str


class QuizQuestion(BaseModel):
    q: str
    options: list[str]
    correct: int


class StudySetResponse(BaseModel):
    id: str
    title: str
    summary: str
    flashcards: list[Flashcard]
    quiz: list[QuizQuestion]


@app.get("/")
def root():
    return {"status": "StudyAI backend is running"}


@app.post("/generate", response_model=StudySetResponse)
def generate_study_set(body: NotesRequest):
    if not body.notes.strip():
        raise HTTPException(status_code=400, detail="Notes cannot be empty")

    prompt = f"""You are a study assistant. Given these notes, return ONLY valid JSON with this exact structure:
{{
  "summary": "3-4 sentence plain-English summary of the key concepts",
  "flashcards": [
    {{"q": "question", "a": "answer"}},
    {{"q": "question", "a": "answer"}},
    {{"q": "question", "a": "answer"}},
    {{"q": "question", "a": "answer"}},
    {{"q": "question", "a": "answer"}}
  ],
  "quiz": [
    {{"q": "Multiple choice question?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 0}},
    {{"q": "Multiple choice question?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 1}},
    {{"q": "Multiple choice question?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 2}},
    {{"q": "Multiple choice question?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 3}},
    {{"q": "Multiple choice question?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 0}}
  ]
}}

Notes:
{body.notes}"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            max_tokens=1500,
        )
        data = json.loads(response.choices[0].message.content)

        study_set = supabase.table("study_sets").insert({
            "title": body.title,
            "notes": body.notes,
            "summary": data["summary"]
        }).execute()

        study_set_id = study_set.data[0]["id"]

        flashcards_to_insert = [
            {"study_set_id": study_set_id, "question": fc["q"], "answer": fc["a"], "position": i}
            for i, fc in enumerate(data["flashcards"])
        ]
        supabase.table("flashcards").insert(flashcards_to_insert).execute()

        quiz_to_insert = [
            {"study_set_id": study_set_id, "question": q["q"], "options": q["options"], "correct_index": q["correct"], "position": i}
            for i, q in enumerate(data["quiz"])
        ]
        supabase.table("quiz_questions").insert(quiz_to_insert).execute()

        return {
            "id": study_set_id,
            "title": body.title,
            "summary": data["summary"],
            "flashcards": data["flashcards"],
            "quiz": data["quiz"]
        }

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/study-sets")
def get_study_sets():
    result = supabase.table("study_sets").select("id, title, summary, created_at").order("created_at", desc=True).execute()
    return result.data


@app.get("/study-sets/{study_set_id}")
def get_study_set(study_set_id: str):
    study_set = supabase.table("study_sets").select("*").eq("id", study_set_id).single().execute()
    flashcards = supabase.table("flashcards").select("*").eq("study_set_id", study_set_id).order("position").execute()
    quiz = supabase.table("quiz_questions").select("*").eq("study_set_id", study_set_id).order("position").execute()

    return {
        "id": study_set.data["id"],
        "title": study_set.data["title"],
        "summary": study_set.data["summary"],
        "notes": study_set.data["notes"],
        "flashcards": [{"q": fc["question"], "a": fc["answer"]} for fc in flashcards.data],
        "quiz": [{"q": q["question"], "options": q["options"], "correct": q["correct_index"]} for q in quiz.data]
    }


@app.delete("/study-sets/{study_set_id}")
def delete_study_set(study_set_id: str):
    supabase.table("study_sets").delete().eq("id", study_set_id).execute()
    return {"status": "deleted"}