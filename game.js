// Игра ANON Farm - логика и интеграция с Telegram
class AnonFarm {
    constructor() {
        // Базовые параметры игры
        this.gameData = {
            tokens: 0,
            level: 1,
            clickPower: 1,
            autoFarmPower: 0,
            multiplier: 1,
            upgrades: {
                clickUpgrades: 0,
                autoUpgrades: 0,
                multiplierUpgrades: 0
            },
            lastSave: Date.now()
        };

        // Стоимость улучшений
        this.upgradeCosts = {
            click: 10,
            auto: 50,
            multiplier: 200
        };

        // Инициализация Telegram Web App
        this.initTelegram();
        
        // Загрузка данных
        this.loadGame();
        
        // Запуск игры
        this.initGame();
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
            }
        }
    }

    initGame() {
        // Обновляем отображение
        this.updateDisplay();
        
        // Привязываем события
        document.getElementById('farmButton').addEventListener('click', (e) => this.clickFarm(e));
        document.getElementById('upgradeClick').addEventListener('click', () => this.buyUpgrade('click'));
        document.getElementById('upgradeAuto').addEventListener('click', () => this.buyUpgrade('auto'));
        document.getElementById('upgradeMultiplier').addEventListener('click', () => this.buyUpgrade('multiplier'));
        document.getElementById('leaderboardBtn').addEventListener('click', () => this.showLeaderboard());
        
        // Запускаем автоферму
        this.startAutoFarm();
        
        // Автосохранение каждые 30 секунд
        setInterval(() => {
            this.saveGame();
            this.saveToLocalLeaderboard();
        }, 30000);
        
        // Отправка статистики каждые 5 минут
        setInterval(() => this.sendPlayerStats(), 300000);
        
        // Отправляем первую статистику через 10 секунд после запуска
        setTimeout(() => this.sendPlayerStats(), 10000);
        
        console.log('Игра ANON Farm запущена!');
    }

    clickFarm(event) {
        // Добавляем токены за клик
        const earnings = this.gameData.clickPower * this.gameData.multiplier;
        this.gameData.tokens += earnings;
        
        // Обновляем уровень
        this.updateLevel();
        
        // Показываем анимацию
        this.showClickEffect(event, earnings);
        
        // Обновляем отображение
        this.updateDisplay();
        
        // Сохраняем в локальный топ каждые 10 кликов для производительности
        if (this.gameData.tokens % 10 === 0) {
            this.saveToLocalLeaderboard();
        }
        
        // Вибрация в Telegram
        if (this.tg && this.tg.HapticFeedback) {
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
            
            // Показываем уведомление
            this.showNotification(`Улучшение куплено! 🎉`);
            
            // Вибрация успеха
            if (this.tg && this.tg.HapticFeedback) {
                this.tg.HapticFeedback.notificationOccurred('success');
            }
        } else {
            // Недостаточно токенов
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
        effect.textContent = '+' + this.formatNumber(amount);
        
        // Позиция относительно клика
        const rect = event.target.getBoundingClientRect();
        effect.style.left = (rect.left + rect.width / 2) + 'px';
        effect.style.top = (rect.top + rect.height / 2) + 'px';
        
        document.body.appendChild(effect);
        
        // Удаляем эффект через секунду
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000);
    }

    showNotification(message) {
        // Показываем уведомление через Telegram
        if (this.tg && this.tg.showAlert) {
            this.tg.showAlert(message);
        } else {
            // Fallback на обычный alert
            alert(message);
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
        if (!this.tg || !this.tg.initDataUnsafe?.user) {
            console.log('Telegram данные недоступны для статистики');
            return;
        }

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
            }).catch(err => console.log('Ошибка отправки статистики:', err));
        }

        console.log('Статистика игрока:', stats);
    }

    // Функция для показа топа игроков
    showLeaderboard() {
        // Отправляем команду боту для получения топа
        this.requestLeaderboard();
        
        // Показываем локальный топ пока ждем ответ от бота
        const localTop = this.getLocalLeaderboard();
        let message = '🏆 ANON Farm - Топ игроков\n\n';
        
        if (localTop.length > 0) {
            message += '📱 Локальные лидеры:\n';
            localTop.slice(0, 5).forEach((player, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                message += `${medal} ${player.name}: ${this.formatNumber(player.tokens)} $ANON\n`;
            });
            message += '\n💬 Глобальный топ запрошен в чате!';
        } else {
            message += '📊 Пока нет данных о игроках\n';
            message += '🎮 Поиграйте немного и топ появится!\n\n';
            message += '💬 Глобальный топ запрошен в группе статистики!';
        }
        
        message += '\n\n🔥 Stay $ANON!';
        
        if (this.tg && this.tg.showAlert) {
            this.tg.showAlert(message);
        } else {
            alert(message);
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