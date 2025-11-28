import React, { useState, useEffect } from 'react';
import {
  userApi,
  eventApi,
  awardApi,
  selfClaimApi,
  seasonApi,
  referenceApi,
} from '../api';
import './CoachDashboard.css';

function CoachDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('award');
  const [players, setPlayers] = useState([]);
  const [events, setEvents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selfClaims, setSelfClaims] = useState([]);
  const [recentAwards, setRecentAwards] = useState([]);
  const [activeSeason, setActiveSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Award form state
  const [awardForm, setAwardForm] = useState({
    branch: '',
    playerId: '',
    eventId: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, eventsData, refData, claimsData, awardsData, seasonData] =
        await Promise.all([
          userApi.getAll(),
          eventApi.getAll(),
          referenceApi.getAll(),
          selfClaimApi.getPending(),
          awardApi.getAll(),
          seasonApi.getActive(),
        ]);

      setPlayers(usersData.filter((u) => u.role === 'player'));
      setEvents(eventsData);
      setBranches(refData.branches);
      setSelfClaims(claimsData);
      setRecentAwards(awardsData.slice(-10).reverse());
      setActiveSeason(seasonData);

      // Set default branch
      if (refData.branches.length > 0 && !awardForm.branch) {
        setAwardForm((prev) => ({ ...prev, branch: refData.branches[0] }));
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAwardPoints = async (e) => {
    e.preventDefault();

    if (!awardForm.playerId || !awardForm.eventId) {
      showToast('Please select a player and event', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const event = events.find((e) => e.id === awardForm.eventId);

      await awardApi.create({
        userId: awardForm.playerId,
        eventId: awardForm.eventId,
        points: event.points,
        awardedBy: user.id,
        notes: awardForm.notes,
      });

      showToast(`Awarded ${event.points} points successfully!`, 'success');

      // Reset form
      setAwardForm({
        branch: awardForm.branch,
        playerId: '',
        eventId: '',
        notes: '',
      });

      // Reload data
      loadData();
    } catch (err) {
      showToast('Failed to award points', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveClaim = async (claim) => {
    try {
      await selfClaimApi.update(claim.id, {
        status: 'approved',
        coachId: user.id,
      });

      showToast('Claim approved!', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to approve claim', 'error');
    }
  };

  const handleRejectClaim = async (claim) => {
    const note = prompt('Rejection reason (optional):');

    try {
      await selfClaimApi.update(claim.id, {
        status: 'rejected',
        coachId: user.id,
        rejectionNote: note || undefined,
      });

      showToast('Claim rejected', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to reject claim', 'error');
    }
  };

  const handleResetSeason = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset the season? This will archive current standings and reset all points to zero.'
    );

    if (!confirmed) return;

    try {
      await seasonApi.reset();
      showToast('Season reset successfully!', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to reset season', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  const filteredPlayers = awardForm.branch
    ? players.filter((p) => p.branch === awardForm.branch)
    : players;

  return (
    <div className="page-container">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <div className="page-header">
        <h1 className="page-title">Coach Dashboard</h1>
        <p className="page-subtitle">Manage your team's performance</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'award' ? 'active' : ''}`}
          onClick={() => setActiveTab('award')}
        >
          Award Points
        </button>
        <button
          className={`tab ${activeTab === 'claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('claims')}
        >
          Self-Claims Queue
          {selfClaims.length > 0 && (
            <span className="tab-badge">{selfClaims.length}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === 'season' ? 'active' : ''}`}
          onClick={() => setActiveTab('season')}
        >
          Season Controls
        </button>
      </div>

      {/* Award Points Tab */}
      {activeTab === 'award' && (
        <div className="tab-content">
          <div className="card">
            <h2 className="section-title">Award Points to Player</h2>

            <form onSubmit={handleAwardPoints} className="award-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Branch</label>
                  <select
                    className="input"
                    value={awardForm.branch}
                    onChange={(e) =>
                      setAwardForm({ ...awardForm, branch: e.target.value, playerId: '' })
                    }
                    disabled={submitting}
                  >
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Player</label>
                  <select
                    className="input"
                    value={awardForm.playerId}
                    onChange={(e) =>
                      setAwardForm({ ...awardForm, playerId: e.target.value })
                    }
                    disabled={submitting}
                  >
                    <option value="">Select player...</option>
                    {filteredPlayers.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Event</label>
                  <select
                    className="input"
                    value={awardForm.eventId}
                    onChange={(e) =>
                      setAwardForm({ ...awardForm, eventId: e.target.value })
                    }
                    disabled={submitting}
                  >
                    <option value="">Select event...</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name} (+{event.points} pts - {event.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  className="input"
                  rows="2"
                  placeholder="Add any additional notes..."
                  value={awardForm.notes}
                  onChange={(e) =>
                    setAwardForm({ ...awardForm, notes: e.target.value })
                  }
                  disabled={submitting}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Awarding...' : 'Award Points'}
              </button>
            </form>
          </div>

          {/* Recent Awards */}
          <div className="card">
            <h2 className="section-title">Recent Awards</h2>

            {recentAwards.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-text">No awards yet</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Event</th>
                      <th>Points</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAwards.map((award) => {
                      const player = players.find((p) => p.id === award.userId);
                      const event = events.find((e) => e.id === award.eventId);

                      return (
                        <tr key={award.id}>
                          <td>{player?.name || 'Unknown'}</td>
                          <td>{event?.name || 'Unknown Event'}</td>
                          <td className="points-cell">+{award.points}</td>
                          <td>{new Date(award.dateAwarded).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Self-Claims Queue Tab */}
      {activeTab === 'claims' && (
        <div className="tab-content">
          <div className="card">
            <h2 className="section-title">Pending Self-Claims</h2>

            {selfClaims.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">✅</div>
                <p className="empty-state-text">
                  No pending claims. You're all caught up!
                </p>
              </div>
            ) : (
              <div className="claims-list">
                {selfClaims.map((claim) => {
                  const player = players.find((p) => p.id === claim.userId);
                  const event = claim.requestedEventId
                    ? events.find((e) => e.id === claim.requestedEventId)
                    : null;

                  return (
                    <div key={claim.id} className="claim-item">
                      <div className="claim-header">
                        <div>
                          <strong>{player?.name || 'Unknown'}</strong>
                          <span className="claim-branch">
                            {player?.branch}
                          </span>
                        </div>
                        <span className="claim-date">
                          {new Date(claim.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {event && (
                        <div className="claim-event">
                          <strong>Event:</strong> {event.name} (+{event.points}{' '}
                          pts)
                        </div>
                      )}

                      {claim.description && (
                        <div className="claim-description">
                          {claim.description}
                        </div>
                      )}

                      <div className="claim-actions">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApproveClaim(claim)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRejectClaim(claim)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Season Controls Tab */}
      {activeTab === 'season' && (
        <div className="tab-content">
          <div className="card">
            <h2 className="section-title">Current Season</h2>

            {activeSeason && (
              <div className="season-info">
                <div className="season-detail">
                  <strong>Season Name:</strong> {activeSeason.name}
                </div>
                <div className="season-detail">
                  <strong>Start Date:</strong>{' '}
                  {new Date(activeSeason.startDate).toLocaleDateString()}
                </div>
                <div className="season-detail">
                  <strong>End Date:</strong>{' '}
                  {new Date(activeSeason.endDate).toLocaleDateString()}
                </div>
              </div>
            )}

            <div className="season-actions">
              <button
                className="btn btn-danger"
                onClick={handleResetSeason}
              >
                Reset Season
              </button>
              <p className="season-warning">
                ⚠️ This will archive current standings and reset all player
                points to zero. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoachDashboard;
