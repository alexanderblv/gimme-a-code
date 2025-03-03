// game.js

// Инициализация элементов
const grid = document.getElementById('grid');
const starsElement = document.getElementById('stars');
const livesElement = document.getElementById('lives');
const gameOverScreen = document.getElementById('gameOver');
const restartButton = document.getElementById('restart');

// Игровые переменные
let stars = 0;
let lives = 3;
let gameActive = false;
let crabTimeout;

// Создание сетки 5x5
for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    cell.addEventListener('touchstart', handleClick); // Для мобильных устройств
    grid.appendChild(cell);
}

// Логика появления крабов
function spawnCrab() {
    if (!gameActive) return;

    // Удаляем предыдущего краба (если игрок не успел)
    const currentActive = document.querySelector('.crab.active');
    if (currentActive) {
        currentActive.remove();
        loseLife();
    }

    // Выбираем случайную ячейку
    const cells = document.querySelectorAll('.cell');
    const randomCell = cells[Math.floor(Math.random() * cells.length)];
    
    // Создаем краба
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

// Обработка клика по ячейке
function handleClick(e) {
    if (!gameActive) return;

    const crab = e.target.querySelector('.crab');
    if (crab && crab.classList.contains('active')) {
        crab.remove();
        clearTimeout(crabTimeout);
        stars++;
        starsElement.textContent = stars;
        spawnCrab();
    }
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
    gameOverScreen.classList.remove('hidden');
    clearTimeout(crabTimeout);
}

// Запуск/перезапуск игры
function startGame() {
    // Сброс значений
    stars = 0;
    lives = 3;
    starsElement.textContent = stars;
    livesElement.textContent = lives;
    
    // Очистка интерфейса
    gameOverScreen.classList.add('hidden');
    document.querySelectorAll('.crab').forEach(crab => crab.remove());
    
    // Старт игры
    gameActive = true;
    spawnCrab();
}

// Вешаем обработчик на кнопку рестарта
restartButton.addEventListener('click', startGame);

// Запускаем игру при загрузке страницы
document.addEventListener('DOMContentLoaded', startGame);
