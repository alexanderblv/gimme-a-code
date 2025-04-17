// Global game variables
let score = 0;
let timeLeft = 20;
let gameInterval;
let activeMember = null;
let isGameRunning = false;

// Import SP1 Bridge
import sp1Bridge from './sp1-bridge.js';

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

// Add new elements for SP1 features
const proofStatusElement = document.createElement('div');
proofStatusElement.id = 'proof-status';
proofStatusElement.className = 'proof-status';
proofStatusElement.style.display = 'none';
document.body.appendChild(proofStatusElement);

// Add "Verify with SP1" button to the game over screen
const verifyButton = document.createElement('button');
verifyButton.id = 'verify-score';
verifyButton.className = 'game-button';
verifyButton.textContent = 'Verify with SP1';
gameOver.appendChild(verifyButton);

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    verifyButton.addEventListener('click', verifyGameWithSP1);
    
    // Initialize background effects
    createFallingElements();
    createBlinkingPixels();
    
    // Set initial styles
    members.forEach(member => {
        member.style.opacity = '0';
        member.addEventListener('click', handleMemberClick);
    });
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
    
    // Reset SP1 bridge
    sp1Bridge.reset();
    
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
    
    // Hide proof status
    proofStatusElement.style.display = 'none';
    
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

async function endGame() {
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
        
        // Record click action with SP1 bridge
        const rect = e.target.getBoundingClientRect();
        const x = Math.floor(rect.left + rect.width / 2);
        const y = Math.floor(rect.top + rect.height / 2);
        sp1Bridge.recordClick(x, y);
        
        // Add visual feedback
        const clickX = e.clientX;
        const clickY = e.clientY;
        createClickEffect(clickX, clickY);
        
        // Set new active member
        setRandomActiveMember();
    }
}

function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.position = 'absolute';
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    effect.style.width = '50px';
    effect.style.height = '50px';
    effect.style.borderRadius = '50%';
    effect.style.backgroundColor = 'rgba(218, 112, 214, 0.5)';
    effect.style.transform = 'translate(-50%, -50%) scale(0)';
    effect.style.zIndex = '100';
    effect.style.animation = 'clickEffect 0.5s forwards';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        document.body.removeChild(effect);
    }, 500);
}

// SP1 verification function
async function verifyGameWithSP1() {
    // Show proof status
    proofStatusElement.style.display = 'block';
    proofStatusElement.innerHTML = `
        <div class="proof-status-content">
            <h3>Generating SP1 Proof...</h3>
            <div class="loading-spinner"></div>
        </div>
    `;
    
    try {
        // Generate proof
        const proofResult = await sp1Bridge.generateProof();
        
        // Verify the proof
        const verificationResult = await sp1Bridge.verifyProof(proofResult);
        
        if (verificationResult.verified) {
            // Display verification success
            proofStatusElement.innerHTML = `
                <div class="proof-status-content success">
                    <h3>SP1 Verification Successful!</h3>
                    <p>Your score of ${verificationResult.publicValues.score} has been cryptographically verified.</p>
                    <p>Game ID: ${verificationResult.publicValues.game_id}</p>
                    <button class="game-button" onclick="document.getElementById('proof-status').style.display = 'none'">Close</button>
                </div>
            `;
        } else {
            // Display verification failure
            proofStatusElement.innerHTML = `
                <div class="proof-status-content error">
                    <h3>SP1 Verification Failed</h3>
                    <p>The proof could not be verified.</p>
                    <button class="game-button" onclick="document.getElementById('proof-status').style.display = 'none'">Close</button>
                </div>
            `;
        }
    } catch (error) {
        // Display error
        proofStatusElement.innerHTML = `
            <div class="proof-status-content error">
                <h3>SP1 Verification Error</h3>
                <p>${error.message || 'An error occurred during verification.'}</p>
                <button class="game-button" onclick="document.getElementById('proof-status').style.display = 'none'">Close</button>
            </div>
        `;
    }
}

// Add CSS for proof status and loading spinner
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes clickEffect {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}

.proof-status {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.proof-status-content {
    background-color: rgba(30, 30, 50, 0.95);
    border: 2px solid #00FFD1;
    border-radius: 8px;
    padding: 20px;
    max-width: 500px;
    text-align: center;
    color: white;
    box-shadow: 0 0 20px rgba(0, 255, 209, 0.5);
}

.proof-status-content.success {
    border-color: #00FF00;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
}

.proof-status-content.error {
    border-color: #FF0000;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(0, 255, 209, 0.3);
    border-radius: 50%;
    border-top-color: #00FFD1;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
`);
