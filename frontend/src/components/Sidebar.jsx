import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbTack,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({
  decks,
  loading,
  selectedId,
  onSelect,
  onDelete,
  onPin,
  onNewDeck,
  isOpen,
  onToggle,
}) {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [animating, setAnimating] = useState(false);

  function handleToggle() {
    setAnimating(true);
    onToggle();
    setTimeout(() => setAnimating(false), 250);
  }

  function handleDeleteClick(e, deck) {
    e.stopPropagation();
    setConfirmDelete(deck);
  }

  function handlePinClick(e, deck) {
    e.stopPropagation();
    onPin(deck.id);
  }

  function handleConfirm() {
    onDelete(confirmDelete.id);
    setConfirmDelete(null);
  }

  const pinned = decks.filter((d) => d.pinned);
  const unpinned = decks.filter((d) => !d.pinned);

  return (
    <aside
      className={`sidebar ${isOpen ? "" : "collapsed"} ${animating ? "animating" : ""}`}>
      <div className="sidebar-header">
        {isOpen && <span className="sidebar-title">Your Decks</span>}
        <div
          style={{ display: "flex", gap: 8, marginLeft: isOpen ? "auto" : 0 }}>
          {isOpen && (
            <button
              className="sidebar-new-btn"
              onClick={onNewDeck}
              style={{ visibility: isOpen ? "visible" : "hidden" }}>
              + New
            </button>
          )}
          <button
            className="sidebar-toggle-btn"
            onClick={handleToggle}
            title={isOpen ? "Collapse" : "Expand"}>
            <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
          </button>
        </div>
      </div>

      {!isOpen && (
        <div className="sidebar-collapsed-icon">
          <FontAwesomeIcon icon={faLayerGroup} />
        </div>
      )}

      {isOpen && (
        <div className="sidebar-list">
          {loading && <div className="sidebar-empty">Loading...</div>}

          {!loading && decks.length === 0 && (
            <div className="sidebar-empty">
              No decks yet. Create your first one!
            </div>
          )}

          {!loading && pinned.length > 0 && (
            <>
              <div className="sidebar-section-label">Pinned</div>
              {pinned.map((deck) => (
                <DeckItem
                  key={deck.id}
                  deck={deck}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  onDelete={handleDeleteClick}
                  onPin={handlePinClick}
                />
              ))}
            </>
          )}

          {!loading && unpinned.length > 0 && (
            <>
              <div className="sidebar-section-label">All Decks</div>
              {unpinned.map((deck) => (
                <DeckItem
                  key={deck.id}
                  deck={deck}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  onDelete={handleDeleteClick}
                  onPin={handlePinClick}
                />
              ))}
            </>
          )}
        </div>
      )}

      {confirmDelete && (
        <div className="delete-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-title">Delete deck?</div>
            <div className="delete-modal-sub">
              This will permanently delete{" "}
              <strong>{confirmDelete.title}</strong> and all its notes,
              flashcards, quiz questions and stats.
            </div>
            <div className="delete-modal-actions">
              <button
                className="delete-cancel-btn"
                onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button className="delete-confirm-btn" onClick={handleConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function DeckItem({ deck, selectedId, onSelect, onDelete, onPin }) {
  return (
    <div
      className={`sidebar-item ${selectedId === deck.id ? "active" : ""}`}
      onClick={() => onSelect(deck.id)}>
      <div className="sidebar-item-content">
        <div className="sidebar-item-title">{deck.title}</div>
        <div className="sidebar-item-date">
          {deck.last_studied
            ? `Last studied ${new Date(deck.last_studied).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}`
            : `Created ${new Date(deck.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}`}
        </div>
      </div>
      <div className="sidebar-item-actions">
        <button
          className={`sidebar-action-btn ${deck.pinned ? "pinned" : ""}`}
          onClick={(e) => onPin(e, deck)}
          title={deck.pinned ? "Unpin" : "Pin"}>
          <FontAwesomeIcon icon={faThumbTack} />
        </button>
        <button
          className="sidebar-action-btn delete"
          onClick={(e) => onDelete(e, deck)}
          title="Delete">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
}
