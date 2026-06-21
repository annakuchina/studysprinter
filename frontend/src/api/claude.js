const BACKEND_URL = "http://localhost:8000";

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
  return response.json();
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
