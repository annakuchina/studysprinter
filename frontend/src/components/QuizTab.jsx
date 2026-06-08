import React, { useState, useEffect } from 'react';

export default function QuizTab({ quiz, onScore }) {
  const [answered, setAnswered] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    setAnswered({});
    setResult(null);
  }, [quiz]);

  if (!quiz.length) {
    return (
      <div className="empty-state">
        <div className="empty-title">No quiz yet</div>
        <div className="empty-sub">Generate a study set from the Notes tab to get started.</div>
      </div>
    );
  }

  function answer(qi, oi) {
    if (answered[qi] !== undefined) return;
    const newAnswered = { ...answered, [qi]: oi };
    setAnswered(newAnswered);
    if (Object.keys(newAnswered).length === quiz.length) {
      const correct = quiz.filter((q, i) => newAnswered[i] === q.correct).length;
      const pct = Math.round((correct / quiz.length) * 100);
      setResult({ correct, total: quiz.length, pct });
      if (onScore) onScore(pct);
    }
  }

  function retake() {
    setAnswered({});
    setResult(null);
  }

  function getOptClass(qi, oi) {
    if (answered[qi] === undefined) return 'opt';
    if (oi === quiz[qi].correct) return 'opt correct';
    if (oi === answered[qi]) return 'opt wrong';
    return 'opt disabled';
  }

  return (
    <div id="quiz-top">
      {quiz.map((q, qi) => (
        <div key={qi} className="quiz-q">
          <span className="tag tag-q">Question {qi + 1}</span>
          <div className="q-text">{q.q}</div>
          <div className="quiz-options">
            {q.options.map((opt, oi) => (
              <button key={oi} className={getOptClass(qi, oi)} onClick={() => answer(qi, oi)}>
                {String.fromCharCode(65 + oi)}. {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      {result && (
        <div className="score-result">
          <div className="score-num">{result.pct}%</div>
          <div className="score-sub">{result.correct} of {result.total} correct</div>
          <div className="score-msg">
            {result.pct >= 80 ? 'Great work.' : result.pct >= 60 ? 'Good effort.' : 'Keep studying.'}
          </div>
          <button className="btn-primary" onClick={retake} style={{ maxWidth: 200, margin: '1rem auto 0' }}>
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
}
