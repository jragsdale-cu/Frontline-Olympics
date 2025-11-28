# Teller Olympics 🏅

A fun and engaging gamification web application for credit union frontline staff (tellers, MSRs, MSOs, and branch managers). Track performance, earn badges, and compete with your team!

## 🎯 Overview

Teller Olympics is a lightweight points and badges system where frontline staff earn recognition for:
- Balancing correctly
- Getting member compliments
- Completing cross-sells
- Providing exceptional service
- Finishing daily tasks and checklists

Branch leaders can award points, manage challenges, and track standings. The game operates on a weekly season cycle (customizable).

## 🚀 Features

### For Players (Tellers/MSRs/MSOs)
- **Personal Dashboard**: View your points, rank, and badges
- **Today's Highlights**: See today's achievements
- **Badge Gallery**: Browse earned and locked badges
- **Self-Claim Achievements**: Submit your accomplishments for coach approval
- **Leaderboard**: Compare your performance with teammates

### For Coaches (Managers/Supervisors)
- **Award Points**: Quickly award points to team members
- **Review Self-Claims**: Approve or reject player-submitted achievements
- **Season Management**: Reset seasons and view historical data
- **Leaderboard Views**: Track performance by player or branch

### Game Mechanics
- **Points System**: Earn points for completing events
- **Badges**: Unlock achievements based on milestones
- **Leaderboard**: Rankings by individual player and branch
- **Seasons**: Weekly competition cycles with historical tracking

## 📋 Tech Stack

### Frontend
- React 18
- React Router DOM
- Vite (build tool)
- CSS3 (custom styling)

### Backend
- Node.js
- Express
- In-memory data store (easily replaceable with database)
- CORS enabled for development

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Frontline-Olympics
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```
   This will install dependencies for root, frontend, and backend.

3. **Start the application**
   ```bash
   npm start
   ```
   This runs both frontend and backend concurrently:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Manual Setup (Alternative)

If you prefer to run frontend and backend separately:

1. **Terminal 1 - Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Terminal 2 - Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📱 Usage Guide

### Getting Started

1. **Login/Create Account**
   - Navigate to http://localhost:3000
   - Enter your name
   - Select your role (Player or Coach)
   - Choose your branch
   - Click "Enter Game"

### For Players

1. **View Dashboard**
   - See your total points and rankings
   - Check earned badges
   - View today's achievements

2. **Submit Self-Claims**
   - Click "Submit Achievement"
   - Select event type or describe your accomplishment
   - Submit for coach review

3. **Check Leaderboard**
   - View rankings by player or branch
   - Toggle between current and past seasons
   - See where you stand

### For Coaches

1. **Award Points**
   - Select a branch and player
   - Choose the event type
   - Add optional notes
   - Click "Award Points"

2. **Review Self-Claims**
   - Navigate to "Self-Claims Queue" tab
   - Review player submissions
   - Approve or reject with optional feedback

3. **Manage Seasons**
   - Go to "Season Controls" tab
   - View current season dates
   - Reset season when needed (archives current standings)

## 🎮 Pre-Configured Data

### Branches
- Center St
- APR
- BSC
- Loves Park
- Ottawa

### Sample Events
- **Fastest Balanced Drawer** (50 pts - Accuracy)
- **Zero Errors Day** (30 pts - Accuracy)
- **Member Compliment of the Day** (40 pts - Service)
- **Cross-Sell Champion** (50 pts - Sales)
- **Human Espresso** (20 pts - Teamwork)
- **Queue Tamer** (25 pts - Speed)
- **Early Bird** (15 pts - Teamwork)
- **Problem Solver** (35 pts - Service)

### Sample Badges
- **Gold Drawer**: 5 days in a row with no balancing differences
- **Member Whisperer**: 10 member compliments in a season
- **Closer**: 20 cross-sells completed in a season
- **Team Hero**: Helped teammates 15 times in a season
- **Olympian**: Top of the leaderboard
- **Perfect Week**: Zero errors for an entire week

### Sample Users
The app comes pre-seeded with a few sample users:
- **Sarah Johnson** (Player - Center St)
- **Mike Chen** (Player - Center St)
- **Emily Rodriguez** (Player - APR)
- **James Wilson** (Coach - Center St)

## 🏗️ Architecture

### Data Model

```
User {
  id, name, role, branch, badges[], totalPoints
}

Event {
  id, name, description, category, points, frequency
}

Award {
  id, userId, eventId, points, dateAwarded, awardedBy, notes
}

Badge {
  id, name, description, conditionType, conditionDetails, iconColor
}

SelfClaim {
  id, userId, requestedEventId, description, status, coachId
}

Season {
  id, name, startDate, endDate, isActive
}
```

### API Endpoints

**Users**
- `POST /api/users/login` - Login/create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

**Events**
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

**Awards**
- `GET /api/awards` - Get all awards
- `GET /api/awards/user/:userId` - Get user's awards
- `POST /api/awards` - Create award

**Badges**
- `GET /api/badges` - Get all badges
- `GET /api/badges/user/:userId` - Get user's badges

**Self-Claims**
- `GET /api/self-claims` - Get all claims
- `GET /api/self-claims/pending` - Get pending claims
- `POST /api/self-claims` - Create claim
- `PUT /api/self-claims/:id` - Update claim status

**Seasons**
- `GET /api/seasons` - Get all seasons
- `GET /api/seasons/active` - Get active season
- `GET /api/seasons/archived` - Get archived seasons
- `POST /api/seasons/reset` - Reset season

**Leaderboard**
- `GET /api/leaderboard/players?seasonId=X` - Get player rankings
- `GET /api/leaderboard/branches?seasonId=X` - Get branch rankings

**Stats**
- `GET /api/stats/player/:userId` - Get player stats

## 🎨 Customization

### Adding New Events
Coaches can add new events through the Coach Dashboard, or you can modify the initial events in `/backend/data/store.js`.

### Adding New Badges
Edit the `badges` array in `/backend/data/store.js` to add new achievement badges.

### Changing Branches
Modify the `branches` array in `/backend/data/store.js`.

### Styling
All styling is in CSS files. Main theme variables are in `/frontend/src/index.css`.

## 🔄 Future Enhancements

This is a prototype. Potential improvements include:

- **Database Integration**: Replace in-memory store with PostgreSQL, MySQL, or MongoDB
- **Authentication**: Add proper user authentication with passwords/SSO
- **Real-time Updates**: WebSocket support for live leaderboard updates
- **Analytics**: Detailed performance analytics and reporting
- **Mobile App**: Native iOS/Android apps
- **Notifications**: Email/push notifications for awards and achievements
- **Integration**: Connect with core banking systems for automated tracking
- **Admin Panel**: Enhanced admin tools for managing events, badges, and users
- **Gamification**: Add more game elements like power-ups, team challenges, etc.

## 📝 Development Notes

### Project Structure
```
Frontline-Olympics/
├── backend/
│   ├── data/
│   │   └── store.js          # In-memory data store
│   ├── server.js              # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── api.js             # API utility functions
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── package.json               # Root package.json
```

### Data Persistence
Currently, all data is stored in memory and will be lost when the server restarts. To persist data:
1. Replace the in-memory store with a database
2. Or implement file-based storage for the prototype

## 🤝 Contributing

This is a prototype for demonstration. Feel free to fork and customize for your organization's needs.

## 📄 License

Copyright © 2025. All rights reserved.

## 🆘 Support

For questions or issues, please contact your system administrator or the development team.

---

**Built with ❤️ for frontline heroes!** 🏅
