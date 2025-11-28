# Teller Olympics 🏅

An interactive browser-based Olympic games collection where players compete in fun mini-games and track their high scores!

## 🎮 Games

### 🏃 Sprint Race
Click as fast as you can to run 100 meters! Your clicks power your runner forward. Race against the clock and see how fast you can finish!

**Objective**: Complete 100m in the fastest time
**Scoring**: Lower time is better

### 🎯 Target Practice
Click the appearing targets before they disappear! Build up combos for bonus points. Fast reflexes and accuracy are key!

**Objective**: Hit as many targets as possible in 30 seconds
**Scoring**: 10 points per target × combo multiplier
**Pro Tip**: Keep your combo going for massive scores!

### ⚡ Reaction Test
Test your reflexes! Wait for the green light, then click as fast as you can. Complete 5 rounds and get your average reaction time.

**Objective**: Click when you see green (not before!)
**Scoring**: Based on your average reaction time (faster = higher score)
**Warning**: Clicking too early will reset your combo!

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Start the game**
   ```bash
   npm start
   ```

3. **Play!**
   - Frontend: http://localhost:3000
   - Enter your name and start competing!

## 🏆 Features

- **3 Fun Mini-Games**: Sprint, Target Practice, and Reaction Test
- **Persistent Leaderboard**: All scores saved in browser localStorage
- **Medal System**: 🥇🥈🥉 for top 3 scores
- **Personal Bests**: Track your improvement over time
- **Filter Leaderboard**: View scores by game or see all together
- **Clean UI**: Colorful, game-like design with smooth animations
- **Mobile Friendly**: Play on any device

## 📊 How Scoring Works

**Sprint Race**: Time-based (lower is better)
- Record your fastest 100m time
- Track total clicks and average speed

**Target Practice**: Points-based (higher is better)
- Base: 10 points per target
- Combo multiplier: Hit targets consecutively for bonus points
- 30 second time limit

**Reaction Test**: Speed-based (higher is better)
- Average of 5 reaction time tests
- Score = 1000 - average reaction time (ms)
- Lightning fast (< 200ms) earns maximum points

## 🎯 Game Tips

**Sprint Race**:
- Click rapidly and consistently
- Find your rhythm for best times
- Don't burn out too early!

**Target Practice**:
- Keep your eyes moving across the screen
- Maintain your combo for 2x, 3x, 4x points!
- Targets disappear after 2 seconds

**Reaction Test**:
- Stay focused and ready
- Don't anticipate - wait for green!
- Clicking too early resets the round

## 📋 Tech Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Vite** - Build tool and dev server
- **LocalStorage** - Score persistence
- **CSS3** - Animations and styling

## 🏗️ Project Structure

```
Frontline-Olympics/
├── frontend/
│   ├── src/
│   │   ├── games/           # Game components
│   │   │   ├── SprintRace.jsx
│   │   │   ├── TargetPractice.jsx
│   │   │   └── ReactionTest.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── MainMenu.jsx
│   │   │   └── Leaderboard.jsx
│   │   ├── App.jsx          # Main app with routing
│   │   └── main.jsx         # Entry point
│   └── package.json
├── backend/                 # (Not used for games)
└── package.json             # Root scripts
```

## 🎨 Customization

Want to add more games or modify existing ones?

**Add a new game**:
1. Create new component in `frontend/src/games/YourGame.jsx`
2. Add route in `App.jsx`
3. Add menu button in `MainMenu.jsx`
4. Save scores using `saveScore(gameName, score, playerName)`

**Modify scoring**:
- Edit the `saveScore` calls in each game component
- Adjust difficulty by changing timer speeds, target counts, etc.

## 🔄 Future Ideas

- Online multiplayer leaderboards
- More games (Long Jump, Javelin, Swimming, etc.)
- Power-ups and special abilities
- Daily challenges
- Achievement system
- Sound effects and music
- Team competitions
- Tournament mode

## 📝 Development

**Run frontend only**:
```bash
cd frontend
npm run dev
```

**Build for production**:
```bash
cd frontend
npm run build
```

## 🤝 Contributing

Feel free to fork and add your own games! The codebase is designed to make adding new games easy.

## 🆘 Support

Having issues?
- Check that you're running Node.js v16+
- Clear your browser's localStorage if leaderboard isn't loading
- Make sure port 3000 is available

---

**Have fun competing! 🏅**

May the best athlete win! 🏆
