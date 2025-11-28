import React, { useState, useEffect } from 'react';
import { badgeApi } from '../api';
import './BadgeGalleryPage.css';

function BadgeGalleryPage({ user }) {
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, [user.id]);

  const loadBadges = async () => {
    setLoading(true);
    try {
      const [allBadges, earned] = await Promise.all([
        badgeApi.getAll(),
        badgeApi.getByUser(user.id),
      ]);

      setBadges(allBadges);
      setUserBadges(earned);
    } catch (err) {
      console.error('Failed to load badges:', err);
    } finally {
      setLoading(false);
    }
  };

  const isBadgeEarned = (badgeId) => {
    return userBadges.some((b) => b.id === badgeId);
  };

  const getBadgeStatusText = (badge) => {
    const earned = isBadgeEarned(badge.id);

    if (earned) {
      return { text: 'Earned', className: 'status-earned' };
    }

    // Show progress hint based on condition type
    if (badge.conditionType === 'eventCount') {
      const { count } = badge.conditionDetails;
      return { text: `Complete ${count} times`, className: 'status-locked' };
    } else if (badge.conditionType === 'streak') {
      const { count } = badge.conditionDetails;
      return { text: `${count} days in a row`, className: 'status-locked' };
    } else if (badge.conditionType === 'manual') {
      return { text: 'Special Achievement', className: 'status-locked' };
    }

    return { text: 'Locked', className: 'status-locked' };
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

  const earnedBadges = badges.filter((b) => isBadgeEarned(b.id));
  const lockedBadges = badges.filter((b) => !isBadgeEarned(b.id));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Badge Gallery</h1>
        <p className="page-subtitle">
          Earn badges by completing challenges and achievements
        </p>
      </div>

      <div className="badge-stats">
        <div className="badge-stat-item">
          <span className="badge-stat-value">{earnedBadges.length}</span>
          <span className="badge-stat-label">Earned</span>
        </div>
        <div className="badge-stat-separator">/</div>
        <div className="badge-stat-item">
          <span className="badge-stat-value">{badges.length}</span>
          <span className="badge-stat-label">Total Badges</span>
        </div>
      </div>

      {earnedBadges.length > 0 && (
        <div className="gallery-section">
          <h2 className="section-title">Your Badges</h2>
          <div className="badges-gallery">
            {earnedBadges.map((badge) => {
              const status = getBadgeStatusText(badge);

              return (
                <div key={badge.id} className="gallery-badge-card earned">
                  <div
                    className="gallery-badge-icon"
                    style={{ background: badge.iconColor }}
                  >
                    <span className="badge-emoji">🏆</span>
                  </div>
                  <div className="gallery-badge-content">
                    <h3 className="gallery-badge-name">{badge.name}</h3>
                    <p className="gallery-badge-description">
                      {badge.description}
                    </p>
                    <div className={`badge-status ${status.className}`}>
                      <span className="status-icon">✓</span>
                      {status.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {lockedBadges.length > 0 && (
        <div className="gallery-section">
          <h2 className="section-title">
            {earnedBadges.length > 0 ? 'Locked Badges' : 'All Badges'}
          </h2>
          <div className="badges-gallery">
            {lockedBadges.map((badge) => {
              const status = getBadgeStatusText(badge);

              return (
                <div key={badge.id} className="gallery-badge-card locked">
                  <div className="gallery-badge-icon">
                    <span className="badge-emoji">🔒</span>
                  </div>
                  <div className="gallery-badge-content">
                    <h3 className="gallery-badge-name">{badge.name}</h3>
                    <p className="gallery-badge-description">
                      {badge.description}
                    </p>
                    <div className={`badge-status ${status.className}`}>
                      {status.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {badges.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🎖️</div>
            <p className="empty-state-text">No badges available yet</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BadgeGalleryPage;
