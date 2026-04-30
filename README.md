# MrSimon 2

## Пример дизайна (шаблон MUI)

[https://materialpro-react-main.netlify.app/apps/calendar](https://materialpro-react-main.netlify.app/apps/calendar) - календарь и весь интерфейс в целом 

[https://materialpro-react-free.netlify.app/](https://materialpro-react-free.netlify.app/) - бесплатная часть общего интерфейса
[https://mui.com/store/previews/minimal-dashboard/](https://mui.com/store/previews/minimal-dashboard/) - еще очень хороший интерфейс, интересная файловая система (откртыие файла для превью)
  [https://www.figma.com/design/WadcoP3CSejUDj7YZc87xj/-Preview--Minimal-Web.v7.3.0?node-id=0-1&p=f](https://www.figma.com/design/WadcoP3CSejUDj7YZc87xj/-Preview--Minimal-Web.v7.3.0?node-id=0-1&p=f) - фигма предыдущего, чтобы удобно качать цвета и картинки 

[https://github.com/minimal-ui-kit/material-kit-react.git](https://github.com/minimal-ui-kit/material-kit-react.git) - free github предыдущего  
	  
[https://dashboardpack.com/live-demo-preview/?livedemo=391333&utm_source=adminlte&utm_medium=blog&utm_content=mui-admin-dashboard-templates](https://dashboardpack.com/live-demo-preview/?livedemo=391333&utm_source=adminlte&utm_medium=blog&utm_content=mui-admin-dashboard-templates) - удобный календарь для ведения расписания 
[https://dashboardpack.com/live-demo-preview/?livedemo=391333&utm_source=adminlte&utm_medium=blog&utm_content=mui-admin-dashboard-templates](https://dashboardpack.com/live-demo-preview/?livedemo=391333&utm_source=adminlte&utm_medium=blog&utm_content=mui-admin-dashboard-templates) - файловый менеджер
[https://free.minimals.cc/blog](https://free.minimals.cc/blog) - карточкидля курсов
[https://materialpro-react-main.netlify.app/widgets/banners](https://materialpro-react-main.netlify.app/widgets/banners) - красивая верстка баннеров

прочие шаблоны 
[https://horizon-ui.com/horizon-ui-chakra/?ref=readme-horizon#/admin/default](https://horizon-ui.com/horizon-ui-chakra/?ref=readme-horizon#/admin/default) - horizon
[https://berrydashboard.com/dashboard/default](https://berrydashboard.com/dashboard/default) - berry
[https://mantisdashboard.com/dashboard/analytics](https://mantisdashboard.com/dashboard/analytics) - mantis (прикольная идея с приветсвенным баннером)
[https://demos.creative-tim.com/argon-dashboard-react/#/admin/index](https://demos.creative-tim.com/argon-dashboard-react/#/admin/index) - argon - в основном скучная 
[https://xtreme-react-main.netlify.app/map/vector](https://xtreme-react-main.netlify.app/map/vector) - xtreme - прикольная карта 
[https://codedthemes.com/demos/admin-templates/datta-able/bootstrap/default/admins/course-dashboard.html](https://codedthemes.com/demos/admin-templates/datta-able/bootstrap/default/admins/course-dashboard.html) - dattf able - страница СПЕЦИАЛЬНО для обучения
[https://mui.com/store/previews/devias-kit-pro/](https://mui.com/store/previews/devias-kit-pro/) - DeviasKit - прикольная странциа для интеррактивного урока 
[https://demos.creative-tim.com/soft-ui-dashboard-pro-react/marketplace/#/dashboards/default](https://demos.creative-tim.com/soft-ui-dashboard-pro-react/marketplace/#/dashboards/default) - soft ui - оч крутая идея с VR, smartHouse

## Запуск проекта

Первый запуск или после изменения Dockerfile / зависимостей:

```bash
docker compose up --build
```

Обычный запуск:

```bash
docker compose up
```

Остановка:

```bash
docker compose down
```

---

## Адреса

```txt
Frontend: http://localhost:3000
Backend:  http://localhost:5001
Health:   http://localhost:5001/health
```

> Backend внутри контейнера работает на `5000`, но наружу проброшен как `5001`.

---

## Структура проекта

```txt
mrsimon_2/
  client/                 # Next.js
  server/                 # .NET Web API
  docker-compose.yml
```

---

## Frontend

```txt
client/
  app/       # роутинг (Next.js)
  modules/   # модули (локальные библиотеки)
```

Модули — это изолированные части приложения (account, pay, files и т.д.), которые можно вынести в отдельные репозитории.

---

## Backend

Архитектура — модульный монолит.

```txt
server/
  MrSimon.sln

  src/
    MrSimon.Api/              # точка входа (Program, Controllers)
    MrSimon.Shared/           # общий код

    MrSimon.Modules.Account/
    MrSimon.Modules.Files/
    MrSimon.Modules.Viewer/
    MrSimon.Modules.Payments/
```

Сейчас вся логика находится в:

```txt
server/src/MrSimon.Api/
```

---

## Установка пакетов (client)

Из папки `client`:

1. При запуске через docker

```bash
docker compose exec client pnpm install
```

1. При локальном запуске

```bash
pnpm install
```

---

## Установка пакетов (backend)

Из папки `server`:

```bash
dotnet add src/MrSimon.Api/MrSimon.Api.csproj package <PackageName>
```

После установки:

```bash
docker compose up --build
```

---

## Миграции EF Core

Все команды выполняются **через Docker**.

Создать миграцию:

```bash
docker compose exec server dotnet ef migrations add <MigrationName> --project src/MrSimon.Api --startup-project src/MrSimon.Api
```

Применить миграцию:

```bash
docker compose exec server dotnet ef database update --project src/MrSimon.Api --startup-project src/MrSimon.Api
```

Удалить последнюю миграцию:

```bash
docker compose exec server dotnet ef migrations remove --project src/MrSimon.Api --startup-project src/MrSimon.Api
```

---

## База данных

PostgreSQL поднимается через Docker Compose.

---

## Подключение к базе данных

База данных (PostgreSQL) запускается через Docker Compose.

### Параметры подключения

Для локальной разработки:

```txt
Host:     localhost
Port:     5432
Database: mrsimon
User:     mrsimon
Password: mrsimon
```

### Подключение через GUI

Можно использовать любой клиент:

- Beekeeper Studio
- DBeaver

Создай новое подключение PostgreSQL и укажи параметры выше.

---

### Подключение через терминал

```bash
docker compose exec db psql -U mrsimon -d mrsimon
```

Полезные команды:

```sql
\dt              -- список таблиц
SELECT * FROM "Users";
```

---

### Connection string (backend)

```txt
Host=db;Port=5432;Database=mrsimon;Username=mrsimon;Password=mrsimon
```

> Важно: внутри Docker используется `Host=db`, а не `localhost`.

---

### Примечание по безопасности

Для разработки используется простой пароль.

В будущем:

- вынести в `.env`
- не хранить секреты в репозитории
- использовать переменные окружения

## Текущий режим разработки

```txt
Frontend: pnpm dev
Backend:  dotnet watch
```

Оба сервиса запускаются через Docker.