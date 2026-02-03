// Game state and logic

const Game = (function() {
    // Game state
    let board = Array(9).fill('');
    let currentPlayer = 'X';
    let gameStatus = 'playing'; // 'playing', 'win', 'draw'
    let winner = null;
    let winningLine = null;
    let moveHistory = [];
    let gameMode = 'pvp'; // 'pvp' or 'ai'
    let aiDifficulty = 'medium'; // 'easy', 'medium', 'hard'
    let startingPlayer = 'x'; // 'x', 'o', 'random'
    let soundEnabled = true;
    let theme = 'light'; // 'light' or 'dark'
    
    // Win combinations
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Initialize game
    function init() {
        resetBoard();
        loadSettings();
    }
    
    // Reset the game board
    function resetBoard() {
        board = Array(9).fill('');
        currentPlayer = startingPlayer === 'random' ? 
            (Math.random() > 0.5 ? 'X' : 'O') : 
            startingPlayer.toUpperCase();
        gameStatus = 'playing';
        winner = null;
        winningLine = null;
        moveHistory = [];
    }
    
    // Make a move
    function makeMove(index) {
        // Check if move is valid
        if (gameStatus !== 'playing' || board[index] !== '') {
            return false;
        }
        
        // Record move in history
        const move = {
            player: currentPlayer,
            position: index,
            coordinates: getCoordinates(index),
            board: [...board]
        };
        
        // Update board
        board[index] = currentPlayer;
        moveHistory.push(move);
        
        // Check for win or draw
        checkGameStatus();
        
        // Switch player if game is still playing
        if (gameStatus === 'playing') {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
        
        return true;
    }
    
    // Undo last move(s)
    function undoMove() {
        if (moveHistory.length === 0) return false;
        
        // In PvP mode, undo just the last move
        if (gameMode === 'pvp') {
            const lastMove = moveHistory.pop();
            board = lastMove.board;
            currentPlayer = lastMove.player;
            gameStatus = 'playing';
            winner = null;
            winningLine = null;
            return true;
        }
        
        // In AI mode, undo both player's and AI's last moves if possible
        if (gameMode === 'ai' && moveHistory.length >= 2) {
            // Remove AI's last move
            moveHistory.pop();
            const playerMove = moveHistory.pop();
            board = playerMove.board;
            currentPlayer = playerMove.player;
            gameStatus = 'playing';
            winner = null;
            winningLine = null;
            return true;
        } else if (gameMode === 'ai' && moveHistory.length === 1) {
            // Only player has moved
            const playerMove = moveHistory.pop();
            board = playerMove.board;
            currentPlayer = playerMove.player;
            gameStatus = 'playing';
            winner = null;
            winningLine = null;
            return true;
        }
        
        return false;
    }
    
    // Check game status (win/draw/playing)
    function checkGameStatus() {
        // Check for win
        for (let combo of winCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameStatus = 'win';
                winner = board[a];
                winningLine = combo;
                return;
            }
        }
        
        // Check for draw
        if (!board.includes('')) {
            gameStatus = 'draw';
            return;
        }
        
        // Game still in progress
        gameStatus = 'playing';
    }
    
    // Get coordinates for a cell index
    function getCoordinates(index) {
        const row = Math.floor(index / 3) + 1;
        const col = (index % 3) + 1;
        return { row, col };
    }
    
    // Get available moves
    function getAvailableMoves() {
        return board
            .map((cell, index) => cell === '' ? index : -1)
            .filter(index => index !== -1);
    }
    
    // Update settings
    function updateSettings(settings) {
        if (settings.mode) gameMode = settings.mode;
        if (settings.difficulty) aiDifficulty = settings.difficulty;
        if (settings.startingPlayer) startingPlayer = settings.startingPlayer;
        if (settings.soundEnabled !== undefined) soundEnabled = settings.soundEnabled;
        if (settings.theme) theme = settings.theme;
        
        saveSettings();
    }
    
    // Save settings to localStorage
    function saveSettings() {
        Storage.saveSettings({
            gameMode,
            aiDifficulty,
            startingPlayer,
            soundEnabled,
            theme
        });
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const settings = Storage.loadSettings();
        if (settings) {
            gameMode = settings.gameMode || 'pvp';
            aiDifficulty = settings.aiDifficulty || 'medium';
            startingPlayer = settings.startingPlayer || 'x';
            soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
            theme = settings.theme || 'light';
        }
    }
    
    // Get game state
    function getState() {
        return {
            board: [...board],
            currentPlayer,
            gameStatus,
            winner,
            winningLine,
            moveHistory: [...moveHistory],
            gameMode,
            aiDifficulty,
            startingPlayer,
            soundEnabled,
            theme
        };
    }
    
    // Public API
    return {
        init,
        resetBoard,
        makeMove,
        undoMove,
        updateSettings,
        getState,
        getAvailableMoves
    };
})();