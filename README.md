# Portal Municipal de Chalma

Portal web municipal administrable para Chalma, Veracruz. El proyecto contiene
frontend React y backend Express con MySQL, preparado para una futura puesta en
produccion mediante cPanel.

## Estado actual

Actualmente existen:

- Frontend React con Vite y TypeScript.
- Backend Express con JavaScript ES Modules.
- Conexion a MySQL mediante Sequelize.
- Autenticacion administrativa con cookie httpOnly.
- Cambio de contrasena administrativa.
- Categorias y documentos de Transparencia.
- Contacto administrable.
- Directorio administrable.
- Organigrama administrable.
- Mapa fijo en la pagina publica de Contacto.
- Buscador publico, contraste y navegacion publica.
- Tramites y servicios temporalmente desactivado desde configuracion.
- Preparacion tecnica para produccion/cPanel.

No forman parte de la version actual:

- Noticias.
- Difusion.
- Galeria.
- Videos.

## Documentacion operativa

- [Despliegue en cPanel](DESPLIEGUE_CPANEL.md)
- [Respaldo y restauracion](RESPALDO_RESTAURACION.md)

## Tecnologias

Frontend:

- React.
- Vite.
- TypeScript.
- React Router.
- Axios.

Backend:

- Node.js.
- Express.
- JavaScript ES Modules.
- Sequelize.
- MySQL/MariaDB.
- Helmet.
- CORS.
- Cookies httpOnly.
- Zod.

Despliegue previsto:

- cPanel.
- Setup Node.js App.
- MySQL/MariaDB de cPanel.
- SSL activo.

## Estructura

- `frontend/`: aplicacion publica y panel administrativo en React.
- `backend/`: API en Node.js y Express.
- `backend/storage/documents/`: documentos cargados desde administracion.
- `backend/storage/organigrama/`: archivo de organigrama cargado desde administracion.
- `sitio-html-original/`: copia de referencia del sitio HTML original.

## Variables de entorno

Copiar los archivos de ejemplo solo en el entorno correspondiente:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Nunca subir archivos `.env` reales. Nunca colocar secretos del backend en
variables `VITE_`.

El backend valida de forma centralizada variables como:

- `NODE_ENV`
- `PORT`
- `FRONTEND_URL`
- `CORS_ORIGINS`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `COOKIE_NAME`
- `COOKIE_SECURE`
- `COOKIE_SAME_SITE`
- `COOKIE_DOMAIN`
- `TRUST_PROXY`
- `MAX_FILE_SIZE_MB`

## Desarrollo local

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Backend:

```powershell
cd backend
npm install
npm run dev
```

URLs locales habituales:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Health: `http://localhost:3000/api/health`

## Base de datos

Ejemplo local:

```sql
CREATE DATABASE chalma_portal
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Para preparar una base nueva de produccion sin `force` ni `alter`:

```powershell
cd backend
node src/scripts/instalarBaseDatos.js
```

El instalador crea unicamente tablas faltantes, verifica ajustes idempotentes y
crea configuraciones unicas cuando no existan. No crea obligaciones, categorias,
documentos, directorio ni contenido municipal ficticio.

## Administrador inicial

Para produccion, crear el primer administrador con variables temporales:

```bash
ADMIN_NOMBRE="Administrador" \
ADMIN_USUARIO="admin_chalma" \
ADMIN_CONTRASENA="REEMPLAZAR_CON_CONTRASENA_SEGURA" \
node src/scripts/crearAdministradorInicial.js
```

Despues de ejecutarlo deben eliminarse las variables `ADMIN_*` del entorno. El
script no imprime la contrasena ni el hash.

## Endpoints publicos principales

- `GET /api/health`
- `GET /api/transparencia/secciones`
- `GET /api/transparencia/secciones/:slug`
- `GET /api/transparencia/categorias/:slug`
- `GET /api/transparencia/categorias/:slug/documentos`
- `GET /api/contacto`
- `GET /api/directorio`
- `GET /api/organigrama`

## Validaciones utiles

Backend:

```powershell
Get-ChildItem backend/src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

Frontend:

```powershell
cd frontend
npm run build
```

## Seguridad

- Las cookies administrativas usan `httpOnly`.
- En produccion `COOKIE_SECURE` debe ser `true`.
- CORS acepta solo origenes configurados.
- Helmet mantiene CSP y permite iframes de Google Maps desde dominios definidos.
- El health check no expone credenciales ni rutas fisicas.
- Las carpetas de storage ignoran archivos cargados y solo rastrean `.gitkeep`.
