import React, { useState } from "react";

export default function FlashcardsTab({ flashcards, onCardReviewed }) {
  const [revealed, setRevealed] = useState({});
  const [order, setOrder] = useState(flashcards.map((_, i) => i));

  if (!flashcards.length) {
    return (
      <div className="empty-state">
        <div className="empty-title">No flashcards yet</div>
        <div className="empty-sub">
          Generate a study set from the Notes tab to get started.
        </div>
      </div>
    );
  }

  const reviewedCount = Object.values(revealed).filter(Boolean).length;

  function toggle(i) {
    const wasRevealed = revealed[i];
    setRevealed((prev) => ({ ...prev, [i]: !prev[i] }));
    if (!wasRevealed && onCardReviewed) onCardReviewed();
  }

  function shuffle() {
    setOrder((prev) => [...prev].sort(() => Math.random() - 0.5));
    setRevealed({});
  }

  return (
    <div>
      <div className="fc-progress-row">
        <span>
          {reviewedCount} of {flashcards.length} revealed
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {reviewedCount === flashcards.length && (
            <span style={{ color: "#059669", fontWeight: 600 }}>
              All revealed!
            </span>
          )}
          {reviewedCount > 0 && (
            <button onClick={() => setRevealed({})} className="btn-reset">
              Reset cards
            </button>
          )}
          <button onClick={shuffle} className="btn-reset">
            Shuffle
          </button>
        </div>
      </div>
      <div className="fc-split-grid">
        {order.map((cardIndex, displayIndex) => {
          const fc = flashcards[cardIndex];
          return (
            <div key={cardIndex} className="fc-split-card">
              <div className="fc-split-question">
                <div className="fc-split-label">
                  Flashcard {displayIndex + 1}
                </div>
                <div className="fc-split-text">{fc.q}</div>
              </div>
              <div
                className={`fc-split-answer ${revealed[cardIndex] ? "revealed" : ""}`}
                onClick={() => toggle(cardIndex)}>
                <div className="fc-split-label">
                  {revealed[cardIndex] ? "Answer" : "Click to reveal"}
                </div>
                {revealed[cardIndex] ? (
                  <>
                    <div className="fc-split-text answer-text">{fc.a}</div>
                    <div className="fc-split-hide">CLICK TO HIDE</div>
                  </>
                ) : (
                  <div className="fc-split-placeholder" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
