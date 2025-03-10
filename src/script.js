// Game logic
let score = 0;
let timeLeft = 20;
let gameInterval;
let activeMembers = [];
let gameEnd = true;

// Initialize the game when DOM content is loaded
window.addEventListener('DOMContentLoaded', initialisation);

function initialisation() {
    // Set up event listeners
    document.getElementById('game-field').addEventListener('click', function(data){
        if (data.target.classList.contains('member-img')) {
            clickMember(data.target);
        }
    });
    
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('restart-button').addEventListener('click', startGame);
    
    // Create background elements
    createBackgroundElements();
}

// Background animations
function createBackgroundElements() {
    const fallingContainer = document.querySelector('.falling-elements');
    const blinkingContainer = document.querySelector('.blinking-elements');
    
    // Clear existing elements
    if (fallingContainer) fallingContainer.innerHTML = '';
    if (blinkingContainer) blinkingContainer.innerHTML = '';
    
    // Create falling elements
    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.classList.add('falling-item');
        element.style.left = `${Math.random() * 100}vw`;
        element.style.top = `${Math.random() * 100}vh`;
        element.style.opacity = Math.random() * 0.5 + 0.1;
        element.style.fontSize = `${Math.random() * 20 + 10}px`;
        element.innerHTML = ['✨', '🔒', '💻', '⚡', '🔑'][Math.floor(Math.random() * 5)];
        
        // Random animation type
        const animations = ['diagonal-drift', 'bounce', 'circular-path', 'zigzag'];
        const randomAnim = animations[Math.floor(Math.random() * animations.length)];
        element.style.animation = `${randomAnim} ${Math.random() * 15 + 10}s infinite alternate`;
        
        fallingContainer.appendChild(element);
    }
    
    // Create blinking pixel elements
    for (let i = 0; i < 30; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('succinct-pixel');
        pixel.style.left = `${Math.random() * 100}vw`;
        pixel.style.top = `${Math.random() * 100}vh`;
        pixel.style.width = `${Math.random() * 4 + 2}px`;
        pixel.style.height = pixel.style.width;
        pixel.style.backgroundColor = `hsl(${Math.random() * 60 + 270}, 100%, 70%)`;
        pixel.style.animation = `blink ${Math.random() * 3 + 2}s infinite`;
        
        blinkingContainer.appendChild(pixel);
    }
}

// Initialize the game
function startGame() {
    console.log("startGame function called");
    
    // Hide overlays
    document.getElementById('start-overlay').classList.add('hidden');
    document.getElementById('game-over-overlay').classList.add('hidden');
    
    // Reset game state
    score = 0;
    timeLeft = 20;
    updateScore();
    updateTimer();
    gameEnd = false;
    
    // Clear all active members
    clearField();
    
    // Start the game loop
    gameInterval = setInterval(gameLoop, 1000);
    
    // Show the first member
    showRandomMember();
}

// Clear all active members
function clearField() {
    let members = document.getElementsByClassName('member-img');
    for (let i = 0; i < members.length; i++) {
        members[i].style.animation = '';
        members[i].style.filter = 'hue-rotate(-40deg) brightness(0.9)';
        members[i].style.opacity = '0.7';
        members[i].onclick = null;
    }
    activeMembers = [];
}

// Game loop function
function gameLoop() {
    timeLeft--;
    updateTimer();
    
    // Show a new member randomly
    if (Math.random() > 0.3) {
        showRandomMember();
    }
    
    // Game over when time runs out
    if (timeLeft <= 0) {
        gameOver();
    }
}

// Show a random member
function showRandomMember() {
    const members = document.querySelectorAll('.member-img');
    const availableMembers = Array.from(members).filter(member => !activeMembers.includes(member.id));
    
    if (availableMembers.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableMembers.length);
        const member = availableMembers[randomIndex];
        
        // Add to active members
        activeMembers.push(member.id);
        
        // Animate member
        member.style.animation = 'pulse 1.5s infinite';
        member.style.filter = 'hue-rotate(0deg) brightness(1.2)';
        member.style.opacity = '1';
        
        // Make member clickable
        member.onclick = function() {
            clickMember(member);
        };
        
        // Auto-hide after random time if not clicked
        setTimeout(() => {
            if (activeMembers.includes(member.id)) {
                hideMember(member);
            }
        }, Math.random() * 2000 + 1000);
    }
}

// Handle member click
function clickMember(member) {
    // Increase score
    score++;
    updateScore();
    
    // Add time bonus
    timeLeft += 1;
    updateTimer();
    
    // Hide the member
    hideMember(member);
    
    // Show effect
    showClickEffect(member);
}

// Hide a member
function hideMember(member) {
    member.style.animation = '';
    member.style.filter = 'hue-rotate(-40deg) brightness(0.9)';
    member.style.opacity = '0.7';
    member.onclick = null;
    
    // Remove from active members
    const index = activeMembers.indexOf(member.id);
    if (index > -1) {
        activeMembers.splice(index, 1);
    }
}

// Show click effect
function showClickEffect(member) {
    const effect = document.createElement('div');
    effect.textContent = '+1';
    effect.style.position = 'absolute';
    effect.style.color = '#00FFD1';
    effect.style.fontSize = '24px';
    effect.style.fontWeight = 'bold';
    effect.style.textShadow = '0 0 10px rgba(0, 255, 209, 0.8)';
    effect.style.zIndex = '100';
    
    // Get position
    const rect = member.getBoundingClientRect();
    effect.style.left = `${rect.left + rect.width / 2}px`;
    effect.style.top = `${rect.top + rect.height / 2}px`;
    
    // Add animation
    effect.style.transition = 'all 0.8s ease-out';
    effect.style.pointerEvents = 'none';
    
    document.body.appendChild(effect);
    
    // Animate and remove
    setTimeout(() => {
        effect.style.transform = 'translateY(-50px)';
        effect.style.opacity = '0';
    }, 50);
    
    setTimeout(() => {
        effect.remove();
    }, 800);
}

// Update score display
function updateScore() {
    document.querySelector('#score span').textContent = `Codes: ${score}`;
    document.getElementById('final-score').textContent = score;
    
    // Update best score in stats
    const statsValues = document.querySelectorAll('.stats-value');
    if (statsValues.length > 0) {
        statsValues[0].textContent = score > parseInt(statsValues[0].textContent || '0') ? score : statsValues[0].textContent;
    }
}

// Update timer display
function updateTimer() {
    document.querySelector('#timer span').textContent = `Time left: ${timeLeft} seconds`;
    
    // Update progress bar
    const progressPercent = (timeLeft / 20) * 100;
    document.getElementById('progress').style.width = `${progressPercent}%`;
    
    // Add visual intensity as time runs low
    if (timeLeft <= 5) {
        document.getElementById('timer').classList.add('timer-warning');
    } else {
        document.getElementById('timer').classList.remove('timer-warning');
    }
}

// Game over function
function gameOver() {
    clearInterval(gameInterval);
    gameEnd = true;
    
    // Hide all active members
    activeMembers.forEach(id => {
        const member = document.getElementById(id);
        if (member) {
            hideMember(member);
        }
    });
    activeMembers = [];
    
    // Show game over overlay
    document.getElementById('game-over-overlay').classList.remove('hidden');
    
    // Update final score
    document.getElementById('final-score').textContent = score;
    
    // Add custom message based on score
    let resultTitle = document.querySelector('#game-over-overlay h1');
    let resultMessage;
    
    if (score >= 20) {
        resultTitle.textContent = "AMAZING RESULT!";
        resultMessage = "You're a quantum coder now!";
    } else if (score >= 10) {
        resultTitle.textContent = "GOOD JOB!";
        resultMessage = "You've earned Succinct's trust!";
    } else {
        resultTitle.textContent = "GAME OVER";
        resultMessage = "Try again, crypto needs you!";
    }
    
    // Add or update the message
    let messageElement = document.querySelector('#game-over-overlay h3');
    if (messageElement) {
        messageElement.textContent = resultMessage;
    }
}

// Добавление стилей для анимации конца таймера
function addStylesIfNotExist() {
    if (!document.getElementById('dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @keyframes blink {
                0% { opacity: 0.2; }
                50% { opacity: 1; }
                100% { opacity: 0.2; }
            }
            
            @keyframes diagonal-drift {
                0% { transform: translate(0, 0); }
                100% { transform: translate(100px, 100px); }
            }
            
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(50px); }
            }
            
            @keyframes circular-path {
                0% { transform: rotate(0deg) translateX(50px) rotate(0deg); }
                100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
            }
            
            @keyframes zigzag {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(50px, -25px); }
                50% { transform: translate(0, -50px); }
                75% { transform: translate(-50px, -25px); }
            }
            
            .timer-warning {
                animation: shake 0.5s infinite;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Запустить добавление стилей при загрузке страницы
document.addEventListener('DOMContentLoaded', addStylesIfNotExist);
