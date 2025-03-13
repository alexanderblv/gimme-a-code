class UI {
    static updateScore(score) {
        const scoreElement = document.querySelector('#score span');
        if (scoreElement) {
            scoreElement.textContent = `Codes: ${score}`;
            // Анимация
            scoreElement.style.transform = 'scale(1.1) rotateX(20deg)';
            setTimeout(() => {
                scoreElement.style.transform = 'scale(1) rotateX(0deg)';
            }, 200);
        }
    }

    static updateTimer(timeLeft) {
        const timerElement = document.querySelector('#timer span');
        if (timerElement) {
            timerElement.textContent = `Time left: ${timeLeft} seconds`;
            
            // Добавляем визуальную интенсивность, когда время на исходе
            const timerContainer = document.getElementById('timer');
            if (timerContainer) {
                if (timeLeft <= 5) {
                    timerContainer.style.animation = 'shake 0.5s infinite';
                } else {
                    timerContainer.style.animation = '';
                }
            }
        }
    }

    static updateProgress(percentage) {
        const progressElement = document.getElementById('progress');
        if (progressElement) {
            progressElement.style.width = `${percentage}%`;
        }
    }

    static updateStats({ bestScore, avgResponse, successRate }) {
        // Обновление статистики в игре
        const bestScoreElement = document.getElementById('best-score-value');
        const avgResponseElement = document.getElementById('avg-response-value');
        const successRateElement = document.getElementById('success-rate-value');
        
        if (bestScoreElement) bestScoreElement.textContent = bestScore;
        if (avgResponseElement) avgResponseElement.textContent = `${avgResponse.toFixed(1)}s`;
        if (successRateElement) successRateElement.textContent = `${Math.round(successRate)}%`;
        
        // Обновление статистики на экране окончания игры
        const finalBestScoreElement = document.getElementById('final-best-score-value');
        const finalAvgResponseElement = document.getElementById('final-avg-response-value');
        const finalSuccessRateElement = document.getElementById('final-success-rate-value');
        
        if (finalBestScoreElement) finalBestScoreElement.textContent = bestScore;
        if (finalAvgResponseElement) finalAvgResponseElement.textContent = `${avgResponse.toFixed(1)}s`;
        if (finalSuccessRateElement) finalSuccessRateElement.textContent = `${Math.round(successRate)}%`;
    }

    static showClickEffect(x, y) {
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

    static hideOverlays() {
        document.getElementById('start-overlay').classList.add('hidden');
        document.getElementById('game-over-overlay').classList.add('hidden');
    }

    static showGameOver({ score, stats, result }) {
        const overlay = document.getElementById('game-over-overlay');
        const resultText = document.getElementById('result-text');
        const resultSubtext = document.getElementById('result-subtext');
        const finalScore = document.getElementById('final-score');
        const resultGif = document.getElementById('result-gif');
        
        if (finalScore) finalScore.textContent = score;
        if (resultText) resultText.textContent = result.text;
        if (resultSubtext) this.typeWriter(resultSubtext, result.subText);
        
        // Настройка GIF
        if (resultGif) {
            resultGif.style.opacity = 0;
            resultGif.src = result.gif;
            resultGif.classList.add('gif-glitch');
            
            setTimeout(() => {
                resultGif.style.transition = 'opacity 1s ease';
                resultGif.style.opacity = 0.5;
            }, 300);
        }
        
        // Показ оверлея
        overlay.classList.remove('hidden');
    }

    static showError(message) {
        // Здесь можно добавить логику отображения ошибок
        console.error(message);
    }

    static typeWriter(element, text, speed = 50) {
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
}
