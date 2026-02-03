// UI rendering and animations

const UI = (function() {
    // DOM elements
    let gridElement, statusElement, scoreXElement, scoreOElement, scoreDrawElement;
    let xIndicator, oIndicator, historyListElement;
    let cells = [];
    
    // Initialize UI
    function init() {
        // Get DOM elements
        gridElement = document.getElementById('grid');
        statusElement = document.getElementById('status');
        scoreXElement = document.getElementById('score-x');
        scoreOElement = document.getElementById('score-o');
        scoreDrawElement = document.getElementById('score-draw');
        xIndicator = document.getElementById('x-indicator');
        oIndicator = document.getElementById('o-indicator');
        historyListElement = document.getElementById('history-list');
        
        // Create grid cells
        createGrid();
        
        // Load and display scores
        updateScoreboard();
        
        // Apply saved theme
        applyTheme();
    }
    
    // Create the game grid
    function createGrid() {
        gridElement.innerHTML = '';
        // Clear the array without breaking the reference
        cells.length = 0;
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('role', 'gridcell');
            cell.setAttribute('tabindex', '0');
            cell.setAttribute('aria-label', `Cell ${Math.floor(i/3)+1}, ${(i%3)+1}. Empty`);
            cell.dataset.index = i;
            
            gridElement.appendChild(cell);
            cells.push(cell);
        }
    }
    
    // Update the game board display
    function updateBoard(board, winningLine = null) {
        cells.forEach((cell, index) => {
            // Update cell content
            cell.textContent = board[index];
            
            // Update classes
            cell.className = 'cell';
            if (board[index] === 'X') {
                cell.classList.add('x');
            } else if (board[index] === 'O') {
                cell.classList.add('o');
            }
            
            // Update accessibility label
            const coords = getCoordinates(index);
            const content = board[index] ? board[index] : 'Empty';
            cell.setAttribute('aria-label', `Cell ${coords.row}, ${coords.col}. ${content}`);
            
            // Highlight winning line
            if (winningLine && winningLine.includes(index)) {
                cell.classList.add('win');
            }
            
            // Disable cell if game is over
            if (board[index] !== '') {
                cell.classList.add('disabled');
                cell.setAttribute('tabindex', '-1');
            } else {
                cell.setAttribute('tabindex', '0');
            }
        });
    }
    
    // Enable or disable grid interaction
    function setGridEnabled(enabled) {
        cells.forEach(cell => {
            if (enabled) {
                cell.classList.remove('disabled');
                cell.style.pointerEvents = 'auto';
                cell.style.opacity = '1';
            } else {
                cell.classList.add('disabled');
                cell.style.pointerEvents = 'none';
                cell.style.opacity = '0.7';
            }
        });
    }
    
    // Update game status display
    function updateStatus(status, currentPlayer, winner = null) {
        let statusText = '';
        
        if (status === 'playing') {
            statusText = `Player ${currentPlayer}'s Turn`;
            
            // Update turn indicators
            if (currentPlayer === 'X') {
                xIndicator.classList.add('active');
                oIndicator.classList.remove('active');
            } else {
                oIndicator.classList.add('active');
                xIndicator.classList.remove('active');
            }
        } else if (status === 'win') {
            statusText = `Player ${winner} Wins!`;
            
            // Remove active indicators
            xIndicator.classList.remove('active');
            oIndicator.classList.remove('active');
        } else if (status === 'draw') {
            statusText = 'Game Draw!';
            
            // Remove active indicators
            xIndicator.classList.remove('active');
            oIndicator.classList.remove('active');
        }
        
        statusElement.textContent = statusText;
        statusElement.setAttribute('aria-label', statusText);
    }
    
    // Update scoreboard
    function updateScoreboard() {
        const scores = Storage.loadScores();
        scoreXElement.textContent = scores.xWins;
        scoreOElement.textContent = scores.oWins;
        scoreDrawElement.textContent = scores.draws;
    }
    
    // Update move history
    function updateHistory(history) {
        historyListElement.innerHTML = '';
        
        if (history.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'history-item';
            emptyMsg.textContent = 'No moves yet';
            historyListElement.appendChild(emptyMsg);
            return;
        }
        
        history.forEach((move, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item fade-in';
            
            const moveNumber = document.createElement('span');
            moveNumber.textContent = `${index + 1}. `;
            
            const movePlayer = document.createElement('span');
            movePlayer.className = `history-player ${move.player.toLowerCase()}`;
            movePlayer.textContent = `${move.player}: `;
            
            const moveCoords = document.createElement('span');
            moveCoords.className = 'history-move';
            moveCoords.textContent = `(${move.coordinates.row}, ${move.coordinates.col})`;
            
            historyItem.appendChild(moveNumber);
            historyItem.appendChild(movePlayer);
            historyItem.appendChild(moveCoords);
            
            historyListElement.appendChild(historyItem);
        });
        
        // Scroll to bottom
        historyListElement.scrollTop = historyListElement.scrollHeight;
    }
    
    // Apply theme to the page
    function applyTheme() {
        const gameState = Game.getState();
        const theme = gameState.theme || 'light';
        
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
    
    // Toggle theme
    function toggleTheme() {
        const gameState = Game.getState();
        const newTheme = gameState.theme === 'light' ? 'dark' : 'light';
        
        Game.updateSettings({ theme: newTheme });
        applyTheme();
        
        return newTheme;
    }
    
    // Get coordinates for a cell index
    function getCoordinates(index) {
        const row = Math.floor(index / 3) + 1;
        const col = (index % 3) + 1;
        return { row, col };
    }
    
    // Create confetti animation for win celebration
    function createConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        confettiContainer.innerHTML = '';
        confettiContainer.style.display = 'block';
        
        // Create confetti pieces
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random color
            const colors = ['#FF6B6B', '#4D96FF', '#4CAF50', '#FFD166', '#06D6A0', '#118AB2'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.backgroundColor = color;
            
            // Random position and animation
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = `${Math.random() * 100}%`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Random size
            const size = Math.random() * 10 + 5;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            // Random animation
            const duration = Math.random() * 3 + 2;
            confetti.style.animation = `fadeIn ${duration}s ease-out forwards`;
            
            confettiContainer.appendChild(confetti);
        }
        
        // Hide confetti after animation
        setTimeout(() => {
            confettiContainer.style.display = 'none';
        }, 3000);
    }
    
    // Play sound
    function playSound(soundId) {
        const gameState = Game.getState();
        if (!gameState.soundEnabled) return;
        
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Sound play failed:', e));
        }
    }
    
    // Public API
    return {
        init,
        updateBoard,
        updateStatus,
        updateScoreboard,
        updateHistory,
        applyTheme,
        toggleTheme,
        createConfetti,
        playSound,
        getCoordinates,
        cells,
        setGridEnabled
    };
})();