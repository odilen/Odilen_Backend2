# Backend - Plataforma de Eventos

Proyecto backend desarrollado con Node.js, Express y MongoDB para la plataforma de eventos.

## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- nodemon

## Instalación

```bash
npm install
```

## Configuración

Crear un archivo `.env` con:

```env
PORT=8080
MONGO_URL=tu_url_de_mongodb
```

## Ejecución

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:8080`.

## Estructura del proyecto

```text
src/
├── config/
│   ├── app.js
│   ├── database.js
│   └── passport.config.js
├── controllers/
│   ├── events.controller.js
│   ├── sessions.controller.js
│   └── users.controller.js
├── dao/
│   ├── events.dao.js
│   └── users.dao.js
├── models/
│   ├── event.model.js
│   └── user.model.js
├── repositories/
│   ├── events.repository.js
│   └── users.repository.js
├── routes/
│   ├── events.routes.js
│   └── users.routes.js
├── services/
│   ├── events.service.js
│   └── sessions.service.js
└── utils/
    └── errors.js
```

## Rutas de ejemplo

- `GET /api/users`
- `GET /api/events`
- `POST /api/events`