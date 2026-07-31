import "dotenv/config";
import { pathToFileURL } from "node:url";

let servidor;
let baseDatos;
let cierreEnProceso = false;

async function cargarDependenciasServidor() {
  const [
    moduloApp,
    moduloBaseDatos,
    moduloConfiguracionEntorno,
    moduloAlmacenamiento,
  ] = await Promise.all([
    import("./app.js"),
    import("./config/baseDatos.js"),
    import("./config/configuracionEntorno.js"),
    import("./config/verificarAlmacenamiento.js"),
  ]);

  baseDatos = moduloBaseDatos.default;

  return {
    app: moduloApp.default,
    verificarConexionBaseDatos:
      moduloBaseDatos.verificarConexionBaseDatos,
    configuracionEntorno:
      moduloConfiguracionEntorno.configuracionEntorno,
    verificarAlmacenamiento:
      moduloAlmacenamiento.verificarAlmacenamiento,
  };
}

async function cerrarBaseDatos() {
  if (!baseDatos) {
    return;
  }

  try {
    await baseDatos.close();
  } catch {
    console.error("No fue posible cerrar la conexion de base de datos.");
  }
}

async function cerrarServidor(senal) {
  if (cierreEnProceso) {
    return;
  }

  cierreEnProceso = true;
  console.log(`Cerrando API de Chalma por ${senal}.`);

  if (!servidor) {
    await cerrarBaseDatos();
    process.exit(0);
  }

  servidor.close(async () => {
    await cerrarBaseDatos();
    process.exit(0);
  });
}

export async function iniciarServidor() {
  try {
    const {
      app,
      verificarConexionBaseDatos,
      configuracionEntorno,
      verificarAlmacenamiento,
    } = await cargarDependenciasServidor();

    await verificarConexionBaseDatos();
    await verificarAlmacenamiento();

    servidor = app.listen(configuracionEntorno.puerto, () => {
      console.log(
        `API de Chalma ejecutandose en http://localhost:${configuracionEntorno.puerto}`
      );
      console.log(
        `Comprobacion: http://localhost:${configuracionEntorno.puerto}/api/health`
      );
    });

    servidor.on("error", (error) => {
      console.error(
        "No fue posible iniciar el servidor:",
        error instanceof Error ? error.message : "Error desconocido"
      );
      process.exit(1);
    });

    return servidor;
  } catch (error) {
    console.error(
      "No fue posible iniciar la API:",
      error instanceof Error ? error.message : "Error desconocido"
    );
    await cerrarBaseDatos();
    process.exit(1);
  }
}

const esEjecucionDirecta = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (esEjecucionDirecta) {
  process.once("SIGTERM", () => {
    void cerrarServidor("SIGTERM");
  });

  process.once("SIGINT", () => {
    void cerrarServidor("SIGINT");
  });

  process.once("unhandledRejection", (error) => {
    console.error(
      "Promesa rechazada sin manejar:",
      error instanceof Error ? error.message : "Error desconocido"
    );

    void cerrarServidor("unhandledRejection");
  });

  await iniciarServidor();
}
