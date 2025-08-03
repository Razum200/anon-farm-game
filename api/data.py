# Общий модуль для хранения данных игроков
from datetime import datetime, timedelta
import json

# Хранилище игроков (простое in-memory хранилище)
# В продакшене лучше использовать базу данных
players_stats = {}

def format_number(num):
    """Форматирование чисел"""
    if num >= 1000000000:
        return f"{num/1000000000:.1f}B"
    elif num >= 1000000:
        return f"{num/1000000:.1f}M"
    elif num >= 1000:
        return f"{num/1000:.1f}K"
    else:
        return str(int(num))

def get_active_players():
    """Получение активных игроков (не старше 24 часов)"""
    cutoff_time = datetime.now() - timedelta(hours=24)
    return {
        k: v for k, v in players_stats.items() 
        if isinstance(v.get('last_update'), datetime) and v['last_update'] > cutoff_time
    }

def add_player_stats(player_id, name, tokens, level):
    """Добавление статистики игрока"""
    players_stats[str(player_id)] = {
        'name': name,
        'username': str(player_id),
        'tokens': float(tokens),
        'level': int(level),
        'last_update': datetime.now()
    }
    return True