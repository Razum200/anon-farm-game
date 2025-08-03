// Простой бот для обработки топа игроков ANON Farm
// Запускается на сервере для автоматической обработки запросов топа

const https = require('https');

// Настройки
const BOT_TOKEN = '8459622700:AAFHx3Lv3eghzrlkyH-VLk5GwTZpx2AbEBM';
const CHAT_ID = '-1002719894591';

// Хранилище статистики игроков (в реальном проекте используйте базу данных)
let playersStats = new Map();

// Отправка сообщения в Telegram
function sendMessage(text) {
    const data = JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML'
    });

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        console.log(`Статус: ${res.statusCode}`);
    });

    req.on('error', (error) => {
        console.error('Ошибка отправки:', error);
    });

    req.write(data);
    req.end();
}

// Форматирование чисел
function formatNumber(num) {
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

// Обработка статистики игрока
function processPlayerStats(message) {
    // Парсим сообщение со статистикой
    const lines = message.split('\n');
    if (lines[0] !== '🎮 Статистика игрока:') return;

    try {
        const nameMatch = lines[1].match(/👤 (.+?) \(@(.+?)\)/);
        const tokensMatch = lines[2].match(/💰 Токены: (.+)/);
        const levelMatch = lines[3].match(/🏆 Уровень: (\d+)/);

        if (nameMatch && tokensMatch && levelMatch) {
            const playerId = nameMatch[2]; // username как ID
            const playerName = nameMatch[1];
            const tokens = parseFloat(tokensMatch[1].replace(/[KMB]/g, '')) * 
                          (tokensMatch[1].includes('K') ? 1000 : 
                           tokensMatch[1].includes('M') ? 1000000 : 
                           tokensMatch[1].includes('B') ? 1000000000 : 1);
            const level = parseInt(levelMatch[1]);

            // Сохраняем статистику
            playersStats.set(playerId, {
                name: playerName,
                tokens: tokens,
                level: level,
                lastUpdate: Date.now()
            });

            console.log(`Обновлена статистика: ${playerName} - ${formatNumber(tokens)} токенов`);
        }
    } catch (error) {
        console.error('Ошибка парсинга статистики:', error);
    }
}

// Генерация топа игроков
function generateLeaderboard() {
    const sortedPlayers = Array.from(playersStats.values())
        .sort((a, b) => b.tokens - a.tokens)
        .slice(0, 10);

    if (sortedPlayers.length === 0) {
        return '🏆 ANON Farm - Топ игроков\n\n📊 Пока нет данных о игроках\n🎮 Начните играть чтобы попасть в топ!\n\n🔥 Stay $ANON!';
    }

    let message = '🏆 ANON Farm - Глобальный топ игроков\n\n';
    
    sortedPlayers.forEach((player, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        message += `${medal} <b>${player.name}</b>\n`;
        message += `💰 ${formatNumber(player.tokens)} $ANON токенов\n`;
        message += `🏆 Уровень ${player.level}\n\n`;
    });

    message += `📊 Всего игроков: ${playersStats.size}\n`;
    message += `⏰ Обновлено: ${new Date().toLocaleString('ru-RU')}\n\n`;
    message += '🔥 Stay $ANON!';

    return message;
}

// Получение сообщений от бота (simple polling)
function getUpdates(offset = 0) {
    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${BOT_TOKEN}/getUpdates?offset=${offset}&timeout=30`,
        method: 'GET'
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                if (response.ok && response.result.length > 0) {
                    response.result.forEach(update => {
                        processUpdate(update);
                    });
                    // Продолжаем polling с новым offset
                    const lastUpdateId = response.result[response.result.length - 1].update_id;
                    setTimeout(() => getUpdates(lastUpdateId + 1), 1000);
                } else {
                    // Продолжаем polling
                    setTimeout(() => getUpdates(offset), 1000);
                }
            } catch (error) {
                console.error('Ошибка парсинга ответа:', error);
                setTimeout(() => getUpdates(offset), 5000);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Ошибка получения обновлений:', error);
        setTimeout(() => getUpdates(offset), 5000);
    });

    req.end();
}

// Обработка обновлений
function processUpdate(update) {
    if (update.message && update.message.chat.id.toString() === CHAT_ID) {
        const message = update.message.text;
        
        // Обрабатываем статистику игроков
        if (message.startsWith('🎮 Статистика игрока:')) {
            processPlayerStats(message);
        }
        
        // Обрабатываем запросы топа
        if (message.includes('🏆 ЗАПРОС ТОПА ИГРОКОВ')) {
            console.log('Получен запрос топа игроков');
            setTimeout(() => {
                const leaderboard = generateLeaderboard();
                sendMessage(leaderboard);
            }, 2000); // Небольшая задержка для красоты
        }
    }
}

// Запуск бота
console.log('🤖 ANON Farm Leaderboard Bot запущен!');
console.log('📊 Ожидание статистики игроков...');
getUpdates();

// Периодическая очистка старых данных (игроки неактивные более 24 часов)
setInterval(() => {
    const now = Date.now();
    for (const [playerId, player] of playersStats) {
        if (now - player.lastUpdate > 24 * 60 * 60 * 1000) {
            playersStats.delete(playerId);
            console.log(`Удален неактивный игрок: ${player.name}`);
        }
    }
}, 60 * 60 * 1000); // Каждый час