import React, { useState } from "react";
import { generateStudySet } from "../api/claude";

const EXAMPLE_NOTES = `Big O Notation is used to describe the performance or complexity of an algorithm, specifically how runtime or space requirements grow as the input size increases.

Common complexities from fastest to slowest:

O(1) Constant time: the operation takes the same time regardless of input size. Example: accessing an array element by index.

O(log n) Logarithmic: runtime grows slowly as input grows. Example: binary search.

O(n) Linear: runtime grows proportionally with input size. Example: iterating through an array.

O(n log n) Linearithmic: common in efficient sorting algorithms. Example: merge sort and quicksort.

O(n²) Quadratic: runtime grows with the square of input size. Example: nested loops and bubble sort.

O(2^n) Exponential: runtime doubles with each additional input. Example: recursive fibonacci.

Key rules:
Drop constants so O(2n) simplifies to O(n).
Drop non-dominant terms so O(n² + n) simplifies to O(n²).
Different inputs use different variables so O(a + b) not O(n + n).

Space complexity follows the same notation but measures memory usage instead of time.`;

const ERRORS = {
  noTitle: "Give your deck a name before generating.",
  network:
    "Couldn't connect to the backend. Make sure it's running with uvicorn main:app --reload",
  parse: "Something went wrong processing the response. Try again.",
  default: "Something went wrong. Try again in a moment.",
};

export default function InputTab({
  notes,
  onNotesChange,
  onStudySetGenerated,
  onGoToFlashcards,
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleGenerate() {
    if (!title.trim()) {
      setError(ERRORS.noTitle);
      return;
    }
    if (notes.trim().length < 100) {
      setError(
        `Add a bit more content to your notes. You have ${notes.trim().length} characters, aim for at least 100.`,
      );
      return;
    }
    setError("");
    setLoading(true);
    setSummary("");
    setDone(false);
    try {
      const result = await generateStudySet(notes, title.trim());
      setSummary(result.summary);
      setDone(true);
      onStudySetGenerated(result);
    } catch (e) {
      if (
        e.message.includes("fetch") ||
        e.message.includes("network") ||
        e.message.includes("Failed")
      ) {
        setError(ERRORS.network);
      } else if (e.message.includes("JSON")) {
        setError(ERRORS.parse);
      } else {
        setError(e.message || ERRORS.default);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <div className="card-label">Deck Name</div>
        <input
          className="deck-name-input"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          placeholder="e.g. Big O Notation, Week 3 Lecture..."
        />
        {error === ERRORS.noTitle && <p className="error-msg">{error}</p>}
      </div>

      <div className="card">
        <div className="card-label">Your Notes</div>
        <textarea
          value={notes}
          onChange={(e) => {
            onNotesChange(e.target.value);
            setError("");
          }}
          placeholder="Paste your lecture notes, textbook content, or anything you need to study..."
          rows={9}
        />
        {error && error !== ERRORS.noTitle && (
          <p className="error-msg">{error}</p>
        )}
        <div className="action-row">
          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" /> Generating your study set...
              </>
            ) : (
              "Start Sprinting"
            )}
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              onNotesChange(EXAMPLE_NOTES);
              setError("");
            }}>
            Try an example
          </button>
        </div>
      </div>

      {summary && (
        <div className="summary-box">
          <h3>Summary</h3>
          <p>{summary}</p>
          {done && (
            <button className="btn-go-flashcards" onClick={onGoToFlashcards}>
              View your flashcards →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
