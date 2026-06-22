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

// Generates a valid 9x9 Sudoku board with a unique solution
function generateBoard() {
  const random = getDailyRNG();
  
  // A base fully solved 9x9 board
  const baseSolution = [
    [5,3,4, 6,7,8, 9,1,2],
    [6,7,2, 1,9,5, 3,4,8],
    [1,9,8, 3,4,2, 5,6,7],
    [8,5,9, 7,6,1, 4,2,3],
    [4,2,6, 8,5,3, 7,9,1],
    [7,1,3, 9,2,4, 8,5,6],
    [9,6,1, 5,3,7, 2,8,4],
    [2,8,7, 4,1,9, 6,3,5],
    [3,4,5, 2,8,6, 1,7,9]
  ];

  // A base puzzle with exactly one unique solution
  const basePuzzle = [
    [5,3,0, 0,7,0, 0,0,0],
    [6,0,0, 1,9,5, 0,0,0],
    [0,9,8, 0,0,0, 0,6,0],
    [8,0,0, 0,6,0, 0,0,3],
    [4,0,0, 8,0,3, 0,0,1],
    [7,0,0, 0,2,0, 0,0,6],
    [0,6,0, 0,0,0, 2,8,0],
    [0,0,0, 4,1,9, 0,0,5],
    [0,0,0, 0,8,0, 0,7,9]
  ];

  // Apply Isomorphic Transformations to safely shuffle the board without breaking uniqueness
  let sol = baseSolution.map(r => [...r]);
  let puz = basePuzzle.map(r => [...r]);

  // 1. Permute digits
  const perm = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => random() - 0.5);
  sol = sol.map(row => row.map(cell => perm[cell - 1]));
  puz = puz.map(row => row.map(cell => cell === 0 ? 0 : perm[cell - 1]));

  // Helper for shuffling array elements
  const shuffle = (arr) => arr.sort(() => random() - 0.5);

  // 2. Shuffle rows within bands
  for (let band = 0; band < 3; band++) {
    const indices = shuffle([0, 1, 2]);
    const solBand = [sol[band*3], sol[band*3+1], sol[band*3+2]];
    const puzBand = [puz[band*3], puz[band*3+1], puz[band*3+2]];
    for (let i = 0; i < 3; i++) {
      sol[band*3 + i] = solBand[indices[i]];
      puz[band*3 + i] = puzBand[indices[i]];
    }
  }

  // 3. Shuffle columns within stacks
  for (let stack = 0; stack < 3; stack++) {
    const indices = shuffle([0, 1, 2]);
    const solCols = indices.map(idx => sol.map(row => row[stack*3 + idx]));
    const puzCols = indices.map(idx => puz.map(row => row[stack*3 + idx]));
    for (let r = 0; r < 9; r++) {
      for (let i = 0; i < 3; i++) {
        sol[r][stack*3 + i] = solCols[i][r];
        puz[r][stack*3 + i] = puzCols[i][r];
      }
    }
  }

  // 4. Shuffle bands
  const bandIndices = shuffle([0, 1, 2]);
  const finalSol = [], finalPuz = [];
  for (let i = 0; i < 3; i++) {
    for (let r = 0; r < 3; r++) {
      finalSol.push(sol[bandIndices[i]*3 + r]);
      finalPuz.push(puz[bandIndices[i]*3 + r]);
    }
  }
  sol = finalSol;
  puz = finalPuz;

  // 5. Shuffle stacks
  const stackIndices = shuffle([0, 1, 2]);
  for (let r = 0; r < 9; r++) {
    const solRow = [], puzRow = [];
    for (let i = 0; i < 3; i++) {
      for (let c = 0; c < 3; c++) {
        solRow.push(sol[r][stackIndices[i]*3 + c]);
        puzRow.push(puz[r][stackIndices[i]*3 + c]);
      }
    }
    sol[r] = solRow;
    puz[r] = puzRow;
  }

  return { solution: sol, puzzle: puz };
}

export default function MiniSudoku({ onBack }) {
  const [grid, setGrid] = useState([]);
  const [initialGrid, setInitialGrid] = useState([]);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [errors, setErrors] = useState([]);
  const [hasPlayed, setHasPlayed] = useState(false);

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

  const fetchStatus = async () => {
    try {
      const res = await api.get('/games/status');
      if (res.data.success) {
        setHasPlayed(res.data.status.sudoku);
        if (!res.data.status.sudoku) {
          startNewGame();
        }
      }
    } catch (err) {
      console.error('Failed to fetch status');
    }
  };

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
      setTimeout(() => {
        setHasPlayed(true);
      }, 2500);
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
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentGrid[r][c] === 0) return false;
      }
    }

    // Check validity
    let newErrors = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = currentGrid[r][c];
        let isValid = true;
        // check row
        for (let i = 0; i < 9; i++) {
          if (i !== c && currentGrid[r][i] === val) isValid = false;
        }
        // check col
        for (let i = 0; i < 9; i++) {
          if (i !== r && currentGrid[i][c] === val) isValid = false;
        }
        // check box
        const br = Math.floor(r / 3) * 3;
        const bc = Math.floor(c / 3) * 3;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
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
    
    // Allow 1-9 or clear
    let num = parseInt(val);
    if (isNaN(num) || num < 1 || num > 9) num = 0;
    
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
          <h2 style={{ marginBottom: '1rem' }}>You've already solved today's puzzle!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Great job! Come back tomorrow for a new Mini Sudoku challenge.</p>
        </div>
      ) : (
        <>
          <div className="sudoku-grid">
            {grid.map((row, r) => 
              row.map((cell, c) => {
                const isFixed = initialGrid[r] && initialGrid[r][c] !== 0;
                const isError = errors.includes(`${r},${c}`);
                
                return (
                  <div key={`${r}-${c}`} className="sudoku-cell-wrapper">
                    <input
                      type="text"
                      className={`sudoku-cell ${isFixed ? 'fixed' : ''} ${isError ? 'error' : ''}`}
                      value={cell === 0 ? '' : cell}
                      readOnly={isFixed || !isPlaying}
                      onChange={(e) => handleCellChange(r, c, e.target.value)}
                      maxLength={1}
                    />
                  </div>
                );
              })
            )}
          </div>

          {!isPlaying && errors.length === 0 && grid.length > 0 && grid[0][0] !== 0 && (
            <div style={{ marginTop: '2rem', textAlign: 'center', color: '#10b981' }}>
              <h2>🎉 Solved in {formatTime(time)}!</h2>
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
