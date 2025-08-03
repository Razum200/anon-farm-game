from flask import Flask, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/', methods=['GET'])
@app.route('/api', methods=['GET'])
def index():
    """Главная страница API"""
    return jsonify({
        'message': 'ANON Farm Leaderboard API',
        'version': '2.0-vercel',
        'status': 'running on Vercel',
        'game_url': 'https://razum200.github.io/anon-farm-game/',
        'docs': {
            'leaderboard': '/api/leaderboard',
            'stats': '/api/stats',
            'submit': '/api/submit_stats'
        },
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(debug=False)