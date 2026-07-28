# Backend - Ejemplo Base

Proyecto backend desarrollado con Node.js, Express y MongoDB para el curso de Backend II.

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

## Estructura principal

```text
src/
├── config/        # conexión a la base de datos y configuración de la app
├── controllers/   # lógica de las rutas
├── models/        # modelos de Mongoose
├── routes/        # endpoints de la API
├── services/      # lógica de negocio
├── utils/         # utilidades
```

## Rutas de ejemplo

- `GET /api/users`
- `GET /api/events`
- `POST /api/events`