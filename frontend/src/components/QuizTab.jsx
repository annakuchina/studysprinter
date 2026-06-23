import React, { useState, useEffect } from "react";

function shuffleQuiz(quiz) {
  return [...quiz]
    .sort(() => Math.random() - 0.5)
    .map((q) => {
      const options = [...q.options];
      const correctAnswer = options[q.correct];
      options.sort(() => Math.random() - 0.5);
      return { ...q, options, correct: options.indexOf(correctAnswer) };
    });
}

export default function QuizTab({ quiz, onScore }) {
  const [answered, setAnswered] = useState({});
  const [result, setResult] = useState(null);
  const [shuffledQuiz, setShuffledQuiz] = useState(() => shuffleQuiz(quiz));

  useEffect(() => {
    setAnswered({});
    setResult(null);
    setShuffledQuiz(shuffleQuiz(quiz));
  }, [quiz]);

  if (!quiz.length) {
    return (
      <div className="empty-state">
        <div className="empty-title">No quiz yet</div>
        <div className="empty-sub">
          Generate a study set from the Notes tab to get started.
        </div>
      </div>
    );
  }

  function answer(qi, oi) {
    if (answered[qi] !== undefined) return;
    const newAnswered = { ...answered, [qi]: oi };
    setAnswered(newAnswered);
    if (Object.keys(newAnswered).length === shuffledQuiz.length) {
      const correct = shuffledQuiz.filter(
        (q, i) => newAnswered[i] === q.correct,
      ).length;
      const pct = Math.round((correct / shuffledQuiz.length) * 100);
      setResult({ correct, total: shuffledQuiz.length, pct });
      if (onScore) onScore(pct);
      setTimeout(() => {
        document
          .getElementById("quiz-result")
          .scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }

  function retake() {
    setAnswered({});
    setResult(null);
    setShuffledQuiz(shuffleQuiz(quiz));
  }

  function reset() {
    setAnswered({});
    setResult(null);
    setShuffledQuiz(shuffleQuiz(quiz));
  }

  function getOptClass(qi, oi) {
    if (answered[qi] === undefined) return "opt";
    if (oi === shuffledQuiz[qi].correct) return "opt correct";
    if (oi === answered[qi]) return "opt wrong";
    return "opt disabled";
  }

  const hasAnswered = Object.keys(answered).length > 0;

  return (
    <div id="quiz-top">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 12,
          minHeight: 28,
        }}>
        {hasAnswered && !result && (
          <button
            onClick={reset}
            style={{
              padding: "4px 12px",
              background: "none",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#6b7280",
              cursor: "pointer",
            }}>
            Reset Quiz
          </button>
        )}
      </div>

      {shuffledQuiz.map((q, qi) => (
        <div key={qi} className="quiz-q">
          <span className="tag tag-q">Question {qi + 1}</span>
          <div className="q-text">{q.q}</div>
          <div className="quiz-options">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                className={getOptClass(qi, oi)}
                onClick={() => answer(qi, oi)}>
                {String.fromCharCode(65 + oi)}. {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      {result && (
        <div className="score-result" id="quiz-result">
          <div className="score-num">{result.pct}%</div>
          <div className="score-sub">
            {result.correct} of {result.total} correct
          </div>
          <div className="score-msg">
            {result.pct >= 80
              ? "Great work."
              : result.pct >= 60
                ? "Good effort."
                : "Keep studying."}
          </div>
          <button
            className="btn-primary"
            onClick={retake}
            style={{ maxWidth: 200, margin: "1rem auto 0" }}>
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
}
