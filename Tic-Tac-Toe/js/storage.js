// LocalStorage management for scores and settings

const Storage = (function() {
    const SCORES_KEY = 'ticTacToeScores';
    const SETTINGS_KEY = 'ticTacToeSettings';
    
    // Initialize storage
    function init() {
        // Initialize scores if not present
        if (!localStorage.getItem(SCORES_KEY)) {
            resetScores();
        }
        
        // Initialize settings if not present
        if (!localStorage.getItem(SETTINGS_KEY)) {
            resetSettings();
        }
    }
    
    // Load scores from localStorage
    function loadScores() {
        try {
            const scores = JSON.parse(localStorage.getItem(SCORES_KEY));
            return scores || { xWins: 0, oWins: 0, draws: 0 };
        } catch (e) {
            console.error('Error loading scores:', e);
            return { xWins: 0, oWins: 0, draws: 0 };
        }
    }
    
    // Save scores to localStorage
    function saveScores(scores) {
        try {
            localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
            return true;
        } catch (e) {
            console.error('Error saving scores:', e);
            return false;
        }
    }
    
    // Update scores based on game result
    function updateScores(result) {
        const scores = loadScores();
        
        switch (result) {
            case 'X':
                scores.xWins += 1;
                break;
            case 'O':
                scores.oWins += 1;
                break;
            case 'draw':
                scores.draws += 1;
                break;
        }
        
        saveScores(scores);
        return scores;
    }
    
    // Reset scores to zero
    function resetScores() {
        const scores = { xWins: 0, oWins: 0, draws: 0 };
        saveScores(scores);
        return scores;
    }
    
    // Load settings from localStorage
    function loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY));
            return settings || {};
        } catch (e) {
            console.error('Error loading settings:', e);
            return {};
        }
    }
    
    // Save settings to localStorage
    function saveSettings(settings) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('Error saving settings:', e);
            return false;
        }
    }
    
    // Reset settings to defaults
    function resetSettings() {
        const defaultSettings = {
            gameMode: 'pvp',
            aiDifficulty: 'medium',
            startingPlayer: 'x',
            soundEnabled: true,
            theme: 'light'
        };
        
        saveSettings(defaultSettings);
        return defaultSettings;
    }
    
    // Public API
    return {
        init,
        loadScores,
        saveScores,
        updateScores,
        resetScores,
        loadSettings,
        saveSettings,
        resetSettings
    };
})();