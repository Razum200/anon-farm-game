#!/bin/bash
# Скрипт для запуска API сервера топа игроков

echo "🚀 Запуск ANON Farm API сервера..."
echo "📊 Сервер будет принимать статистику и отдавать топ игроков"
echo "🌐 API будет доступен на http://localhost:5000"
echo "💬 Для остановки нажмите Ctrl+C"
echo "=================================================="
echo ""

# Проверяем что Python установлен
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 не найден. Установите Python3 и попробуйте снова."
    exit 1
fi

# Устанавливаем зависимости
echo "📦 Проверяем зависимости..."
pip3 install -r requirements.txt

echo ""
echo "✅ Все готово! Запускаем API сервер..."
echo "🌐 Сервер запустится на http://localhost:5000"
echo "📊 Endpoints:"
echo "   - GET  /api/leaderboard   - топ игроков"
echo "   - GET  /api/stats         - общая статистика"  
echo "   - POST /api/submit_stats  - отправка статистики"
echo ""

# Запускаем API сервер
python3 leaderboard-api.py