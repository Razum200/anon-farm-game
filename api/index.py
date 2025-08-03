from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta

# Создаем Flask приложение
app = Flask(__name__)
CORS(app)

# Простое хранилище в памяти
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
                # Парсим ISO строку
                last_update_str = v['last_update'].replace('Z', '+00:00')
                if '+' not in last_update_str and 'T' in last_update_str:
                    last_update_str += '+00:00'
                last_update = datetime.fromisoformat(last_update_str.replace('+00:00', ''))
            else:
                last_update = v.get('last_update', datetime.now())
            
            if last_update > cutoff_time:
                active[k] = v
        except:
            # Если ошибка парсинга даты, считаем игрока активным
            active[k] = v
    return active

@app.route('/', methods=['GET'])
def index():
    """Главная страница API"""
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
        'total_players': len(players_stats),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """Получение топа игроков"""
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
            'all_players': len(players_stats),
            'updated_at': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'endpoint': 'leaderboard'
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Общая статистика"""
    try:
        active_players = get_active_players()
        
        total_tokens = sum(float(p.get('tokens', 0)) for p in active_players.values())
        avg_level = sum(int(p.get('level', 1)) for p in active_players.values()) / len(active_players) if active_players else 0
        
        return jsonify({
            'success': True,
            'total_players': len(active_players),
            'all_time_players': len(players_stats),
            'total_tokens': total_tokens,
            'total_tokens_formatted': format_number(total_tokens),
            'average_level': round(avg_level, 1),
            'updated_at': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'endpoint': 'stats'
        }), 500

@app.route('/api/submit_stats', methods=['POST'])
def submit_stats():
    """Прием статистики от игроков"""
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
        
        return jsonify({
            'success': True,
            'message': 'Stats saved successfully',
            'player_id': player_id,
            'tokens': tokens,
            'level': level
        })
    
    except Exception as e:
        return jsonify({
            'success': False, 
            'error': str(e),
            'endpoint': 'submit_stats'
        }), 400

# Для Vercel serverless функций
def handler(environ, start_response):
    return app(environ, start_response)