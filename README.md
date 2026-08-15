# Backend - Plataforma de Eventos

API REST desarrollada con Node.js, Express y MongoDB para una plataforma de gestión de eventos e inscripciones.

El proyecto permite administrar eventos y autenticar usuarios mediante Passport.js, JWT y cookies HTTP Only.

## Tecnologías utilizadas

* Node.js
* Express
* MongoDB
* Mongoose
* Passport.js
* passport-local
* passport-jwt
* JSON Web Token
* bcrypt
* cookie-parser
* dotenv
* nodemon

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

## Configuración

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=tu_url_de_mongodb
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
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
│   ├── database.js
│   └── passport.config.js
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
│   ├── errors.js
│   ├── hash.js
│   └── jwt.js
├── app.js
└── server.js
```

## Arquitectura

El proyecto se encuentra organizado por responsabilidades:

* **Routes:** definen los endpoints y sus middlewares.
* **Controllers:** reciben la solicitud y generan la respuesta HTTP.
* **Passport:** centraliza el registro, login y validación del usuario actual.
* **Services:** contienen la lógica de negocio de los eventos.
* **Repositories:** conectan la lógica de negocio con los DAO.
* **DAO:** realizan las operaciones sobre la base de datos.
* **Models:** definen la estructura de los documentos de MongoDB.
* **Utils:** contienen funciones reutilizables para contraseñas y JWT.

## Autenticación centralizada con Passport.js

La configuración de Passport se encuentra centralizada en:

```text
src/config/passport.config.js
```

Passport se inicializa una sola vez en `app.js`:

```js
initializePassport()
app.use(passport.initialize())
```

El proyecto no utiliza sesiones tradicionales de Passport. La autenticación se mantiene mediante JWT y una cookie HTTP Only.

### Estrategias implementadas

| Estrategia | Responsabilidad                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| `register` | Valida los datos, normaliza el email, comprueba la unicidad, cifra la contraseña y asigna el rol `user` |
| `login`    | Busca al usuario y valida su contraseña                                                                 |
| `current`  | Lee y verifica el JWT almacenado en la cookie `currentUser`                                             |

El sistema queda preparado para agregar providers externos como Google o GitHub. Las nuevas estrategias pueden incorporarse en `passport.config.js` sin modificar `app.js`.

## JWT y cookie de autenticación

Después de una autenticación exitosa, Passport deja los datos del usuario disponibles en `req.user`.

El controller de sesiones genera el JWT y lo guarda en una cookie llamada `currentUser`.

Passport no genera el JWT.

La cookie se configura con:

* `httpOnly: true`
* `sameSite: 'lax'`
* `maxAge: 3600000`
* `secure: true` únicamente en producción

El JWT contiene solamente:

* `id`
* `email`
* `role`

La contraseña nunca se incluye en el JWT ni en las respuestas de la API.

## Endpoints disponibles

### Estado del servidor

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

### Estado de la ruta de sesiones

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

## Rutas de autenticación

| Método | Ruta                     | Estrategia          | Descripción                              |
| ------ | ------------------------ | ------------------- | ---------------------------------------- |
| POST   | `/api/sessions/register` | `register`          | Registra un usuario                      |
| POST   | `/api/sessions/login`    | `login`             | Valida las credenciales y crea la cookie |
| GET    | `/api/sessions/current`  | `current`           | Devuelve el usuario autenticado          |
| POST   | `/api/sessions/logout`   | No utiliza Passport | Elimina la cookie                        |

### Registrar un usuario

```http
POST /api/sessions/register
```

Ejemplo de solicitud:

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

La estrategia `register` realiza las siguientes operaciones:

* Comprueba los campos obligatorios.
* Valida el formato del email.
* Normaliza el email mediante `trim()` y `toLowerCase()`.
* Comprueba que el email no se encuentre registrado.
* Valida que la contraseña tenga al menos 8 caracteres.
* Cifra la contraseña con bcrypt.
* Asigna siempre el rol `user`.

Respuesta exitosa — `201 Created`:

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

La contraseña nunca se devuelve en la respuesta.

Posibles errores:

| Código            | Motivo                                    |
| ----------------- | ----------------------------------------- |
| `400 Bad Request` | Faltan campos obligatorios                |
| `400 Bad Request` | El formato del email no es válido         |
| `400 Bad Request` | La contraseña tiene menos de 8 caracteres |
| `409 Conflict`    | El email ya está registrado               |

Ejemplo de email duplicado:

```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

### Iniciar sesión

```http
POST /api/sessions/login
```

Ejemplo de solicitud:

```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

La estrategia `login` busca al usuario y compara la contraseña ingresada con el hash almacenado.

Si la autenticación es exitosa, el controller genera el JWT y crea la cookie `currentUser`.

Respuesta exitosa — `200 OK`:

```json
{
  "status": "success",
  "message": "Login correcto"
}
```

Si el email no existe o la contraseña es incorrecta, la API devuelve el mismo mensaje genérico.

Respuesta — `401 Unauthorized`:

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

Esto evita revelar si un email se encuentra registrado.

### Obtener el usuario actual

```http
GET /api/sessions/current
```

La ruta utiliza la estrategia `current`.

Esta estrategia:

* Obtiene el JWT desde la cookie `currentUser`.
* Verifica la firma del token.
* Comprueba su fecha de expiración.
* Deja los datos del usuario disponibles en `req.user`.

Respuesta exitosa — `200 OK`:

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

Si la cookie no existe, el token está vencido o fue manipulado, la API responde `401 Unauthorized`:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

### Cerrar sesión

```http
POST /api/sessions/logout
```

Esta ruta no utiliza Passport. El controller elimina la cookie `currentUser`.

Respuesta exitosa — `200 OK`:

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

Después del logout, una nueva solicitud a `/api/sessions/current` responde `401 Unauthorized`.

## Rutas de eventos

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

Ejemplo de solicitud:

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

Campos obligatorios:

* `title`
* `date`
* `location`
* `organizerEmail`

## Seguridad

El sistema aplica las siguientes medidas:

* Las contraseñas se almacenan como hashes de bcrypt.
* Las contraseñas no se incluyen en las respuestas.
* Las contraseñas no se incluyen en los JWT.
* Los emails se normalizan antes de guardarse.
* Los emails duplicados son rechazados.
* El registro público asigna siempre el rol `user`.
* El rol recibido en el body del registro es ignorado.
* Las credenciales inválidas generan un mensaje genérico.
* El JWT se almacena en una cookie HTTP Only.
* Los tokens alterados o expirados son rechazados.
* La configuración privada permanece en `.env`.

## Pruebas realizadas

Antes de la entrega se comprobaron los siguientes casos:

1. Registro exitoso.
2. Login exitoso y creación de la cookie `currentUser`.
3. Consulta de `/current` con un token válido.
4. Logout y eliminación de la cookie.
5. Consulta de `/current` después del logout con respuesta `401`.
6. Registro con email duplicado.
7. Login con contraseña incorrecta.
8. Login con email inexistente.
9. Consulta de `/current` sin cookie.
10. Consulta de `/current` con un token manipulado.

## Variables de entorno

| Variable         | Descripción                                             |
| ---------------- | ------------------------------------------------------- |
| `PORT`           | Puerto en el que se ejecuta el servidor                 |
| `NODE_ENV`       | Entorno de ejecución                                    |
| `MONGO_URL`      | Dirección de conexión a MongoDB                         |
| `JWT_SECRET`     | Clave secreta utilizada para firmar y verificar los JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del JWT, por ejemplo `1h`          |

## Scripts disponibles

| Comando       | Descripción                     |
| ------------- | ------------------------------- |
| `npm run dev` | Ejecuta el servidor con nodemon |
| `npm start`   | Ejecuta el servidor con Node.js |

## Autor

Odilen González Lobelles
