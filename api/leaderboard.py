from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from datetime import datetime, timedelta
import re

app = Flask(__name__)
CORS(app)  # Разрешаем все CORS запросы

# Хранилище игроков (в продакшене лучше использовать базу данных)
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

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """Получение топа игроков"""
    try:
        # Фильтруем актуальных игроков (не старше 24 часов)
        cutoff_time = datetime.now() - timedelta(hours=24)
        active_players = {
            k: v for k, v in players_stats.items() 
            if v.get('last_update', datetime.now()) > cutoff_time
        }
        
        # Сортируем по токенам
        sorted_players = sorted(
            active_players.values(), 
            key=lambda x: x.get('tokens', 0), 
            reverse=True
        )[:10]
        
        # Форматируем для отправки
        leaderboard = []
        for i, player in enumerate(sorted_players):
            leaderboard.append({
                'rank': i + 1,
                'name': player.get('name', 'Анонимный игрок'),
                'tokens': player.get('tokens', 0),
                'tokens_formatted': format_number(player.get('tokens', 0)),
                'level': player.get('level', 1)
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
    try:
        cutoff_time = datetime.now() - timedelta(hours=24)
        active_players = {
            k: v for k, v in players_stats.items() 
            if v.get('last_update', datetime.now()) > cutoff_time
        }
        
        total_tokens = sum(p.get('tokens', 0) for p in active_players.values())
        avg_level = sum(p.get('level', 1) for p in active_players.values()) / len(active_players) if active_players else 0
        
        return jsonify({
            'success': True,
            'total_players': len(active_players),
            'total_tokens': total_tokens,
            'total_tokens_formatted': format_number(total_tokens),
            'average_level': round(avg_level, 1)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/submit_stats', methods=['POST'])
def submit_stats():
    """Прием статистики от игроков"""
    try:
        data = request.json
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
            
        player_id = str(data.get('player_id', f"player_{len(players_stats)}"))
        
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

@app.route('/api/', methods=['GET'])
@app.route('/api', methods=['GET'])
def api_info():
    """Информация об API"""
    return jsonify({
        'message': 'ANON Farm Leaderboard API',
        'version': '2.0-vercel',
        'endpoints': {
            '/api/leaderboard': 'Топ игроков',
            '/api/stats': 'Общая статистика',
            '/api/submit_stats': 'Отправка статистики'
        },
        'status': 'online',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/', methods=['GET'])
def index():
    """Главная страница"""
    return jsonify({
        'message': 'ANON Farm Leaderboard API',
        'version': '2.0-vercel',
        'status': 'running on Vercel',
        'game_url': 'https://razum200.github.io/anon-farm-game/',
        'docs': {
            'leaderboard': '/api/leaderboard',
            'stats': '/api/stats',
            'submit': '/api/submit_stats'
        }
    })

# Для Vercel serverless функций
def handler(request):
    return app(request.environ, lambda status, headers: None)

if __name__ == '__main__':
    app.run(debug=False)