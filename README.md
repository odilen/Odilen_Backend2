# Backend - Plataforma de Eventos

Proyecto backend desarrollado con Node.js, Express y MongoDB para una plataforma de gestión de eventos e inscripciones.

Actualmente, el proyecto permite administrar eventos y registrar usuarios de manera segura mediante validación de datos, normalización del correo electrónico y cifrado de contraseñas.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- bcrypt
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
│   ├── events.service.js
│   └── sessions.service.js
├── utils/
│   ├── errors.js
│   └── hash.js
├── app.js
└── server.js
```

## Arquitectura

El proyecto utiliza una arquitectura organizada por capas:

```text
Ruta → Controller → Service → Repository → DAO → Modelo
```

Cada capa tiene una responsabilidad específica:

- **Ruta:** define el endpoint y lo conecta con su controlador.
- **Controller:** recibe la solicitud y genera la respuesta HTTP.
- **Service:** contiene las reglas y la lógica de negocio.
- **Repository:** conecta el servicio con la capa de acceso a datos.
- **DAO:** ejecuta las operaciones sobre la base de datos.
- **Modelo:** define la estructura de los documentos de MongoDB.

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

### Registrar un usuario

```http
POST /api/sessions/register
```

Este endpoint permite registrar usuarios de manera segura en MongoDB.

#### Campos esperados

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `first_name` | String | Sí | Nombre del usuario |
| `last_name` | String | Sí | Apellido del usuario |
| `email` | String | Sí | Correo electrónico válido |
| `password` | String | Sí | Contraseña de al menos 8 caracteres |

El campo `role` no se acepta desde el registro público. Todos los usuarios registrados mediante este endpoint se crean automáticamente con el rol `user`.

#### Ejemplo de solicitud

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

Antes de guardar el usuario:

- Se comprueba que todos los campos obligatorios estén presentes.
- Se valida el formato del correo electrónico.
- El correo se normaliza utilizando `trim()` y `toLowerCase()`.
- Se comprueba que el correo no esté registrado.
- La contraseña se cifra utilizando `bcrypt`.
- El rol se establece siempre como `user`.

#### Respuesta exitosa

Código HTTP: `201 Created`

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

La contraseña nunca se devuelve en la respuesta, ni en texto plano ni cifrada.

#### Campos faltantes

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

#### Email con formato inválido

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "El formato del email no es válido"
}
```

#### Contraseña demasiado corta

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "La contraseña debe tener al menos 8 caracteres"
}
```

#### Email ya registrado

Código HTTP: `409 Conflict`

```json
{
  "status": "error",
  "message": "El email ya está registrado"
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

## Seguridad del registro

Las contraseñas se cifran utilizando `bcrypt` antes de almacenarse en MongoDB.

El helper reutilizable encargado del cifrado se encuentra en:

```text
src/utils/hash.js
```

El sistema también garantiza que:

- Las contraseñas no se almacenan en texto plano.
- Las contraseñas no se incluyen en las respuestas.
- Los correos duplicados son rechazados.
- El rol no puede manipularse desde el body del registro público.
- Solo se permiten los roles `user`, `organizer` y `admin`.
- El registro público asigna siempre el rol `user`.

## Prueba del registro con Postman

Configurar una solicitud con los siguientes datos:

```text
Método: POST
URL: http://localhost:8080/api/sessions/register
Body: raw
Formato: JSON
```

Utilizar como ejemplo:

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

Después del registro, se recomienda comprobar en MongoDB que el campo `password` contiene un hash similar a:

```text
$2b$10$...
```

La contraseña almacenada nunca debe coincidir con la contraseña enviada originalmente.

## Autenticación con JWT y cookies

El sistema utiliza JWT (JSON Web Token) para autenticar usuarios.

Cuando un usuario inicia sesión correctamente, el servidor genera un JWT y lo almacena en una cookie HTTP Only llamada `currentUser`.

La cookie se configura con:

- `httpOnly: true`
- `sameSite: 'lax'`
- `maxAge: 3600000` (1 hora)
- `secure: true` únicamente en producción

El token contiene únicamente:

- `id`
- `email`
- `role`

La contraseña nunca se almacena dentro del JWT.

### Rutas de autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/sessions/register` | Registra un nuevo usuario |
| POST | `/api/sessions/login` | Autentica al usuario y genera la cookie JWT |
| GET | `/api/sessions/current` | Devuelve el usuario actualmente autenticado |
| POST | `/api/sessions/logout` | Cierra la sesión y elimina la cookie |

### Registrar usuario

```http
POST /api/sessions/register
```

Request:

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

Response `201 Created`:

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

La contraseña se almacena hasheada utilizando bcrypt y nunca se devuelve en la respuesta.

### Login

```http
POST /api/sessions/login
```

Request:

```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

Response `200 OK`:

```json
{
  "status": "success",
  "message": "Login correcto"
}
```

Además, el servidor crea la cookie HTTP Only `currentUser` con el JWT.

Si el email no existe o la contraseña es incorrecta:

Response `401 Unauthorized`:

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

Por seguridad, la API no informa si el error corresponde al email o a la contraseña.

### Usuario autenticado

```http
GET /api/sessions/current
```

Esta ruta está protegida por el middleware `auth`.

El middleware obtiene el JWT desde la cookie `currentUser`, verifica su firma y expiración y guarda el payload en `req.user`.

Response `200 OK`:

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

Si no existe la cookie o el token es inválido o expiró:

Response `401 Unauthorized`:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

### Logout

```http
POST /api/sessions/logout
```

El endpoint elimina la cookie `currentUser`.

Response `200 OK`:

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

Después del logout, una nueva petición a `/api/sessions/current` devuelve `401 Unauthorized`.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto en el que se ejecuta el servidor |
| `NODE_ENV` | Entorno de ejecución del proyecto |
| `MONGO_URL` | Dirección de conexión a MongoDB |
| `JWT_SECRET` | Clave que se utilizará posteriormente para trabajar con JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del JWT, por ejemplo `1h` |

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Ejecuta el servidor con nodemon |
| `npm start` | Ejecuta el servidor con Node.js |

## Autor

Odilen González Lobelles