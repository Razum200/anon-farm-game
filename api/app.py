from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import json

# Создаем Flask приложение
app = Flask(__name__)
CORS(app)

# Простое хранилище в памяти (в продакшене используйте базу данных)
players_stats = {}

def format_number(num):
    """Форматирование чисел"""
    try:
        num = float(num)
        if num >= 1000000000:
            return f"{num/1000000000:.1f}B"
        elif num >= 1000000:
            return f"{num/1000000:.1f}M"
        elif num >= 1000:
            return f"{num/1000:.1f}K"
        else:
            return str(int(num))
    except:
        return "0"

def get_active_players():
    """Получение активных игроков"""
    cutoff_time = datetime.now() - timedelta(hours=24)
    active = {}
    for k, v in players_stats.items():
        try:
            if isinstance(v.get('last_update'), str):
                last_update = datetime.fromisoformat(v['last_update'].replace('Z', '+00:00'))
            else:
                last_update = v.get('last_update', datetime.now())
            
            if last_update > cutoff_time:
                active[k] = v
        except:
            continue
    return active

@app.route('/', methods=['GET', 'OPTIONS'])
@app.route('/api', methods=['GET', 'OPTIONS'])
def index():
    """Главная страница API"""
    if request.method == 'OPTIONS':
        return '', 200
        
    return jsonify({
        'message': 'ANON Farm Leaderboard API',
        'version': '2.0-vercel',
        'status': 'running on Vercel ✅',
        'game_url': 'https://razum200.github.io/anon-farm-game/',
        'endpoints': {
            'leaderboard': '/api/leaderboard',
            'stats': '/api/stats', 
            'submit': '/api/submit_stats'
        },
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/leaderboard', methods=['GET', 'OPTIONS'])
def get_leaderboard():
    """Получение топа игроков"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        active_players = get_active_players()
        
        # Сортируем по токенам
        sorted_players = sorted(
            active_players.values(), 
            key=lambda x: float(x.get('tokens', 0)), 
            reverse=True
        )[:10]
        
        # Форматируем для отправки
        leaderboard = []
        for i, player in enumerate(sorted_players):
            leaderboard.append({
                'rank': i + 1,
                'name': player.get('name', 'Анонимный игрок'),
                'tokens': float(player.get('tokens', 0)),
                'tokens_formatted': format_number(player.get('tokens', 0)),
                'level': int(player.get('level', 1))
            })
        
        return jsonify({
            'success': True,
            'leaderboard': leaderboard,
            'total_players': len(active_players),
            'updated_at': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'debug': 'leaderboard endpoint'
        }), 500

@app.route('/api/stats', methods=['GET', 'OPTIONS'])
def get_stats():
    """Общая статистика"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        active_players = get_active_players()
        
        total_tokens = sum(float(p.get('tokens', 0)) for p in active_players.values())
        avg_level = sum(int(p.get('level', 1)) for p in active_players.values()) / len(active_players) if active_players else 0
        
        return jsonify({
            'success': True,
            'total_players': len(active_players),
            'total_tokens': total_tokens,
            'total_tokens_formatted': format_number(total_tokens),
            'average_level': round(avg_level, 1),
            'updated_at': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/submit_stats', methods=['POST', 'OPTIONS'])
def submit_stats():
    """Прием статистики от игроков"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
            
        player_id = str(data.get('player_id', f"player_{int(datetime.now().timestamp())}"))
        name = str(data.get('name', 'Анонимный игрок'))
        tokens = float(data.get('tokens', 0))
        level = int(data.get('level', 1))
        
        # Сохраняем статистику
        players_stats[player_id] = {
            'name': name,
            'username': player_id,
            'tokens': tokens,
            'level': level,
            'last_update': datetime.now().isoformat()
        }
        
        print(f"📊 Получена статистика: {name} - {format_number(tokens)}")
        
        return jsonify({
            'success': True,
            'message': 'Stats saved successfully',
            'player_id': player_id
        })
    
    except Exception as e:
        return jsonify({
            'success': False, 
            'error': str(e)
        }), 400

# Для Vercel
def handler(environ, start_response):
    return app(environ, start_response)

if __name__ == '__main__':
    app.run(debug=True, port=5000)