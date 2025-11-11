
# Prueba Técnica - ToDo App

Este repositorio contiene una aplicación de ejemplo (ToDo) dividida en dos proyectos:

- `backend/` - API REST con Node.js, Express y TypeScript.
- `frontend/` - SPA construida con React, Vite y TypeScript.

El objetivo es mostrar una aplicación completa con autenticación, persistencia en MongoDB y una interfaz moderna.

## Contenido

- `backend/` — API: controladores, modelos (Mongoose), middleware, validaciones (zod) y utilidades (JWT, hashing).
- `frontend/` — Cliente: React + Vite, TypeScript, MobX para estado, hooks, servicios con Axios y componentes reutilizables.

## Requisitos previos

- Node.js (>= 18) y npm o pnpm instalados.
- MongoDB accesible (puede ser local o servicio en la nube).

Recomendado usar pnpm si dispone del lockfile `pnpm-lock.yaml`, pero los comandos de npm equivalentes también funcionan.

## Variables de entorno (backend)

El backend carga variables desde un archivo `.env` en su carpeta raíz (`backend/.env`) o desde el entorno. Las variables necesarias son:

- `MONGODB_URI` — URI base de conexión (ej. `mongodb://host:port`).
- `MONGODB_USERNAME` — usuario de la base de datos (si aplica).
- `MONGODB_PASSWORD` — contraseña de la base de datos (si aplica).
- `MONGODB_DATABASE` — nombre de la base de datos.
- `BCRYPT_SALT_ROUNDS` — número de rondas para bcrypt (ej. `10`).
- `JWT_SECRET` — clave secreta para firmar tokens JWT.

Ejemplo mínimo de `backend/.env`:

MONGODB_URI=mongodb://localhost:27017
MONGODB_USERNAME=
MONGODB_PASSWORD=
MONGODB_DATABASE=todoapp
BCRYPT_SALT_ROUNDS=10
JWT_SECRET=tu_secreto_largo_aqui

> Nota: Ajuste las variables según su entorno y políticas de seguridad. Nunca suba `.env` a repositorios públicos.

## Instalación y ejecución (Windows - PowerShell)

Se muestran comandos para PowerShell. Adapte `pnpm` → `npm` si no usa pnpm.

1) Instalar dependencias de backend:

```powershell
cd backend
pnpm install
```

2) Instalar dependencias de frontend:

```powershell
cd ../frontend
pnpm install
```

3) Ejecutar en modo desarrollo (lado a lado)

Abra dos terminales/pestañas PowerShell.

Terminal A — Backend (modo desarrollo con hot-reload):

```powershell
cd backend
pnpm dev
```

Terminal B — Frontend (Vite dev server):

```powershell
cd frontend
pnpm dev
```

El frontend normalmente usa `http://localhost:5173` y el backend `http://localhost:3000` (confirmar en la salida de los servidores).

4) Compilar para producción

- Backend:

```powershell
cd backend
pnpm build
pnpm start
```

- Frontend:

```powershell
cd frontend
pnpm build
pnpm preview
```

## Estructura y patrones aplicados

Resumen de decisiones arquitectónicas y técnicas usadas en el proyecto:

- Separación por capas (backend):
	- `models/` — modelos de datos con Mongoose.
	- `controllers/` — lógica de manejo de peticiones HTTP.
	- `routes/` — definición de rutas y asociación con controladores.
	- `middleware/` — cross-cutting concerns (CORS, autenticación, logging, validación).
	- `lib/` — utilidades compartidas (respuestas estándar, JWT, hashing de contraseñas).

- Validación y seguridad:
	- Uso de `zod` para validaciones de payload/DTOs en el backend (entrada segura, errores claros).
	- Autenticación basada en JWT y guardada/gestionada por `lib/jwt.ts`.
	- Hashing de contraseñas con `bcryptjs` y configuración de salt rounds por variable de entorno.

- Organización del código:
	- TypeScript en ambos proyectos para tipado fuerte y mayor mantenibilidad.
	- Scripts de build y alias de paths en el backend (`tsc` + `tsc-alias`) para resolver imports.

- Frontend:
	- Vite + React + TypeScript para desarrollo rápido y experiencia DX moderna.
	- MobX para gestión de estado (ver `stores/`), lo que facilita reactividad y escalado simple.
	- Hooks personalizados (`hooks/`) para encapsular lógica de consumo de API y reutilizarla en componentes.
	- Servicios con `axios` en `services/` para separar llamadas HTTP de la UI.
	- Componentes UI reutilizables y accesibles (Radix primitives, TailwindCSS para estilos utilitarios).

- Buenas prácticas generales:
	- Respuestas API centralizadas (`lib/apiResponses.ts`) para consistencia en el cliente.
	- Middlewares para responsabilidades transversales (autenticación, logging, validación), evitando lógica repetida.
	- Uso de variables de entorno para secretos y configuraciones dependientes del entorno.

## Pruebas unitarias

En ambos proyectos, para correr las pruebas unitarias usar `pnpm run test`

## Docker

Para desplegar la aplicacion en docker usando docker compose, use el comando `docker-compose up -d`

Una vez levantado todo el ambiente de docker, se puede conectar a la base de datos con los siguientes datos
```
MONGODB_URI: mongodb://admin:admin123@mongodb:27017
MONGODB_USERNAME: admin
MONGODB_PASSWORD: admin123
MONGODB_DATABASE: todoapp
```
