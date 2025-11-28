// API utility functions for Teller Olympics

const API_BASE = '/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// User API
export const userApi = {
  login: (name, role, branch) =>
    apiCall('/users/login', {
      method: 'POST',
      body: JSON.stringify({ name, role, branch }),
    }),

  getAll: () => apiCall('/users'),

  getById: (id) => apiCall(`/users/${id}`),
};

// Event API
export const eventApi = {
  getAll: () => apiCall('/events'),

  create: (eventData) =>
    apiCall('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),

  update: (id, updates) =>
    apiCall(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  delete: (id) =>
    apiCall(`/events/${id}`, {
      method: 'DELETE',
    }),
};

// Award API
export const awardApi = {
  getAll: () => apiCall('/awards'),

  getByUser: (userId) => apiCall(`/awards/user/${userId}`),

  create: (awardData) =>
    apiCall('/awards', {
      method: 'POST',
      body: JSON.stringify(awardData),
    }),
};

// Badge API
export const badgeApi = {
  getAll: () => apiCall('/badges'),

  getByUser: (userId) => apiCall(`/badges/user/${userId}`),
};

// Self-claim API
export const selfClaimApi = {
  getAll: () => apiCall('/self-claims'),

  getPending: () => apiCall('/self-claims/pending'),

  create: (claimData) =>
    apiCall('/self-claims', {
      method: 'POST',
      body: JSON.stringify(claimData),
    }),

  update: (id, updates) =>
    apiCall(`/self-claims/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
};

// Season API
export const seasonApi = {
  getAll: () => apiCall('/seasons'),

  getActive: () => apiCall('/seasons/active'),

  getArchived: () => apiCall('/seasons/archived'),

  reset: () =>
    apiCall('/seasons/reset', {
      method: 'POST',
    }),
};

// Leaderboard API
export const leaderboardApi = {
  getPlayers: (seasonId = 'current') =>
    apiCall(`/leaderboard/players?seasonId=${seasonId}`),

  getBranches: (seasonId = 'current') =>
    apiCall(`/leaderboard/branches?seasonId=${seasonId}`),
};

// Stats API
export const statsApi = {
  getPlayerStats: (userId) => apiCall(`/stats/player/${userId}`),
};

// Reference data API
export const referenceApi = {
  getAll: () => apiCall('/reference'),
};
