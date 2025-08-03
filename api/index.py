from http.server import BaseHTTPRequestHandler
import json

# Простейшее хранилище
players_stats = {}

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Простейший обработчик GET"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        data = {
            'message': 'ANON Farm API Simple Test',
            'version': '7.0-ultra-simple', 
            'status': 'working',
            'players': len(players_stats)
        }
        
        self.wfile.write(json.dumps(data).encode())
    
    def do_POST(self):
        """Простейший обработчик POST"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        data = {'success': True, 'message': 'POST received'}
        self.wfile.write(json.dumps(data).encode())
        
    def do_OPTIONS(self):
        """CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()