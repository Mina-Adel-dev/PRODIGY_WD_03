// Main application - event wiring and game flow

document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    Storage.init();
    Game.init();
    UI.init();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize the game
    initializeGame();
    
    // Set focus to the first cell for keyboard navigation
    setTimeout(() => {
        if (UI.cells[0]) {
            UI.cells[0].focus();
        }
    }, 100);
    
    console.log('Tic-Tac-Toe game initialized!');
});

// AI move timer and thinking state
let aiTimeoutId = null;
let aiThinking = false;

// Cancel any pending AI move
function cancelAIMove() {
    if (aiTimeoutId) {
        clearTimeout(aiTimeoutId);
        aiTimeoutId = null;
    }
    aiThinking = false;
    UI.setGridEnabled(true);
}

// Initialize the game
function initializeGame() {
    // Load settings and update UI
    const gameState = Game.getState();
    
    // Set game mode radio buttons
    document.querySelector(`input[name="mode"][value="${gameState.gameMode}"]`).checked = true;
    
    // Set AI difficulty radio buttons
    document.querySelector(`input[name="difficulty"][value="${gameState.aiDifficulty}"]`).checked = true;
    
    // Set starting player radio buttons
    document.querySelector(`input[name="starting-player"][value="${gameState.startingPlayer}"]`).checked = true;
    
    // Set sound toggle button text
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = soundToggle.querySelector('i');
    const soundText = soundToggle.querySelector('span');
    
    soundText.textContent = gameState.soundEnabled ? 'Sound On' : 'Sound Off';
    soundIcon.className = gameState.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    
    // Set theme toggle button text
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('span');
    
    themeText.textContent = gameState.theme === 'light' ? 'Dark Mode' : 'Light Mode';
    themeIcon.className = gameState.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    
    // Update UI with initial game state
    updateUI();
    
    // Show/hide AI difficulty based on game mode
    toggleAIDifficultyVisibility();
    
    // If playing against AI and AI starts, make AI move
    if (gameState.gameMode === 'ai' && gameState.currentPlayer === 'O') {
        scheduleAIMove();
    }
}

// Set up event listeners
function setupEventListeners() {
    // Cell click events
    UI.cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
        cell.addEventListener('keydown', (e) => {
            // Handle arrow key navigation
            handleKeyboardNavigation(e);
            
            // Handle Enter/Space for placing marks
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCellClick(index);
            }
        });
    });
    
    // Game mode selection
    document.querySelectorAll('input[name="mode"]').forEach(radio => {
        radio.addEventListener('change', function() {
            Game.updateSettings({ mode: this.value });
            toggleAIDifficultyVisibility();
            
            // Cancel any pending AI move
            cancelAIMove();
            
            // Reset game when mode changes
            Game.resetBoard();
            updateUI();
            
            // If playing against AI and AI starts, make AI move
            const gameState = Game.getState();
            if (gameState.gameMode === 'ai' && gameState.currentPlayer === 'O') {
                scheduleAIMove();
            }
        });
    });
    
    // AI difficulty selection
    document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
        radio.addEventListener('change', function() {
            Game.updateSettings({ difficulty: this.value });
            
            // Cancel any pending AI move
            cancelAIMove();
            
            // If currently playing against AI, reset the game
            const gameState = Game.getState();
            if (gameState.gameMode === 'ai') {
                Game.resetBoard();
                updateUI();
                
                // If AI starts, make AI move
                if (gameState.currentPlayer === 'O') {
                    scheduleAIMove();
                }
            }
        });
    });
    
    // Starting player selection
    document.querySelectorAll('input[name="starting-player"]').forEach(radio => {
        radio.addEventListener('change', function() {
            Game.updateSettings({ startingPlayer: this.value });
            
            // Cancel any pending AI move
            cancelAIMove();
            
            // Reset game when starting player changes
            Game.resetBoard();
            updateUI();
            
            // If playing against AI and AI starts, make AI move
            const gameState = Game.getState();
            if (gameState.gameMode === 'ai' && gameState.currentPlayer === 'O') {
                scheduleAIMove();
            }
        });
    });
    
    // Reset button
    document.getElementById('reset-btn').addEventListener('click', function() {
        cancelAIMove();
        Game.resetBoard();
        updateUI();
        UI.playSound('click-sound');
        
        // If playing against AI and AI starts, make AI move
        const gameState = Game.getState();
        if (gameState.gameMode === 'ai' && gameState.currentPlayer === 'O') {
            scheduleAIMove();
        }
    });
    
    // Undo button
    document.getElementById('undo-btn').addEventListener('click', function() {
        cancelAIMove();
        const success = Game.undoMove();
        if (success) {
            updateUI();
            UI.playSound('click-sound');
        }
    });
    
    // Sound toggle
    document.getElementById('sound-toggle').addEventListener('click', function() {
        const gameState = Game.getState();
        const newSoundState = !gameState.soundEnabled;
        
        Game.updateSettings({ soundEnabled: newSoundState });
        
        // Update button text and icon
        const icon = this.querySelector('i');
        const text = this.querySelector('span');
        
        icon.className = newSoundState ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        text.textContent = newSoundState ? 'Sound On' : 'Sound Off';
        
        // Play a sound to demonstrate
        if (newSoundState) {
            UI.playSound('click-sound');
        }
    });
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', function() {
        const newTheme = UI.toggleTheme();
        
        // Update button text and icon
        const icon = this.querySelector('i');
        const text = this.querySelector('span');
        
        icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        text.textContent = newTheme === 'light' ? 'Dark Mode' : 'Light Mode';
        
        UI.playSound('click-sound');
    });
    
    // Clear history button
    document.getElementById('clear-history-btn').addEventListener('click', function() {
        cancelAIMove();
        // Reset game which also clears history
        Game.resetBoard();
        updateUI();
        UI.playSound('click-sound');
        
        // If playing against AI and AI starts, make AI move
        const gameState = Game.getState();
        if (gameState.gameMode === 'ai' && gameState.currentPlayer === 'O') {
            scheduleAIMove();
        }
    });
    
    // Keyboard navigation for grid (global)
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Handle cell click
function handleCellClick(index) {
    // Prevent clicks while AI is thinking
    if (aiThinking) return;
    
    const gameState = Game.getState();
    
    // Don't process click if game is over or cell is occupied
    if (gameState.gameStatus !== 'playing' || gameState.board[index] !== '') {
        return;
    }
    
    // Make the move
    const success = Game.makeMove(index);
    
    if (success) {
        // Update UI
        updateUI();
        
        // Play sound
        UI.playSound('click-sound');
        
        // Check if game is over and handle accordingly
        const newState = Game.getState();
        
        if (newState.gameStatus === 'win') {
            // Update scores
            Storage.updateScores(newState.winner);
            UI.updateScoreboard();
            
            // Play win sound
            UI.playSound('win-sound');
            
            // Show confetti
            UI.createConfetti();
        } else if (newState.gameStatus === 'draw') {
            // Update scores
            Storage.updateScores('draw');
            UI.updateScoreboard();
            
            // Play draw sound
            UI.playSound('draw-sound');
        } else if (newState.gameMode === 'ai' && newState.currentPlayer === 'O') {
            // Schedule AI move
            scheduleAIMove();
        }
    }
}

// Schedule AI move
function scheduleAIMove() {
    // Set AI thinking state and disable grid
    aiThinking = true;
    UI.setGridEnabled(false);
    
    // Schedule AI move after a short delay
    aiTimeoutId = setTimeout(() => {
        makeAIMove();
        aiTimeoutId = null;
    }, 500);
}

// Make AI move
function makeAIMove() {
    const gameState = Game.getState();
    
    // Get AI move
    const aiIndex = AI.makeMove([...gameState.board], gameState.aiDifficulty);
    
    if (aiIndex !== -1) {
        // Make the move
        const success = Game.makeMove(aiIndex);
        
        if (success) {
            // Update UI
            updateUI();
            
            // Play sound
            UI.playSound('click-sound');
            
            // Check if game is over
            const newState = Game.getState();
            
            if (newState.gameStatus === 'win') {
                // Update scores
                Storage.updateScores(newState.winner);
                UI.updateScoreboard();
                
                // Play win sound
                UI.playSound('win-sound');
                
                // Show confetti
                UI.createConfetti();
            } else if (newState.gameStatus === 'draw') {
                // Update scores
                Storage.updateScores('draw');
                UI.updateScoreboard();
                
                // Play draw sound
                UI.playSound('draw-sound');
            }
        }
    }
    
    // Reset AI thinking state and re-enable grid
    aiThinking = false;
    UI.setGridEnabled(true);
}

// Update the entire UI based on current game state
function updateUI() {
    const gameState = Game.getState();
    
    // Update board
    UI.updateBoard(gameState.board, gameState.winningLine);
    
    // Update status
    UI.updateStatus(gameState.gameStatus, gameState.currentPlayer, gameState.winner);
    
    // Update history
    UI.updateHistory(gameState.moveHistory);
    
    // Update undo button state
    const undoBtn = document.getElementById('undo-btn');
    undoBtn.disabled = gameState.moveHistory.length === 0;
    undoBtn.style.opacity = gameState.moveHistory.length === 0 ? '0.5' : '1';
    undoBtn.style.cursor = gameState.moveHistory.length === 0 ? 'not-allowed' : 'pointer';
}

// Toggle AI difficulty visibility based on game mode
function toggleAIDifficultyVisibility() {
    const gameState = Game.getState();
    const aiDifficultyGroup = document.getElementById('ai-difficulty-group');
    
    if (gameState.gameMode === 'ai') {
        aiDifficultyGroup.style.display = 'block';
        setTimeout(() => {
            aiDifficultyGroup.style.opacity = '1';
        }, 10);
    } else {
        aiDifficultyGroup.style.opacity = '0';
        setTimeout(() => {
            aiDifficultyGroup.style.display = 'none';
        }, 300);
    }
}

// Handle keyboard navigation for grid
function handleKeyboardNavigation(e) {
    // Don't process arrow keys while AI is thinking
    if (aiThinking) return;
    
    // Only handle arrow keys if focus is on a cell
    const focusedCell = document.activeElement;
    if (!focusedCell.classList.contains('cell')) return;
    
    // Check if arrow keys were pressed
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        return;
    }
    
    const currentIndex = parseInt(focusedCell.dataset.index);
    let newIndex = currentIndex;
    
    switch (e.key) {
        case 'ArrowLeft':
            newIndex = currentIndex - 1;
            if (currentIndex % 3 === 0) newIndex = currentIndex; // Stay in same row
            break;
        case 'ArrowRight':
            newIndex = currentIndex + 1;
            if (currentIndex % 3 === 2) newIndex = currentIndex; // Stay in same row
            break;
        case 'ArrowUp':
            newIndex = currentIndex - 3;
            if (newIndex < 0) newIndex = currentIndex; // Stay in same column
            break;
        case 'ArrowDown':
            newIndex = currentIndex + 3;
            if (newIndex > 8) newIndex = currentIndex; // Stay in same column
            break;
        default:
            return;
    }
    
    // If index changed and new cell exists, focus it
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex <= 8) {
        e.preventDefault();
        UI.cells[newIndex].focus();
    }
}