# Respaldo y restauracion

Un respaldo completo del portal requiere mas que la base de datos. Los
documentos y archivos fisicos viven en carpetas de almacenamiento y deben
guardarse junto con MySQL.

## Componentes que se deben respaldar

1. Base de datos MySQL.
2. `backend/storage/documents/`.
3. `backend/storage/organigrama/`.
4. Variables de entorno guardadas de forma segura fuera del repositorio.

La base de datos sola no recupera los documentos fisicos ni la imagen del
organigrama.

## Respaldo de MySQL

Ejemplo general con `mysqldump`:

```bash
mysqldump -h HOST -u USUARIO -p BASE_DATOS > chalma_respaldo.sql
```

Recomendaciones:

1. Ejecutar el comando desde una terminal segura.
2. No escribir la contrasena en el comando.
3. Guardar el archivo `.sql` en una ubicacion protegida.
4. Fecha sugerida para nombrar respaldos: `chalma_YYYY-MM-DD.sql`.

## Restauracion de MySQL

Ejemplo general:

```bash
mysql -h HOST -u USUARIO -p BASE_DATOS < chalma_respaldo.sql
```

Antes de restaurar:

1. Confirmar que se esta usando la base correcta.
2. Respaldar el estado actual si existe informacion nueva.
3. Revisar que el archivo `.sql` corresponda al portal correcto.

## Alternativa con phpMyAdmin

Para respaldar:

1. Entrar a phpMyAdmin.
2. Seleccionar la base de datos.
3. Usar **Exportar**.
4. Elegir SQL.
5. Descargar el archivo y guardarlo de forma segura.

Para restaurar:

1. Entrar a phpMyAdmin.
2. Seleccionar la base de datos destino.
3. Usar **Importar**.
4. Cargar el archivo `.sql`.
5. Verificar tablas y registros.

## Respaldo de documentos

Comprimir la carpeta:

```bash
tar -czf chalma_documents_YYYY-MM-DD.tar.gz backend/storage/documents/
```

En cPanel tambien puede usarse el administrador de archivos para comprimir y
descargar la carpeta `backend/storage/documents/`.

## Respaldo de organigrama

Comprimir la carpeta:

```bash
tar -czf chalma_organigrama_YYYY-MM-DD.tar.gz backend/storage/organigrama/
```

## Restauracion de archivos

1. Subir los respaldos comprimidos al servidor.
2. Extraer `documents/` en `backend/storage/documents/`.
3. Extraer `organigrama/` en `backend/storage/organigrama/`.
4. Verificar permisos de lectura y escritura.
5. Reiniciar la aplicacion Node.js si el hosting lo requiere.

## Variables de entorno

Guardar una copia segura de las variables de produccion:

1. Fuera del repositorio.
2. En un gestor de contrasenas o almacenamiento institucional protegido.
3. Sin compartir por correo o mensajes no seguros.

No guardar respaldos de `.env` dentro de Git.

## Frecuencia sugerida

1. Base de datos: diaria o antes de publicar cambios importantes.
2. Documentos y organigrama: despues de cada carga administrativa relevante.
3. Variables de entorno: cada vez que cambien secretos, dominios o credenciales.

## Verificacion del respaldo

1. Confirmar que el `.sql` no este vacio.
2. Confirmar que los comprimidos contienen archivos esperados.
3. Confirmar que documentos y organigrama se respaldaron junto con la base.
4. Guardar al menos una copia fuera del servidor principal.
