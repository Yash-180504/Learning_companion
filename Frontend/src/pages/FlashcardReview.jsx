import React, { useState } from 'react';
import '../styles/FlashcardReview.css';

const cards = [
  { question: 'What is a Binary Search Tree (BST)?', answer: 'A BST is a tree where each node has at most two children. Left child values are less than the parent, and right child values are greater.' },
  { question: 'What does CPU stand for and what is its role?', answer: 'CPU stands for Central Processing Unit. It is the primary component of a computer that executes instructions from programs.' },
  { question: 'What is the difference between RAM and ROM?', answer: 'RAM (Random Access Memory) is volatile memory used for temporary storage while the computer is running. ROM (Read-Only Memory) is non-volatile and stores permanent instructions.' },
];

const ratings = [
  { label: 'Again', cls: 'rating-again' },
  { label: 'Hard',  cls: 'rating-hard'  },
  { label: 'Good',  cls: 'rating-good'  },
  { label: 'Easy',  cls: 'rating-easy'  },
];

export default function FlashcardReview() {
  const [index, setIndex]     = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone]       = useState(false);
  const [results, setResults] = useState([]);

  const restart = () => { setIndex(0); setFlipped(false); setDone(false); setResults([]); };

  const handleRating = (label) => {
    const updated = [...results, label];
    setResults(updated);
    if (index + 1 >= cards.length) { setDone(true); }
    else { setIndex(index + 1); setFlipped(false); }
  };

  const progress = Math.round((index / cards.length) * 100);

  return (
    <div className="fc-wrapper">
      <div className="page-header">
        <div>
          <h1>Flashcard Review</h1>
          <p>Spaced repetition review session</p>
        </div>
      </div>

      <div className="fc-body">
        {done ? (
          <div className="fc-complete">
            <div className="fc-complete-card">
              <div className="fc-complete-emoji">🎉</div>
              <h2>Session Complete!</h2>
              <p>You reviewed all {cards.length} cards.</p>
              <div className="fc-results-grid">
                {ratings.map(({ label, cls }) => (
                  <div key={label} className={`fc-result-item ${cls}`}>
                    <span className="fc-result-count">{results.filter(r => r === label).length}</span>
                    <span className="fc-result-label">{label}</span>
                  </div>
                ))}
              </div>
              <button className="fc-restart-btn" onClick={restart}>↺ Restart Session</button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="fc-progress-bar-wrap">
              <div className="fc-progress-info">
                <span>Card {index + 1} of {cards.length}</span>
                <span>{progress}% complete</span>
              </div>
              <div className="fc-progress-track">
                <div className="fc-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Card */}
            <div className={`fc-card ${flipped ? 'flipped' : ''}`} onClick={() => !flipped && setFlipped(true)}>
              <div className="fc-card-side-label">{flipped ? 'Answer' : 'Question'}</div>
              <p className="fc-card-text">{flipped ? cards[index].answer : cards[index].question}</p>
              {!flipped && <span className="fc-card-hint">Tap to reveal answer</span>}
            </div>

            {/* Actions */}
            {!flipped ? (
              <button className="fc-show-btn" onClick={() => setFlipped(true)}>Show Answer →</button>
            ) : (
              <div className="fc-ratings">
                <p className="fc-ratings-label">How well did you recall this?</p>
                <div className="fc-ratings-grid">
                  {ratings.map(({ label, cls }) => (
                    <button key={label} className={`fc-rating-btn ${cls}`} onClick={() => handleRating(label)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
