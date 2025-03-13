class Animations {
    static createFallingElements() {
        const container = document.querySelector('.falling-elements');
        if (!container) return;
        
        const shapes = ['✧', '✦', '⊕', '◉', '⚡', '✺'];
        const colors = ['#DA70D6', '#8A2BE2', '#00FFD1', '#E0B0FF'];
        
        for (let i = 0; i < 20; i++) {
            const element = document.createElement('div');
            element.className = 'falling-item';
            element.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            element.style.color = colors[Math.floor(Math.random() * colors.length)];
            element.style.left = `${Math.random() * 100}%`;
            element.style.top = `${Math.random() * 100}%`;
            element.style.fontSize = `${Math.random() * 20 + 10}px`;
            
            // Применяем случайную анимацию
            const animations = ['diagonal-drift', 'bounce', 'circular-path', 'zigzag'];
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            element.style.animation = `${randomAnimation} ${Math.random() * 20 + 10}s infinite linear`;
            
            container.appendChild(element);
        }
    }

    static createBlinkingPixels() {
        const container = document.querySelector('.blinking-elements');
        if (!container) return;
        
        const colors = ['#DA70D6', '#8A2BE2', '#00FFD1', '#E0B0FF'];
        
        for (let i = 0; i < 50; i++) {
            const pixel = document.createElement('div');
            pixel.className = 'succinct-pixel';
            pixel.style.left = `${Math.random() * 100}%`;
            pixel.style.top = `${Math.random() * 100}%`;
            pixel.style.width = `${Math.random() * 4 + 2}px`;
            pixel.style.height = pixel.style.width;
            pixel.style.color = colors[Math.floor(Math.random() * colors.length)];
            pixel.style.animationDuration = `${Math.random() * 5 + 2}s`;
            pixel.style.animation = `blink ${Math.random() * 5 + 2}s infinite`;
            pixel.style.animationDelay = `${Math.random() * 5}s`;
            
            container.appendChild(pixel);
        }
    }

    static createFallingTerminalImages() {
        const terminalContainer = document.querySelector('.terminal-container');
        if (!terminalContainer) return;
        
        const imageNames = ['crab.png', 'dvd.png', 'hat.png', 'meme.png'];
        
        for (let i = 0; i < 8; i++) {
            const img = document.createElement('img');
            const randomImg = imageNames[Math.floor(Math.random() * imageNames.length)];
            img.src = `img/${randomImg}`;
            img.classList.add('falling-image');
            img.style.left = `${Math.random() * 100}%`;
            img.style.top = `-${Math.random() * 50}px`;
            img.style.animationDuration = `${Math.random() * 10 + 8}s`;
            img.style.animationDelay = `${Math.random() * 5}s`;
            terminalContainer.appendChild(img);
        }
    }

    static triggerHitAnimation(target) {
        if (!target) return;
        
        target.style.transform = 'scale(1.2) rotate(10deg)';
        setTimeout(() => {
            target.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    }

    static playHitSound() {
        const hitSounds = [
            new Audio('sound/hit1.mp3'),
            new Audio('sound/hit2.mp3'),
            new Audio('sound/hit3.mp3')
        ];
        
        const randomSound = hitSounds[Math.floor(Math.random() * hitSounds.length)];
        randomSound.volume = 0.5;
        randomSound.play().catch(error => {
            console.warn('Не удалось воспроизвести звук:', error);
        });
    }
}
