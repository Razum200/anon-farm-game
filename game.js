// Игра ANON Farm - логика и интеграция с Telegram

// Звуковая система
class SoundSystem {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.sounds = {};
        
        // Инициализируем AudioContext при первом взаимодействии
        this.initAudioContext();
        this.createSounds();
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('AudioContext не поддерживается');
            this.enabled = false;
        }
    }
    
    // Создаем киберпанк звуки программно
    createSounds() {
        if (!this.enabled) return;
        
        this.sounds = {
            click: this.createClickSound(),
            levelUp: this.createLevelUpSound(),
            upgrade: this.createUpgradeSound(),
            error: this.createErrorSound(),
            plant: this.createPlantSound(),
            harvest: this.createHarvestSound(),
            buy: this.createBuySound(),
            autoFarm: this.createAutoFarmSound(),
            offline: this.createOfflineSound(),
            notification: this.createNotificationSound(),
            navigation: this.createNavigationSound(),
            success: this.createSuccessSound(),
            coin: this.createCoinSound()
        };
    }
    
    createClickSound() {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.type = 'square';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }
    
    createLevelUpSound() {
        return () => {
            if (!this.audioContext) return;
            
            // Создаем последовательность тонов для leveling up
            const frequencies = [440, 554, 659, 880];
            
            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.15);
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime + index * 0.15);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.15 + 0.3);
                
                oscillator.type = 'sawtooth';
                oscillator.start(this.audioContext.currentTime + index * 0.15);
                oscillator.stop(this.audioContext.currentTime + index * 0.15 + 0.3);
            });
        };
    }
    
    createUpgradeSound() {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(1000, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.type = 'triangle';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        };
    }
    
    createErrorSound() {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(150, this.audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.type = 'square';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        };
    }
    
    createPlantSound() {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            oscillator.type = 'sine';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        };
    }
    
    createHarvestSound() {
        return () => {
            if (!this.audioContext) return;
            
            // Создаем аккорд для звука урожая
            const frequencies = [523, 659, 784]; // C5, E5, G5
            
            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
                
                oscillator.type = 'triangle';
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.4);
            });
        };
    }
    
    createBuySound() {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.15);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            oscillator.type = 'sawtooth';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        };
    }
    
    createAutoFarmSound() {
        return () => {
            if (!this.audioContext) return;
            
            // Мягкий пульсирующий звук автофермы
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(330, this.audioContext.currentTime + 0.5);
            oscillator.frequency.exponentialRampToValueAtTime(220, this.audioContext.currentTime + 1);
            
            gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.02, this.audioContext.currentTime + 1);
            
            oscillator.type = 'sine';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 1);
        };
    }
    
    createOfflineSound() {
        return () => {
            if (!this.audioContext) return;
            
            // Звук накопления офлайн токенов
            const frequencies = [261, 329, 392, 523]; // C4, E4, G4, C5
            
            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.1);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime + index * 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.1 + 0.3);
                
                oscillator.type = 'sine';
                oscillator.start(this.audioContext.currentTime + index * 0.1);
                oscillator.stop(this.audioContext.currentTime + index * 0.1 + 0.3);
            });
        };
    }
    
    createNotificationSound() {
        return () => {
            if (!this.audioContext) return;
            
            // Мягкий уведомляющий звук
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1108, this.audioContext.currentTime + 0.1);
            oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);
            
            oscillator.type = 'triangle';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.25);
        };
    }
    
    createNavigationSound() {
        return () => {
            if (!this.audioContext) return;
            
            // Быстрый клик навигации
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0.06, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08);
            
            oscillator.type = 'square';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.08);
        };
    }
    
    createSuccessSound() {
        return () => {
            if (!this.audioContext) return;
            
            // Звук успеха - восходящий аккорд
            const frequencies = [523, 659, 784, 1047]; // C5, E5, G5, C6
            
            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.08);
                gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime + index * 0.08);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.08 + 0.4);
                
                oscillator.type = 'triangle';
                oscillator.start(this.audioContext.currentTime + index * 0.08);
                oscillator.stop(this.audioContext.currentTime + index * 0.08 + 0.4);
            });
        };
    }
    
    createCoinSound() {
        return () => {
            if (!this.audioContext) return;
            
            // Звук получения монеты
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1318, this.audioContext.currentTime); // E6
            oscillator.frequency.exponentialRampToValueAtTime(659, this.audioContext.currentTime + 0.1); // E5
            oscillator.frequency.exponentialRampToValueAtTime(1318, this.audioContext.currentTime + 0.15);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            oscillator.type = 'sine';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        };
    }
    
    play(soundName) {
        if (!this.enabled || !this.sounds[soundName]) return;
        
        // Разблокируем AudioContext если нужно
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        try {
            this.sounds[soundName]();
        } catch (e) {
            console.log('Ошибка воспроизведения звука:', e);
        }
    }
    
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Киберпанк система уведомлений
class CyberNotificationSystem {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 3;
        this.createContainer();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'cyber-notifications-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
            max-width: 300px;
        `;
        document.body.appendChild(this.container);
    }
    
    show(message, type = 'info', duration = 4000) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        // Удаляем старые уведомления если их слишком много
        while (this.notifications.length > this.maxNotifications) {
            const oldNotification = this.notifications.shift();
            if (oldNotification && oldNotification.parentNode) {
                oldNotification.remove();
            }
        }
        
        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Автоудаление
        setTimeout(() => {
            this.remove(notification);
        }, duration);
        
        return notification;
    }
    
    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `cyber-notification cyber-notification-${type}`;
        
        const colors = {
            info: { border: '#00ffff', bg: 'rgba(0,255,255,0.1)', text: '#00ffff' },
            success: { border: '#00ff00', bg: 'rgba(0,255,0,0.1)', text: '#00ff00' },
            error: { border: '#ff0040', bg: 'rgba(255,0,64,0.1)', text: '#ff0040' },
            warning: { border: '#ffff00', bg: 'rgba(255,255,0,0.1)', text: '#ffff00' },
            offline: { border: '#ff00ff', bg: 'rgba(255,0,255,0.1)', text: '#ff00ff' }
        };
        
        const color = colors[type] || colors.info;
        
        notification.style.cssText = `
            background: linear-gradient(135deg, ${color.bg}, rgba(26,26,46,0.9));
            border: 1px solid ${color.border};
            border-radius: 10px;
            padding: 12px 16px;
            margin-bottom: 10px;
            color: ${color.text};
            font-family: 'Courier New', monospace;
            font-size: 13px;
            box-shadow: 
                0 0 20px ${color.border}40,
                inset 0 0 20px ${color.border}10;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease-out;
            pointer-events: auto;
            position: relative;
            overflow: hidden;
            animation: cyberNotificationPulse 2s ease-in-out infinite alternate;
        `;
        
        // Добавляем иконку
        const icons = {
            info: '💻',
            success: '✅', 
            error: '❌',
            warning: '⚠️',
            offline: '💰'
        };
        
        const icon = icons[type] || icons.info;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">${icon}</span>
                <span>${message}</span>
            </div>
        `;
        
        // Добавляем глитч эффект
        const glitchOverlay = document.createElement('div');
        glitchOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent 0%, ${color.border}20 50%, transparent 100%);
            animation: cyberNotificationScan 3s linear infinite;
            pointer-events: none;
        `;
        notification.appendChild(glitchOverlay);
        
        return notification;
    }
    
    remove(notification) {
        if (!notification || !notification.parentNode) return;
        
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }
    
    clear() {
        this.notifications.forEach(notification => this.remove(notification));
        this.notifications = [];
    }
}

// Система печатающегося текста
class TypingSystem {
    constructor() {
        this.typingQueue = [];
        this.isTyping = false;
        this.terminalMessages = [];
        this.maxTerminalMessages = 5;
        this.messageSpacing = 40; // Расстояние между сообщениями
    }
    
    typeText(element, text, speed = 50, callback = null) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;
        
        // Добавляем в очередь
        this.typingQueue.push({
            element,
            text,
            speed,
            callback
        });
        
        // Запускаем если не печатаем
        if (!this.isTyping) {
            this.processQueue();
        }
    }
    
    async processQueue() {
        if (this.typingQueue.length === 0) {
            this.isTyping = false;
            return;
        }
        
        this.isTyping = true;
        const { element, text, speed, callback } = this.typingQueue.shift();
        
        // Очищаем элемент
        element.textContent = '';
        element.classList.add('typing-text');
        
        // Печатаем по символу
        for (let i = 0; i <= text.length; i++) {
            element.textContent = text.slice(0, i);
            await this.delay(speed);
        }
        
        // Убираем курсор через секунду
        setTimeout(() => {
            element.classList.remove('typing-text');
        }, 1000);
        
        // Вызываем колбэк
        if (callback) callback();
        
        // Продолжаем очередь
        this.processQueue();
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    createTerminalMessage(text, container = document.body) {
        const terminalDiv = document.createElement('div');
        terminalDiv.className = 'terminal-text';
        terminalDiv.style.position = 'fixed';
        terminalDiv.style.left = '20px';
        terminalDiv.style.zIndex = '1002';
        terminalDiv.style.maxWidth = '300px';
        terminalDiv.style.opacity = '0';
        terminalDiv.style.transform = 'translateY(20px)';
        terminalDiv.style.transition = 'all 0.3s ease-out';
        
        // Добавляем сообщение в массив
        this.terminalMessages.push(terminalDiv);
        
        // Удаляем старые сообщения если их слишком много
        while (this.terminalMessages.length > this.maxTerminalMessages) {
            const oldMessage = this.terminalMessages.shift();
            if (oldMessage && oldMessage.parentNode) {
                oldMessage.remove();
            }
        }
        
        // Позиционируем сообщения снизу вверх
        this.updateTerminalPositions();
        
        container.appendChild(terminalDiv);
        
        // Анимация появления
        setTimeout(() => {
            terminalDiv.style.opacity = '1';
            terminalDiv.style.transform = 'translateY(0)';
        }, 10);
        
        this.typeText(terminalDiv, text, 30, () => {
            setTimeout(() => {
                this.removeTerminalMessage(terminalDiv);
            }, 3000);
        });
    }
    
    updateTerminalPositions() {
        const startTop = 20; // Начинаем сверху экрана
        
        this.terminalMessages.forEach((message, index) => {
            const top = startTop + index * this.messageSpacing;
            message.style.top = `${top}px`;
        });
    }
    
    removeTerminalMessage(message) {
        if (!message || !message.parentNode) return;
        
        message.style.opacity = '0';
        message.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
            const index = this.terminalMessages.indexOf(message);
            if (index > -1) {
                this.terminalMessages.splice(index, 1);
            }
            this.updateTerminalPositions();
        }, 300);
    }
    
    addMatrixEffect(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            element.classList.add('matrix-text');
        }
    }
}

// Система частиц
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resizeCanvas();
        
        // Обновляем размер canvas при изменении окна
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Запускаем анимацию
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createClickParticles(x, y, amount) {
        const colors = ['#00ffff', '#ff00ff', '#ffff00'];
        
        for (let i = 0; i < 3; i++) { // Уменьшено с 8 до 3 частиц для производительности
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 5 - 2,
                life: 1,
                decay: 0.02,
                size: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                glow: 20
            });
        }
    }
    
    createLevelUpParticles() {
        const colors = ['#ff00ff', '#00ffff', '#ffff00'];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < 10; i++) { // Уменьшено с 30 до 10 частиц для производительности
            const angle = (i / 30) * Math.PI * 2;
            this.particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * 6,
                vy: Math.sin(angle) * 6,
                life: 1,
                decay: 0.015,
                size: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                glow: 30
            });
        }
    }
    
    createUpgradeParticles(x, y) {
        const colors = ['#ff00ff', '#00ffff'];
        
        for (let i = 0; i < 5; i++) { // Уменьшено с 15 до 5 частиц для производительности
            this.particles.push({
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 30,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 4 - 1,
                life: 1,
                decay: 0.025,
                size: Math.random() * 5 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                glow: 25
            });
        }
    }
    
    createGardenParticles(x, y, type = 'plant') {
        let colors, count;
        
        switch(type) {
            case 'plant':
                colors = ['#00ff00', '#ffff00'];
                count = 3; // Уменьшено с 10 до 3
                break;
            case 'harvest':
                colors = ['#ff00ff', '#00ffff', '#ffff00'];
                count = 7; // Уменьшено с 20 до 7
                break;
            case 'buy':
                colors = ['#00ff00', '#ffffff'];
                count = 4; // Уменьшено с 12 до 4
                break;
            default:
                colors = ['#00ffff'];
                count = 3; // Уменьшено с 8 до 3
        }
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 6 - 2,
                life: 1,
                decay: 0.02,
                size: Math.random() * 6 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                glow: 30
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Обновляем позицию
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // Гравитация
            
            // Обновляем жизнь
            particle.life -= particle.decay;
            
            // Удаляем мертвые частицы
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            // Рисуем частицу
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.shadowBlur = particle.glow;
            this.ctx.shadowColor = particle.color;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

class AnonFarm {
    constructor() {
        // Базовые параметры игры
        this.gameData = {
            tokens: 0,
            level: 1,
            clickPower: 1,
            autoFarmPower: 0,
            multiplier: 1,
            totalClicks: 0,
            upgrades: {
                clickUpgrades: 0,
                autoUpgrades: 0,
                multiplierUpgrades: 0
            },
            lastSave: Date.now(),
            // Данные огорода
            garden: {
                seeds: {
                    carrot: 0,
                    potato: 0, 
                    tomato: 0
                },
                plots: [
                    null, null, null,  // Строка 1
                    null, null, null,  // Строка 2
                    null, null, null   // Строка 3
                ] // null = пустая, объект = {type: 'carrot', plantTime: timestamp, stage: 'planted/growing/ready'}
            }
        };

        // Стоимость улучшений
        this.upgradeCosts = {
            click: 10,
            auto: 50,
            multiplier: 200
        };

        // Система семян для огорода
        this.seedsConfig = {
            carrot: {
                name: 'Морковь',
                icon: '🥕',
                price: 10,           // Цена покупки за $ANON
                growthTime: 2 * 60,  // Время роста в секундах (2 минуты)
                reward: 20,          // Награда за урожай
                stages: {
                    planted: '🌱',   // Только посажено
                    growing: '🌿',   // Растет
                    ready: '🥕'      // Готово к сбору
                }
            },
            potato: {
                name: 'Картошка',
                icon: '🥔',
                price: 25,
                growthTime: 5 * 60,  // 5 минут
                reward: 60,
                stages: {
                    planted: '🌱',
                    growing: '🌿',
                    ready: '🥔'
                }
            },
            tomato: {
                name: 'Помидор',
                icon: '🍅',
                price: 50,
                growthTime: 10 * 60, // 10 минут
                reward: 150,
                stages: {
                    planted: '🌱',
                    growing: '🌿',
                    ready: '🍅'
                }
            }
        };

        // Инициализация Telegram Web App
        this.initTelegram();
        
        // Загрузка данных
        this.loadGame();
        
        // Запуск игры
        this.initGame();
        
        // Инициализируем систему частиц
        this.particleSystem = new ParticleSystem();
        
        // Инициализируем звуковую систему
        this.soundSystem = new SoundSystem();
        
        // Инициализируем систему печатающегося текста
        this.typingSystem = new TypingSystem();
        
        // Инициализируем киберпанк систему уведомлений
        this.cyberNotifications = new CyberNotificationSystem();
    }

    initTelegram() {
        // Проверяем, запущено ли в Telegram
        if (window.Telegram && window.Telegram.WebApp) {
            this.tg = window.Telegram.WebApp;
            this.tg.ready();
            
            // Расширяем приложение на весь экран
            this.tg.expand();
            
            // Настраиваем цвета интерфейса под тему Telegram
            this.tg.setHeaderColor('#667eea');
            this.tg.setBackgroundColor('#667eea');
            
            console.log('Telegram Web App инициализировано');
            console.log('Пользователь:', this.tg.initDataUnsafe?.user);
        } else {
            console.log('Запущено вне Telegram');
        }
    }

    loadGame() {
        try {
            // Пытаемся загрузить данные из Telegram Cloud Storage
            if (this.tg && this.tg.CloudStorage) {
                this.tg.CloudStorage.getItem('anonFarmData', (err, data) => {
                    if (!err && data) {
                        try {
                            const savedData = JSON.parse(data);
                            this.gameData = { ...this.gameData, ...savedData };
                            this.calculateOfflineProgress();
                            this.updateDisplay();
                            console.log('Данные загружены из Telegram Cloud');
                        } catch (e) {
                            console.error('Ошибка парсинга сохраненных данных:', e);
                        }
                    } else {
                        console.log('Сохраненных данных не найдено');
                    }
                });
            } else {
                // Fallback на localStorage если нет Telegram
                const savedData = localStorage.getItem('anonFarmData');
                if (savedData) {
                    this.gameData = { ...this.gameData, ...JSON.parse(savedData) };
                    this.calculateOfflineProgress();
                    console.log('Данные загружены из localStorage');
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
        
        this.updateDisplay();
    }

    saveGame() {
        try {
            this.gameData.lastSave = Date.now();
            const dataToSave = JSON.stringify(this.gameData);
            
            // Сохраняем в Telegram Cloud Storage
            if (this.tg && this.tg.CloudStorage) {
                this.tg.CloudStorage.setItem('anonFarmData', dataToSave, (err) => {
                    if (err) {
                        console.error('Ошибка сохранения в Telegram Cloud:', err);
                        // Fallback на localStorage
                        localStorage.setItem('anonFarmData', dataToSave);
                    } else {
                        console.log('Игра сохранена в Telegram Cloud');
                    }
                });
            } else {
                // Fallback на localStorage
                localStorage.setItem('anonFarmData', dataToSave);
                console.log('Игра сохранена в localStorage');
            }
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        }
    }

    calculateOfflineProgress() {
        // Рассчитываем сколько токенов заработано за время отсутствия
        const timeDiff = Date.now() - this.gameData.lastSave;
        const secondsOffline = Math.floor(timeDiff / 1000);
        
        if (secondsOffline > 0 && this.gameData.autoFarmPower > 0) {
            const offlineEarnings = secondsOffline * this.gameData.autoFarmPower * this.gameData.multiplier;
            this.gameData.tokens += offlineEarnings;
            
            // Показываем уведомление об офлайн заработке
            if (offlineEarnings > 0) {
                this.showNotification(`Добыто офлайн: ${this.formatNumber(offlineEarnings)} $ANON!`);
                // Дополнительный звук автофермы для атмосферы
                setTimeout(() => this.soundSystem.play('autoFarm'), 500);
            }
        }
    }

    initGame() {
        // Обновляем отображение
        this.updateDisplay();
        
        // Привязываем события
        const farmButton = document.getElementById('farmButton');
        farmButton.addEventListener('click', (e) => this.clickFarm(e));
        
        // Защита от double-tap zoom на мобильных
        farmButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.clickFarm(e);
        }, { passive: false });
        document.getElementById('upgradeClick').addEventListener('click', () => this.buyUpgrade('click'));
        document.getElementById('upgradeAuto').addEventListener('click', () => this.buyUpgrade('auto'));
        document.getElementById('upgradeMultiplier').addEventListener('click', () => this.buyUpgrade('multiplier'));
        
        // Инициализируем кнопку переключателя тряски
        this.initShakeToggle();
        
        // Инициализируем тряску телефона для фермы
        this.initShakeDetection(false);
        

        
        // Обработчики навигации между страницами
        this.initPageNavigation();
        
        // Инициализируем огород
        this.initGarden();
        
        // Запускаем автоферму
        this.startAutoFarm();
        
        // Автосохранение каждые 30 секунд
        setInterval(() => {
            this.saveGame();
            this.saveToLocalLeaderboard();
        }, 30000);
        
        // Обновление роста растений каждые 5 секунд
        setInterval(() => {
            this.updatePlantGrowth();
        }, 5000);
        
        // Отправка статистики каждые 2 минуты
        setInterval(() => {
            console.log('⏱️ Таймер 2 минуты: отправляем статистику...');
            this.sendPlayerStats();
            this.submitStatsToAPI();
        }, 120000);
        
        // Отправляем первую статистику через 10 секунд после запуска
        setTimeout(() => {
            console.log('⏱️ Таймер 10 секунд: первая отправка статистики...');
            this.sendPlayerStats();
            this.submitStatsToAPI();
        }, 10000);

        // Пинг API каждые 5 минут чтобы не засыпал
        setInterval(() => {
            console.log('🏓 Пинг API чтобы не засыпал...');
            this.pingAPI();
        }, 300000); // 5 минут
        
        console.log('Игра ANON Farm запущена!');
        
        // Приветственное сообщение с эффектом печатания
        setTimeout(() => {
            this.typingSystem.createTerminalMessage('> INITIALIZING ANON FARM PROTOCOL...');
            setTimeout(() => {
                this.typingSystem.createTerminalMessage('> CONNECTION ESTABLISHED');
                setTimeout(() => {
                    this.typingSystem.createTerminalMessage('> CYBER GARDEN MODULE LOADED');
                }, 1500);
            }, 2000);
        }, 1000);
    }

    // Эффект для тряски телефона
    showShakeEffect(amount) {
        const effect = document.createElement('div');
        effect.className = 'shake-effect';
        effect.textContent = `+${this.formatNumber(amount)} $ANON`;
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #00ff00;
            font-size: 2em;
            font-weight: bold;
            text-shadow: 0 0 20px #00ff00;
            z-index: 10000;
            pointer-events: none;
            animation: shakeEffectAnim 1.5s ease-out forwards;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 1500);
    }

    // Улучшенный киберпанк текст тряски с детальной информацией
    showShakeText(multiplier = 1, speed = 0, intensity = 0) {
        const texts = ['SHAKE', 'shake', 'ТРЯСИ', 'SHAKE!', 'shake!', 'ТРЯСИ!', 'МОЩЬ!', 'СИЛА!', 'БУМ!'];
        const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0080', '#0080ff'];
        
        // Добавляем текст с множителем для сильной тряски
        if (multiplier >= 5) {
            texts.push(`x${multiplier}`, `POWER!`, `BOOST!`, `MEGA!`, `ULTRA!`);
        } else if (multiplier >= 3) {
            texts.push(`x${multiplier}`, `POWER!`, `BOOST!`);
        }
        
        // Добавляем специальные тексты для очень сильной тряски
        if (multiplier >= 8) {
            texts.push(`LEGENDARY!`, `EPIC!`, `MAXIMUM!`, `ULTIMATE!`, `GODLIKE!`);
        } else if (multiplier >= 6) {
            texts.push(`POWER!`, `BOOST!`, `MEGA!`, `ULTRA!`, `SUPER!`);
        }
        
        // Восстанавливаем количество текстов для сильной тряски
        const count = multiplier >= 5 ? Math.floor(Math.random() * 4) + 3 : Math.floor(Math.random() * 2) + 2;
        
        for (let i = 0; i < count; i++) {
            const text = texts[Math.floor(Math.random() * texts.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            const shakeText = document.createElement('div');
            shakeText.className = 'shake-text';
            shakeText.textContent = text;
            
            // Случайная позиция на экране с учетом силы тряски
            const spread = Math.min(multiplier * 50, 300); // Больше разброс для сильной тряски
            const x = Math.random() * (window.innerWidth - 200) + 100 + (Math.random() - 0.5) * spread;
            const y = Math.random() * (window.innerHeight - 100) + 50 + (Math.random() - 0.5) * spread;
            
            // Восстанавливаем крупные тексты для сильной тряски
            const baseSize = 20;
            const sizeMultiplier = 1 + (multiplier - 1) * 0.5; // Больше увеличение для сильной тряски
            const fontSize = (Math.random() * 30 + baseSize) * sizeMultiplier;
            
            // Восстанавливаем яркое свечение для сильной тряски
            const glowIntensity = Math.min(multiplier * 6, 35);
            
            shakeText.style.cssText = `
                position: fixed;
                top: ${y}px;
                left: ${x}px;
                color: ${color};
                font-size: ${fontSize}px;
                font-weight: bold;
                font-family: 'Courier New', monospace;
                text-shadow: 0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity * 2}px ${color};
                z-index: 9999;
                pointer-events: none;
                opacity: 0;
                transform: scale(0.5) rotate(${Math.random() * 20 - 10}deg);
                animation: shakeTextAnim 2s ease-out forwards;
            `;
            
            document.body.appendChild(shakeText);
            
            setTimeout(() => {
                if (shakeText.parentNode) {
                    shakeText.remove();
                }
            }, 2000);
        }
        
        // Убираем большие таблички - они перекрывают экран
        // if (multiplier >= 6) {
        //     this.showShakeInfo(speed, intensity, multiplier);
        // }
    }

    // Показ детальной информации о силе тряски (отключено - перекрывает экран)
    // showShakeInfo(speed, intensity, multiplier) {
    //     const infoDiv = document.createElement('div');
    //     infoDiv.className = 'shake-info';
    //     
    //     // Определяем уровень силы тряски
    //     let powerLevel = 'Обычная';
    //     let powerColor = '#00ffff';
    //     
    //     if (multiplier >= 9) {
    //         powerLevel = 'ЛЕГЕНДАРНАЯ';
    //         powerColor = '#ff00ff';
    //     } else if (multiplier >= 7) {
    //         powerLevel = 'ЭПИЧЕСКАЯ';
    //         powerColor = '#ffff00';
    //     } else if (multiplier >= 5) {
    //         powerLevel = 'МОЩНАЯ';
    //         powerColor = '#00ff00';
    //     }
    //     
    //     infoDiv.innerHTML = `
    //         <div class="shake-info-content">
    //             <div class="power-level" style="color: ${powerColor};">${powerLevel}</div>
    //             <div class="shake-stats">
    //             <div>Сила: ${Math.round(speed)}</div>
    //             <div>Интенсивность: ${Math.round(intensity)}</div>
    //             <div>Множитель: x${multiplier}</div>
    //         </div>
    //     </div>
    //     `;
    //     
    //     infoDiv.style.cssText = `
    //         position: fixed;
    //         top: 50%;
    //         left: 50%;
    //         transform: translate(-50%, -50%);
    //         background: linear-gradient(135deg, rgba(0,0,0,0.9), rgba(26,26,46,0.95));
    //         border: 2px solid ${powerColor};
    //         border-radius: 15px;
    //         padding: 20px;
    //         color: white;
    //         font-family: 'Courier New', monospace;
    //         font-size: 14px;
    //         text-align: center;
    //         z-index: 10001;
    //         pointer-events: none;
    //         opacity: 0;
    //         box-shadow: 0 0 30px ${powerColor}40;
    //         animation: shakeInfoAnim 3s ease-out forwards;
    //     `;
    //     
    //     document.body.appendChild(infoDiv);
    //     
    //     // Удаляем через 3 секунды
    //     setTimeout(() => {
    //         if (infoDiv.parentNode) {
    //             infoDiv.remove();
    //         }
    //     }, 3000);
    // }

    // Инициализация кнопки переключателя тряски
    initShakeToggle() {
        // Создаем кнопку переключателя
        const shakeToggle = document.createElement('button');
        shakeToggle.id = 'shakeToggle';
        shakeToggle.className = 'shake-toggle-button';
        shakeToggle.innerHTML = `
            <span class="shake-icon">📱</span>
            <span class="shake-text">SHAKE</span>
        `;
        
        // Создаем кнопку настроек тряски
        const shakeSettingsBtn = document.createElement('button');
        shakeSettingsBtn.id = 'shakeSettingsBtn';
        shakeSettingsBtn.className = 'shake-settings-button';
        shakeSettingsBtn.innerHTML = `
            <span class="settings-icon">🔧</span>
        `;
        shakeSettingsBtn.title = 'Запросить разрешение на тряску';
        
        // Добавляем кнопки после кнопки фермы
        const farmButton = document.getElementById('farmButton');
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'shake-buttons-container';
        buttonContainer.appendChild(shakeToggle);
        buttonContainer.appendChild(shakeSettingsBtn);
        farmButton.parentNode.insertBefore(buttonContainer, farmButton.nextSibling);
        
        // Обновляем состояние кнопки
        this.updateShakeToggleState();
        
        // Обработчик клика для основной кнопки SHAKE
        shakeToggle.addEventListener('click', () => {
            const currentState = localStorage.getItem('shakeEnabled') !== 'false';
            const newState = !currentState;
            
            console.log('🔧 SHAKE кнопка нажата:', {
                currentState,
                newState,
                localStorage: localStorage.getItem('shakeEnabled'),
                savedPermission: localStorage.getItem('shakePermission')
            });
            
            localStorage.setItem('shakeEnabled', newState.toString());
            this.updateShakeToggleState();
            
            if (newState) {
                this.showNotification('📱 Тряска телефона включена!', 'success');
                console.log('🔧 Включаем тряску, вызываем initShakeDetection(true)');
                // Переинициализируем детекцию тряски с возможностью запроса разрешения
                this.initShakeDetection(true);
            } else {
                this.showNotification('📱 Тряска телефона отключена!', 'info');
                console.log('🔧 Отключаем тряску, удаляем event listener');
                // Удаляем слушатель событий тряски при отключении
                window.removeEventListener('devicemotion', this.handleMotion);
            }
        });
        
        // Обработчик клика для кнопки настроек тряски
        shakeSettingsBtn.addEventListener('click', () => {
            console.log('🔧 Кнопка настроек тряски нажата - запрашиваем разрешение');
            
            // Проверяем, поддерживается ли DeviceMotion
            if (!window.DeviceMotionEvent) {
                this.showNotification('📱 Ваше устройство не поддерживает тряску телефона', 'error');
                return;
            }
            
            // Проверяем, нужны ли разрешения
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                this.showNotification('🔧 Запрашиваем разрешение на тряску...', 'info');
                // Принудительно запрашиваем разрешение независимо от состояния
                this.initShakeDetection(true);
            } else {
                // Android и другие устройства - работают сразу
                this.showNotification('📱 Тряска телефона активирована!', 'success');
                this.initShakeDetection(true);
            }
        });
    }
    
    // Обновление состояния кнопки переключателя
    updateShakeToggleState() {
        const shakeToggle = document.getElementById('shakeToggle');
        if (!shakeToggle) return;
        
        const isEnabled = localStorage.getItem('shakeEnabled') !== 'false';
        
        console.log('🔧 Обновление состояния SHAKE кнопки:', {
            isEnabled,
            localStorage: localStorage.getItem('shakeEnabled'),
            savedPermission: localStorage.getItem('shakePermission')
        });
        
        if (isEnabled) {
            shakeToggle.classList.add('active');
            shakeToggle.classList.remove('disabled');
        } else {
            shakeToggle.classList.remove('active');
            shakeToggle.classList.add('disabled');
        }
    }

    // Показ инструкции для настройки разрешений на iPhone
    showIPhonePermissionInstructions() {
        // Проверяем, это iPhone или iPad
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (isIOS) {
            setTimeout(() => {
                this.showNotification('📱 Для iPhone: Настройки → Конфиденциальность → Движение и фитнес → Включить для браузера', 'info');
            }, 2000);
            
            // Показываем подробную инструкцию
            this.showDetailedIPhoneInstructions();
        }
    }
    
    // Показ подробной инструкции для iPhone
    showDetailedIPhoneInstructions() {
        const instructions = document.createElement('div');
        instructions.className = 'iphone-instructions';
        instructions.innerHTML = `
            <h4>📱 Настройка тряски на iPhone</h4>
            <ol>
                <li>Откройте <strong>Настройки</strong></li>
                <li>Найдите <strong>Конфиденциальность</strong></li>
                <li>Выберите <strong>Движение и фитнес</strong></li>
                <li>Найдите ваш браузер (Safari/Chrome)</li>
                <li>Включите переключатель</li>
                <li>Вернитесь в игру и нажмите 🔧</li>
            </ol>
            <button onclick="this.parentElement.remove()" style="background: rgba(255,0,255,0.2); border: 1px solid #ff00ff; color: #ff00ff; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Понятно</button>
        `;
        
        // Добавляем инструкцию на страницу
        document.body.appendChild(instructions);
        
        // Удаляем через 10 секунд
        setTimeout(() => {
            if (instructions.parentNode) {
                instructions.remove();
            }
        }, 10000);
    }

    // Инициализация детекции тряски телефона
    initShakeDetection(forceRequest = false) {
        console.log('🔧 initShakeDetection вызвана:', {
            forceRequest,
            savedPermission: localStorage.getItem('shakePermission'),
            shakeEnabled: localStorage.getItem('shakeEnabled')
        });
        
        if (!window.DeviceMotionEvent) {
            console.log('📱 DeviceMotion не поддерживается на этом устройстве');
            return;
        }

        let lastUpdate = 0;
        let lastX = 0, lastY = 0, lastZ = 0;
        const threshold = 400; // Увеличил порог для экстремально нечувствительной тряски
        const cooldown = 120; // Увеличил задержку для более редких срабатываний

        this.handleMotion = (event) => {
            const current = event.accelerationIncludingGravity;
            if (!current) return;

            const currentTime = new Date().getTime();
            if ((currentTime - lastUpdate) < cooldown) return;

            const diffTime = currentTime - lastUpdate;
            lastUpdate = currentTime;

            // Улучшенный расчет силы тряски - используем более точную формулу
            const deltaX = Math.abs(current.x - lastX);
            const deltaY = Math.abs(current.y - lastY);
            const deltaZ = Math.abs(current.z - lastZ);
            
            // Рассчитываем общую силу тряски с учетом всех осей
            const totalDelta = deltaX + deltaY + deltaZ;
            const speed = (totalDelta / diffTime) * 10000;
            
            // Дополнительный расчет интенсивности тряски
            const intensity = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ) / diffTime * 10000;

            if (speed > threshold) {
                console.log('📱 Тряска телефона обнаружена! Фермим ANON!');
                
                // Улучшенный расчет множителя на основе силы тряски
                // Используем логарифмическую шкалу для более плавного роста
                const baseMultiplier = Math.log(speed / threshold + 1) / Math.log(2);
                const intensityBonus = Math.min(intensity / 50, 2); // Бонус за интенсивность до x2
                const shakeMultiplier = Math.min(Math.floor(baseMultiplier + intensityBonus), 10); // Максимум x10
                
                const baseEarnings = this.gameData.clickPower * this.gameData.multiplier;
                const shakeEarnings = baseEarnings * shakeMultiplier;
                
                console.log('📱 Улучшенная сила тряски:', {
                    speed: Math.round(speed),
                    intensity: Math.round(intensity),
                    threshold,
                    baseMultiplier: Math.round(baseMultiplier * 100) / 100,
                    intensityBonus: Math.round(intensityBonus * 100) / 100,
                    finalMultiplier: shakeMultiplier,
                    earnings: shakeEarnings
                });
                
                // Создаем виртуальное событие для клика с информацией о тряске
                const virtualEvent = {
                    target: document.getElementById('farmButton'),
                    preventDefault: () => {},
                    type: 'shake',
                    shakeData: {
                        speed: speed,
                        multiplier: shakeMultiplier,
                        earnings: shakeEarnings
                    }
                };
                
                this.clickFarm(virtualEvent);
                
                // Показываем улучшенный киберпанк эффект тряски с информацией о силе
                this.showShakeText(shakeMultiplier, speed, intensity);
                
                // Улучшенная вибрация в Telegram (сила зависит от интенсивности тряски)
                if (this.tg && this.tg.HapticFeedback) {
                    let impactStyle;
                    if (shakeMultiplier >= 7) {
                        impactStyle = 'heavy';
                        // Двойная вибрация для очень сильной тряски
                        setTimeout(() => this.tg.HapticFeedback.impactOccurred('heavy'), 100);
                    } else if (shakeMultiplier >= 4) {
                        impactStyle = 'heavy';
                    } else if (shakeMultiplier >= 2) {
                        impactStyle = 'medium';
                    } else {
                        impactStyle = 'light';
                    }
                    this.tg.HapticFeedback.impactOccurred(impactStyle);
                }
            }

            lastX = current.x;
            lastY = current.y;
            lastZ = current.z;
        };

        // Проверяем сохраненное разрешение и настройку
        const savedPermission = localStorage.getItem('shakePermission');
        const shakeEnabled = localStorage.getItem('shakeEnabled') !== 'false'; // По умолчанию включено
        
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            // iOS 13+ требует разрешения
            if (savedPermission === 'granted' && shakeEnabled) {
                // Разрешение уже было дано и тряска включена, активируем сразу
                window.addEventListener('devicemotion', this.handleMotion, false);
                console.log('📱 Разрешение на тряску уже получено!');
            } else if (shakeEnabled) {
                // Запрашиваем разрешение
                const requestPermission = () => {
                    DeviceMotionEvent.requestPermission()
                        .then(permissionState => {
                            if (permissionState === 'granted') {
                                window.addEventListener('devicemotion', this.handleMotion, false);
                                localStorage.setItem('shakePermission', 'granted');
                                console.log('📱 Разрешение на тряску получено!');
                                this.showNotification('📱 Тряска телефона активирована!', 'success');
                            } else {
                                localStorage.setItem('shakePermission', 'denied');
                                console.log('📱 Разрешение на тряску отклонено');
                                this.showNotification('📱 Разрешение отклонено. Нажмите SHAKE еще раз для повторного запроса.', 'info');
                                
                                // Показываем инструкцию для iPhone
                                this.showIPhonePermissionInstructions();
                            }
                        })
                        .catch(console.error);
                };

                // Если принудительный запрос - всегда запрашиваем
                if (forceRequest) {
                    console.log('🔧 Принудительный запрос разрешения тряски');
                    requestPermission();
                } else if (savedPermission !== 'denied') {
                    // Если не было отказа - запрашиваем в первый раз
                    console.log('🔧 Первый запрос разрешения тряски');
                    requestPermission();
                } else {
                    // Если разрешение было отклонено, показываем сообщение
                    console.log('🔧 Разрешение было отклонено, показываем подсказку');
                    this.showNotification('📱 Нажмите SHAKE еще раз для запроса разрешения', 'info');
                    
                    // Показываем инструкцию для iPhone
                    this.showIPhonePermissionInstructions();
                }
            }
        } else if (shakeEnabled) {
            // Android и другие устройства - работают сразу
            window.addEventListener('devicemotion', this.handleMotion, false);
            console.log('📱 Детекция тряски активирована!');
        }
    }

    clickFarm(event) {
        // Усиливаем глитч-эффект при клике
        this.enhanceGlitchEffect();
        
        // Определяем заработок в зависимости от типа события
        let earnings;
        if (event.type === 'shake' && event.shakeData) {
            // Для тряски используем рассчитанный заработок
            earnings = event.shakeData.earnings;
        } else {
            // Для обычного клика используем базовый заработок
            earnings = this.gameData.clickPower * this.gameData.multiplier;
        }
        
        const oldLevel = this.gameData.level;
        this.gameData.tokens += earnings;
        this.gameData.totalClicks += 1;
        
        // Обновляем уровень
        this.updateLevel();
        
        // Проверяем повышение уровня
        if (this.gameData.level > oldLevel) {
            this.showLevelUpEffect();
            this.particleSystem.createLevelUpParticles();
        }
        
        // Создаем эффект частиц при клике
        let x, y;
        if (event.type === 'shake') {
            // Для тряски телефона - частицы в центре экрана
            x = window.innerWidth / 2;
            y = window.innerHeight / 2;
            
            // Создаем больше частиц для сильной тряски (уменьшено в 3 раза для производительности)
            const shakeData = event.shakeData;
            const particleCount = Math.min(shakeData.multiplier * 1, 10); // До 10 частиц для очень сильной тряски
            
            // Создаем множественные взрывы частиц для сильной тряски
            for (let i = 0; i < particleCount; i++) {
                setTimeout(() => {
                    const offsetX = (Math.random() - 0.5) * 100;
                    const offsetY = (Math.random() - 0.5) * 100;
                    this.particleSystem.createClickParticles(x + offsetX, y + offsetY, earnings);
                }, i * 50); // Задержка между взрывами
            }
        } else {
            // Для обычного клика - частицы на кнопке
            const rect = event.target.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
            this.particleSystem.createClickParticles(x, y, earnings);
        }
        
        // Показываем анимацию
        if (event.type !== 'shake') {
            this.showClickEffect(event, earnings);
        } else {
            // Для тряски показываем эффект в центре экрана
            this.showShakeEffect(earnings);
        }
        
        // Обновляем отображение
        this.updateDisplay();
        
        // Сохраняем в локальный топ каждые 10 кликов для производительности
        if (this.gameData.tokens % 10 === 0) {
            this.saveToLocalLeaderboard();
        }
        
        // Звуковые эффекты
        this.soundSystem.play('click');
        this.soundSystem.play('coin');
        
        // Вибрация в Telegram (только для обычных кликов, для тряски уже обработано)
        if (event.type !== 'shake' && this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('light');
        }
    }

    buyUpgrade(type) {
        const cost = this.getUpgradeCost(type);
        
        if (this.gameData.tokens >= cost) {
            this.gameData.tokens -= cost;
            
            switch (type) {
                case 'click':
                    this.gameData.clickPower += 1;
                    this.gameData.upgrades.clickUpgrades++;
                    break;
                case 'auto':
                    this.gameData.autoFarmPower += 1;
                    this.gameData.upgrades.autoUpgrades++;
                    break;
                case 'multiplier':
                    this.gameData.multiplier += 1;
                    this.gameData.upgrades.multiplierUpgrades++;
                    break;
            }
            
            this.updateLevel();
            this.updateDisplay();
            this.saveGame();
            this.saveToLocalLeaderboard();
            
            // Создаем эффект частиц для улучшения
            const button = document.getElementById(`upgrade${type.charAt(0).toUpperCase() + type.slice(1)}`);
            if (button) {
                const rect = button.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                this.particleSystem.createUpgradeParticles(x, y);
            }
            
            // Звуковой эффект покупки улучшения
            this.soundSystem.play('upgrade');
            
            // Терминальное сообщение об улучшении
            const upgradeNames = {
                click: 'CLICK_POWER',
                auto: 'AUTO_FARM',
                multiplier: 'MULTIPLIER'
            };
            this.typingSystem.createTerminalMessage(`> UPGRADE: ${upgradeNames[type]} +1`);
            
            // Показываем уведомление
            this.showNotification(`Улучшение куплено! 🎉`);
            
            // Вибрация успеха
            if (this.tg && this.tg.HapticFeedback) {
                this.tg.HapticFeedback.notificationOccurred('success');
            }
        } else {
            // Недостаточно токенов
            this.soundSystem.play('error');
            this.showNotification(`Недостаточно токенов! Нужно еще ${this.formatNumber(cost - this.gameData.tokens)}`);
            
            if (this.tg && this.tg.HapticFeedback) {
                this.tg.HapticFeedback.notificationOccurred('error');
            }
        }
    }

    getUpgradeCost(type) {
        const baseState = this.upgradeCosts[type];
        const upgradeCount = this.gameData.upgrades[type + 'Upgrades'] || 0;
        return Math.floor(baseState * Math.pow(1.5, upgradeCount));
    }

    updateLevel() {
        // Простая формула уровня на основе общих улучшений
        const totalUpgrades = Object.values(this.gameData.upgrades).reduce((a, b) => a + b, 0);
        this.gameData.level = Math.floor(totalUpgrades / 3) + 1;
    }

    startAutoFarm() {
        setInterval(() => {
            if (this.gameData.autoFarmPower > 0) {
                const autoEarnings = this.gameData.autoFarmPower * this.gameData.multiplier;
                this.gameData.tokens += autoEarnings;
                this.updateDisplay();
            }
        }, 1000); // Каждую секунду
    }

    showClickEffect(event, amount) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.textContent = '+' + this.formatNumber(amount) + ' $ANON';
        
        // Позиция относительно клика с небольшим разбросом
        const rect = event.target.getBoundingClientRect();
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 20;
        effect.style.left = (rect.left + rect.width / 2 + offsetX) + 'px';
        effect.style.top = (rect.top + rect.height / 2 + offsetY) + 'px';
        
        document.body.appendChild(effect);
        
        // Удаляем эффект через полторы секунды
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1500);
    }

    enhanceGlitchEffect() {
        const farmButton = document.getElementById('farmButton');
        if (!farmButton) return;
        
        // Добавляем временный класс для усиленного глитча
        farmButton.classList.add('glitch-intense');
        
        // Случайные параметры глитча
        const randomHue = Math.random() * 360;
        const randomRotate = (Math.random() - 0.5) * 20;
        
        // Устанавливаем CSS переменные для глитч-эффектов
        farmButton.style.setProperty('--glitch-hue', `${randomHue}deg`);
        farmButton.style.setProperty('--glitch-rotate', `${randomRotate}deg`);
        
        // Создаем случайные трансформации для шара
        const ball = farmButton.querySelector('.billiard-ball');
        if (ball) {
            const randomScale = 0.8 + Math.random() * 0.4; // от 0.8 до 1.2
            const randomRotateBall = (Math.random() - 0.5) * 30;
            ball.style.transform = `scale(${randomScale}) rotate(${randomRotateBall}deg)`;
        }
        
        // Убираем эффект через короткое время
        setTimeout(() => {
            farmButton.classList.remove('glitch-intense');
            farmButton.style.removeProperty('--glitch-hue');
            farmButton.style.removeProperty('--glitch-rotate');
            if (ball) {
                ball.style.transform = '';
            }
        }, 300);
    }

    showLevelUpEffect() {
        const effect = document.createElement('div');
        effect.className = 'level-up-effect';
        effect.textContent = `LEVEL UP! ${this.gameData.level}`;
        
        document.body.appendChild(effect);
        
        // Звуковой эффект повышения уровня
        this.soundSystem.play('levelUp');
        
        // Терминальное сообщение о повышении уровня
        this.typingSystem.createTerminalMessage(`> SYSTEM: LEVEL ${this.gameData.level} ACHIEVED`);
        
        // Удаляем эффект через 2 секунды
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 2000);
        
        // Показываем уведомление
        this.showNotification(`🎉 Поздравляем! Достигнут ${this.gameData.level} уровень!`);
    }

    showNotification(message, type = 'info', playSound = true) {
        // Определяем тип уведомления по содержимому
        if (!type || type === 'auto') {
            if (message.includes('Поздравляем') || message.includes('уровень') || message.includes('🎉')) {
                type = 'success';
            } else if (message.includes('Недостаточно') || message.includes('❌')) {
                type = 'error';
            } else if (message.includes('офлайн') || message.includes('💰')) {
                type = 'offline';
            } else if (message.includes('Куплено') || message.includes('Улучшение')) {
                type = 'success';
            } else if (message.includes('Посажено') || message.includes('Урожай')) {
                type = 'success';
            } else {
                type = 'info';
            }
        }
        
        // Показываем киберпанк уведомление
        this.cyberNotifications.show(message, type);
        
        // Воспроизводим звук
        if (playSound) {
            const soundMap = {
                'success': 'success',
                'error': 'error', 
                'offline': 'offline',
                'info': 'notification',
                'warning': 'notification'
            };
            
            const soundName = soundMap[type] || 'notification';
            this.soundSystem.play(soundName);
        }
        
        // Fallback для Telegram если нужно (для важных уведомлений)
        if (type === 'error' && this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('medium');
        }
    }

    updateDisplay() {
        // Обновляем все элементы интерфейса
        document.getElementById('tokens').textContent = this.formatNumber(this.gameData.tokens);
        document.getElementById('perClick').textContent = this.formatNumber(this.gameData.clickPower * this.gameData.multiplier);
        document.getElementById('level').textContent = this.gameData.level;
        
        // Обновляем стоимости улучшений
        document.getElementById('upgradeClickCost').textContent = this.formatNumber(this.getUpgradeCost('click'));
        document.getElementById('upgradeAutoCost').textContent = this.formatNumber(this.getUpgradeCost('auto'));
        document.getElementById('upgradeMultiplierCost').textContent = this.formatNumber(this.getUpgradeCost('multiplier'));
        
        // Обновляем доступность кнопок улучшений
        this.updateUpgradeButtons();
    }

    updateUpgradeButtons() {
        const upgradeButtons = [
            { id: 'upgradeClick', type: 'click' },
            { id: 'upgradeAuto', type: 'auto' },
            { id: 'upgradeMultiplier', type: 'multiplier' }
        ];
        
        upgradeButtons.forEach(button => {
            const element = document.getElementById(button.id);
            const cost = this.getUpgradeCost(button.type);
            element.disabled = this.gameData.tokens < cost;
        });
    }

    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return Math.floor(num).toString();
    }

    // Отправка статистики игрока
    sendPlayerStats() {
        console.log('🔍 Проверка отправки статистики...');
        console.log('Telegram API доступен:', !!this.tg);
        console.log('Пользователь Telegram:', this.tg?.initDataUnsafe?.user);
        
        if (!this.tg || !this.tg.initDataUnsafe?.user) {
            console.log('❌ Telegram данные недоступны для статистики');
            console.log('💡 Игра должна быть запущена через Telegram бота!');
            return;
        }
        
        console.log('✅ Отправляем статистику в Telegram группу...');

        const user = this.tg.initDataUnsafe.user;
        const stats = {
            player_id: user.id,
            username: user.username || 'Анонимный игрок',
            first_name: user.first_name || 'Аноним',
            tokens: this.gameData.tokens,
            level: this.gameData.level,
            click_power: this.gameData.clickPower,
            auto_power: this.gameData.autoFarmPower,
            multiplier: this.gameData.multiplier,
            total_upgrades: Object.values(this.gameData.upgrades).reduce((a, b) => a + b, 0),
            timestamp: Date.now()
        };

        // Отправляем статистику в Telegram бота (замените BOT_TOKEN на ваш токен)
        const BOT_TOKEN = '8459622700:AAFHx3Lv3eghzrlkyH-VLk5GwTZpx2AbEBM'; // Вставьте сюда токен вашего бота
        const CHAT_ID = '-1002719894591'; // ID чата для получения статистики
        
        if (BOT_TOKEN !== 'YOUR_BOT_TOKEN') {
            const message = `🎮 Статистика игрока:\n` +
                          `👤 ${stats.first_name} (@${stats.username || 'анонимно'})\n` +
                          `💰 Токены: ${this.formatNumber(stats.tokens)}\n` +
                          `🏆 Уровень: ${stats.level}\n` +
                          `⚡ Сила клика: ${stats.click_power}\n` +
                          `🔄 Автоферма: ${stats.auto_power}/сек\n` +
                          `✨ Множитель: x${stats.multiplier}\n` +
                          `🛠️ Улучшений: ${stats.total_upgrades}`;

            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            }).then(response => {
                if (response.ok) {
                    console.log('📊 Статистика отправлена в Telegram группу!');
                } else {
                    console.log('❌ Ошибка HTTP при отправке статистики:', response.status);
                }
            }).catch(err => console.log('❌ Ошибка отправки статистики:', err));
        }

        console.log('Статистика игрока:', stats);
    }

    // Функция для показа топа игроков
    async showLeaderboard() {
        console.log('🏆 Запрос топа игроков...');
        
        try {
            // Запрашиваем глобальный топ через API с таймаутом (статистику отправим отдельно)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут
            
            const response = await fetch('https://anon-farm-api.vercel.app/api/leaderboard', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.leaderboard.length > 0) {
                    let message = '🏆 ANON Farm - Глобальный топ игроков\n\n';
                    
                    data.leaderboard.forEach((player, index) => {
                        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${player.rank}.`;
                        message += `${medal} ${player.name}\n`;
                        message += `💰 ${player.tokens_formatted} $ANON\n`;
                        message += `🏆 Уровень ${player.level}\n\n`;
                    });
                    
                    message += `📊 Всего игроков: ${data.total_players}\n`;
                    message += `⏰ Обновлено только что\n\n`;
                    message += '🔥 Stay $ANON!';
                    
                    if (this.tg && this.tg.showAlert) {
                        // Небольшая задержка чтобы избежать конфликта popup
                        setTimeout(() => {
                            try {
                                this.tg.showAlert(message);
                            } catch (error) {
                                console.log('Popup конфликт, результат в консоли:', message);
                            }
                        }, 500);
                    } else {
                        alert(message);
                    }
                    
                    // Отправляем статистику в фоне после показа топа
                    this.submitStatsToAPI().catch(err => console.log('Ошибка отправки статистики:', err));
                    return;
                } else if (data.success) {
                    // API работает, но топ пустой
                    const emptyMessage = '🏆 ANON Farm - Глобальный топ игроков\n\n' +
                                       '📊 Пока нет активных игроков\n' +
                                       '🚀 Станьте первым в топе!\n\n' +
                                       '💡 Играйте больше чтобы попасть в рейтинг\n\n' +
                                       '🔥 Stay $ANON!';
                    
                    if (this.tg && this.tg.showAlert) {
                        setTimeout(() => {
                            try {
                                this.tg.showAlert(emptyMessage);
                            } catch (error) {
                                console.log('Popup конфликт, пустой топ в консоли:', emptyMessage);
                            }
                        }, 500);
                    } else {
                        alert(emptyMessage);
                    }
                    
                    // Отправляем статистику в фоне
                    this.submitStatsToAPI().catch(err => console.log('Ошибка отправки статистики:', err));
                    return;
                } else {
                    // API вернул success: false
                    throw new Error(`API Error: ${data.error || 'Unknown error'}`);
                }
            } else {
                // HTTP ошибка (не 200 статус)
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.log('Ошибка получения глобального топа:', error);
            
            // Определяем тип ошибки для более точного сообщения
            let errorType = 'Неизвестная ошибка';
            if (error.name === 'AbortError') {
                errorType = 'Превышен таймаут (10 секунд)';
            } else if (error.message.includes('HTTP Error')) {
                errorType = error.message;
            } else if (error.message.includes('API Error')) {
                errorType = error.message;
            } else if (error.message.includes('fetch')) {
                errorType = 'Ошибка сети';
            }
            
            // Показываем подробное сообщение о проблеме
            const errorMessage = '🏆 ANON Farm - Топ игроков\n\n' +
                               '⚠️ Не удалось загрузить глобальный топ\n\n' +
                               `🔍 Причина: ${errorType}\n` +
                               '🌐 API: anon-farm-api.vercel.app\n\n' +
                               '📱 Показываем локальный топ:\n\n' +
                               this.getLocalTopText() +
                               '\n\n💡 Попробуйте ещё раз через минуту\n' +
                               '🔥 Stay $ANON!';
            
            if (this.tg && this.tg.showAlert) {
                setTimeout(() => {
                    try {
                        this.tg.showAlert(errorMessage);
                    } catch (error) {
                        console.log('Popup конфликт, ошибка в консоли:', errorMessage);
                    }
                }, 500);
            } else {
                alert(errorMessage);
            }
            
            // Отправляем статистику в фоне даже при ошибке
            this.submitStatsToAPI().catch(err => console.log('Ошибка отправки статистики:', err));
            return;
        }
        
        // Fallback - показываем локальный топ
        this.showLocalLeaderboard();
    }

    // Резервная функция - локальный топ
    showLocalLeaderboard() {
        const localTop = this.getLocalLeaderboard();
        let message = '🏆 ANON Farm - Локальный топ игроков\n\n';
        
        if (localTop.length > 0) {
            message += '📱 Лучшие на этом устройстве:\n';
            localTop.slice(0, 5).forEach((player, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                message += `${medal} ${player.name}: ${this.formatNumber(player.tokens)} $ANON\n`;
            });
            message += '\n⚠️ Глобальный топ недоступен';
        } else {
            message += '📊 Пока нет данных о игроках\n';
            message += '🎮 Поиграйте немного и топ появится!';
        }
        
        message += '\n\n🔥 Stay $ANON!';
        
        if (this.tg && this.tg.showAlert) {
            this.tg.showAlert(message);
        } else {
            alert(message);
        }
    }

    // Отправка статистики в API
    async submitStatsToAPI() {
        console.log('📊 submitStatsToAPI: начинаем отправку...');
        
        // Получаем данные пользователя (Telegram или fallback)
        let user_id, name;
        
        if (this.tg && this.tg.initDataUnsafe?.user) {
            // Данные из Telegram
            const user = this.tg.initDataUnsafe.user;
            user_id = user.id;
            name = user.first_name || user.username || 'Аноним';
            console.log('📱 Используем данные Telegram:', { user_id, name });
        } else {
            // Fallback для тестирования без Telegram
            user_id = 'test_user_' + Date.now();
            name = 'Тестовый игрок';
            console.log('🧪 Используем тестовые данные:', { user_id, name });
        }

        const statsData = {
            user_id: user_id,  // Исправлено: user_id вместо player_id
            name: name,
            tokens: this.gameData.tokens,
            level: this.gameData.level,
            totalClicks: this.gameData.totalClicks || 0
        };
        
        console.log('📊 Данные для отправки:', statsData);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 секунд таймаут
            
            console.log('🌐 Отправляем POST запрос в API...');
            console.log('📤 URL:', 'https://anon-farm-api.vercel.app/api/submit_stats');
            console.log('📤 Данные:', JSON.stringify(statsData));
            
            const response = await fetch('https://anon-farm-api.vercel.app/api/submit_stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(statsData),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            console.log('📡 ОТВЕТ API:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });
            
            if (response.ok) {
                const responseData = await response.json();
                console.log('✅ УСПЕШНЫЙ ОТВЕТ API:', responseData);
            } else {
                const errorText = await response.text();
                console.log('❌ ОШИБКА API RESPONSE:', {
                    status: response.status,
                    error: errorText
                });
            }
            
        } catch (error) {
            console.log('❌ КРИТИЧЕСКАЯ ОШИБКА отправки в API:', error);
            console.log('❌ Тип ошибки:', error.name);
            console.log('❌ Сообщение:', error.message);
        }
    }

    // Проверка статуса API сервера
    async checkApiStatus() {
        const loadingMessage = '🔧 Проверка API сервера...\n\n⏳ Подключение к облачному API...';
        
        if (this.tg && this.tg.showAlert) {
            try {
                this.tg.showAlert(loadingMessage);
            } catch (error) {
                console.log('Popup конфликт в checkApiStatus:', error);
            }
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 секунд таймаут
            
            const response = await fetch('https://anon-farm-api.vercel.app/', {
                method: 'GET',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                const message = '✅ API Сервер работает!\n\n' +
                              `📊 Версия: ${data.version}\n` +
                              '🌐 Адрес: anon-farm-api.vercel.app\n' +
                              '🏆 Глобальный топ доступен\n\n' +
                              '💡 Попробуйте кнопку "Топ игроков"!\n\n' +
                              '🔥 Stay $ANON!';
                
                if (this.tg && this.tg.showAlert) {
                    try {
                        this.tg.showAlert(message);
                    } catch (error) {
                        console.log('Ошибка показа popup топа:', error);
                        // Показываем в console как fallback
                        console.log('🏆 Топ игроков:', message);
                    }
                } else {
                    alert(message);
                }
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            const message = '❌ Облачный API недоступен\n\n' +
                          '🌐 URL: anon-farm-api.vercel.app\n' +
                          '🔧 Возможно временные проблемы Vercel\n\n' +
                          '📱 Пока работает локальный топ\n' +
                          '💬 Глобальный топ в Telegram группе\n\n' +
                          `🐛 Ошибка: ${error.message}\n\n` +
                          '🔥 Stay $ANON!';
            
            if (this.tg && this.tg.showAlert) {
                try {
                    this.tg.showAlert(message);
                } catch (error) {
                    console.log('Popup конфликт в checkApiStatus ошибка:', error);
                    console.log('Сообщение об ошибке API:', message);
                }
            } else {
                alert(message);
            }
            
            console.log('API недоступен:', error);
        }
    }

    // Запрос глобального топа через бота
    requestLeaderboard() {
        const BOT_TOKEN = '8459622700:AAFHx3Lv3eghzrlkyH-VLk5GwTZpx2AbEBM';
        const CHAT_ID = '-1002719894591';
        
        const message = '🏆 ЗАПРОС ТОПА ИГРОКОВ\n\n' +
                       '👤 Игрок запросил глобальный топ лидеров ANON Farm!\n' +
                       '📊 Покажите топ-10 лучших игроков по токенам\n\n' +
                       '⏰ Время запроса: ' + new Date().toLocaleString('ru-RU');

        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        }).catch(err => console.log('Ошибка запроса топа:', err));
    }

    // Получение локального топа игроков
    getLocalLeaderboard() {
        try {
            const savedData = localStorage.getItem('anonFarmLeaderboard');
            if (savedData) {
                return JSON.parse(savedData).sort((a, b) => b.tokens - a.tokens);
            }
        } catch (e) {
            console.log('Ошибка загрузки локального топа:', e);
        }
        return [];
    }

    // Форматирование локального топа в текст
    getLocalTopText() {
        const localTop = this.getLocalLeaderboard();
        if (localTop.length > 0) {
            let text = '';
            localTop.slice(0, 3).forEach((player, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                text += `${medal} ${player.name}: ${this.formatNumber(player.tokens)}\n`;
            });
            return text.trim();
        } else {
            return '📊 Пока нет локальных данных\n🎮 Поиграйте немного!';
        }
    }

    // Сохранение в локальный топ
    saveToLocalLeaderboard() {
        if (!this.tg || !this.tg.initDataUnsafe?.user) return;

        const user = this.tg.initDataUnsafe.user;
        const playerData = {
            id: user.id,
            name: user.first_name || 'Аноним',
            username: user.username || '',
            tokens: this.gameData.tokens,
            level: this.gameData.level,
            lastUpdate: Date.now()
        };

        try {
            let leaderboard = this.getLocalLeaderboard();
            
            // Обновляем данные игрока или добавляем нового
            const existingIndex = leaderboard.findIndex(p => p.id === user.id);
            if (existingIndex >= 0) {
                leaderboard[existingIndex] = playerData;
            } else {
                leaderboard.push(playerData);
            }

            // Оставляем только топ-50 для экономии места
            leaderboard = leaderboard.sort((a, b) => b.tokens - a.tokens).slice(0, 50);
            
            localStorage.setItem('anonFarmLeaderboard', JSON.stringify(leaderboard));
        } catch (e) {
            console.log('Ошибка сохранения в локальный топ:', e);
        }
    }

    // Инициализация навигации между страницами
    initPageNavigation() {
        // Обработчики для нижней навигации
        const navTabs = document.querySelectorAll('.nav-tab');
        
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const pageName = tab.getAttribute('data-page');
                this.showPage(pageName);
                
                // Обновляем активную вкладку
                navTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });

        // Обработчики для табов топа игроков
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                this.showLeaderboardTab(tabName);
                
                // Обновляем активную вкладку
                tabButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // Обновляем профиль при первой загрузке
        this.updateProfile();
        
        console.log('✅ Навигация инициализирована');
    }

    // Показ определенной страницы
    showPage(pageName) {
        // Скрываем все страницы
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        
        // Показываем нужную страницу
        const targetPage = document.getElementById(pageName + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Терминальные сообщения для навигации
            const pageMessages = {
                farm: '> ACCESSING MAIN FARM MODULE...',
                upgrades: '> LOADING ENHANCEMENT PROTOCOLS...',
                leaderboard: '> CONNECTING TO GLOBAL RANKING SYSTEM...',
                profile: '> ANALYZING USER DATA PATTERNS...',
                garden: '> CYBER GARDEN INTERFACE ACTIVE...',
                billiard: '> INITIALIZING CYBER BILLIARD SYSTEM...'
            };
            
            if (pageMessages[pageName]) {
                this.typingSystem.createTerminalMessage(pageMessages[pageName]);
                this.soundSystem.play('navigation');
            }
            
            // Обновляем данные при переходе на страницы
            if (pageName === 'profile') {
                this.updateProfile();
            } else if (pageName === 'leaderboard') {
                this.loadLeaderboards();
            } else if (pageName === 'garden') {
                this.updateGardenDisplay();
            } else if (pageName === 'billiard') {
                this.setBilliardActive(true);
            } else {
                // Деактивируем бильярд при переходе на другие страницы
                this.setBilliardActive(false);
            }
        }
    }

    // Переключение табов в топе игроков
    showLeaderboardTab(tabName) {
        // Скрываем все табы
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Показываем нужный таб
        const targetTab = document.getElementById(tabName + 'Leaderboard');
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }

    // Обновление данных профиля
    updateProfile() {
        try {
            const user = this.tg?.initDataUnsafe?.user;
            
            // Обновляем имя и ID
            if (user) {
                document.getElementById('profileName').textContent = user.first_name || 'Аноним';
                document.getElementById('profileId').textContent = `ID: ${user.id}`;
            }
            
            // Обновляем статистику
            document.getElementById('profileTokens').textContent = this.formatNumber(this.gameData.tokens);
            document.getElementById('profileLevel').textContent = this.gameData.level;
            document.getElementById('profileClicks').textContent = this.formatNumber(this.gameData.totalClicks || 0);
            document.getElementById('profileUpgrades').textContent = 
                (this.gameData.upgrades.clickUpgrades || 0) + (this.gameData.upgrades.autoUpgrades || 0) + (this.gameData.upgrades.multiplierUpgrades || 0);
            document.getElementById('profileClickPower').textContent = this.gameData.clickPower;
            document.getElementById('profileAutoRate').textContent = this.gameData.autoFarmPower + '/сек';
            
        } catch (error) {
            console.log('Ошибка обновления профиля:', error);
        }
    }

    // Загрузка данных для топов
    loadLeaderboards() {
        // Загружаем топ по токенам (уже есть функция)
        this.loadTokensLeaderboard();
        
        // Загружаем топ по уровням
        this.loadLevelLeaderboard();
    }

    // Топ по токенам (адаптация существующей функции)
    async loadTokensLeaderboard() {
        const container = document.getElementById('tokensLeaderboard');
        container.innerHTML = '<p>🔄 Загружаем топ по токенам...</p>';
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch('https://anon-farm-api.vercel.app/api/leaderboard', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.leaderboard.length > 0) {
                    let html = '';
                    data.leaderboard.forEach((player, index) => {
                        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${player.rank}.`;
                        html += `
                            <div class="leaderboard-item">
                                <span class="rank">${medal}</span>
                                <span class="name">${player.name}</span>
                                <span class="tokens">${player.tokens_formatted} $ANON</span>
                            </div>
                        `;
                    });
                    html += `<p class="leaderboard-footer">📊 Всего игроков: ${data.total_players}</p>`;
                    container.innerHTML = html;
                } else {
                    container.innerHTML = '<p>📊 Пока нет активных игроков</p>';
                }
            }
        } catch (error) {
            container.innerHTML = '<p>❌ Ошибка загрузки топа по токенам</p>';
        }
    }

    // Топ по уровням (новая функция)
    async loadLevelLeaderboard() {
        const container = document.getElementById('levelLeaderboard');
        container.innerHTML = '<p>🔄 Загружаем топ по уровням...</p>';
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch('https://anon-farm-api.vercel.app/api/leaderboard', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.leaderboard.length > 0) {
                    // Сортируем по уровням
                    const levelSorted = [...data.leaderboard].sort((a, b) => b.level - a.level);
                    
                    let html = '';
                    levelSorted.forEach((player, index) => {
                        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                        html += `
                            <div class="leaderboard-item">
                                <span class="rank">${medal}</span>
                                <span class="name">${player.name}</span>
                                <span class="level">Уровень ${player.level}</span>
                            </div>
                        `;
                    });
                    html += `<p class="leaderboard-footer">🏆 Всего игроков: ${data.total_players}</p>`;
                    container.innerHTML = html;
                } else {
                    container.innerHTML = '<p>🏆 Пока нет активных игроков</p>';
                }
            }
        } catch (error) {
            container.innerHTML = '<p>❌ Ошибка загрузки топа по уровням</p>';
        }
    }

    // Пинг API чтобы не засыпал
    async pingAPI() {
        try {
            // Пингуем главную страницу
            const controller1 = new AbortController();
            const timeoutId1 = setTimeout(() => controller1.abort(), 5000);
            
            const response1 = await fetch('https://anon-farm-api.vercel.app/', {
                method: 'GET',
                signal: controller1.signal
            });
            
            clearTimeout(timeoutId1);
            
            // Пингуем leaderboard для загрузки данных
            const controller2 = new AbortController();
            const timeoutId2 = setTimeout(() => controller2.abort(), 5000);
            
            const response2 = await fetch('https://anon-farm-api.vercel.app/api/leaderboard', {
                method: 'GET',
                signal: controller2.signal
            });
            
            clearTimeout(timeoutId2);
            
            if (response1.ok && response2.ok) {
                console.log('🏓 API двойной пинг успешен - сервер и данные загружены');
            } else {
                console.log('⚠️ API пинг частично провален:', response1.status, response2.status);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('⏰ API пинг - таймаут 5 секунд');
            } else {
                console.log('❌ API пинг - ошибка сети:', error.message);
            }
        }
    }

    // ===== МЕТОДЫ ДЛЯ ОГОРОДА =====
    
    // Инициализация огорода
    initGarden() {
        // Обработчики покупки семян
        document.querySelectorAll('.seed-buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const seedType = e.target.closest('.seed-item').getAttribute('data-seed');
                this.buySeed(seedType);
            });
        });

        // Обработчики грядок
        document.querySelectorAll('.garden-plot').forEach(plot => {
            plot.addEventListener('click', (e) => {
                const plotIndex = parseInt(e.target.closest('.garden-plot').getAttribute('data-plot'));
                this.handlePlotClick(plotIndex);
            });
        });

        // Обработчики выбора семян для посадки
        document.querySelectorAll('.selection-seed').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const seedType = e.target.getAttribute('data-seed');
                this.plantSeedOnSelectedPlot(seedType);
            });
        });

        // Кнопка отмены выбора
        document.querySelector('.selection-cancel').addEventListener('click', () => {
            this.hideSeedSelection();
        });

        // Обновляем отображение огорода
        this.updateGardenDisplay();
        
        console.log('🌱 Огород инициализирован');
    }

    // Покупка семян
    buySeed(seedType) {
        const seedConfig = this.seedsConfig[seedType];
        if (!seedConfig) return;

        if (this.gameData.tokens >= seedConfig.price) {
            this.gameData.tokens -= seedConfig.price;
            this.gameData.garden.seeds[seedType]++;
            
            this.updateDisplay();
            this.updateGardenDisplay();
            this.saveGame();
            
            this.showNotification(`Куплено: ${seedConfig.name} за ${seedConfig.price} $ANON! 🌱`);
            
            // Вибрация успеха
            if (this.tg && this.tg.HapticFeedback) {
                this.tg.HapticFeedback.notificationOccurred('success');
            }
        } else {
            this.showNotification(`Недостаточно токенов! Нужно ${seedConfig.price} $ANON`);
            
            if (this.tg && this.tg.HapticFeedback) {
                this.tg.HapticFeedback.notificationOccurred('error');
            }
        }
    }

    // Обработка клика по грядке
    handlePlotClick(plotIndex) {
        const plot = this.gameData.garden.plots[plotIndex];
        
        if (!plot) {
            // Пустая грядка - показываем выбор семян
            this.selectedPlotIndex = plotIndex;
            this.showSeedSelection();
        } else if (plot.stage === 'ready') {
            // Готовый урожай - собираем
            this.harvestPlot(plotIndex);
        }
        // Если растет - просто ждем, ничего не делаем
    }

    // Показать выбор семян для посадки
    showSeedSelection() {
        this.updateSeedSelectionButtons();
        document.getElementById('seedSelection').style.display = 'block';
    }

    // Скрыть выбор семян
    hideSeedSelection() {
        document.getElementById('seedSelection').style.display = 'none';
        this.selectedPlotIndex = null;
    }

    // Обновить кнопки выбора семян (заблокировать если нет в инвентаре)
    updateSeedSelectionButtons() {
        document.querySelectorAll('.selection-seed').forEach(btn => {
            const seedType = btn.getAttribute('data-seed');
            const seedCount = this.gameData.garden.seeds[seedType] || 0;
            
            btn.disabled = seedCount === 0;
            btn.style.opacity = seedCount > 0 ? '1' : '0.5';
        });
    }

    // Посадить семя на выбранную грядку
    plantSeedOnSelectedPlot(seedType) {
        if (this.selectedPlotIndex === null) return;
        
        const seedCount = this.gameData.garden.seeds[seedType] || 0;
        if (seedCount === 0) return;

        // Уменьшаем количество семян
        this.gameData.garden.seeds[seedType]--;

        // Сажаем на грядку
        this.gameData.garden.plots[this.selectedPlotIndex] = {
            type: seedType,
            plantTime: Date.now(),
            stage: 'planted'
        };

        this.updateGardenDisplay();
        this.hideSeedSelection();
        this.saveGame();

        const seedConfig = this.seedsConfig[seedType];
        this.showNotification(`Посажено: ${seedConfig.name}! 🌱`);
        
        // Вибрация
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('light');
        }
    }

    // Сбор урожая
    harvestPlot(plotIndex) {
        const plot = this.gameData.garden.plots[plotIndex];
        if (!plot || plot.stage !== 'ready') return;

        const seedConfig = this.seedsConfig[plot.type];
        const reward = seedConfig.reward * this.gameData.multiplier;

        // Добавляем награду к основному балансу
        this.gameData.tokens += reward;

        // Очищаем грядку
        this.gameData.garden.plots[plotIndex] = null;

        this.updateDisplay();
        this.updateGardenDisplay();
        this.saveGame();

        this.showNotification(`Урожай собран! +${this.formatNumber(reward)} $ANON! 🎉`);
        
        // Вибрация успеха
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.notificationOccurred('success');
        }
    }

    // Обновление состояния растений
    updatePlantGrowth() {
        let hasChanges = false;
        const now = Date.now();

        this.gameData.garden.plots.forEach((plot, index) => {
            if (!plot) return;

            const seedConfig = this.seedsConfig[plot.type];
            const timePassed = (now - plot.plantTime) / 1000; // в секундах
            
            const growthTime = seedConfig.growthTime;
            const halfGrowthTime = growthTime / 2;

            let newStage = plot.stage;

            if (timePassed >= growthTime) {
                newStage = 'ready';
            } else if (timePassed >= halfGrowthTime) {
                newStage = 'growing';
            } else {
                newStage = 'planted';
            }

            if (newStage !== plot.stage) {
                plot.stage = newStage;
                hasChanges = true;
            }
        });

        if (hasChanges) {
            this.updateGardenDisplay();
        }
    }

    // Обновление отображения огорода
    updateGardenDisplay() {
        // Обновляем инвентарь семян
        Object.keys(this.gameData.garden.seeds).forEach(seedType => {
            const countElement = document.getElementById(seedType + 'Seeds');
            if (countElement) {
                countElement.textContent = this.gameData.garden.seeds[seedType];
            }
        });

        // Обновляем грядки
        this.gameData.garden.plots.forEach((plot, index) => {
            const plotElement = document.querySelector(`[data-plot="${index}"]`);
            if (!plotElement) return;

            const contentElement = plotElement.querySelector('.plot-content');
            
            if (!plot) {
                // Пустая грядка
                contentElement.innerHTML = '<div class="plot-empty">📍</div>';
                plotElement.className = 'garden-plot';
            } else {
                // Грядка с растением
                const seedConfig = this.seedsConfig[plot.type];
                const stageIcon = seedConfig.stages[plot.stage];
                
                let timerHtml = '';
                if (plot.stage !== 'ready') {
                    const now = Date.now();
                    const timePassed = (now - plot.plantTime) / 1000;
                    const timeLeft = Math.max(0, seedConfig.growthTime - timePassed);
                    const minutes = Math.floor(timeLeft / 60);
                    const seconds = Math.floor(timeLeft % 60);
                    timerHtml = `<div class="plot-timer">${minutes}:${seconds.toString().padStart(2, '0')}</div>`;
                }
                
                contentElement.innerHTML = `
                    <div class="plot-${plot.stage}">${stageIcon}</div>
                    ${timerHtml}
                `;
                
                plotElement.className = `garden-plot plot-${plot.stage}`;
            }
        });

        // Обновляем кнопки покупки семян
        document.querySelectorAll('.seed-buy-btn').forEach(btn => {
            const seedItem = btn.closest('.seed-item');
            const seedType = seedItem.getAttribute('data-seed');
            const seedConfig = this.seedsConfig[seedType];
            
            btn.disabled = this.gameData.tokens < seedConfig.price;
        });
    }

    // Инициализация бильярда
    initBilliard() {
        this.billiardCanvas = document.getElementById('billiardCanvas');
        if (!this.billiardCanvas) return;

        this.billiardCtx = this.billiardCanvas.getContext('2d');
        this.billiardScore = 0;
        this.billiardHits = 0;
        this.billiardActive = false;

        // Настройки бильярда
        this.billiardConfig = {
            ballRadius: 15,
            ballSpeed: 0.98, // Затухание скорости
            maxSpeed: 8,
            tableWidth: 300,
            tableHeight: 600,
            pocketRadius: 25,
            pockets: [
                { x: 25, y: 25 },   // Верхний левый
                { x: 150, y: 25 },  // Верхний центр
                { x: 275, y: 25 },  // Верхний правый
                { x: 25, y: 575 },  // Нижний левый
                { x: 150, y: 575 }, // Нижний центр
                { x: 275, y: 575 }  // Нижний правый
            ]
        };

        // Состояние шара
        this.ball = {
            x: 150,
            y: 300,
            vx: 0,
            vy: 0,
            radius: this.billiardConfig.ballRadius
        };

        // Инициализация акселерометра
        this.initBilliardAccelerometer();
        
        // Запуск игрового цикла
        this.billiardGameLoop();
    }

    // Инициализация акселерометра для бильярда
    initBilliardAccelerometer() {
        if (!window.DeviceMotionEvent) {
            console.log('Акселерометр не поддерживается');
            return;
        }

        let lastUpdate = 0;
        const threshold = 0.5;

        window.addEventListener('devicemotion', (event) => {
            if (!this.billiardActive) return;

            const now = Date.now();
            if (now - lastUpdate < 50) return; // Ограничиваем частоту обновлений

            const acceleration = event.accelerationIncludingGravity;
            if (!acceleration) return;

            // Наклон телефона влияет на скорость шара
            const tiltX = acceleration.x / 9.8; // Нормализуем к g
            const tiltY = acceleration.y / 9.8;

            // Применяем наклон только если он достаточно сильный
            if (Math.abs(tiltX) > threshold || Math.abs(tiltY) > threshold) {
                this.ball.vx += tiltX * 0.5;
                this.ball.vy += tiltY * 0.5;

                // Ограничиваем максимальную скорость
                this.ball.vx = Math.max(-this.billiardConfig.maxSpeed, 
                                      Math.min(this.billiardConfig.maxSpeed, this.ball.vx));
                this.ball.vy = Math.max(-this.billiardConfig.maxSpeed, 
                                      Math.min(this.billiardConfig.maxSpeed, this.ball.vy));
            }

            lastUpdate = now;
        });
    }

    // Игровой цикл бильярда
    billiardGameLoop() {
        if (!this.billiardCanvas || !this.billiardCtx) return;

        this.updateBilliardBall();
        this.checkBilliardCollisions();
        this.drawBilliardTable();
        this.drawBilliardBall();

        requestAnimationFrame(() => this.billiardGameLoop());
    }

    // Обновление позиции шара
    updateBilliardBall() {
        if (!this.billiardActive) return;

        // Применяем скорость
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;

        // Затухание скорости
        this.ball.vx *= this.billiardConfig.ballSpeed;
        this.ball.vy *= this.billiardConfig.ballSpeed;

        // Останавливаем шар если скорость очень мала
        if (Math.abs(this.ball.vx) < 0.1) this.ball.vx = 0;
        if (Math.abs(this.ball.vy) < 0.1) this.ball.vy = 0;
    }

    // Проверка столкновений
    checkBilliardCollisions() {
        if (!this.billiardActive) return;

        // Столкновения со стенками
        if (this.ball.x - this.ball.radius < 0) {
            this.ball.x = this.ball.radius;
            this.ball.vx = -this.ball.vx * 0.8;
        }
        if (this.ball.x + this.ball.radius > this.billiardConfig.tableWidth) {
            this.ball.x = this.billiardConfig.tableWidth - this.ball.radius;
            this.ball.vx = -this.ball.vx * 0.8;
        }
        if (this.ball.y - this.ball.radius < 0) {
            this.ball.y = this.ball.radius;
            this.ball.vy = -this.ball.vy * 0.8;
        }
        if (this.ball.y + this.ball.radius > this.billiardConfig.tableHeight) {
            this.ball.y = this.billiardConfig.tableHeight - this.ball.radius;
            this.ball.vy = -this.ball.vy * 0.8;
        }

        // Проверка попадания в лузы
        this.billiardConfig.pockets.forEach(pocket => {
            const distance = Math.sqrt(
                Math.pow(this.ball.x - pocket.x, 2) + 
                Math.pow(this.ball.y - pocket.y, 2)
            );

            if (distance < this.billiardConfig.pocketRadius) {
                this.billiardBallInPocket();
            }
        });
    }

    // Шар попал в лузу
    billiardBallInPocket() {
        this.billiardHits++;
        this.billiardScore += this.gameData.clickPower * 100; // Награда = сила клика * 100
        
        // Добавляем токены в игру
        this.gameData.tokens += this.gameData.clickPower * 100;
        
        // Обновляем отображение
        this.updateBilliardDisplay();
        this.updateDisplay();
        
        // Эффекты
        this.soundSystem.play('success');
        this.particleSystem.createLevelUpParticles();
        this.showNotification(`🎱 Шар в лузе! +${this.gameData.clickPower * 100} $ANON`, 'success');
        
        // Перезапускаем шар
        this.resetBilliardBall();
    }

    // Сброс шара в центр
    resetBilliardBall() {
        this.ball.x = this.billiardConfig.tableWidth / 2;
        this.ball.y = this.billiardConfig.tableHeight / 2;
        this.ball.vx = 0;
        this.ball.vy = 0;
    }

    // Отрисовка бильярдного стола
    drawBilliardTable() {
        const ctx = this.billiardCtx;
        const width = this.billiardConfig.tableWidth;
        const height = this.billiardConfig.tableHeight;

        // Очищаем canvas
        ctx.clearRect(0, 0, width, height);

        // Рисуем лузы
        ctx.fillStyle = '#000000';
        this.billiardConfig.pockets.forEach(pocket => {
            ctx.beginPath();
            ctx.arc(pocket.x, pocket.y, this.billiardConfig.pocketRadius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Рисуем границы стола
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, width - 4, height - 4);
    }

    // Отрисовка шара
    drawBilliardBall() {
        const ctx = this.billiardCtx;
        
        // Рисуем тень
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(this.ball.x + 2, this.ball.y + 2, this.ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Рисуем шар
        const gradient = ctx.createRadialGradient(
            this.ball.x - this.ball.radius/3, this.ball.y - this.ball.radius/3, 0,
            this.ball.x, this.ball.y, this.ball.radius
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.1, '#ffffff');
        gradient.addColorStop(0.9, '#000000');
        gradient.addColorStop(1, '#000000');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Рисуем номер 8
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('8', this.ball.x, this.ball.y);
    }

    // Обновление отображения бильярда
    updateBilliardDisplay() {
        const scoreElement = document.getElementById('billiardScore');
        const hitsElement = document.getElementById('billiardHits');
        
        if (scoreElement) scoreElement.textContent = this.billiardScore;
        if (hitsElement) hitsElement.textContent = this.billiardHits;
    }

    // Активация/деактивация бильярда при переключении страниц
    setBilliardActive(active) {
        this.billiardActive = active;
        if (active && !this.billiardCanvas) {
            this.initBilliard();
        }
    }
}

// Запускаем игру когда страница загружена
document.addEventListener('DOMContentLoaded', () => {
    console.log('Инициализация ANON Farm...');
    window.anonFarm = new AnonFarm();
});

// Сохраняем игру при закрытии страницы
window.addEventListener('beforeunload', () => {
    if (window.anonFarm) {
        window.anonFarm.saveGame();
    }
});