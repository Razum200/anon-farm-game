#!/usr/bin/env python3
# Автоматический ответчик на запросы топа игроков ANON Farm
# Использует существующего бота статистики

import requests
import time
import json
from collections import defaultdict
from datetime import datetime
import re

# Настройки (ваш существующий бот)
BOT_TOKEN = '8459622700:AAFHx3Lv3eghzrlkyH-VLk5GwTZpx2AbEBM'
CHAT_ID = '-1002719894591'
last_update_id = 0

# Хранилище статистики игроков
players_stats = {}

def send_message(text):
    """Отправка сообщения в Telegram"""
    url = f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage'
    data = {
        'chat_id': CHAT_ID,
        'text': text,
        'parse_mode': 'HTML'
    }
    try:
        response = requests.post(url, data=data, timeout=10)
        if response.status_code == 200:
            print(f"✅ Сообщение отправлено")
        else:
            print(f"❌ Ошибка отправки: {response.status_code}")
    except Exception as e:
        print(f"❌ Ошибка: {e}")

def format_number(num):
    """Форматирование чисел"""
    if num >= 1000000000:
        return f"{num/1000000000:.1f}B"
    elif num >= 1000000:
        return f"{num/1000000:.1f}M"
    elif num >= 1000:
        return f"{num/1000:.1f}K"
    else:
        return str(int(num))

def parse_player_stats(message_text):
    """Парсинг статистики игрока из сообщения"""
    if not message_text.startswith('🎮 Статистика игрока:'):
        return None
    
    try:
        lines = message_text.split('\n')
        
        # Парсим имя и username
        name_line = lines[1]  # 👤 Razum (@razum200)
        name_match = re.search(r'👤 (.+?) \(@(.+?)\)', name_line)
        if not name_match:
            return None
        
        player_name = name_match.group(1)
        username = name_match.group(2)
        
        # Парсим токены
        tokens_line = lines[2]  # 💰 Токены: 15.2K
        tokens_match = re.search(r'💰 Токены: (.+)', tokens_line)
        if not tokens_match:
            return None
        
        tokens_str = tokens_match.group(1)
        
        # Конвертируем токены в число
        if 'K' in tokens_str:
            tokens = float(tokens_str.replace('K', '')) * 1000
        elif 'M' in tokens_str:
            tokens = float(tokens_str.replace('M', '')) * 1000000
        elif 'B' in tokens_str:
            tokens = float(tokens_str.replace('B', '')) * 1000000000
        else:
            tokens = float(tokens_str)
        
        # Парсим уровень
        level_line = lines[3]  # 🏆 Уровень: 7
        level_match = re.search(r'🏆 Уровень: (\d+)', level_line)
        level = int(level_match.group(1)) if level_match else 1
        
        return {
            'name': player_name,
            'username': username,
            'tokens': tokens,
            'level': level,
            'last_update': datetime.now()
        }
    
    except Exception as e:
        print(f"❌ Ошибка парсинга статистики: {e}")
        return None

def generate_leaderboard():
    """Создание топа игроков"""
    if not players_stats:
        return ("🏆 ANON Farm - Глобальный топ игроков\n\n"
                "📊 Пока нет данных о игроках\n"
                "🎮 Начните играть чтобы попасть в топ!\n\n"
                "🔥 Stay $ANON!")
    
    # Сортируем игроков по токенам
    sorted_players = sorted(players_stats.values(), key=lambda x: x['tokens'], reverse=True)[:10]
    
    message = "🏆 ANON Farm - Глобальный топ игроков\n\n"
    
    for i, player in enumerate(sorted_players):
        if i == 0:
            medal = "🥇"
        elif i == 1:
            medal = "🥈"
        elif i == 2:
            medal = "🥉"
        else:
            medal = f"{i+1}."
        
        message += f"{medal} <b>{player['name']}</b>\n"
        message += f"💰 {format_number(player['tokens'])} $ANON токенов\n"
        message += f"🏆 Уровень {player['level']}\n\n"
    
    message += f"📊 Всего игроков: {len(players_stats)}\n"
    message += f"⏰ Обновлено: {datetime.now().strftime('%d.%m.%Y, %H:%M')}\n\n"
    message += "🔥 Stay $ANON!"
    
    return message

def get_updates():
    """Получение обновлений от Telegram"""
    global last_update_id
    
    url = f'https://api.telegram.org/bot{BOT_TOKEN}/getUpdates'
    params = {
        'offset': last_update_id + 1,
        'timeout': 30
    }
    
    try:
        response = requests.get(url, params=params, timeout=35)
        if response.status_code == 200:
            data = response.json()
            if data['ok'] and data['result']:
                for update in data['result']:
                    process_update(update)
                    last_update_id = update['update_id']
                return True
        else:
            print(f"❌ Ошибка получения обновлений: {response.status_code}")
    except Exception as e:
        print(f"❌ Ошибка запроса: {e}")
    
    return False

def process_update(update):
    """Обработка обновления"""
    if 'message' not in update:
        return
    
    message = update['message']
    
    # Проверяем что сообщение из нужного чата
    if str(message['chat']['id']) != CHAT_ID:
        return
    
    text = message.get('text', '')
    
    # Обрабатываем статистику игроков
    if text.startswith('🎮 Статистика игрока:'):
        player_data = parse_player_stats(text)
        if player_data:
            player_id = player_data['username']
            players_stats[player_id] = player_data
            print(f"📊 Обновлена статистика: {player_data['name']} - {format_number(player_data['tokens'])} токенов")
    
    # Обрабатываем запросы топа
    elif '🏆 ЗАПРОС ТОПА ИГРОКОВ' in text:
        print("🏆 Получен запрос топа игроков")
        
        # Небольшая задержка для красоты
        time.sleep(2)
        
        # Отправляем топ
        leaderboard = generate_leaderboard()
        send_message(leaderboard)

def main():
    """Главная функция"""
    print("🤖 ANON Farm Auto Leaderboard запущен!")
    print("📊 Ожидание сообщений...")
    print(f"💬 Чат: {CHAT_ID}")
    print("=" * 50)
    
    while True:
        try:
            get_updates()
            time.sleep(1)  # Небольшая пауза между запросами
        except KeyboardInterrupt:
            print("\n👋 Остановка бота...")
            break
        except Exception as e:
            print(f"❌ Неожиданная ошибка: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()