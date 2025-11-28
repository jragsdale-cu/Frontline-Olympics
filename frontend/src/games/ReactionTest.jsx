import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReactionTest.css';

function ReactionTest({ playerName, saveScore }) {
  const [gameState, setGameState] = useState('ready'); // ready, waiting, green, finished
  const [round, setRound] = useState(1);
  const [times, setTimes] = useState([]);
  const [currentTime, setCurrentTime] = useState(null);
  const [tooEarly, setTooEarly] = useState(false);
  const navigate = useNavigate();
  const startTimeRef = useRef(null);
  const timeoutRef = useRef(null);

  const MAX_ROUNDS = 5;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startGame = () => {
    setGameState('waiting');
    setRound(1);
    setTimes([]);
    setCurrentTime(null);
    setTooEarly(false);
    startRound();
  };

  const startRound = () => {
    setGameState('waiting');
    setTooEarly(false);

    // Random delay between 2-5 seconds
    const delay = Math.random() * 3000 + 2000;

    timeoutRef.current = setTimeout(() => {
      setGameState('green');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      // Clicked too early
      setTooEarly(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTimeout(() => {
        if (round < MAX_ROUNDS) {
          setRound((r) => r + 1);
          startRound();
        } else {
          finishGame();
        }
      }, 1500);
    } else if (gameState === 'green') {
      // Good click!
      const reactionTime = Date.now() - startTimeRef.current;
      setCurrentTime(reactionTime);
      const newTimes = [...times, reactionTime];
      setTimes(newTimes);

      if (round < MAX_ROUNDS) {
        setTimeout(() => {
          setRound((r) => r + 1);
          startRound();
        }, 1500);
      } else {
        setTimeout(() => {
          finishGame(newTimes);
        }, 1500);
      }
    }
  };

  const finishGame = (finalTimes = times) => {
    setGameState('finished');

    if (finalTimes.length > 0) {
      const avgTime = finalTimes.reduce((a, b) => a + b, 0) / finalTimes.length;
      // Score is inverse of average time (faster = higher score)
      const score = Math.max(0, 1000 - avgTime);
      saveScore('Reaction Test', score.toFixed(0), playerName);
    }
  };

  const averageTime =
    times.length > 0
      ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(0)
      : 0;

  const bestTime = times.length > 0 ? Math.min(...times).toFixed(0) : 0;

  return (
    <div className="game-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Menu
      </button>

      <div className="game-header">
        <h1 className="game-title">⚡ Reaction Test</h1>
        <p className="game-subtitle">Click when you see green!</p>
      </div>

      <div className="game-card">
        {gameState === 'ready' && (
          <div className="ready-screen">
            <h2>Test Your Reflexes!</h2>
            <p>Wait for the green signal, then click as fast as you can!</p>
            <p>You'll do {MAX_ROUNDS} rounds.</p>
            <button className="btn btn-gold btn-large" onClick={startGame}>
              START TEST
            </button>
          </div>
        )}

        {(gameState === 'waiting' || gameState === 'green') && (
          <>
            <div className="round-indicator">
              Round {round} / {MAX_ROUNDS}
            </div>

            <div
              className={`reaction-box ${
                gameState === 'green' ? 'green' : tooEarly ? 'red' : 'waiting'
              }`}
              onClick={handleClick}
            >
              {gameState === 'waiting' && !tooEarly && (
                <div className="instruction">Wait for green...</div>
              )}
              {tooEarly && <div className="instruction">Too Early! ❌</div>}
              {gameState === 'green' && currentTime === null && (
                <div className="instruction">CLICK NOW!</div>
              )}
              {currentTime !== null && (
                <div className="reaction-time">{currentTime}ms</div>
              )}
            </div>

            {times.length > 0 && (
              <div className="times-list">
                <h3>Your Times:</h3>
                <div className="times-grid">
                  {times.map((time, idx) => (
                    <div key={idx} className="time-chip">
                      {time}ms
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {gameState === 'finished' && (
          <div className="finished-screen">
            <h2>🎉 Test Complete!</h2>
            <div className="results-grid">
              <div className="result-item">
                <div className="result-label">Average Time</div>
                <div className="result-value">{averageTime}ms</div>
              </div>
              <div className="result-item">
                <div className="result-label">Best Time</div>
                <div className="result-value gold">{bestTime}ms</div>
              </div>
              <div className="result-item">
                <div className="result-label">Score</div>
                <div className="result-value">
                  {Math.max(0, 1000 - averageTime).toFixed(0)}
                </div>
              </div>
            </div>
            <div className="rating">
              {averageTime < 200 && '🔥 Lightning Fast!'}
              {averageTime >= 200 && averageTime < 300 && '⚡ Excellent!'}
              {averageTime >= 300 && averageTime < 400 && '👍 Good!'}
              {averageTime >= 400 && '💪 Keep Practicing!'}
            </div>
            <div className="button-row">
              <button className="btn btn-primary" onClick={startGame}>
                Test Again
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

export default ReactionTest;
