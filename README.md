# Portal Municipal de Chalma

## Descripcion

Portal municipal administrable enfocado en gobierno, tramites, contacto y transparencia.

Noticias, Difusion, Galeria y Videos no forman parte de la version actual.

## Tecnologias

Frontend:

- React
- Vite
- TypeScript
- React Router
- Axios

Backend:

- Node.js
- Express
- JavaScript
- Sequelize
- MySQL/MariaDB

Despliegue previsto:

- cPanel
- Setup Node.js App
- MySQL/MariaDB de cPanel

## Estructura

- `frontend/`: aplicacion publica en React con Vite y TypeScript.
- `backend/`: API en Node.js y Express para el portal municipal.
- `sitio-html-original/`: copia de referencia del sitio HTML original.

## Requisitos

- Node.js 22 o compatible.
- npm.
- MySQL o MariaDB.

## Instalacion

Frontend:

```cmd
cd frontend
npm install
copy .env.example .env
npm run dev
```

Backend:

```cmd
cd backend
npm install
copy .env.example .env
npm run dev
```

`copy` corresponde a CMD de Windows. En PowerShell se puede usar:

```powershell
Copy-Item .env.example .env
```

## URLs locales

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health: http://localhost:3000/api/health

## Crear base de datos

```sql
CREATE DATABASE chalma_portal
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

## Sembrar categorias iniciales

```powershell
cd backend
node src/database/sembrarTransparencia.js
```

Primero debe existir la base de datos y las credenciales deben configurarse en `backend/.env`.

El seed es idempotente y no crea documentos oficiales ficticios.

## Endpoints publicos

- `GET /api/health`
- `GET /api/transparencia/secciones`
- `GET /api/transparencia/secciones/:slug`
- `GET /api/transparencia/categorias/:slug`
- `GET /api/transparencia/categorias/:slug/documentos`

## Variables de entorno

Copiar `.env.example` como `.env` en cada aplicacion antes de ejecutar el proyecto.

Nunca subir archivos `.env` reales. Nunca colocar secretos del backend en variables `VITE_`.

Los archivos `.env.example` si deben subirse al repositorio.

## Estado actual

Actualmente existen:

- portal publico;
- navegacion;
- buscador;
- alto contraste;
- explorador visual de transparencia;
- modelos y API publica;
- seed inicial.

Pendiente:

- autenticacion administrativa;
- gestion de categorias;
- carga de documentos;
- conexion del frontend con la API;
- despliegue en cPanel.
