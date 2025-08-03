from flask import Flask, jsonify
from datetime import datetime
from .data import get_active_players, format_number

app = Flask(__name__)

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """Получение топа игроков"""
    try:
        active_players = get_active_players()
        
        # Сортируем по токенам
        sorted_players = sorted(
            active_players.values(), 
            key=lambda x: x.get('tokens', 0), 
            reverse=True
        )[:10]
        
        # Форматируем для отправки
        leaderboard = []
        for i, player in enumerate(sorted_players):
            leaderboard.append({
                'rank': i + 1,
                'name': player.get('name', 'Анонимный игрок'),
                'tokens': player.get('tokens', 0),
                'tokens_formatted': format_number(player.get('tokens', 0)),
                'level': player.get('level', 1)
            })
        
        return jsonify({
            'success': True,
            'leaderboard': leaderboard,
            'total_players': len(active_players),
            'updated_at': datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"❌ Ошибка API: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=False)