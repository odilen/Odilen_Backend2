# Backend - Plataforma de Eventos

Proyecto backend realizado con **Node.js, Express y MongoDB** para una plataforma de eventos.

El proyecto permite:

* Registrar usuarios.
* Iniciar y cerrar sesión.
* Mantener la autenticación mediante JWT y cookies.
* Consultar eventos.
* Crear eventos.
* Modificar eventos.
* Manejar distintos roles de usuario.
* Proteger rutas dependiendo del rol.
* Evitar que un organizador modifique eventos de otro organizador.

Este proyecto forma parte del curso de Backend y se fue desarrollando de forma progresiva en las diferentes entregas.

---

# Tecnologías utilizadas

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

---

# Instalación

Primero se debe clonar el repositorio e instalar las dependencias.

```bash
npm install
```

---

# Variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como ejemplo el archivo `.env.example`.

Ejemplo:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=tu_url_de_mongodb
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
```

El archivo `.env` contiene información privada y por ese motivo **no debe subirse al repositorio**.

---

# Ejecución del proyecto

Para ejecutar el proyecto durante el desarrollo:

```bash
npm run dev
```

Esto utiliza `nodemon`, por lo que el servidor se reinicia automáticamente cuando se modifica un archivo.

También se puede ejecutar normalmente con:

```bash
npm start
```

Por defecto el servidor se encuentra disponible en:

```text
http://localhost:8080
```

---

# Estructura del proyecto

El proyecto se encuentra separado en diferentes carpetas para dividir las responsabilidades.

```text
src/
├── config/
│   ├── database.js
│   └── passport.config.js
│
├── controllers/
│   ├── events.controller.js
│   ├── sessions.controller.js
│   └── users.controller.js
│
├── dao/
│   ├── events.dao.js
│   └── users.dao.js
│
├── middlewares/
│   ├── auth.middleware.js
│   └── authorizedRoles.middleware.js
│
├── models/
│   ├── event.model.js
│   └── user.model.js
│
├── repositories/
│   ├── events.repository.js
│   └── users.repository.js
│
├── routes/
│   ├── events.routes.js
│   ├── sessions.routes.js
│   └── users.routes.js
│
├── services/
│   └── events.service.js
│
├── utils/
│   ├── errors.js
│   ├── hash.js
│   └── jwt.js
│
├── app.js
└── server.js
```

---

# Organización del proyecto

La aplicación se divide por responsabilidades.

## Routes

Las rutas reciben las solicitudes HTTP y deciden qué controller ejecutar.

Ejemplo:

```text
POST /api/events
```

La ruta también puede ejecutar middlewares antes de llegar al controller.

---

## Controllers

Los controllers reciben la solicitud y generan la respuesta HTTP.

Por ejemplo:

```text
Request
   ↓
Controller
   ↓
Response
```

Los controllers pueden acceder a:

```js
req.body
req.params
req.user
```

dependiendo de la solicitud.

---

## Services

Los services contienen parte de la lógica del negocio.

Por ejemplo, antes de crear un evento se pueden validar los datos recibidos.

---

## Repositories

Los repositories sirven como intermediarios entre los services y los DAO.

El flujo utilizado en el proyecto es:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
DAO
  ↓
MongoDB
```

---

## DAO

Los DAO realizan directamente las operaciones sobre MongoDB utilizando Mongoose.

Por ejemplo:

```js
User.find()
```

o:

```js
Event.findById(id)
```

---

## Models

Los models definen cómo se guardan los documentos dentro de MongoDB.

Actualmente existen:

```text
User
Event
```

---

## Middlewares

Los middlewares se ejecutan antes del controller.

En esta entrega se utilizan principalmente para:

* Verificar si un usuario está autenticado.
* Verificar si el rol del usuario tiene permiso para utilizar una ruta.

---

# Conexión a MongoDB

La conexión a MongoDB se encuentra en:

```text
src/config/database.js
```

La URL de conexión se obtiene desde:

```env
MONGO_URL
```

para evitar dejar credenciales escritas directamente dentro del código.

---

# Modelo de usuario

El modelo `User` contiene los datos principales del usuario.

Entre ellos:

```text
first_name
last_name
email
password
role
provider
```

Los roles disponibles son:

```text
user
organizer
admin
```

El rol por defecto es:

```text
user
```

Por lo tanto, cuando se registra una persona normalmente se crea como usuario común.

---

# Registro de usuarios

Endpoint:

```http
POST /api/sessions/register
```

Ejemplo:

```json
{
  "first_name": "Ana",
  "last_name": "Perez",
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

Durante el registro se realizan distintas validaciones.

Se verifica:

* Que estén los campos obligatorios.
* Que el email tenga un formato válido.
* Que el email no se encuentre registrado.
* Que la contraseña tenga al menos 8 caracteres.
* Que el email sea normalizado.
* Que la contraseña sea cifrada.

El email se transforma utilizando:

```js
trim()
toLowerCase()
```

La contraseña se cifra con `bcrypt`.

---

# Seguridad del rol durante el registro

El registro público **no permite elegir el rol del usuario**.

Aunque alguien intentara enviar:

```json
{
  "first_name": "Juan",
  "last_name": "Perez",
  "email": "juan@mail.com",
  "password": "Secreta123",
  "role": "admin"
}
```

el backend crea al usuario como:

```text
user
```

Esto evita que una persona pueda registrarse a sí misma como:

```text
admin
```

o:

```text
organizer
```

El rol se asigna desde el backend.

---

# Inicio de sesión

Endpoint:

```http
POST /api/sessions/login
```

Ejemplo:

```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

Passport busca al usuario y verifica la contraseña.

Si las credenciales son correctas se genera un JWT.

El JWT contiene:

```text
id
email
role
```

La contraseña no se guarda dentro del token.

---

# JWT

El proyecto utiliza **JSON Web Token** para identificar al usuario autenticado.

Después del login se genera un JWT y se guarda dentro de una cookie.

La cookie se llama:

```text
currentUser
```

El token contiene información básica del usuario:

```json
{
  "id": "...",
  "email": "usuario@mail.com",
  "role": "user"
}
```

---

# Cookie de autenticación

El JWT se guarda en una cookie HTTP Only.

La configuración utilizada es similar a:

```js
res.cookie('currentUser', token, {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 3600000,
  secure: process.env.NODE_ENV === 'production'
})
```

`httpOnly` ayuda a evitar que JavaScript del navegador acceda directamente a la cookie.

---

# Passport.js

Passport se utiliza para manejar la autenticación.

La configuración principal se encuentra en:

```text
src/config/passport.config.js
```

Actualmente se utilizan las siguientes estrategias:

| Estrategia | Uso                                    |
| ---------- | -------------------------------------- |
| `register` | Registrar usuarios                     |
| `login`    | Validar email y contraseña             |
| `current`  | Validar el JWT del usuario autenticado |

Passport se inicializa en `app.js`.

```js
initializePassport()
app.use(passport.initialize())
```

No se utilizan sesiones tradicionales de Passport.

La sesión se mantiene mediante:

```text
JWT + cookie
```

---

# Usuario autenticado

Endpoint:

```http
GET /api/sessions/current
```

Esta ruta permite consultar los datos del usuario que se encuentra autenticado.

Si el JWT es válido, Passport carga el usuario en:

```js
req.user
```

Ejemplo:

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

---

# Logout

Endpoint:

```http
POST /api/sessions/logout
```

El logout elimina la cookie:

```text
currentUser
```

Después de eliminarla, el usuario deja de estar autenticado.

---

# Roles

En esta entrega se agregó autorización basada en roles.

Existen tres roles:

## user

Es el usuario común de la plataforma.

Puede consultar eventos pero no puede crearlos ni modificarlos.

---

## organizer

Es un usuario que puede administrar eventos.

Puede:

* Consultar eventos.
* Crear eventos.
* Modificar sus propios eventos.

No puede:

* Modificar eventos de otros organizadores.
* Consultar la lista completa de usuarios.

---

## admin

Es el usuario con mayores permisos.

Puede:

* Consultar eventos.
* Crear eventos.
* Modificar cualquier evento.
* Consultar todos los usuarios.

---

# Matriz de permisos

La siguiente tabla muestra los permisos utilizados en el proyecto.

| Acción                     | user | organizer | admin |
| -------------------------- | ---- | --------- | ----- |
| Consultar eventos          | ✅    | ✅         | ✅     |
| Crear eventos              | ❌    | ✅         | ✅     |
| Modificar eventos propios  | ❌    | ✅         | ✅     |
| Modificar cualquier evento | ❌    | ❌         | ✅     |
| Ver todos los usuarios     | ❌    | ❌         | ✅     |

---

# Autenticación y autorización

Aunque pueden parecer lo mismo, en el proyecto se manejan como dos cosas diferentes.

## Autenticación

La autenticación responde a la pregunta:

```text
¿Quién es el usuario?
```

Para esto se utiliza:

```text
auth.middleware.js
```

El middleware valida el JWT.

Si el usuario está correctamente autenticado, se guarda su información en:

```js
req.user
```

---

## Autorización

La autorización responde a otra pregunta:

```text
¿Este usuario tiene permiso para realizar esta acción?
```

Para esto se utiliza el middleware:

```text
authorizedRoles.middleware.js
```

Se pueden indicar los roles permitidos.

Ejemplo:

```js
authorizedRoles('organizer', 'admin')
```

Esto significa que solamente pueden continuar usuarios con alguno de esos dos roles.

---

# Diferencia entre 401 y 403

Una parte importante de esta entrega fue diferenciar correctamente estos dos errores.

## 401 Unauthorized

Se utiliza cuando el usuario **no está autenticado**.

Por ejemplo:

```text
No existe cookie.
JWT inválido.
JWT vencido.
```

Respuesta:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

Código:

```text
401
```

---

## 403 Forbidden

Se utiliza cuando el usuario **sí está autenticado**, pero su rol no tiene permiso para realizar una acción.

Ejemplo:

Un usuario con:

```text
role = user
```

intenta crear un evento.

La respuesta es:

```json
{
  "status": "error",
  "message": "Access denied"
}
```

Código:

```text
403
```

---

# Ejemplo del flujo de seguridad

Para crear un evento se ejecuta:

```text
POST /api/events
        ↓
authenticate
        ↓
¿Existe sesión válida?
        ↓
   NO → 401
        ↓
       SÍ
        ↓
authorizedRoles('organizer', 'admin')
        ↓
¿Tiene un rol permitido?
        ↓
   NO → 403
        ↓
       SÍ
        ↓
createEvent
        ↓
      201
```

---

# Rutas de eventos

## Obtener eventos

Endpoint:

```http
GET /api/events
```

Esta ruta puede ser utilizada para consultar los eventos.

Respuesta:

```json
{
  "status": "success",
  "payload": []
}
```

---

# Crear evento

Endpoint:

```http
POST /api/events
```

Roles permitidos:

```text
organizer
admin
```

Un usuario con rol:

```text
user
```

recibe:

```text
403 Forbidden
```

Un usuario sin sesión recibe:

```text
401 Unauthorized
```

---

## Ejemplo para crear un evento

```json
{
  "title": "Congreso Tech 2026",
  "description": "Evento sobre tecnología",
  "date": "2026-09-15T19:00:00.000Z",
  "location": "Montevideo",
  "capacity": 100
}
```

El email del organizador no necesita confiarse al cliente.

El backend puede obtenerlo directamente desde:

```js
req.user.email
```

y guardarlo como:

```text
organizerEmail
```

De esta manera el evento queda relacionado con la persona que lo creó.

---

# Modificar evento

Endpoint:

```http
PUT /api/events/:id
```

Ejemplo:

```http
PUT /api/events/6690abc123...
```

Roles permitidos:

```text
organizer
admin
```

Sin embargo, además del rol existe una validación adicional.

---

# Propiedad de eventos

Un `organizer` solamente puede modificar sus propios eventos.

Para verificarlo se compara:

```text
event.organizerEmail
```

con:

```text
req.user.email
```

La lógica utilizada es similar a:

```js
if (
  req.user.role === 'organizer' &&
  event.organizerEmail !== req.user.email
) {
  return res.status(403).json({
    status: 'error',
    message: 'Solo podés modificar tus propios eventos'
  })
}
```

Esto significa:

```text
organizer + evento propio
→ puede modificarlo
```

```text
organizer + evento ajeno
→ 403
```

---

# Permisos del administrador sobre eventos

El administrador puede modificar cualquier evento.

El `admin` no necesita ser propietario.

Por ejemplo:

```text
admin
  ↓
PUT /api/events/:id
  ↓
evento de cualquier organizer
  ↓
200 OK
```

---

# Ruta administrativa de usuarios

También se agregó una ruta solamente para administradores.

Endpoint:

```http
GET /api/users
```

Rol permitido:

```text
admin
```

Si un `organizer` intenta acceder:

```text
403 Forbidden
```

Si un `user` intenta acceder:

```text
403 Forbidden
```

Si un `admin` accede:

```text
200 OK
```

---

# Protección de contraseñas

Las contraseñas se almacenan utilizando bcrypt.

Nunca se debe devolver la contraseña del usuario desde una respuesta de la API.

Al obtener todos los usuarios se excluye el campo `password`.

Por ejemplo:

```js
User.find().select('-password')
```

Esto devuelve los usuarios sin incluir el hash de la contraseña.

---

# Rutas principales

| Método | Ruta                     | Acceso            | Descripción                       |
| ------ | ------------------------ | ----------------- | --------------------------------- |
| GET    | `/api/health`            | Público           | Verifica que el servidor funcione |
| POST   | `/api/sessions/register` | Público           | Registra un usuario               |
| POST   | `/api/sessions/login`    | Público           | Inicia sesión                     |
| GET    | `/api/sessions/current`  | Autenticado       | Devuelve usuario actual           |
| POST   | `/api/sessions/logout`   | Usuario           | Cierra sesión                     |
| GET    | `/api/events`            | Público           | Consulta eventos                  |
| POST   | `/api/events`            | organizer / admin | Crea un evento                    |
| PUT    | `/api/events/:id`        | organizer / admin | Modifica un evento                |
| GET    | `/api/users`             | admin             | Consulta todos los usuarios       |

---

# Ejemplos de autorización

## Sin iniciar sesión

Solicitud:

```http
POST /api/events
```

Respuesta:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

Código:

```text
401
```

---

## Usuario común intentando crear evento

Usuario:

```text
role = user
```

Solicitud:

```http
POST /api/events
```

Respuesta:

```json
{
  "status": "error",
  "message": "Access denied"
}
```

Código:

```text
403
```

---

## Organizer creando evento

Usuario:

```text
role = organizer
```

Solicitud:

```http
POST /api/events
```

Resultado esperado:

```text
201 Created
```

---

## Organizer intentando entrar a ruta administrativa

Usuario:

```text
role = organizer
```

Solicitud:

```http
GET /api/users
```

Resultado:

```text
403 Forbidden
```

---

## Admin entrando a ruta administrativa

Usuario:

```text
role = admin
```

Solicitud:

```http
GET /api/users
```

Resultado:

```text
200 OK
```

---

# Pruebas realizadas

Durante el desarrollo se probaron manualmente los principales casos utilizando Postman.

## Autenticación

1. Registro de usuario correcto.
2. Registro con email duplicado.
3. Login correcto.
4. Login con contraseña incorrecta.
5. Login con usuario inexistente.
6. Consulta de `/current` con cookie válida.
7. Consulta de `/current` sin cookie.
8. Logout.
9. Consulta de `/current` después del logout.

---

## Roles y autorización

También se probaron los siguientes casos:

1. `POST /api/events` sin cookie → `401`.
2. `POST /api/events` con rol `user` → `403`.
3. `POST /api/events` con rol `organizer` → `201`.
4. `GET /api/users` con rol `organizer` → `403`.
5. `GET /api/users` con rol `admin` → `200`.
6. `PUT /api/events/:id` con organizer sobre evento propio → `200`.
7. `PUT /api/events/:id` con organizer sobre evento ajeno → `403`.
8. `PUT /api/events/:id` con admin sobre evento ajeno → `200`.
9. Ruta privada sin cookie → `401`.

---

# Ejemplo de 401

```text
Usuario
  ↓
No tiene cookie válida
  ↓
authenticate
  ↓
401 Unauthorized
```

---

# Ejemplo de 403

```text
Usuario autenticado
       ↓
role = user
       ↓
POST /api/events
       ↓
authorizedRoles('organizer', 'admin')
       ↓
403 Forbidden
```

---

# Seguridad aplicada

El proyecto incluye algunas medidas básicas de seguridad aprendidas durante el curso.

* Las contraseñas se cifran con bcrypt.
* La contraseña no se guarda dentro del JWT.
* La contraseña no debe devolverse al consultar usuarios.
* Los emails se normalizan antes de guardarse.
* Los emails duplicados son rechazados.
* El registro público siempre crea usuarios con rol `user`.
* El rol enviado en el body del registro no permite crear administradores.
* El JWT se almacena dentro de una cookie HTTP Only.
* Los JWT inválidos o vencidos son rechazados.
* Las rutas privadas utilizan middleware de autenticación.
* Las rutas con permisos utilizan middleware de autorización.
* Los organizers solamente pueden modificar sus propios eventos.
* Los administradores pueden modificar cualquier evento.
* Se diferencia `401` de `403`.
* Las variables privadas se mantienen dentro de `.env`.

---

# Variables de entorno utilizadas

| Variable         | Descripción                         |
| ---------------- | ----------------------------------- |
| `PORT`           | Puerto del servidor                 |
| `NODE_ENV`       | Entorno de ejecución                |
| `MONGO_URL`      | URL de conexión a MongoDB           |
| `JWT_SECRET`     | Clave utilizada para firmar los JWT |
| `JWT_EXPIRES_IN` | Tiempo de duración del JWT          |

---

# Scripts

## Desarrollo

```bash
npm run dev
```

Ejecuta el proyecto utilizando nodemon.

## Ejecución normal

```bash
npm start
```

Ejecuta el proyecto utilizando Node.js.

---

# Resumen de la Pre-entrega 5

En esta entrega se agregó un sistema de autorización por roles.

Los principales cambios fueron:

* Se utilizaron los roles `user`, `organizer` y `admin`.
* Se creó un middleware reutilizable para comprobar la autenticación.
* Se creó un middleware reutilizable para comprobar roles.
* Se protegió la creación de eventos.
* Se agregó una ruta exclusiva para administradores.
* Se agregó modificación de eventos.
* Se agregó una validación para que un organizer solamente pueda modificar sus eventos.
* Se permitió que un admin pueda modificar cualquier evento.
* Se diferenciaron correctamente los errores `401` y `403`.

La idea principal aprendida en esta entrega es:

```text
Estar autenticado no significa tener permiso para hacer todo.
```

Primero se verifica quién es el usuario y después se verifica qué acciones puede realizar según su rol.

---

# Autor

Odilen González Lobelles
