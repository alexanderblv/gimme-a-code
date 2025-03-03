const grid = document.getElementById('grid');
const starsElement = document.getElementById('stars');
const livesElement = document.getElementById('lives');
const gameOverScreen = document.getElementById('gameOver');
const restartButton = document.getElementById('restart');
const finalStarsElement = document.getElementById('finalStars');
const timeLeftElement = document.getElementById('timeLeft');

let stars = 0;
let lives = 3;
let gameActive = false;
let crabTimeout = null;
let currentCrab = null;
let timerInterval = null;
let crabExpireTime = 0;

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

function handleClick(e) {
    processClick(e.target);
}

function handleTouch(e) {
    e.preventDefault();
    processClick(e.target);
}

function processClick(target) {
    if (!gameActive) return;

    const cell = target.classList.contains('crab') 
        ? target.parentElement 
        : target;

    const crab = cell.querySelector('.crab');
    const isCorrectClick = crab && crab === currentCrab && crab.classList.contains('active');

    if (isCorrectClick) {
        // Правильный клик
        clearCrab();
        stars++;
        starsElement.textContent = stars;
        spawnCrab();
    } else if (currentCrab) {
        // Неправильный клик
        clearCrab();
        loseLife();
        spawnCrab();
    }
}

function clearCrab() {
    if (currentCrab) {
        clearTimeout(crabTimeout);
        currentCrab.remove();
        currentCrab = null;
        clearInterval(timerInterval);
        timeLeftElement.textContent = '0.0';
    }
}

function updateTimer() {
    const remaining = Math.max(0, (crabExpireTime - Date.now()) / 1000);
    timeLeftElement.textContent = remaining.toFixed(1);
}

function spawnCrab() {
    if (!gameActive || currentCrab) return;

    const cells = Array.from(grid.children);
    const randomCell = cells[Math.floor(Math.random() * cells.length)];
    
    currentCrab = document.createElement('div');
    currentCrab.className = 'crab';
    randomCell.appendChild(currentCrab);

    setTimeout(() => currentCrab.classList.add('active'), 10);

    const duration = 1500 + Math.random() * 1000;
    crabExpireTime = Date.now() + duration;
    
    // Обновление таймера каждые 50мс для плавности
    timerInterval = setInterval(updateTimer, 50);
    
    crabTimeout = setTimeout(() => {
        clearCrab();
        loseLife();
        spawnCrab();
    }, duration);
}

function loseLife() {
    if (!gameActive) return;
    
    lives--;
    livesElement.textContent = lives;

    if (lives <= 0) {
        gameOver();
    }
}

function gameOver() {
    gameActive = false;
    clearCrab();
    finalStarsElement.textContent = stars;
    gameOverScreen.classList.remove('hidden');
}

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

restartButton.addEventListener('click', startGame);
document.addEventListener('DOMContentLoaded', startGame);
