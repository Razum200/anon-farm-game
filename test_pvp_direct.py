#!/usr/bin/env python3
"""
Прямой тест PvP функций для игры 21
"""

import sys
import os

# Добавляем путь к API
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Импортируем функции из API
from api.index import *

def test_pvp_functions():
    print("🎮 Тестирование PvP функций для игры 21")
    print("=" * 50)
    
    # Очищаем данные
    global pvp_games, active_players, players_stats
    pvp_games = {}
    active_players = {}
    players_stats = {}
    
    # Загружаем статистику (это очистит players_stats)
    load_stats_from_gist()
    
    # Тестовые данные
    player1 = {
        "id": "test_player_1",
        "name": "Тест Игрок 1",
        "tokens": 1000
    }
    
    player2 = {
        "id": "test_player_2", 
        "name": "Тест Игрок 2",
        "tokens": 1000
    }
    
    # Добавляем игроков в статистику ПОСЛЕ загрузки
    players_stats[player1["id"]] = {
        "user_id": player1["id"],
        "name": player1["name"],
        "tokens": player1["tokens"],
        "level": 1
    }
    players_stats[player2["id"]] = {
        "user_id": player2["id"],
        "name": player2["name"],
        "tokens": player2["tokens"],
        "level": 1
    }
    
    print(f"🔍 Отладка: После добавления игроков players_stats keys = {list(players_stats.keys())}")
    
    # 1. Создаем игру
    print("1. Создаем PvP игру...")
    print(f"   Баланс игрока 1 до создания: {players_stats[player1['id']]['tokens']}")
    print(f"   Баланс игрока 2 до создания: {players_stats[player2['id']]['tokens']}")
    game = create_pvp_game(player1["id"], player1["name"], 50)
    
    if game:
        game_id = game["id"]
        print(f"✅ Игра создана: {game_id}")
        print(f"   Игрок: {game['player1']['name']}")
        print(f"   Ставка: {game['player1']['bet']} $ANON")
        print(f"   Статус: {game['state']}")
        print(f"   Игроков в памяти: {len(players_stats)}")
        print(f"   Активных игр: {len(pvp_games)}")
        print(f"   Баланс игрока 1 после создания: {players_stats[player1['id']]['tokens']}")
        print(f"   Баланс игрока 2 после создания: {players_stats[player2['id']]['tokens']}")
    else:
        print("❌ Ошибка создания игры")
        return
    
    # 2. Получаем список доступных игр
    print("\n2. Получаем список доступных игр...")
    available_games = get_available_games(player2["id"])
    print(f"✅ Найдено игр: {len(available_games)}")
    for game in available_games:
        print(f"   - {game['player1_name']} (ставка: {game['bet']} $ANON)")
    
    # 3. Присоединяемся к игре
    print(f"\n3. Присоединяемся к игре {game_id}...")
    print(f"   Баланс игрока 2 перед присоединением: {players_stats[player2['id']]['tokens']}")
    join_result = join_pvp_game(game_id, player2["id"], player2["name"])
    
    if join_result["success"]:
        game = join_result["game"]
        print("✅ Успешно присоединились к игре!")
        print(f"   Игрок 1: {game['player1']['name']} (карт: {len(game['player1']['hand'])})")
        print(f"   Игрок 2: {game['player2']['name']} (карт: {len(game['player2']['hand'])})")
        print(f"   Статус: {game['state']}")
        print(f"   Текущий ход: {game['current_turn']}")
        print(f"   Баланс игрока 1: {players_stats[player1['id']]['tokens']}")
        print(f"   Баланс игрока 2: {players_stats[player2['id']]['tokens']}")
    else:
        print(f"❌ Ошибка присоединения: {join_result['error']}")
        return
    
    # 4. Делаем ходы
    print("\n4. Делаем ходы...")
    
    # Ход игрока 2 (hit)
    print("   Игрок 2 берет карту...")
    move1_result = make_pvp_move(game_id, player2["id"], "hit")
    
    if move1_result["success"]:
        game = move1_result["game"]
        player2_value = calculate_hand_value(game["player2"]["hand"])
        print(f"   ✅ Игрок 2: {player2_value} очков")
        print(f"   Текущий ход: {game['current_turn']}")
    else:
        print(f"   ❌ Ошибка хода: {move1_result['error']}")
    
    # Ход игрока 1 (hit)
    print("   Игрок 1 берет карту...")
    move2_result = make_pvp_move(game_id, player1["id"], "hit")
    
    if move2_result["success"]:
        game = move2_result["game"]
        player1_value = calculate_hand_value(game["player1"]["hand"])
        print(f"   ✅ Игрок 1: {player1_value} очков")
        print(f"   Текущий ход: {game['current_turn']}")
    else:
        print(f"   ❌ Ошибка хода: {move2_result['error']}")
    
    # 5. Завершаем игру
    print("\n5. Завершаем игру...")
    end_pvp_game(game_id, "normal")
    
    # Получаем финальное состояние
    final_game = pvp_games.get(game_id)
    if final_game:
        print(f"✅ Финальное состояние:")
        print(f"   Статус: {final_game['state']}")
        print(f"   Победитель: {final_game.get('winner', 'Ничья')}")
        print(f"   Результат: {final_game.get('result', 'Неизвестно')}")
        print(f"   Финальные очки:")
        print(f"     Игрок 1: {final_game['final_values']['player1']}")
        print(f"     Игрок 2: {final_game['final_values']['player2']}")
        print(f"   Финальные балансы:")
        print(f"     Игрок 1: {players_stats[player1['id']]['tokens']}")
        print(f"     Игрок 2: {players_stats[player2['id']]['tokens']}")
    else:
        print("❌ Игра не найдена")
    
    print("\n🎮 Тест завершен!")

if __name__ == "__main__":
    try:
        test_pvp_functions()
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        import traceback
        traceback.print_exc() 