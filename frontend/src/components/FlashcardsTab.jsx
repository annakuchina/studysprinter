import React, { useState } from 'react';

export default function FlashcardsTab({ flashcards, onCardReviewed }) {
  const [revealed, setRevealed] = useState({});

  if (!flashcards.length) {
    return (
      <div className="empty-state">
        <div className="empty-title">No flashcards yet</div>
        <div className="empty-sub">Generate a study set from the Notes tab to get started.</div>
      </div>
    );
  }

  const reviewedCount = Object.values(revealed).filter(Boolean).length;

  function toggle(i) {
    const wasRevealed = revealed[i];
    setRevealed(prev => ({ ...prev, [i]: !prev[i] }));
    if (!wasRevealed && onCardReviewed) onCardReviewed();
  }

  return (
    <div>
      <div className="fc-progress-row">
        <span>{reviewedCount} of {flashcards.length} revealed</span>
        {reviewedCount === flashcards.length && <span style={{ color: '#059669', fontWeight: 600 }}>All done!</span>}
      </div>
      <div className="fc-split-grid">
        {flashcards.map((fc, i) => (
          <div key={i} className="fc-split-card">
            <div className="fc-split-question">
              <div className="fc-split-label">Question</div>
              <div className="fc-split-text">{fc.q}</div>
            </div>
            <div
              className={`fc-split-answer ${revealed[i] ? 'revealed' : ''}`}
              onClick={() => toggle(i)}
            >
              <div className="fc-split-label">
                {revealed[i] ? 'Answer' : 'Click to reveal'}
              </div>
              {revealed[i] ? (
                <>
                  <div className="fc-split-text answer-text">{fc.a}</div>
                  <div className="fc-split-hide">CLICK TO HIDE</div>
                </>
              ) : (
                <div className="fc-split-placeholder" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
