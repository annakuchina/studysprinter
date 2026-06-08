import React from 'react';

export default function Sidebar({ decks, loading, selectedId, onSelect, onDelete, onNewDeck }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Your Decks</span>
        <button className="sidebar-new-btn" onClick={onNewDeck}>+ New</button>
      </div>
      <div className="sidebar-list">
        {loading && <div className="sidebar-empty">Loading...</div>}
        {!loading && decks.length === 0 && (
          <div className="sidebar-empty">No decks yet. Create your first one!</div>
        )}
        {!loading && decks.map(deck => (
          <div
            key={deck.id}
            className={`sidebar-item ${selectedId === deck.id ? 'active' : ''}`}
            onClick={() => onSelect(deck.id)}
          >
            <div className="sidebar-item-title">{deck.title}</div>
            <div className="sidebar-item-date">
              {new Date(deck.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
            </div>
            <button className="sidebar-delete" onClick={e => { e.stopPropagation(); onDelete(deck.id); }}>×</button>
          </div>
        ))}
      </div>
    </aside>
  );
}
