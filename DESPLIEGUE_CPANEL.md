# Despliegue en cPanel

Esta guia prepara el portal municipal de Chalma para un despliegue futuro en
cPanel. No incluye credenciales reales y debe adaptarse con los datos del
hosting.

## Marcadores

- `TU_DOMINIO`: dominio publico con SSL, por ejemplo `https://www.ejemplo.gob.mx`.
- `TU_BASE_DE_DATOS`: nombre de la base creada en cPanel.
- `TU_USUARIO_MYSQL`: usuario MySQL asignado a la base.
- `TU_APPLICATION_ROOT`: carpeta configurada como raiz de la app Node.js.

## 1. Requisitos del hosting

Confirmar que el plan de cPanel incluya:

1. Setup Node.js App.
2. MySQL Databases.
3. phpMyAdmin.
4. SSL activo para `TU_DOMINIO`.
5. Acceso a terminal o administrador de archivos.
6. Node.js compatible con el proyecto.
7. Capacidad para ejecutar comandos npm y scripts Node.js.

## 2. Base de datos

1. Entrar a **MySQL Databases**.
2. Crear `TU_BASE_DE_DATOS`.
3. Crear `TU_USUARIO_MYSQL` con una contrasena fuerte.
4. Asignar `ALL PRIVILEGES` de `TU_USUARIO_MYSQL` sobre `TU_BASE_DE_DATOS`.
5. Guardar las credenciales de forma segura fuera del repositorio.

## 3. Backend

1. Subir la carpeta `backend/` al hosting.
2. En **Setup Node.js App**, crear una nueva aplicacion Node.js.
3. Configurar **Application root** apuntando a `TU_APPLICATION_ROOT`.
4. Configurar **Startup file** como:

```text
src/server.js
```

5. Entrar a la terminal del entorno Node.js.
6. Instalar dependencias del backend:

```bash
npm install --omit=dev
```

7. Configurar variables de entorno en cPanel, no en Git:

```text
NODE_ENV=production
PORT=3000
FRONTEND_URL=TU_DOMINIO
CORS_ORIGINS=TU_DOMINIO
DB_HOST=localhost
DB_PORT=3306
DB_NAME=TU_BASE_DE_DATOS
DB_USER=TU_USUARIO_MYSQL
DB_PASSWORD=REEMPLAZAR_EN_CPANEL
JWT_SECRET=REEMPLAZAR_POR_UN_SECRETO_LARGO_DE_32_O_MAS_CARACTERES
JWT_EXPIRES_IN=8h
COOKIE_NAME=chalma_admin_sesion
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
COOKIE_DOMAIN=
TRUST_PROXY=true
MAX_FILE_SIZE_MB=20
```

8. Ejecutar el instalador idempotente de base de datos:

```bash
node src/scripts/instalarBaseDatos.js
```

9. Crear el administrador inicial con variables temporales:

```bash
ADMIN_NOMBRE="Administrador" \
ADMIN_USUARIO="admin_chalma" \
ADMIN_CONTRASENA="REEMPLAZAR_CON_CONTRASENA_SEGURA" \
node src/scripts/crearAdministradorInicial.js
```

10. Eliminar inmediatamente las variables `ADMIN_*` del entorno o de la
    terminal usada.
11. Reiniciar la aplicacion Node.js desde cPanel.

## 4. Frontend

1. En local o en un entorno de build, crear `frontend/.env` con:

```text
VITE_API_URL=TU_DOMINIO/api
VITE_URL_PUBLICA_API=
```

2. Compilar:

```bash
cd frontend
npm install
npm run build
```

3. Subir el contenido de `frontend/dist/` al directorio publico del dominio.
4. Confirmar que `frontend/dist/.htaccess` exista.
5. El `.htaccess` conserva archivos reales, conserva carpetas reales, excluye
   `/api` y reescribe las demas rutas a `index.html` para React Router.

## 5. Dominio, HTTPS, CORS y cookies

1. Activar SSL para `TU_DOMINIO`.
2. Configurar `FRONTEND_URL=TU_DOMINIO`.
3. Configurar `CORS_ORIGINS=TU_DOMINIO`.
4. Mantener `COOKIE_SECURE=true` en produccion.
5. Mantener `COOKIE_SAME_SITE=lax` salvo que se use un esquema entre dominios
   que requiera `none`; en ese caso `COOKIE_SECURE` tambien debe ser `true`.
6. Mantener `TRUST_PROXY=true` si cPanel ejecuta Node.js detras de proxy inverso.

## 6. Pruebas posteriores al despliegue

1. Reiniciar la aplicacion Node.js.
2. Probar health check:

```text
TU_DOMINIO/api/health
```

3. Confirmar respuesta con `estado: ok` y `baseDatos: conectada`.
4. Probar login en `/admin/login`.
5. Probar cambio de contrasena en `/admin/cuenta`.
6. Probar carga de documento de transparencia.
7. Probar descarga publica de documento.
8. Probar carga de organigrama.
9. Probar visualizacion del mapa en `/contacto`.
10. Probar recarga directa de rutas:
    - `/contacto`
    - `/gobierno/directorio`
    - `/gobierno/organigrama`
    - `/transparencia`
    - `/transparencia/apartado/SLUG`
    - `/admin/login`
    - `/admin/contacto`
    - `/admin/directorio`
    - `/admin/organigrama`
    - `/admin/cuenta`
11. Revisar logs de Node.js en cPanel.
12. Verificar que no se hayan subido archivos `.env`.
13. Verificar que no se hayan subido documentos u organigramas reales fuera de
    `backend/storage/`.

## 7. Orden resumido

1. Comprobar herramientas del hosting.
2. Crear base de datos.
3. Crear usuario MySQL.
4. Asignar `ALL PRIVILEGES`.
5. Subir backend.
6. Crear aplicacion Node.js.
7. Configurar Application root.
8. Configurar Startup file.
9. Instalar dependencias.
10. Agregar variables de entorno.
11. Ejecutar instalacion de base de datos.
12. Crear administrador inicial.
13. Eliminar variables `ADMIN_*`.
14. Compilar frontend.
15. Subir `frontend/dist/`.
16. Configurar `.htaccess`.
17. Configurar dominio y HTTPS.
18. Configurar CORS y cookies.
19. Reiniciar aplicacion.
20. Probar health check.
21. Probar login.
22. Probar cambio de contrasena.
23. Probar carga de documento.
24. Probar descarga.
25. Probar carga de organigrama.
26. Probar mapa.
27. Probar recarga de rutas.
28. Revisar logs.
29. Verificar que no se suban `.env`.
30. Guardar respaldo inicial.
