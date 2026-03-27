import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/DiagnosticQuiz.css';

const QUESTION_BANK = {
  mathematics: [
    { question: 'What is the result of 15 × 12?',           options: ['150','180','170','160'], answer: '180' },
    { question: 'Which of the following is a prime number?', options: ['21','23','25','27'],    answer: '23'  },
    { question: 'What is the square root of 144?',           options: ['10','11','12','13'],    answer: '12'  },
    { question: 'Solve: 3x + 5 = 20. What is x?',           options: ['3','4','5','6'],        answer: '5'   },
    { question: 'What is 25% of 200?',                       options: ['25','40','50','75'],    answer: '50'  },
  ],
  science: [
    { question: 'What is the chemical symbol for water?',           options: ['H2O','CO2','O2','NaCl'],           answer: 'H2O'         },
    { question: 'Which planet is closest to the Sun?',              options: ['Venus','Earth','Mars','Mercury'],  answer: 'Mercury'     },
    { question: 'What is the powerhouse of the cell?',              options: ['Nucleus','Ribosome','Mitochondria','Vacuole'], answer: 'Mitochondria' },
    { question: 'What gas do plants absorb during photosynthesis?', options: ['O2','CO2','N2','H2'],              answer: 'CO2'         },
    { question: 'How many bones are in the adult human body?',      options: ['196','206','216','226'],           answer: '206'         },
  ],
  english: [
    { question: 'Which of these is a noun?',                options: ['Run','Happy','Book','Quickly'],                                                          answer: 'Book'               },
    { question: 'What is the past tense of "go"?',          options: ['Goed','Gone','Went','Goes'],                                                             answer: 'Went'               },
    { question: 'Which sentence is grammatically correct?', options: ["She don't like it","She doesn't likes it","She doesn't like it","She not like it"],      answer: "She doesn't like it" },
    { question: 'What does the prefix "un-" mean?',         options: ['Again','Not','Before','After'],                                                          answer: 'Not'                },
    { question: 'Which is a synonym for "happy"?',          options: ['Sad','Angry','Joyful','Tired'],                                                          answer: 'Joyful'             },
  ],
  physics: [
    { question: 'What is the unit of force?',                     options: ['Watt','Joule','Newton','Pascal'],                          answer: 'Newton'       },
    { question: 'What is the speed of light (approx)?',           options: ['3×10⁶ m/s','3×10⁸ m/s','3×10¹⁰ m/s','3×10⁴ m/s'],      answer: '3×10⁸ m/s'   },
    { question: 'Which law states F = ma?',                       options: ["Newton's 1st","Newton's 2nd","Newton's 3rd","Ohm's Law"], answer: "Newton's 2nd" },
    { question: 'What type of energy does a moving object have?', options: ['Potential','Chemical','Kinetic','Thermal'],               answer: 'Kinetic'      },
    { question: 'What is the SI unit of electric current?',       options: ['Volt','Ohm','Watt','Ampere'],                            answer: 'Ampere'       },
  ],
  chemistry: [
    { question: 'What is the atomic number of Carbon?',          options: ['4','6','8','12'],                       answer: '6'    },
    { question: 'What is the chemical formula for table salt?',  options: ['NaCl','KCl','CaCl2','MgCl2'],           answer: 'NaCl' },
    { question: 'Which gas is produced when acid reacts with metal?', options: ['O2','CO2','H2','N2'],              answer: 'H2'   },
    { question: 'What is the pH of pure water?',                 options: ['5','6','7','8'],                        answer: '7'    },
    { question: 'Which element has the symbol "Fe"?',            options: ['Fluorine','Iron','Francium','Fermium'], answer: 'Iron' },
  ],
  biology: [
    { question: 'What is the basic unit of life?',                  options: ['Organ','Tissue','Cell','Molecule'],                        answer: 'Cell'           },
    { question: 'Which blood type is the universal donor?',         options: ['A','B','AB','O'],                                          answer: 'O'              },
    { question: 'How many chromosomes do humans have?',             options: ['23','44','46','48'],                                       answer: '46'             },
    { question: 'What is the process by which plants make food?',   options: ['Respiration','Photosynthesis','Digestion','Transpiration'],answer: 'Photosynthesis' },
    { question: 'Which organ produces insulin?',                    options: ['Liver','Kidney','Pancreas','Stomach'],                     answer: 'Pancreas'       },
  ],
  history: [
    { question: 'In which year did World War II end?',                  options: ['1943','1944','1945','1946'],                        answer: '1945'       },
    { question: 'Who was the first President of the United States?',    options: ['Lincoln','Jefferson','Washington','Adams'],         answer: 'Washington' },
    { question: 'Which civilization built the pyramids of Giza?',       options: ['Roman','Greek','Egyptian','Mesopotamian'],          answer: 'Egyptian'   },
    { question: 'In which year did India gain independence?',           options: ['1945','1946','1947','1948'],                        answer: '1947'       },
    { question: 'Who wrote the Declaration of Independence?',           options: ['Washington','Franklin','Jefferson','Madison'],      answer: 'Jefferson'  },
  ],
  geography: [
    { question: 'What is the largest continent by area?',               options: ['Africa','Americas','Europe','Asia'],                answer: 'Asia'       },
    { question: 'Which is the longest river in the world?',             options: ['Amazon','Nile','Yangtze','Mississippi'],           answer: 'Nile'       },
    { question: 'What is the capital of Australia?',                    options: ['Sydney','Melbourne','Brisbane','Canberra'],        answer: 'Canberra'   },
    { question: 'Which ocean is the largest?',                          options: ['Atlantic','Indian','Arctic','Pacific'],            answer: 'Pacific'    },
    { question: 'Mount Everest is located in which mountain range?',    options: ['Andes','Alps','Rockies','Himalayas'],              answer: 'Himalayas'  },
  ],
};

const XP_CORRECT = 20;
const XP_WRONG   = -5;

export default function DiagnosticQuiz() {
  const navigate              = useNavigate();
  const { addXP, pushNotification } = useApp();
  const quizRef               = useRef(null);

  const [questions, setQuestions]     = useState([]);
  const [currentQ, setCurrentQ]       = useState(0);
  const [answers, setAnswers]         = useState({});
  const [submitted, setSubmitted]     = useState(false);
  const [score, setScore]             = useState(0);
  const [userSubject, setUserSubject] = useState('mathematics');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [xpDelta, setXpDelta]         = useState(null); // floating XP toast

  useEffect(() => {
    const current = localStorage.getItem('currentUser');
    if (!current) { navigate('/login'); return; }
    const user    = JSON.parse(current);
    const subject = user.subject || 'mathematics';
    setUserSubject(subject);
    setQuestions(QUESTION_BANK[subject] || QUESTION_BANK.mathematics);
  }, [navigate]);

  // Enter fullscreen when quiz mounts
  useEffect(() => {
    if (!questions.length) return;
    const el = quizRef.current || document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    }
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFSChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFSChange);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [questions.length]);

  const exitFullscreen = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const showXpFloat = (delta) => {
    setXpDelta(delta);
    setTimeout(() => setXpDelta(null), 1500);
  };

  const handleSelect = (option) => {
    if (answers[currentQ] !== undefined) return; // already answered
    const correct = questions[currentQ].answer === option;
    const delta   = correct ? XP_CORRECT : XP_WRONG;
    setAnswers(prev => ({ ...prev, [currentQ]: option }));
    addXP(delta, correct ? 'Correct answer' : 'Wrong answer');
    showXpFloat(delta);
  };

  const handleSubmit = () => {
    const correct = questions.filter((q, i) => answers[i] === q.answer).length;
    const pts     = correct * XP_CORRECT;
    const acc     = Math.round((correct / questions.length) * 100);
    setScore(pts);
    setSubmitted(true);
    exitFullscreen();

    const current = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    history.push({
      email: current.email, subject: userSubject,
      score: pts, accuracy: acc, correct, total: questions.length,
      date: new Date().toISOString().split('T')[0],
    });
    localStorage.setItem('quizHistory', JSON.stringify(history));

    // Course status notification
    const grade = acc >= 80 ? 'Excellent' : acc >= 60 ? 'Good' : acc >= 40 ? 'Average' : 'Needs Work';
    pushNotification('course', `Quiz complete — ${grade} (${acc}%)`, 'course');
  };

  if (!questions.length) return null;

  const progress = ((currentQ + 1) / questions.length) * 100;

  /* ── Results ── */
  if (submitted) {
    const correct    = questions.filter((q, i) => answers[i] === q.answer).length;
    const accuracy   = Math.round((correct / questions.length) * 100);
    const grade      = accuracy >= 80 ? 'Excellent!' : accuracy >= 60 ? 'Good Job!' : accuracy >= 40 ? 'Keep Practicing' : 'Needs Improvement';
    const gradeColor = accuracy >= 80 ? '#059669'   : accuracy >= 60 ? '#4f46e5'   : accuracy >= 40 ? '#d97706'         : '#dc2626';

    return (
      <div className="quiz-page">
        <div className="quiz-card results-card">
          <div className="results-icon">{accuracy >= 60 ? '🎉' : '📚'}</div>
          <h1 className="results-title" style={{ color: gradeColor }}>{grade}</h1>
          <p className="results-subject">{userSubject.charAt(0).toUpperCase() + userSubject.slice(1)} Diagnostic Quiz</p>
          <div className="results-stats">
            <div className="result-stat"><div className="result-stat-value">{correct}/{questions.length}</div><div className="result-stat-label">Correct</div></div>
            <div className="result-stat"><div className="result-stat-value" style={{ color: gradeColor }}>{accuracy}%</div><div className="result-stat-label">Accuracy</div></div>
            <div className="result-stat"><div className="result-stat-value">{score}</div><div className="result-stat-label">Points</div></div>
          </div>
          <div className="results-breakdown">
            {questions.map((q, i) => (
              <div key={i} className={`breakdown-row ${answers[i] === q.answer ? 'correct' : 'wrong'}`}>
                <span className="breakdown-indicator">{answers[i] === q.answer ? '✓' : '✗'}</span>
                <span className="breakdown-q">Q{i+1}: {q.question}</span>
                {answers[i] !== q.answer && <span className="breakdown-answer">Answer: {q.answer}</span>}
              </div>
            ))}
          </div>
          <div className="results-actions">
            <button className="results-btn secondary" onClick={() => { setSubmitted(false); setAnswers({}); setCurrentQ(0); }}>Retake Quiz</button>
            <button className="results-btn primary"   onClick={() => navigate('/app')}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Quiz ── */
  return (
    <div className="quiz-page" ref={quizRef}>
      {/* Floating XP toast */}
      {xpDelta !== null && (
        <div className={`xp-float ${xpDelta > 0 ? 'xp-gain' : 'xp-loss'}`}>
          {xpDelta > 0 ? `+${xpDelta} XP` : `${xpDelta} XP`}
        </div>
      )}

      <div className="quiz-card">
        <div className="quiz-header">
          <div className="quiz-top-bar">
            <button className="back-link" onClick={() => { exitFullscreen(); navigate('/app'); }}>← Dashboard</button>
            <div className="quiz-top-right">
              <span className="quiz-subject-tag">{userSubject.charAt(0).toUpperCase() + userSubject.slice(1)}</span>
              {isFullscreen && (
                <button className="fs-exit-btn" onClick={exitFullscreen} title="Exit fullscreen">⛶</button>
              )}
            </div>
          </div>
          <h1>Diagnostic Quiz</h1>
          <p className="question-counter">Question {currentQ + 1} of {questions.length}</p>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        </div>

        <div className="question-section">
          <h2 className="question-text">{questions[currentQ].question}</h2>
          <div className="options-container">
            {questions[currentQ].options.map((option, idx) => {
              const answered = answers[currentQ] !== undefined;
              const chosen   = answers[currentQ] === option;
              const correct  = questions[currentQ].answer === option;
              let cls = 'option-btn';
              if (answered && chosen && correct)  cls += ' correct';
              if (answered && chosen && !correct) cls += ' wrong';
              if (answered && !chosen && correct) cls += ' reveal';
              return (
                <button key={idx} className={cls} onClick={() => handleSelect(option)} disabled={answered}>
                  <span className="option-label">{String.fromCharCode(65 + idx)}</span>
                  <span className="option-text">{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="navigation-buttons">
          <button className="nav-btn prev-btn" onClick={() => setCurrentQ(q => q - 1)} disabled={currentQ === 0}>Previous</button>
          {currentQ === questions.length - 1 ? (
            <button className="nav-btn submit-btn" onClick={handleSubmit} disabled={answers[currentQ] === undefined}>Submit Quiz</button>
          ) : (
            <button className="nav-btn next-btn" onClick={() => setCurrentQ(q => q + 1)} disabled={answers[currentQ] === undefined}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
}
