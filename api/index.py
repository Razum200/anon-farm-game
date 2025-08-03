import json
from datetime import datetime, timedelta
from urllib.parse import parse_qs

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
                last_update = datetime.fromisoformat(v['last_update'].replace('Z', ''))
            else:
                last_update = v.get('last_update', datetime.now())
            
            if last_update > cutoff_time:
                active[k] = v
        except:
            active[k] = v
    return active

def handler(request):
    """Основной обработчик для Vercel"""
    try:
        # CORS заголовки
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
        
        method = request.method
        path = request.path
        
        # OPTIONS запрос для CORS
        if method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': ''
            }
        
        # Главная страница
        if path == '/' or path == '/api':
            data = {
                'message': 'ANON Farm Leaderboard API',
                'version': '2.0-vercel-simple',
                'status': 'running on Vercel ✅',
                'game_url': 'https://razum200.github.io/anon-farm-game/',
                'endpoints': {
                    'leaderboard': '/api/leaderboard',
                    'stats': '/api/stats', 
                    'submit': '/api/submit_stats'
                },
                'total_players': len(players_stats),
                'timestamp': datetime.now().isoformat()
            }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(data)
            }
        
        # Топ игроков
        elif path == '/api/leaderboard':
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
            
            data = {
                'success': True,
                'leaderboard': leaderboard,
                'total_players': len(active_players),
                'all_players': len(players_stats),
                'updated_at': datetime.now().isoformat()
            }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(data)
            }
        
        # Статистика
        elif path == '/api/stats':
            active_players = get_active_players()
            
            total_tokens = sum(float(p.get('tokens', 0)) for p in active_players.values())
            avg_level = sum(int(p.get('level', 1)) for p in active_players.values()) / len(active_players) if active_players else 0
            
            data = {
                'success': True,
                'total_players': len(active_players),
                'all_time_players': len(players_stats),
                'total_tokens': total_tokens,
                'total_tokens_formatted': format_number(total_tokens),
                'average_level': round(avg_level, 1),
                'updated_at': datetime.now().isoformat()
            }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(data)
            }
        
        # Отправка статистики
        elif path == '/api/submit_stats' and method == 'POST':
            try:
                body = request.get_json()
                if not body:
                    body = json.loads(request.data.decode('utf-8'))
                
                player_id = str(body.get('player_id', f"player_{int(datetime.now().timestamp())}"))
                name = str(body.get('name', 'Анонимный игрок'))
                tokens = float(body.get('tokens', 0))
                level = int(body.get('level', 1))
                
                # Сохраняем статистику
                players_stats[player_id] = {
                    'name': name,
                    'username': player_id,
                    'tokens': tokens,
                    'level': level,
                    'last_update': datetime.now().isoformat()
                }
                
                data = {
                    'success': True,
                    'message': 'Stats saved successfully',
                    'player_id': player_id,
                    'tokens': tokens,
                    'level': level
                }
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(data)
                }
                
            except Exception as e:
                data = {
                    'success': False,
                    'error': str(e),
                    'endpoint': 'submit_stats'
                }
                
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps(data)
                }
        
        # 404 для всех остальных маршрутов
        else:
            data = {
                'error': 'Not Found',
                'message': f'Path {path} not found',
                'available_endpoints': [
                    '/',
                    '/api/leaderboard', 
                    '/api/stats',
                    '/api/submit_stats'
                ]
            }
            
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps(data)
            }
            
    except Exception as e:
        # Общий обработчик ошибок
        data = {
            'error': 'Internal Server Error',
            'message': str(e),
            'endpoint': getattr(request, 'path', 'unknown')
        }
        
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(data)
        }