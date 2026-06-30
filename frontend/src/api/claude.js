import { supabase } from "../supabase";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export async function deleteAccount() {
  const authHeader = await getAuthHeader();
  const response = await fetch(`${BACKEND_URL}/account`, {
    method: "DELETE",
    headers: { ...authHeader },
  });
  if (!response.ok) throw new Error("Failed to delete account");
  return response.json();
}

async function getAuthHeader() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

export async function generateStudySet(notes, title) {
  const authHeader = await getAuthHeader();
  const response = await fetch(`${BACKEND_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader },
    body: JSON.stringify({ notes, title }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Backend request failed");
  }
  return response.json();
}

export async function getStudySets() {
  const authHeader = await getAuthHeader();
  const response = await fetch(`${BACKEND_URL}/study-sets`, {
    headers: { ...authHeader },
  });
  if (!response.ok) throw new Error("Failed to fetch study sets");
  return response.json();
}

export async function getStudySet(id) {
  const authHeader = await getAuthHeader();
  const response = await fetch(`${BACKEND_URL}/study-sets/${id}`, {
    headers: { ...authHeader },
  });
  if (!response.ok) throw new Error("Failed to fetch study set");
  return response.json();
}

export async function deleteStudySet(id) {
  const authHeader = await getAuthHeader();
  const response = await fetch(`${BACKEND_URL}/study-sets/${id}`, {
    method: "DELETE",
    headers: { ...authHeader },
  });
  if (!response.ok) throw new Error("Failed to delete study set");
  return response.json();
}

export async function togglePin(id) {
  const authHeader = await getAuthHeader();
  const response = await fetch(`${BACKEND_URL}/study-sets/${id}/pin`, {
    method: "PATCH",
    headers: { ...authHeader },
  });
  if (!response.ok) throw new Error("Failed to toggle pin");
  return response.json();
}

export async function getDeckStats(id) {
  const authHeader = await getAuthHeader();
  const response = await fetch(`${BACKEND_URL}/study-sets/${id}/stats`, {
    headers: { ...authHeader },
  });
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
}

export async function recordStats(id, quizScore, cardsReviewed) {
  const authHeader = await getAuthHeader();
  const response = await fetch(`${BACKEND_URL}/study-sets/${id}/stats`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader },
    body: JSON.stringify({
      quiz_score: quizScore,
      cards_reviewed: cardsReviewed,
    }),
  });
  if (!response.ok) throw new Error("Failed to record stats");
  return response.json();
}
