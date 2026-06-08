import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import Sidebar from './components/Sidebar';
import CreateDeck from './components/CreateDeck';
import StudyView from './components/StudyView';
import { getStudySets, getStudySet, deleteStudySet } from './api/claude';

export default function App() {
  const [dark, setDark] = useState(false);
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [view, setView] = useState('empty');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
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
      setView('study');
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDeleteDeck(id) {
    await deleteStudySet(id);
    setDecks(decks.filter(d => d.id !== id));
    if (selectedDeck?.id === id) {
      setSelectedDeck(null);
      setView('empty');
    }
  }

  function handleDeckCreated(deck) {
    setDecks([deck, ...decks]);
    setSelectedDeck(deck);
    setView('study');
  }

  return (
    <div className="layout">
      <header className="main-nav">
        <div className="main-nav-inner">
          <div className="logo">
            <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: 18, color: 'white' }} />
          </div>
          <span className="nav-brand">Study<span>Sprinter</span></span>
          <button className="theme-btn" onClick={() => setDark(d => !d)}>
            {dark ? '☀' : '◑'}
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
          onNewDeck={() => setView('create')}
        />
        <main className="main-content">
          {view === 'empty' && (
            <div className="empty-state">
              <div className="empty-title">No deck selected</div>
              <div className="empty-sub">Pick a deck from the left or create a new one to get started.</div>
              <button className="btn-primary" style={{ marginTop: '1.5rem', maxWidth: 200 }} onClick={() => setView('create')}>
                Create a deck
              </button>
            </div>
          )}
          {view === 'create' && (
            <CreateDeck onDeckCreated={handleDeckCreated} onCancel={() => setView(selectedDeck ? 'study' : 'empty')} />
          )}
          {view === 'study' && selectedDeck && (
            <StudyView deck={selectedDeck} />
          )}
        </main>
      </div>
    </div>
  );
}
