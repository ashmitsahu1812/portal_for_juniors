import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import api from '../../api/client';

const getDailyRNG = () => {
  const d = new Date();
  let seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
};

// Generates a valid 4x4 Sudoku board
function generateBoard() {
  const random = getDailyRNG();
  
  // A simple hardcoded valid 4x4 board for generation logic
  const base = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 3, 4, 1],
    [4, 1, 2, 3]
  ];
  
  // Randomly shuffle rows within bands, cols within bands, or numbers to make it unique
  // For simplicity, we just randomly map 1-4 to a different permutation
  const perm = [1, 2, 3, 4].sort(() => random() - 0.5);
  const board = base.map(row => row.map(cell => perm[cell - 1]));
  
  // Remove some numbers to create a puzzle (remove ~8 cells)
  const puzzle = board.map(row => [...row]);
  let removed = 0;
  while (removed < 8) {
    const r = Math.floor(random() * 4);
    const c = Math.floor(random() * 4);
    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      removed++;
    }
  }
  return { solution: board, puzzle };
}

export default function MiniSudoku({ onBack }) {
  const [grid, setGrid] = useState([]);
  const [initialGrid, setInitialGrid] = useState([]);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
    startNewGame();
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/games/leaderboard/sudoku');
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard');
    }
  };

  const submitScore = async (timeTaken) => {
    try {
      await api.post('/games/score', { gameType: 'sudoku', timeTakenSeconds: timeTaken });
      fetchLeaderboard();
    } catch (err) {
      alert(err.message || 'Error submitting score');
      console.error('Failed to submit score');
    }
  };

  const startNewGame = () => {
    const { puzzle } = generateBoard();
    setGrid(puzzle);
    setInitialGrid(puzzle.map(row => [...row]));
    setTime(0);
    setIsPlaying(true);
    setErrors([]);
  };

  const checkWinCondition = (currentGrid) => {
    // Check if filled
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === 0) return false;
      }
    }

    // Check validity
    let newErrors = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = currentGrid[r][c];
        let isValid = true;
        // check row
        for (let i = 0; i < 4; i++) {
          if (i !== c && currentGrid[r][i] === val) isValid = false;
        }
        // check col
        for (let i = 0; i < 4; i++) {
          if (i !== r && currentGrid[i][c] === val) isValid = false;
        }
        // check box
        const br = Math.floor(r / 2) * 2;
        const bc = Math.floor(c / 2) * 2;
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            if ((br + i !== r || bc + j !== c) && currentGrid[br + i][bc + j] === val) {
              isValid = false;
            }
          }
        }
        if (!isValid) newErrors.push(`${r},${c}`);
      }
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      setIsPlaying(false);
      submitScore(time);
      return true;
    }
    return false;
  };

  const handleCellChange = (r, c, val) => {
    if (!isPlaying || initialGrid[r][c] !== 0) return;
    
    // Allow 1-4 or clear
    let num = parseInt(val);
    if (isNaN(num) || num < 1 || num > 4) num = 0;
    
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);

    // Only check win if all cells are filled
    const isFilled = newGrid.every(row => row.every(cell => cell !== 0));
    if (isFilled) {
      checkWinCondition(newGrid);
    } else {
      setErrors([]); // clear errors while editing
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Hub
        </button>
        <div className="game-timer">{formatTime(time)}</div>
        <button className="btn btn-primary" onClick={startNewGame}>
          Restart
        </button>
      </div>

      <div className="sudoku-grid">
        {grid.map((row, r) => 
          row.map((cell, c) => {
            const isFixed = initialGrid[r] && initialGrid[r][c] !== 0;
            const isError = errors.includes(`${r},${c}`);
            
            return (
              <input
                key={`${r}-${c}`}
                type="text"
                className={`sudoku-cell ${isFixed ? 'fixed' : ''} ${isError ? 'error' : ''}`}
                value={cell === 0 ? '' : cell}
                readOnly={isFixed || !isPlaying}
                onChange={(e) => handleCellChange(r, c, e.target.value)}
                maxLength={1}
              />
            );
          })
        )}
      </div>

      {!isPlaying && errors.length === 0 && grid.length > 0 && grid[0][0] !== 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'center', color: '#10b981' }}>
          <h2>🎉 Solved in {formatTime(time)}!</h2>
        </div>
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
