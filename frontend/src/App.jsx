import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import InputTab from "./components/InputTab";
import DecksTab from "./components/DecksTab";
import FlashcardsTab from "./components/FlashcardsTab";
import QuizTab from "./components/QuizTab";
import ProgressTab from "./components/ProgressTab";
import { getStudySet } from "./api/claude";

const TABS = [
  { id: "input", label: "Notes" },
  { id: "decks", label: "Decks" },
  { id: "flashcards", label: "Flashcards" },
  { id: "quiz", label: "Quiz" },
  { id: "progress", label: "Progress" },
];

function loadStats() {
  return {
    sessions: parseInt(localStorage.getItem("ss_sessions") || "0"),
    cardsReviewed: parseInt(localStorage.getItem("ss_cards") || "0"),
    lastScore: localStorage.getItem("ss_score")
      ? parseInt(localStorage.getItem("ss_score"))
      : null,
    log: JSON.parse(localStorage.getItem("ss_log") || "[]"),
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState("input");
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [stats, setStats] = useState(loadStats);
  const [dark, setDark] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  function addLog(text, color) {
    const time = new Date().toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newLog = [...stats.log, { text, color, time }].slice(-20);
    localStorage.setItem("ss_log", JSON.stringify(newLog));
    return newLog;
  }

  function handleStudySetGenerated(result) {
    setFlashcards(result.flashcards);
    setQuiz(result.quiz);
    const newSessions = stats.sessions + 1;
    localStorage.setItem("ss_sessions", newSessions);
    const log = addLog(
      `Generated ${result.flashcards.length} flashcards and ${result.quiz.length} quiz questions`,
      "#3b82f6",
    );
    setStats((prev) => ({ ...prev, sessions: newSessions, log }));
  }

  async function handleLoadDeck(id) {
    try {
      const data = await getStudySet(id);
      setFlashcards(data.flashcards);
      setQuiz(data.quiz);
      setNotes(data.notes);
      setActiveTab("flashcards");
      const log = addLog(`Loaded deck: ${data.title}`, "#7c3aed");
      setStats((prev) => ({ ...prev, log }));
    } catch (e) {
      console.error(e);
    }
  }

  function handleCardReviewed() {
    const newCount = stats.cardsReviewed + 1;
    localStorage.setItem("ss_cards", newCount);
    const log = addLog("Reviewed a flashcard", "#7c3aed");
    setStats((prev) => ({ ...prev, cardsReviewed: newCount, log }));
  }

  function handleScore(pct) {
    localStorage.setItem("ss_score", pct);
    const log = addLog(
      `Scored ${pct}% on quiz`,
      pct >= 70 ? "#059669" : "#f97316",
    );
    setStats((prev) => ({ ...prev, lastScore: pct, log }));
  }

  return (
    <div>
      <header className="main-nav">
        <div className="main-nav-inner">
          <div className="logo">
            <FontAwesomeIcon
              icon={faBookOpen}
              style={{ fontSize: 18, color: "white" }}
            />
          </div>
          <span className="nav-brand">
            Study<span>Sprinter</span>
          </span>
          <button
            className="theme-btn"
            onClick={() => setDark((d) => !d)}
            title="Toggle theme">
            {dark ? "☀" : "◑"}
          </button>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-tag">AI-powered study tool</div>
          <h1 className="hero-headline">
            Sprint to the finish line.
            <br />
            Starting with your notes.
          </h1>
          <p className="hero-sub">
            Paste any notes or lecture content. StudySprinter instantly
            generates summaries, flashcards, and quizzes so you can study
            smarter, not longer.
          </p>
          <a
            href="#app"
            className="btn-hero"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("app")
                .scrollIntoView({ behavior: "smooth" });
            }}>
            Make Your Study Set
          </a>
        </div>

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">01</div>
            <div className="feature-title">Instant Summaries</div>
            <div className="feature-desc">
              Paste your notes and get a clean summary of the key concepts in
              seconds.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">02</div>
            <div className="feature-title">Smart Flashcards</div>
            <div className="feature-desc">
              AI generates the right questions from your content. Tap to flip
              and test yourself.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">03</div>
            <div className="feature-title">Quiz Yourself</div>
            <div className="feature-desc">
              Multiple choice questions built from your notes. Track your score
              over time.
            </div>
          </div>
        </div>
      </section>

      <div id="app">
        <nav className="tab-nav">
          <div className="tab-nav-inner">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <main className="app-content">
          {activeTab === "input" && (
            <InputTab
              notes={notes}
              onNotesChange={setNotes}
              onStudySetGenerated={handleStudySetGenerated}
              onGoToFlashcards={() => setActiveTab("flashcards")}
            />
          )}
          {activeTab === "decks" && <DecksTab onLoadDeck={handleLoadDeck} />}
          {activeTab === "flashcards" && (
            <FlashcardsTab
              flashcards={flashcards}
              onCardReviewed={handleCardReviewed}
            />
          )}
          {activeTab === "quiz" && (
            <QuizTab quiz={quiz} onScore={handleScore} />
          )}
          {activeTab === "progress" && <ProgressTab stats={stats} />}
        </main>
      </div>
    </div>
  );
}
