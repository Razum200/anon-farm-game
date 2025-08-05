#!/usr/bin/env python3
"""
Простой тестовый сервер для PvP API
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
import sys

# Добавляем путь к API
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Импортируем наш API
from api.index import *

class TestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Обработка GET запросов"""
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'<h1>PvP API Test Server</h1><p>Server is running!</p>')
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        """Обработка POST запросов - делегируем к нашему API"""
        try:
            # Создаем экземпляр нашего обработчика
            handler = handler()
            
            # Устанавливаем путь
            handler.path = self.path
            
            # Копируем заголовки
            for header, value in self.headers.items():
                handler.headers[header] = value
            
            # Копируем тело запроса
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                handler.rfile = self.rfile
            
            # Вызываем наш обработчик
            handler.do_POST()
            
            # Копируем ответ
            self.send_response(handler.response_code if hasattr(handler, 'response_code') else 200)
            for header, value in handler.response_headers if hasattr(handler, 'response_headers') else []:
                self.send_header(header, value)
            self.end_headers()
            
            if hasattr(handler, 'response_body'):
                self.wfile.write(handler.response_body)
                
        except Exception as e:
            print(f"Ошибка обработки запроса: {e}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def do_OPTIONS(self):
        """CORS обработка"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_test_server():
    """Запускаем тестовый сервер"""
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, TestHandler)
    print("🚀 Тестовый сервер запущен на http://localhost:8000")
    print("📝 Для остановки нажмите Ctrl+C")
    httpd.serve_forever()

if __name__ == '__main__':
    run_test_server() 