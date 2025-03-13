// Константы
const GAME_DURATION = 20; // секунды
const MIN_RESPONSE_TIME = 0.3; // минимальное время между появлением элементов
const MAX_RESPONSE_TIME = 1.1; // максимальное время между появлением элементов
const BONUS_TIME = 1; // бонусное время за правильный клик

class Game {
    constructor() {
        this.score = 0;
        this.timeLeft = GAME_DURATION;
        this.isRunning = false;
        this.activeMembers = new Set();
        this.gameInterval = null;
        this.memberArray = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'];
        
        // Статистика
        this.stats = {
            bestScore: parseInt(localStorage.getItem('bestScore')) || 0,
            responseTimes: [],
            totalClicks: 0,
            successfulClicks: 0
        };
        
        // Привязка методов к контексту
        this.handleMemberClick = this.handleMemberClick.bind(this);
        this.updateGame = this.updateGame.bind(this);
    }

    start() {
        try {
            this.reset();
            this.isRunning = true;
            this.startTimer();
            this.showNextMember();
            UI.hideOverlays();
        } catch (error) {
            console.error('Ошибка при запуске игры:', error);
            UI.showError('Не удалось запустить игру');
        }
    }

    reset() {
        this.score = 0;
        this.timeLeft = GAME_DURATION;
        this.activeMembers.clear();
        this.stats.responseTimes = [];
        this.stats.totalClicks = 0;
        this.stats.successfulClicks = 0;
        
        // Очистка игрового поля
        this.memberArray.forEach(id => {
            const member = document.getElementById(id);
            if (member) {
                member.style.display = 'none';
                member.style.animation = '';
            }
        });
        
        // Сброс UI
        UI.updateScore(0);
        UI.updateTimer(GAME_DURATION);
        UI.updateProgress(100);
    }

    startTimer() {
        this.gameInterval = setInterval(this.updateGame, 1000);
    }

    updateGame() {
        if (!this.isRunning) return;
        
        this.timeLeft--;
        UI.updateTimer(this.timeLeft);
        UI.updateProgress((this.timeLeft / GAME_DURATION) * 100);
        
        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    showNextMember() {
        if (!this.isRunning) return;
        
        const availableMembers = this.memberArray.filter(id => !this.activeMembers.has(id));
        if (availableMembers.length === 0) return;
        
        const randomId = availableMembers[Math.floor(Math.random() * availableMembers.length)];
        const member = document.getElementById(randomId);
        
        if (member) {
            this.activeMembers.add(randomId);
            member.style.display = 'block';
            member.style.animation = 'pulse 0.5s ease-in-out';
            member.setAttribute('data-appeared', Date.now());
            
            // Автоматическое скрытие через случайное время
            setTimeout(() => {
                if (this.activeMembers.has(randomId)) {
                    this.removeMember(randomId);
                }
            }, Math.random() * (MAX_RESPONSE_TIME - MIN_RESPONSE_TIME) * 1000 + MIN_RESPONSE_TIME * 1000);
        }
    }

    handleMemberClick(event) {
        if (!this.isRunning) return;
        
        const memberId = event.target.id;
        if (!this.activeMembers.has(memberId)) return;
        
        this.stats.totalClicks++;
        
        // Расчет времени отклика
        const clickTime = Date.now();
        const responseTime = (clickTime - event.target.getAttribute('data-appeared')) / 1000;
        this.stats.responseTimes.push(responseTime);
        
        // Успешный клик
        this.stats.successfulClicks++;
        this.score++;
        this.timeLeft += BONUS_TIME;
        
        // Обновление UI
        UI.updateScore(this.score);
        UI.updateTimer(this.timeLeft);
        UI.showClickEffect(event.clientX, event.clientY);
        
        // Удаление члена и показ следующего
        this.removeMember(memberId);
        this.showNextMember();
        
        // Обновление статистики
        this.updateStats();
    }

    removeMember(id) {
        const member = document.getElementById(id);
        if (member) {
            member.style.display = 'none';
            member.style.animation = '';
            this.activeMembers.delete(id);
        }
    }

    updateStats() {
        // Обновление лучшего счета
        if (this.score > this.stats.bestScore) {
            this.stats.bestScore = this.score;
            localStorage.setItem('bestScore', this.score);
        }
        
        // Обновление UI статистики
        UI.updateStats({
            bestScore: this.stats.bestScore,
            avgResponse: this.calculateAverageResponseTime(),
            successRate: this.calculateSuccessRate()
        });
    }

    calculateAverageResponseTime() {
        if (this.stats.responseTimes.length === 0) return 0;
        return this.stats.responseTimes.reduce((a, b) => a + b, 0) / this.stats.responseTimes.length;
    }

    calculateSuccessRate() {
        if (this.stats.totalClicks === 0) return 0;
        return (this.stats.successfulClicks / this.stats.totalClicks) * 100;
    }

    endGame() {
        this.isRunning = false;
        clearInterval(this.gameInterval);
        
        // Очистка активных членов
        this.activeMembers.forEach(id => this.removeMember(id));
        
        // Определение результата
        const result = this.determineResult();
        
        // Показ экрана окончания игры
        UI.showGameOver({
            score: this.score,
            stats: this.stats,
            result: result
        });
    }

    determineResult() {
        if (this.score >= 20) {
            return {
                text: 'At this rate, Yinger will hire you as an assistant, DM him bro',
                subText: `Given ${this.score} codes. Great result Prover, you are just a SP1 dream!`,
                gif: 'img/high.gif'
            };
        } else if (this.score > 8) {
            return {
                text: 'Cool, but ETH requires more!',
                subText: `You gave out ${this.score} codes. Try working like a Yinger next time!`,
                gif: 'img/middle.gif'
            };
        } else {
            return {
                text: 'ARE YOU GOING TO PROVE SOMETHING???',
                subText: `Given only ${this.score} codes. You either didn't figure out how to do it, or you fell asleep...`,
                gif: 'img/low.gif'
            };
        }
    }
}
