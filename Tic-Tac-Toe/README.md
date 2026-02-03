# Tic-Tac-Toe Web Application

A fully-featured, accessible Tic-Tac-Toe game built with vanilla HTML, CSS, and JavaScript for Prodigy WD Task-03. This application includes multiple game modes, AI opponents with varying difficulty levels, and a complete set of accessibility features.

## Features

### Core Gameplay
- **Classic 3x3 Tic-Tac-Toe**: The traditional game everyone knows and loves
- **Two Game Modes**: 
  - **Player vs Player**: Two players take turns on the same device
  - **Player vs AI**: Play against a computer opponent with three difficulty levels
- **Win/Draw Detection**: Automatic detection of game outcomes with visual highlights
- **Turn Indicator**: Clear visual indication of whose turn it is
- **Reset/New Game**: Start fresh at any time

### AI Difficulty Levels
1. **Easy**: The AI makes completely random moves from available spaces
2. **Medium**: Rule-based AI that follows strategic priorities:
   - Win if possible
   - Block opponent's winning moves
   - Take center position
   - Take corner positions
   - Take any available edge
3. **Hard**: Unbeatable AI using the Minimax algorithm with alpha-beta pruning that evaluates all possible game states

### User Interface & Experience
- **Responsive Design**: Mobile-first layout that works on all screen sizes
- **Visual Feedback**: Smooth hover effects, click animations, and winning line highlights
- **Winning Celebration**: Confetti animation when a player wins
- **Theme Toggle**: Switch between light and dark modes (persisted in localStorage)
- **Sound Effects**: Optional sound feedback for moves, wins, and draws

### Scoreboard & Statistics
- **Score Tracking**: Keep track of X wins, O wins, and draws
- **LocalStorage Persistence**: Scores and settings saved between browser sessions
- **Move History**: Complete list of all moves made during the current game

### Accessibility Features
- **Full Keyboard Support**: Navigate with arrow keys, select with Enter/Space
- **ARIA Attributes**: Proper roles, labels, and descriptions for screen readers
- **aria-live Regions**: Dynamic status updates announced to assistive technologies
- **Visible Focus Indicators**: Clear visual focus for keyboard navigation
- **High Contrast**: Accessible color schemes in both light and dark modes

### Additional Features
- **Undo Move**: 
  - In PvP mode: Undo the last move
  - In vs AI mode: Undo both player's and AI's last moves
- **Move History**: Detailed list of all moves with coordinates
- **Sound Toggle**: Enable/disable game sounds
- **Settings Persistence**: Game preferences saved across sessions

## How to Run

### Quick Start
1. Download or clone the project files
2. Navigate to the project directory in your terminal/command prompt
3. Start a local HTTP server using Python:

   ```bash
   python -m http.server 8002