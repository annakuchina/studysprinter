const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export async function generateStudySet(notes, title) {
  const response = await fetch(`${BACKEND_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes, title }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Backend request failed");
  }
  const data = await response.json();
  return data;
}

export async function getStudySets() {
  const response = await fetch(`${BACKEND_URL}/study-sets`);
  if (!response.ok) throw new Error("Failed to fetch study sets");
  return response.json();
}

export async function getStudySet(id) {
  const response = await fetch(`${BACKEND_URL}/study-sets/${id}`);
  if (!response.ok) throw new Error("Failed to fetch study set");
  return response.json();
}

export async function deleteStudySet(id) {
  const response = await fetch(`${BACKEND_URL}/study-sets/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete study set");
  return response.json();
}

export async function togglePin(id) {
  const response = await fetch(`${BACKEND_URL}/study-sets/${id}/pin`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Failed to toggle pin");
  return response.json();
}

export async function getDeckStats(id) {
  const response = await fetch(`${BACKEND_URL}/study-sets/${id}/stats`);
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
}

export async function recordStats(id, quizScore, cardsReviewed) {
  const response = await fetch(`${BACKEND_URL}/study-sets/${id}/stats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quiz_score: quizScore,
      cards_reviewed: cardsReviewed,
    }),
  });
  if (!response.ok) throw new Error("Failed to record stats");
  return response.json();
}
