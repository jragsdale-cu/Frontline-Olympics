import React, { useState, useEffect } from 'react';
import { statsApi, badgeApi, eventApi, selfClaimApi } from '../api';
import './PlayerDashboard.css';

function PlayerDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimFormData, setClaimFormData] = useState({
    eventId: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, badgesData, allBadgesData, eventsData] = await Promise.all([
        statsApi.getPlayerStats(user.id),
        badgeApi.getByUser(user.id),
        badgeApi.getAll(),
        eventApi.getAll(),
      ]);

      setStats(statsData);
      setBadges(badgesData);
      setAllBadges(allBadgesData);
      setEvents(eventsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();

    if (!claimFormData.eventId && !claimFormData.description) {
      showToast('Please select an event or enter a description', 'error');
      return;
    }

    setSubmitting(true);

    try {
      await selfClaimApi.create({
        userId: user.id,
        requestedEventId: claimFormData.eventId || undefined,
        description: claimFormData.description,
      });

      showToast('Achievement submitted for review!', 'success');
      setClaimFormData({ eventId: '', description: '' });
      setShowClaimForm(false);
    } catch (err) {
      showToast('Failed to submit claim', 'error');
    } finally {
      setSubmitting(false);
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

  const earnedBadges = badges;
  const lockedBadges = allBadges.filter(
    (b) => !badges.find((eb) => eb.id === b.id)
  );

  return (
    <div className="page-container">
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">Welcome back, {user.name}!</h1>
        <p className="page-subtitle">{user.branch} Branch</p>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-value">{stats.points}</div>
          <div className="stat-label">Total Points</div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-value">#{stats.branchRank}</div>
          <div className="stat-label">
            Rank in {user.branch}
            <span className="stat-meta">
              out of {stats.branchPlayerCount}
            </span>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-value">#{stats.overallRank}</div>
          <div className="stat-label">
            Overall Rank
            <span className="stat-meta">
              out of {stats.totalPlayerCount}
            </span>
          </div>
        </div>

        <div className="stat-card stat-gold">
          <div className="stat-value">{stats.badgeCount}</div>
          <div className="stat-label">Badges Earned</div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="dashboard-section">
        <h2 className="section-title">Your Badges</h2>

        {earnedBadges.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🎖️</div>
              <p className="empty-state-text">
                You haven't earned any badges yet. Keep up the great work!
              </p>
            </div>
          </div>
        ) : (
          <div className="badges-grid">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="badge-card earned">
                <div
                  className="badge-icon"
                  style={{ background: badge.iconColor }}
                >
                  🏆
                </div>
                <div className="badge-name">{badge.name}</div>
                <div className="badge-description">{badge.description}</div>
              </div>
            ))}
          </div>
        )}

        {lockedBadges.length > 0 && (
          <>
            <h3 className="subsection-title">Locked Badges</h3>
            <div className="badges-grid">
              {lockedBadges.slice(0, 4).map((badge) => (
                <div key={badge.id} className="badge-card locked">
                  <div className="badge-icon">🔒</div>
                  <div className="badge-name">{badge.name}</div>
                  <div className="badge-description">{badge.description}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Today's Highlights */}
      <div className="dashboard-section">
        <h2 className="section-title">Today's Highlights</h2>

        {stats.todayAwards.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">⭐</div>
              <p className="empty-state-text">
                No achievements yet today. Go make it happen!
              </p>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="awards-list">
              {stats.todayAwards.map((award) => (
                <div key={award.id} className="award-item">
                  <div className="award-icon">✨</div>
                  <div className="award-content">
                    <div className="award-name">{award.eventName}</div>
                    {award.notes && (
                      <div className="award-notes">{award.notes}</div>
                    )}
                  </div>
                  <div className="award-points">+{award.points}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Self-Claim Section */}
      <div className="dashboard-section">
        <h2 className="section-title">Self-Claim an Achievement</h2>

        {!showClaimForm ? (
          <div className="card">
            <p className="claim-intro">
              Did something awesome? Submit your achievement for your coach to review!
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowClaimForm(true)}
            >
              Submit Achievement
            </button>
          </div>
        ) : (
          <div className="card">
            <form onSubmit={handleSubmitClaim} className="claim-form">
              <div className="form-group">
                <label className="form-label">Event Type (Optional)</label>
                <select
                  className="input"
                  value={claimFormData.eventId}
                  onChange={(e) =>
                    setClaimFormData({ ...claimFormData, eventId: e.target.value })
                  }
                  disabled={submitting}
                >
                  <option value="">Select an event...</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} (+{event.points} pts)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="input"
                  rows="3"
                  placeholder="Describe what you accomplished..."
                  value={claimFormData.description}
                  onChange={(e) =>
                    setClaimFormData({
                      ...claimFormData,
                      description: e.target.value,
                    })
                  }
                  disabled={submitting}
                ></textarea>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowClaimForm(false);
                    setClaimFormData({ eventId: '', description: '' });
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerDashboard;
