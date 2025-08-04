# 🗑️ Руководство по удалению игрока из рейтинга

## Способы удаления игрока:

### 1. **Через скрипт (рекомендуется)**

```bash
python3 remove-player.py <player_id>
```

**Пример:**
```bash
python3 remove-player.py 123456789
```

### 2. **Через API напрямую**

```bash
curl -X POST https://anon-farm-api.vercel.app/api/remove_player \
  -H "Content-Type: application/json" \
  -d '{"player_id": "123456789"}'
```

### 3. **Через JavaScript в браузере**

```javascript
fetch('https://anon-farm-api.vercel.app/api/remove_player', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        player_id: '123456789'
    })
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log('✅ Игрок удален:', data.message);
        console.log('📊 Удаленный игрок:', data.removed_player);
    } else {
        console.log('❌ Ошибка:', data.message);
    }
});
```

## 📊 Как найти ID игрока:

### 1. **Через API топа**
```bash
curl https://anon-farm-api.vercel.app/api/leaderboard
```

### 2. **Через GitHub Gist**
- Перейдите на: https://gist.github.com/Razum200/0bbf93ba7dc734609f50be0e06c6ce94
- Найдите игрока в JSON файле
- Скопируйте его `user_id`

### 3. **Через игру**
- Откройте консоль браузера в игре
- Введите: `game.tg.initDataUnsafe.user.id`
- Скопируйте ID

## 🔧 Требования:

### Для скрипта:
```bash
pip install requests
```

### Для API:
- ID игрока должен быть числом
- API должен быть доступен

## 📝 Примеры ответов:

### ✅ Успешное удаление:
```json
{
    "success": true,
    "message": "Игрок Иван удален из рейтинга",
    "removed_player": {
        "id": "123456789",
        "name": "Иван",
        "tokens": 15000
    },
    "total_players": 25
}
```

### ❌ Игрок не найден:
```json
{
    "success": false,
    "message": "Игрок с ID 999999999 не найден в рейтинге",
    "total_players": 25
}
```

### ❌ Ошибка запроса:
```json
{
    "success": false,
    "error": "player_id is required"
}
```

## ⚠️ Важные замечания:

1. **Удаление необратимо** - данные игрока будут потеряны
2. **ID игрока** - это Telegram ID пользователя
3. **Автоматическое сохранение** - изменения сразу сохраняются в GitHub Gist
4. **Логирование** - все операции логируются в API

## 🚀 Быстрый старт:

1. Установите зависимости: `pip install requests`
2. Запустите скрипт: `python3 remove-player.py 123456789`
3. Проверьте результат в консоли

---

**🔗 Ссылки:**
- API: https://anon-farm-api.vercel.app/
- GitHub Gist: https://gist.github.com/Razum200/0bbf93ba7dc734609f50be0e06c6ce94
- Репозиторий: https://github.com/Razum200/anon-farm-game 