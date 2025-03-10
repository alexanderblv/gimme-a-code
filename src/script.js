var memberArray = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9'];
var score = 0;
var startTime;
var gameEnd = true;

// Statistics variables
var bestScore = 0;
var responseTimes = [];
var totalClicks = 0;
var successfulClicks = 0;

window.addEventListener('DOMContentLoaded', initialisation);

function initialisation() {
    // Add debugging to check what elements exist
    console.log("Game field:", document.getElementById('game-field'));
    console.log("Start buttons by class:", document.getElementsByClassName('start-button'));
    console.log("Start button by ID:", document.getElementById('start-button'));
    console.log("Restart button by ID:", document.getElementById('restart-button'));
    
    document.getElementById('game-field').addEventListener('click', function(data){
        totalClicks++; // Track all clicks
        
        if (memberArray.indexOf(data.target.id) !== -1) {
            // Record response time
            const clickTime = Date.now();
            const responseTime = (clickTime - data.target.getAttribute('data-appeared')) / 1000;
            responseTimes.push(responseTime);
            
            // Update successful clicks
            successfulClicks++;
            
            removeMember(data.target.id);
            changeScore(++score);
            playHitSound();
            triggerHitAnimation(data.target);
            setTimeout(addMember, 300, getRandomMember());
            
            // Update statistics in real-time
            updateStatistics();
        } else {
            // Just update stats for missed clicks
            updateStatistics();
        }
    });
    
    // Try to find start buttons in multiple ways and add event listeners
    // Option 1: By class name from original code
    const startButtonsByClass = document.getElementsByClassName('start-button');
    if (startButtonsByClass.length > 0) {
        console.log("Found start buttons by class:", startButtonsByClass.length);
        for (let i = 0; i < startButtonsByClass.length; i++) {
            startButtonsByClass[i].addEventListener('mouseup', startGame);
        }
    }
    
    // Option 2: By specific IDs from new code
    const startButton = document.getElementById('start-button');
    if (startButton) {
        console.log("Found start button by ID");
        startButton.addEventListener('mouseup', startGame);
    }
    
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
        console.log("Found restart button by ID");
        restartButton.addEventListener('mouseup', startGame);
    }
    
    // Option 3: Look for any buttons with text containing "start" or "restart"
    const allButtons = document.getElementsByTagName('button');
    for (let i = 0; i < allButtons.length; i++) {
        const buttonText = allButtons[i].textContent.toLowerCase();
        if (buttonText.includes('start') || buttonText.includes('restart')) {
            console.log("Found button with start/restart text:", allButtons[i]);
            allButtons[i].addEventListener('mouseup', startGame);
        }
    }
    
    // Load best score from localStorage if available
    if (localStorage.getItem('bestScore')) {
        bestScore = parseInt(localStorage.getItem('bestScore'));
        if (document.getElementById('best-score')) {
            document.getElementById('best-score').textContent = bestScore;
        }
    }
    
    // Create the falling background elements
    createFallingElements();
}

function createFallingElements() {
    const container = document.createElement('div');
    container.className = 'falling-elements';
    document.body.appendChild(container);
    
    const images = ['meme.png', 'dvd.png', 'hat.png', 'crab.png'];
    const numberOfElements = 15; // More elements for a richer background
    
    for (let i = 0; i < numberOfElements; i++) {
        const element = document.createElement('img');
        const randomImage = images[Math.floor(Math.random() * images.length)];
        element.src = `img/${randomImage}`;
        element.className = 'falling-item';
        
        // Random positioning and properties
        const gameField = document.getElementById('game-field');
        const gameFieldRect = gameField.getBoundingClientRect();
        
        // Get window dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Define game field boundaries
        const gameFieldLeft = gameFieldRect.left;
        const gameFieldRight = gameFieldRect.right;
        const gameFieldTop = gameFieldRect.top;
        const gameFieldBottom = gameFieldRect.bottom;
        
        // Random position (ensuring it's outside the game field)
        let startX, startY;
        let isPositionValid = false;
        
        // Keep generating random positions until we find one outside the game field
        while (!isPositionValid) {
            startX = Math.random() * 100; // Position in vh units
            startY = Math.random() * 100; // Position in vw units
            
            // Convert percentage to actual pixels for comparison
            const pixelX = (startX / 100) * windowWidth;
            const pixelY = (startY / 100) * windowHeight;
            
            // Check if the position is outside the game field with some margin
            if (!(pixelX > gameFieldLeft - 50 && pixelX < gameFieldRight + 50 &&
                  pixelY > gameFieldTop - 50 && pixelY < gameFieldBottom + 50)) {
                isPositionValid = true;
            }
        }
        
        const size = Math.random() * 50 + 30; // Size between 30px and 80px
        const opacity = Math.random() * 0.3 + 0.2; // Opacity between 0.2 and 0.5
        const rotationSpeed = Math.random() * 20 + 10; // Rotation speed
        
        // Choose a random animation pattern
        const animationPattern = Math.floor(Math.random() * 4);
        let animationStyle;
        
        switch(animationPattern) {
            case 0: // Diagonal drift
                animationStyle = `
                    diagonal-drift ${Math.random() * 60 + 40}s linear infinite,
                    gentle-rotate ${rotationSpeed}s ease-in-out infinite
                `;
                break;
            case 1: // Bouncing
                animationStyle = `
                    bounce ${Math.random() * 20 + 10}s ease-in-out infinite,
                    gentle-rotate ${rotationSpeed}s ease-in-out infinite
                `;
                break;
            case 2: // Circular path
                animationStyle = `
                    circular-path ${Math.random() * 40 + 30}s linear infinite,
                    gentle-rotate ${rotationSpeed}s ease-in-out infinite
                `;
                break;
            case 3: // Zigzag
                animationStyle = `
                    zigzag ${Math.random() * 30 + 20}s ease-in-out infinite,
                    gentle-rotate ${rotationSpeed * 0.8}s ease-in-out infinite
                `;
                break;
        }
        
        // Set CSS properties
        element.style.cssText = `
            top: ${startY}vh;
            left: ${startX}vw;
            width: ${size}px;
            height: auto;
            opacity: ${opacity};
            z-index: -1; /* Ensure it's behind the game field */
            animation: ${animationStyle};
            animation-delay: -${Math.random() * 30}s;
        `;
        
        container.appendChild(element);
    }
    
    // Add unique blinking elements
    const blinkingContainer = document.createElement('div');
    blinkingContainer.className = 'blinking-elements';
    document.body.appendChild(blinkingContainer);
    
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.className = 'succinct-pixel';
        
        const size = Math.random() * 6 + 4; // Size between 4px and 10px
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const blinkSpeed = Math.random() * 3 + 1; // Blink speed
        const hue = Math.random() * 60 + 300; // Purple to pink hue range
        
        element.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            top: ${startY}vh;
            left: ${startX}vw;
            background-color: hsl(${hue}, 100%, 70%);
            animation: blink ${blinkSpeed}s ease-in-out infinite;
            animation-delay: -${Math.random() * 3}s;
        `;
        
        blinkingContainer.appendChild(element);
    }
}

function updateStatistics() {
    // Update best score
    if (score > bestScore) {
        bestScore = score;
        if (document.getElementById('best-score')) {
            document.getElementById('best-score').textContent = bestScore;
        }
        localStorage.setItem('bestScore', bestScore);
    }
    
    // Calculate and update average response time
    if (responseTimes.length > 0 && document.getElementById('avg-response')) {
        const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        document.getElementById('avg-response').textContent = avgResponseTime.toFixed(1) + 's';
    }
    
    // Calculate and update success rate
    if (totalClicks > 0 && document.getElementById('success-rate')) {
        const successRate = (successfulClicks / totalClicks) * 100;
        document.getElementById('success-rate').textContent = Math.round(successRate) + '%';
    }
    
    // Update final score if element exists
    if (document.getElementById('final-score')) {
        document.getElementById('final-score').textContent = score;
    }
}

function triggerHitAnimation(target) {
    target.style.transform = 'scale(1.2) rotate(10deg)';
    setTimeout(() => {
        target.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
}

function playHitSound() {
    const hitSounds = [
        new Audio('sound/hit1.mp3'),
        new Audio('sound/hit2.mp3'),
        new Audio('sound/hit3.mp3')
    ];
    const randomSound = hitSounds[Math.floor(Math.random() * hitSounds.length)];
    randomSound.volume = 0.5;
    randomSound.play();
}

function getRandomMember() {
    return memberArray[Math.floor(Math.random() * memberArray.length)];
}

function addMember(id) {
    const memberElement = document.getElementById(id);
    memberElement.style.display = 'block';
    memberElement.style.animation = 'pulse 0.5s ease-in-out';
    
    // Store the timestamp when the member appeared
    memberElement.setAttribute('data-appeared', Date.now());
    
    if (!gameEnd) {
        setTimeout(function(){
            if (memberElement.style.display != 'none') {
                removeMember(id);
                setTimeout(addMember, Math.random() * Math.floor(300) + 100, getRandomMember());
            } 
        }, Math.round(Math.random() * Math.floor(800)) + 300);
    }
}

function removeMember(id) {
    document.getElementById(id).style.display = 'none';
}

function changeScore() {
    const scoreElement = document.getElementById('score').getElementsByTagName('span')[0];
    scoreElement.innerHTML = 'Codes: ' + score;
    
    // Animation effect
    scoreElement.style.transform = 'scale(1.1) rotateX(20deg)';
    setTimeout(() => {
        scoreElement.style.transform = 'scale(1) rotateX(0deg)';
    }, 200);
}

function startTimer() {
    startTime = Date.now();
    changeTimer();
}

function changeTimer() {
    if ((Date.now() - startTime) >= 20000) {
        endGame();
    } else {
        setTimeout(changeTimer, 50);
        const remainingTime = Math.round(20 - (Date.now() - startTime) / 1000);
        const progressPercentage = 100 - (Date.now() - startTime) * 0.005;
        
        document.getElementById('progress').style.width = progressPercentage + '%';
        document.getElementById('timer').getElementsByTagName('span')[0].innerHTML = 'Time left: ' + remainingTime + ' seconds';
        
        // Add visual intensity as time runs low
        if (remainingTime <= 5) {
            document.getElementById('timer').style.animation = 'shake 0.5s infinite';
        } else {
            document.getElementById('timer').style.animation = '';
        }
    }
}

function clearField() {
    let members = document.getElementsByClassName('member-img');
    for (let i = 0; i < members.length; i++) {
        members[i].style.display = 'none';
    }
}

function startGame() {
    console.log("Starting game...");
    
    // Reset game values
    score = 0;
    changeScore();
    responseTimes = [];
    totalClicks = 0;
    successfulClicks = 0;
    
    // Try both overlay structures to handle either version
    // Original structure
    if (document.getElementById('game-info')) {
        document.getElementById('game-info').style.display = 'none';
    }
    if (document.getElementById('game-end')) {
        document.getElementById('game-end').classList.add('hidden');
    }
    
    // New structure
    if (document.getElementById('start-overlay')) {
        document.getElementById('start-overlay').classList.add('hidden');
    }
    if (document.getElementById('game-over-overlay')) {
        document.getElementById('game-over-overlay').classList.add('hidden');
    }
    
    clearField();
    gameEnd = false;
    startTimer();
    setTimeout(addMember, 300, getRandomMember());
    
    // Update the statistics display
    updateStatistics();
}

function typeWriter(element, text, speed = 50) {
    element.innerHTML = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function endGame() {
    console.log("Ending game...");
    gameEnd = true;
    
    // Clear timer animation
    document.getElementById('timer').style.animation = '';
    
    // Update statistics one final time
    updateStatistics();
    
    // Determine text based on score
    let resultText, subText;
    if (score >= 20) {
        resultText = 'At this rate, Yinger will hire you as an assistant, DM him bro';
        subText = `Given ${score} codes. Great result Prover, you are just a SP1 dream!`;
    } else if (score < 20 && score > 8) {
        resultText = 'Cool, but ETH requires more!';
        subText = `You gave out ${score} codes. Try working like a Yinger next time!`;
    } else {
        resultText = 'ARE YOU GOING TO PROVE SOMETHING???';
        subText = `Given only ${score} codes. You either didn't figure out how to do it, or you fell asleep...`;
    }
    
    // Try both overlay structures to handle either version
    // Original structure
    if (document.getElementById('game-end')) {
        const h1 = document.getElementById('game-end').getElementsByTagName('h1')[0];
        const h2 = document.getElementById('game-end').getElementsByTagName('h2')[0];
        
        if (h1 && h2) {
            h1.classList.add('glitch-text');
            h2.classList.add('typing-text');
            
            h1.setAttribute('data-text', resultText);
            h1.innerHTML = resultText;
            typeWriter(h2, subText);
        }
        
        document.getElementById('game-end').classList.remove('hidden');
    }
    
    // New structure
    if (document.getElementById('game-over-overlay')) {
        document.getElementById('game-over-overlay').classList.remove('hidden');
        
        const h1 = document.querySelector('#game-over-overlay h1');
        const h2 = document.querySelector('#game-over-overlay h2');
        
        if (h1) {
            h1.innerHTML = resultText;
            if (!h1.classList.contains('glitch-text')) {
                h1.classList.add('glitch-text');
            }
            h1.setAttribute('data-text', resultText);
        }
        
        // Update the sub-text with typing effect
        if (h2 && h2.nextElementSibling && h2.nextElementSibling.tagName === 'H3') {
            const h3 = h2.nextElementSibling;
            typeWriter(h3, subText);
        } else if (h2) {
            typeWriter(h2, subText);
        }
    }
}
