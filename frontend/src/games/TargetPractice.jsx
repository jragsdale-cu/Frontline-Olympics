import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TargetPractice.css';

function TargetPractice({ playerName, saveScore }) {
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState([]);
  const [combo, setCombo] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const spawnRef = useRef(null);

  useEffect(() => {
    if (gameState === 'running') {
      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 0.1) {
            setGameState('finished');
            return 0;
          }
          return t - 0.1;
        });
      }, 100);

      // Spawn targets
      spawnRef.current = setInterval(() => {
        spawnTarget();
      }, 800);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'finished' && score > 0) {
      saveScore('Target Practice', score, playerName);
    }
  }, [gameState, score, playerName, saveScore]);

  const spawnTarget = () => {
    const newTarget = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 5, // 5% to 85%
      y: Math.random() * 80 + 5,
      size: Math.random() * 30 + 50, // 50-80px
    };

    setTargets((prev) => [...prev, newTarget]);

    // Remove target after 2 seconds
    setTimeout(() => {
      setTargets((prev) => prev.filter((t) => t.id !== newTarget.id));
      setCombo(0); // Reset combo if target disappears
    }, 2000);
  };

  const startGame = () => {
    setGameState('running');
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setCombo(0);
  };

  const hitTarget = (targetId) => {
    setTargets((prev) => prev.filter((t) => t.id !== targetId));
    const comboBonus = combo + 1;
    setScore((s) => s + 10 * comboBonus);
    setCombo(comboBonus);
  };

  return (
    <div className="game-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Menu
      </button>

      <div className="game-header">
        <h1 className="game-title">🎯 Target Practice</h1>
        <p className="game-subtitle">Click the targets before they disappear!</p>
      </div>

      <div className="game-card">
        {gameState === 'ready' && (
          <div className="ready-screen">
            <h2>Ready to Shoot?</h2>
            <p>Click as many targets as you can in 30 seconds!</p>
            <p>Build combos for bonus points! 🔥</p>
            <button className="btn btn-gold btn-large" onClick={startGame}>
              START GAME
            </button>
          </div>
        )}

        {gameState === 'running' && (
          <>
            <div className="game-stats">
              <div className="stat">
                <div className="stat-label">Score</div>
                <div className="stat-value">{score}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Time</div>
                <div className="stat-value">{timeLeft.toFixed(1)}s</div>
              </div>
              <div className="stat">
                <div className="stat-label">Combo</div>
                <div className="stat-value combo-display">×{combo || 1}</div>
              </div>
            </div>

            <div className="shooting-range">
              {targets.map((target) => (
                <div
                  key={target.id}
                  className="target"
                  style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                    width: `${target.size}px`,
                    height: `${target.size}px`,
                  }}
                  onClick={() => hitTarget(target.id)}
                >
                  🎯
                </div>
              ))}
            </div>
          </>
        )}

        {gameState === 'finished' && (
          <div className="finished-screen">
            <h2>🎉 Game Over!</h2>
            <div className="final-score">
              <div className="score-label">Final Score:</div>
              <div className="score-display">{score}</div>
            </div>
            <div className="score-details">
              <p>Targets Hit: {Math.floor(score / 10)}</p>
              <p>Accuracy: {targets.length === 0 ? '100%' : 'Great!'}</p>
            </div>
            <div className="button-row">
              <button className="btn btn-primary" onClick={startGame}>
                Play Again
              </button>
              <button className="btn btn-gold" onClick={() => navigate('/leaderboard')}>
                View Leaderboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TargetPractice;
