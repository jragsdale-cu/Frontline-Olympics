import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = user.role === 'player'
    ? [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/leaderboard', label: 'Leaderboard' },
        { path: '/badges', label: 'Badges' },
      ]
    : [
        { path: '/coach', label: 'Coach Dashboard' },
        { path: '/leaderboard', label: 'Leaderboard' },
        { path: '/badges', label: 'Badges' },
      ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-logo">🏅</span>
          <span className="navbar-title">Teller Olympics</span>
        </div>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-branch">{user.branch}</span>
          </div>
          <button onClick={onLogout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
