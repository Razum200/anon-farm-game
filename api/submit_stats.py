from flask import Flask, jsonify, request
from datetime import datetime
from .data import add_player_stats, format_number

app = Flask(__name__)

@app.route('/api/submit_stats', methods=['POST'])
def submit_stats():
    """Прием статистики от игроков"""
    try:
        data = request.json
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
            
        player_id = str(data.get('player_id', f"player_{datetime.now().timestamp()}"))
        name = data.get('name', 'Анонимный игрок')
        tokens = float(data.get('tokens', 0))
        level = int(data.get('level', 1))
        
        # Сохраняем статистику
        add_player_stats(player_id, name, tokens, level)
        
        print(f"📊 Получена статистика: {name} - {format_number(tokens)}")
        
        return jsonify({
            'success': True,
            'message': 'Stats saved successfully'
        })
    
    except Exception as e:
        print(f"❌ Ошибка submit: {e}")
        return jsonify({
            'success': False, 
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=False)