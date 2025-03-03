const grid = document.getElementById('grid');
const starsElement = document.getElementById('stars');
const livesElement = document.getElementById('lives');
const gameOverScreen = document.getElementById('gameOver');
const restartButton = document.getElementById('restart');
const finalStarsElement = document.getElementById('finalStars');

let stars = 0;
let lives = 3;
let gameActive = false;
let crabTimeout;

// Создание игрового поля
function createGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.addEventListener('click', handleClick);
        cell.addEventListener('touchstart', handleTouch);
        grid.appendChild(cell);
    }
}

// Обработчик кликов (десктоп)
function handleClick(e) {
    processClick(e.target);
}

// Обработчик тапов (мобильные)
function handleTouch(e) {
    e.preventDefault();
    processClick(e.target);
}

// Общая логика клика
function processClick(target) {
    if (!gameActive) return;

    const cell = target.classList.contains('crab') 
        ? target.parentElement 
        : target;

    const crab = cell.querySelector('.crab');
    
    if (crab?.classList.contains('active')) {
        crab.remove();
        clearTimeout(crabTimeout);
        stars++;
        starsElement.textContent = stars;
        spawnCrab();
    } else {
        // Если краба в ячейке нет, игрок теряет жизнь
        if (!crab) {
            loseLife();
        }
    }
}

// Логика появления краба
function spawnCrab() {
    if (!gameActive) return;

    // Удаляем предыдущего краба
    const prevCrab = document.querySelector('.crab.active');
    if (prevCrab) {
        prevCrab.remove();
        loseLife();
    }

    // Выбираем случайную ячейку
    const cells = Array.from(grid.children).filter(cell => !cell.querySelector('.crab'));
    if (cells.length === 0) return;
    
    const randomCell = cells[Math.floor(Math.random() * cells.length)];
    
    // Создаем нового краба
    const crab = document.createElement('div');
    crab.className = 'crab';
    randomCell.appendChild(crab);
    
    // Активируем анимацию
    setTimeout(() => crab.classList.add('active'), 10);
    
    // Таймер на исчезновение
    crabTimeout = setTimeout(() => {
        crab.remove();
        loseLife();
    }, 1500 + Math.random() * 1000);
}

// Система жизней
function loseLife() {
    lives--;
    livesElement.textContent = lives;

    if (lives <= 0) {
        gameOver();
    } else {
        spawnCrab();
    }
}

// Завершение игры
function gameOver() {
    gameActive = false;
    finalStarsElement.textContent = stars;
    gameOverScreen.classList.remove('hidden');
    clearTimeout(crabTimeout);
}

// Инициализация новой игры
function startGame() {
    stars = 0;
    lives = 3;
    starsElement.textContent = stars;
    livesElement.textContent = lives;
    gameOverScreen.classList.add('hidden');
    
    // Очищаем поле
    document.querySelectorAll('.crab').forEach(crab => crab.remove());
    
    // Пересоздаем сетку
    createGrid();
    
    gameActive = true;
    spawnCrab();
}

// Запуск игры
restartButton.addEventListener('click', startGame);
document.addEventListener('DOMContentLoaded', startGame);
