<h1 align="center">Prodigy WD Task-03 — Tic-Tac-Toe</h1>

<p align="center">
  Tic-Tac-Toe game built with HTML, CSS, and JavaScript.
</p>

<p align="center">
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-Structure-orange">
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-Styling-blue">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-GameLogic-yellow">
  <img alt="Status" src="https://img.shields.io/badge/Status-Completed-success">
</p>

---

## Quick Links

- 🎥 **Demo Video:** [Watch on Google Drive](https://drive.google.com/file/d/1OkrBi9qB4sTZGsE_H6yvMF4vFxQhhbOk/view?usp=drive_link)

---


## Screenshot

<p align="center">
  <img src="https://github.com/user-attachments/assets/b83dab8e-8f78-449c-905f-e733d6447524" alt="Tic-Tac-Toe Gameplay Screenshot" width="85%" />
</p>


---

## Features

- **PvP mode** (2 players)
- **Vs AI mode**
  - Easy: random moves
  - Medium: win/block + basic strategy
  - Hard: minimax (unbeatable)
- Win/draw detection
- Winning line highlight
- Scoreboard:
  - X wins
  - O wins
  - Draws
- Scoreboard persistence with `localStorage`
- Undo support
  - PvP: revert last move
  - AI: revert both moves when possible
- Keyboard support
  - Arrow keys to move
  - Enter/Space to play
- Responsive UI
- Theme/sound options (if included in your build)

---

## AI Difficulty Summary

| Level  | Behavior |
|-------|----------|
| Easy  | Random move selection |
| Medium| Tries winning move, then block, then basic strategy |
| Hard  | Minimax-based, very hard to beat |

---

## Run Locally

```bash
python -m http.server 8002
