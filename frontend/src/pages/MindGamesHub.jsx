import { useState } from 'react';
import { Gamepad2, Brain, Grid3X3 } from 'lucide-react';
import MemoryMatch from '../components/games/MemoryMatch';
import MiniSudoku from '../components/games/MiniSudoku';
import '../styles/mindgames.css';

export default function MindGamesHub() {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame === 'memory') {
    return <MemoryMatch onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'sudoku') {
    return <MiniSudoku onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="header-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Gamepad2 size={24} />
          </div>
          <div>
            <h1 className="page-title">Mind Games</h1>
            <p className="page-subtitle">Take a quick break and train your logic skills.</p>
          </div>
        </div>
      </header>

      <div className="games-grid">
        {/* Memory Match Card */}
        <div className="game-card" onClick={() => setActiveGame('memory')}>
          <div className="game-card-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
            <Brain size={32} />
          </div>
          <div className="game-card-content">
            <h3>Memory Match</h3>
            <p>Find all matching pairs as fast as you can. A test of short-term memory.</p>
            <div className="game-stats">
              <span>Time limit: None</span>
              <span>Grid: 4x4</span>
            </div>
          </div>
        </div>

        {/* Mini Sudoku Card */}
        <div className="game-card" onClick={() => setActiveGame('sudoku')}>
          <div className="game-card-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Grid3X3 size={32} />
          </div>
          <div className="game-card-content">
            <h3>Mini Sudoku</h3>
            <p>A quick 4x4 logic puzzle. Fill the grid so every row, column, and 2x2 box has numbers 1-4.</p>
            <div className="game-stats">
              <span>Time limit: None</span>
              <span>Grid: 4x4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
