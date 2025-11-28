import React, { useState, useEffect } from 'react';
import { leaderboardApi, seasonApi } from '../api';
import './LeaderboardPage.css';

function LeaderboardPage({ user }) {
  const [viewType, setViewType] = useState('players'); // 'players' or 'branches'
  const [seasonType, setSeasonType] = useState('current'); // 'current' or seasonId
  const [playersLeaderboard, setPlayersLeaderboard] = useState([]);
  const [branchesLeaderboard, setBranchesLeaderboard] = useState([]);
  const [archivedSeasons, setArchivedSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [viewType, seasonType]);

  const loadData = async () => {
    try {
      const archived = await seasonApi.getArchived();
      setArchivedSeasons(archived);
      loadLeaderboard();
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      if (viewType === 'players') {
        const data = await leaderboardApi.getPlayers(seasonType);
        setPlayersLeaderboard(data);
      } else {
        const data = await leaderboardApi.getBranches(seasonType);
        setBranchesLeaderboard(data);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Leaderboard</h1>
        <p className="page-subtitle">See who's leading the competition</p>
      </div>

      {/* Controls */}
      <div className="leaderboard-controls">
        <div className="control-group">
          <label className="control-label">View</label>
          <div className="button-group">
            <button
              className={`btn-toggle ${viewType === 'players' ? 'active' : ''}`}
              onClick={() => setViewType('players')}
            >
              By Player
            </button>
            <button
              className={`btn-toggle ${viewType === 'branches' ? 'active' : ''}`}
              onClick={() => setViewType('branches')}
            >
              By Branch
            </button>
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">Season</label>
          <select
            className="input season-select"
            value={seasonType}
            onChange={(e) => setSeasonType(e.target.value)}
          >
            <option value="current">Current Season</option>
            {archivedSeasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      ) : viewType === 'players' ? (
        <div className="leaderboard-container">
          {playersLeaderboard.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">🏆</div>
                <p className="empty-state-text">
                  No players on the leaderboard yet
                </p>
              </div>
            </div>
          ) : (
            <div className="leaderboard-list">
              {playersLeaderboard.map((player, index) => {
                const rank = index + 1;
                const medal = getMedalEmoji(rank);
                const rankClass = getRankClass(rank);
                const isCurrentUser = player.id === user.id;

                return (
                  <div
                    key={player.id}
                    className={`leaderboard-item ${rankClass} ${
                      isCurrentUser ? 'current-user' : ''
                    }`}
                  >
                    <div className="rank-section">
                      {medal ? (
                        <span className="medal">{medal}</span>
                      ) : (
                        <span className="rank-number">#{rank}</span>
                      )}
                    </div>

                    <div className="player-info">
                      <div className="player-name">
                        {player.name}
                        {isCurrentUser && (
                          <span className="you-badge">YOU</span>
                        )}
                      </div>
                      <div className="player-branch">{player.branch}</div>
                    </div>

                    <div className="player-stats">
                      <div className="stat">
                        <span className="stat-value">{player.points}</span>
                        <span className="stat-label">Points</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{player.badgeCount}</span>
                        <span className="stat-label">Badges</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="leaderboard-container">
          {branchesLeaderboard.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">🏆</div>
                <p className="empty-state-text">
                  No branch data available yet
                </p>
              </div>
            </div>
          ) : (
            <div className="leaderboard-list">
              {branchesLeaderboard.map((branch, index) => {
                const rank = index + 1;
                const medal = getMedalEmoji(rank);
                const rankClass = getRankClass(rank);
                const isUserBranch = branch.branch === user.branch;

                return (
                  <div
                    key={branch.branch}
                    className={`leaderboard-item branch-item ${rankClass} ${
                      isUserBranch ? 'current-user' : ''
                    }`}
                  >
                    <div className="rank-section">
                      {medal ? (
                        <span className="medal">{medal}</span>
                      ) : (
                        <span className="rank-number">#{rank}</span>
                      )}
                    </div>

                    <div className="player-info">
                      <div className="player-name">
                        {branch.branch}
                        {isUserBranch && (
                          <span className="you-badge">YOUR BRANCH</span>
                        )}
                      </div>
                      <div className="player-branch">
                        {branch.playerCount} player{branch.playerCount !== 1 ? 's' : ''}
                      </div>
                    </div>

                    <div className="player-stats">
                      <div className="stat">
                        <span className="stat-value">{branch.totalPoints}</span>
                        <span className="stat-label">Total Points</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{branch.averagePoints}</span>
                        <span className="stat-label">Avg/Player</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LeaderboardPage;
