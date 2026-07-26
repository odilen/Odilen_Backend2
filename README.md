# Backend - Ejemplo Base

Proyecto backend desarrollado con Node.js, Express y MongoDB. Este proyecto sirve como ejemplo base para el curso de Backend II, implementando una arquitectura modular con rutas, controladores, modelos y middlewares.

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución JavaScript
- **Express** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **dotenv** - Gestión de variables de entorno
- **nodemon** - Herramienta de desarrollo para reiniciar automáticamente el servidor

## Instalación

1. Clonar el repositorio
2. Instalar las dependencias:

```bash
npm install
```

## Configuración

1. Copiar el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

2. Configurar las variables de entorno en el archivo `.env`:

```
PORT=8080
MONGO_URL=tu_url_de_mongodb
```

## Uso

### Modo Desarrollo

Para iniciar el servidor en modo desarrollo con reinicio automático:

```bash
npm run dev
```

El servidor se iniciará en el puerto 8080 (o el puerto configurado en `.env`).

## Estructura del Proyecto

```
.
├── src/
│   ├── config/         # Configuraciones (conexión a BD)
│   ├── controllers/    # Lógica de negocio de las rutas
│   ├── midlewares/     # Middlewares personalizados
│   ├── models/         # Modelos de Mongoose
│   ├── routes/         # Definición de rutas de la API
│   └── utils/          # Utilidades y funciones auxiliares
├── .env                # Variables de entorno (no versionado)
├── .env.example        # Ejemplo de variables de entorno
├── .gitignore          # Archivos ignorados por Git
├── app.js              # Punto de entrada de la aplicación
├── package.json        # Dependencias y scripts
└── README.md           # Documentación del proyecto
```

## Endpoints Disponibles

### Eventos

- `GET /api/events` - Obtener todos los eventos
- `POST /api/events` - Crear un nuevo evento

## Notas

- Las rutas para usuarios, sesiones y tickets están comentadas en `app.js` y pueden ser activadas según se necesite
- El proyecto utiliza módulos ES (`type: "module"` en package.json)
- La conexión a MongoDB se establece automáticamente al iniciar el servidor