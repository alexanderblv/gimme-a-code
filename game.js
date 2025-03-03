const grid = document.getElementById('grid');
const starsElement = document.getElementById('stars');
const livesElement = document.getElementById('lives');
const gameOverScreen = document.getElementById('gameOver');
const restartButton = document.getElementById('restart');
const finalStarsElement = document.getElementById('finalStars');
const timerElement = document.getElementById('timer');

let stars = 0;
let lives = 3;
let gameActive = false;
let crabTimeout = null;
let currentCrab = null;
let timerInterval = null;
let startTime = null;
let totalDuration = 0;

function updateTimer() {
    if (!startTime) return;
    
    const elapsed = Date.now() - startTime;
    const remaining = totalDuration - elapsed;
    const seconds = Math.max(0, remaining / 1000).toFixed(1);
    timerElement.textContent = `${seconds}s`;
    
    if (remaining <= 0) {
        clearInterval(timerInterval);
        timerElement.textContent = '0.0s';
    }
}

function clearCrab() {
    if (currentCrab) {
        clearTimeout(crabTimeout);
        clearInterval(timerInterval);
        timerElement.textContent = '0.0s';
        currentCrab.remove();
        currentCrab = null;
        startTime = null;
    }
}

function spawnCrab() {
    if (!gameActive || currentCrab) return;

    const cells = Array.from(grid.children);
    const randomCell = cells[Math.floor(Math.random() * cells.length)];
    
    currentCrab = document.createElement('div');
    currentCrab.className = 'crab';
    randomCell.appendChild(currentCrab);

    setTimeout(() => currentCrab.classList.add('active'), 10);

    totalDuration = 1500 + Math.random() * 1000;
    startTime = Date.now();
    
    crabTimeout = setTimeout(() => {
        clearCrab();
        loseLife();
        spawnCrab();
    }, totalDuration);

    timerInterval = setInterval(updateTimer, 100);
}

function gameOver() {
    gameActive = false;
    clearCrab();
    clearInterval(timerInterval);
    timerElement.textContent = '0.0s';
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
