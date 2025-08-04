#!/usr/bin/env python3
"""
Скрипт для удаления игрока из рейтинга ANON Farm
Использование: python3 remove-player.py <player_id>
"""

import requests
import json
import sys

def remove_player(player_id):
    """Удаляет игрока из рейтинга"""
    
    url = "https://anon-farm-api.vercel.app/api/remove_player"
    
    data = {
        "player_id": player_id
    }
    
    try:
        print(f"🗑️ Удаляем игрока с ID: {player_id}")
        print(f"🌐 Отправляем запрос на: {url}")
        
        response = requests.post(url, json=data, timeout=10)
        
        print(f"📡 Статус ответа: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            
            if result.get('success'):
                print(f"✅ Успешно удален игрок!")
                print(f"📊 Имя: {result['removed_player']['name']}")
                print(f"💰 Токены: {result['removed_player']['tokens']}")
                print(f"📈 Всего игроков осталось: {result['total_players']}")
            else:
                print(f"❌ Ошибка: {result.get('message', 'Неизвестная ошибка')}")
        else:
            print(f"❌ HTTP ошибка: {response.status_code}")
            print(f"📝 Ответ: {response.text}")
            
    except requests.exceptions.Timeout:
        print("❌ Таймаут запроса")
    except requests.exceptions.RequestException as e:
        print(f"❌ Ошибка сети: {e}")
    except json.JSONDecodeError:
        print("❌ Ошибка парсинга JSON ответа")
    except Exception as e:
        print(f"❌ Неожиданная ошибка: {e}")

def main():
    if len(sys.argv) != 2:
        print("❌ Неправильное использование!")
        print("📖 Использование: python3 remove-player.py <player_id>")
        print("📖 Пример: python3 remove-player.py 123456789")
        sys.exit(1)
    
    player_id = sys.argv[1]
    
    if not player_id.isdigit():
        print("❌ player_id должен быть числом!")
        sys.exit(1)
    
    remove_player(player_id)

if __name__ == "__main__":
    main() 