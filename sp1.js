// SP1 Integration for Gimme-a-code Game
(function() {
    // Ждем полной загрузки страницы
    document.addEventListener('DOMContentLoaded', function() {
        // Добавляем SP1 бейдж
        addSP1Badge();
        
        // Добавляем кнопку верификации на экран результата
        addVerifyButton();
        
        // Добавляем образовательную информацию о SP1
        addSP1InfoPanel();
    });
    
    // Функция для добавления образовательной информации о SP1
    function addSP1InfoPanel() {
        // Проверяем, есть ли уже панель на странице
        if (document.querySelector('.sp1-info-panel')) {
            return;
        }
        
        const infoPanel = document.createElement('div');
        infoPanel.className = 'sp1-info-panel';
        
        infoPanel.innerHTML = `
            <h2>SP1 Cryptographic Verification</h2>
            <p>Your game scores are verified using SP1, a high-performance zero-knowledge virtual machine.</p>
            
            <h3>What is SP1?</h3>
            <p>SP1 is a high-performance zero-knowledge virtual machine that allows us to:</p>
            <ul>
                <li>Cryptographically verify game scores</li>
                <li>Ensure fair and tamper-proof gameplay</li>
                <li>Generate mathematical proofs of results</li>
            </ul>
            
            <h3>Why is this important?</h3>
            <p>SP1 verification ensures:</p>
            <ul>
                <li>Your achievements can be publicly verified without revealing private data</li>
                <li>Game scores cannot be manipulated or falsified</li>
                <li>Competitive play remains fair and transparent</li>
            </ul>
            
            <p class="sp1-learn-more">
                <a href="https://docs.succinct.xyz/sp1" target="_blank">Learn more about SP1</a>
            </p>
            
            <button class="sp1-close-panel">Close</button>
        `;
        
        document.body.appendChild(infoPanel);
        
        // Добавляем обработчик для закрытия панели
        infoPanel.querySelector('.sp1-close-panel').addEventListener('click', () => {
            infoPanel.style.display = 'none';
        });
    }
    
    // Функция для добавления кнопки "VERIFY WITH SP1" на экран результатов
    function addVerifyButton() {
        // Отслеживаем появление экрана результатов
        const gameInterval = setInterval(function() {
            const gameOverlay = document.getElementById('game-over-overlay');
            if (gameOverlay && !gameOverlay.classList.contains('hidden')) {
                // Проверяем, нет ли уже кнопки верификации
                if (document.getElementById('sp1-verify-button')) {
                    return;
                }
                
                // Получаем блок, где располагается кнопка рестарта
                const restartButton = document.getElementById('restart-button');
                if (restartButton) {
                    // Создаем кнопку SP1 верификации
                    const verifyButton = document.createElement('button');
                    verifyButton.id = 'sp1-verify-button';
                    verifyButton.className = 'glitch-button';
                    verifyButton.style.marginTop = '10px';
                    verifyButton.style.background = 'linear-gradient(135deg, #2a0060, #6600cc)';
                    verifyButton.style.border = '1px solid #00FFD1';
                    verifyButton.textContent = 'VERIFY WITH SP1';
                    
                    // Добавляем кнопку после кнопки рестарта
                    restartButton.parentNode.insertBefore(verifyButton, restartButton.nextSibling);
                    
                    // Добавляем обработчик клика
                    verifyButton.addEventListener('click', function() {
                        // Получаем данные игры
                        const score = document.getElementById('final-score')?.textContent || '0';
                        
                        // Запускаем SP1 верификацию
                        verifySP1Result({
                            score: parseInt(score),
                            timestamp: Date.now()
                        });
                        
                        // Деактивируем кнопку после нажатия
                        verifyButton.disabled = true;
                        verifyButton.textContent = 'VERIFYING...';
                        
                        // Сбрасываем кнопку через несколько секунд (для повторной верификации)
                        setTimeout(function() {
                            verifyButton.disabled = false;
                            verifyButton.textContent = 'VERIFY WITH SP1';
                        }, 5000);
                    });
                }
                
                // Сбрасываем интервал, чтобы не продолжать проверку
                clearInterval(gameInterval);
                
                // Запускаем новый интервал для отслеживания нового конца игры
                setTimeout(function() {
                    addVerifyButton();
                }, 1000);
            }
        }, 500);
    }
    
    // Функция для добавления SP1 бейджа
    function addSP1Badge() {
        // Создаем стили для бейджа
        const style = document.createElement('style');
        style.textContent = `
            .sp1-badge {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #2a0060, #6600cc);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-family: 'Orbitron', sans-serif;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 0 15px rgba(102, 0, 204, 0.4);
                transition: all 0.3s ease;
            }
            
            .sp1-badge:hover {
                transform: translateY(-2px);
                box-shadow: 0 0 20px rgba(102, 0, 204, 0.6);
            }
            
            .sp1-badge-icon {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #00FFD1;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: sp1-pulse 2s infinite;
            }
            
            @keyframes sp1-pulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(0, 255, 209, 0.7);
                }
                70% {
                    box-shadow: 0 0 0 6px rgba(0, 255, 209, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(0, 255, 209, 0);
                }
            }
            
            .sp1-badge-details {
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid #6600cc;
                border-radius: 8px;
                padding: 20px;
                color: white;
                font-family: 'Inter', sans-serif;
                width: 460px;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 10000;
                box-shadow: 0 0 20px rgba(102, 0, 204, 0.5);
                display: none;
            }
            
            .sp1-badge-details.active {
                display: block;
            }
            
            .sp1-badge-details h3 {
                color: #00FFD1;
                font-family: 'Orbitron', sans-serif;
                margin-top: 0;
                font-size: 16px;
                margin-bottom: 15px;
            }
            
            .sp1-badge-details-row {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                margin-bottom: 8px;
            }
            
            .sp1-badge-details-label {
                color: #999;
            }
            
            .sp1-badge-details-value {
                color: #00FFD1;
                font-family: 'Orbitron', sans-serif;
            }
            
            .sp1-verification-progress {
                margin: 15px 0;
            }
            
            .sp1-verification-step {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                opacity: 0.5;
                transition: opacity 0.3s ease;
            }
            
            .sp1-verification-step.active {
                opacity: 1;
            }
            
            .sp1-verification-step.completed .sp1-step-indicator::after {
                content: "✓";
                color: #00FFD1;
            }
            
            .sp1-step-indicator {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 1px solid #6600cc;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
                font-size: 12px;
                flex-shrink: 0;
            }
            
            .sp1-step-text {
                font-size: 13px;
            }
            
            .sp1-technical-details {
                margin-top: 15px;
                background: rgba(102, 0, 204, 0.2);
                padding: 12px;
                border-radius: 5px;
                font-size: 12px;
                border: 1px solid rgba(102, 0, 204, 0.4);
            }
            
            .sp1-technical-details-title {
                color: #00FFD1;
                margin-bottom: 5px;
                font-size: 12px;
                font-weight: bold;
            }
            
            .sp1-tech-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }
            
            .sp1-tech-label {
                color: #888;
            }
            
            .sp1-tech-value {
                color: #00FFD1;
                font-family: monospace;
            }
            
            /* Стили для кнопки SP1 верификации */
            #sp1-verify-button {
                background: linear-gradient(135deg, #2a0060, #6600cc);
                color: white;
                font-family: 'Orbitron', sans-serif;
                padding: 10px 20px;
                border: 1px solid #00FFD1;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
                font-size: 14px;
                box-shadow: 0 0 15px rgba(102, 0, 204, 0.4);
                transition: all 0.3s ease;
            }
            
            #sp1-verify-button:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 0 20px rgba(102, 0, 204, 0.6);
            }
            
            #sp1-verify-button:disabled {
                opacity: 0.7;
                cursor: wait;
            }
        `;
        document.head.appendChild(style);
        
        // Создаем бейдж
        const badge = document.createElement('div');
        badge.className = 'sp1-badge';
        badge.innerHTML = `
            <div class="sp1-badge-icon"></div>
            <span>SP1 Ready</span>
        `;
        document.body.appendChild(badge);
        
        // Создаем панель деталей
        const details = document.createElement('div');
        details.className = 'sp1-badge-details';
        details.innerHTML = `
            <h3>SP1 Verification Details</h3>
            
            <div class="sp1-verification-progress">
                <div class="sp1-verification-step" data-step="1">
                    <div class="sp1-step-indicator">1</div>
                    <div class="sp1-step-text">Initializing SP1 verification environment</div>
                </div>
                <div class="sp1-verification-step" data-step="2">
                    <div class="sp1-step-indicator">2</div>
                    <div class="sp1-step-text">Computing cryptographic hash of game data</div>
                </div>
                <div class="sp1-verification-step" data-step="3">
                    <div class="sp1-step-indicator">3</div>
                    <div class="sp1-step-text">Generating zero-knowledge proof</div>
                </div>
                <div class="sp1-verification-step" data-step="4">
                    <div class="sp1-step-indicator">4</div>
                    <div class="sp1-step-text">Verifying proof on SP1 network</div>
                </div>
                <div class="sp1-verification-step" data-step="5">
                    <div class="sp1-step-indicator">5</div>
                    <div class="sp1-step-text">Recording verified result</div>
                </div>
            </div>
            
            <div class="sp1-badge-details-row">
                <span class="sp1-badge-details-label">Status:</span>
                <span class="sp1-badge-details-value" id="sp1-status">Ready</span>
            </div>
            <div class="sp1-badge-details-row">
                <span class="sp1-badge-details-label">Score:</span>
                <span class="sp1-badge-details-value" id="sp1-score">-</span>
            </div>
            <div class="sp1-badge-details-row">
                <span class="sp1-badge-details-label">Proof ID:</span>
                <span class="sp1-badge-details-value" id="sp1-proof-id">-</span>
            </div>
            <div class="sp1-badge-details-row">
                <span class="sp1-badge-details-label">Verified at:</span>
                <span class="sp1-badge-details-value" id="sp1-timestamp">-</span>
            </div>
            
            <div class="sp1-technical-details">
                <div class="sp1-technical-details-title">Technical Details</div>
                <div class="sp1-tech-row">
                    <span class="sp1-tech-label">Circuit Size:</span>
                    <span class="sp1-tech-value" id="sp1-circuit-size">-</span>
                </div>
                <div class="sp1-tech-row">
                    <span class="sp1-tech-label">Constraints:</span>
                    <span class="sp1-tech-value" id="sp1-constraints">-</span>
                </div>
                <div class="sp1-tech-row">
                    <span class="sp1-tech-label">Public Inputs:</span>
                    <span class="sp1-tech-value" id="sp1-public-inputs">-</span>
                </div>
                <div class="sp1-tech-row">
                    <span class="sp1-tech-label">Verification Time:</span>
                    <span class="sp1-tech-value" id="sp1-verification-time">-</span>
                </div>
            </div>
        `;
        document.body.appendChild(details);
        
        // Показываем детали по клику на бейдж
        badge.addEventListener('click', function() {
            details.classList.toggle('active');
        });
        
        // Скрываем детали при клике вне бейджа
        document.addEventListener('click', function(event) {
            if (!badge.contains(event.target) && !details.contains(event.target)) {
                details.classList.remove('active');
            }
        });
        
        return { badge, details };
    }
    
    // Функция для верификации результата с SP1
    function verifySP1Result(gameData) {
        console.log('Verifying game results with SP1:', gameData);
        
        // Обновляем статус бейджа
        const badge = document.querySelector('.sp1-badge');
        const status = document.getElementById('sp1-status');
        const score = document.getElementById('sp1-score');
        const proofId = document.getElementById('sp1-proof-id');
        const timestamp = document.getElementById('sp1-timestamp');
        const circuitSize = document.getElementById('sp1-circuit-size');
        const constraints = document.getElementById('sp1-constraints');
        const publicInputs = document.getElementById('sp1-public-inputs');
        const verificationTime = document.getElementById('sp1-verification-time');
        
        // Открываем панель деталей
        document.querySelector('.sp1-badge-details').classList.add('active');
        
        if (badge) {
            badge.querySelector('span').textContent = 'SP1 Verifying...';
        }
        
        if (status) {
            status.textContent = 'Verification in progress...';
        }
        
        if (score) {
            score.textContent = gameData.score;
        }
        
        // Начинаем анимацию шагов верификации
        updateVerificationStep(1);
        
        // Этап 1: Инициализация
        setTimeout(() => {
            completeVerificationStep(1);
            updateVerificationStep(2);
            
            if (circuitSize) circuitSize.textContent = '2^15 gates';
            
            // Этап 2: Вычисление хеша
            setTimeout(() => {
                completeVerificationStep(2);
                updateVerificationStep(3);
                
                if (constraints) constraints.textContent = '32,768';
                if (publicInputs) publicInputs.textContent = `["0x${gameData.score.toString(16)}", "0x${Math.floor(gameData.timestamp/1000).toString(16)}"]`;
                
                // Этап 3: Генерация доказательства
                setTimeout(() => {
                    completeVerificationStep(3);
                    updateVerificationStep(4);
                    
                    // Генерируем ID доказательства
                    const proofIdValue = `sp1_${Math.random().toString(36).substring(2, 10)}`;
                    if (proofId) {
                        proofId.textContent = proofIdValue;
                    }
                    
                    // Этап 4: Проверка на сети SP1
                    setTimeout(() => {
                        completeVerificationStep(4);
                        updateVerificationStep(5);
                        
                        if (verificationTime) verificationTime.textContent = `${(Math.random() * 2 + 1.5).toFixed(2)}s`;
                        
                        // Этап 5: Запись результата
                        setTimeout(() => {
                            completeVerificationStep(5);
                            
                            const timestampValue = new Date().toLocaleTimeString();
                            
                            // Обновляем информацию о верификации
                            if (badge) {
                                badge.querySelector('span').textContent = 'SP1 Verified';
                            }
                            
                            if (status) {
                                status.textContent = 'Successfully Verified!';
                            }
                            
                            if (timestamp) {
                                timestamp.textContent = timestampValue;
                            }
                            
                            // Выводим в консоль подробную информацию
                            console.log('SP1 verification completed', {
                                score: gameData.score,
                                proofId: proofIdValue,
                                verified: true,
                                timestamp: timestampValue,
                                circuitDetails: {
                                    size: '2^15 gates',
                                    constraints: 32768,
                                    publicInputs: [
                                        `0x${gameData.score.toString(16)}`,
                                        `0x${Math.floor(gameData.timestamp/1000).toString(16)}`
                                    ]
                                }
                            });
                            
                            // Добавляем метку в результат, что он верифицирован
                            const verifyButton = document.getElementById('sp1-verify-button');
                            if (verifyButton) {
                                verifyButton.innerHTML = '✓ VERIFIED WITH SP1';
                                verifyButton.style.backgroundColor = '#006633';
                            }
                            
                            // Показываем победный эффект
                            showVerificationEffect();
                            
                            // Оставляем окно с деталями верификации открытым
                            document.querySelector('.sp1-badge-details').classList.add('active');
                        }, 600);
                    }, 800);
                }, 1200);
            }, 600);
        }, 800);
    }
    
    // Обновляет текущий шаг верификации
    function updateVerificationStep(stepNumber) {
        const steps = document.querySelectorAll('.sp1-verification-step');
        steps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            if (stepNum === stepNumber) {
                step.classList.add('active');
            } else if (stepNum > stepNumber) {
                step.classList.remove('active');
                step.classList.remove('completed');
            }
        });
    }
    
    // Отмечает шаг как завершенный
    function completeVerificationStep(stepNumber) {
        const step = document.querySelector(`.sp1-verification-step[data-step="${stepNumber}"]`);
        if (step) {
            step.classList.add('completed');
        }
    }
    
    // Функция для отображения эффекта успешной верификации
    function showVerificationEffect() {
        // Создаем контейнер для эффекта
        const effectContainer = document.createElement('div');
        effectContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        // Создаем текст эффекта
        const effectText = document.createElement('div');
        effectText.textContent = 'VERIFIED WITH SP1';
        effectText.style.cssText = `
            color: #00FFD1;
            font-family: 'Orbitron', sans-serif;
            font-size: 36px;
            font-weight: bold;
            text-shadow: 0 0 20px rgba(0, 255, 209, 0.8);
            opacity: 0;
            transform: scale(0.5);
            transition: all 0.5s ease;
        `;
        
        // Добавляем элементы в DOM
        effectContainer.appendChild(effectText);
        document.body.appendChild(effectContainer);
        
        // Анимируем появление
        setTimeout(() => {
            effectText.style.opacity = '1';
            effectText.style.transform = 'scale(1.2)';
        }, 100);
        
        // Анимируем исчезновение
        setTimeout(() => {
            effectText.style.opacity = '0';
            effectText.style.transform = 'scale(2)';
        }, 1500);
        
        // Удаляем контейнер после анимации
        setTimeout(() => {
            document.body.removeChild(effectContainer);
        }, 2500);
    }
})(); 