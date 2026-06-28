import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "./supabase";
import Login from "./components/Login";
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
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [view, setView] = useState("empty");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [sidebarAnimating, setSidebarAnimating] = useState(false);

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    fetchDecks();
  }, []);

  useEffect(() => {
    function handleResize() {
      document.querySelector(".sidebar").style.transition = "none";
      setSidebarOpen(window.innerWidth > 768);
      setTimeout(() => {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar) sidebar.style.transition = "";
      }, 50);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedDeck) {
      document.title = `${selectedDeck.title} - StudySprinter`;
    } else {
      document.title = "StudySprinter";
    }
  }, [selectedDeck]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchDecks() {
    setLoading(true);
    try {
      const data = await getStudySets();
      const sorted = data.sort((a, b) => {
        const aDate = a.last_studied || a.created_at;
        const bDate = b.last_studied || b.created_at;
        return new Date(bDate) - new Date(aDate);
      });
      setDecks(sorted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectDeck(id) {
    try {
      setSelectedDeck(null);
      const data = await getStudySet(id);
      const sidebarDeck = decks.find((d) => d.id === id);
      setSelectedDeck({ ...data, created_at: sidebarDeck?.created_at });
      setView("study");
      if (window.innerWidth <= 768) setSidebarOpen(false);
    } catch (e) {
      console.error(e);
    }
  }

  function handleStatsRecorded() {
    const now = new Date().toISOString();
    setDecks((prev) =>
      prev.map((d) =>
        d.id === selectedDeck?.id ? { ...d, last_studied: now } : d,
      ),
    );
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
    setDecks([deck, ...decks]);
    setSelectedDeck(deck);
    setView("study");
  }

  if (authLoading) return null;
  if (!user) return <Login />;

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
          <button
            className="theme-btn"
            onClick={() => {
              setDark((d) => {
                localStorage.setItem("theme", !d ? "dark" : "light");
                return !d;
              });
            }}>
            {dark ? "☀" : "◑"}
          </button>
          <button
            className="theme-btn"
            onClick={() => supabase.auth.signOut()}
            title="Sign out">
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                style={{ width: 20, height: 20, borderRadius: "50%" }}
              />
            ) : (
              "↪"
            )}
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
          isOpen={sidebarOpen}
          onToggle={() => {
            const sidebar = document.querySelector(".sidebar");
            if (sidebar) sidebar.style.transition = "";
            setSidebarOpen((p) => !p);
          }}
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
            <StudyView
              deck={selectedDeck}
              onStatsRecorded={handleStatsRecorded}
            />
          )}
        </main>
      </div>
    </div>
  );
}
