var memberArray = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9'];
var score = 0;
var startTime;
var gameEnd = true;

// Новые переменные для статистики
let bestScore = 0;
let clickTimes = [];
let successfulClicks = 0;
let missedClicks = 0;

window.addEventListener('DOMContentLoaded', initialisation());

function initialisation() {
    document.getElementById('game-field').addEventListener('click', function(data){
        if (memberArray.indexOf(data.target.id) !== -1) {
            // Сохраняем время реакции
            const memberElement = document.getElementById(data.target.id);
            if (memberElement.dataset.appearTime) {
                const appearTime = parseInt(memberElement.dataset.appearTime);
                const clickTime = Date.now();
                const reactionTime = (clickTime - appearTime) / 1000; // в секундах
                clickTimes.push(reactionTime);
                successfulClicks++;
                updateStatistics();
            }
            
            removeMember(data.target.id);
            changeScore(++score);
            playHitSound();
            triggerHitAnimation(data.target);
            setTimeout(addMember, 300, getRandomMember());
        }
    })
    document.getElementsByClassName('start-button')[0].addEventListener('mouseup', startGame);
    document.getElementsByClassName('start-button')[1].addEventListener('mouseup', startGame);
    
    // Create the falling background elements
    createFallingElements();
    
    // Загружаем лучший результат
    loadBestScore();
}

// Функция для сохранения лучшего результата в localStorage
function saveBestScore() {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('crisisOfTrustBestScore', bestScore);
    }
}

// Функция для загрузки лучшего результата при запуске игры
function loadBestScore() {
    const savedBestScore = localStorage.getItem('crisisOfTrustBestScore');
    if (savedBestScore !== null) {
        bestScore = parseInt(savedBestScore);
    }
    updateStatistics();
}

// Функция для расчета среднего времени реакции
function calculateAvgResponseTime() {
    if (clickTimes.length === 0) return 0;
    const sum = clickTimes.reduce((a, b) => a + b, 0);
    return (sum / clickTimes.length).toFixed(1);
}

// Функция для расчета успешности (процент успешных кликов)
function calculateSuccessRate() {
    const totalAttempts = successfulClicks + missedClicks;
    if (totalAttempts === 0) return 0;
    return Math.round((successfulClicks / totalAttempts) * 100);
}

// Функция для обновления всей статистики
function updateStatistics() {
    // Обновляем Best Score
    document.querySelector('.stats-item:nth-child(1) .stats-value').textContent = bestScore;
    
    // Обновляем Avg. Response
    const avgResponse = calculateAvgResponseTime();
    document.querySelector('.stats-item:nth-child(2) .stats-value').textContent = avgResponse + 's';
    
    // Обновляем Success Rate
    const successRate = calculateSuccessRate();
    document.querySelector('.stats-item:nth-child(3) .stats-value').textContent = successRate + '%';
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
    return memberArray[Math.floor(Math.random() * Math.floor(9))];
}

function addMember(id) {
    const memberElement = document.getElementById(id);
    memberElement.style.display = 'block';
    memberElement.style.animation = 'pulse 0.5s ease-in-out';
    
    // Добавляем время появления элемента
    memberElement.dataset.appearTime = Date.now();
    
    if (!gameEnd) {
        setTimeout(function(){
            if (memberElement.style.display != 'none') {
                // Отмечаем как пропущенный клик
                missedClicks++;
                updateStatistics();
                
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
    scoreElement.style.transform = 'scale(1.1) rotateX(20deg)';
    setTimeout(() => {
        scoreElement.style.transform = 'scale(1) rotateX(0deg)';
    }, 200);
    
    // Обновляем лучший результат если нужно
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('crisisOfTrustBestScore', bestScore);
        updateStatistics();
    }
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
    score = 0;
    changeScore();
    
    // Сбрасываем статистику для новой игры
    clickTimes = [];
    successfulClicks = 0;
    missedClicks = 0;
    
    clearField();
    document.getElementById('game-info').style.display = 'none';
    document.getElementById('game-end').classList.add('hidden');
    gameEnd = false;
    startTimer();
    setTimeout(addMember, 300, getRandomMember());
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
    gameEnd = true;
    
    // Сохраняем лучший результат
    saveBestScore();
    
    // Обновляем все статистики в последний раз
    updateStatistics();
    
    const h1 = document.getElementById('game-end').getElementsByTagName('h1')[0];
    const h2 = document.getElementById('game-end').getElementsByTagName('h2')[0];
    
    h1.classList.add('glitch-text');
    h2.classList.add('typing-text');
    
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
    
    h1.setAttribute('data-text', resultText);
    h1.innerHTML = resultText;
    typeWriter(h2, subText);
    
    document.getElementById('game-end').classList.remove('hidden');
}
