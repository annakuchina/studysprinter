import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import Sidebar from "./components/Sidebar";
import CreateDeck from "./components/CreateDeck";
import StudyView from "./components/StudyView";
import {
  getStudySets,
  getStudySet,
  deleteStudySet,
  togglePin,
} from "./api/claude";

export default function App() {
  const [dark, setDark] = useState(false);
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [view, setView] = useState("empty");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    fetchDecks();
  }, []);

  async function fetchDecks() {
    setLoading(true);
    try {
      const data = await getStudySets();
      setDecks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectDeck(id) {
    try {
      const data = await getStudySet(id);
      setSelectedDeck(data);
      setView("study");
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDeleteDeck(id) {
    await deleteStudySet(id);
    setDecks(decks.filter((d) => d.id !== id));
    if (selectedDeck?.id === id) {
      setSelectedDeck(null);
      setView("empty");
    }
  }

  async function handlePinDeck(id) {
    try {
      const result = await togglePin(id);
      setDecks((prev) => {
        const updated = prev.map((d) =>
          d.id === id ? { ...d, pinned: result.pinned } : d,
        );
        const pinned = updated.filter((d) => d.pinned);
        const unpinned = updated
          .filter((d) => !d.pinned)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return [...pinned, ...unpinned];
      });
    } catch (e) {
      console.error(e);
    }
  }

  function handleDeckCreated(deck) {
    const deckWithDate = { ...deck, created_at: new Date().toISOString() };
    setDecks([deckWithDate, ...decks]);
    setSelectedDeck(deckWithDate);
    setView("study");
  }

  return (
    <div className="layout">
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
          <button className="theme-btn" onClick={() => setDark((d) => !d)}>
            {dark ? "☀" : "◑"}
          </button>
        </div>
      </header>

      <div className="app-body">
        <Sidebar
          decks={decks}
          loading={loading}
          selectedId={selectedDeck?.id}
          onSelect={handleSelectDeck}
          onDelete={handleDeleteDeck}
          onPin={handlePinDeck}
          onNewDeck={() => setView("create")}
        />
        <main className="main-content">
          {view === "empty" && (
            <div className="empty-state">
              <div className="empty-title">No deck selected</div>
              <div className="empty-sub">
                Pick a deck from the left or create a new one to get started.
              </div>
              <button
                className="btn-primary"
                style={{ marginTop: "1.5rem" }}
                onClick={() => setView("create")}>
                Create a deck
              </button>
            </div>
          )}
          {view === "create" && (
            <CreateDeck
              onDeckCreated={handleDeckCreated}
              onCancel={() => setView(selectedDeck ? "study" : "empty")}
            />
          )}
          {view === "study" && selectedDeck && (
            <StudyView deck={selectedDeck} />
          )}
        </main>
      </div>
    </div>
  );
}
