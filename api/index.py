from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.parse
from urllib.parse import urlparse
from datetime import datetime

# Настройки GitHub Gist (используем встроенные библиотеки Python)
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN', '')
GIST_ID = '0bbf93ba7dc734609f50be0e06c6ce94'
GIST_FILENAME = 'anon-farm-leaderboard.json'

# Хранилище игроков (память + GitHub)
players_stats = {}

def load_stats_from_gist():
    """Загружаем статистику из GitHub Gist (встроенные библиотеки)"""
    global players_stats
    try:
        if not GITHUB_TOKEN:
            print("⚠️ GitHub токен не найден, используем память")
            return
            
        print("🌐 Загружаем из GitHub Gist (urllib)...")
        
        # Создаем запрос с заголовками
        url = f'https://api.github.com/gists/{GIST_ID}'
        req = urllib.request.Request(url)
        req.add_header('Authorization', f'token {GITHUB_TOKEN}')
        req.add_header('Accept', 'application/vnd.github.v3+json')
        req.add_header('User-Agent', 'ANON-Farm-API/1.0')
        
        # Выполняем запрос
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                
                if GIST_FILENAME in data['files']:
                    content = data['files'][GIST_FILENAME]['content']
                    
                    if content.strip() and content.strip() != '{}':
                        players_stats = json.loads(content)
                        print(f"📊 Загружено {len(players_stats)} игроков из Gist")
                    else:
                        players_stats = {}
                        print("📊 Gist пустой, используем память")
                else:
                    print("📊 Файл в Gist не найден")
            else:
                print(f"❌ HTTP {response.status}")
                
    except Exception as e:
        print(f"⚠️ Ошибка загрузки Gist: {e}")
        # Продолжаем с пустой памятью

def save_stats_to_gist():
    """Сохраняем статистику в GitHub Gist (встроенные библиотеки)"""
    try:
        if not GITHUB_TOKEN or not players_stats:
            return
            
        print(f"💾 Сохраняем {len(players_stats)} игроков в Gist...")
        
        # Подготавливаем данные
        gist_data = {
            'files': {
                GIST_FILENAME: {
                    'content': json.dumps(players_stats, ensure_ascii=False, indent=2)
                }
            }
        }
        
        # Создаем PATCH запрос
        url = f'https://api.github.com/gists/{GIST_ID}'
        data = json.dumps(gist_data).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, method='PATCH')
        req.add_header('Authorization', f'token {GITHUB_TOKEN}')
        req.add_header('Accept', 'application/vnd.github.v3+json')
        req.add_header('Content-Type', 'application/json')
        req.add_header('User-Agent', 'ANON-Farm-API/1.0')
        
        # Выполняем запрос
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                print(f"✅ Успешно сохранено в Gist")
            else:
                print(f"❌ Ошибка сохранения: HTTP {response.status}")
                
    except Exception as e:
        print(f"⚠️ Ошибка сохранения в Gist: {e}")

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

# Загружаем статистику при запуске (безопасно)
try:
    load_stats_from_gist()
    print("🚀 API запущен с GitHub Gist (urllib)")
except Exception as e:
    print(f"⚠️ API запущен в режиме памяти: {e}")

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
                # Загружаем свежие данные из Gist
                load_stats_from_gist()
                
                github_status = "✅ GitHub Gist" if GITHUB_TOKEN else "⚠️ Memory only"
                
                data = {
                    'message': 'ANON Farm API',
                    'version': '7.2-github-gist-urllib', 
                    'status': f'working {github_status}',
                    'total_players': len(players_stats),
                    'gist_url': f'https://gist.github.com/Razum200/{GIST_ID}',
                    'endpoints': {
                        'leaderboard': '/api/leaderboard',
                        'submit': '/api/submit_stats'
                    },
                    'timestamp': datetime.now().isoformat()
                }
                
            # Топ игроков
            elif path == '/api/leaderboard':
                # Загружаем свежие данные из Gist
                load_stats_from_gist()
                
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
                
                print(f"📊 Отдаем топ: {len(players_stats)} игроков")
                
                data = {
                    'success': True,
                    'leaderboard': leaderboard,
                    'total_players': len(players_stats),
                    'storage': 'GitHub Gist' if GITHUB_TOKEN else 'Memory',
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
                
                # Сохраняем в GitHub Gist (асинхронно)
                save_stats_to_gist()
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                storage_info = "GitHub Gist" if GITHUB_TOKEN else "Memory only"
                
                data = {
                    'success': True,
                    'message': f'Статистика сохранена в {storage_info}',
                    'total_players': len(players_stats),
                    'storage': storage_info
                }
                
                print(f"💾 Игрок {player_data.get('name', 'Анонимный')} сохранен ({storage_info})")
                
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