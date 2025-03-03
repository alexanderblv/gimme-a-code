const grid = document.getElementById('grid');
const starsElement = document.getElementById('stars');
const livesElement = document.getElementById('lives');
const gameOverScreen = document.getElementById('gameOver');
const restartButton = document.getElementById('restart');
const finalStarsElement = document.getElementById('finalStars');

let stars = 0;
let lives = 3;
let gameActive = false;
let crabTimeout = null;
let currentCrab = null;

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

// Обработчик кликов
function handleClick(e) {
    processClick(e.target);
}

// Обработчик тапов
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
    
    if (crab && crab === currentCrab && crab.classList.contains('active')) {
        // Правильный клик
        clearTimeout(crabTimeout);
        crab.remove();
        currentCrab = null;
        stars++;
        starsElement.textContent = stars;
        spawnCrab();
    } else {
        // Неправильный клик или клик по пустой ячейке
        if (currentCrab) {
            clearTimeout(crabTimeout);
            currentCrab.remove();
            currentCrab = null;
            loseLife(true);
        }
    }
}

// Логика появления краба
function spawnCrab() {
    if (!gameActive || currentCrab) return;

    const cells = Array.from(grid.children);
    const randomCell = cells[Math.floor(Math.random() * cells.length)];
    
    // Создаем нового краба
    const crab = document.createElement('div');
    crab.className = 'crab';
    randomCell.appendChild(crab);
    currentCrab = crab;
    
    // Активируем анимацию
    setTimeout(() => crab.classList.add('active'), 10);
    
    // Таймер на исчезновение
    crabTimeout = setTimeout(() => {
        if (currentCrab) {
            currentCrab.remove();
            currentCrab = null;
            loseLife(false);
        }
    }, 1500 + Math.random() * 1000);
}

// Система жизней
function loseLife(isUserMistake) {
    if (!gameActive) return;
    
    lives--;
    livesElement.textContent = lives;

    if (lives <= 0) {
        gameOver();
    } else {
        if (isUserMistake) {
            // Немедленный перезапуск таймера для новой попытки
            spawnCrab();
        } else {
            // Обычный переход к следующему крабу
            spawnCrab();
        }
    }
}

// Завершение игры
function gameOver() {
    gameActive = false;
    clearTimeout(crabTimeout);
    if (currentCrab) {
        currentCrab.remove();
        currentCrab = null;
    }
    finalStarsElement.textContent = stars;
    gameOverScreen.classList.remove('hidden');
}

// Инициализация новой игры
function startGame() {
    stars = 0;
    lives = 3;
    starsElement.textContent = stars;
    livesElement.textContent = lives;
    gameOverScreen.classList.add('hidden');
    grid.innerHTML = '';
    createGrid();
    gameActive = true;
    spawnCrab();
}

// Запуск игры
restartButton.addEventListener('click', startGame);
document.addEventListener('DOMContentLoaded', startGame);
