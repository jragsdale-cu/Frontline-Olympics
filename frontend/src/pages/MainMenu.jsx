import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainMenu.css';

function MainMenu({ playerName, setPlayerName }) {
  const [tempName, setTempName] = useState(playerName);
  const navigate = useNavigate();

  const handleStartGame = (gamePath) => {
    if (!playerName) {
      alert('Please enter your name first!');
      return;
    }
    navigate(gamePath);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setPlayerName(tempName.trim());
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">🏅 TELLER OLYMPICS 🏅</h1>
        <p className="game-subtitle">Test your skills in 3 exciting challenges!</p>
      </div>

      {!playerName ? (
        <div className="game-card">
          <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>Enter Your Name</h2>
          <form onSubmit={handleNameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <input
              type="text"
              className="input"
              placeholder="Your name..."
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-gold btn-large">
              START
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="player-welcome">
            <p>Welcome, <strong>{playerName}</strong>!</p>
            <button
              className="change-name-btn"
              onClick={() => setPlayerName('')}
            >
              Change Name
            </button>
          </div>

          <div className="games-grid">
            <div className="game-option">
              <div className="game-icon">🏃</div>
              <h3>Sprint Race</h3>
              <p>Click as fast as you can to run 100 meters!</p>
              <button
                className="btn btn-primary"
                onClick={() => handleStartGame('/sprint')}
              >
                PLAY
              </button>
            </div>

            <div className="game-option">
              <div className="game-icon">🎯</div>
              <h3>Target Practice</h3>
              <p>Click the targets before time runs out!</p>
              <button
                className="btn btn-success"
                onClick={() => handleStartGame('/target')}
              >
                PLAY
              </button>
            </div>

            <div className="game-option">
              <div className="game-icon">⚡</div>
              <h3>Reaction Test</h3>
              <p>Click when the light turns green!</p>
              <button
                className="btn btn-danger"
                onClick={() => handleStartGame('/reaction')}
              >
                PLAY
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              className="btn btn-gold"
              onClick={() => navigate('/leaderboard')}
            >
              🏆 VIEW LEADERBOARD
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MainMenu;
