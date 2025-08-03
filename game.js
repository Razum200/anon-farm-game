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
        document.getElementById('apiStatusBtn').addEventListener('click', () => this.checkApiStatus());
        
        // Запускаем автоферму
        this.startAutoFarm();
        
        // Автосохранение каждые 30 секунд
        setInterval(() => {
            this.saveGame();
            this.saveToLocalLeaderboard();
        }, 30000);
        
        // Отправка статистики каждые 5 минут
        setInterval(() => {
            console.log('⏱️ Таймер 5 минут: отправляем статистику...');
            this.sendPlayerStats();
            this.submitStatsToAPI();
        }, 300000);
        
        // Отправляем первую статистику через 10 секунд после запуска
        setTimeout(() => {
            console.log('⏱️ Таймер 10 секунд: первая отправка статистики...');
            this.sendPlayerStats();
            this.submitStatsToAPI();
        }, 10000);
        
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
        if (!this.tg || !this.tg.initDataUnsafe?.user) return;

        const user = this.tg.initDataUnsafe.user;
        const statsData = {
            player_id: user.id,
            name: user.first_name || 'Аноним',
            tokens: this.gameData.tokens,
            level: this.gameData.level
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 секунд таймаут
            
            await fetch('https://anon-farm-api.vercel.app/api/submit_stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(statsData),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
        } catch (error) {
            console.log('Ошибка отправки статистики в API:', error);
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