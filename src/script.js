// Global game variables
let score = 0;
let startTime;
let gameEnd = true;
let gameInterval;
let activeMembers = [];
let memberArray = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'];

// Статистика
let bestScore = 0;
let clickTimes = [];
let successfulClicks = 0;
let missedClicks = 0;

window.addEventListener('DOMContentLoaded', initialisation);

function initialisation() {
    // Add click event listeners to all member images
    document.getElementById('game-field').addEventListener('click', function(data){
        if (memberArray.indexOf(data.target.id) !== -1) {
            // Проверяем, что элемент активный
            if (activeMembers.includes(data.target.id)) {
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
                
                // Увеличиваем счет
                score++;
                changeScore();
                
                // Добавляем время к таймеру (бонус)
                if (!gameEnd) {
                    startTime += 1000; // добавляем 1 секунду
                    changeTimer();
                }
                
                // Анимация и звук клика
                triggerHitAnimation(data.target);
                
                // Скрываем элемент
                hideMember(data.target);
                
                // Показываем эффект клика
                showClickEffect(data.target);
                
                // Запускаем новый элемент через небольшую задержку
                setTimeout(showRandomMember, 300);
            }
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

// Показать эффект клика
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

// Показать случайного участника
function showRandomMember() {
    // Получаем все доступные элементы
    const availableMembers = memberArray.filter(id => !activeMembers.includes(id));
    
    if (availableMembers.length > 0 && !gameEnd) {
        const randomIndex = Math.floor(Math.random() * availableMembers.length);
        const memberId = availableMembers[randomIndex];
        const member = document.getElementById(memberId);
        
        // Добавляем в активные элементы
        activeMembers.push(memberId);
        
        // Показываем элемент
        member.style.display = 'block';
        member.style.animation = 'pulse 1.5s infinite';
        member.style.filter = 'hue-rotate(0deg) brightness(1.2)';
        member.style.opacity = '1';
        
        // Добавляем время появления
        member.dataset.appearTime = Date.now();
        
        // Скрываем элемент автоматически если не был кликнут
        setTimeout(() => {
            if (activeMembers.includes(memberId) && !gameEnd) {
                hideMember(member);
                // Увеличиваем счетчик пропущенных кликов
                missedClicks++;
                updateStatistics();
                // Показываем новый элемент
                setTimeout(showRandomMember, Math.random() * 200 + 100);
            }
        }, Math.random() * 2000 + 1000);
    }
}

// Скрыть элемент
function hideMember(member) {
    member.style.animation = '';
    member.style.filter = 'hue-rotate(-40deg) brightness(0.9)';
    member.style.opacity = '0.7';
    
    // Удаляем из активных элементов
    const index = activeMembers.indexOf(member.id);
    if (index > -1) {
        activeMembers.splice(index, 1);
    }
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
    activeMembers = [];
}

function startGame() {
    console.log("startGame function called");
    
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
    updateStatistics();
    
    clearField();
    gameEnd = false;
    startTimer();
    
    // Запускаем игру, показывая первого участника
    setTimeout(showRandomMember, 300);
    
    // Запускаем интервал для периодического добавления новых участников
    gameInterval = setInterval(() => {
        if (Math.random() > 0.5 && !gameEnd) {
            showRandomMember();
        }
    }, 1000);
}

function endGame() {
    // Останавливаем игру
    gameEnd = true;
    clearInterval(gameInterval);
    
    // Скрываем всех активных участников
    activeMembers.forEach(id => {
        const member = document.getElementById(id);
        hideMember(member);
    });
    activeMembers = [];
    
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

// Добавление стилей для анимаций нажатия
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes clickEffect {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(0); }
    75% { transform: translateX(5px); }
    100% { transform: translateX(0); }
}

@keyframes blink {
    0% { opacity: 0.2; }
    50% { opacity: 1; }
    100% { opacity: 0.2; }
}

@keyframes diagonal-drift {
    0% { transform: translate(0, 0); }
    50% { transform: translate(20px, 20px); }
    100% { transform: translate(0, 0); }
}

@keyframes bounce {
    0% { transform: translateY(0); }
    50% { transform: translateY(20px); }
    100% { transform: translateY(0); }
}

@keyframes circular-path {
    0% { transform: translate(0, 0); }
    25% { transform: translate(20px, 0); }
    50% { transform: translate(20px, 20px); }
    75% { transform: translate(0, 20px); }
    100% { transform: translate(0, 0); }
}

@keyframes zigzag {
    0% { transform: translate(0, 0); }
    25% { transform: translate(20px, 20px); }
    50% { transform: translate(0, 40px); }
    75% { transform: translate(-20px, 20px); }
    100% { transform: translate(0, 0); }
}
</style>
`);
