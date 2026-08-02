# Backend - Plataforma de Eventos

Proyecto backend desarrollado con Node.js, Express y MongoDB para una plataforma de gestión de eventos.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- nodemon

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

## Configuración

Crear un archivo `.env` en la raíz del proyecto tomando como referencia el archivo `.env.example`:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=tu_url_de_mongodb
JWT_SECRET=tu_clave_secreta
```

El archivo `.env` contiene información privada y no debe subirse al repositorio.

## Ejecución

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

Para ejecutarlo normalmente:

```bash
npm start
```

El servidor queda disponible en:

```text
http://localhost:8080
```

## Estructura del proyecto

```text
src/
├── config/
│   └── database.js
├── controllers/
│   ├── events.controller.js
│   └── sessions.controller.js
├── dao/
│   ├── events.dao.js
│   └── users.dao.js
├── middlewares/
│   └── example.middleware.js
├── models/
│   ├── event.model.js
│   └── user.model.js
├── repositories/
│   ├── events.repository.js
│   └── users.repository.js
├── routes/
│   ├── events.routes.js
│   ├── sessions.routes.js
│   └── users.routes.js
├── services/
│   └── events.service.js
├── utils/
│   └── errors.js
├── app.js
└── server.js
```

## Endpoints disponibles

### Comprobar el estado del servidor

```http
GET /api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

### Obtener los eventos

```http
GET /api/events
```

Respuesta de ejemplo:

```json
{
  "status": "success",
  "payload": []
}
```

### Crear un evento

```http
POST /api/events
```

Ejemplo del cuerpo de la solicitud:

```json
{
  "title": "Conferencia de tecnología",
  "description": "Evento sobre desarrollo de software",
  "date": "2026-09-15T18:00:00.000Z",
  "location": "Montevideo",
  "organizerEmail": "organizador@ejemplo.com",
  "capacity": 100
}
```

Los siguientes campos son obligatorios:

- `title`
- `date`
- `location`
- `organizerEmail`

### Comprobar la ruta de sesiones

```http
GET /api/sessions
```

Respuesta esperada:

```json
{
  "status": "success",
  "message": "Ruta de sesiones disponible"
}
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto en el que se ejecuta el servidor |
| `NODE_ENV` | Entorno de ejecución del proyecto |
| `MONGO_URL` | Dirección de conexión a MongoDB |
| `JWT_SECRET` | Clave que se utilizará para trabajar con JWT |

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Ejecuta el servidor con nodemon |
| `npm start` | Ejecuta el servidor con Node.js |

## Autor

Odilen González Lobelles