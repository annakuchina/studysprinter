import React, { useState, useEffect } from "react";
import { getStudySets, deleteStudySet } from "../api/claude";

export default function DecksTab({ onLoadDeck }) {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  async function handleDelete(id, e) {
    e.stopPropagation();
    await deleteStudySet(id);
    setDecks(decks.filter((d) => d.id !== id));
  }

  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-sub">Loading your decks...</div>
      </div>
    );
  }

  if (!decks.length) {
    return (
      <div className="empty-state">
        <div className="empty-title">No decks yet</div>
        <div className="empty-sub">
          Generate a study set from the Notes tab to create your first deck.
        </div>
      </div>
    );
  }

  return (
    <div className="decks-grid">
      {decks.map((deck) => (
        <div
          key={deck.id}
          className="deck-card"
          onClick={() => onLoadDeck(deck.id)}>
          <div className="deck-card-inner">
            <div className="deck-title">{deck.title}</div>
            <div className="deck-summary">{deck.summary}</div>
            <div className="deck-date">
              {new Date(deck.created_at).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
          <button
            className="deck-delete"
            onClick={(e) => handleDelete(deck.id, e)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
