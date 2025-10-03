# booking-app
Тестовое задание:
Реализовать API для бронирования места на мероприятие. Один пользователь не может забронировать дважды на одно событие.

## Установка

1. Клонирование
```
git clone git@github.com:VVIkon/booking-app.git
```
2. Инициализация
```
npm install
```
3. Генерация SSL сертификаты для HTTPS
```
npm run generate:ssl
```
4. Создание .env файла
```
Необходимо заполнить главы
- Server Configuration
- Database Configuration
- HTTPS Configuration
- Debug Configuration

Файл .env.example можно использовать как шаблон
```

5. Миграции
```
npm run migrate
```
6. Посев тестовых данных
```
npm run seed
```
7. Запуск в режиме разработки
`
npm run dev
`
8. Запуск в режиме прод
npm run build
npm start || npm run start

## Запуск и проверка
```
Для проверки запросов можно использовать
локального http клиента (VSCode) и скрипты тест-файла:
`src/test/test.http`
```

## Запуск тестов
в целях сокращения времени выполнения тестового задания покрытие тестами выполнено не полностью

### Запуск всех тестов
npm test

### Запуск в watch mode
npm run test:watch

### Запуск с покрытием кода
npm run test:coverage

### Запуск конкретного теста
npm test -- bookingController.test.ts

