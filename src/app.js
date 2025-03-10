// Global game variables
let score = 0;
let timeLeft = 20;
let gameInterval;
let activeMember = null;
let isGameRunning = false;

// DOM Elements
const gameInfo = document.getElementById('game-info');
const gameOver = document.getElementById('game-over');
const startButton = document.getElementById('start-game');
const restartButton = document.getElementById('restart-game');
const scoreDisplay = document.querySelector('#score span');
const finalScoreDisplay = document.getElementById('final-score');
const timerDisplay = document.querySelector('#timer span');
const progressBar = document.getElementById('progress');
const members = document.querySelectorAll('.member-img');
const gameField = document.getElementById('game-field'); // Added for miss detection

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    
    // Initialize background effects
    createFallingElements();
    createBlinkingPixels();
    
    // Set initial styles
    members.forEach(member => {
        member.style.opacity = '0';
        member.addEventListener('click', handleMemberClick);
    });
    
    // Add event listener for game field to detect misses
    if (gameField) {
        gameField.addEventListener('click', handleGameFieldClick);
    }
});

// Background effects
function createFallingElements() {
    const container = document.querySelector('.falling-elements');
    const shapes = ['✧', '✦', '⊕', '◉', '⚡', '✺'];
    const colors = ['#DA70D6', '#8A2BE2', '#00FFD1', '#E0B0FF'];
    
    for (let i = 0; i < 20; i++) {
        const element = document.createElement('div');
        element.className = 'falling-item';
        element.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        element.style.color = colors[Math.floor(Math.random() * colors.length)];
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.fontSize = `${Math.random() * 20 + 10}px`;
        
        // Apply random animation
        const animations = ['diagonal-drift', 'bounce', 'circular-path', 'zigzag'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        element.style.animation = `${randomAnimation} ${Math.random() * 20 + 10}s infinite linear`;
        
        container.appendChild(element);
    }
}

function createBlinkingPixels() {
    const container = document.querySelector('.blinking-elements');
    const colors = ['#DA70D6', '#8A2BE2', '#00FFD1', '#E0B0FF'];
    
    for (let i = 0; i < 50; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'succinct-pixel';
        pixel.style.left = `${Math.random() * 100}%`;
        pixel.style.top = `${Math.random() * 100}%`;
        pixel.style.width = `${Math.random() * 4 + 2}px`;
        pixel.style.height = pixel.style.width;
        pixel.style.color = colors[Math.floor(Math.random() * colors.length)];
        pixel.style.animationDuration = `${Math.random() * 5 + 2}s`;
        pixel.style.animation = `blink ${Math.random() * 5 + 2}s infinite`;
        pixel.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(pixel);
    }
}

// Game functions
function startGame() {
    gameInfo.classList.add('hidden');
    resetGame();
    isGameRunning = true;
    
    // Start timer
    gameInterval = setInterval(updateGame, 1000);
    
    // Set first active member
    setRandomActiveMember();
}

function resetGame() {
    score = 0;
    timeLeft = 20;
    scoreDisplay.textContent = `Codes: ${score}`;
    timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
    progressBar.style.width = '100%';
    
    members.forEach(member => {
        member.style.opacity = '0';
        member.style.animation = '';
        member.classList.remove('active');
    });
}

function restartGame() {
    gameOver.classList.add('hidden');
    startGame();
}

function updateGame() {
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
    progressBar.style.width = `${(timeLeft / 20) * 100}%`;
    
    if (timeLeft <= 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    
    if (activeMember) {
        activeMember.style.opacity = '0';
        activeMember.classList.remove('active');
        activeMember = null;
    }
    
    finalScoreDisplay.textContent = score;
    gameOver.classList.remove('hidden');
}

function setRandomActiveMember() {
    // Clear previous active member
    if (activeMember) {
        activeMember.style.opacity = '0';
        activeMember.classList.remove('active');
    }
    
    // Select random member
    const randomIndex = Math.floor(Math.random() * members.length);
    activeMember = members[randomIndex];
    
    // Activate member
    activeMember.style.opacity = '1';
    activeMember.classList.add('active');
    activeMember.style.animation = 'pulse 1s infinite';
}

function handleMemberClick(e) {
    if (!isGameRunning) return;
    
    if (e.target.classList.contains('active')) {
        // Correct click
        score++;
        scoreDisplay.textContent = `Codes: ${score}`;
        
        // Add visual feedback
        const x = e.clientX;
        const y = e.clientY;
        createClickEffect(x, y, true);
        
        // Set new active member
        setRandomActiveMember();
        
        // Prevent event bubbling to avoid triggering the miss handler
        e.stopPropagation();
    }
}

// New function to handle clicks on the game field (misses)
function handleGameFieldClick(e) {
    if (!isGameRunning) return;
    
    // Check if the click was directly on the game field (not on a member)
    if (e.target === gameField) {
        // Miss - subtract one second
        timeLeft = Math.max(0, timeLeft - 1); // Prevent negative time
        
        // Update display
        timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
        progressBar.style.width = `${(timeLeft / 20) * 100}%`;
        
        // Add visual feedback for miss
        const x = e.clientX;
        const y = e.clientY;
        createClickEffect(x, y, false);
        
        // End game if time runs out
        if (timeLeft <= 0) {
            endGame();
        }
    }
}

function createClickEffect(x, y, isSuccess) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.position = 'absolute';
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    effect.style.width = '50px';
    effect.style.height = '50px';
    effect.style.borderRadius = '50%';
    
    // Different color for hit vs miss
    if (isSuccess) {
        effect.style.backgroundColor = 'rgba(218, 112, 214, 0.5)'; // Purple for success
    } else {
        effect.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Red for miss
    }
    
    effect.style.transform = 'translate(-50%, -50%) scale(0)';
    effect.style.zIndex = '100';
    effect.style.animation = 'clickEffect 0.5s forwards';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        document.body.removeChild(effect);
    }, 500);
}

// Add this to your CSS
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes clickEffect {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}
</style>
`);
