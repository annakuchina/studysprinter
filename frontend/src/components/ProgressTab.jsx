import React from "react";

export default function ProgressTab({ stats }) {
  const { sessions, cardsReviewed, lastScore, log } = stats;

  return (
    <div>
      <div className="progress-section">
        <div className="stat-card">
          <div className="num">{sessions}</div>
          <div className="lbl">Sessions</div>
        </div>
        <div className="stat-card">
          <div className="num">{cardsReviewed}</div>
          <div className="lbl">Cards Reviewed</div>
        </div>
        <div className="stat-card">
          <div className="num">
            {lastScore !== null ? lastScore + "%" : "—"}
          </div>
          <div className="lbl">Quiz Score</div>
        </div>
      </div>

      {lastScore !== null && (
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div className="card-label">Latest Quiz Performance</div>
          <div className="score-bar-label">
            <span>Correct answers</span>
            <span>{lastScore}%</span>
          </div>
          <div className="score-bar-track">
            <div
              className="score-bar-fill"
              style={{ width: lastScore + "%" }}
            />
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-label">Session Log</div>
        {log.length === 0 ? (
          <div className="empty-state" style={{ padding: "1rem" }}>
            No sessions yet. Start studying.
          </div>
        ) : (
          <div className="session-log">
            {[...log]
              .reverse()
              .slice(0, 10)
              .map((item, i) => (
                <div key={i} className="log-item">
                  <div className="log-dot" style={{ background: item.color }} />
                  <span>{item.text}</span>
                  <span className="log-time">{item.time}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
