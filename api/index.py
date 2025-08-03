from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime
from urllib.parse import urlparse

# Простое хранилище игроков (в памяти)
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

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Обработчик GET запросов"""
        try:
            path = urlparse(self.path).path
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            # Главная страница
            if path == '/' or path == '/api':
                data = {
                    'message': 'ANON Farm API',
                    'version': '7.1-memory-only', 
                    'status': 'working ✅',
                    'total_players': len(players_stats),
                    'endpoints': {
                        'leaderboard': '/api/leaderboard',
                        'submit': '/api/submit_stats'
                    },
                    'timestamp': datetime.now().isoformat()
                }
                
            # Топ игроков
            elif path == '/api/leaderboard':
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
            
            # 404 для остальных
            else:
                self.send_response(404)
                data = {
                    'error': 'Not Found',
                    'message': f'Endpoint {path} not found'
                }
                
            self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            data = {'error': 'Internal Server Error', 'message': str(e)}
            self.wfile.write(json.dumps(data).encode())
    
    def do_POST(self):
        """Обработчик POST запросов"""
        try:
            path = urlparse(self.path).path
            
            if path == '/api/submit_stats':
                # Читаем данные
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                player_data = json.loads(post_data.decode('utf-8'))
                
                # Сохраняем в память
                player_id = player_data.get('user_id', 'unknown')
                players_stats[player_id] = player_data
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                data = {
                    'success': True,
                    'message': 'Статистика сохранена в памяти',
                    'total_players': len(players_stats)
                }
                
                self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
            
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                data = {'error': 'Not Found'}
                self.wfile.write(json.dumps(data).encode())
                
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            data = {'error': 'POST Error', 'message': str(e)}
            self.wfile.write(json.dumps(data).encode())
        
    def do_OPTIONS(self):
        """CORS обработка"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()