#!/usr/bin/env python3
# API сервер для топа игроков ANON Farm
# Собирает статистику из Telegram и отдает через HTTP API

from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import time
import json
import re
from datetime import datetime, timedelta
from threading import Thread

app = Flask(__name__)
CORS(app)  # Разрешаем запросы из браузера

# Настройки
BOT_TOKEN = '8459622700:AAFHx3Lv3eghzrlkyH-VLk5GwTZpx2AbEBM'
CHAT_ID = '-1002719894591'
last_update_id = 0

# Хранилище игроков
players_stats = {}

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
    """Парсинг статистики игрока"""
    if not message_text.startswith('🎮 Статистика игрока:'):
        return None
    
    try:
        lines = message_text.split('\n')
        
        # Парсим имя и username
        name_line = lines[1]
        name_match = re.search(r'👤 (.+?) \(@(.+?)\)', name_line)
        if not name_match:
            name_match = re.search(r'👤 (.+)', name_line)
            if not name_match:
                return None
            player_name = name_match.group(1)
            username = f"player_{len(players_stats)}"
        else:
            player_name = name_match.group(1)
            username = name_match.group(2)
        
        # Парсим токены
        tokens_line = lines[2]
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
            tokens = float(tokens_str.replace(',', ''))
        
        # Парсим уровень
        level_line = lines[3]
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
        print(f"❌ Ошибка парсинга: {e}")
        return None

def get_updates():
    """Получение обновлений от Telegram"""
    global last_update_id
    
    url = f'https://api.telegram.org/bot{BOT_TOKEN}/getUpdates'
    params = {
        'offset': last_update_id + 1,
        'timeout': 10
    }
    
    try:
        response = requests.get(url, params=params, timeout=15)
        if response.status_code == 200:
            data = response.json()
            if data['ok'] and data['result']:
                for update in data['result']:
                    process_update(update)
                    last_update_id = update['update_id']
        else:
            print(f"❌ Ошибка API: {response.status_code}")
    except Exception as e:
        print(f"❌ Ошибка запроса: {e}")

def process_update(update):
    """Обработка обновления"""
    if 'message' not in update:
        return
    
    message = update['message']
    
    if str(message['chat']['id']) != CHAT_ID:
        return
    
    text = message.get('text', '')
    
    # Обрабатываем статистику игроков
    if text.startswith('🎮 Статистика игрока:'):
        player_data = parse_player_stats(text)
        if player_data:
            player_id = player_data['username']
            players_stats[player_id] = player_data
            print(f"📊 {player_data['name']}: {format_number(player_data['tokens'])} токенов")

def telegram_polling():
    """Постоянное получение обновлений"""
    print("🤖 Запущен мониторинг Telegram...")
    while True:
        try:
            get_updates()
            time.sleep(2)
        except Exception as e:
            print(f"❌ Ошибка polling: {e}")
            time.sleep(5)

# API endpoints

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """Получение топа игроков"""
    try:
        # Фильтруем актуальных игроков (не старше 24 часов)
        cutoff_time = datetime.now() - timedelta(hours=24)
        active_players = {
            k: v for k, v in players_stats.items() 
            if v['last_update'] > cutoff_time
        }
        
        # Сортируем по токенам
        sorted_players = sorted(
            active_players.values(), 
            key=lambda x: x['tokens'], 
            reverse=True
        )[:10]
        
        # Форматируем для отправки
        leaderboard = []
        for i, player in enumerate(sorted_players):
            leaderboard.append({
                'rank': i + 1,
                'name': player['name'],
                'tokens': player['tokens'],
                'tokens_formatted': format_number(player['tokens']),
                'level': player['level']
            })
        
        return jsonify({
            'success': True,
            'leaderboard': leaderboard,
            'total_players': len(active_players),
            'updated_at': datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"❌ Ошибка API: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Общая статистика"""
    cutoff_time = datetime.now() - timedelta(hours=24)
    active_players = {
        k: v for k, v in players_stats.items() 
        if v['last_update'] > cutoff_time
    }
    
    total_tokens = sum(p['tokens'] for p in active_players.values())
    avg_level = sum(p['level'] for p in active_players.values()) / len(active_players) if active_players else 0
    
    return jsonify({
        'success': True,
        'total_players': len(active_players),
        'total_tokens': total_tokens,
        'total_tokens_formatted': format_number(total_tokens),
        'average_level': round(avg_level, 1)
    })

@app.route('/api/submit_stats', methods=['POST'])
def submit_stats():
    """Прием статистики напрямую от игроков"""
    try:
        data = request.json
        player_id = data.get('player_id', f"player_{len(players_stats)}")
        
        player_data = {
            'name': data.get('name', 'Анонимный игрок'),
            'username': player_id,
            'tokens': float(data.get('tokens', 0)),
            'level': int(data.get('level', 1)),
            'last_update': datetime.now()
        }
        
        players_stats[player_id] = player_data
        print(f"📊 Получена статистика: {player_data['name']} - {format_number(player_data['tokens'])}")
        
        return jsonify({'success': True})
    
    except Exception as e:
        print(f"❌ Ошибка submit: {e}")
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/', methods=['GET'])
def index():
    """Главная страница API"""
    return jsonify({
        'message': 'ANON Farm Leaderboard API',
        'version': '1.0',
        'endpoints': {
            '/api/leaderboard': 'Топ игроков',
            '/api/stats': 'Общая статистика',
            '/api/submit_stats': 'Отправка статистики'
        }
    })

if __name__ == '__main__':
    print("🚀 ANON Farm Leaderboard API")
    print("📊 Запуск сервера...")
    
    # Запускаем Telegram polling в отдельном потоке
    telegram_thread = Thread(target=telegram_polling)
    telegram_thread.daemon = True
    telegram_thread.start()
    
    # Запускаем Flask сервер
    app.run(host='0.0.0.0', port=8000, debug=False)