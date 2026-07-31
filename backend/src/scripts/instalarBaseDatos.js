import "dotenv/config";
import { DataTypes } from "sequelize";
import { pathToFileURL } from "node:url";
import { verificarAlmacenamiento } from "../config/verificarAlmacenamiento.js";
import {
  baseDatos,
  ConfiguracionContacto,
  ConfiguracionOrganigrama,
} from "../models/index.js";

async function agregarColumnaSiFalta(tabla, columna, definicion) {
  const queryInterface = baseDatos.getQueryInterface();
  const descripcionTabla = await queryInterface.describeTable(tabla);

  if (descripcionTabla[columna]) {
    return false;
  }

  await queryInterface.addColumn(tabla, columna, definicion);
  return true;
}

async function verificarAjustesIdempotentes() {
  await agregarColumnaSiFalta("usuarios_administradores", "version_sesion", {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  });
}

async function verificarConfiguracionesUnicas() {
  await ConfiguracionContacto.findOrCreate({
    where: { id: 1 },
    defaults: {
      id: 1,
      telefono: null,
      correo: null,
      mostrarTelefono: false,
      mostrarCorreo: false,
    },
  });

  await ConfiguracionOrganigrama.findOrCreate({
    where: { id: 1 },
    defaults: {
      id: 1,
      titulo: null,
      descripcion: null,
      nombreOriginal: null,
      nombreAlmacenado: null,
      tipoMime: null,
      tamanoBytes: null,
      mostrarOrganigrama: false,
    },
  });
}

export async function instalarBaseDatos() {
  await baseDatos.authenticate();
  console.log("Conexion con MySQL verificada.");

  await verificarAlmacenamiento();
  console.log("Carpetas de almacenamiento verificadas.");

  await baseDatos.sync();
  console.log("Tablas verificadas sin force ni alter.");

  await verificarAjustesIdempotentes();
  console.log("Ajustes idempotentes verificados.");

  await verificarConfiguracionesUnicas();
  console.log("Configuraciones unicas verificadas.");

  console.log("Instalacion completada.");
}

const esEjecucionDirecta = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (esEjecucionDirecta) {
  try {
    await instalarBaseDatos();
  } catch {
    console.error(
      "No fue posible instalar la base de datos. Revisa la configuracion del entorno y la conexion MySQL."
    );
    process.exitCode = 1;
  } finally {
    await baseDatos.close();
  }
}
