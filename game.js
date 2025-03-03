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

function createGrid() {
    grid.innerHTML = '';
    
    // Создаем фоновые пузырьки
    for(let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDelay = `${Math.random() * 4}s`;
        document.body.appendChild(bubble);
    }
    
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
        crab.classList.add('squash');
        setTimeout(() => crab.classList.remove('squash'), 200);
        
        createStarEffect(cell);
        clearCrab();
        stars++;
        starsElement.textContent = stars;
        spawnCrab();
    } else if (currentCrab) {
        cell.classList.add('wrong');
        setTimeout(() => cell.classList.remove('wrong'), 400);
        
        clearCrab();
        loseLife();
        spawnCrab();
    }
}

function createStarEffect(element) {
    for(let i = 0; i < 5; i++) {
        const star = document.createElement('div');
        star.className = 'star-effect';
        star.style.left = `${Math.random() * 80 + 10}%`;
        star.style.top = `${Math.random() * 80 + 10}%`;
        star.style.animationDelay = `${i * 0.1}s`;
        element.appendChild(star);
        setTimeout(() => star.remove(), 600);
    }
}

function clearCrab() {
    if (currentCrab) {
        clearTimeout(crabTimeout);
        currentCrab.remove();
        currentCrab = null;
    }
}

function spawnCrab() {
    if (!gameActive || currentCrab) return;

    const cells = Array.from(grid.children).filter(c => !c.querySelector('.crab'));
    const randomCell = cells[Math.floor(Math.random() * cells.length)];
    
    currentCrab = document.createElement('div');
    currentCrab.className = 'crab';
    randomCell.appendChild(currentCrab);

    setTimeout(() => {
        currentCrab.classList.add('active');
        randomCell.style.transform = 'scale(1.1)';
        setTimeout(() => randomCell.style.transform = 'scale(1)', 200);
    }, 10);

    crabTimeout = setTimeout(() => {
        if(currentCrab) {
            currentCrab.style.transition = 'bottom 0.5s ease-out';
            currentCrab.style.bottom = '-60px';
            setTimeout(() => clearCrab(), 500);
        }
        loseLife();
    }, 1500 + Math.random() * 1000);
}

function loseLife() {
    if (!gameActive) return;
    
    lives--;
    livesElement.textContent = lives;
    document.body.style.background = `#2c3e50 url('data:image/svg+xml,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="rgba(255,0,0,0.1)"/></svg>)`;
    setTimeout(() => document.body.style.background = '#2c3e50', 100);

    if (lives <= 0) {
        gameOver();
    }
}

function gameOver() {
    gameActive = false;
    clearCrab();
    finalStarsElement.innerHTML = `${stars} ${'★'.repeat(Math.min(stars, 10))}`;
    gameOverScreen.classList.remove('hidden');
    
    gameOverScreen.style.animation = 'none';
    setTimeout(() => {
        gameOverScreen.style.animation = 'gameOverFadeIn 0.6s ease-out, crabBounce 0.8s infinite';
    }, 10);
}

function startGame() {
    stars = 0;
    lives = 3;
    starsElement.textContent = stars;
    livesElement.textContent = lives;
    gameOverScreen.classList.add('hidden');
    document.querySelectorAll('.bubble').forEach(b => b.remove());
    grid.innerHTML = '';
    createGrid();
    gameActive = true;
    spawnCrab();
}

restartButton.addEventListener('click', startGame);
document.addEventListener('DOMContentLoaded', startGame);
