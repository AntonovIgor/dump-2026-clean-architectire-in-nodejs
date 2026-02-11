# Примеры запросов (cURL)

Сервер запускается командой:

```bash
npm run dev
```

По умолчанию слушает на `http://localhost:3000`.

---

## POST /register — Регистрация пользователя

### Успешная регистрация (201)

```bash
curl -s -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "password": "secret123"
  }'
```

Ответ:

```json
{
  "id": 1,
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15"
}
```

### Регистрация второго пользователя (201)

```bash
curl -s -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "dateOfBirth": "1992-05-20",
    "password": "qwerty789"
  }'
```

### Дублирование email (409)

```bash
curl -s -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "firstName": "Other",
    "lastName": "Person",
    "dateOfBirth": "2000-01-01",
    "password": "password123"
  }'
```

Ответ:

```json
{
  "error": "User with this email already exists"
}
```

### Ошибки валидации (422)

```bash
curl -s -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "firstName": "",
    "lastName": "",
    "dateOfBirth": "15/01/1990",
    "password": "123"
  }'
```

Ответ:

```json
{
  "errors": [
    "email must be an email",
    "firstName should not be empty",
    "lastName should not be empty",
    "dateOfBirth must be in ISO format (YYYY-MM-DD)",
    "password must be longer than or equal to 6 characters"
  ]
}
```

### Пустое тело (422)

```bash
curl -s -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## POST /login — Вход

### Успешный логин (200)

```bash
curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secret123"
  }'
```

Ответ — массив всех зарегистрированных пользователей (без паролей):

```json
[
  {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15"
  },
  {
    "id": 2,
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "dateOfBirth": "1992-05-20"
  }
]
```

### Неверный пароль (401)

```bash
curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrongpassword"
  }'
```

Ответ:

```json
{
  "error": "Invalid credentials"
}
```

### Несуществующий email (401)

```bash
curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nobody@example.com",
    "password": "secret123"
  }'
```

### Ошибки валидации (422)

```bash
curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bad",
    "password": "1"
  }'
```

---

## Прочее

### Несуществующий маршрут (404)

```bash
curl -s -X GET http://localhost:3000/users
```

Ответ:

```json
{
  "error": "Not Found"
}
```

---

## Полный сценарий (копировать целиком)

```bash
# 1. Регистрация
curl -s -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","firstName":"John","lastName":"Doe","dateOfBirth":"1990-01-15","password":"secret123"}'

# 2. Регистрация второго
curl -s -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","firstName":"Jane","lastName":"Smith","dateOfBirth":"1992-05-20","password":"qwerty789"}'

# 3. Логин — получаем список всех
curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'

# 4. Дубликат email — 409
curl -s -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","firstName":"X","lastName":"Y","dateOfBirth":"2000-01-01","password":"password123"}'

# 5. Неверный пароль — 401
curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"wrong"}'

# 6. Невалидные данные — 422
curl -s -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"bad","password":"1"}'
```
