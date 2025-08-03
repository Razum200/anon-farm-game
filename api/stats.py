from flask import Flask, jsonify
from datetime import datetime
from .data import get_active_players, format_number

app = Flask(__name__)

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Общая статистика"""
    try:
        active_players = get_active_players()
        
        total_tokens = sum(p.get('tokens', 0) for p in active_players.values())
        avg_level = sum(p.get('level', 1) for p in active_players.values()) / len(active_players) if active_players else 0
        
        return jsonify({
            'success': True,
            'total_players': len(active_players),
            'total_tokens': total_tokens,
            'total_tokens_formatted': format_number(total_tokens),
            'average_level': round(avg_level, 1),
            'updated_at': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=False)