import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Leaderboard.css';

function Leaderboard({ scores }) {
  const [selectedGame, setSelectedGame] = useState('all');
  const navigate = useNavigate();

  const games = ['all', 'Sprint Race', 'Target Practice', 'Reaction Test'];

  const filteredScores =
    selectedGame === 'all'
      ? scores
      : scores.filter((s) => s.game === selectedGame);

  const sortedScores = [...filteredScores].sort((a, b) => {
    // For Sprint Race, lower is better (time)
    if (a.game === 'Sprint Race') {
      return parseFloat(a.score) - parseFloat(b.score);
    }
    // For others, higher is better
    return parseFloat(b.score) - parseFloat(a.score);
  });

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getGameIcon = (game) => {
    if (game === 'Sprint Race') return '🏃';
    if (game === 'Target Practice') return '🎯';
    if (game === 'Reaction Test') return '⚡';
    return '🏅';
  };

  const formatScore = (score, game) => {
    if (game === 'Sprint Race') {
      return `${score}s`;
    }
    return score;
  };

  return (
    <div className="game-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Menu
      </button>

      <div className="game-header">
        <h1 className="game-title">🏆 Leaderboard</h1>
        <p className="game-subtitle">Top Athletes of All Time</p>
      </div>

      <div className="leaderboard-card">
        <div className="game-filter">
          {games.map((game) => (
            <button
              key={game}
              className={`filter-btn ${selectedGame === game ? 'active' : ''}`}
              onClick={() => setSelectedGame(game)}
            >
              {game === 'all' ? '🏅 All Games' : `${getGameIcon(game)} ${game}`}
            </button>
          ))}
        </div>

        {sortedScores.length === 0 ? (
          <div className="empty-leaderboard">
            <div className="empty-icon">🏆</div>
            <p>No scores yet! Be the first to play!</p>
            <button className="btn btn-gold" onClick={() => navigate('/')}>
              Play Now
            </button>
          </div>
        ) : (
          <div className="scores-list">
            {sortedScores.map((scoreEntry, index) => (
              <div key={scoreEntry.id} className={`score-item rank-${index}`}>
                <div className="rank">{getMedal(index)}</div>
                <div className="score-info">
                  <div className="player-name">{scoreEntry.playerName}</div>
                  <div className="game-name">
                    {getGameIcon(scoreEntry.game)} {scoreEntry.game}
                  </div>
                </div>
                <div className="score-value">
                  {formatScore(scoreEntry.score, scoreEntry.game)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="leaderboard-stats">
          <p>Total Games Played: {scores.length}</p>
          <p>
            Unique Players: {new Set(scores.map((s) => s.playerName)).size}
          </p>
        </div>

        <div className="leaderboard-actions">
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Play Games
          </button>
          {scores.length > 0 && (
            <button
              className="btn btn-danger"
              onClick={() => {
                if (
                  window.confirm('Are you sure you want to clear all scores?')
                ) {
                  localStorage.removeItem('scores');
                  window.location.reload();
                }
              }}
            >
              Clear Scores
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
