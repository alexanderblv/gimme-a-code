document.addEventListener('DOMContentLoaded', () => {
    try {
        // Инициализация игры
        const game = new Game();
        
        // Инициализация обработчиков событий
        const gameField = document.getElementById('game-field');
        if (gameField) {
            gameField.addEventListener('click', game.handleMemberClick);
        }
        
        // Обработчики кнопок
        const startButton = document.getElementById('start-button');
        const restartButton = document.getElementById('restart-button');
        
        if (startButton) {
            startButton.addEventListener('click', () => game.start());
        }
        
        if (restartButton) {
            restartButton.addEventListener('click', () => game.start());
        }
        
        // Инициализация анимаций
        Animations.createFallingElements();
        Animations.createBlinkingPixels();
        Animations.createFallingTerminalImages();
        
        // Инициализация иконок рабочего стола
        initializeDesktopIcons();
        
    } catch (error) {
        console.error('Ошибка при инициализации игры:', error);
        UI.showError('Не удалось инициализировать игру');
    }
});

function initializeDesktopIcons() {
    const readmeIcon = document.getElementById('readme-icon');
    const projectIcon = document.getElementById('project-icon');
    
    if (readmeIcon) {
        readmeIcon.addEventListener('click', () => {
            window.open('https://github.com/alexanderblv/gimme-a-code', '_blank');
        });
    }
    
    if (projectIcon) {
        projectIcon.addEventListener('click', () => {
            window.open('https://x.com/alexander_blv', '_blank');
        });
    }
}
