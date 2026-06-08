import React, { useState } from 'react';
import FlashcardsTab from './FlashcardsTab';
import QuizTab from './QuizTab';

export default function StudyView({ deck }) {
  const [activeTab, setActiveTab] = useState('flashcards');

  return (
    <div className="study-view">
      <div className="study-view-header">
        <h2 className="study-view-title">{deck.title}</h2>
        <p className="study-view-summary">{deck.summary}</p>
      </div>
      <div className="study-tabs">
        <button className={`study-tab ${activeTab === 'flashcards' ? 'active' : ''}`} onClick={() => setActiveTab('flashcards')}>
          Flashcards
        </button>
        <button className={`study-tab ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>
          Quiz
        </button>
      </div>
      <div className="study-content">
        {activeTab === 'flashcards' && <FlashcardsTab flashcards={deck.flashcards} onCardReviewed={() => {}} />}
        {activeTab === 'quiz' && <QuizTab quiz={deck.quiz} onScore={() => {}} />}
      </div>
    </div>
  );
}
