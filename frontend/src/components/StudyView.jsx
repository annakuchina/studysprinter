import React, { useState } from "react";
import FlashcardsTab from "./FlashcardsTab";
import QuizTab from "./QuizTab";
import StatsTab from "./StatsTab";
import { recordStats } from "../api/claude";

export default function StudyView({ deck, onStatsRecorded }) {
  const [activeTab, setActiveTab] = useState("flashcards");

  async function handleScore(pct) {
    try {
      await recordStats(deck.id, pct, 0);
      if (onStatsRecorded) onStatsRecorded();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="study-view">
      <div className="study-view-header">
        <h2 className="study-view-title">{deck.title}</h2>
        {deck.created_at && !isNaN(new Date(deck.created_at)) && (
          <div className="study-view-meta">
            Created{" "}
            {new Date(deck.created_at).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        )}
        <p className="study-view-summary">{deck.summary}</p>
      </div>
      <div className="study-tabs">
        <button
          className={`study-tab ${activeTab === "flashcards" ? "active" : ""}`}
          onClick={() => setActiveTab("flashcards")}>
          Flashcards
        </button>
        <button
          className={`study-tab ${activeTab === "quiz" ? "active" : ""}`}
          onClick={() => setActiveTab("quiz")}>
          Quiz
        </button>
        <button
          className={`study-tab ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}>
          Stats
        </button>
        <button
          className={`study-tab ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}>
          Notes
        </button>
      </div>
      <div className="study-content">
        {activeTab === "flashcards" && (
          <FlashcardsTab
            flashcards={deck.flashcards}
            onCardReviewed={() => {}}
          />
        )}
        {activeTab === "quiz" && (
          <QuizTab quiz={deck.quiz} onScore={handleScore} />
        )}
        {activeTab === "stats" && <StatsTab deckId={deck.id} />}
        {activeTab === "notes" && (
          <div className="notes-view">
            <div className="notes-content">{deck.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}
