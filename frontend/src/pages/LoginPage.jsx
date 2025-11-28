import React, { useState, useEffect } from 'react';
import { userApi, referenceApi } from '../api';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('player');
  const [branch, setBranch] = useState('');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load reference data
    referenceApi.getAll()
      .then(data => {
        setBranches(data.branches);
        if (data.branches.length > 0) {
          setBranch(data.branches[0]);
        }
      })
      .catch(err => {
        console.error('Failed to load branches:', err);
        // Fallback branches
        const fallbackBranches = ['Center St', 'APR', 'BSC', 'Loves Park', 'Ottawa'];
        setBranches(fallbackBranches);
        setBranch(fallbackBranches[0]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      const user = await userApi.login(name.trim(), role, branch);
      onLogin(user);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">🏅</div>
          <h1 className="login-title">Teller Olympics</h1>
          <p className="login-subtitle">
            Track your performance, earn badges, and compete with your team!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              className="input"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              id="role"
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="player">Player (Teller/MSR/MSO)</option>
              <option value="coach">Coach (Manager/Supervisor)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="branch" className="form-label">
              Branch
            </label>
            <select
              id="branch"
              className="input"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={loading}
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? 'Entering...' : 'Enter Game'}
          </button>
        </form>

        <div className="login-info">
          <p>
            <strong>New here?</strong> Just enter your name and select your role to get started!
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
