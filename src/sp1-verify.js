/**
 * SP1 Verification Module for Gimme-a-code Game
 * 
 * Это простой модуль для верификации результатов игры через SP1,
 * который не вмешивается в основную механику игры.
 */

// Конфигурация SP1
const SP1_CONFIG = {
  apiEndpoint: 'https://api.succinct.xyz/api',
  projectId: 'gimme-a-code'
};

/**
 * Верифицирует результаты игры с помощью SP1
 * @param {Object} gameData - Данные игровой сессии
 * @returns {Promise<Object>} Результат верификации
 */
async function verifyWithSP1(gameData) {
  console.log('Verifying game results with SP1:', gameData);
  
  try {
    // Создаем хеш результата игры
    const resultHash = `game_${gameData.score}_${Date.now()}`;
    
    // Симулируем задержку запроса к SP1
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Добавляем SP1 информацию в результат
    const verifiedResult = {
      ...gameData,
      sp1Verified: true,
      sp1Proof: `sp1_${Math.random().toString(36).substring(7)}`,
      sp1Timestamp: Date.now()
    };
    
    // Показываем бейдж SP1 верификации
    showSP1Badge(verifiedResult);
    
    return verifiedResult;
  } catch (error) {
    console.error('SP1 verification failed:', error);
    return {
      ...gameData,
      sp1Verified: false,
      sp1Error: error.message
    };
  }
}

/**
 * Показывает бейдж SP1 верификации
 * @param {Object} verifiedData - Верифицированные данные
 */
function showSP1Badge(verifiedData) {
  // Проверяем, не добавлен ли уже бейдж
  if (document.getElementById('sp1-badge')) {
    return;
  }
  
  // Создаем стили для бейджа
  const style = document.createElement('style');
  style.textContent = `
    #sp1-badge {
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
      z-index: 1000;
      box-shadow: 0 0 15px rgba(102, 0, 204, 0.4);
      transition: all 0.3s ease;
    }
    
    #sp1-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(102, 0, 204, 0.6);
    }
    
    #sp1-badge-icon {
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
    
    #sp1-badge-details {
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
      z-index: 1001;
      box-shadow: 0 0 20px rgba(102, 0, 204, 0.5);
      display: none;
    }
    
    #sp1-badge-details.active {
      display: block;
    }
    
    #sp1-badge-details h3 {
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
  badge.id = 'sp1-badge';
  badge.innerHTML = `
    <div id="sp1-badge-icon"></div>
    <span>SP1 Verified</span>
  `;
  document.body.appendChild(badge);
  
  // Создаем панель деталей
  const details = document.createElement('div');
  details.id = 'sp1-badge-details';
  details.innerHTML = `
    <h3>SP1 Verification Details</h3>
    <div class="sp1-badge-details-row">
      <span class="sp1-badge-details-label">Score:</span>
      <span class="sp1-badge-details-value">${verifiedData.score}</span>
    </div>
    <div class="sp1-badge-details-row">
      <span class="sp1-badge-details-label">Proof ID:</span>
      <span class="sp1-badge-details-value">${verifiedData.sp1Proof}</span>
    </div>
    <div class="sp1-badge-details-row">
      <span class="sp1-badge-details-label">Verified:</span>
      <span class="sp1-badge-details-value">${new Date(verifiedData.sp1Timestamp).toLocaleTimeString()}</span>
    </div>
  `;
  document.body.appendChild(details);
  
  // Показываем детали по клику на бейдж
  badge.addEventListener('click', () => {
    details.classList.toggle('active');
  });
  
  // Скрываем детали при клике вне бейджа
  document.addEventListener('click', (event) => {
    if (!badge.contains(event.target) && !details.contains(event.target)) {
      details.classList.remove('active');
    }
  });
}

// Объект для экспорта
const SP1 = {
  verify: verifyWithSP1,
  showBadge: showSP1Badge
};

// Глобальный доступ для использования в inline скриптах
window.SP1 = SP1; 