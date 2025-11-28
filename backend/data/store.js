// In-memory data store for Teller Olympics

// Initial data
const branches = ['Center St', 'APR', 'BSC', 'Loves Park', 'Ottawa'];

const categories = ['Speed', 'Accuracy', 'Service', 'Sales', 'Teamwork'];

// Events (predefined activities that earn points)
let events = [
  {
    id: '1',
    name: 'Fastest Balanced Drawer',
    description: 'Balanced drawer in record time with zero errors',
    category: 'Accuracy',
    points: 50,
    frequency: 'daily'
  },
  {
    id: '2',
    name: 'Zero Errors Day',
    description: 'Completed entire day with no transaction errors',
    category: 'Accuracy',
    points: 30,
    frequency: 'daily'
  },
  {
    id: '3',
    name: 'Member Compliment of the Day',
    description: 'Received direct member compliment',
    category: 'Service',
    points: 40,
    frequency: 'unlimited'
  },
  {
    id: '4',
    name: 'Cross-Sell Champion',
    description: 'Completed 5+ cross-sells in a day',
    category: 'Sales',
    points: 50,
    frequency: 'daily'
  },
  {
    id: '5',
    name: 'Human Espresso',
    description: 'Helped teammate handle a rush situation',
    category: 'Teamwork',
    points: 20,
    frequency: 'unlimited'
  },
  {
    id: '6',
    name: 'Queue Tamer',
    description: 'Reduced long line with exceptional flow',
    category: 'Speed',
    points: 25,
    frequency: 'unlimited'
  },
  {
    id: '7',
    name: 'Early Bird',
    description: 'Arrived early and opened branch smoothly',
    category: 'Teamwork',
    points: 15,
    frequency: 'daily'
  },
  {
    id: '8',
    name: 'Problem Solver',
    description: 'Resolved a complex member issue independently',
    category: 'Service',
    points: 35,
    frequency: 'unlimited'
  }
];

// Badges (achievements based on milestones)
let badges = [
  {
    id: 'b1',
    name: 'Gold Drawer',
    description: '5 days in a row with no balancing differences',
    conditionType: 'streak',
    conditionDetails: { eventId: '1', count: 5 },
    iconColor: '#FFD700'
  },
  {
    id: 'b2',
    name: 'Member Whisperer',
    description: '10 member compliments in a season',
    conditionType: 'eventCount',
    conditionDetails: { eventId: '3', count: 10 },
    iconColor: '#87CEEB'
  },
  {
    id: 'b3',
    name: 'Closer',
    description: '20 cross-sells completed in a season',
    conditionType: 'eventCount',
    conditionDetails: { eventId: '4', count: 20 },
    iconColor: '#32CD32'
  },
  {
    id: 'b4',
    name: 'Team Hero',
    description: 'Helped teammates 15 times in a season',
    conditionType: 'eventCount',
    conditionDetails: { eventId: '5', count: 15 },
    iconColor: '#FF6347'
  },
  {
    id: 'b5',
    name: 'Olympian',
    description: 'Finished top of the leaderboard',
    conditionType: 'manual',
    conditionDetails: { position: 1 },
    iconColor: '#FFD700'
  },
  {
    id: 'b6',
    name: 'Perfect Week',
    description: 'Zero errors for an entire week',
    conditionType: 'eventCount',
    conditionDetails: { eventId: '2', count: 5 },
    iconColor: '#9370DB'
  }
];

// Users (players and coaches)
let users = [
  {
    id: 'u1',
    name: 'Sarah Johnson',
    role: 'player',
    branch: 'Center St',
    badges: [],
    totalPoints: 0
  },
  {
    id: 'u2',
    name: 'Mike Chen',
    role: 'player',
    branch: 'Center St',
    badges: [],
    totalPoints: 0
  },
  {
    id: 'u3',
    name: 'Emily Rodriguez',
    role: 'player',
    branch: 'APR',
    badges: [],
    totalPoints: 0
  },
  {
    id: 'u4',
    name: 'James Wilson',
    role: 'coach',
    branch: 'Center St',
    badges: [],
    totalPoints: 0
  }
];

// Awards (points given to users for events)
let awards = [];

// Self-claims (player-submitted achievements awaiting approval)
let selfClaims = [];

// Seasons
let seasons = [
  {
    id: 's1',
    name: 'Week of 2025-11-24',
    startDate: '2025-11-24',
    endDate: '2025-12-01',
    isActive: true
  }
];

// Archived seasons (for historical leaderboards)
let archivedSeasons = [];

// Helper functions
let nextUserId = users.length + 1;
let nextAwardId = 1;
let nextSelfClaimId = 1;
let nextEventId = events.length + 1;
let nextSeasonId = seasons.length + 1;

export const store = {
  // Getters
  getBranches: () => branches,
  getCategories: () => categories,
  getEvents: () => events,
  getBadges: () => badges,
  getUsers: () => users,
  getAwards: () => awards,
  getSelfClaims: () => selfClaims,
  getSeasons: () => seasons,
  getArchivedSeasons: () => archivedSeasons,
  getActiveSeason: () => seasons.find(s => s.isActive),

  // User operations
  createUser: (userData) => {
    const user = {
      id: `u${nextUserId++}`,
      badges: [],
      totalPoints: 0,
      ...userData
    };
    users.push(user);
    return user;
  },

  getUserById: (id) => users.find(u => u.id === id),

  getUserByName: (name) => users.find(u => u.name.toLowerCase() === name.toLowerCase()),

  updateUser: (id, updates) => {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      return users[index];
    }
    return null;
  },

  // Award operations
  createAward: (awardData) => {
    const award = {
      id: `a${nextAwardId++}`,
      dateAwarded: new Date().toISOString(),
      ...awardData
    };
    awards.push(award);

    // Update user's total points
    const user = users.find(u => u.id === awardData.userId);
    if (user) {
      user.totalPoints += awardData.points;
    }

    return award;
  },

  getAwardsByUserId: (userId) => awards.filter(a => a.userId === userId),

  getAwardsBySeason: (seasonId) => {
    const season = seasons.find(s => s.id === seasonId);
    if (!season) return [];

    return awards.filter(a => {
      const awardDate = new Date(a.dateAwarded);
      const startDate = new Date(season.startDate);
      const endDate = new Date(season.endDate);
      return awardDate >= startDate && awardDate <= endDate;
    });
  },

  // Self-claim operations
  createSelfClaim: (claimData) => {
    const claim = {
      id: `sc${nextSelfClaimId++}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...claimData
    };
    selfClaims.push(claim);
    return claim;
  },

  updateSelfClaim: (id, updates) => {
    const index = selfClaims.findIndex(sc => sc.id === id);
    if (index !== -1) {
      selfClaims[index] = { ...selfClaims[index], ...updates };
      return selfClaims[index];
    }
    return null;
  },

  getPendingSelfClaims: () => selfClaims.filter(sc => sc.status === 'pending'),

  // Event operations
  createEvent: (eventData) => {
    const event = {
      id: `e${nextEventId++}`,
      ...eventData
    };
    events.push(event);
    return event;
  },

  updateEvent: (id, updates) => {
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...updates };
      return events[index];
    }
    return null;
  },

  deleteEvent: (id) => {
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
      events.splice(index, 1);
      return true;
    }
    return false;
  },

  // Season operations
  createSeason: (seasonData) => {
    const season = {
      id: `s${nextSeasonId++}`,
      isActive: false,
      ...seasonData
    };
    seasons.push(season);
    return season;
  },

  resetSeason: () => {
    // Archive current active season
    const activeSeason = seasons.find(s => s.isActive);
    if (activeSeason) {
      // Store final standings
      const seasonData = {
        ...activeSeason,
        isActive: false,
        finalStandings: users.map(u => ({
          userId: u.id,
          name: u.name,
          branch: u.branch,
          points: u.totalPoints,
          badges: [...u.badges]
        }))
      };
      archivedSeasons.unshift(seasonData);

      // Keep only last 5 seasons
      if (archivedSeasons.length > 5) {
        archivedSeasons = archivedSeasons.slice(0, 5);
      }
    }

    // Reset all user points
    users.forEach(u => {
      u.totalPoints = 0;
    });

    // Clear current awards (or move to archive if needed)
    awards = [];

    // Create new season
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const newSeason = {
      id: `s${nextSeasonId++}`,
      name: `Week of ${today.toISOString().split('T')[0]}`,
      startDate: today.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0],
      isActive: true
    };

    // Deactivate old seasons
    seasons.forEach(s => s.isActive = false);
    seasons.push(newSeason);

    return newSeason;
  },

  // Badge checking
  checkAndAwardBadges: (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return [];

    const userAwards = awards.filter(a => a.userId === userId);
    const newBadges = [];

    badges.forEach(badge => {
      // Skip if user already has this badge
      if (user.badges.includes(badge.id)) return;

      let earned = false;

      if (badge.conditionType === 'eventCount') {
        const { eventId, count } = badge.conditionDetails;
        const eventAwards = userAwards.filter(a => a.eventId === eventId);
        if (eventAwards.length >= count) {
          earned = true;
        }
      }
      // Add more condition types as needed (streak, manual, etc.)

      if (earned) {
        user.badges.push(badge.id);
        newBadges.push(badge);
      }
    });

    return newBadges;
  }
};
