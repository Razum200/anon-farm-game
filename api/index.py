from http.server import BaseHTTPRequestHandler
import json
import os
from datetime import datetime, timedelta
from urllib.parse import urlparse, parse_qs

# Файл для постоянного хранения
STATS_FILE = '/tmp/anon_farm_stats.json'

# Глобальное хранилище игроков
players_stats = {}

def load_stats():
    """Загружаем статистику из файла"""
    global players_stats
    try:
        if os.path.exists(STATS_FILE):
            with open(STATS_FILE, 'r', encoding='utf-8') as f:
                players_stats = json.load(f)
            print(f"📊 Загружено {len(players_stats)} игроков из файла")
        else:
            players_stats = {}
            print("📊 Создан новый файл статистики")
    except Exception as e:
        print(f"❌ Ошибка загрузки статистики: {e}")
        players_stats = {}

def save_stats():
    """Сохраняем статистику в файл"""
    try:
        # Очищаем старых игроков (неактивных больше 24 часов)
        cutoff_time = datetime.now() - timedelta(hours=24)
        active_players = {}
        
        for player_id, player_data in players_stats.items():
            last_update = datetime.fromisoformat(player_data.get('last_update', datetime.now().isoformat()))
            if last_update > cutoff_time:
                active_players[player_id] = player_data
        
        players_stats.clear()
        players_stats.update(active_players)
        
        with open(STATS_FILE, 'w', encoding='utf-8') as f:
            json.dump(players_stats, f, ensure_ascii=False, indent=2)
        print(f"💾 Сохранено {len(players_stats)} активных игроков")
    except Exception as e:
        print(f"❌ Ошибка сохранения: {e}")

# Загружаем статистику при запуске
load_stats()

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

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Обработка CORS preflight запросов"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def do_GET(self):
        """Обработка GET запросов"""
        try:
            path = urlparse(self.path).path
            
            # CORS заголовки
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # Главная страница
            if path == '/' or path == '/api':
                data = {
                    'message': 'ANON Farm Leaderboard API',
                    'version': '2.0-vercel-http',
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
                
                self.wfile.write(json.dumps(data).encode())
                return
            
            # Топ игроков
            elif path == '/api/leaderboard':
                # Загружаем актуальную статистику
                load_stats()
                
                # Сортируем игроков по токенам
                sorted_players = sorted(
                    players_stats.values(),
                    key=lambda x: float(x.get('tokens', 0)),
                    reverse=True
                )[:10]
                
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
                    'total_players': len(players_stats),
                    'updated_at': datetime.now().isoformat()
                }
                
                self.wfile.write(json.dumps(data).encode())
                return
            
            # Статистика
            elif path == '/api/stats':
                total_tokens = sum(float(p.get('tokens', 0)) for p in players_stats.values())
                avg_level = sum(int(p.get('level', 1)) for p in players_stats.values()) / len(players_stats) if players_stats else 0
                
                data = {
                    'success': True,
                    'total_players': len(players_stats),
                    'total_tokens': total_tokens,
                    'total_tokens_formatted': format_number(total_tokens),
                    'average_level': round(avg_level, 1),
                    'updated_at': datetime.now().isoformat()
                }
                
                self.wfile.write(json.dumps(data).encode())
                return
            
            # 404 для всех остальных
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                data = {
                    'error': 'Not Found',
                    'message': f'Endpoint {path} not found',
                    'available': ['/', '/api/leaderboard', '/api/stats', '/api/submit_stats']
                }
                
                self.wfile.write(json.dumps(data).encode())
                return
                
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            data = {
                'error': 'Internal Server Error',
                'message': str(e)
            }
            
            self.wfile.write(json.dumps(data).encode())
    
    def do_POST(self):
        """Обработка POST запросов"""
        try:
            path = urlparse(self.path).path
            
            if path == '/api/submit_stats':
                # Читаем данные
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                # Сохраняем статистику
                player_id = str(data.get('player_id', f"player_{int(datetime.now().timestamp())}"))
                name = str(data.get('name', 'Анонимный игрок'))
                tokens = float(data.get('tokens', 0))
                level = int(data.get('level', 1))
                
                players_stats[player_id] = {
                    'name': name,
                    'username': player_id,
                    'tokens': tokens,
                    'level': level,
                    'last_update': datetime.now().isoformat()
                }
                
                # Сохраняем в файл
                save_stats()
                
                # Отправляем ответ
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response_data = {
                    'success': True,
                    'message': 'Stats saved successfully',
                    'player_id': player_id,
                    'tokens': tokens,
                    'level': level
                }
                
                self.wfile.write(json.dumps(response_data).encode())
                return
            
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                data = {
                    'error': 'Not Found',
                    'message': f'POST endpoint {path} not found'
                }
                
                self.wfile.write(json.dumps(data).encode())
                
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            data = {
                'error': 'Internal Server Error',
                'message': str(e)
            }
            
            self.wfile.write(json.dumps(data).encode())