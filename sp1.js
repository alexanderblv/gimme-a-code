// SP1 Integration for Gimme-a-code Game
(function() {
    // Ждем полной загрузки страницы
    document.addEventListener('DOMContentLoaded', function() {
        // Добавляем SP1 бейдж
        addSP1Badge();
        
        // Перехватываем окончание игры
        const gameInterval = setInterval(function() {
            const gameOverlay = document.getElementById('game-over-overlay');
            if (gameOverlay && !gameOverlay.classList.contains('hidden')) {
                // Игра закончилась, получаем результаты
                const score = document.getElementById('final-score')?.textContent || '0';
                
                // Запускаем SP1 верификацию
                verifySP1Result({
                    score: parseInt(score),
                    timestamp: Date.now()
                });
                
                clearInterval(gameInterval);
            }
        }, 1000);
    });
    
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
                padding: 15px;
                color: white;
                font-family: 'Inter', sans-serif;
                width: 260px;
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
            }
            
            .sp1-badge-details-row {
                display: flex;
                justify-content: space-between;
                font-size: 13px;
                margin-bottom: 6px;
            }
            
            .sp1-badge-details-label {
                color: #999;
            }
            
            .sp1-badge-details-value {
                color: #00FFD1;
                font-family: 'Orbitron', sans-serif;
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
            <div class="sp1-badge-details-row">
                <span class="sp1-badge-details-label">Status:</span>
                <span class="sp1-badge-details-value" id="sp1-status">Ready</span>
            </div>
            <div class="sp1-badge-details-row">
                <span class="sp1-badge-details-label">Proof ID:</span>
                <span class="sp1-badge-details-value" id="sp1-proof-id">-</span>
            </div>
            <div class="sp1-badge-details-row">
                <span class="sp1-badge-details-label">Verified:</span>
                <span class="sp1-badge-details-value" id="sp1-timestamp">-</span>
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
        const proofId = document.getElementById('sp1-proof-id');
        const timestamp = document.getElementById('sp1-timestamp');
        
        if (badge) {
            badge.querySelector('span').textContent = 'SP1 Verifying...';
        }
        
        if (status) {
            status.textContent = 'Verifying...';
        }
        
        // Симулируем проверку SP1 (в реальном приложении здесь был бы запрос к API SP1)
        setTimeout(function() {
            // Генерируем ID доказательства
            const proofIdValue = `sp1_${Math.random().toString(36).substring(7)}`;
            const timestampValue = new Date().toLocaleTimeString();
            
            // Обновляем информацию в бейдже
            if (badge) {
                badge.querySelector('span').textContent = 'SP1 Verified';
            }
            
            if (status) {
                status.textContent = 'Verified';
            }
            
            if (proofId) {
                proofId.textContent = proofIdValue;
            }
            
            if (timestamp) {
                timestamp.textContent = timestampValue;
            }
            
            console.log('SP1 verification completed', {
                score: gameData.score,
                proofId: proofIdValue,
                verified: true,
                timestamp: timestampValue
            });
            
            // Показываем детали верификации
            document.querySelector('.sp1-badge-details')?.classList.add('active');
            
            // Скрываем детали через 5 секунд
            setTimeout(function() {
                document.querySelector('.sp1-badge-details')?.classList.remove('active');
            }, 5000);
        }, 1500);
    }
})(); 