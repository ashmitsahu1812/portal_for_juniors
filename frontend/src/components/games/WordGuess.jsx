import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Delete } from 'lucide-react';
import api from '../../api/client';

const TARGET_WORDS = [
  "REACT", "LOGIC", "GRAPH", "STACK", "QUEUE", "BYTES", 
  "CACHE", "CLOUD", "DEBUG", "TOKEN", "ARRAY", "INDEX"
];

const VALID_WORDS = new Set([
  ...TARGET_WORDS,
  "HELLO", "WORLD", "CLASS", "STATE", "PROPS", "HOOKS", "INPUT"
]);

const getDailyTargetWord = () => {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const index = seed % TARGET_WORDS.length;
  return TARGET_WORDS[index];
};

export default function WordGuess({ onBack }) {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [time, setTime] = useState(0);

  useEffect(() => {
    fetchStatus();
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying || hasPlayed) return;

      if (e.key === 'Enter') {
        handleEnter();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (/^[A-Za-z]$/.test(e.key)) {
        handleLetter(e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, currentRow, isPlaying, hasPlayed]);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/games/status');
      if (res.data.success) {
        setHasPlayed(res.data.status.word_guess);
        if (!res.data.status.word_guess) {
          startNewGame();
        }
      }
    } catch (err) {
      console.error('Failed to fetch status');
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/games/leaderboard/word_guess');
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard');
    }
  };

  const submitScore = async (timeTaken) => {
    try {
      await api.post('/games/score', { gameType: 'word_guess', timeTakenSeconds: timeTaken });
      fetchLeaderboard();
      setTimeout(() => {
        setHasPlayed(true);
      }, 2500);
    } catch (err) {
      console.error('Failed to submit score');
    }
  };

  const startNewGame = () => {
    setTargetWord(getDailyTargetWord());
    setGuesses(Array(6).fill(''));
    setCurrentGuess('');
    setCurrentRow(0);
    setTime(0);
    setIsPlaying(true);
  };

  const handleLetter = (letter) => {
    if (currentGuess.length < 5) {
      setCurrentGuess(currentGuess + letter);
      setErrorMsg('');
    }
  };

  const handleBackspace = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
    setErrorMsg('');
  };

  const handleEnter = () => {
    if (currentGuess.length !== 5) {
      setErrorMsg('Not enough letters');
      return;
    }
    // Simple dictionary check skip for now to avoid frustration, or implement small one
    // if (!VALID_WORDS.has(currentGuess)) {
    //   setErrorMsg('Not in word list');
    //   return;
    // }

    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);
    setCurrentRow(currentRow + 1);
    setCurrentGuess('');

    if (currentGuess === targetWord) {
      setIsPlaying(false);
      submitScore(time);
    } else if (currentRow === 5) {
      setIsPlaying(false);
      // Didn't win, but game over. Still mark as played? 
      // The requirement is "one puzzle per day", usually means you can only attempt it once.
      // We will submit a penalty score or just mark as played.
      // For simplicity, submit 999 seconds if failed.
      submitScore(999);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getGuessStatuses = (guess, target) => {
    if (!guess || !target || guess.length !== 5) return Array(5).fill('absent');
    
    const statuses = Array(5).fill('absent');
    const targetCounts = {};
    
    // Count occurrences of each letter in the target word
    for (const char of target) {
      targetCounts[char] = (targetCounts[char] || 0) + 1;
    }
    
    // First pass: find all 'correct' (green) matches
    for (let i = 0; i < 5; i++) {
      if (guess[i] === target[i]) {
        statuses[i] = 'correct';
        targetCounts[guess[i]]--;
      }
    }
    
    // Second pass: find all 'present' (yellow) matches
    for (let i = 0; i < 5; i++) {
      if (statuses[i] !== 'correct' && targetCounts[guess[i]] > 0) {
        statuses[i] = 'present';
        targetCounts[guess[i]]--;
      }
    }
    
    return statuses;
  };

  const renderGrid = () => {
    return (
      <div className="word-grid">
        {guesses.map((guess, i) => {
          const isCurrentRow = i === currentRow;
          const word = isCurrentRow ? currentGuess.padEnd(5, ' ') : guess.padEnd(5, ' ');
          
          const rowStatuses = (!isCurrentRow && i < currentRow) 
            ? getGuessStatuses(guess, targetWord) 
            : Array(5).fill('empty');

          return (
            <div key={i} className="word-row">
              {word.split('').map((letter, j) => {
                let statusClass = 'empty';
                if (letter !== ' ') {
                  statusClass = (!isCurrentRow && i < currentRow) ? rowStatuses[j] : 'filled';
                }
                
                return (
                  <div key={j} className={`word-cell ${statusClass}`}>
                    {letter !== ' ' ? letter : ''}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const renderKeyboard = () => {
    const keys = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ];

    return (
      <div className="keyboard">
        {keys.map((row, i) => (
          <div key={i} className="keyboard-row">
            {row.map((key) => {
              const isEnter = key === 'ENTER';
              const isBack = key === 'BACKSPACE';
              
              let keyClass = 'key';
              if (isEnter || isBack) keyClass += ' key-wide';
              
              // Find key status across past guesses
              let status = '';
              for (let r = 0; r < currentRow; r++) {
                const g = guesses[r];
                const rowStatuses = getGuessStatuses(g, targetWord);
                for (let c = 0; c < 5; c++) {
                  if (g[c] === key) {
                    const charStatus = rowStatuses[c];
                    // 'correct' > 'present' > 'absent'
                    if (charStatus === 'correct') {
                      status = 'correct';
                    } else if (charStatus === 'present' && status !== 'correct') {
                      status = 'present';
                    } else if (charStatus === 'absent' && status === '') {
                      status = 'absent';
                    }
                  }
                }
              }
              if (status) keyClass += ` ${status}`;

              return (
                <button
                  key={key}
                  className={keyClass}
                  onClick={() => {
                    if (isEnter) handleEnter();
                    else if (isBack) handleBackspace();
                    else handleLetter(key);
                  }}
                >
                  {isBack ? <Delete size={20} /> : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Hub
        </button>
        {!hasPlayed && <div className="game-timer">{formatTime(time)}</div>}
        {!hasPlayed && isPlaying && (
          <button className="btn btn-primary" onClick={startNewGame}>
            Restart
          </button>
        )}
      </div>

      {hasPlayed ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <Trophy size={48} color="#eab308" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>You've already played today!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Come back tomorrow for a new Word Guess challenge.</p>
        </div>
      ) : (
        <>
          <div className="word-guess-wrapper">
            {renderGrid()}
            <div style={{ height: '24px', color: '#ef4444', textAlign: 'center', marginTop: '0.5rem', fontWeight: 600 }}>
              {errorMsg}
            </div>
            {renderKeyboard()}
          </div>
          
          {!isPlaying && currentRow > 0 && guesses[currentRow - 1] === targetWord && (
            <div style={{ marginTop: '2rem', textAlign: 'center', color: '#10b981' }}>
              <h2>🎉 Guessed in {currentRow} tries! Time: {formatTime(time)}</h2>
            </div>
          )}
          {!isPlaying && currentRow === 6 && guesses[5] !== targetWord && (
            <div style={{ marginTop: '2rem', textAlign: 'center', color: '#ef4444' }}>
              <h2>❌ Game Over! The word was {targetWord}</h2>
            </div>
          )}
        </>
      )}

      {/* Leaderboard */}
      <div className="leaderboard-panel">
        <h3><Trophy size={20} color="#eab308" /> Today's Top Times</h3>
        {leaderboard.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No scores yet today. Be the first!</p>
        ) : (
          <div className="leaderboard-list">
            {leaderboard.map((entry, idx) => (
              <div key={idx} className={`leaderboard-item top-${idx + 1}`}>
                <span className="rank">#{idx + 1}</span>
                <span className="name">{entry.name}</span>
                <span className="time">{formatTime(entry.timeTakenSeconds)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
