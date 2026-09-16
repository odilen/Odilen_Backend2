# API Backend — Plataforma de eventos

Proyecto desarrollado durante el curso de Backend de Coderhouse con Node.js, Express y MongoDB.

La API permite registrar usuarios, autenticar sesiones, administrar eventos y gestionar inscripciones con control de cupos y correo de confirmación.

Es la evolución de las preentregas realizadas durante el curso.

## Tecnologías

- Node.js
- Express
- MongoDB y Mongoose
- Passport.js, passport-local y passport-jwt
- JSON Web Token (JWT)
- bcrypt
- cookie-parser
- Nodemailer
- dotenv
- nodemon

## Instalación

Requisitos:

- Node.js y npm.
- Una base de datos MongoDB local o en Atlas.
- Acceso a un servidor SMTP para enviar correos.

Clonar el repositorio:

```bash
git clone https://github.com/odilen/Odilen_Backend2.git
```

Entrar en la carpeta:

```bash
cd Odilen_Backend2
```

Instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` tomando como referencia `.env.example`.

## Variables de entorno

Ejemplo de configuración:

```env
PORT=8080
MONGO_URL=mongodb://127.0.0.1:27017/plataforma_eventos
JWT_SECRET=reemplazar_por_una_clave_secreta
JWT_EXPIRES_IN=1h
NODE_ENV=development

MAIL_HOST=smtp.ejemplo.com
MAIL_PORT=587
MAIL_USER=usuario_de_correo
MAIL_PASS=contrasena_de_correo
MAIL_FROM=correo_remitente@ejemplo.com
```

| Variable | Descripción |
|---|---|
| PORT | Puerto del servidor |
| MONGO_URL | URL de conexión a MongoDB |
| JWT_SECRET | Clave secreta para firmar los JWT |
| JWT_EXPIRES_IN | Duración del token |
| NODE_ENV | Entorno de ejecución |
| MAIL_HOST | Servidor SMTP |
| MAIL_PORT | Puerto SMTP |
| MAIL_USER | Usuario SMTP |
| MAIL_PASS | Contraseña SMTP |
| MAIL_FROM | Remitente autorizado para enviar correos |

Los valores de correo deben reemplazarse por los de un proveedor SMTP real.

El transporte utiliza conexión segura directa cuando el puerto es 465.

El archivo `.env` contiene datos privados y está excluido de Git junto con `node_modules`.

## Comandos

Desarrollo:

```bash
npm run dev
```

Ejecución normal:

```bash
npm start
```

Dirección por defecto:

```text
http://localhost:8080
```

## Arquitectura

El proyecto contiene las siguientes carpetas:

```text
src/
├── config/
├── controllers/
├── dao/
├── dto/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
├── app.js
└── server.js
```

Responsabilidades:

- Routes: definen los endpoints y sus middlewares.
- Controllers: coordinan la solicitud y la respuesta HTTP.
- Services: contienen la lógica de negocio.
- Repositories: conectan los services con los DAO.
- DAO: realizan las operaciones de base de datos.
- Models: definen los documentos de MongoDB.
- DTO: seleccionan los campos que se devuelven en las respuestas.
- Middlewares: manejan autenticación, autorización y errores.
- Config: configura MongoDB y Passport.
- Utils: contiene funciones de contraseñas, JWT y clases de errores.

El flujo principal es:

Route → Controller → Service → Repository → DAO

Los modelos de Mongoose solo se importan en los DAO.

Passport utiliza el repository de usuarios para el registro y el login.

## Roles

| Rol | Permisos |
|---|---|
| user | Consultar eventos, inscribirse, consultar sus tickets y cancelarlos |
| organizer | Además, crear eventos, modificar sus propios eventos y consultar sus inscripciones |
| admin | Además, modificar eventos ajenos, consultar sus inscripciones, cancelar tickets ajenos y listar usuarios |

El registro público siempre asigna el rol `user`.

Enviar `role` en el body no permite crear un organizador o administrador.

## Crear usuarios de prueba

Registrar usuarios mediante:

```http
POST /api/sessions/register
```

Ejemplo:

```json
{
  "first_name": "Usuario",
  "last_name": "Prueba",
  "email": "usuario@example.com",
  "password": "Prueba123"
}
```

Para comprobar la recepción del correo, utilizar una dirección real a la que se tenga acceso.

Crear también usuarios con estos emails de ejemplo:

- organizador1@example.com
- organizador2@example.com
- admin@example.com

Todos se crearán inicialmente con rol `user`.

Para preparar las pruebas:

1. Abrir la base de datos en MongoDB Compass o Atlas.
2. Entrar en la colección `users`.
3. Buscar los usuarios por email.
4. Cambiar el rol de los dos organizadores a `organizer`.
5. Cambiar el rol del administrador a `admin`.
6. Conservar el usuario común con rol `user`.

Después de cambiar un rol, cerrar sesión e iniciar sesión nuevamente para obtener un JWT con el nuevo rol.

Este cambio manual se utiliza para preparar usuarios de prueba. No existe un endpoint público para asignar roles.

## Endpoints

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | /api/health | Público | Estado del servidor HTTP |
| GET | /api/sessions | Público | Estado de la ruta de sesiones |
| POST | /api/sessions/register | Público | Registro |
| POST | /api/sessions/login | Público | Login |
| GET | /api/sessions/current | Autenticado | Usuario actual |
| POST | /api/sessions/logout | Público | Elimina la cookie |
| GET | /api/users | admin | Lista usuarios |
| GET | /api/events | Público | Lista eventos con filtros y paginación |
| GET | /api/events/:id | Público | Consulta un evento |
| POST | /api/events | organizer/admin | Crea un evento |
| PUT | /api/events/:id | organizer dueño/admin | Modifica un evento |
| PATCH | /api/events/:id/status | organizer dueño/admin | Cambia el estado |
| POST | /api/events/:eid/tickets | Autenticado | Crea una inscripción |
| GET | /api/tickets/my-tickets | Autenticado | Consulta tickets propios |
| GET | /api/events/:eid/tickets | organizer dueño/admin | Consulta inscripciones del evento |
| PATCH | /api/tickets/:tid/cancel | Dueño del ticket/admin | Cancela una inscripción |

La cancelación de eventos y tickets cambia su estado; no elimina los documentos.

## Autenticación

Passport implementa tres estrategias:

- register: valida el registro y guarda la contraseña hasheada con bcrypt.
- login: verifica el email y la contraseña.
- current: verifica el JWT de la cookie.

El controller de login genera el JWT y lo guarda en la cookie `currentUser`.

La cookie utiliza:

- httpOnly: true.
- sameSite: lax.
- Duración de una hora.
- secure: true en producción.

El JWT contiene solamente `id`, `email` y `role`.

Ninguna respuesta devuelve la contraseña ni su hash.

### Registro

```http
POST /api/sessions/register
```

```json
{
  "first_name": "Ana",
  "last_name": "Perez",
  "email": "ana@example.com",
  "password": "Prueba123"
}
```

Resultado esperado: `201`.

El email se normaliza y no puede repetirse. La contraseña debe tener al menos ocho caracteres.

### Login

```http
POST /api/sessions/login
```

```json
{
  "email": "ana@example.com",
  "password": "Prueba123"
}
```

Resultado esperado: `200` y creación de la cookie.

En Postman, mantener habilitado el manejo de cookies y utilizar siempre el mismo host.

### Usuario actual

```http
GET /api/sessions/current
```

Resultado esperado: `200` con los datos del JWT.

Sin cookie válida, devuelve `401`.

### Logout

```http
POST /api/sessions/logout
```

Elimina la cookie. Una consulta posterior a `/current` devuelve `401`.

## Eventos

El modelo contiene:

- title
- description
- category
- date
- location
- capacity
- price
- status
- organizer: referencia a User

Estados disponibles:

- draft
- published
- cancelled
- finished

### Crear evento

Iniciar sesión como organizer o admin.

```http
POST /api/events
```

```json
{
  "title": "Congreso Tech",
  "description": "Encuentro sobre desarrollo de software",
  "category": "tecnologia",
  "date": "2030-12-01T18:00:00.000Z",
  "location": "Montevideo",
  "capacity": 2,
  "price": 0,
  "status": "published"
}
```

Utilizar siempre una fecha futura al momento de probar.

El organizador se obtiene del usuario autenticado.

Validaciones principales:

- Textos obligatorios no vacíos.
- Fecha futura al crear o cambiar la fecha.
- Capacidad entera mayor que cero.
- Precio mayor o igual que cero.
- Estado válido.
- Los eventos cancelados no pueden modificarse.
- Solo el dueño o un administrador pueden modificar el evento.

### Modificar evento

```http
PUT /api/events/ID_EVENTO
```

```json
{
  "title": "Congreso Tech actualizado",
  "capacity": 3
}
```

### Cambiar estado

```http
PATCH /api/events/ID_EVENTO/status
```

```json
{
  "status": "cancelled"
}
```

No se puede publicar un evento finalizado ni cambiar el estado de uno cancelado.

### Filtros y paginación

```http
GET /api/events?status=published&page=2&limit=5
```

Filtros disponibles:

- status
- category
- location
- dateFrom
- dateTo

Ordenamiento mediante `sort`:

- date
- title
- price
- capacity
- createdAt

Agregar `-` para ordenar de forma descendente, por ejemplo `sort=-date`.

Ejemplo:

```http
GET /api/events?category=tecnologia&location=Montevideo&sort=-date&page=1&limit=5
```

Respuesta de ejemplo:

```json
{
  "status": "success",
  "data": [],
  "page": 2,
  "limit": 5,
  "total": 0,
  "totalPages": 0
}
```

## Tickets e inscripciones

El modelo contiene referencias a `user` y `event`, además de:

- status
- quantity
- reservationCode
- createdAt
- cancelledAt

Estados:

- confirmed
- pending
- cancelled

Los tickets `confirmed` y `pending` ocupan cupo. Los tickets `cancelled` no ocupan cupo.

El cupo ocupado se calcula sumando las cantidades de los tickets activos.

### Inscribirse

Iniciar sesión como usuario.

```http
POST /api/events/ID_EVENTO/tickets
```

```json
{
  "quantity": 1
}
```

Se valida:

- Evento existente, publicado y con fecha futura.
- Cantidad entera mayor que cero.
- Cupo suficiente.
- Ausencia de otra inscripción activa del mismo usuario al evento.

Respuesta de ejemplo:

```json
{
  "status": "success",
  "message": "Inscripción realizada y correo de confirmación enviado",
  "emailSent": true,
  "payload": {
    "id": "ID_TICKET",
    "user": "ID_USUARIO",
    "event": "ID_EVENTO",
    "quantity": 1,
    "status": "confirmed",
    "reservationCode": "CODIGO_GENERADO",
    "createdAt": "2030-01-01T12:00:00.000Z",
    "cancelledAt": null
  }
}
```

El código de reserva se genera con `randomUUID`.

Una inscripción duplicada o sin cupo devuelve `409`.

### Consultar tickets propios

```http
GET /api/tickets/my-tickets
```

Incluye datos básicos del evento mediante populate: título, fecha y ubicación.

### Consultar inscripciones del evento

```http
GET /api/events/ID_EVENTO/tickets
```

Solo el organizador dueño o un administrador pueden consultar esta lista.

Incluye nombre, apellido y email del usuario mediante populate.

### Cancelar ticket

```http
PATCH /api/tickets/ID_TICKET/cancel
```

Solo el dueño del ticket o un administrador pueden cancelarlo.

El ticket cambia a `cancelled` y se registra `cancelledAt`.

El cupo queda disponible para nuevas inscripciones. Cancelar nuevamente el mismo ticket devuelve `409`.

## Correo de confirmación

Nodemailer envía un correo con:

- Nombre del evento.
- Fecha.
- Lugar.
- Cantidad reservada.
- Código de reserva.

Si el servidor SMTP acepta el envío, la API responde con `emailSent: true`.

Si el envío falla, la inscripción permanece guardada y la API responde `201` con `emailSent: false` y un mensaje que informa el problema.

No se implementan reintentos automáticos. Para verificar la entrega del correo, revisar la bandeja de entrada o spam.

## Errores

Los errores se manejan mediante un middleware centralizado.

| Código | Uso |
|---|---|
| 400 | Datos, ID o JSON inválidos |
| 401 | Usuario no autenticado o credenciales incorrectas |
| 403 | Usuario sin permiso |
| 404 | Evento, ticket o ruta inexistente |
| 409 | Inscripción duplicada, falta de cupo o datos únicos duplicados |
| 500 | Error interno del servidor |

Formato:

```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

## Flujo completo para verificar

Realizar las pruebas con Postman:

1. Registrar un usuario, iniciar sesión y consultar `/current`.
2. Cerrar sesión y comprobar que `/current` devuelve `401`.
3. Iniciar sesión como user e intentar crear un evento: debe devolver `403`.
4. Iniciar sesión como organizer y crear un evento publicado con capacidad 2.
5. Iniciar sesión como user e inscribirse con cantidad 2.
6. Verificar la recepción del correo y consultar el ticket en `my-tickets`.
7. Repetir la inscripción con el mismo usuario: debe devolver `409` por duplicado.
8. Intentar inscribir otro usuario: debe devolver `409` por falta de cupo.
9. Cancelar el ticket original y comprobar que una nueva inscripción funciona.
10. Intentar modificar el evento con otro organizer: debe devolver `403`.
11. Modificar el evento con admin: debe devolver `200`.
12. Revisar que ninguna respuesta de usuario, evento o ticket contenga password.
13. Consultar `/api/events?status=published&page=2&limit=5` y verificar la estructura paginada.
14. Cancelar un evento e intentar modificarlo: debe devolver `400`.

Estas instrucciones describen las pruebas a realizar; no son un reporte automático de resultados.

## Autor

Odilen González Lobelles