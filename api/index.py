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

# PvP игры 21
pvp_games = {}
active_players = {}  # Игроки в поиске

def load_stats_from_gist():
    """Загружаем статистику из GitHub Gist (встроенные библиотеки)"""
    global players_stats
    try:
        print(f"🔍 ДИАГНОСТИКА ЗАГРУЗКИ:")
        print(f"   - GITHUB_TOKEN есть: {bool(GITHUB_TOKEN)}")
        
        if not GITHUB_TOKEN:
            print("⚠️ GitHub токен не найден, используем память")
            return
            
        print("🌐 Загружаем из GitHub Gist (urllib)...")
        
        # Создаем запрос с заголовками
        url = f'https://api.github.com/gists/{GIST_ID}'
        req = urllib.request.Request(url)
        req.add_header('Authorization', f'Bearer {GITHUB_TOKEN}')
        req.add_header('Accept', 'application/vnd.github.v3+json')
        req.add_header('User-Agent', 'ANON-Farm-API/1.0')
        
        print(f"🌐 Запрашиваем: {url}")
        
        # Выполняем запрос
        with urllib.request.urlopen(req, timeout=10) as response:
            print(f"📡 Ответ GitHub: HTTP {response.status}")
            
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                print(f"📄 Получили данные Gist, файлов: {len(data.get('files', {}))}")
                
                if GIST_FILENAME in data['files']:
                    content = data['files'][GIST_FILENAME]['content']
                    print(f"📄 Содержимое файла ({len(content)} символов): {content[:100]}...")
                    
                    if content.strip() and content.strip() != '{}':
                        players_stats = json.loads(content)
                        print(f"📊 Загружено {len(players_stats)} игроков из Gist")
                        print(f"📊 Игроки: {list(players_stats.keys())}")
                    else:
                        players_stats = {}
                        print("📊 Gist пустой ({}), используем память")
                else:
                    print(f"📊 Файл {GIST_FILENAME} не найден в Gist")
                    print(f"📊 Доступные файлы: {list(data.get('files', {}).keys())}")
            else:
                print(f"❌ HTTP {response.status}")
                
    except Exception as e:
        print(f"⚠️ Ошибка загрузки Gist: {e}")
        print(f"⚠️ Тип ошибки: {type(e).__name__}")
        # Продолжаем с пустой памятью

def save_stats_to_gist():
    """Сохраняем статистику в GitHub Gist (встроенные библиотеки)"""
    print(f"🔧 ВХОД В save_stats_to_gist() - НАЧАЛО ФУНКЦИИ")
    try:
        print(f"🔍 ДИАГНОСТИКА СОХРАНЕНИЯ:")
        print(f"   - GITHUB_TOKEN есть: {bool(GITHUB_TOKEN)}")
        print(f"   - Длина токена: {len(GITHUB_TOKEN) if GITHUB_TOKEN else 0}")
        print(f"   - Игроков в памяти: {len(players_stats)}")
        print(f"   - Данные игроков: {list(players_stats.keys()) if players_stats else 'Пусто'}")
        print(f"   - GIST_ID: {GIST_ID}")
        print(f"   - GIST_FILENAME: {GIST_FILENAME}")
        
        if not GITHUB_TOKEN:
            print("❌ ПРОБЛЕМА: GitHub токен НЕ найден в переменных окружения!")
            print("❌ Нужно добавить GITHUB_TOKEN в настройки Vercel")
            return
            
        if not players_stats:
            print("❌ ПРОБЛЕМА: Данные игроков пусты, нечего сохранять")
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
        
        print(f"🔧 Подготовили JSON ({len(json.dumps(gist_data))} символов)")
        
        # Создаем PATCH запрос
        url = f'https://api.github.com/gists/{GIST_ID}'
        data = json.dumps(gist_data).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, method='PATCH')
        req.add_header('Authorization', f'Bearer {GITHUB_TOKEN}')
        req.add_header('Accept', 'application/vnd.github.v3+json')
        req.add_header('Content-Type', 'application/json')
        req.add_header('User-Agent', 'ANON-Farm-API/1.0')
        
        print(f"🔧 Используем Bearer авторизацию: Bearer {GITHUB_TOKEN[:8]}...{GITHUB_TOKEN[-4:]}")
        
        print(f"🌐 Отправляем PATCH запрос в GitHub...")
        
        # Выполняем запрос
        with urllib.request.urlopen(req, timeout=15) as response:
            if response.status == 200:
                print(f"✅ Успешно сохранено в Gist! Статус: {response.status}")
                response_data = response.read().decode('utf-8')
                print(f"📝 Ответ GitHub: {response_data[:100]}...")
            else:
                print(f"❌ Ошибка сохранения: HTTP {response.status}")
                error_data = response.read().decode('utf-8')
                print(f"📝 Ошибка GitHub: {error_data}")
                
    except Exception as e:
        print(f"⚠️ КРИТИЧЕСКАЯ ОШИБКА сохранения в Gist: {e}")
        print(f"⚠️ Тип ошибки: {type(e).__name__}")
        import traceback
        print(f"⚠️ Полная ошибка: {traceback.format_exc()}")

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

def remove_player_from_leaderboard(player_id):
    """Удаляем игрока из лидерборда"""
    global players_stats
    
    if player_id in players_stats:
        removed_player = players_stats.pop(player_id)
        print(f"🗑️ Игрок {player_id} удален из лидерборда")
        
        # Сохраняем обновленные данные
        try:
            save_stats_to_gist()
            print(f"💾 Обновленные данные сохранены в Gist")
        except Exception as e:
            print(f"⚠️ Ошибка сохранения в Gist: {e}")
        
        return {
            'success': True,
            'message': f'Игрок {removed_player.get("name", "Анонимный")} удален',
            'removed_player': removed_player
        }
    else:
        return {
            'success': False,
            'error': 'Игрок не найден'
        }

# PvP функции для игры 21
def create_pvp_game(player1_id, player1_name, bet_amount):
    """Создаем новую PvP игру"""
    global players_stats
    global pvp_games, active_players
    game_id = f"game_{len(pvp_games)}_{int(datetime.now().timestamp())}"
    
    game = {
        'id': game_id,
        'player1': {
            'id': player1_id,
            'name': player1_name,
            'hand': [],
            'bet': bet_amount,
            'ready': False
        },
        'player2': None,
        'deck': create_deck(),
        'state': 'waiting',  # waiting, playing, finished
        'current_turn': None,
        'created_at': datetime.now().isoformat(),
        'player1_stood': False,
        'player2_stood': False
    }
    
    # Снимаем ставку с баланса игрока
    print(f"🔍 Отладка: player1_id = {player1_id}")
    print(f"🔍 Отладка: players_stats keys = {list(players_stats.keys())}")
    if player1_id in players_stats:
        print(f"🔍 Отладка: Снимаем {bet_amount} с баланса игрока {player1_id}")
        players_stats[player1_id]['tokens'] -= bet_amount
        print(f"🔍 Отладка: Новый баланс = {players_stats[player1_id]['tokens']}")
    else:
        print(f"🔍 Отладка: Игрок {player1_id} не найден в players_stats")
    
    pvp_games[game_id] = game
    active_players[player1_id] = game_id
    
    print(f"🎮 Создана PvP игра {game_id} для игрока {player1_name}")
    print(f"🎮 Всего игр в pvp_games: {len(pvp_games)}")
    print(f"🎮 Ключи игр: {list(pvp_games.keys())}")
    return game

def create_deck():
    """Создаем колоду карт"""
    deck = []
    suits = ['♠', '♥', '♦', '♣']
    values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    
    for suit in suits:
        for value in values:
            deck.append({
                'suit': suit,
                'value': value,
                'isRed': suit in ['♥', '♦']
            })
    
    # Перемешиваем колоду
    import random
    random.shuffle(deck)
    return deck

def calculate_hand_value(hand):
    """Подсчитываем очки руки"""
    value = 0
    aces = 0
    
    for card in hand:
        if card['value'] == 'A':
            aces += 1
            value += 11
        elif card['value'] in ['K', 'Q', 'J']:
            value += 10
        else:
            value += int(card['value'])
    
    # Корректируем тузы
    while value > 21 and aces > 0:
        value -= 10
        aces -= 1
    
    return value

def join_pvp_game(game_id, player2_id, player2_name):
    """Присоединяемся к PvP игре"""
    global players_stats
    global pvp_games, active_players
    if game_id not in pvp_games:
        return {'success': False, 'error': 'Игра не найдена'}
    
    game = pvp_games[game_id]
    if game['state'] != 'waiting':
        return {'success': False, 'error': 'Игра уже началась'}
    
    if game['player1']['id'] == player2_id:
        return {'success': False, 'error': 'Нельзя играть против себя'}
    
    # Проверяем баланс игрока 2
    player2_stats = players_stats.get(player2_id, {})
    if player2_stats.get('tokens', 0) < game['player1']['bet']:
        return {'success': False, 'error': 'Недостаточно $ANON для ставки'}
    
    game['player2'] = {
        'id': player2_id,
        'name': player2_name,
        'hand': [],
        'bet': game['player1']['bet'],
        'ready': False
    }
    
    game['state'] = 'playing'
    game['current_turn'] = player2_id  # Второй игрок ходит первым
    
    # Раздаем карты
    game['player1']['hand'] = [game['deck'].pop(), game['deck'].pop()]
    game['player2']['hand'] = [game['deck'].pop(), game['deck'].pop()]
    
    # Снимаем ставки
    if player2_id in players_stats:
        players_stats[player2_id]['tokens'] -= game['player1']['bet']
    
    # Удаляем из активных игроков
    if player2_id in active_players:
        del active_players[player2_id]
    
    print(f"🎮 Игрок {player2_name} присоединился к игре {game_id}")
    return {'success': True, 'game': game}

def get_available_games(player_id):
    """Получаем доступные игры"""
    print(f"🔍 get_available_games вызвана для player_id: {player_id}")
    print(f"🔍 Всего игр в pvp_games: {len(pvp_games)}")
    print(f"🔍 Ключи игр: {list(pvp_games.keys())}")
    
    available = []
    for game_id, game in pvp_games.items():
        print(f"🔍 Проверяем игру {game_id}:")
        print(f"   - state: {game['state']}")
        print(f"   - player1_id: {game['player1']['id']}")
        print(f"   - player_id: {player_id}")
        
        if (game['state'] == 'waiting' and 
            game['player1']['id'] != player_id):
            available.append({
                'id': game_id,
                'player1_name': game['player1']['name'],
                'bet': game['player1']['bet'],
                'created_at': game['created_at']
            })
            print(f"   ✅ Игра {game_id} добавлена в доступные")
        else:
            print(f"   ❌ Игра {game_id} не подходит")
    
    print(f"🔍 Возвращаем {len(available)} доступных игр")
    return available

def make_pvp_move(game_id, player_id, action):
    """Делаем ход в PvP игре"""
    global pvp_games, players_stats
    
    print(f"🎮 make_pvp_move: game_id={game_id}, player_id={player_id}, action={action}")
    print(f"🎮 Всего игр в pvp_games: {len(pvp_games)}")
    print(f"🎮 Ключи игр: {list(pvp_games.keys())}")
    
    if game_id not in pvp_games:
        print(f"❌ Игра {game_id} не найдена")
        return {'success': False, 'error': 'Игра не найдена'}
    
    game = pvp_games[game_id]
    print(f"🎮 Найдена игра: state={game['state']}, current_turn={game.get('current_turn')}")
    
    if game['state'] != 'playing':
        print(f"❌ Игра не в состоянии 'playing'")
        return {'success': False, 'error': 'Игра не активна'}
    
    if game['current_turn'] != player_id:
        return {'success': False, 'error': 'Не ваш ход'}
    
    # Определяем игрока
    player = None
    if game['player1']['id'] == player_id:
        player = game['player1']
    elif game['player2'] and game['player2']['id'] == player_id:
        player = game['player2']
    else:
        return {'success': False, 'error': 'Вы не участник этой игры'}
    
    if action == 'hit':
        # Берем карту
        if len(game['deck']) > 0:
            player['hand'].append(game['deck'].pop())
            player_value = calculate_hand_value(player['hand'])
            
            if player_value > 21:
                # Перебор - игра окончена
                end_pvp_game(game_id, 'bust', player_id)
                return {'success': True, 'game': game, 'result': 'bust'}
            elif player_value == 21:
                # 21 - автоматически стоп
                game['current_turn'] = get_opponent_id(game, player_id)
                return {'success': True, 'game': game, 'result': 'stand'}
            else:
                # Продолжаем
                game['current_turn'] = get_opponent_id(game, player_id)
                return {'success': True, 'game': game}
    
    elif action == 'stand':
        # Стоп
        game['current_turn'] = get_opponent_id(game, player_id)
        
        # Отмечаем, что игрок сделал ход "stand"
        if game['player1']['id'] == player_id:
            game['player1_stood'] = True
        elif game['player2']['id'] == player_id:
            game['player2_stood'] = True
            
        return {'success': True, 'game': game}
    
    elif action == 'double':
        # Удвоение (только на первом ходу)
        if len(player['hand']) != 2:
            return {'success': False, 'error': 'Удвоение возможно только на первом ходу'}
        
        # Проверяем баланс
        player_stats = players_stats.get(player_id, {})
        if player_stats.get('tokens', 0) < player['bet']:
            return {'success': False, 'error': 'Недостаточно $ANON для удвоения'}
        
        # Удваиваем ставку
        player['bet'] *= 2
        players_stats[player_id]['tokens'] -= player['bet'] // 2
        
        # Берем одну карту
        if len(game['deck']) > 0:
            player['hand'].append(game['deck'].pop())
        
        # Автоматически стоп
        game['current_turn'] = get_opponent_id(game, player_id)
        return {'success': True, 'game': game, 'result': 'double'}
    
    return {'success': False, 'error': 'Неизвестное действие'}

def get_opponent_id(game, player_id):
    """Получаем ID противника"""
    if game['player1']['id'] == player_id:
        return game['player2']['id'] if game['player2'] else None
    else:
        return game['player1']['id']

def end_pvp_game(game_id, reason, winner_id=None):
    """Завершаем PvP игру"""
    global players_stats
    global pvp_games
    if game_id not in pvp_games:
        return
    
    game = pvp_games[game_id]
    game['state'] = 'finished'
    
    player1_value = calculate_hand_value(game['player1']['hand'])
    player2_value = calculate_hand_value(game['player2']['hand']) if game['player2'] else 0
    
    # Определяем победителя
    if reason == 'bust':
        winner_id = get_opponent_id(game, winner_id)
    elif reason == 'normal':
        if player1_value > player2_value:
            winner_id = game['player1']['id']
        elif player2_value > player1_value:
            winner_id = game['player2']['id']
        else:
            winner_id = None  # Ничья
    
    # Распределяем выигрыш
    total_pot = game['player1']['bet'] + game['player2']['bet']
    
    if winner_id:
        # Победитель получает весь банк
        if winner_id in players_stats:
            players_stats[winner_id]['tokens'] += total_pot
    else:
        # Ничья - возвращаем ставки
        if game['player1']['id'] in players_stats:
            players_stats[game['player1']['id']]['tokens'] += game['player1']['bet']
        if game['player2']['id'] in players_stats:
            players_stats[game['player2']['id']]['tokens'] += game['player2']['bet']
    
    game['winner'] = winner_id
    game['result'] = reason
    game['final_values'] = {
        'player1': player1_value,
        'player2': player2_value
    }
    
    print(f"🎮 Игра {game_id} завершена. Победитель: {winner_id}")
    
    # Сохраняем обновленные данные
    try:
        save_stats_to_gist()
    except Exception as e:
        print(f"⚠️ Ошибка сохранения: {e}")

def cleanup_old_games():
    """Очищаем старые игры"""
    current_time = datetime.now()
    games_to_remove = []
    
    print(f"🧹 cleanup_old_games: проверяем {len(pvp_games)} игр")
    
    for game_id, game in pvp_games.items():
        created_time = datetime.fromisoformat(game['created_at'])
        age_seconds = (current_time - created_time).total_seconds()
        print(f"🧹 Игра {game_id}: возраст {age_seconds:.0f} секунд")
        
        if age_seconds > 3600:  # 1 час
            games_to_remove.append(game_id)
            print(f"🧹 Игра {game_id} помечена для удаления")
    
    for game_id in games_to_remove:
        del pvp_games[game_id]
        print(f"🧹 Удалена старая игра {game_id}")
    
    print(f"🧹 Осталось игр: {len(pvp_games)}")

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
                print(f"🏠 ГЛАВНАЯ СТРАНИЦА - диагностика:")
                print(f"   - GITHUB_TOKEN найден: {bool(GITHUB_TOKEN)}")
                print(f"   - Длина токена: {len(GITHUB_TOKEN) if GITHUB_TOKEN else 0}")
                print(f"   - Игроков в памяти: {len(players_stats)}")
                
                # Загружаем свежие данные из Gist
                load_stats_from_gist()
                
                github_status = "✅ GitHub Gist" if GITHUB_TOKEN else "❌ NO TOKEN"
                
                data = {
                    'message': 'ANON Farm API',
                    'version': '7.3-diagnostic', 
                    'status': f'working {github_status}',
                    'total_players': len(players_stats),
                    'github_token_status': {
                        'present': bool(GITHUB_TOKEN),
                        'length': len(GITHUB_TOKEN) if GITHUB_TOKEN else 0,
                        'first_chars': GITHUB_TOKEN[:8] if GITHUB_TOKEN else 'MISSING'
                    },
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
                print(f"📥 ПОЛУЧЕН POST ЗАПРОС /api/submit_stats")
                
                # Читаем данные
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                player_data = json.loads(post_data.decode('utf-8'))
                
                print(f"📊 ДАННЫЕ ИГРОКА:")
                print(f"   - user_id: {player_data.get('user_id', 'НЕТ')}")
                print(f"   - name: {player_data.get('name', 'НЕТ')}")
                print(f"   - tokens: {player_data.get('tokens', 'НЕТ')}")
                print(f"   - level: {player_data.get('level', 'НЕТ')}")
                
                # Сохраняем в память
                player_id = player_data.get('user_id', 'unknown')
                old_count = len(players_stats)
                players_stats[player_id] = player_data
                new_count = len(players_stats)
                
                print(f"💾 СОХРАНЕНИЕ В ПАМЯТЬ:")
                print(f"   - Было игроков: {old_count}")
                print(f"   - Стало игроков: {new_count}")
                print(f"   - ID игрока: {player_id}")
                
                # Сохраняем в GitHub Gist (асинхронно)  
                print(f"🌐 ПЫТАЕМСЯ СОХРАНИТЬ В GITHUB GIST...")
                print(f"🔧 ПРИНУДИТЕЛЬНО ВЫЗЫВАЕМ save_stats_to_gist()...")
                try:
                    save_stats_to_gist()
                    print(f"🔧 save_stats_to_gist() ЗАВЕРШЕНА")
                except Exception as e:
                    print(f"💥 ОШИБКА В save_stats_to_gist(): {e}")
                    import traceback
                    print(f"💥 ТРЕЙС: {traceback.format_exc()}")
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                storage_info = "GitHub Gist" if GITHUB_TOKEN else "Memory only"
                
                data = {
                    'success': True,
                    'message': f'Статистика сохранена в {storage_info}',
                    'total_players': len(players_stats),
                    'storage': storage_info,
                    'player_saved': {
                        'id': player_id,
                        'name': player_data.get('name', 'Анонимный'),
                        'tokens': player_data.get('tokens', 0)
                    },
                    'github_token_present': bool(GITHUB_TOKEN)
                }
                
                print(f"✅ ОТВЕТ ОТПРАВЛЕН: {data}")
                
                self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
            
            elif path == '/api/remove_player':
                print(f"🗑️ ПОЛУЧЕН POST ЗАПРОС /api/remove_player")
                
                # Читаем данные
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data.decode('utf-8'))
                
                player_id = request_data.get('player_id')
                
                if not player_id:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    data = {
                        'success': False,
                        'error': 'player_id is required'
                    }
                    self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
                    return
                
                print(f"🗑️ УДАЛЕНИЕ ИГРОКА:")
                print(f"   - player_id: {player_id}")
                print(f"   - Игроков в памяти: {len(players_stats)}")
                
                # Удаляем игрока
                result = remove_player_from_leaderboard(player_id)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                print(f"✅ ОТВЕТ ОТПРАВЛЕН: {result}")
                self.wfile.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
            
            # PvP endpoints
            elif path == '/api/pvp/create_game':
                print(f"🎮 ПОЛУЧЕН POST ЗАПРОС /api/pvp/create_game")
                
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data.decode('utf-8'))
                
                player_id = request_data.get('player_id')
                player_name = request_data.get('player_name')
                bet_amount = request_data.get('bet_amount', 10)
                
                if not player_id or not player_name:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    data = {'success': False, 'error': 'player_id и player_name обязательны'}
                    self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
                    return
                
                # Проверяем баланс
                player_stats = players_stats.get(player_id, {})
                if player_stats.get('tokens', 0) < bet_amount:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    data = {'success': False, 'error': 'Недостаточно $ANON для ставки'}
                    self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
                    return
                
                # Создаем игру (ставка уже снята в create_pvp_game)
                game = create_pvp_game(player_id, player_name, bet_amount)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                data = {'success': True, 'game': game}
                self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
            
            elif path == '/api/pvp/join_game':
                print(f"🎮 ПОЛУЧЕН POST ЗАПРОС /api/pvp/join_game")
                
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data.decode('utf-8'))
                
                game_id = request_data.get('game_id')
                player_id = request_data.get('player_id')
                player_name = request_data.get('player_name')
                
                if not game_id or not player_id or not player_name:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    data = {'success': False, 'error': 'game_id, player_id и player_name обязательны'}
                    self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
                    return
                
                result = join_pvp_game(game_id, player_id, player_name)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                self.wfile.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
            
            elif path == '/api/pvp/make_move':
                print(f"🎮 ПОЛУЧЕН POST ЗАПРОС /api/pvp/make_move")
                
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data.decode('utf-8'))
                
                game_id = request_data.get('game_id')
                player_id = request_data.get('player_id')
                action = request_data.get('action')
                
                if not game_id or not player_id or not action:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    data = {'success': False, 'error': 'game_id, player_id и action обязательны'}
                    self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
                    return
                
                result = make_pvp_move(game_id, player_id, action)
                
                # Если игра окончена, завершаем её
                if result.get('result') == 'bust':
                    end_pvp_game(game_id, 'bust', player_id)
                elif result.get('result') == 'stand':
                    # Проверяем, нужно ли завершить игру
                    game = pvp_games.get(game_id)
                    if game and game['state'] == 'playing':
                        # Проверяем, оба ли игрока сделали ход "stand"
                        player1_stood = len(game['player1']['hand']) > 2 and game.get('player1_stood', False)
                        player2_stood = len(game['player2']['hand']) > 2 and game.get('player2_stood', False)
                        
                        if player1_stood and player2_stood:
                            # Оба игрока сделали ход, завершаем игру
                            end_pvp_game(game_id, 'normal')
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                self.wfile.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
            
            elif path == '/api/pvp/get_games':
                print(f"🎮 ПОЛУЧЕН POST ЗАПРОС /api/pvp/get_games")
                
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data.decode('utf-8'))
                
                player_id = request_data.get('player_id')
                
                if not player_id:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    data = {'success': False, 'error': 'player_id обязателен'}
                    self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
                    return
                
                # Очищаем старые игры
                cleanup_old_games()
                
                available_games = get_available_games(player_id)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                data = {'success': True, 'games': available_games}
                self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
            
            elif path == '/api/pvp/get_game':
                print(f"🎮 ПОЛУЧЕН POST ЗАПРОС /api/pvp/get_game")
                
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data.decode('utf-8'))
                
                game_id = request_data.get('game_id')
                player_id = request_data.get('player_id')
                
                if not game_id or not player_id:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    data = {'success': False, 'error': 'game_id и player_id обязательны'}
                    self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
                    return
                
                if game_id not in pvp_games:
                    self.send_response(404)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    data = {'success': False, 'error': 'Игра не найдена'}
                    self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
                    return
                
                game = pvp_games[game_id]
                
                # Скрываем карты противника если игра активна
                if game['state'] == 'playing':
                    if game['player1']['id'] == player_id:
                        opponent_hand = game['player2']['hand'] if game['player2'] else []
                        # Показываем только первую карту
                        if len(opponent_hand) > 1:
                            game['player2']['hand'] = [opponent_hand[0], {'hidden': True}]
                    elif game['player2'] and game['player2']['id'] == player_id:
                        opponent_hand = game['player1']['hand']
                        # Показываем только первую карту
                        if len(opponent_hand) > 1:
                            game['player1']['hand'] = [opponent_hand[0], {'hidden': True}]
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                data = {'success': True, 'game': game}
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
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()