#!/usr/bin/env python3
"""
Тест PvP API для игры 21
"""

import requests
import json
import time

# URL API
BASE_URL = "http://localhost:8000"

def test_pvp_api():
    print("🎮 Тестирование PvP API для игры 21")
    print("=" * 50)
    
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
    
    # 1. Создаем игру
    print("1. Создаем PvP игру...")
    create_response = requests.post(f"{BASE_URL}/api/pvp/create_game", json={
        "player_id": player1["id"],
        "player_name": player1["name"],
        "bet_amount": 50
    })
    
    if create_response.status_code == 200:
        create_data = create_response.json()
        if create_data["success"]:
            game = create_data["game"]
            game_id = game["id"]
            print(f"✅ Игра создана: {game_id}")
            print(f"   Игрок: {game['player1']['name']}")
            print(f"   Ставка: {game['player1']['bet']} $ANON")
            print(f"   Статус: {game['state']}")
        else:
            print(f"❌ Ошибка создания игры: {create_data['error']}")
            return
    else:
        print(f"❌ HTTP ошибка: {create_response.status_code}")
        return
    
    # 2. Получаем список доступных игр
    print("\n2. Получаем список доступных игр...")
    games_response = requests.post(f"{BASE_URL}/api/pvp/get_games", json={
        "player_id": player2["id"]
    })
    
    if games_response.status_code == 200:
        games_data = games_response.json()
        if games_data["success"]:
            games = games_data["games"]
            print(f"✅ Найдено игр: {len(games)}")
            for game in games:
                print(f"   - {game['player1_name']} (ставка: {game['bet']} $ANON)")
        else:
            print(f"❌ Ошибка получения игр: {games_data['error']}")
    else:
        print(f"❌ HTTP ошибка: {games_response.status_code}")
    
    # 3. Присоединяемся к игре
    print(f"\n3. Присоединяемся к игре {game_id}...")
    join_response = requests.post(f"{BASE_URL}/api/pvp/join_game", json={
        "game_id": game_id,
        "player_id": player2["id"],
        "player_name": player2["name"]
    })
    
    if join_response.status_code == 200:
        join_data = join_response.json()
        if join_data["success"]:
            game = join_data["game"]
            print("✅ Успешно присоединились к игре!")
            print(f"   Игрок 1: {game['player1']['name']} (карт: {len(game['player1']['hand'])})")
            print(f"   Игрок 2: {game['player2']['name']} (карт: {len(game['player2']['hand'])})")
            print(f"   Статус: {game['state']}")
            print(f"   Текущий ход: {game['current_turn']}")
        else:
            print(f"❌ Ошибка присоединения: {join_data['error']}")
            return
    else:
        print(f"❌ HTTP ошибка: {join_response.status_code}")
        return
    
    # 4. Делаем ходы
    print("\n4. Делаем ходы...")
    
    # Ход игрока 2 (hit)
    print("   Игрок 2 берет карту...")
    move1_response = requests.post(f"{BASE_URL}/api/pvp/make_move", json={
        "game_id": game_id,
        "player_id": player2["id"],
        "action": "hit"
    })
    
    if move1_response.status_code == 200:
        move1_data = move1_response.json()
        if move1_data["success"]:
            game = move1_data["game"]
            player2_value = sum([11 if card["value"] == "A" else 10 if card["value"] in ["K", "Q", "J"] else int(card["value"]) for card in game["player2"]["hand"]])
            print(f"   ✅ Игрок 2: {player2_value} очков")
            print(f"   Текущий ход: {game['current_turn']}")
        else:
            print(f"   ❌ Ошибка хода: {move1_data['error']}")
    
    # Ход игрока 1 (hit)
    print("   Игрок 1 берет карту...")
    move2_response = requests.post(f"{BASE_URL}/api/pvp/make_move", json={
        "game_id": game_id,
        "player_id": player1["id"],
        "action": "hit"
    })
    
    if move2_response.status_code == 200:
        move2_data = move2_response.json()
        if move2_data["success"]:
            game = move2_data["game"]
            player1_value = sum([11 if card["value"] == "A" else 10 if card["value"] in ["K", "Q", "J"] else int(card["value"]) for card in game["player1"]["hand"]])
            print(f"   ✅ Игрок 1: {player1_value} очков")
            print(f"   Текущий ход: {game['current_turn']}")
        else:
            print(f"   ❌ Ошибка хода: {move2_data['error']}")
    
    # 5. Получаем финальное состояние игры
    print("\n5. Получаем финальное состояние игры...")
    final_response = requests.post(f"{BASE_URL}/api/pvp/get_game", json={
        "game_id": game_id,
        "player_id": player1["id"]
    })
    
    if final_response.status_code == 200:
        final_data = final_response.json()
        if final_data["success"]:
            game = final_data["game"]
            print(f"✅ Финальное состояние:")
            print(f"   Статус: {game['state']}")
            if game['state'] == 'finished':
                print(f"   Победитель: {game.get('winner', 'Ничья')}")
                print(f"   Результат: {game.get('result', 'Неизвестно')}")
        else:
            print(f"❌ Ошибка получения игры: {final_data['error']}")
    else:
        print(f"❌ HTTP ошибка: {final_response.status_code}")
    
    print("\n🎮 Тест завершен!")

if __name__ == "__main__":
    try:
        test_pvp_api()
    except requests.exceptions.ConnectionError:
        print("❌ Не удается подключиться к серверу. Убедитесь, что API сервер запущен.")
    except Exception as e:
        print(f"❌ Ошибка: {e}") 