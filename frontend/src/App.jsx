import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import LoginPage from './pages/LoginPage';
import PlayerDashboard from './pages/PlayerDashboard';
import CoachDashboard from './pages/CoachDashboard';
import LeaderboardPage from './pages/LeaderboardPage';
import BadgeGalleryPage from './pages/BadgeGalleryPage';

// Components
import Navbar from './components/Navbar';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <div className="App">
        {currentUser && <Navbar user={currentUser} onLogout={handleLogout} />}

        <Routes>
          <Route
            path="/"
            element={
              currentUser ? (
                currentUser.role === 'player' ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/coach" replace />
                )
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              currentUser && currentUser.role === 'player' ? (
                <PlayerDashboard user={currentUser} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/coach"
            element={
              currentUser && currentUser.role === 'coach' ? (
                <CoachDashboard user={currentUser} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/leaderboard"
            element={
              currentUser ? (
                <LeaderboardPage user={currentUser} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/badges"
            element={
              currentUser ? (
                <BadgeGalleryPage user={currentUser} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
