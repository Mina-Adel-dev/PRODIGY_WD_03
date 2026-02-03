// AI player implementation

const AI = (function() {
    // Easy AI: random valid move
    function easyAI(board) {
        const availableMoves = board
            .map((cell, index) => cell === '' ? index : -1)
            .filter(index => index !== -1);
        
        if (availableMoves.length === 0) return -1;
        
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        return availableMoves[randomIndex];
    }
    
    // Medium AI: rule-based strategy
    function mediumAI(board) {
        // 1. Try to win
        let move = findWinningMove(board, 'O');
        if (move !== -1) return move;
        
        // 2. Try to block opponent from winning
        move = findWinningMove(board, 'X');
        if (move !== -1) return move;
        
        // 3. Take center if available
        if (board[4] === '') return 4;
        
        // 4. Take corners if available
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(index => board[index] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // 5. Take any available edge
        const edges = [1, 3, 5, 7];
        const availableEdges = edges.filter(index => board[index] === '');
        if (availableEdges.length > 0) {
            return availableEdges[Math.floor(Math.random() * availableEdges.length)];
        }
        
        // Fallback to random move
        return easyAI(board);
    }
    
    // Hard AI: Minimax algorithm with alpha-beta pruning
    function hardAI(board) {
        // If board is empty, start with center or corner
        if (board.every(cell => cell === '')) {
            return Math.random() > 0.5 ? 4 : [0, 2, 6, 8][Math.floor(Math.random() * 4)];
        }
        
        // Use minimax to find best move
        const result = minimax(board, 'O', -Infinity, Infinity);
        return result.move;
    }
    
    // Minimax algorithm with alpha-beta pruning
    function minimax(board, player, alpha, beta) {
        // Check terminal states
        const winner = checkWinner(board);
        if (winner === 'O') return { score: 10, move: -1 };
        if (winner === 'X') return { score: -10, move: -1 };
        if (isBoardFull(board)) return { score: 0, move: -1 };
        
        // Maximizing player (AI - 'O')
        if (player === 'O') {
            let bestScore = -Infinity;
            let bestMove = -1;
            
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    const score = minimax(board, 'X', alpha, beta).score;
                    board[i] = '';
                    
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                    
                    alpha = Math.max(alpha, bestScore);
                    if (beta <= alpha) break; // Alpha-beta pruning
                }
            }
            
            return { score: bestScore, move: bestMove };
        } 
        // Minimizing player (Human - 'X')
        else {
            let bestScore = Infinity;
            let bestMove = -1;
            
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    const score = minimax(board, 'O', alpha, beta).score;
                    board[i] = '';
                    
                    if (score < bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                    
                    beta = Math.min(beta, bestScore);
                    if (beta <= alpha) break; // Alpha-beta pruning
                }
            }
            
            return { score: bestScore, move: bestMove };
        }
    }
    
    // Helper function to find a winning move for a player
    function findWinningMove(board, player) {
        const winCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        for (let combo of winCombinations) {
            const [a, b, c] = combo;
            const values = [board[a], board[b], board[c]];
            
            // Count how many cells are occupied by the player and how many are empty
            const playerCount = values.filter(val => val === player).length;
            const emptyCount = values.filter(val => val === '').length;
            
            // If player has 2 cells and there's 1 empty, that's the winning move
            if (playerCount === 2 && emptyCount === 1) {
                const emptyIndex = combo[values.indexOf('')];
                return emptyIndex;
            }
        }
        
        return -1;
    }
    
    // Helper function to check if there's a winner
    function checkWinner(board) {
        const winCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        for (let combo of winCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        
        return null;
    }
    
    // Helper function to check if board is full
    function isBoardFull(board) {
        return board.every(cell => cell !== '');
    }
    
    // Main function to make AI move based on difficulty
    function makeMove(board, difficulty) {
        let move;
        
        switch (difficulty) {
            case 'easy':
                move = easyAI(board);
                break;
            case 'medium':
                move = mediumAI(board);
                break;
            case 'hard':
                move = hardAI(board);
                break;
            default:
                move = mediumAI(board);
        }
        
        return move;
    }
    
    // Public API
    return {
        makeMove
    };
})();