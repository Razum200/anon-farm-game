#!/bin/bash
# Скрипт для запуска автоматического ответчика топа игроков

echo "🚀 Запуск ANON Farm Auto Leaderboard..."
echo "📊 Бот будет автоматически отвечать на запросы топа игроков"
echo "💬 Для остановки нажмите Ctrl+C"
echo "=" 
echo ""

# Проверяем что Python установлен
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 не найден. Установите Python3 и попробуйте снова."
    exit 1
fi

# Проверяем что requests установлен
python3 -c "import requests" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📦 Устанавливаем библиотеку requests..."
    pip3 install requests
fi

echo "✅ Все готово! Запускаем бота..."
echo ""

# Запускаем скрипт
python3 auto-leaderboard.py