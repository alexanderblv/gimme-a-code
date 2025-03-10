var memberArray = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'];
var score = 0;
var startTime;
var gameEnd = true;

// Переменные для статистики
let bestScore = 0;
let clickTimes = [];
let successfulClicks = 0;
let missedClicks = 0;

window.addEventListener('DOMContentLoaded', initialisation);

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
    });
    
    // Добавляем обработчики событий для кнопок
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('restart-button').addEventListener('click', startGame);
    
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

// Функция для обновления всей статистики на экране
function updateStatistics() {
    // Обновляем Best Score
    document.querySelector('.stats-item:nth-child(1) .stats-value').textContent = bestScore;
    
    // Обновляем Avg. Response
    const avgResponse = calculateAvgResponseTime();
    document.querySelector('.stats-item:nth-child(2) .stats-value').textContent = avgResponse + 's';
    
    // Обновляем Success Rate
    const successRate = calculateSuccessRate();
    document.querySelector('.stats-item:nth-child(3) .stats-value').textContent = successRate + '%';
    
    // Обновляем финальный счет в оверлее окончания игры
    document.getElementById('final-score').textContent = score;
}

function createFallingElements() {
    const fallingContainer = document.querySelector('.falling-elements');
    const blinkingContainer = document.querySelector('.blinking-elements');
    
    // Создаем падающие элементы
    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.classList.add('falling-item');
        element.style.left = `${Math.random() * 100}vw`;
        element.style.top = `${Math.random() * 100}vh`;
        element.style.opacity = Math.random() * 0.5 + 0.1;
        element.style.fontSize = `${Math.random() * 20 + 10}px`;
        element.innerHTML = ['✨', '🔒', '💻', '⚡', '🔑'][Math.floor(Math.random() * 5)];
        
        // Случайный тип анимации
        const animations = ['diagonal-drift', 'bounce', 'circular-path', 'zigzag'];
        const randomAnim = animations[Math.floor(Math.random() * animations.length)];
        element.style.animation = `${randomAnim} ${Math.random() * 15 + 10}s infinite alternate`;
        
        fallingContainer.appendChild(element);
    }
    
    // Создаем мерцающие пиксели
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
    randomSound.play().catch(e => console.log("Sound play failed:", e));
}

function getRandomMember() {
    return memberArray[Math.floor(Math.random() * memberArray.length)];
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
        
        // Добавляем визуальную интенсивность, когда время на исходе
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
    // Скрываем оверлеи
    document.getElementById('start-overlay').classList.add('hidden');
    document.getElementById('game-over-overlay').classList.add('hidden');
    
    // Сбрасываем игровые переменные
    score = 0;
    changeScore();
    
    // Сбрасываем статистику для новой игры
    clickTimes = [];
    successfulClicks = 0;
    missedClicks = 0;
    
    clearField();
    document.getElementById('game-info').style.display = 'none';
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
    
    // Показываем оверлей окончания игры
    document.getElementById('game-over-overlay').classList.remove('hidden');
    
    // Устанавливаем текст в зависимости от результата
    let resultText, resultClass;
    if (score >= 20) {
        resultText = 'IMPRESSIVE SPEED!';
        resultClass = 'high-score';
    } else if (score < 20 && score > 8) {
        resultText = 'GOOD EFFORT!';
        resultClass = 'medium-score';
    } else {
        resultText = 'TRY AGAIN...';
        resultClass = 'low-score';
    }
    
    // Обновляем текст заголовка
    const gameOverTitle = document.querySelector('#game-over-overlay h1');
    gameOverTitle.textContent = resultText;
    gameOverTitle.className = resultClass;
}
