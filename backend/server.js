import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { store } from './data/store.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ==================== USER ROUTES ====================

// Get all users
app.get('/api/users', (req, res) => {
  const users = store.getUsers();
  res.json(users);
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const user = store.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Create or get user (login)
app.post('/api/users/login', (req, res) => {
  const { name, role, branch } = req.body;

  if (!name || !role || !branch) {
    return res.status(400).json({ error: 'Name, role, and branch are required' });
  }

  // Check if user exists
  let user = store.getUserByName(name);

  if (!user) {
    // Create new user
    user = store.createUser({ name, role, branch });
  }

  res.json(user);
});

// ==================== EVENT ROUTES ====================

// Get all events
app.get('/api/events', (req, res) => {
  const events = store.getEvents();
  res.json(events);
});

// Create event
app.post('/api/events', (req, res) => {
  const { name, description, category, points, frequency } = req.body;

  if (!name || !category || points === undefined) {
    return res.status(400).json({ error: 'Name, category, and points are required' });
  }

  const event = store.createEvent({ name, description, category, points, frequency: frequency || 'unlimited' });
  res.json(event);
});

// Update event
app.put('/api/events/:id', (req, res) => {
  const event = store.updateEvent(req.params.id, req.body);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event);
});

// Delete event
app.delete('/api/events/:id', (req, res) => {
  const success = store.deleteEvent(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json({ message: 'Event deleted' });
});

// ==================== AWARD ROUTES ====================

// Get all awards
app.get('/api/awards', (req, res) => {
  const awards = store.getAwards();
  res.json(awards);
});

// Get awards for a specific user
app.get('/api/awards/user/:userId', (req, res) => {
  const awards = store.getAwardsByUserId(req.params.userId);
  res.json(awards);
});

// Create award (coach awards points to player)
app.post('/api/awards', (req, res) => {
  const { userId, eventId, points, awardedBy, notes } = req.body;

  if (!userId || !eventId || points === undefined) {
    return res.status(400).json({ error: 'userId, eventId, and points are required' });
  }

  const award = store.createAward({ userId, eventId, points, awardedBy, notes });

  // Check and award badges
  const newBadges = store.checkAndAwardBadges(userId);

  res.json({ award, newBadges });
});

// ==================== BADGE ROUTES ====================

// Get all badges
app.get('/api/badges', (req, res) => {
  const badges = store.getBadges();
  res.json(badges);
});

// Get badges for a user
app.get('/api/badges/user/:userId', (req, res) => {
  const user = store.getUserById(req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const allBadges = store.getBadges();
  const userBadges = allBadges.filter(b => user.badges.includes(b.id));

  res.json(userBadges);
});

// ==================== SELF-CLAIM ROUTES ====================

// Get all self-claims
app.get('/api/self-claims', (req, res) => {
  const claims = store.getSelfClaims();
  res.json(claims);
});

// Get pending self-claims
app.get('/api/self-claims/pending', (req, res) => {
  const claims = store.getPendingSelfClaims();
  res.json(claims);
});

// Create self-claim
app.post('/api/self-claims', (req, res) => {
  const { userId, requestedEventId, description } = req.body;

  if (!userId || (!requestedEventId && !description)) {
    return res.status(400).json({ error: 'userId and either requestedEventId or description are required' });
  }

  const claim = store.createSelfClaim({ userId, requestedEventId, description });
  res.json(claim);
});

// Approve or reject self-claim
app.put('/api/self-claims/:id', (req, res) => {
  const { status, coachId, rejectionNote, awardedPoints } = req.body;

  if (!status || !coachId) {
    return res.status(400).json({ error: 'status and coachId are required' });
  }

  const claim = store.updateSelfClaim(req.params.id, { status, coachId, rejectionNote });

  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }

  // If approved, create an award
  let award = null;
  let newBadges = [];

  if (status === 'approved' && claim.requestedEventId) {
    const event = store.getEvents().find(e => e.id === claim.requestedEventId);
    if (event) {
      award = store.createAward({
        userId: claim.userId,
        eventId: claim.requestedEventId,
        points: awardedPoints || event.points,
        awardedBy: coachId,
        notes: `Self-claimed achievement approved`
      });

      newBadges = store.checkAndAwardBadges(claim.userId);
    }
  }

  res.json({ claim, award, newBadges });
});

// ==================== SEASON ROUTES ====================

// Get all seasons
app.get('/api/seasons', (req, res) => {
  const seasons = store.getSeasons();
  res.json(seasons);
});

// Get active season
app.get('/api/seasons/active', (req, res) => {
  const season = store.getActiveSeason();
  if (!season) {
    return res.status(404).json({ error: 'No active season found' });
  }
  res.json(season);
});

// Get archived seasons
app.get('/api/seasons/archived', (req, res) => {
  const seasons = store.getArchivedSeasons();
  res.json(seasons);
});

// Reset season (archive current and start new)
app.post('/api/seasons/reset', (req, res) => {
  const newSeason = store.resetSeason();
  res.json(newSeason);
});

// ==================== LEADERBOARD ROUTES ====================

// Get leaderboard (by player)
app.get('/api/leaderboard/players', (req, res) => {
  const { seasonId } = req.query;

  let users;

  if (seasonId && seasonId !== 'current') {
    // Get archived season data
    const archivedSeasons = store.getArchivedSeasons();
    const season = archivedSeasons.find(s => s.id === seasonId);

    if (!season || !season.finalStandings) {
      return res.json([]);
    }

    users = season.finalStandings.map(standing => ({
      id: standing.userId,
      name: standing.name,
      branch: standing.branch,
      totalPoints: standing.points,
      badges: standing.badges
    }));
  } else {
    // Current season
    users = store.getUsers().filter(u => u.role === 'player');
  }

  const leaderboard = users
    .map(user => ({
      id: user.id,
      name: user.name,
      branch: user.branch,
      points: user.totalPoints,
      badgeCount: user.badges.length
    }))
    .sort((a, b) => b.points - a.points);

  res.json(leaderboard);
});

// Get leaderboard (by branch)
app.get('/api/leaderboard/branches', (req, res) => {
  const { seasonId } = req.query;

  let users;

  if (seasonId && seasonId !== 'current') {
    // Get archived season data
    const archivedSeasons = store.getArchivedSeasons();
    const season = archivedSeasons.find(s => s.id === seasonId);

    if (!season || !season.finalStandings) {
      return res.json([]);
    }

    users = season.finalStandings.map(standing => ({
      branch: standing.branch,
      totalPoints: standing.points
    }));
  } else {
    // Current season
    users = store.getUsers().filter(u => u.role === 'player');
  }

  const branches = store.getBranches();
  const branchLeaderboard = branches.map(branch => {
    const branchUsers = users.filter(u => u.branch === branch);
    const totalPoints = branchUsers.reduce((sum, u) => sum + (u.totalPoints || u.points || 0), 0);
    const averagePoints = branchUsers.length > 0 ? totalPoints / branchUsers.length : 0;

    return {
      branch,
      totalPoints,
      averagePoints: Math.round(averagePoints * 10) / 10,
      playerCount: branchUsers.length
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  res.json(branchLeaderboard);
});

// ==================== STATS ROUTES ====================

// Get player stats
app.get('/api/stats/player/:userId', (req, res) => {
  const user = store.getUserById(req.params.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get all players
  const allPlayers = store.getUsers().filter(u => u.role === 'player');

  // Sort by points
  const sortedPlayers = [...allPlayers].sort((a, b) => b.totalPoints - a.totalPoints);

  // Find user's rank
  const overallRank = sortedPlayers.findIndex(u => u.id === user.id) + 1;

  // Find rank within branch
  const branchPlayers = sortedPlayers.filter(u => u.branch === user.branch);
  const branchRank = branchPlayers.findIndex(u => u.id === user.id) + 1;

  // Get today's awards
  const userAwards = store.getAwardsByUserId(user.id);
  const today = new Date().toISOString().split('T')[0];
  const todayAwards = userAwards.filter(a => a.dateAwarded.startsWith(today));

  res.json({
    userId: user.id,
    name: user.name,
    branch: user.branch,
    points: user.totalPoints,
    badgeCount: user.badges.length,
    overallRank,
    branchRank,
    branchPlayerCount: branchPlayers.length,
    totalPlayerCount: allPlayers.length,
    todayAwards: todayAwards.map(a => {
      const event = store.getEvents().find(e => e.id === a.eventId);
      return {
        ...a,
        eventName: event ? event.name : 'Unknown Event'
      };
    })
  });
});

// Get reference data (branches, categories)
app.get('/api/reference', (req, res) => {
  res.json({
    branches: store.getBranches(),
    categories: store.getCategories()
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`Teller Olympics backend running on port ${PORT}`);
});
